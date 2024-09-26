import { load } from "@std/dotenv";
import { join } from "jsr:@std/path@^1.0.2/join";
import z from "zod";
const envBuild = await load({ envPath: ".env.build" });

export const schema = z.object({
  MYSQLDUMP_PATH: z
    .string()
    .optional()
    .default(join("lib", "mysql-5.6.45-winx64", "mysqldump.exe")),

  DATABASE: z.string().min(1, "Database name is required"),
  HOST: z.string().min(1, "Host is required"),
  PORT: z.string().regex(/^\d+$/, "Port must be a number"),
  USER: z.string().min(1, "User is required"),
  PASSWORD: z.string().min(1, "Password is required"),
  PREFIX_NAME: z.string().min(1, "Prefix name is required"),
  ENCRYPTION_PASSWORD: z.string().optional(),
  LOCAL_BACKUP_PATH: z.string().min(1, "Local backup path is required"),

  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ENCRYPTION_PASSWORD: z.string().optional(),

  KEEP_FILE_DAILY: z.number({ coerce: true }).optional().default(14),
  KEEP_FILE_WEEKLY: z.number({ coerce: true }).optional().default(90),
  KEEP_FILE_MONTHLY: z
    .number({ coerce: true })
    .optional()
    .default(365 * 2),
  KEEP_FILE_YEARLY: z
    .number({ coerce: true })
    .optional()
    .default(365 * 5),
});
export type Env = z.infer<typeof schema>;

export const systemSchema = z.object({
  ENCRYPTED_KEY: z
    .string()
    .default(Deno.env.get("ENCRYPTED_KEY") || envBuild["ENCRYPTED_KEY"] || ""),
  SCHEDULE: z.string().optional().default("30 20 * * *"), // is 03:30 bangkok time
  BACKUP_ON_STARTUP: z
    .union([
      z.boolean(),
      z.string().transform((val) => val.trim().toLowerCase() === "true"),
    ])
    .default(true),
});

export type SystemEnv = z.infer<typeof systemSchema>;
