<template>
  <transition name="drop">
    <div class="playlist" v-show="showFlag" @click="hidden">
      <div class="wrapper" ref="wrapper" @click.stop>
        <div class="title" @click.stop>
          <p class="left" @click.stop="changeMode">
            <i class="icon" :class="modeIcon"></i>
            <span>{{currentMode()}}</span>
            <span class="num">({{playList.length}})</span>
          </p>
          <p class="right">
            <i class="icon-clear" @click.stop="showConfirm"></i>
          </p>
        </div>
        <scroll class="list" :data="playList" ref="list">
          <ul>
            <li @click.stop="playSong(index)" class="item" ref="listItem"
                :class="index === currentIndex ? 'current' : ''"
                v-for="(song,index) in playList">
              <i :class="index === currentIndex ? 'icon-play' : ''"></i>
              <p class="name">{{song.name}}</p>
              <i class="icon-delete" @click.stop="deleteSong({song, index})"></i>
            </li>
          </ul>
        </scroll>
        <div @click.stop="hidden" class="bottom">关闭</div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" @confirm="clearSong"></confirm>
    </div>
  </transition>
</template>

<script>
  import Scroll from '../scroll/scroll'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {playMode} from "../../common/js/config";
  import {shuffle} from "../../common/js/utils";
  import Confirm from '../confirm/confirm'

  export default {
    name: "playlist",
    components: {Scroll, Confirm},
    data() {
      return {
        showFlag: false
      }
    },
    mounted() {
      this.$refs.wrapper.style.top = `${window.innerWidth * 0.7 - 25}px`
    },
    computed: {
      modeIcon() {
        if (this.mode === playMode.random)
          return 'icon-random'
        else if (this.mode === playMode.sequence)
          return 'icon-sequence'
        else if (this.mode === playMode.loop)
          return 'icon-loop'
      },
      ...mapGetters([
        'mode',
        'playList',
        'currentIndex',
        'sequenceList',
        'currentSong'
      ])
    },
    watch: {
      currentIndex(newVal, oldVal) {
        if (newVal === -1)
          this.showFlag = false
        if (newVal === -1 || oldVal === newVal)
          return
        this.scrollToTop()
      },
      showFlag(newVal) {
        if (newVal)
          this.scrollToTop()
      }
    },
    methods: {
      showConfirm() {
        this.$refs.confirm.show()
      },
      scrollToTop() {
        setTimeout(() => {
          this.$refs.list.refresh()
          this.$refs.list.scrollToElement(this.$refs.listItem[this.currentIndex], 300)
        }, 20)
      },
      show() {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.list.refresh()
        }, 20)
      },
      hidden() {
        this.showFlag = false
      },
      playSong(index) {
        this.setCurrentIndex(index)
        this.setPlaying(true)
      },
      changeMode() {
        let mode = (this.mode + 1) % 3
        this.setMode(mode)
        let list = []
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        let index = list.findIndex(item => {
          return item.ntId === this.currentSong.ntId && item.qqId === this.currentSong.qqId
        })
        this.setPlayList(list)
        this.setCurrentIndex(index)
      },
      currentMode() {
        let text = ''
        if (this.mode === playMode.random)
          text = '随机播放'
        else if (this.mode === playMode.sequence)
          text = '顺序播放'
        else if (this.mode === playMode.loop)
          text = '循坏播放'
        return text
      },
      ...mapMutations({
        setMode: 'SET_MODE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayList: 'SET_PLAYLIST',
        setPlaying: 'SET_PLAYING'
      }),
      ...mapActions([
        'clearSong',
        'deleteSong'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .playlist
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 200

    .wrapper
      position absolute
      background $color-icon
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      bottom 0
      width 100%

      .title
        position absolute
        display flex
        top 0
        height 45px
        padding 0 20px 0 10px
        left 0
        right 0
        border-bottom 1px solid rgba(0, 0, 0, .1)
        align-items center

        .left
          display flex
          align-items center
          width 130px
          font-size $font-size-medium-x

          .icon
            flex 0 0 25px
            padding-right 5px
            font-size 22px

          .num
            font-size $font-size-small
            color $color-text-d

        .right
          flex 1
          text-align right

          .icon-clear
            padding-right 6px

      .list
        position absolute
        top 45px
        bottom 40px
        left 0
        right 0
        padding 0 20px 0 15px
        overflow hidden

        .item
          height 45px
          display flex
          align-items center
          color $color-text
          font-size $font-size-medium
          no-wrap()

          &.current
            color $color-theme

          .icon-delete
            flex 0 0 20px
            color $color-text-d

          .icon-play
            flex 0 0 20px

          .name
            flex 1
            no-wrap()

      .bottom
        position absolute
        bottom 0
        height 40px
        left 0
        right 0
        text-align center
        font-size $font-size-medium-x
        line-height 40px
        border-top 1px solid rgba(0, 0, 0, .1)
        transition all .4s

      .bottom:active
        background rgba(0, 0, 0, .1)


  &.drop-enter-active, &.drop-leave-active
    transition all .4s

  &.drop-enter, &.drop-leave-to
    transform translate3d(0, 100%, 0)
    opacity 0
</style>
