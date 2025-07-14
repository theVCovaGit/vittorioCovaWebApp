import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

const redis = Redis.fromEnv();

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
}

// GET: Fetch all film projects
export async function GET() {
  try {
    const data = await redis.get("filmProjects");
    let projects: FilmProject[] = [];

    if (typeof data === "string") {
      const parsed = JSON.parse(data);
      projects = Array.isArray(parsed)
        ? parsed.map((p) => ({ ...p, type: "film" }))
        : [];
    } else if (Array.isArray(data)) {
      projects = data.map((p) => ({ ...p, type: "film" }));
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching film projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Add new film project
export async function POST(req: NextRequest) {
  try {
    const { project } = await req.json();

    if (!project || !project.id || !project.title || !Array.isArray(project.images)) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    const existingData = await redis.get("filmProjects");
    let projects: FilmProject[] = [];

    if (typeof existingData === "string") {
      projects = JSON.parse(existingData);
    } else if (Array.isArray(existingData)) {
      projects = existingData;
    }

    const newProject: FilmProject = {
      id: project.id,
      type: "film",
      title: project.title,
      icon: project.icon || "",
      images: project.images,
      releaseYear: project.releaseYear || "",
      countries: Array.isArray(project.countries)
        ? project.countries
        : project.countries
        ? [project.countries]
        : [],
      cities: Array.isArray(project.cities)
        ? project.cities
        : project.cities
        ? [project.cities]
        : [],
      genre: project.genre || "",
      category: project.category || "",
    };

    projects.push(newProject);
    await redis.set("filmProjects", JSON.stringify(projects));

    return NextResponse.json({ message: "Project added", project: newProject }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}


// PUT: Replace all film projects
export async function PUT(req: NextRequest) {
  try {
    const { projects } = await req.json();

    if (
      !Array.isArray(projects) ||
      projects.some((p) => !p.id || !p.title || !Array.isArray(p.images))
    ) {
      return NextResponse.json({ error: "Invalid project format" }, { status: 400 });
    }

    const cleanProjects: FilmProject[] = projects.map((p) => ({
      ...p,
      type: "film",
      countries: Array.isArray(p.countries)
        ? p.countries
        : p.countries
        ? [p.countries]
        : [],
      cities: Array.isArray(p.cities)
        ? p.cities
        : p.cities
        ? [p.cities]
        : [],
    }));
    
    await redis.set("filmProjects", JSON.stringify(cleanProjects));
    
    return NextResponse.json({ message: "Projects updated" }, { status: 200 });
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

    const existingData = await redis.get("filmProjects");
    const projects: FilmProject[] = Array.isArray(existingData)
      ? existingData
      : typeof existingData === "string"
      ? JSON.parse(existingData)
      : [];

    const projectToDelete = projects.find((p) => p.id === id);
    if (!projectToDelete) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete images
    for (const img of projectToDelete.images) {
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

    const updated = projects.filter((p) => p.id !== id);
    await redis.set("filmProjects", JSON.stringify(updated));

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
