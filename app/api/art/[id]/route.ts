import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTableExists } from "@/lib/db";

interface ArtProject {
  id: number;
  type: "art";
  title: string;
  country: string;
  city: string;
  discipline: string;
  collection: string;
  year?: string;
  images: string[];
  icon?: string;
  position?: number;
  page?: number;
  forSale?: boolean;
  description?: string;
  price?: string;
}

interface ArtProjectRow {
  id: number;
  title: string;
  country: string;
  city: string;
  category: string;
  collection: string;
  year: string;
  images: string[];
  icon: string;
  position: number;
  page: number;
  for_sale: boolean;
  description: string;
  price: string;
  created_at?: string;
}

// GET: Fetch single art project by ID
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

    // Ensure table exists before querying (with retry logic)
    const tableReady = await ensureTableExists('art_projects');
    
    if (!tableReady) {
      console.warn("⚠️ Table creation failed, attempting to query anyway...");
    }
    
    let projects: ArtProjectRow[] = [];
    try {
      const result = await sql`
        SELECT * FROM art_projects 
        WHERE id = ${projectId}
        LIMIT 1
      `;
      projects = result as ArtProjectRow[];
    } catch (queryError: any) {
      const errorMessage = queryError?.message || String(queryError);
      // If table doesn't exist, return 404 instead of 500
      if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
        console.warn("⚠️ Table does not exist yet");
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      throw queryError;
    }
    
    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    const project = projects[0] as ArtProjectRow;
    
    const formattedProject: ArtProject = {
      id: project.id,
      type: "art" as const,
      title: project.title,
      country: project.country,
      city: project.city,
      discipline: project.category,
      collection: project.collection || "",
      year: project.year || "",
      images: project.images || [],
      icon: project.icon || "",
      position: project.position || 1,
      page: project.page || 1,
      forSale: project.for_sale ?? true,
      description: project.description || "",
      price: project.price || ""
    };
    
    return NextResponse.json({ project: formattedProject }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching art project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

