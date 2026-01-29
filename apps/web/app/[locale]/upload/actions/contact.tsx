"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getUploadUrl(fileName: string, contentType: string) {
  const key = `uploads/${Date.now()}-${fileName}`;
  
// app/[locale]/contact/actions.ts

const command = new PutObjectCommand({
  Bucket: process.env.R2_BUCKET_NAME,
  Key: key,
  ContentType: contentType,
  // This line prevents the SDK from adding complex checksum headers 
  // that often trigger CORS 403s in browsers
  ChecksumAlgorithm: undefined, 
})

const url = await getSignedUrl(r2, command, { 
  expiresIn: 3600,

});
  
  return { url, key };
}