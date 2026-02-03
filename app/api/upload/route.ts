import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

/**
 * Handles client uploads: only generates tokens (tiny JSON). The actual file
 * is sent directly from the browser to Vercel Blob, so we avoid the 4.5 MB
 * serverless request body limit and support large/high-res images.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB per file
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Optional: e.g. log or sync to DB
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload token error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload token" },
      { status: 500 }
    );
  }
}
