import { parse } from "@std/path";
import { removeOldS3, uploadS3AndRemoveOldS3, uploadToS3 } from "./s3.ts";
import env from "./env/index.ts";

async function uploadToAllFolder(filePath: string) {
  const { name, ext } = parse(filePath);
  await uploadToS3(filePath, `all/${name + ext}`);
  await removeOldS3(1, "all");
}
export async function uploadFile(filePath: string) {
  console.log(
    "===========uploadFileToS3============",
    new Date().toLocaleString()
  );
  // daily
  console.time("[daily] S3");
  await uploadS3AndRemoveOldS3(filePath, "daily", env.KEEP_FILE_DAILY);
  console.timeEnd("[daily] S3");

  // weekly
  if (new Date().getDay() === 0) {
    console.time("[weekly] S3");
    uploadS3AndRemoveOldS3(filePath, "weekly", env.KEEP_FILE_MONTHLY);
    console.timeEnd("[weekly] S3");
  }

  // monthly
  if (new Date().getDate() === 1) {
    console.time("[monthly] S3");
    uploadS3AndRemoveOldS3(filePath, "monthly", env.KEEP_FILE_MONTHLY);
    console.timeEnd("[monthly] S3");
  }

  // yearly  วันที่ 1 เดือน 10 คือวันที่สำรองข้อมูล รายปี
  if (new Date().getMonth() === 9 && new Date().getDate() === 1) {
    console.time("[yearly] S3");
    uploadS3AndRemoveOldS3(filePath, "yearly", env.KEEP_FILE_YEARLY);
    console.timeEnd("[yearly] S3");
  }

  // all
  console.time("[all] S3");
  await uploadToAllFolder(filePath);
  console.timeEnd("[all] S3");
}
