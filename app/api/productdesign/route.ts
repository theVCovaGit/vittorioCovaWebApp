import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { sql, ensureTableExists } from "@/lib/db";

interface ProductDesignProject {
  id: number;
  type: "productDesign";
  title: string;
  country: string;
  city: string;
  material?: string;
  year?: number;
  useCase?: string;
  images: string[];
  icon?: string;
}

// GET: Fetch all product design projects
export async function GET() {
  try {
    // Ensure table exists before querying
    await ensureTableExists('productdesign_projects');
    
    const projects = await sql`
      SELECT * FROM productdesign_projects 
      ORDER BY created_at DESC
    `;
    
    const formattedProjects: ProductDesignProject[] = projects.map((p: any) => ({
      id: p.id,
      type: "productDesign" as const,
      title: p.title,
      country: p.country,
      city: p.city,
      material: p.material || "",
      year: p.year || null,
      useCase: p.use_case || "",
      images: p.images || [],
      icon: p.icon || ""
    }));
    
    return NextResponse.json({ projects: formattedProjects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching product design projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Add new product design project
export async function POST(req: NextRequest) {
  try {
    const { project } = await req.json();

    if (
      !project ||
      !project.title ||
      !project.country ||
      !project.city ||
      !Array.isArray(project.images)
    ) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    // Ensure table exists before inserting
    await ensureTableExists('productdesign_projects');

    const [newProject] = await sql`
      INSERT INTO productdesign_projects (title, country, city, material, year, use_case, images, icon)
      VALUES (${project.title}, ${project.country}, ${project.city}, ${project.material || ""}, ${project.year || null}, ${project.useCase || ""}, ${project.images}, ${project.icon || ""})
      RETURNING *
    `;

    const formattedProject: ProductDesignProject = {
      id: newProject.id,
      type: "productDesign",
      title: newProject.title,
      country: newProject.country,
      city: newProject.city,
      material: newProject.material || "",
      year: newProject.year || null,
      useCase: newProject.use_case || "",
      images: newProject.images || [],
      icon: newProject.icon || ""
    };

    return NextResponse.json({ message: "Project added", project: formattedProject }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}

// PUT: Replace all product design projects
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
          !Array.isArray(p.images)
      )
    ) {
      return NextResponse.json({ error: "Invalid project format" }, { status: 400 });
    }

    // Clear existing projects and insert new ones
    await sql`DELETE FROM productdesign_projects`;
    
    for (const project of projects) {
      await sql`
        INSERT INTO productdesign_projects (id, title, country, city, material, year, use_case, images, icon)
        VALUES (${project.id}, ${project.title}, ${project.country}, ${project.city}, ${project.material || ""}, ${project.year || null}, ${project.useCase || ""}, ${project.images}, ${project.icon || ""})
      `;
    }

    return NextResponse.json({ message: "Projects updated" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PUT:", error);
    return NextResponse.json({ error: "Failed to update projects" }, { status: 500 });
  }
}

// DELETE: Remove a specific project
export async function DELETE(req: NextRequest) {
  try {
    const { id, icon } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Get project data before deletion for blob cleanup
    const [projectToDelete] = await sql`
      SELECT images FROM productdesign_projects WHERE id = ${id}
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
    await sql`DELETE FROM productdesign_projects WHERE id = ${id}`;

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
