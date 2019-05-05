<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Encounter Music</h1>
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
    <router-link to="/search" tag="div" class="search">
      <i class="icon-discovery"></i>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "MHeader"
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl";
  @import "../../common/stylus/mixin.styl"
  .m-header
    height: 44px
    line-height: 44px
    color: $color-text-d
    text-align: center
    font-size: 0
    position: relative

    .icon
      display: inline-block
      width: 32px
      height: 32px
      margin-top: 6px
      vertical-align: top
      background-size: 32px 32px
      margin-right: 6px
      bg-image('logo')

    .text
      display: inline-block
      font-size: $font-size-large

    .mine
      position: absolute
      left 0
      top: 0

      .icon-mine
        width: 44px
        height: 44px
        display: block
        line-height: 44px
        font-size: $font-size-large

    .search
      position absolute
      right 0
      top 0
      width 44px
      height 44px
      line-height 44px
      font-size $font-size-large

</style>
