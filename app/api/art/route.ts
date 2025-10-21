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
  created_at?: string;
}

// GET: Fetch all art projects
export async function GET() {
  try {
    // Ensure table exists before querying
    await ensureTableExists('art_projects');
    
    const projects = await sql`
      SELECT * FROM art_projects 
      ORDER BY created_at DESC
    `;
    
    const formattedProjects: ArtProject[] = (projects as ArtProjectRow[]).map((p) => ({
      id: p.id,
      type: "art" as const,
      title: p.title,
      icon: p.icon || "",
      images: p.images || [],
      year: p.year || "",
      country: p.country,
      city: p.city,
      discipline: p.category, // mapping category to discipline
      collection: p.collection || ""
    }));
    
    return NextResponse.json({ projects: formattedProjects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching art projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
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
      !project.country ||
      !project.city ||
      !project.discipline
    ) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    // Ensure table exists before inserting
    await ensureTableExists('art_projects');

    const [newProject] = await sql`
      INSERT INTO art_projects (title, country, city, category, year, images, icon, collection)
      VALUES (${project.title}, ${project.country}, ${project.city}, ${project.discipline}, ${project.year || ""}, ${project.images}, ${project.icon || ""}, ${project.collection || ""})
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
      collection: newProject.collection || ""
    };

    return NextResponse.json({ message: "Project added", project: formattedProject }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}

// PUT: Overwrite all art projects
export async function PUT(req: NextRequest) {
  try {
    const { projects } = await req.json();

    if (
      !Array.isArray(projects) ||
      projects.some(
        (p) =>
          !p.id ||
          !p.title ||
          !Array.isArray(p.images) ||
          !p.country ||
          !p.city ||
          !p.discipline
      )
    ) {
      return NextResponse.json({ error: "Invalid project format" }, { status: 400 });
    }

    // Clear existing projects and insert new ones
    await sql`DELETE FROM art_projects`;
    
    for (const project of projects) {
      await sql`
        INSERT INTO art_projects (id, title, country, city, category, year, images, icon, collection)
        VALUES (${project.id}, ${project.title}, ${project.country}, ${project.city}, ${project.discipline}, ${project.year || ""}, ${project.images}, ${project.icon || ""}, ${project.collection || ""})
      `;
    }

    return NextResponse.json({ message: "Projects updated" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PUT:", error);
    return NextResponse.json({ error: "Failed to update projects" }, { status: 500 });
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
