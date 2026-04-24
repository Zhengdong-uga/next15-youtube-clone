import "server-only";

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

const VISITOR_COOKIE = "visitor_id";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const randomName = () => {
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `Visitor ${n}`;
};

const avatarFor = (seed: string) =>
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

/**
 * Get the current visitor's user id from the `visitor_id` cookie, if any.
 * Does not create a user row — safe for read paths.
 */
export const getVisitorUserId = async (): Promise<string | null> => {
  const jar = await cookies();
  const value = jar.get(VISITOR_COOKIE)?.value;
  if (!value || !UUID_RE.test(value)) return null;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, value))
    .limit(1);

  return existing?.id ?? null;
};

/**
 * Get the current visitor's user id, creating a guest row + cookie if needed.
 * Must only be called from route handlers / server actions (cookies() is mutable there).
 */
export const getOrCreateVisitorUserId = async (): Promise<string> => {
  const jar = await cookies();
  const existingId = jar.get(VISITOR_COOKIE)?.value;

  if (existingId && UUID_RE.test(existingId)) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, existingId))
      .limit(1);
    if (existing) return existing.id;
  }

  const name = randomName();
  const [created] = await db
    .insert(users)
    .values({ name, imageUrl: avatarFor(name) })
    .returning({ id: users.id });

  jar.set(VISITOR_COOKIE, created.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // 1 year
    maxAge: 60 * 60 * 24 * 365,
  });

  return created.id;
};
