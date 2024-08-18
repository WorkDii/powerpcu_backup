import { join, parse } from "@std/path";
import env from "./env.ts";
import { ensureDir } from "@std/fs";
import { addDays } from "date-fns";

async function copyFile(schedule: string, backupPath: string) {
  const { name, ext } = parse(backupPath);
  const folder = join(env.LOCAL_BACKUP_PATH, schedule);
  await ensureDir(folder);
  const targetPath = join(folder, name + ext);
  Deno.copyFileSync(backupPath, targetPath);
}

async function removeOld(schedule: string, keepDay: number) {
  const folder = join(env.LOCAL_BACKUP_PATH, schedule);
  for (const dirEntry of Deno.readDirSync(folder)) {
    const birthtime = (await Deno.statSync(join(folder, dirEntry.name)))
      .birthtime;
    const keepDate = addDays(new Date(), -keepDay);
    if (birthtime && birthtime < keepDate) {
      Deno.removeSync(join(folder, dirEntry.name));
    }
  }
}

export async function uploadToLocal(backupPath: string) {
  console.log(
    "===========uploadToLocal============",
    new Date().toLocaleString()
  );
  // daily
  console.time("[daily] local");
  await copyFile("daily", backupPath);
  await removeOld("daily", env.KEEP_FILE_DAILY);
  console.timeEnd("[daily] local");

  // weekly
  if (new Date().getDay() === 0) {
    console.time("[weekly] local");
    await copyFile("weekly", backupPath);
    await removeOld("weekly", env.KEEP_FILE_WEEKLY);
    console.timeEnd("[weekly] local");
  }

  // monthly
  if (new Date().getDate() === 1) {
    console.time("[monthly] local");
    await copyFile("monthly", backupPath);
    await removeOld("monthly", env.KEEP_FILE_MONTHLY);
    console.timeEnd("[monthly] local");
  }

  // yearly  วันที่ 1 เดือน 10 คือวันที่สำรองข้อมูล รายปี
  if (new Date().getMonth() === 9 && new Date().getDate() === 1) {
    console.time("[yearly] local");
    await copyFile("yearly", backupPath);
    await removeOld("yearly", env.KEEP_FILE_YEARLY);
    console.timeEnd("[yearly] local");
  }
}
