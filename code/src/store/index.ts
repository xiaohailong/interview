import Vue from "vue";
import Vuex, { Store } from "vuex";
import modules from "./modules";
import RootState from "./states";

Vue.use(Vuex);

export function createStore(): Store<RootState> {
  return new Vuex.Store({
    modules: modules
  });
}
