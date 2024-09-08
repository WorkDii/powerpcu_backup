import { load } from "@std/dotenv";
import { join } from "jsr:@std/path@^1.0.2/join";
import z from "zod";
const envBuild = await load({ envPath: ".env.build" });

export const schema = z.object({
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
  LOCAL_BACKUP_PATH: z.string(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),

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
export type Env = z.infer<typeof schema>;

export const systemSchema = z.object({
  ENCRYPTED_KEY: z
    .string()
    .default(Deno.env.get("ENCRYPTED_KEY") || envBuild["ENCRYPTED_KEY"] || ""),
  SCHEDULE: z.string().optional().default("30 20 * * *"), // is 03:30 bangkok time
  BACKUP_ON_STARTUP: z.boolean().default(true),
});

export type SystemEnv = z.infer<typeof systemSchema>;
