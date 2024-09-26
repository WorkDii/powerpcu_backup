import { assertEquals } from "jsr:@std/assert";
import { schema, systemSchema } from "./schema.ts";

Deno.test("schema test", () => {
  const parsedData = schema.parse({
    DATABASE: "test",
    HOST: "localhost",
    PORT: "3306",
    USER: "root",
    PASSWORD: "1234",
    PREFIX_NAME: "test",
    LOCAL_BACKUP_PATH: "backup",
    KEEP_FILE_DAILY: "20",
    KEEP_FILE_WEEKLY: 90,
  });
  assertEquals(20, parsedData.KEEP_FILE_DAILY);
  assertEquals(90, parsedData.KEEP_FILE_WEEKLY);
  assertEquals("test", parsedData.DATABASE);
  assertEquals("localhost", parsedData.HOST);
  assertEquals("3306", parsedData.PORT);
  assertEquals("root", parsedData.USER);
  assertEquals("1234", parsedData.PASSWORD);
  assertEquals("test", parsedData.PREFIX_NAME);
  assertEquals("backup", parsedData.LOCAL_BACKUP_PATH);
  assertEquals(
    "lib\\mysql-5.6.45-winx64\\mysqldump.exe",
    parsedData.MYSQLDUMP_PATH
  );
});

Deno.test("systemSchema test", () => {
  const parsedData = systemSchema.parse({
    ENCRYPTED_KEY: "test",
    SCHEDULE: "30 20 * * *",
    BACKUP_ON_STARTUP: " True",
  });
  assertEquals("test", parsedData.ENCRYPTED_KEY);
  assertEquals("30 20 * * *", parsedData.SCHEDULE);
  assertEquals(true, parsedData.BACKUP_ON_STARTUP);

  const parsedDataFalse = systemSchema.parse({
    ENCRYPTED_KEY: "test",
    SCHEDULE: "30 20 * * *",
    BACKUP_ON_STARTUP: "false",
  });
  assertEquals(false, parsedDataFalse.BACKUP_ON_STARTUP);

  const parsedDataBoolean = systemSchema.parse({
    ENCRYPTED_KEY: "test",
    SCHEDULE: "30 20 * * *",
    BACKUP_ON_STARTUP: true,
  });

  assertEquals(true, parsedDataBoolean.BACKUP_ON_STARTUP);
});
