<template>
  <div class="home">
    <div>{{homeMsg}}</div>
    <i style="width:50px;height:50px;display:inline-block">
      <svg-icon :name="'add'"></svg-icon>
    </i>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


@Component({
  components: {
  },
})
export default class Home extends Vue {
  private homeMsg:string = 'home'
}
</script>
