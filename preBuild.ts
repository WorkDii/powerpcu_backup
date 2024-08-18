import { copySync, ensureDir, emptyDir } from "@std/fs";

await ensureDir("build");
await emptyDir("build");

Deno.copyFileSync(".env.template", `build/.env`);
copySync("lib", "build/lib");

Deno.writeTextFile(
  "build/Readme.txt",
  `
  build time: ${new Date().toLocaleString()} น.
  โปรแกรมนี้เป็นโปรแกรมที่ใช้สำหรับการสำรองข้อมูล JHCIS ไปยัง S3
  จัดทำขึ้นโดย นายอุสมาน  การีมี  นักวิชาการคอมพิวเตอร์ปฏิบัติการ สสอ.หาดใหญ่

  หลักการทำงาน
  1. โปรแกรมจะทำการสำรองข้อมูล จากฐานข้อมูล
  2. ทำการ compress ไฟล์ เป็น .rar และ encrypt ด้วย password (OPTION)
  3. โปรแกรมจะทำการส่งไฟล์ไปยัง S3
  4. โปรแกรมจะทำการส่งไฟล์ไปยัง local
  5. โปรแกรมจะทำการลบไฟล์ที่เก่าออกจาก local และ S3
      5.1 โดยจะเก็บไฟล์ที่สำรองไว้ตามระยะเวลาที่กำหนด
        ไฟล์รายวัน 14 วัน
        ไฟล์รายสัปดาห์ 90 วัน
        ไฟล์รายเดือน 2 ปี
        ไฟล์รายปี 5 ปี
  6. โปรแกรมจะทำการสร้าง cron job ตามเวลาที่กำหนด
  `
);
