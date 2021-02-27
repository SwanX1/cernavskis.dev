const path = require('path');
const fs = require('fs/promises');
const chalk = require('chalk');
fs.existsSync = require('fs').existsSync;

async function main() {
  const dir = path.join(require.resolve('spectre.css'), '..');
  if (!fs.existsSync('src/public/css/')) {
    console.log(chalk`{green 'src/public/css'} directory doesn't exist, creating...`)
    await fs.mkdir('src/public/css/', { recursive: true });
  }
  fs.copyFile(path.join(dir, 'spectre.css'), 'src/public/css/spectre.css')
    .then(() => console.log(chalk`Copied {green 'spectre.css'} into /src/public/css/`));
  fs.copyFile(path.join(dir, 'spectre-exp.css'), 'src/public/css/spectre-exp.css')
    .then(() => console.log(chalk`Copied {green 'spectre-exp.css'} into /src/public/css/`));
  fs.copyFile(path.join(dir, 'spectre-icons.css'), 'src/public/css/spectre-icons.css')
    .then(() => console.log(chalk`Copied {green 'spectre-icons.css'} into /src/public/css/`));
}

main();