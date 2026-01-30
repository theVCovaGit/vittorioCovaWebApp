import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { sql, ensureTableExists } from "@/lib/db";

interface FilmProject {
  id: number;
  type: "film";
  title: string;
  icon?: string;
  images: string[];
  year?: string;
  registration?: string;
  synapsis?: string;
  length?: string;
  position?: number;
  page?: number;
}

interface FilmProjectRow {
  id: number;
  title: string;
  icon: string;
  images: string[];
  year: string;
  country: string;
  city: string;
  category: string;
  registration: string;
  synapsis: string;
  length: string;
  position: number;
  page: number;
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
      year: p.year || "",
      registration: p.registration || "",
      synapsis: p.synapsis || "",
      length: p.length || "",
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

    await ensureTableExists('film_projects');

    // Ensure registration, synapsis, length columns exist
    try {
      const columnCheck = await sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'film_projects'
        AND column_name IN ('registration', 'synapsis', 'length')
      `;
      const existing = (columnCheck as Array<{ column_name: string }>).map((r) => r.column_name);
      if (!existing.includes('registration')) {
        await sql`ALTER TABLE film_projects ADD COLUMN registration TEXT`;
      }
      if (!existing.includes('synapsis')) {
        await sql`ALTER TABLE film_projects ADD COLUMN synapsis TEXT`;
      }
      if (!existing.includes('length')) {
        await sql`ALTER TABLE film_projects ADD COLUMN length TEXT`;
      }
    } catch (e) {
      console.warn("Column check for film_projects:", e);
    }

    const [newProject] = await sql`
      INSERT INTO film_projects (title, country, city, category, year, images, icon, position, page, registration, synapsis, length)
      VALUES (${project.title}, ${""}, ${""}, ${""}, ${project.year || ""}, ${project.images}, ${project.icon || ""}, ${project.position ?? 1}, ${project.page ?? 1}, ${project.registration || ""}, ${project.synapsis || ""}, ${project.length || ""})
      RETURNING *
    `;

    const formattedProject: FilmProject = {
      id: newProject.id,
      type: "film",
      title: newProject.title,
      icon: newProject.icon || "",
      images: newProject.images || [],
      year: newProject.year || "",
      registration: newProject.registration || "",
      synapsis: newProject.synapsis || "",
      length: newProject.length || "",
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

      // Ensure registration, synapsis, length columns exist
      try {
        const columnCheck = await sql`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'film_projects'
          AND column_name IN ('registration', 'synapsis', 'length')
        `;
        const existing = (columnCheck as Array<{ column_name: string }>).map((r) => r.column_name);
        if (!existing.includes('registration')) await sql`ALTER TABLE film_projects ADD COLUMN registration TEXT`;
        if (!existing.includes('synapsis')) await sql`ALTER TABLE film_projects ADD COLUMN synapsis TEXT`;
        if (!existing.includes('length')) await sql`ALTER TABLE film_projects ADD COLUMN length TEXT`;
      } catch (e) {
        console.warn("Column check for film_projects PUT:", e);
      }

      const [updatedProject] = await sql`
        UPDATE film_projects 
        SET 
          title = ${project.title},
          country = ${""},
          city = ${""},
          category = ${""},
          year = ${project.year || ""},
          images = ${project.images},
          icon = ${project.icon || ""},
          position = ${project.position ?? 1},
          page = ${project.page ?? 1},
          registration = ${project.registration || ""},
          synapsis = ${project.synapsis || ""},
          length = ${project.length || ""}
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
        year: updatedProject.year || "",
        registration: updatedProject.registration || "",
        synapsis: updatedProject.synapsis || "",
        length: updatedProject.length || "",
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

      await ensureTableExists('film_projects');
      try {
        const columnCheck = await sql`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'film_projects'
          AND column_name IN ('registration', 'synapsis', 'length')
        `;
        const existing = (columnCheck as Array<{ column_name: string }>).map((r) => r.column_name);
        if (!existing.includes('registration')) await sql`ALTER TABLE film_projects ADD COLUMN registration TEXT`;
        if (!existing.includes('synapsis')) await sql`ALTER TABLE film_projects ADD COLUMN synapsis TEXT`;
        if (!existing.includes('length')) await sql`ALTER TABLE film_projects ADD COLUMN length TEXT`;
      } catch (e) {
        console.warn("Column check for film_projects bulk:", e);
      }

      await sql`DELETE FROM film_projects`;

      for (const proj of projects) {
        await sql`
          INSERT INTO film_projects (id, title, country, city, category, year, images, icon, position, page, registration, synapsis, length)
          VALUES (${proj.id}, ${proj.title}, ${""}, ${""}, ${""}, ${proj.year || ""}, ${proj.images}, ${proj.icon || ""}, ${proj.position ?? 1}, ${proj.page ?? 1}, ${proj.registration || ""}, ${proj.synapsis || ""}, ${proj.length || ""})
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
