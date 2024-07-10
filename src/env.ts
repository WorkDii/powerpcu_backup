import z from "zod";
import { load } from "@std/dotenv";
const env = await load();
import c from '../config.json' with { type: "json" };
import { decrypt } from "./encrypt.ts";
 
const { ENCRYPTED_KEY} = c;
const cs = await Deno.readFile('config.storage.json.enc')
const dc = await decrypt(cs, ENCRYPTED_KEY)

const schema = z.object({
  MYSQLDUMP_PATH: z
  .string()
  .optional()
  .default("lib\\mysql-5.6.45-winx64\\mysqldump.exe"),
  DATABASE: z.string().optional().default("jhcisdb"),
  HOST: z.string().optional().default("localhost"),
  PORT: z.string().optional().default("3306"),
  USER: z.string(),
  PASSWORD: z.string(),
  PCUCODE: z.string(),
  // utc time zone
  SCHEDULE: z.string().optional().default("30 20 * * *"), // is 03:30 bangkok time
  LOCAL_BACKUP_PATH: z.string(),
});


// const  ENCRYPTED_KEY= c.ENCRYPTED_KEY;
const _env = schema.parse(env);
const s3Env = JSON.parse(new TextDecoder().decode(dc))
export default {..._env,  ...s3Env, ENCRYPTED_KEY,}

