import express from "express";
import { applyConfiguration, getLogger } from "./util";
import chalk from "chalk-template";

const app = express();
const logger = getLogger();

applyConfiguration(app);

app.use(express.static(new URL("../public", import.meta.url).pathname, {
  extensions: ["html"],
}));


logger.info(chalk`Bun\t{yellow ${Bun.version}}`);
if (app.get("trust proxy")) {
  logger.info("Assuming running behing proxy");
}

app.listen(3000, () => logger.info("Running on port", 3000));