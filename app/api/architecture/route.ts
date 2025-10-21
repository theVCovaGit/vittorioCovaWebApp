import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { sql, ensureTableExists } from "@/lib/db";

interface ArchitectureProject {
  id: number;
  type: "architecture"; // ✅ REQUIRED for discriminated union
  title: string;
  country: string;
  city: string;
  category: string;
  year?: string;
  images: string[];
  icon?: string;
  position?: number;
  page?: number;
}

interface ArchitectureProjectRow {
  id: number;
  title: string;
  country: string;
  city: string;
  category: string;
  year: string;
  images: string[];
  icon: string;
  position: number;
  page: number;
  created_at?: string;
}

// GET: Fetch all architecture projects
export async function GET() {
  try {
    // Ensure table exists before querying
    await ensureTableExists('architecture_projects');
    
    const projects = await sql`
      SELECT * FROM architecture_projects 
      ORDER BY created_at DESC
    `;
    
    const formattedProjects: ArchitectureProject[] = (projects as ArchitectureProjectRow[]).map((p) => ({
      id: p.id,
      type: "architecture" as const,
      title: p.title,
      country: p.country,
      city: p.city,
      category: p.category,
      year: p.year || "",
      images: p.images || [],
      icon: p.icon || "",
      position: p.position || 1,
      page: p.page || 1
    }));
    
    return NextResponse.json({ projects: formattedProjects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching architecture projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Add new project
export async function POST(req: NextRequest) {
  try {
    const { project } = await req.json();

    if (
      !project ||
      !project.title ||
      !project.country ||
      !project.city ||
      !project.category ||
      !Array.isArray(project.images)
    ) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    // Ensure table exists before inserting
    await ensureTableExists('architecture_projects');

    const [newProject] = await sql`
      INSERT INTO architecture_projects (title, country, city, category, year, images, icon, position, page)
      VALUES (${project.title}, ${project.country}, ${project.city}, ${project.category}, ${project.year || ""}, ${project.images}, ${project.icon || ""}, ${project.position || 1}, ${project.page || 1})
      RETURNING *
    `;

    const formattedProject: ArchitectureProject = {
      id: newProject.id,
      type: "architecture",
      title: newProject.title,
      country: newProject.country,
      city: newProject.city,
      category: newProject.category,
      year: newProject.year || "",
      images: newProject.images || [],
      icon: newProject.icon || "",
      position: newProject.position || 1,
      page: newProject.page || 1
    };

    return NextResponse.json({ message: "Project added", project: formattedProject }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}

// PUT: Update all projects
export async function PUT(req: NextRequest) {
  try {
    const { projects } = await req.json();

    if (
      !Array.isArray(projects) ||
      projects.some(
        (p) =>
          !p.id ||
          !p.title ||
          !p.country ||
          !p.city ||
          !p.category ||
          !Array.isArray(p.images)
      )
    ) {
      return NextResponse.json({ error: "Invalid project format" }, { status: 400 });
    }

    // Clear existing projects and insert new ones
    await sql`DELETE FROM architecture_projects`;
    
    for (const project of projects) {
      await sql`
        INSERT INTO architecture_projects (id, title, country, city, category, year, images, icon)
        VALUES (${project.id}, ${project.title}, ${project.country}, ${project.city}, ${project.category}, ${project.year || ""}, ${project.images}, ${project.icon || ""})
      `;
    }

    return NextResponse.json({ message: "Projects updated" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PUT:", error);
    return NextResponse.json({ error: "Failed to update projects" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, icon } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Get project data before deletion for blob cleanup
    const [projectToDelete] = await sql`
      SELECT images FROM architecture_projects WHERE id = ${id}
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
    await sql`DELETE FROM architecture_projects WHERE id = ${id}`;

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
