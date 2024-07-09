import { join } from "@std/path";
import env from "./env.ts";

export function uploadToLocal(filePath: string) {
  const targetPath = join(
    env.LOCAL_BACKUP_PATH,
    `${env.PCUCODE}_${env.DATABASE}_${new Date().getDay()}.sql.enc`
  );
  Deno.copyFileSync(filePath, targetPath);
}
