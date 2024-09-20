import { assertEquals } from "jsr:@std/assert";
import { schema } from "./schema.ts";

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
