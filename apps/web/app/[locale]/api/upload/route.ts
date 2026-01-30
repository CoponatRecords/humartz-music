import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForUpload } from "@api/upload/r2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1️⃣ PROMO CHECK BRANCH
    // If the frontend sends a 'validateCode' flag, we just check the secret
    if (body.validateCode) {
      const SERVER_SECRET = process.env.FREE_UPLOAD_CODE;
      const isValid = body.promoCode?.trim().toUpperCase() === SERVER_SECRET?.toUpperCase();
      
      return NextResponse.json({ isFree: isValid });
    }

    // 2️⃣ R2 SIGNED URL BRANCH
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "File name or type missing" }, { status: 400 });
    }

    const signedUrl = await getSignedUrlForUpload(fileName, fileType);
    return NextResponse.json({ signedUrl });

  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Error processing request" }, { status: 500 });
  }
}