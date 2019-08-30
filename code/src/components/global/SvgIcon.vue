<template lang="pug">
  svg.svg-icon(
    :class="clazz",
    :viewBox="icon.viewBox",
    version="1.1",
    xmlns="http://www.w3.org/2000/svg",
    xmlns:xlink="http://www.w3.org/1999/xlink"
  )
    use(':xlink:href'="icon.href")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import svgIcons from "@/assets/svg";

@Component
export default class SvgIcon extends Vue {
  @Prop({
    required: true,
    type: String,
    validator(val) {
      return val && val in svgIcons;
    }
  })
  private name!: string;

  @Prop({
    type: Boolean,
    default: false
  })
  private spin!: boolean;

  @Prop({
    type: Boolean,
    default: false
  })
  private inverse!: boolean;

  @Prop({
    type: Boolean,
    default: false
  })
  private pulse!: boolean;

  @Prop({
    type: String,
    default: ""
  })
  private flip!: string;

  @Prop({
    type: Boolean,
    default: false
  })
  private upRight!: boolean;

  private get icon(): any {
    const i = svgIcons[this.name];
    return {
      viewBox: i.viewBox,
      href: i.url || `#${i.id}`
    };
  }

  private get clazz(): any {
    return {
      "icon-spin": this.spin,
      "icon-flip-horizontal": this.flip === "horizontal",
      "icon-flip-vertical": this.flip === "vertical",
      "icon-inverse": this.inverse,
      "icon-pulse": this.pulse,
      "icon-upright": this.upRight
    };
  }
}
</script>

<style lang="stylus">
.svg-icon
  display: inline-block
  fill: currentColor

.icon-flip-horizontal
  transform: scale(-1, 1)

.icon-flip-vertical
  transform: scale(1, -1)

.icon-upright
  transform: rotate(90deg)

.icon-spin
  animation: icon-spin 1s 0s infinite linear

.icon-inverse
  color: #fff

.icon-pulse
  animation: icon-spin 1s infinite steps(8)

@keyframes icon-spin
  0%
    transform: rotate(0deg)

  100%
    transform: rotate(360deg)
</style>
