<template>
  <div class="suggest">
    <ul>
      <li class="item" ref="item" @click="selectItem(title)">
        <p class="title">
          搜索“<span class="text" v-html="title"></span>”
        </p>
      </li>
      <li class="item" v-for="item in list" @click="selectItem(item.keyword)">
        <i class="icon-search"></i>
        <p class="text" v-html="item.keyword"></p>
      </li>
    </ul>
  </div>
</template>

<script>
  import {getSuggest} from "../../api/index/search";

  export default {
    name: "suggest",
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        list: []
      }
    },
    mounted() {
      this.search()
      this.$refs.item.addEventListener('touchstart', function () {
      });
    },
    methods: {
      selectItem(value) {
        this.$emit('select', value)
      },
      search() {
        getSuggest(this.title).then(res => {
          if (res.code === 200 && res.result && res.result.allMatch.length > 0) {
            this.list = res.result.allMatch
          }
        })
      }
    },
    watch: {
      title(newVal, oldVal) {
        if (newVal === oldVal)
          return
        this.search()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .suggest
    box-shadow: #666 0 0 5px;
    background $color-icon

    .item
      height 40px
      padding-left 10px
      padding-right 10px
      font-size 15px
      color $color-text-d
      display flex
      align-items center
      border-bottom 1px solid rgba(0, 0, 0, 0.05)
      transition all .4s
      no-wrap()
      &.item:active
        background rgba(0,0,0,.1)

      &:active
        background #ccc

      &:last-child
        border none

      .title
        color #1874CD

      .icon-search
        padding-right 5px
        font-size $font-size-large-x
</style>
