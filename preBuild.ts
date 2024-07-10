
import config from "./config.json" with { type: "json" }
import { encryptFile } from "./src/encrypt.ts";
import {copySync, ensureDir, emptyDir } from "@std/fs";

await ensureDir("build");
await emptyDir('build')

const fileName = "config.storage.json"
const fileNameEnc = fileName + ".enc"
await encryptFile(fileName, config.ENCRYPTED_KEY); 

Deno.copyFileSync(fileNameEnc, `build/${fileNameEnc}`);
Deno.copyFileSync('.env.template', `build/.env`);

Deno.writeTextFile('build/Readme.txt', `
  build time: ${new Date().toLocaleString()} น.
  โปรแกรมนี้เป็นโปรแกรมที่ใช้สำหรับการสำรองข้อมูล JHCIS ไปยัง S3
  จัดทำขึ้นโดย นายอุสมาน  การีมี  นักวิชาการคอมพิวเตอร์ปฏิบัติการ สสอ.หาดใหญ่
  สำหรับใช้งานภายใน สสอ.หาดใหญ่ เท่านั้น

  หลักการทำงาน
  1. โปรแกรมจะทำการสำรองข้อมูล จากฐานข้อมูล
  2. โปรแกรมจะทำการ compress ไฟล์ เป็น gzip
  3. โปรแกรมจะทำการเข้ารหัสไฟล์  ด้วยคีย์ 
  4. โปรแกรมจะทำการส่งไฟล์ไปยัง S3
  `)

copySync('lib', 'build/lib');