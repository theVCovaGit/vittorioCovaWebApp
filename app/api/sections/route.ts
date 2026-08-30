import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTableExists } from "@/lib/db";
import { SECTION_KEYS, SectionKey, SectionSetting, isSectionKey } from "@/lib/sections";

export const dynamic = "force-dynamic";

interface SectionSettingRow {
  section: string;
  hidden: boolean | null;
  paused: boolean | null;
}

/** Every section always comes back, defaulting to visible + running when no row exists. */
const withDefaults = (rows: SectionSettingRow[]): SectionSetting[] =>
  SECTION_KEYS.map((section) => {
    const row = rows.find((r) => r.section === section);
    return {
      section,
      hidden: row?.hidden === true,
      paused: row?.paused === true,
    };
  });

// GET: Fetch visibility/pause settings for every section
export async function GET() {
  try {
    await ensureTableExists("section_settings");

    const rows = await sql`
      SELECT section, hidden, paused FROM section_settings
    `;

    return NextResponse.json(
      { sections: withDefaults(rows as SectionSettingRow[]) },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("❌ Error fetching section settings:", error);
    // Never break the site over settings: fall back to everything visible and running
    return NextResponse.json(
      { sections: withDefaults([]) },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}

// PUT: Update the hidden and/or paused flag of a single section
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, hidden, paused } = body;

    if (!isSectionKey(section)) {
      return NextResponse.json({ error: "Valid section is required" }, { status: 400 });
    }

    if (hidden === undefined && paused === undefined) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    if (
      (hidden !== undefined && typeof hidden !== "boolean") ||
      (paused !== undefined && typeof paused !== "boolean")
    ) {
      return NextResponse.json({ error: "hidden and paused must be booleans" }, { status: 400 });
    }

    await ensureTableExists("section_settings");

    const nextHidden = hidden === undefined ? null : hidden;
    const nextPaused = paused === undefined ? null : paused;

    const [row] = await sql`
      INSERT INTO section_settings (section, hidden, paused)
      VALUES (${section}, ${hidden ?? false}, ${paused ?? false})
      ON CONFLICT (section) DO UPDATE SET
        hidden = COALESCE(${nextHidden}::boolean, section_settings.hidden),
        paused = COALESCE(${nextPaused}::boolean, section_settings.paused),
        updated_at = CURRENT_TIMESTAMP
      RETURNING section, hidden, paused
    `;

    const updated = row as SectionSettingRow;

    return NextResponse.json(
      {
        message: "Section settings updated",
        setting: {
          section: updated.section as SectionKey,
          hidden: updated.hidden === true,
          paused: updated.paused === true,
        },
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("❌ Error in PUT /api/sections:", err);
    return NextResponse.json({ error: "Failed to update section settings" }, { status: 500 });
  }
}
