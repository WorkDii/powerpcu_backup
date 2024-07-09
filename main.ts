import { makeBackupFile } from "./src/backup.ts";
import { compressFile } from "./src/compress.ts";
import env from "./src/env.ts";
import { uploadFile } from "./src/upload.ts";
import { encryptFile } from "./src/encrypt.ts";
import config from './config.json' with { type: "json" };

async function job() {
  console.log("Start backup database", new Date().toLocaleString());
  const { ENCRYPTED_KEY} = config
  const backupPath = await makeBackupFile(
    env.MYSQLDUMP_PATH,
    env.DATABASE,
    env.HOST,
    env.PORT,
    env.USER, 
    env.PASSWORD,
    env.PCUCODE
  );
  const compressFilePath = await compressFile(backupPath);
  const encFilePath = await encryptFile(compressFilePath, ENCRYPTED_KEY);
  await uploadFile(encFilePath)
  console.log("Backup database done", new Date().toLocaleString());
}

try { 
  job()
  console.log("Cron job started at ", env.SCHEDULE);
  Deno.cron("cron backup database", env.SCHEDULE, job);
} catch (error) {
  console.log(error); 
}
