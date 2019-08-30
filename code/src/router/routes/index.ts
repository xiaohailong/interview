
import { RouteConfig } from "vue-router";
import * as routerNames from '@/router/name'
const routes: RouteConfig[] = [
  {
    path: "/",
    name:routerNames.ROUTER_HOME,
    component: () => import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
    meta: {
      anonymousAccess: true
    }
  },
  {
    path:'/test',
    name:'test',
    component: () => import(/* webpackChunkName: "test" */ "@/views/TestTs.vue"),
  }
]

export default routes;
