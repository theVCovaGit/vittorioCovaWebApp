import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

const redis = Redis.fromEnv();

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

// GET: Fetch all art projects
export async function GET() {
  try {
    const data = await redis.get("artProjects");
    let projects: ArtProject[] = [];

    if (typeof data === "string") {
      const parsed = JSON.parse(data);
      projects = Array.isArray(parsed)
        ? parsed.map((p) => ({ ...p, type: "art" }))
        : [];
    } else if (Array.isArray(data)) {
      projects = data.map((p) => ({ ...p, type: "art" }));
    }

    return NextResponse.json({ projects }, { status: 200 });
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
      !project.id ||
      !project.title ||
      !Array.isArray(project.images) ||
      !project.country ||
      !project.city ||
      !project.discipline
    ) {
      return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
    }

    const existingData = await redis.get("artProjects");
    let projects: ArtProject[] = [];

    if (typeof existingData === "string") {
      projects = JSON.parse(existingData);
    } else if (Array.isArray(existingData)) {
      projects = existingData;
    }

    const newProject: ArtProject = {
      id: project.id,
      type: "art",
      title: project.title,
      icon: project.icon || "",
      images: project.images,
      year: project.year || "",
      country: project.country,
      city: project.city,
      discipline: project.discipline,
      collection: project.collection || "",
    };

    projects.push(newProject);
    await redis.set("artProjects", JSON.stringify(projects));

    return NextResponse.json({ message: "Project added", project: newProject }, { status: 200 });
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

    await redis.set("artProjects", JSON.stringify(projects));
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

    const existingData = await redis.get("artProjects");
    const projects: ArtProject[] = Array.isArray(existingData)
      ? existingData
      : typeof existingData === "string"
      ? JSON.parse(existingData)
      : [];

    const projectToDelete = projects.find((p) => p.id === id);
    if (!projectToDelete) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

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

    if (icon && !icon.includes("/placeholder.png")) {
      try {
        console.log(`🧹 Deleting icon blob: ${icon}`);
        await del(icon);
      } catch (err) {
        console.warn("❌ Error deleting icon blob:", icon, err);
      }
    }

    const updated = projects.filter((p) => p.id !== id);
    await redis.set("artProjects", JSON.stringify(updated));

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
