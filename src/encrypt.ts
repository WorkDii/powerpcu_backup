import { parse, join } from "@std/path";

function appendBuffer(buffer1: Uint8Array, buffer2: Uint8Array): Uint8Array {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp;
}

async function hashPass(password: string) {
  const pwUtf8 = new TextEncoder().encode(password);
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);
  return pwHash;
}

export async function encrypt(data: Uint8Array, password: string) {
  if (!crypto.subtle.importKey || !crypto.subtle.encrypt) {
    console.log("Unexpected error");
  } else {
    const pwHash = await hashPass(password);

    const iv = crypto.getRandomValues(new Uint8Array(16));

    const alg = { name: "AES-CBC", iv: iv };

    const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
      "encrypt",
    ]);

    return { iv, ctBuffer: await crypto.subtle.encrypt(alg, key, data) };
  }
}

export async function encryptFile(filePath: string, password: string) {
  const file = await Deno.readFile(filePath);
  const data = await encrypt(file, password);
  if (!data) {
    throw new Error("cannot encrypt file");
  }
  const encBuffer = appendBuffer(data.iv, data.ctBuffer as Uint8Array);
  const encFilePath = `${filePath}.enc`;
  await Deno.writeFile(encFilePath, encBuffer);
  return encFilePath;
}

export async function decrypt(encData: Uint8Array, password: string) {
  if (encData.length < 16) {
    console.log("Invalid encData");
  } else if (!crypto.subtle.importKey || !crypto.subtle.decrypt) {
    console.log("Unexpected error");
  } else {
    const pwHash = await hashPass(password);

    console.log("Extracting IV");
    const iv: Uint8Array = encData.slice(0, 16);
    const alg = { name: "AES-CBC", iv: iv };
    const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
      "decrypt",
    ]);
    console.log("Decrypting archive");
    const cipherData = encData.slice(16);
    return await crypto.subtle.decrypt(alg, key, cipherData);
  }
}

export async function decryptFile(encFilePath: string, password: string) {
  const encFileParse = parse(encFilePath);
  const encFile = await Deno.readFile(encFilePath);
  const decryptBuffer = await decrypt(encFile, password);
  if (decryptBuffer) {
    const decFilePath = join(encFileParse.dir, "decrypt_" + encFileParse.name);
    await Deno.writeFile(decFilePath, new Uint8Array(decryptBuffer));
    return encFilePath;
  } else {
    console.log("Unexpected error");
  }
}
