import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
    region: 'us-east-1', // MinIO ignores region, but SDK requires one
    endpoint: 'http://127.0.0.1:9000',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? ''
    },
    forcePathStyle: true // ✅ Required for MinIO (path-style instead of virtual-hosted)
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME;
