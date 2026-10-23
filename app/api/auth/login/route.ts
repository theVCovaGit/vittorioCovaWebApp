import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionToken, verifyCredentials } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST: sign in with one of the two site accounts
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const user = await verifyCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
    }

    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // No maxAge: a session cookie, so nothing is persisted to disk
    });

    return response;
  } catch (err) {
    console.error("❌ Error in POST /api/auth/login:", err);
    return NextResponse.json({ error: "Could not sign in" }, { status: 500 });
  }
}
