<template>
  <div class="progress-circle">
    <slot></slot>
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1"
         xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" :stroke="color" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent"
              :stroke-dasharray="dasharray"
              :stroke-dashoffset="dashoffset"
      ></circle>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "progress-circle",
    props: {
      radius: {
        type: Number,
        default: 32
      },
      color:{
        type:String,
        default:''
      },
      percent:{
        type:Number,
        default:0
      }
    },
    computed:{
      dasharray(){
        return Math.PI * 100
      },
      dashoffset(){
        return (1 - this.percent) * this.dasharray
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .progress-circle
    position relative

    circle
      stroke-width 4px
      transform-origin center
      &.progress-background
        transform scale(0.9)
      &.progress-bar
        transform scale(0.9) rotate(-90deg)
        stroke $color-theme
</style>
