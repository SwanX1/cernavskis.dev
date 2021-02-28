'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const app = require('./app');
const json5 = require('json5');
const chalk = require('chalk');
// Set config variables
const config = json5.parse(fs.readFileSync('../config.json5'));
let port, hostname;
// '??' operator not used, because the port cannot be 0
port = Number(getArgument('--port', '-P')) || config.port || Number(process.env.PORT) || 8080;
hostname = getArgument('--host', '-H') ?? config.host ?? process.env.HOST ?? '0.0.0.0';

if (!process.cwd().endsWith('src'))
  process.chdir('src');

let server;
if (config.https || hasFlag('--https')) {
  const certPath = path.join('..', getArgument('--cert', '-C') || config.certdir || 'cert');
  server = https.createServer({
    key: fs.readFileSync(path.join(certPath, 'private.key')),
    cert: fs.readFileSync(path.join(certPath, 'certificate.crt'))
  }, app);
} else {
  server = http.createServer(app);
}

server.listen(port, hostname, () => console.log(chalk`Listening on port {yellow ${port}}`));

/**
 * Gets arguments from process.argv,
 * returns undefined if not set
 * @param  {...string} identifiers
 */
function getArgument(...identifiers) {
  let value;
  for (const identifier of identifiers) {
    value = process.argv.slice(2).find((value, index, array) => array[index - 1] === identifier);
    if (value) break;
  }
  return value ?? null; // Return null if undefined
}

/**
 * Returns true if any flags have been set in process.argv
 * @param  {...string} identifiers
 */
function hasFlag(...identifiers) {
  return process.argv.slice(2).some(value => identifiers.includes(value));
}