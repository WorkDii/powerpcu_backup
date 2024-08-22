import { BlobWriter, ZipWriter } from "@zip-js/zip-js/data-uri";
import { parse, join } from "@std/path";

export const packFile = async (backupPath: string, password?: string) => {
  const { name, dir } = parse(backupPath);
  const file = await Deno.open(backupPath);
  const zipFileWriter = new BlobWriter();
  const zipWriter = new ZipWriter(zipFileWriter);
  await zipWriter.add(`${name}.sql`, file, { password });
  await zipWriter.close();
  const zipFileBlob = await zipFileWriter.getData();
  const target = join(dir, `${name}.rar`);
  await Deno.writeFile(target, new Uint8Array(await zipFileBlob.arrayBuffer()));
  return target;
};
