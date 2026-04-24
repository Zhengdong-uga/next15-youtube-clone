import "server-only";

import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

export const getAdminPassword = () => {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error("ADMIN_PASSWORD is not set in environment variables.");
  }
  return pw;
};

export const getOwnerUserId = () => {
  const id = process.env.OWNER_USER_ID;
  if (!id) {
    throw new Error("OWNER_USER_ID is not set in environment variables.");
  }
  return id;
};

/**
 * Checks whether the current request has a valid admin cookie.
 * Returns the owner's user UUID if authenticated, null otherwise.
 */
export const getCurrentAdminUserId = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  try {
    if (token !== getAdminPassword()) return null;
    return getOwnerUserId();
  } catch {
    return null;
  }
};

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
