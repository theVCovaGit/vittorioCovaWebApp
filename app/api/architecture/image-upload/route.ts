import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blobName = `architecture-images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploaded = await put(blobName, file, { access: "public" });

    return NextResponse.json({ url: uploaded.url }, { status: 200 });
  } catch (err) {
    console.error("❌ Architecture image upload failed:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
