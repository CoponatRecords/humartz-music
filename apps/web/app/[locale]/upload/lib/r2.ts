// Source - https://stackoverflow.com/a
// Posted by deadcoder0904
// Retrieved 2026-01-29, License - CC BY-SA 4.0

import { S3Client } from '@aws-sdk/client-s3'

export const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})
