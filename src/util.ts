import chalk from "chalk-template";
import cors from "cors";
import type { Express } from "express";
import helmet from "helmet";
import { Logger, util } from "logerian";

export function applyConfiguration(app: Express): void {
  app.disable("x-powered-by");
  if (typeof Bun.env.TRUST_PROXY === "undefined") {
    app.set("trust proxy", false);
  } else if (!Number.isNaN(Number(Bun.env.TRUST_PROXY))) {
    app.set("trust proxy", Number(Bun.env.TRUST_PROXY));
  } else if (["true", "false"].includes(Bun.env.TRUST_PROXY)) {
    app.set("trust proxy", Boolean(Bun.env.TRUST_PROXY));
  } else {
    app.set("trust proxy", Bun.env.TRUST_PROXY);
  }

  const logger = getLogger();

  app.use((req, res, next) => {
    const startedAt = process.hrtime();

    res.on("finish", () => {
      if (/^\/(js|css)/.test(req.url) && res.statusCode < 400) {
        return;
      }

      const color =
        res.statusCode >= 500
          ? "red"
          : res.statusCode >= 400
            ? "yellow"
            : res.statusCode >= 300
              ? "cyan"
              : res.statusCode >= 200
                ? "green"
                : "white";

      const elapsed = process.hrtime(startedAt);
      const elapsedMs = elapsed[0] * 1e3 + elapsed[1] / 1e6;
      logger.debug(
        chalk`\t${(req.ip ?? "unknown ip").padEnd(15, " ")} - ${req.method.padEnd(4, " ")} ${
          req.originalUrl
        } {${color} ${res.statusCode}} ${elapsedMs.toFixed(3)}ms`
      );
    });

    return next();
  });

  app.use(cors({ origin: "*" }));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "default-src": ["*"],
          "img-src": ["*"],
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          "script-src-attr": ["'unsafe-inline'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      dnsPrefetchControl: true,
      frameguard: true,
      hidePoweredBy: true,
      hsts: true,
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: {
        policy: "same-origin",
      },
      xssFilter: true,
    })
  );
}

const defaultLogger = new Logger({
  streams: [
    {
      level: Bun.env.VERBOSE === "true" ? "DEBUG" : "INFO",
      stream: process.stdout,
      prefix: util.coloredLog,
    },
  ],
});

export function getLogger(): Logger {
  return defaultLogger;
}
