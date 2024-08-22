import { makeBackupFile } from "./src/backup.ts";
import env from "./src/env.ts";
import { uploadFile } from "./src/upload.ts";
import { removeTemp } from "./src/removeTemp.ts";
import { uploadToLocal } from "./src/uploadToLocal.ts";
import { packFile } from "./src/zip.ts";

async function job() {
  console.time("backup");
  console.log("Start backup database", new Date().toLocaleString());
  const backupPath = await makeBackupFile(
    env.MYSQLDUMP_PATH,
    env.DATABASE,
    env.HOST,
    env.PORT,
    env.USER,
    env.PASSWORD,
    env.PREFIX_NAME
  );
  if (
    env.S3_ENDPOINT &&
    env.S3_BUCKET &&
    env.S3_ACCESS_KEY_ID &&
    env.S3_SECRET_KEY &&
    env.S3_REGION &&
    env.S3_RAR_PASSWORD
  ) {
    const packedFilePath = await packFile(backupPath, env.S3_RAR_PASSWORD);
    await uploadFile(packedFilePath);
  } else {
    console.log("S3 config not found, skip upload to S3");
  }
  const packedFileLocalPath = await packFile(backupPath, env.RAR_PASSWORD);
  await uploadToLocal(packedFileLocalPath);
  await removeTemp(backupPath);
  console.timeEnd("backup");
}
try {
  job();
  console.log("Cron job started at ", env.SCHEDULE);
  Deno.cron("cron backup database", env.SCHEDULE, job);
} catch (error) {
  console.log(error);
}
