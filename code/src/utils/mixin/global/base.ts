import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
// import UserInfo from "@/objects/UserInfo";

@Component
export default class BaseMixin extends Vue {
  @Getter("get_user", { namespace: "common" })
  private userName!:string;
}
