import { ModuleTree } from "vuex";
import RootState from "@/store/states";

const modules: ModuleTree<RootState> = {};

const files = require.context(".", false, /\.ts$/);
files.keys().forEach((key: string) => {
  if (key === "./index.ts") return;

  const filename = key.replace(/(^\.\/|\.ts$)/g, "");
  modules[filename] = files(key).default;
});

export default modules;
