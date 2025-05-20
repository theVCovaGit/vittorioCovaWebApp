import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a unique blob name for product design icons
    const blobName = `productdesign/icons/icon-${Date.now()}-${file.name}`;

    // Upload to Vercel Blob Storage
    const uploaded = await put(blobName, file, { access: "public" });

    return NextResponse.json({ url: uploaded.url }, { status: 200 });
  } catch (err) {
    console.error("❌ Product Design Icon Upload Failed:", err);
    return NextResponse.json({ error: "Failed to upload icon" }, { status: 500 });
  }
}
