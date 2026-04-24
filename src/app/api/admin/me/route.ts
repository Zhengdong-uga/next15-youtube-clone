import { NextResponse } from "next/server";

import { getCurrentAdminUserId } from "@/lib/auth";

// Used by the client to determine whether the current viewer is the admin/owner.
export async function GET() {
  const userId = await getCurrentAdminUserId();
  return NextResponse.json({ isAdmin: Boolean(userId), userId });
}
