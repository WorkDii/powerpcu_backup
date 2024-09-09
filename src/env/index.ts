import { load } from "@std/dotenv";
const env = await load();
import { aesGcmDecrypt } from "@crypto/aes-gcm";
import { schema } from "./schema.ts";
import systemEnv from "./system.ts";

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
