// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForUpload } from "@api/upload/r2";

export async function POST(request: NextRequest) {
  try {
    const { 
      fileName, 
      fileType 
    } = await request.json();

    // 1️⃣ Validate required fields
    if (!fileName || !fileType) {
      return NextResponse.json({ error: "File name or type missing" }, { status: 400 });
    }

    // 2️⃣ Generate signed URL for R2
    const signedUrl = await getSignedUrlForUpload(fileName, fileType);

    // 3️⃣ Return only the signed URL
    return NextResponse.json({ signedUrl });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Error processing upload request" }, { status: 500 });
  }
}