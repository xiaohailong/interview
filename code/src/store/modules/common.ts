import {
  GetterTree,
  ActionTree,
  MutationTree,
  Module,
  ActionContext
} from "vuex";
import CommonState from "@/store/states/Common";
import RootState from "@/store/states";

type CommonContext = ActionContext<CommonState, RootState>;

const state: CommonState = {
  user:'hailong'
};

const getters: GetterTree<CommonState, RootState> = {
  get_user(state:CommonState):string{
    return state.user;
  }
};

const actions: ActionTree<CommonState, RootState> = {
  fetch_user({commit}:CommonContext,payLoad:string){
    commit('set_user',payLoad);
  }
};

const mutations: MutationTree<CommonState> = {
  set_user(state:CommonState,payLoad:string){
    state.user = payLoad;
  }
};

const module: Module<CommonState, RootState> = {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
};

export default module;
