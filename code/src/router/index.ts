import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

export function createRouter(): VueRouter {
  return new VueRouter({
    mode: "history",
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes: routes
  });
}
