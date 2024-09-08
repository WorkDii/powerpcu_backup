import { load } from "@std/dotenv";
import { schema } from "./schema.ts";

const env = await load();
export function validateEnvironment() {
  const result = schema.safeParse(env);
  if (!result.success) {
    return { success: false, errors: result.error.format() };
  }
  return { success: true, data: result.data };
}
