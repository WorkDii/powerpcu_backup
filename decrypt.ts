import { decryptFile } from "./src/encrypt.ts";
import { ensureFile } from "@std/fs";
import { join } from "@std/path";
import c from "./config.json" with { type: "json" };
import { deCompressFile } from "./src/compress.ts";
import { load } from "@std/dotenv";

const env = await load()
 
const URL = env.TARGET_DECRYPT_URL
const fileFetch = await fetch(URL);  

if (fileFetch.body) {
  const targetPath = join("decryptData", "data.sql.gz.enc");
  await ensureFile(targetPath);
  const file = await Deno.open(targetPath, {
    write: true,
    create: true,
  });
  await fileFetch.body.pipeTo(file.writable);
  const compressFile = await decryptFile(targetPath, c.ENCRYPTED_KEY); 
  await deCompressFile(compressFile)

}
