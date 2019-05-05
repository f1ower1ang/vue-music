<template>
  <div class="tab">
    <router-link to="/recommend" tag="div" class="tab-item">
      <div class="icon">
        <p class="icon-recommend"></p>
      </div>
      <p class="text">推荐</p>
    </router-link>
    <router-link to="/singer" tag="div" class="tab-item">
      <div class="icon">
        <p class="icon-singer"></p>
      </div>
      <p class="text">歌手</p>
    </router-link>
    <router-link to="/rank" tag="div" class="tab-item">
      <div class="icon">
        <p class="icon-rank"></p>
      </div>
      <p class="text">排行榜</p>
    </router-link>

  </div>
</template>

<script>
  export default {
    name: "tab"
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .tab
    margin-top:5px
    height:60px
    display:flex
    .tab-item
      flex:1
      text-align:center
      transition: all .5s
      .icon
        margin:0 auto
        width:35px
        height:35px
        border-radius :50%
        border:1px solid $color-theme
        p
          line-height:35px
          color:$color-theme
          font-size :$font-size-large-x
      .text
        margin-top:5px
        font-size:$font-size-small
        color:$color-text
      &.router-link-active
        .icon
          background:$color-theme
          p
            color:$color-icon
        .text
          color:$color-theme
</style>
