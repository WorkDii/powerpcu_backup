import { parse } from "@std/path";

export function removeTemp(backupPath: string) {
  const { dir } = parse(backupPath);
  Deno.remove(dir, { recursive: true });
}
