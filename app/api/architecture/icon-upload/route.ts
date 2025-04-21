import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a unique blob name
    const blobName = `icons/icon-${Date.now()}-${file.name}`;

    // Upload to Vercel Blob
    const uploaded = await put(blobName, file, { access: "public" });

    return NextResponse.json({ url: uploaded.url }, { status: 200 });
  } catch (err) {
    console.error("❌ Icon upload failed:", err);
    return NextResponse.json({ error: "Failed to upload icon" }, { status: 500 });
  }
}
