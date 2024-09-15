import { zip } from "zip-a-folder";

await zip("build", "power_pcu_backup.zip");

// for testing in local machine
// await Deno.copyFile(
//   "build\\power_pcu_backup.exe",
//   "C:\\power_pcu_backup\\power_pcu_backup.exe"
// );
