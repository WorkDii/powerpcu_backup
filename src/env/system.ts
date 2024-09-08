import { load } from "@std/dotenv";
const env = await load();
import { systemSchema } from "./schema.ts";

export default systemSchema.parse(env);
