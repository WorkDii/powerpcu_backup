import z from "zod";
import { load } from "@std/dotenv";
const envS3 = await load({ envPath: ".env.s3" });
const env = await load();
const envBuild = await load({ envPath: ".env.build" });
import { aesGcmDecrypt } from "@crypto/aes-gcm";
import { join } from "@std/path";

const schema = z.object({
  MYSQLDUMP_PATH: z
    .string()
    .optional()
    .default(join("lib", "mysql-5.6.45-winx64", "mysqldump.exe")),
  DATABASE: z.string().optional().default("jhcisdb"),
  HOST: z.string().optional().default("localhost"),
  PORT: z.string().optional().default("3306"),
  USER: z.string(),
  PASSWORD: z.string(),
  PREFIX_NAME: z.string(),
  RAR_PASSWORD: z.string().optional(),
  // utc time zone
  SCHEDULE: z.string().optional().default("30 20 * * *"), // is 03:30 bangkok time
  LOCAL_BACKUP_PATH: z.string(),
  S3_ENDPOINT: z.string(),
  S3_REGION: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_BUCKET: z.string(),
  S3_RAR_PASSWORD: z.string(),
  ENCRYPTED_KEY: z.string(),
  KEEP_FILE_DAILY: z.number().optional().default(14),
  KEEP_FILE_WEEKLY: z.number().optional().default(90),
  KEEP_FILE_MONTHLY: z
    .number()
    .optional()
    .default(365 * 2),
  KEEP_FILE_YEARLY: z
    .number()
    .optional()
    .default(365 * 5),
});

const _env = schema.parse({ ...envS3, ...env, ...envBuild });

const ENC_KEY = "|encrypted";
if (_env.S3_ENDPOINT.includes(ENC_KEY)) {
  _env.S3_ENDPOINT = await aesGcmDecrypt(
    _env.S3_ENDPOINT.replaceAll(ENC_KEY, ""),
    _env.ENCRYPTED_KEY
  );
  _env.S3_ACCESS_KEY_ID = await aesGcmDecrypt(
    _env.S3_ACCESS_KEY_ID.replaceAll(ENC_KEY, ""),
    _env.ENCRYPTED_KEY
  );
  _env.S3_SECRET_KEY = await aesGcmDecrypt(
    _env.S3_SECRET_KEY.replaceAll(ENC_KEY, ""),
    _env.ENCRYPTED_KEY
  );
  _env.S3_BUCKET = await aesGcmDecrypt(
    _env.S3_BUCKET.replaceAll(ENC_KEY, ""),
    _env.ENCRYPTED_KEY
  );
  _env.S3_REGION = await aesGcmDecrypt(
    _env.S3_REGION.replaceAll(ENC_KEY, ""),
    _env.ENCRYPTED_KEY
  );
  _env.S3_RAR_PASSWORD = await aesGcmDecrypt(
    _env.S3_RAR_PASSWORD.replaceAll(ENC_KEY, ""),
    _env.ENCRYPTED_KEY
  );
}
export default _env;
