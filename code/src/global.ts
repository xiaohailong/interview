import Vue from "vue";
// import bus from "@/utils/bus";
import filters from "@/utils/filters";
import mixins from "@/utils/mixin/global";
import components from "@/components/global";

// import "@/element";

// import errorHandler from "@/utils/errorHandler";

import "normalize.css";
// import "@/assets/css/common.styl";

Object.keys(filters).forEach(function(key: string) {
  Vue.filter(key, (<any>filters)[key]);
});

Object.keys(mixins).forEach(function(key: string) {
  Vue.mixin((<any>mixins)[key]);
});

Object.keys(components).forEach(function(key: string) {
  Vue.component(key, components[key]);
});

Vue.config.productionTip = false;
// Vue.config.errorHandler = errorHandler;

// Object.defineProperty(Vue.prototype, "$bus", { value: bus });
// Object.defineProperty(Vue.prototype, "$throw", { value: errorHandler });
