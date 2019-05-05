<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input @blur="sendBlur" @focus="sendFocus" ref="query" type="search" @keypress="search" v-model="query" :placeholder="placeholder">
    <i v-show="query" @click="clear" class="icon-dismiss"></i>
  </div>
</template>

<script>
  export default {
    name: "search-box",
    props: {
      placeholder: {
        type: String,
        default: '请输入要搜索的内容'
      },
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
      },
      search(event) {
        this.$emit('keyPress', event.keyCode)
      },
      blur() {
        this.$refs.query.blur()
      },
      sendFocus() {
        this.$emit('focus')
      },
      sendBlur(){
        this.$emit('blur')
      }
    },
    created() {
      this.$watch('query', (newQuery) => {
        this.$emit('query', newQuery)
      })
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .search-box
    display flex
    background $color-text-l
    border-radius 20px
    height 40px
    width 100%
    align-items center

    .icon-search
      font-size $font-size-large-x
      color $color-text
      padding-left 10px


    input
      flex 1
      width 100%
      margin 0 5px
      line-height 20px
      color $color-text
      outline none
      background transparent

    .icon-dismiss
      font-size $font-size-medium
      color $color-text
      padding-right 10px

</style>
