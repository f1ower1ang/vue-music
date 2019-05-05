<template>
  <transition name="slide">
    <div class="user-center">
      <div class="top">
        <i class="icon-back" @click="back"></i>
        <p class="title">个人中心</p>
      </div>
      <div class="bar">
        <p class="item" :class="{current:currentIndex === index}" @click="selectContent(index)"
           v-for="(item,index) in bar">{{item}}</p>
      </div>
      <div class="play-wrapper" @click="random">
        <i class="icon-play"></i>
        <span>随机播放全部</span>
      </div>
      <div class="content">
        <slider class="slider" @scrollEnd="setIndex" :auto-play="autoPlay" :loop="loop" :show-dots="showDots"
                ref="slider">
          <list text="没有收藏的歌曲" :clientHeight="clientHeight" :list="favoriteList" ref="favorList"></list>
          <list text="没有播放的歌曲" :clientHeight="clientHeight" :list="playHistory" ref="playList"></list>
        </slider>
      </div>
    </div>
  </transition>
</template>

<script>
  import Slider from '../../base/slider/slider'
  import {mapGetters, mapActions} from 'vuex'
  import List from '../List/List'
  import Song from '../../common/js/song'

  export default {
    name: "User-center",
    components: {Slider, List},
    data() {
      return {
        bar: ['我喜欢的', '最近听的'],
        autoPlay: false,
        loop: false,
        showDots: false,
        showNum: false,
        currentIndex: 0,
        clientHeight: 0,
      }
    },
    computed: {
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    watch: {
      currentIndex(newVal) {
        setTimeout(() => {
          if (newVal === 0)
            this.$refs.favoriteList && this.$refs.favoriteList.refresh()
          else
            this.$refs.playList && this.$refs.playList.refresh()
        }, 20)
      }
    },
    mounted() {
      setTimeout(() => {
        this.$refs.slider.refresh()
      }, 20)
      this.clientHeight = window.innerHeight - 150
    },
    methods: {
      random() {
        if (this.currentIndex === 0) {
          let list = this.favoriteList.slice()
          for (let i = 0; i < list.length; i++)
            list[i] = new Song(list[i])
          this.randomPlay({list})
        } else {
          let list = this.playHistory.slice()
          for (let i = 0; i < list.length; i++)
            list[i] = new Song(list[i])
          this.randomPlay({list})
        }
      },
      back() {
        this.$router.back()
      },
      selectContent(index) {
        this.currentIndex = index
        this.$refs.slider._scrollTo(index)
      },
      setIndex(index) {
        this.currentIndex = index
      },
      ...mapActions([
        'randomPlay'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .user-center
    position fixed
    top 0
    bottom 0
    right 0
    left 0
    background $color-icon

    .top
      position absolute
      top 25px
      height 40px
      width 100%
      display flex
      align-items center
      color $color-theme

      .icon-back
        padding-left 5px
        font-size 22px

      .title
        width 85%
        text-align center
        line-height 40px


    .bar
      position absolute
      top 65px
      width 60%
      left 20%
      height 30px
      display flex
      align-items center
      color rgba(255, 255, 255, .5)
      background rgba(0, 0, 0, .2)
      font-size $font-size-medium-x

      .item
        height 30px
        line-height 30px
        flex 1
        text-align center

      .current
        background $color-text-d


    .play-wrapper
      position absolute
      top 120px
      width 50%
      left 25%
      height 30px
      text-align: center
      line-height 30px
      border-radius 15px
      border 1px solid $color-theme
      color $color-theme


    .content
      position absolute
      top 170px
      bottom 0
      left 0
      right 0

      .slider
        position absolute
        top 0
        bottom 0
        width 100%
        height 100%


    &.slide-enter-active, &.slide-leave-active
      transition all .4s

    &.slide-enter, &.slide-leave-to
      transform translate3d(-100%, 0, 0)
      opacity 0

</style>
