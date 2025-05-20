import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

// Initialize Redis
const redis = Redis.fromEnv();

interface ProductDesignProject {
  id: number;
  title: string;
  description: string;
  category: string;
  images: string[];
  icon?: string;
}

// GET: Fetch all product design projects
export async function GET() {
  try {
    const data = await redis.get("productDesignProjects");
    let projects: ProductDesignProject[] = [];

    if (typeof data === "string") {
      projects = JSON.parse(data);
    } else if (Array.isArray(data)) {
      projects = data;
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching product design projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Add new product design project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Incoming Request Body:", JSON.stringify(body, null, 2));

    const { project } = body;

    // Validation logging
    if (!project) {
      console.error("❌ Validation Failed: 'project' is missing.");
      return NextResponse.json({ error: "Missing 'project' field." }, { status: 400 });
    }

    if (!project.id) {
      console.error("❌ Validation Failed: 'project.id' is missing.");
      return NextResponse.json({ error: "Missing 'project.id' field." }, { status: 400 });
    }

    if (!project.title) {
      console.error("❌ Validation Failed: 'project.title' is missing.");
      return NextResponse.json({ error: "Missing 'project.title' field." }, { status: 400 });
    }

    if (!Array.isArray(project.images)) {
      console.error("❌ Validation Failed: 'project.images' is not an array.");
      return NextResponse.json({ error: "'project.images' must be an array." }, { status: 400 });
    }

    const existingData = await redis.get("productDesignProjects");
    let projects: ProductDesignProject[] = [];

    if (typeof existingData === "string") {
      projects = JSON.parse(existingData);
    } else if (Array.isArray(existingData)) {
      projects = existingData;
    }

    const newProject: ProductDesignProject = {
      ...project,
      images: project.images,
      icon: project.icon || "",
    };

    projects.push(newProject);
    await redis.set("productDesignProjects", JSON.stringify(projects));

    console.log("✅ Project successfully added:", JSON.stringify(newProject, null, 2));
    return NextResponse.json({ message: "Product design project added", project: newProject }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST Handler:", err);
    return NextResponse.json({ error: "Failed to add product design project" }, { status: 500 });
  }
}


// PUT: Update all product design projects
export async function PUT(req: NextRequest) {
  try {
    const { projects } = await req.json();

    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    await redis.set("productDesignProjects", JSON.stringify(projects));
    return NextResponse.json({ message: "Product design projects updated" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in PUT:", error);
    return NextResponse.json({ error: "Failed to update product design projects" }, { status: 500 });
  }
}

// DELETE: Delete a product design project
export async function DELETE(req: NextRequest) {
  try {
    const { id, icon } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const existingData = await redis.get("productDesignProjects");
    const projects: ProductDesignProject[] = Array.isArray(existingData)
      ? existingData
      : typeof existingData === "string"
      ? JSON.parse(existingData)
      : [];

    const projectToDelete = projects.find((p) => p.id === id);
    if (!projectToDelete) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete project images
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

    // Delete icon if present
    if (icon && !icon.includes("/placeholder.png")) {
      try {
        console.log(`🧹 Deleting icon blob: ${icon}`);
        await del(icon);
      } catch (err) {
        console.warn("❌ Error deleting icon blob:", icon, err);
      }
    }

    const updated = projects.filter((p) => p.id !== id);
    await redis.set("productDesignProjects", JSON.stringify(updated));

    return NextResponse.json({ message: "Product design project deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete product design project" }, { status: 500 });
  }
}
