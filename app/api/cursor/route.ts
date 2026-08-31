import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTableExists } from "@/lib/db";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth";
import { CURSOR_SETTING_KEY, MAX_CURSOR_SVG_BYTES, normalizeCursorSvg } from "@/lib/cursorSvg";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

// GET: the custom cursor markup, or null when the built-in one is in use
export async function GET() {
  try {
    await ensureTableExists("site_settings");

    const [row] = await sql`
      SELECT value FROM site_settings WHERE key = ${CURSOR_SETTING_KEY}
    `;

    const svg = (row as { value: string | null } | undefined)?.value || null;
    return NextResponse.json({ svg }, { status: 200, headers: noStore });
  } catch (error) {
    console.error("❌ Error fetching cursor:", error);
    // Fall back to the built-in cursor rather than breaking the page
    return NextResponse.json({ svg: null }, { status: 200, headers: noStore });
  }
}

// PUT: replace the site cursor (signed-in users only)
export async function PUT(req: NextRequest) {
  try {
    if (!readSessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { svg } = await req.json();

    if (typeof svg !== "string" || !svg.trim()) {
      return NextResponse.json({ error: "An SVG file is required" }, { status: 400 });
    }

    if (svg.length > MAX_CURSOR_SVG_BYTES) {
      return NextResponse.json({ error: "That SVG is too large (100 KB max)" }, { status: 400 });
    }

    const normalized = normalizeCursorSvg(svg);
    if (!normalized) {
      return NextResponse.json({ error: "That file is not a valid SVG" }, { status: 400 });
    }

    await ensureTableExists("site_settings");
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${CURSOR_SETTING_KEY}, ${normalized})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json(
      { message: "Cursor updated", svg: normalized },
      { status: 200, headers: noStore }
    );
  } catch (err) {
    console.error("❌ Error in PUT /api/cursor:", err);
    return NextResponse.json({ error: "Could not save the cursor" }, { status: 500 });
  }
}

// DELETE: back to the built-in cursor (signed-in users only)
export async function DELETE(req: NextRequest) {
  try {
    if (!readSessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    await ensureTableExists("site_settings");
    await sql`DELETE FROM site_settings WHERE key = ${CURSOR_SETTING_KEY}`;

    return NextResponse.json({ message: "Cursor reset", svg: null }, { status: 200, headers: noStore });
  } catch (err) {
    console.error("❌ Error in DELETE /api/cursor:", err);
    return NextResponse.json({ error: "Could not reset the cursor" }, { status: 500 });
  }
}
