<template>
  <div class="search-result">
    <ul class="tab">
      <li @click="scrollTo(index)" class="item" :class="{current:currentIndex === index}" v-for="(item,index) in tab">
        {{item}}
      </li>
    </ul>
    <div class="search-content" ref='content'>
      <slider :bounce="bounce" ref="slider" @scrollEnd="setIndex" :auto-play="autoPlay" :show-dots="showDots" :loop="loop">
        <search-song-list :client-height="clientHeight"></search-song-list>
        <search-singer-list :client-height="clientHeight"></search-singer-list>
        <search-disc-list :client-height="clientHeight"></search-disc-list>
      </slider>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Slider from '../../base/slider/slider'
  import SearchSongList from '../Search-song-list/Search-song-list'
  import SearchSingerList from '../Search-singer-list/Search-singer-list'
  import SearchDiscList from '../Search-disc-list/Search-disc-list'

  export default {
    name: "Search-result",
    components: {Slider, SearchSongList, SearchSingerList, SearchDiscList},
    data() {
      return {
        tab: ['单曲', '歌手', '歌单'],
        currentIndex: 0,
        clientHeight: 0,
        bounce:false
      }
    },
    created() {
      this.loop = false
      this.showDots = false
      this.autoPlay = false
    },
    mounted() {
      this.clientHeight = this.$refs.content.clientHeight
    },
    methods: {
      setIndex(index) {
        this.currentIndex = index
      },
      scrollTo(index) {
        this.$refs.slider._scrollTo(index)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .search-result
    position fixed
    top 75px
    bottom 0
    left 0
    right 0
    background $color-icon

    .tab
      position absolute
      width 100%
      top 0
      height 40px
      display flex
      align-items center
      text-align center
      border-bottom 1px solid rgba(0, 0, 0, .05)

      .item
        flex 1
        color $color-text
        font-size $font-size-medium
        height 40px
        line-height 40px

        &.current
          color $color-theme

    .search-content
      position absolute
      top 40px
      bottom 0
      width 100%
      overflow hidden
    .slide-enter-active,.slide-leave-active
      transition all .4s
    .slide-enter,.slide-leave-to
      transform translate3d(100%,0,0)
</style>
