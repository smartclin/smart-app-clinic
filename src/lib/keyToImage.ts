import { CreateBucketCommand, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { BUCKET_NAME, s3 } from './s3';

const BASE_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'https://better.ecarry.uk';

export const keyToImage = (key?: string | null) => {
    if (!key) return '';
    return `${BASE_URL}/${key}`;
};

export const uploadFile = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;

    // Convert File to ArrayBuffer and then to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if bucket exists
    try {
        await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    } catch (_err) {
        // If not found, create it
        await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    }

    // Upload the file
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: buffer
        })
    );

    return `${BASE_URL}/${fileName}`;
};
