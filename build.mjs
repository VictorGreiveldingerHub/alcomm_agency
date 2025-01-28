import { build } from "esbuild";
import config from "./esbuild.config.mjs";

build(config).catch((e) => {
  console.error(e);
  process.exit(1);
});
