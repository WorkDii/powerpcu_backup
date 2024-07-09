import { join } from "@std/path";
import { format } from "date-fns";

export const makeBackupFile = async (
  mysqldumpPath: string,
  database: string,
  host: string,
  port: string | number,
  user: string,
  password: string,
  pcuCode: string
) => {
  console.log("Creating backup file...", new Date().toLocaleString());
  const tempDir = await Deno.makeTempDir();
  const tempFilePath = join(
    tempDir,
    `${pcuCode}_${database}_${format(new Date(), "yyyy_MM_dd_HH_mm_ss")}.sql`
  );
  await new Deno.Command("cmd", {
    args: [
      "cmd",
      "/C",
      mysqldumpPath,
      database,
      `--result-file=${tempFilePath}`,
      `--host=${host}`,
      `--port=${port}`,
      `--user=${user}`,
      `--password=${password}`,
    ],
  }).output();
  console.log("Backup file created!", new Date().toLocaleString());
  return tempFilePath;
};
