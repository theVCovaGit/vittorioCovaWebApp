import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { sql, ensureTableExists } from "@/lib/db";

interface ArtProject {
  id: number;
  type: "art";
  title: string;
  icon?: string;
  images: string[];
  year?: string;
  country: string;
  city: string;
  discipline: string; // e.g., "painting", "sculpture"
  collection?: string;
  position?: number;
  page?: number;
  forSale?: boolean;
  description?: string;
  price?: string;
}

interface ArtProjectRow {
  id: number;
  title: string;
  icon: string;
  images: string[];
  year: string;
  country: string;
  city: string;
  category: string;
  collection: string;
  position: number;
  page: number;
  for_sale: boolean;
  description: string;
  price: string;
  created_at?: string;
}

// GET: Fetch all art projects
export async function GET() {
  try {
    // Ensure table exists before querying (with retry logic)
    const tableReady = await ensureTableExists('art_projects');
    
    if (!tableReady) {
      console.warn("⚠️ Table creation failed, attempting to query anyway...");
    }
    
    let projects: ArtProjectRow[] = [];
    try {
      const result = await sql`
        SELECT * FROM art_projects 
        ORDER BY created_at DESC
      `;
      projects = result as ArtProjectRow[];
    } catch (queryError: unknown) {
      const error = queryError as { message?: string };
      const errorMessage = error?.message || String(queryError);
      // If table doesn't exist, return empty array instead of error
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        console.warn("⚠️ Table does not exist yet, returning empty projects array");
        return NextResponse.json({ projects: [] }, { status: 200 });
      }
      throw queryError;
    }
    
    const formattedProjects: ArtProject[] = projects.map((p) => ({
      id: p.id,
      type: "art" as const,
      title: p.title,
      icon: p.icon || "",
      images: p.images || [],
      year: p.year || "",
      country: p.country,
      city: p.city,
      discipline: p.category, // mapping category to discipline
      collection: p.collection || "",
      position: p.position || 1,
      page: p.page || 1,
      forSale: p.for_sale ?? true,
      description: p.description || "",
      price: p.price || ""
    }));
    
    return NextResponse.json({ projects: formattedProjects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching art projects:", error);
    // Return empty array instead of error to prevent UI breakage
    return NextResponse.json({ projects: [] }, { status: 200 });
  }
}

// POST: Add a new art project
export async function POST(req: NextRequest) {
  try {
    const { project } = await req.json();

    if (
      !project ||
      !project.title ||
      !Array.isArray(project.images) ||
      !project.discipline
    ) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    // Ensure table exists and has all required columns before inserting
    const tableReady = await ensureTableExists('art_projects');
    if (!tableReady) {
      console.warn("⚠️ Table creation failed, but attempting insert anyway...");
    }
    
    // Double-check that required columns exist (safety net)
    try {
      const columnCheck = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'art_projects' 
        AND column_name IN ('for_sale', 'description', 'price')
      `;
      const existingColumns = (columnCheck as Array<{ column_name: string }>).map((row) => row.column_name);
      const requiredColumns = ['for_sale', 'description', 'price'];
      const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
      
      if (missingColumns.length > 0) {
        console.log(`⚠️ Missing columns detected: ${missingColumns.join(', ')}, adding them now...`);
        for (const col of missingColumns) {
          try {
            if (col === 'for_sale') {
              await sql`ALTER TABLE art_projects ADD COLUMN for_sale BOOLEAN DEFAULT true`;
            } else if (col === 'description') {
              await sql`ALTER TABLE art_projects ADD COLUMN description TEXT`;
            } else if (col === 'price') {
              await sql`ALTER TABLE art_projects ADD COLUMN price VARCHAR(255)`;
            }
            console.log(`✅ Added missing column ${col}`);
            } catch (err: unknown) {
              const error = err as { code?: string };
              if (error?.code !== '42701') { // 42701 = duplicate column
                console.error(`❌ Failed to add column ${col}:`, err);
              }
            }
        }
      }
    } catch (checkError) {
      console.warn("⚠️ Could not verify columns, proceeding anyway:", checkError);
    }

    const [newProject] = await sql`
      INSERT INTO art_projects (title, country, city, category, year, images, icon, collection, position, page, for_sale, description, price)
      VALUES (${project.title}, ${project.country || ""}, ${project.city || ""}, ${project.discipline}, ${project.year || ""}, ${project.images}, ${project.icon || ""}, ${project.collection || ""}, ${project.position || 1}, ${project.page || 1}, ${project.forSale ?? true}, ${project.description || ""}, ${project.price || ""})
      RETURNING *
    `;

    const formattedProject: ArtProject = {
      id: newProject.id,
      type: "art",
      title: newProject.title,
      icon: newProject.icon || "",
      images: newProject.images || [],
      year: newProject.year || "",
      country: newProject.country,
      city: newProject.city,
      discipline: newProject.category,
      collection: newProject.collection || "",
      position: newProject.position || 1,
      page: newProject.page || 1,
      forSale: newProject.for_sale ?? true,
      description: newProject.description || "",
      price: newProject.price || ""
    };

    return NextResponse.json({ message: "Project added", project: formattedProject }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}

// PUT: Update a single art project
export async function PUT(req: NextRequest) {
  try {
    const { project } = await req.json();

    if (
      !project ||
      !project.id ||
      !project.title ||
      !Array.isArray(project.images) ||
      !project.discipline
    ) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    // Ensure table exists before updating (with retry logic)
    const tableReady = await ensureTableExists('art_projects');
    if (!tableReady) {
      console.warn("⚠️ Table creation failed, but attempting update anyway...");
    }

    // Update the project
    await sql`
      UPDATE art_projects
      SET 
        title = ${project.title},
        country = ${project.country || ""},
        city = ${project.city || ""},
        category = ${project.discipline},
        year = ${project.year || ""},
        images = ${project.images},
        icon = ${project.icon || ""},
        collection = ${project.collection || ""},
        position = ${project.position || 1},
        page = ${project.page || 1},
        for_sale = ${project.forSale ?? true},
        description = ${project.description || ""},
        price = ${project.price || ""},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${project.id}
    `;

    // Fetch the updated project
    const [updatedProject] = await sql`
      SELECT * FROM art_projects WHERE id = ${project.id}
    `;

    const formattedProject: ArtProject = {
      id: updatedProject.id,
      type: "art",
      title: updatedProject.title,
      icon: updatedProject.icon || "",
      images: updatedProject.images || [],
      year: updatedProject.year || "",
      country: updatedProject.country,
      city: updatedProject.city,
      discipline: updatedProject.category,
      collection: updatedProject.collection || "",
      position: updatedProject.position || 1,
      page: updatedProject.page || 1,
      forSale: updatedProject.for_sale ?? true,
      description: updatedProject.description || "",
      price: updatedProject.price || ""
    };

    return NextResponse.json({ message: "Project updated", project: formattedProject }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PUT:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE: Remove a project and its blobs
export async function DELETE(req: NextRequest) {
  try {
    const { id, icon } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Get project data before deletion for blob cleanup
    const [projectToDelete] = await sql`
      SELECT images FROM art_projects WHERE id = ${id}
    `;

    if (!projectToDelete) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete images
    for (const img of projectToDelete.images || []) {
      if (img && !img.includes("/placeholder.png")) {
        try {
          console.log(`🧹 Deleting blob: ${img}`);
          await del(img);
        } catch (err) {
          console.warn("❌ Error deleting blob:", img, err);
        }
      }
    }

    // Delete icon
    if (icon && !icon.includes("/placeholder.png")) {
      try {
        console.log(`🧹 Deleting icon blob: ${icon}`);
        await del(icon);
      } catch (err) {
        console.warn("❌ Error deleting icon blob:", icon, err);
      }
    }

    // Delete from database
    await sql`DELETE FROM art_projects WHERE id = ${id}`;

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
