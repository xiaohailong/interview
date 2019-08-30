const files = require.context(".", false, /\.svg$/);
const SvgIcons: { [key: string]: any } = Object.create(null);

files.keys().forEach(key => {
  let filename = key.replace(/(^\.\/|\.svg$)/g, "");
  SvgIcons[filename] = files(key).default;
});

export default SvgIcons;
