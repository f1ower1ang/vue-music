<template>
  <scroll class="history-list" v-show="history.length > 0" ref="scroll" :data="history">
    <transition-group tag="ul" name="list">
      <li :key="item" v-for="item in history" @click="selectItem(item)" class="item">
        <p v-html="item"></p>
        <i class="icon-delete" @click.stop="deleteItem(item)"></i>
      </li>
    </transition-group>
  </scroll>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import {playListMixin} from "../../common/js/mixin";

  export default {
    name: "history-list",
    mixins: [playListMixin],
    components: {Scroll},
    props: {
      history: {
        type: Array,
        default: null
      }
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      deleteItem(item) {
        this.$emit('delete', item)
      },
      selectItem(item) {
        this.$emit('select', item)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .history-list
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    padding 0 10px 0 20px
    overflow hidden

    .item
      height 40px
      display flex
      align-items center
      font-size $font-size-medium

      p
        flex 1
        color $color-text

      i
        flex 0 0 20px
        color $color-text
      &.list-enter-active,&.list-leave-active
        transition all .4s
      &.list-enter,&.list-leave-to
        transform translateY(-10px)
        opacity 0
        height 0
</style>
