<template>
  <div class="loading">
      <img src="./loading.gif" width="24" height="24" alt="">
      <p class="desc" v-html="title"></p>
  </div>
</template>

<script>
  export default {
    name: "loading",
    props:{
      title:{
        type:String,
        default:'正在加载中...'
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .loading
    width 100%
    text-align center
    .desc
      line-height 20px
      font-size $font-size-small
      color $color-text-d
</style>
