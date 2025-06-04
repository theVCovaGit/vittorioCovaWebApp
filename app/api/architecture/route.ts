import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

// Initialize Redis
const redis = Redis.fromEnv();

interface ArchitectureProject {
  id: number;
  title: string;
  country: string;
  city: string;
  category: string;
  year?: string;
  images: string[];
  icon?: string;
}

// GET: Fetch all architecture projects
export async function GET() {
  try {
    const data = await redis.get("architectureProjects");
    let projects: ArchitectureProject[] = [];

    if (typeof data === "string") {
      projects = JSON.parse(data);
    } else if (Array.isArray(data)) {
      projects = data;
    }

    return NextResponse.json({ projects }, { status: 200 });
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
      !project.id ||
      !project.title ||
      !project.country ||
      !project.city ||
      !project.category ||
      !Array.isArray(project.images)
    ) {
          return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    const existingData = await redis.get("architectureProjects");
    let projects: ArchitectureProject[] = [];

    if (typeof existingData === "string") {
      projects = JSON.parse(existingData);
    } else if (Array.isArray(existingData)) {
      projects = existingData;
    }

    const newProject: ArchitectureProject = {
      id: project.id,
      title: project.title,
      country: project.country,
      city: project.city,
      category: project.category,
      year: project.year || "",
      images: project.images,
      icon: project.icon || "",
    };
    

    projects.push(newProject);
    await redis.set("architectureProjects", JSON.stringify(projects));

    return NextResponse.json({ message: "Project added", project: newProject }, { status: 200 });
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
    

    await redis.set("architectureProjects", JSON.stringify(projects));
    return NextResponse.json({ message: "Projects updated" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PUT:", error);
    return NextResponse.json({ error: "Failed to update projects" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, icon } = await req.json(); // ✅ now includes icon

    if (typeof id !== "number") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const existingData = await redis.get("architectureProjects");
    const projects: ArchitectureProject[] = Array.isArray(existingData)
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

    // ✅ Delete icon
    if (icon && !icon.includes("/placeholder.png")) {
      try {
        console.log(`🧹 Deleting icon blob: ${icon}`);
        await del(icon);
      } catch (err) {
        console.warn("❌ Error deleting icon blob:", icon, err);
      }
    }

    const updated = projects.filter((p) => p.id !== id);
    await redis.set("architectureProjects", JSON.stringify(updated));

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
