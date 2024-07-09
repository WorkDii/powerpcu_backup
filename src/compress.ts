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
