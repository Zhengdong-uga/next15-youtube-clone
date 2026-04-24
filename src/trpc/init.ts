import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { getCurrentAdminUserId } from '@/lib/auth';
import { getOrCreateVisitorUserId, getVisitorUserId } from '@/lib/visitor';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson";
import { ratelimit } from '@/lib/ratelimit';

export const createTRPCContext = cache(async () => {
  const adminUserId = await getCurrentAdminUserId();
  // For read paths: use admin if present, otherwise the existing visitor (if any).
  // We don't auto-create visitors on every read to avoid polluting the users table.
  const visitorUserId = adminUserId ? null : await getVisitorUserId();
  const userId = adminUserId ?? visitorUserId;

  return { userId, adminUserId, isAdmin: Boolean(adminUserId) };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
/**
 * actorProcedure: allows either the admin or an anonymous visitor to act.
 * If the caller has no identity yet, a guest user row is created and a
 * `visitor_id` cookie is set on the response.
 */
export const actorProcedure = t.procedure.use(async function ensureActor(opts) {
  const { ctx } = opts;

  const actorUserId = ctx.adminUserId ?? (await getOrCreateVisitorUserId());

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, actorUserId))
    .limit(1);

  if (!user) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Actor user not found" });
  }

  const { success } = await ratelimit.limit(user.id);
  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: { ...ctx, user, userId: user.id },
  });
});

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.adminUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, ctx.adminUserId))
    .limit(1);

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { success } = await ratelimit.limit(user.id);

  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
