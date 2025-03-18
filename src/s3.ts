import { S3Client } from "@bradenmacdonald/s3-lite-client";
import { parse } from "@std/path";

import { addDays } from "date-fns";
import env from "./env/index.ts";

// Extracted the common logic of creating a S3 client into a separate function
const createS3Client = () => {
  if (
    !env.S3_ENDPOINT ||
    !env.S3_REGION ||
    !env.S3_ACCESS_KEY_ID ||
    !env.S3_SECRET_KEY ||
    !env.S3_BUCKET
  ) {
    return null;
  }
  return new S3Client({
    endPoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    bucket: env.S3_BUCKET,
    accessKey: env.S3_ACCESS_KEY_ID,
    secretKey: env.S3_SECRET_KEY,
  });
};

export const s3Client = createS3Client();

export const uploadToS3 = async (filePath: string, Key: string) => {
  await s3Client?.putObject(
    Key,
    await Deno.readFile(filePath)
  );
};

export const removeOldS3 = async (keepDay: number, folder: string) => {
  const list = await s3Client?.listObjects({
    prefix: folder,
  });
  const keepDate = addDays(new Date(), -keepDay);
  if (list) {
    for await (const obj of list) {
      const fileDate = new Date(obj.lastModified);
      if (fileDate < keepDate) {
        await s3Client?.deleteObject(obj.key);
      }
    }
  }
};

export const remainLastObject = async (prefix: string) => {
  const list = await s3Client?.listObjects({
    prefix,
  });
  const objects = [];
  for await (const obj of list || []) {
    objects.push(obj);
  }
  const sortedObjects = objects.sort((a, b) =>
    b.lastModified.getTime() - a.lastModified.getTime()
  );
  // Keep the newest file, delete all others
  for (let i = 1; i < sortedObjects.length; i++) {
    await s3Client?.deleteObject(sortedObjects[i].key);
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
