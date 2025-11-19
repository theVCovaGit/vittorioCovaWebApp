import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { sql, ensureTableExists } from "@/lib/db";

interface FilmProject {
  id: number;
  type: "film";
  title: string;
  icon?: string;
  images: string[];
  releaseYear?: string;
  countries?: string[];
  cities?: string[];
  genre?: string;
  category?: string; // e.g. short film, full film, etc.
  position?: number;
  page?: number;
}

interface FilmProjectRow {
  id: number;
  title: string;
  icon: string;
  images: string[];
  year: string;
  countries: string[];
  cities: string[];
  genre: string;
  category: string;
  country?: string;
  city?: string;
  position?: number;
  page?: number;
  created_at?: string;
}

// GET: Fetch all film projects
export async function GET() {
  try {
    // Ensure table exists before querying
    await ensureTableExists('film_projects');
    
    const projects = await sql`
      SELECT * FROM film_projects 
      ORDER BY created_at DESC
    `;
    
    const formattedProjects: FilmProject[] = (projects as FilmProjectRow[]).map((p) => ({
      id: p.id,
      type: "film" as const,
      title: p.title,
      icon: p.icon || "",
      images: p.images || [],
      releaseYear: p.year || "",
      countries: p.countries || [],
      cities: p.cities || [],
      genre: p.genre || "",
      category: p.category || "",
      position: p.position ?? 1,
      page: p.page ?? 1,
    }));
    
    return NextResponse.json({ projects: formattedProjects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching film projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Add new film project
export async function POST(req: NextRequest) {
  try {
    const { project } = await req.json();

    if (!project || !project.title || !Array.isArray(project.images)) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    // Ensure table exists before inserting
    await ensureTableExists('film_projects');

    const [newProject] = await sql`
      INSERT INTO film_projects (title, country, city, category, year, images, icon, position, page)
      VALUES (${project.title}, ${project.countries?.[0] || ""}, ${project.cities?.[0] || ""}, ${project.category || ""}, ${project.releaseYear || ""}, ${project.images}, ${project.icon || ""}, ${project.position ?? 1}, ${project.page ?? 1})
      RETURNING *
    `;

    const formattedProject: FilmProject = {
      id: newProject.id,
      type: "film",
      title: newProject.title,
      icon: newProject.icon || "",
      images: newProject.images || [],
      releaseYear: newProject.year || "",
      countries: newProject.country ? [newProject.country] : [],
      cities: newProject.city ? [newProject.city] : [],
      genre: newProject.genre || "",
      category: newProject.category || "",
      position: newProject.position ?? 1,
      page: newProject.page ?? 1,
    };

    return NextResponse.json({ message: "Project added", project: formattedProject }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}


// PUT: Update single project or replace all film projects
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, projects } = body;

    // Handle single project update
    if (project && !projects) {
      if (!project.id || !project.title || !Array.isArray(project.images)) {
        return NextResponse.json({ error: "Invalid project format" }, { status: 400 });
      }

      await ensureTableExists('film_projects');

      const [updatedProject] = await sql`
        UPDATE film_projects 
        SET 
          title = ${project.title},
          country = ${project.countries?.[0] || ""},
          city = ${project.cities?.[0] || ""},
          category = ${project.category || ""},
          year = ${project.releaseYear || ""},
          images = ${project.images},
          icon = ${project.icon || ""},
          position = ${project.position ?? 1},
          page = ${project.page ?? 1}
        WHERE id = ${project.id}
        RETURNING *
      `;

      if (!updatedProject) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      const formattedProject: FilmProject = {
        id: updatedProject.id,
        type: "film",
        title: updatedProject.title,
        icon: updatedProject.icon || "",
        images: updatedProject.images || [],
        releaseYear: updatedProject.year || "",
        countries: updatedProject.country ? [updatedProject.country] : [],
        cities: updatedProject.city ? [updatedProject.city] : [],
        genre: updatedProject.genre || "",
        category: updatedProject.category || "",
        position: updatedProject.position ?? 1,
        page: updatedProject.page ?? 1,
      };

      return NextResponse.json({ message: "Project updated", project: formattedProject }, { status: 200 });
    }

    // Handle bulk replace
    if (projects) {
      if (
        !Array.isArray(projects) ||
        projects.some((p) => !p.id || !p.title || !Array.isArray(p.images))
      ) {
        return NextResponse.json({ error: "Invalid project format" }, { status: 400 });
      }

      // Clear existing projects and insert new ones
      await sql`DELETE FROM film_projects`;
      
      for (const proj of projects) {
        await sql`
          INSERT INTO film_projects (id, title, country, city, category, year, images, icon, position, page)
          VALUES (${proj.id}, ${proj.title}, ${proj.countries?.[0] || ""}, ${proj.cities?.[0] || ""}, ${proj.category || ""}, ${proj.releaseYear || ""}, ${proj.images}, ${proj.icon || ""}, ${proj.position ?? 1}, ${proj.page ?? 1})
        `;
      }
      
      return NextResponse.json({ message: "Projects updated" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  } catch (error) {
    console.error("❌ Error in PUT:", error);
    return NextResponse.json({ error: "Failed to update projects" }, { status: 500 });
  }
}

// DELETE: Delete film project by ID
export async function DELETE(req: NextRequest) {
  try {
    const { id, icon } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Get project data before deletion for blob cleanup
    const [projectToDelete] = await sql`
      SELECT images FROM film_projects WHERE id = ${id}
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
    await sql`DELETE FROM film_projects WHERE id = ${id}`;

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
