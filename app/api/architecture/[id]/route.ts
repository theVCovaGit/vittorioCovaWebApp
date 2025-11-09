import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTableExists } from "@/lib/db";

interface ArchitectureProject {
  id: number;
  type: "architecture";
  title: string;
  country: string;
  city: string;
  category: string;
  year?: string;
  images: string[];
  icon?: string;
  iconSecondary?: string;
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
  icon_secondary: string;
  position: number;
  page: number;
  created_at?: string;
}

// GET: Fetch single architecture project by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Ensure table exists before querying
    await ensureTableExists('architecture_projects');
    
    const projects = await sql`
      SELECT * FROM architecture_projects 
      WHERE id = ${projectId}
      LIMIT 1
    `;
    
    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    const project = projects[0] as ArchitectureProjectRow;
    
    const formattedProject: ArchitectureProject = {
      id: project.id,
      type: "architecture" as const,
      title: project.title,
      country: project.country,
      city: project.city,
      category: project.category,
      year: project.year || "",
      images: project.images || [],
      icon: project.icon || "",
      iconSecondary: project.icon_secondary || "",
      position: project.position || 1,
      page: project.page || 1
    };
    
    return NextResponse.json({ project: formattedProject }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching architecture project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
