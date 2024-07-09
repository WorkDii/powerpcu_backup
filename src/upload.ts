import { parse } from "@std/path";
import { uploadS3AndRemoveOldS3, uploadToS3 } from "./s3.ts";

const UPLOAD_STRATEGY = {
  daily: 14,
  weekly: 90,
  monthly: 365 * 2,
  yearly: 365 * 5,
};

async function uploadToAllFolder(filePath: string) {
  const { name, ext } = parse(filePath);
  await uploadToS3(filePath, `all/${name + ext}`);
}
export async function uploadFile(filePath: string) {
  // daily
  console.log("[daily] Uploading file...", new Date().toLocaleString());
  await uploadS3AndRemoveOldS3(filePath, "daily", UPLOAD_STRATEGY.daily);
  console.log("[daily] File uploaded!", new Date().toLocaleString());

  // all
  console.log("[all] Uploading file...", new Date().toLocaleString());
  await uploadToAllFolder(filePath);
  console.log("[all] File uploaded!", new Date().toLocaleString());

  // weekly
  if (new Date().getDay() === 0) {
    console.log("[weekly] Uploading file...", new Date().toLocaleString());
    uploadS3AndRemoveOldS3(filePath, "weekly", UPLOAD_STRATEGY.weekly);
    console.log("[weekly] File uploaded!", new Date().toLocaleString());
  }

  // monthly
  if (new Date().getDate() === 1) {
    console.log("[monthly] Uploading file...", new Date().toLocaleString());
    uploadS3AndRemoveOldS3(filePath, "monthly", UPLOAD_STRATEGY.monthly);
    console.log("[monthly] File uploaded!", new Date().toLocaleString());
  }

  // yearly
  if (new Date().getMonth() === 0 && new Date().getDate() === 1) {
    console.log("[yearly] Uploading file...", new Date().toLocaleString());
    uploadS3AndRemoveOldS3(filePath, "yearly", UPLOAD_STRATEGY.yearly);
    console.log("[yearly] File uploaded!", new Date().toLocaleString());
  }
}
