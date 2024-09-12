import { load } from "@std/dotenv";
const env = await load();
import { aes_gcm_decrypt } from "https://deno.land/x/crypto_aes_gcm@2.0.3/index.js";
import { schema } from "./schema.ts";
import systemEnv from "./system.ts";

const ENCRYPTED_SUFFIX = "|encrypted";
async function decryptIfEncrypted(
  value: string | undefined,
  encryptedKey: string
): Promise<string | undefined> {
  if (value?.includes(ENCRYPTED_SUFFIX)) {
    return await aes_gcm_decrypt(
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
      decryptedEnv[key] = await decryptIfEncrypted(
        value,
        systemEnv.ENCRYPTED_KEY
      );
    } else {
      decryptedEnv[key] = value;
    }
  }
  return decryptedEnv;
}
const parsedEnv = schema.parse(env);

export default await decryptAllFields(parsedEnv);
