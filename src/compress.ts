import { join, parse } from "@std/path";
import { ensureFile } from "@std/fs";

export const compressFile = async (targetPath: string) => {
  const src = await Deno.open(targetPath);
  const dest = await Deno.open(`${targetPath}.gz`, {
    create: true,
    write: true,
  });
  console.log("Compressing file...", new Date().toLocaleString());
  await src.readable
    .pipeThrough(new CompressionStream("gzip"))
    .pipeTo(dest.writable);
  console.log("File compressed!", new Date().toLocaleString());
  return `${targetPath}.gz`;
};

export const deCompressFile = async (targetPath: string) => {
  const { name, dir } = parse(targetPath);
  const src = await Deno.open(targetPath);
  const resultPath = join(dir, name);
  await ensureFile(resultPath);
  const dest = await Deno.open(resultPath, {
    create: true,
    write: true,
  });
  console.log("DeCompressing file...", new Date().toLocaleString());
  await src.readable
    .pipeThrough(new DecompressionStream("gzip"))
    .pipeTo(dest.writable);
  console.log("File deCompressed!", new Date().toLocaleString());
  return resultPath;
};
