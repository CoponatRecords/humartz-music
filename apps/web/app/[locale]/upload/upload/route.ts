import { NextResponse } from 'next/server'
import chalk from 'chalk'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { r2 } from '../lib/r2'

export async function POST(request: Request) {
    try {
        console.log(chalk.yellow(`Generating an upload URL!`))

        // Optional: get filename from request body
        // const { filename } = await request.json()

// route.ts
const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `filename.pdf`,
        ContentType: 'application/pdf',
        // This prevents the SDK from adding the x-amz-checksum parameters
    }),
    { 
        expiresIn: 60,
        signableHeaders: new Set(['host', 'content-type']) // Force-include content-type in signature
    }
)

        console.log(chalk.green(`Success generating upload URL!`))
        return NextResponse.json({ url: signedUrl })
    } catch (err: any) {
        console.error('Failed to generate signed URL', err)
        return NextResponse.json(
            { error: err.message || 'Unknown error' },
            { status: 500 }
        )
    }
}
