import Vue from "vue";

const files = require.context(".", false, /\.vue$/);
const components: { [key: string]: Vue } = {};

files.keys().forEach(key => {
  const filename = key.replace(/(^\.\/|\.vue$)/g, "");
  components[filename] = files(key).default;
});

export default components;
