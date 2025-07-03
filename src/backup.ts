import { join } from "@std/path";
import { format } from "date-fns";

export const makeBackupFile = async (
  mysqldumpPath: string,
  database: string,
  host: string,
  port: string | number,
  user: string,
  password: string,
  namePrefix: string
) => {
  console.log("Creating backup file...", new Date().toLocaleString());
  const tempDir = await Deno.makeTempDir();
  const tempFilePath = join(
    tempDir,
    `${namePrefix}_${database}_${format(new Date(), "yyMMddHHmm")}.sql`
  );
  const p = await new Deno.Command("cmd", {
    args: [
      "cmd",
      "/C",
      mysqldumpPath,
      database,
      "--routines",
      "--events",
      `--result-file=${tempFilePath}`,
      `--host=${host}`,
      `--port=${port}`,
      `--user=${user}`,
      `--password=${password}`,
    ],
  }).output();
  if (!p.success) {
    throw new Error(new TextDecoder().decode(p.stderr));
  }
  console.log("Backup file created!", new Date().toLocaleString());
  return tempFilePath;
};
