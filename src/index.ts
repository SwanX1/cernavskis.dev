import express from "express";
import compression from "compression";
import { applyConfiguration, getLogger } from "./util";
import chalk from "chalk-template";

const app = express();
const logger = getLogger();

applyConfiguration(app);

app.use(compression({ level: 9 }));
app.get("/tools/lu-saraksts", (_req, res) => res.redirect(301, "/lulsv"));
app.use(express.static(new URL("../dist", import.meta.url).pathname, {
  extensions: ["html"],
}));


logger.info(chalk`Bun\t{yellow ${Bun.version}}`);
if (app.get("trust proxy")) {
  logger.info("Assuming running behind proxy");
}

app.listen(3000, () => logger.info("Running on port", 3000));