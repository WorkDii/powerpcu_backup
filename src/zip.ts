import { parse, join } from "@std/path";
export const packFile = async (backupPath: string, sevenzipPath: string, password?: string) => {
  const { name, dir } = parse(backupPath);
  const target = join(dir, `${name}.zip`);
  const p = await new Deno.Command(sevenzipPath, {
    args: [
      "a",
      "-tzip",
      password ? '-mem=AES256' : "",
      password ? ("-p" + password) : "",
      target,
      backupPath,
    ].filter(Boolean),
  }).output();
  const { success, code } = p;
  if (!success) {
    throw new Error(`7zip compression failed with code ${code}`);
  }
  return target;
};
