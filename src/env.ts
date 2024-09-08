import z from "zod";
import { load } from "@std/dotenv";
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
  ENCRYPTION_PASSWORD: z.string().optional(),
  SCHEDULE: z.string().optional().default("30 20 * * *"), // is 03:30 bangkok time
  LOCAL_BACKUP_PATH: z.string(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  ENCRYPTED_KEY: z
    .string()
    .default(Deno.env.get("ENCRYPTED_KEY") || envBuild["ENCRYPTED_KEY"] || ""),
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

const _env = schema.parse(env);

const ENCRYPTED_SUFFIX = "|encrypted";

async function decryptIfEncrypted(
  value: string | undefined,
  encryptedKey: string
): Promise<string | undefined> {
  if (value?.includes(ENCRYPTED_SUFFIX)) {
    return await aesGcmDecrypt(
      value.replaceAll(ENCRYPTED_SUFFIX, ""),
      encryptedKey
    );
  }
  return value;
}

async function decryptAllFields(
  env: Record<string, any>
): Promise<Record<string, any>> {
  const decryptedEnv: Record<string, any> = {};
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string") {
      decryptedEnv[key] = await decryptIfEncrypted(value, env.ENCRYPTED_KEY);
    } else {
      decryptedEnv[key] = value;
    }
  }
  return decryptedEnv;
}

const decryptedEnv = await decryptAllFields(_env);

export default decryptedEnv;
