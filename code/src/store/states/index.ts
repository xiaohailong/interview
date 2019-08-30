import strings from "@/utils/strings";

// https://stackoverflow.com/questions/45771307/typescript-dynamically-create-interface

type MapSchemaTypes = {
  [key: string]: any;
};

type MapSchema<T extends Record<string, keyof MapSchemaTypes>> = {
  [K in keyof T]: MapSchemaTypes[T[K]]
};

const states: MapSchemaTypes = Object.create(null);

const files = require.context(".", false, /\.ts$/);

files.keys().forEach((key: string) => {
  if (key === "./index.ts") return;

  const filename = strings.camelize(key.replace(/(^\.\/|\.ts$)/g, ""));
  states[filename] = files(key).default;
});

type RootState = MapSchema<typeof states>;

export default RootState;
