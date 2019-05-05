<template>
  <div class="music-list">
    <div class="top-bg" v-show="!blur" ref="topBg" :style="opacity">
      <div class="bg-img"></div>
    </div>
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="title" ref="title" v-html="title" :style="opacity"></div>
    <slot></slot>
    <p class="desc" v-show="blur" v-html="title" ref="desc"></p>
    <div class="play" ref="playWrapper" @click="_randomPlay">
      <i class="icon-play-m"></i>
      <p>播放全部<span>(共{{songList.length}}首)</span></p>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            ref="list"
            :bounce="blur"
            :data="songList"
            @scroll="scroll"
    >
      <div class="song-list-wrapper" ref="songs">
        <song-list @showMenu="showMn" :rank="rank" :songs="songList" @select="selectSong"></song-list>
      </div>
    </scroll>
    <play-menu @addToFavor="addFavor" :song="song" ref="playMenu" @nextplay="addNext"></play-menu>
    <loading v-if="!songList.length" class="loading-container"></loading>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import SongList from '../../base/song-list/song-list'
  import Loading from '../../base/loading/loading'
  import {prefixStyle} from "../../common/js/dom";
  import {mapActions} from 'vuex'
  import {playListMixin} from "../../common/js/mixin";
  import PlayMenu from '../../base/play-menu/play-menu'

  const HEIGHT = 82
  const transform = prefixStyle('transform')

  export default {
    name: "Music-list",
    components: {Scroll, SongList, Loading, PlayMenu},
    mixins: [playListMixin],
    data() {
      return {
        scrollY: -1,
        opacity: 'opacity:0',
        song: null
      }
    },
    props: {
      songList: {
        type: Array,
        default() {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      },
      blur: {
        type: Boolean,
        default: true
      },
      image: {
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: '-1'
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      setTimeout(() => {
        this.bgImageHeight = this.$slots.default[0].elm.clientHeight
        this.minTranslateY = HEIGHT - this.bgImageHeight
        this.$refs.list.$el.style.top = `${this.bgImageHeight}px`
        this.$refs.playWrapper.style.top = `${this.bgImageHeight - 25}px`
        this.$refs.desc.style.top = `${this.bgImageHeight - 60}px`
      }, 20)
    },
    watch: {
      scrollY(newY) {
        let bgImg = this.$slots.default[0].elm  // 背景图
        let translateY = Math.max(newY, this.minTranslateY)  // bg-layer可移动的距离
        let blur = newY < 0 ? (3 / Math.abs(this.minTranslateY)) * Math.abs(translateY) : 0
        let opacity = newY < 0 ? 1 / Math.abs(this.minTranslateY) * Math.abs(translateY) : 0

        this.opacity = `opacity : ${opacity}`

        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.$refs.playWrapper.style[transform] = `translate3d(0,${translateY}px,0)`
        // if (this.blur)
        //   bgImg.style.filter = `blur(${blur}px)`
        let zIndex = 0, scale = 1
        if (newY > 0 && this.blur) {   // 向上滑时
          zIndex = 10
          scale = 1 + Math.abs(translateY / this.bgImageHeight)
          this.$refs.desc.style.zIndex = zIndex
          this.$refs.desc.style[transform] = `translate3d(0,${translateY}px,0)`
        } else
          this.$refs.desc.style.zIndex = 0
        if (newY < this.minTranslateY) {  // bg-layer超过可以translate的范围
          zIndex = 10
          bgImg.style.paddingTop = 0
          bgImg.style.height = `${HEIGHT}px`
        } else {  // bg-layer可translate的范围
          bgImg.style.paddingTop = '70%'
          bgImg.style.height = 0
        }
        bgImg.style.zIndex = zIndex
        bgImg.style[transform] = `scale(${scale})`
        if (newY > 0 && !this.blur)
          this.$refs.list.scrollTo(0)
        if (newY < 0 && !this.blur) {
          this.$refs.desc.style[transform] = `translate3d(0,${translateY}px,0)`
          bgImg.style[transform] = `translate3d(0,${translateY}px,0)`
          this.$refs.desc.style.opacity = 1 - opacity
          bgImg.style.opacity = 1 - opacity
        }
      },
      image(newImg) {
        if (newImg !== '')
          this.$refs.topBg.children[0].style.background = 'rgb(57,65,73)'
      },
      color(newVal) {
        if (newVal !== '-1')
          this.$refs.topBg.style.background = newVal
      }
    },
    methods: {
      showMn(song) {
        this.song = song
        this.$refs.playMenu.show()
      },
      addNext(song) {
        this.song = song
        this.addToNext(this.song)
      },
      addFavor(song) {
        this.song = song
        this.saveFavor(this.song)
      },
      handlePlayList(playList) {
        const bottom = playList && playList.length === 0 ? 0 : '60px'
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      back() {
        this.$router.back()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectSong(item, index) {
        this.song = item
        this.selectPlay({
          list: this.songList,
          index
        })
      },
      _randomPlay() {
        this.randomPlay({list: this.songList})
      },
      ...mapActions([
        'selectPlay',
        'randomPlay',
        'addToNext',
        'saveFavor'

      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .music-list
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    width 100%
    z-index 100
    background $color-background

    .top-bg
      overflow hidden
      position absolute
      top 0
      left 0
      right 0
      height 80px
      opacity 0
      z-index 10

      .bg-img
        z-index 100
        position absolute
        top 0
        left 0
        right 0
        height 80px


    .back
      position absolute
      top 20px
      left 6px
      color $color-theme
      border-radius: 50%
      width 42px
      height 42px
      text-align center
      line-height 42px
      font-size $font-size-large-x
      transition all .3s
      z-index 20

      &:active
        background $color-background-d

    .title
      position absolute
      left 10%
      width 80%
      height 80px
      text-align center
      line-height 80px
      font-size $font-size-large
      font-weight 700
      color $color-icon
      transition all .3s
      z-index 20
      no-wrap()

    .desc
      position absolute
      top 0
      left 15px
      font-size $font-size-large
      font-weight 700
      color $color-icon
      z-index 0

    .play
      display flex
      align-items center
      position absolute
      height 40px
      width 100%
      padding 0 10px
      box-sizing border-box
      border-top-left-radius 20px
      border-top-right-radius 20px
      background $color-background
      z-index 10

      p
        flex 1
        font-size $font-size-medium-x

        span
          font-size $font-size-small
          color $color-text-d

      i
        text-align center
        flex 0 0 25px
        margin-right 10px
        font-size $font-size-large

    .bg-layer
      position relative
      height 100%
      margin-top -5px
      border-top-left-radius 20px
      border-top-right-radius 20px
      background $color-icon

    .list
      position absolute
      bottom 0
      width 100%

      .song-list-wrapper
        padding 10px 20px 20px 10px

    .loading-container
      position absolute
      top 65%
      width 100%
      transform translateY(-50%)
</style>
