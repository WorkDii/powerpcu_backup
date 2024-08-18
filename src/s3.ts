import { S3 } from "@aws-sdk/client-s3";
import env from "./env.ts";
import { parse } from "@std/path";

import { addDays } from "date-fns";

// Extracted the common logic of creating a S3 client into a separate function
const createS3Client = () => {
  return new S3({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_KEY,
    },
  });
};

export const s3Client = createS3Client();

export const uploadToS3 = async (filePath: string, Key: string) => {
  return await s3Client.putObject({
    Bucket: env.S3_BUCKET,
    Key,
    Body: await Deno.readFile(filePath),
  });
};

export const removeOldS3 = async (keepDay: number, folder: string) => {
  const list = await s3Client.listObjectsV2({
    Bucket: env.S3_BUCKET,
    Prefix: folder,
  });
  const keepDate = addDays(new Date(), -keepDay);

  const objectsToDelete = list.Contents?.filter((file) => {
    // deno-lint-ignore no-explicit-any
    const fileDate = new Date(file.LastModified as any);
    return fileDate < keepDate;
  });

  if (objectsToDelete) {
    await s3Client.deleteObjects({
      Bucket: env.S3_BUCKET,
      Delete: {
        Objects: objectsToDelete.map((file) => ({ Key: file.Key! })),
      },
    });
  }
};

export const uploadS3AndRemoveOldS3 = async (
  filePath: string,
  scheduleName: string,
  keepDay: number
) => {
  const { name, ext } = parse(filePath);
  const folder = `${env.PREFIX_NAME}/${env.DATABASE}/${scheduleName}`;
  const filename = `${folder}/${name + ext}`;
  await uploadToS3(filePath, filename);
  await removeOldS3(keepDay, folder);
};
