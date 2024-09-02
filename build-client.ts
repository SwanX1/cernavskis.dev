import { mkdir, unlink } from 'fs/promises';

const promises = [
  copySpectre(),
  build(),
];

async function copySpectre() {
  const spectreDir = new URL('./node_modules/@spectre-org/spectre-css/dist/', import.meta.url);
  const publicDir = new URL('./public/', import.meta.url);
  
  for (const file of ['spectre.min.css', 'spectre-icons.min.css']) {
    const source = new URL(file, spectreDir);
    const dest = new URL(file, publicDir);
    
    Bun.write(dest, Bun.file(source));
  }
}

async function build() {
  const buildOutput = await Bun.build({
    entrypoints: ['./client/index.tsx'],
    root: './client',
    format: 'esm',
    minify: true,
    sourcemap: 'inline',
    target: 'browser',
  });
  
  if (!buildOutput.success) {
    for (const log of buildOutput.logs) {
      console.error(log);
    }
  
    process.exit(1);
  }
  
  if (buildOutput.outputs.length !== 1) {
    console.error('Expected one output file, got ' + buildOutput.outputs.length);
    process.exit(1);
  }
  
  const [output] = buildOutput.outputs;
  
  if (output.kind !== 'entry-point') {
    console.error('Expected output to be an entry-point, got ' + output.kind);
    process.exit(1);
  }
  
  const filepath = new URL(output.path, new URL("./public/", import.meta.url));
  const dirpath = new URL('..', filepath);
  
  await mkdir(dirpath, { recursive: true });
  const outfile = Bun.file(filepath);
  
  if (await outfile.exists()) {
    await unlink(filepath);
  }
  
  await Bun.write(outfile, output);
}

await Promise.all(promises);