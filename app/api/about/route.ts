import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTableExists } from "@/lib/db";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth";
import {
  ABOUT_CONTENT_KEY,
  defaultAboutContent,
  parseAboutContent,
} from "@/lib/pageContent";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

// GET: the /about copy (built-in text until something is saved)
export async function GET() {
  try {
    await ensureTableExists("site_settings");

    const [row] = await sql`
      SELECT value FROM site_settings WHERE key = ${ABOUT_CONTENT_KEY}
    `;

    const stored = (row as { value: string | null } | undefined)?.value;
    const content = stored ? parseAboutContent(JSON.parse(stored)) : defaultAboutContent();

    return NextResponse.json({ content }, { status: 200, headers: noStore });
  } catch (error) {
    console.error("❌ Error fetching about content:", error);
    return NextResponse.json({ content: defaultAboutContent() }, { status: 200, headers: noStore });
  }
}

// PUT: save the /about copy (signed-in users only)
export async function PUT(req: NextRequest) {
  try {
    if (!readSessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const content = parseAboutContent(body?.content);

    await ensureTableExists("site_settings");
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${ABOUT_CONTENT_KEY}, ${JSON.stringify(content)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ message: "About updated", content }, { status: 200, headers: noStore });
  } catch (err) {
    console.error("❌ Error in PUT /api/about:", err);
    return NextResponse.json({ error: "Could not save the about page" }, { status: 500 });
  }
}

// DELETE: back to the built-in copy (signed-in users only)
export async function DELETE(req: NextRequest) {
  try {
    if (!readSessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    await ensureTableExists("site_settings");
    await sql`DELETE FROM site_settings WHERE key = ${ABOUT_CONTENT_KEY}`;

    return NextResponse.json(
      { message: "About reset", content: defaultAboutContent() },
      { status: 200, headers: noStore }
    );
  } catch (err) {
    console.error("❌ Error in DELETE /api/about:", err);
    return NextResponse.json({ error: "Could not reset the about page" }, { status: 500 });
  }
}
