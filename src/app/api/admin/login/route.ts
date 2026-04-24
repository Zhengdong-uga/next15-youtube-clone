import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_COOKIE_NAME, getAdminPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    if (password !== getAdminPassword()) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
