<template>
  <scroll :data="data" :probeType="probeType" ref="listView" :listenScroll="listenScroll" class="listview"
          @scroll="scroll">
    <ul class="list-group">
      <li v-for="singer in data" ref="listGroup">
        <h2 v-html="singer.title" class="list-group-title"></h2>
        <ul>
          <li v-for="name in singer.item" class="list-group-item" @click="selectItem(name)">
            <img v-lazy="name.avator" class="avator" width="50" height="50" alt="">
            <span class="name" v-html="name.singer"></span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-title" v-show="fixedTitle" ref="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" :class="currentIndex === index ? 'current' : ''"
            v-for="(item,index) in data"
            :data-index="index"
        >
          {{item.title.charAt(0)}}
        </li>
      </ul>
    </div>
    <div class="loading-wrapper">
      <loading v-show="!data.length"></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import {getData} from "../../common/js/dom";

  const ANCHOR_HEIGHT = 18
  const FIXED_HEIGHT = 30

  export default {
    name: "listview",
    components: {Scroll, Loading},
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: -1
      }
    },
    computed: {
      fixedTitle() {
        if (this.scrollY > 0)
          return ''
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    created() {
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
      this.touch = {}
    },
    watch: {
      scrollY(newY) {
        const listHeight = this.listHeight
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        for (let i = 0; i < listHeight.length - 2; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = newY + height2
            return
          }
        }
        this.currentIndex = listHeight.length - 2
        this.diff = newY + listHeight[listHeight.length - 1]
      },
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    methods: {
      refresh(){
        this.$refs.listView.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      onShortcutTouchStart(e) {
        let firstTouch = e.touches[0]
        let anchorIndex = getData(e.target, 'index')
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = parseInt(anchorIndex)
        this._scrollTo(this.touch.anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        const delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
        let anchorIndex = delta + this.touch.anchorIndex
        this._scrollTo(anchorIndex)
      },
      selectItem(singer){
        this.$emit('select',singer)
      },
      _scrollTo(index) {
        if (isNaN(index))
          return
        if (index >= this.$refs.listGroup.length - 1) {
          index = this.$refs.listGroup.length - 1
        } else if (index <= 0)
          index = 0
        this.currentIndex = index
        this.$refs.listView.scrollToElement(this.$refs.listGroup[index])
      },
      _calculateHeight() {
        this.listHeight = []
        let height = 0
        this.listHeight.push(height)
        const list = this.$refs.listGroup

        for (let i = 0; i < list.length; i++) {
          height += list[i].clientHeight
          this.listHeight.push(height)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .listview
    display block
    width 100%
    height 100%
    overflow hidden
    position relative
    background $color-background

    .list-group
      padding-bottom 30px
      background $color-background

      .list-group-title
        width 100%
        height 30px
        line-height 30px
        font-size $font-size-small
        color $color-text-d
        font-weight 700
        padding-left 20px

      .list-group-item
        width 100%
        display flex
        padding 20px 0 0 30px

        .avator
          display block
          width 50px
          height 50px
          border-radius 50%
          overflow hidden

        .name
          margin-left 20px
          line-height 50px
          font-size $font-size-medium
          color $color-text

    .shortcut
      position absolute
      top 50%
      transform translateY(-50%)
      right 0
      width 20px
      border-radius 10px
      background $color-background-d
      padding 15px 0
      font-weight 700
      text-align center
      font-size $font-size-small
      color $color-text-d

      ul
        display flex
        height 100%
        flex-direction column
        justify-content center
        align-items center

        .item
          padding 3px
          vertical-align middle
          flex 1
          width 100%

          &.current
            color $color-theme

    .loading-wrapper
      position absolute
      top 50%
      width 100%
      transform translateY(-50%)

    .list-title
      top 0
      left 0
      width 100%
      height 30px
      position absolute
      line-height 30px
      background $color-background
      padding-left 20px

      .fixed-title
        font-size $font-size-small
        color $color-text-d
        font-weight 700
</style>
