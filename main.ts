import systemEnvironment from "./src/env/system.ts";
import { performBackup } from "./src/performBackup.ts";

async function main() {
  try {
    if (systemEnvironment.BACKUP_ON_STARTUP) {
      await performBackup();
    }
    console.log("Cron job started at ", systemEnvironment.SCHEDULE);
    Deno.cron(
      "cron backup database",
      systemEnvironment.SCHEDULE,
      performBackup
    );
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

main();
