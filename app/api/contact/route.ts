import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTableExists } from "@/lib/db";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth";
import {
  CONTACT_CONTENT_KEY,
  defaultContactContent,
  parseContactContent,
} from "@/lib/pageContent";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

// GET: the /contact copy (built-in text until something is saved)
export async function GET() {
  try {
    await ensureTableExists("site_settings");

    const [row] = await sql`
      SELECT value FROM site_settings WHERE key = ${CONTACT_CONTENT_KEY}
    `;

    const stored = (row as { value: string | null } | undefined)?.value;
    const content = stored ? parseContactContent(JSON.parse(stored)) : defaultContactContent();

    return NextResponse.json({ content }, { status: 200, headers: noStore });
  } catch (error) {
    console.error("❌ Error fetching contact content:", error);
    return NextResponse.json(
      { content: defaultContactContent() },
      { status: 200, headers: noStore }
    );
  }
}

// PUT: save the /contact copy (signed-in users only)
export async function PUT(req: NextRequest) {
  try {
    if (!readSessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const content = parseContactContent(body?.content);

    await ensureTableExists("site_settings");
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${CONTACT_CONTENT_KEY}, ${JSON.stringify(content)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json(
      { message: "Contact updated", content },
      { status: 200, headers: noStore }
    );
  } catch (err) {
    console.error("❌ Error in PUT /api/contact:", err);
    return NextResponse.json({ error: "Could not save the contact page" }, { status: 500 });
  }
}

// DELETE: back to the built-in copy (signed-in users only)
export async function DELETE(req: NextRequest) {
  try {
    if (!readSessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    await ensureTableExists("site_settings");
    await sql`DELETE FROM site_settings WHERE key = ${CONTACT_CONTENT_KEY}`;

    return NextResponse.json(
      { message: "Contact reset", content: defaultContactContent() },
      { status: 200, headers: noStore }
    );
  } catch (err) {
    console.error("❌ Error in DELETE /api/contact:", err);
    return NextResponse.json({ error: "Could not reset the contact page" }, { status: 500 });
  }
}
