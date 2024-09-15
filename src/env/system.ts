import { load } from "@std/dotenv";
const env = await load();
const envProduction = await load({ envPath: "production.env" });
import { systemSchema } from "./schema.ts";

export default systemSchema.parse({ ...env, ...envProduction });
