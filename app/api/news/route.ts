import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTableExists } from "@/lib/db";

interface NewsItem {
  id: number;
  date: string;
  title: string;
  description?: string;
  sortOrder?: number;
}

interface NewsItemRow {
  id: number;
  date: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// GET: Fetch all news items (ordered by sort_order, then created_at desc)
export async function GET() {
  try {
    await ensureTableExists("news_items");

    const items = await sql`
      SELECT id, date, title, description, sort_order, created_at, updated_at
      FROM news_items
      ORDER BY sort_order ASC, created_at DESC
    `;

    const formatted: NewsItem[] = (items as NewsItemRow[]).map((row) => ({
      id: row.id,
      date: row.date || "",
      title: row.title || "",
      description: row.description ?? undefined,
      sortOrder: row.sort_order ?? 0,
    }));

    return NextResponse.json({ items: formatted }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching news items:", error);
    return NextResponse.json({ error: "Failed to fetch news items" }, { status: 500 });
  }
}

// POST: Add a new news item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, title, description, sortOrder } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await ensureTableExists("news_items");

    const [row] = await sql`
      INSERT INTO news_items (date, title, description, sort_order)
      VALUES (${date ?? ""}, ${title.trim()}, ${description ?? null}, ${sortOrder ?? 0})
      RETURNING *
    `;

    const created = row as NewsItemRow;
    const item: NewsItem = {
      id: created.id,
      date: created.date || "",
      title: created.title || "",
      description: created.description ?? undefined,
      sortOrder: created.sort_order ?? 0,
    };

    return NextResponse.json({ message: "News item added", item }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST /api/news:", err);
    return NextResponse.json({ error: "Failed to add news item" }, { status: 500 });
  }
}

// PUT: Update a single news item
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, date, title, description, sortOrder } = body;

    if (id == null || typeof id !== "number") {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await ensureTableExists("news_items");

    await sql`
      UPDATE news_items
      SET
        date = ${date ?? ""},
        title = ${title.trim()},
        description = ${description ?? null},
        sort_order = ${sortOrder ?? 0},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    const [updated] = await sql`
      SELECT id, date, title, description, sort_order FROM news_items WHERE id = ${id}
    `;

    if (!updated) {
      return NextResponse.json({ error: "News item not found" }, { status: 404 });
    }

    const row = updated as NewsItemRow;
    const item: NewsItem = {
      id: row.id,
      date: row.date || "",
      title: row.title || "",
      description: row.description ?? undefined,
      sortOrder: row.sort_order ?? 0,
    };

    return NextResponse.json({ message: "News item updated", item }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in PUT /api/news:", err);
    return NextResponse.json({ error: "Failed to update news item" }, { status: 500 });
  }
}

// DELETE: Remove a news item by id
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (id == null || typeof id !== "number") {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    await ensureTableExists("news_items");

    const [deleted] = await sql`
      DELETE FROM news_items WHERE id = ${id} RETURNING id
    `;

    if (!deleted) {
      return NextResponse.json({ error: "News item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "News item deleted" }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in DELETE /api/news:", err);
    return NextResponse.json({ error: "Failed to delete news item" }, { status: 500 });
  }
}
