const mixins: { [key: string]: any } = Object.create(null);

const files = require.context(".", false, /\.ts$/);
files.keys().forEach(key => {
  if (key === "./index.ts") return;

  const filename = key.replace(/(^\.\/|\.ts$)/g, "");
  mixins[filename] = files(key).default;
});

export default mixins;
