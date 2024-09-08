import systemEnvironment from "./src/env/system.ts";
import { validateEnvironment } from "./src/env/validateEnvironment.ts";
import { performBackup } from "./src/performBackup.ts";
async function main() {
  const isInitialProgramCheckEnabled = Deno.args.includes(
    "--initial-program-check"
  );
  if (isInitialProgramCheckEnabled) {
    const validationErrors = validateEnvironment();
    if (validationErrors.errors) {
      console.error("Validation error:", validationErrors.errors);
    }
  } else {
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
}

main();
