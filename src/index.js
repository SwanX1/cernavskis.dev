'use strict';

const fs = require('fs');
const https = require('https');
const app = require('./app');

if (!process.cwd().endsWith('src'))
    process.chdir('src');

const server = https.createServer({
    key: fs.readFileSync('../cert/private.key'),
    cert: fs.readFileSync('../cert/certificate.crt')
}, app);

if (!process.env.PORT) // Get environment PORT, command line PORT, default to 443.
    process.env.PORT = process.argv.slice(2).find((value, index, array) => array[index - 1] === '--port') || 443;

server.listen(Number(process.env.PORT), '0.0.0.0', () => console.log('Listening on port', Number(process.env.PORT)));