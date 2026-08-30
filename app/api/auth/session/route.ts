import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: who is signed in (null when nobody is)
export async function GET(req: NextRequest) {
  const user = readSessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  return NextResponse.json({ user }, { status: 200, headers: { "Cache-Control": "no-store" } });
}

// DELETE: sign out
export async function DELETE() {
  const response = NextResponse.json({ user: null }, { status: 200 });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
