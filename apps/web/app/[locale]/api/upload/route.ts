import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForUpload } from "@api/upload/r2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1️⃣ CHECK PROMO FIRST (Gatekeeper)
    // We check if 'endpoint' is verify-promo. If so, we exit early.
    if (body.endpoint === "verify-promo") {
      const serverSecret = process.env.FREE_UPLOAD_CODE || "HUMARTZFREE2026";
      const userCode = body.promoCode?.trim().toUpperCase();
      const isValid = userCode === serverSecret.toUpperCase();
      
      return NextResponse.json({ isFree: isValid });
    }

    // 2️⃣ R2 SIGNED URL LOGIC (Only runs if not a promo check)
    const { fileName, fileType } = body;

    // This is what was causing your 400 error! 
    // It was running during the promo check because it was at the top.
    if (!fileName || !fileType) {
      return NextResponse.json({ error: "File name or type missing" }, { status: 400 });
    }

    const signedUrl = await getSignedUrlForUpload(fileName, fileType);
    return NextResponse.json({ signedUrl });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}