
import config from "./config.json" with { type: "json" }
import { encryptFile } from "./src/encrypt.ts";
import {copySync, ensureDir, emptyDir } from "@std/fs";

await ensureDir("build");
await emptyDir('build')

const fileName = "config.storage.json"
const fileNameEnc = fileName + ".enc"
await encryptFile(fileName, config.ENCRYPTED_KEY); 

Deno.copyFileSync(fileNameEnc, `build/${fileNameEnc}`);

copySync('lib', 'build/lib');