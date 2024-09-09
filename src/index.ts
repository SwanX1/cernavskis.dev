import chalk from "chalk-template";
import compression from "compression";
import express from "express";
import { applyConfiguration, getLogger } from "./util";

const app = express();
const logger = getLogger();

applyConfiguration(app);

app.use(compression({ level: 9 }));
app.get("/tools/lu-saraksts", (_req, res) => res.redirect(301, "/lulsv"));

const LULSV_PEOPLE: Record<string, string> = await Bun.file(
  new URL("./data/lulsv_people.json", import.meta.url).pathname
).json();
const LULSV_PEOPLE_KEYS = Object.keys(LULSV_PEOPLE);

app.get("/lulsv/data/all", (_req, res) => {
  res.json(LULSV_PEOPLE_KEYS);
  return res.end();
});

app.get("/lulsv/data/:name", (req, res, next) => {
  if (req.params.name in LULSV_PEOPLE) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end(LULSV_PEOPLE[req.params.name]);
  } else {
    return next();
  }
});

app.use(
  express.static(new URL("../dist", import.meta.url).pathname, {
    extensions: ["html"],
  })
);

logger.info(chalk`Bun\t{yellow ${Bun.version}}`);
if (app.get("trust proxy")) {
  logger.info("Assuming running behind proxy");
}

app.listen(3000, () => logger.info("Running on port", 3000));
