'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const slowdown = require('express-slow-down');

if (!process.cwd().endsWith('src'))
  process.chdir('src');

app.use(morgan('dev'));
app.use(helmet());
app.use(slowdown({
  delayAfter: 100,
  windowMs: 10000, // 10 seconds
  onLimitReached: (req, res) => console.log(`${req.ip} has exceeded 100 requests in 10 seconds, possible DDOS attack?`)
}));
app.use(express.static('./public'));

app.get('/discord', (req, res) => res.redirect('https://discord.gg/BuSh7HC'));
app.get('/github', (req, res) => res.redirect('https://github.com/SwanX1'));

app.use((req, res) => {
  res.type('text/plain').status(404).send(`404 Not Found: ${req.url}`);
  res.end();
});

module.exports = app;