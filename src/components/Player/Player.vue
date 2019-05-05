<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" ref="normalPlayer" v-show="fullScreen">
        <div class="back" @click.stop="close">
          <i class="icon-back"></i>
        </div>
        <div class="middle" @click.stop="middleClick">
          <div class="middle-l" ref="middleL">
            <div class="title">
              <h2 class="song">{{currentSong.name}}</h2>
              <p class="singer">{{currentSong.singer}}</p>
            </div>
            <div class="wrapper">
              <div class="bg">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="cdCls">
                    <img :src="currentSong.image" alt="">
                  </div>
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric" v-html="playingLyric"></div>
              </div>
            </div>
          </div>
          <div class="middle-r" ref="middleR">
            <div class="title">
              <h2 class="song">{{currentSong.name}}</h2>
              <p class="singer">{{currentSong.singer}}</p>
            </div>
            <div class="wrapper">
              <scroll class="lyrics" :data="currentLyric && currentLyric.lines" ref="lyrics">
                <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                    <p :class="{'currentLyric':lineIndex === index}"
                       v-for="(line,index) in currentLyric.lines" v-html="line.txt"
                       ref="lyric"
                    ></p>
                  </div>
                  <p v-show="currentLyric === null" class="no-lyric" v-html="lyric"></p>
                </div>
              </scroll>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper" @click.stop>
            <span class="time time-left">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @progressChange="changeTime" :percent="percent"></progress-bar>
            </div>
            <span class="time time-right">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon icon-left">
              <i @click.stop="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon icon-left">
              <i class="icon-prev" @click.stop="prev"></i>
            </div>
            <div class="icon icon-center">
              <i :class="playIcon" @click.stop="togglePlay"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-next" @click.stop="next"></i>
            </div>
            <div class="icon icon-right">
              <i :class="getFavoriteIcon" @click.stop="toggleFavorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="open" v-show="!fullScreen">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" width="40" height="40" alt="">
        </div>
        <div class="text">
          <h2 class="song">{{currentSong.name}}</h2>
          <p class="singer">{{currentSong.singer}}</p>
        </div>
        <div class="control" @click.stop="togglePlay">
          <progress-circle :color="circleColor" :percent="percent">
            <i :class="miniIcon" class="mini-icon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlaylist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @ended="end" @error="error"
           @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import Scroll from '../../base/scroll/scroll'
  import ProgressBar from '../../base/progress-bar/progress-bar'
  import ProgressCircle from '../../base/progress-circle/progress-circle'
  import {prefixStyle} from "../../common/js/dom";
  import Lyric from 'lyric-parser'
  import {playMode} from '../../common/js/config'
  import {shuffle} from "../../common/js/utils";
  import playlist from '../../base/playlist/playlist'

  const transform = prefixStyle('transform')

  export default {
    name: "Player",
    data() {
      return {
        canPlay: false,
        currentLyric: null,
        currentTime: 0,
        circleColor: '#666666',
        lineIndex: 0,
        playingLyric: '',
        noLyric: true,
        left: true
      }
    },
    components: {
      Scroll, ProgressBar, ProgressCircle, playlist
    },
    computed: {
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      modeIcon() {
        if (this.mode === playMode.sequence)
          return 'icon-sequence'
        else if (this.mode === playMode.loop)
          return 'icon-loop'
        else if (this.mode === playMode.random)
          return 'icon-random'
      },
      lyric() {
        return this.noLyric ? '歌词加载中...' : '暂无歌词'
      },
      getFavoriteIcon() {
        if (this.isFavorite())
          return 'icon-favorite'
        else
          return 'icon-not-favorite'
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList',
        'favoriteList'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong.ntId && !newSong.qqId)
          return
        if (newSong.ntId === oldSong.ntId && newSong.qqId === oldSong.qqId)
          return

        if (this.timer)
          clearTimeout(this.timer)

        if (this.currentLyric)
          this.currentLyric.stop()

        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing(newPlay) {
        setTimeout(() => {
          let audio = this.$refs.audio
          newPlay ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      showPlaylist() {
        this.$refs.playlist.show()
      },
      toggleFavorite() {
        if (this.isFavorite()) {
          this.deleteFavor(this.currentSong)
        } else {
          this.setMsgFlag(true)
          this.setMsgText('已添加至我喜欢')
          this.saveFavor(this.currentSong)
        }

      },
      isFavorite() {
        let index = this.favoriteList.findIndex(item => {
          return item.ntId === this.currentSong.ntId && item.qqId === this.currentSong.qqId
        })
        return index > -1
      },
      middleClick() {
        this.left = !this.left
        this.$refs.middleL.style.opacity = this.left ? 1 : 0
        this.$refs.middleR.style.opacity = this.left ? 0 : 1
      },
      changeMode() {
        let mode = (this.mode + 1) % 3
        let text = ''
        this.setMsgFlag(true)
        this.setMode(mode)
        let list = []
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
          text = '随机播放'
        } else {
          list = this.sequenceList
          if (mode === playMode.sequence)
            text = '顺序播放'
          else
            text = '单曲循环'
        }
        this.setMsgText(text)
        let index = list.findIndex(item => {
          return item.ntId === this.currentSong.ntId && item.qqId === this.currentSong.qqId
        })
        this.setCurrentIndex(index)
        this.setPlayList(list)
      },
      end() {
        if (this.mode === playMode.loop)
          this.loop()
        else
          this.next()
      },
      changeTime(percent) {
        this.$refs.audio.currentTime = percent * this.currentSong.duration
        this.currentLyric && this.currentLyric.seek(percent * this.currentSong.duration * 1000)
        if (!this.playing)
          this.togglePlay()
      },
      getLyric() {
        this.currentSong.getLyric().then(lyric => {
          if (lyric !== '') {
            this.currentLyric = new Lyric(lyric, this.handleLyric)
            if (this.playing)
              this.currentLyric.play()
            this.noLyric = false
          } else {
            this.currentLyric = null
            this.lineIndex = 0
            this.playingLyric = ''
            this.noLyric = true
          }
        })
      },
      handleLyric({lineNum, txt}) {
        this.lineIndex = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyric[lineNum - 5]
          this.$refs.lyrics.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyrics.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      ready() {
        this.savePlayHis(this.currentSong)
        this.canPlay = true
      },
      error() {
        this.canPlay = true
        this.next()
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      format(interval) {
        interval = interval | 0

        let minute = this._pad(interval / 60 | 0)

        let second = this._pad(interval % 60)

        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        if (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.currentLyric && this.currentLyric.seek(0)
      },
      next() {
        if (!this.canPlay)
          return
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1 === this.playList.length ? 0 : this.currentIndex + 1
          this.setCurrentIndex(index)
        }

        if (!this.playing)
          this.togglePlay()

        this.canPlay = false
      },
      prev() {
        if (!this.canPlay)
          return
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1 < 0 ? this.playList.length - 1 : this.currentIndex - 1
          this.setCurrentIndex(index)
        }

        if (!this.playing)
          this.togglePlay()

        this.canPlay = false
      },
      togglePlay() {
        if (!this.canPlay)
          return
        this.circleColor = this.playing ? '#000' : '#666666'
        this.setPlaying(!this.playing)
        if (this.currentLyric)
          this.currentLyric.togglePlay()
      },
      close() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      enter(el, done) {
        let {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: 'translate3d(0,0,0) scale(1.1)'
          },
          100: {
            transform: 'translate3d(0,0,0) scale(1)'
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all .4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ``
      },
      _getPosAndScale() {
        const targetWidth = 40
        const width = window.innerWidth * 0.8
        const paddingLeft = 40
        const paddingBottom = 30
        const marginTop = 100
        let x = paddingLeft - window.innerWidth / 2
        let y = window.innerHeight - marginTop - width / 2 - paddingBottom
        let scale = targetWidth / width
        return {
          x, y, scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
        setPlaying: 'SET_PLAYING',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setMode: 'SET_MODE',
        setPlayList: 'SET_PLAYLIST',
        setMsgFlag: 'SET_SHOW_MESSAGE',
        setMsgText: 'SET_MESSAGE_TEXT'
      }),
      ...mapActions([
        'saveFavor',
        'deleteFavor',
        'savePlayHis'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .player
    .normal-player
      position fixed
      top 0
      bottom 0
      left 0
      right 0
      width 100%
      height 100%
      z-index 150
      background $color-icon

      .back
        width 30px
        height 30px
        font-size $font-size-medium-x
        line-height 30px
        text-align center
        box-sizing border-box
        margin-left 15px
        margin-top 25px
        border-radius 50%
        background: rgba(0, 0, 0, .4)
        transform rotate(-90deg)

        .icon-back
          color $color-icon

      .middle
        bottom 150px
        top 50px
        width 100%
        height 100%

        .middle-l
          transition all .4s

          .title
            margin-top 5px
            width 80%
            margin-left 10%
            height 40px
            text-align center
            line-height 20px

            .song
              color $color-text
              font-size $font-size-medium-x
              font-weight 700
              no-wrap()

            .singer
              color $color-text-d
              font-size $font-size-small

          .wrapper
            position fixed
            top 120px
            bottom 170px
            width 100%

            .bg
              position relative
              width 100%
              height 0
              padding-top 80%

              .cd-wrapper
                position absolute
                top 0
                width 80%
                left 10%
                height 100%

                .cd
                  width 100%
                  height 100%
                  box-sizing border-box
                  background-image: url('./play_disc.png')
                  background-size 104% 104%
                  background-position center center
                  border-radius 50%
                  overflow hidden
                  position relative
                  box-shadow: 0 0 15px black

                  &.play
                    animation: rotate 10s linear infinite

                  &.pause
                    animation-play-state: paused

                  img
                    top 50%
                    left 50%
                    position relative
                    display block
                    transform translate(-50%, -50%)
                    vertical-align middle
                    border-radius 50%
                    width 70%
                    height 70%

            .playing-lyric-wrapper
              width 80%
              margin 30px auto 0
              text-align center
              overflow hidden

              .playing-lyric
                color $color-text-d
                line-height 16px
                font-size $font-size-medium

        .middle-r
          transition all .4s
          opacity 0

          .title
            height 40px
            width 70%
            text-align center
            line-height 20px
            position fixed
            top 26px
            left 15%

            .song
              color $color-text
              font-size $font-size-medium
              font-weight 700
              z-index -1
              no-wrap()

            .singer
              color $color-text-d
              font-size $font-size-small
              z-index -1

          .wrapper
            position fixed
            top 70px
            bottom 130px
            width 80%
            left 10%

            .lyrics
              width 100%
              height 100%
              overflow hidden
              position relative

              p
                height 40px
                line-height 40px
                font-size $font-size-medium
                text-align center
                no-wrap()
                color $color-text-d

                &.currentLyric
                  color $color-theme

              .no-lyric
                position absolute
                top 50%
                transform translateY(-50%)
                height 40px
                width 100%
                text-align center
                line-height 40px
                font-size $font-size-medium
                color $color-text-d

      .bottom
        width 100%
        position absolute
        bottom 20px

        .progress-wrapper
          display flex
          width 80%
          margin 0 auto
          align-items center
          padding 10px 0

          .time
            width 30px
            line-height 30px
            flex 0 0 30px
            color $color-text
            font-size $font-size-small

            &.time-left
              text-align right

            &.time-right
              text-align left

          .progress-bar-wrapper
            flex 1
            padding 0 12px

        .operators
          width 100%
          display flex
          align-items center

          .icon
            flex 1
            color $color-text
            font-size 30px

            &.icon-left
              text-align right

            &.icon-center
              text-align center
              padding 0 20px
              font-size 32px

            &.icon-right
              text-align left

              .icon-favorite
                color $color-theme


      &.normal-enter-active, &.normal-leave-active
        transition all .4s

        .back, .title, .bottom
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

      &.normal-enter, &.normal-leave-to
        opacity 0

        .back, .title
          transform translate3d(0, -100px, 0)

        .bottom
          transform translate3d(0, 100px, 0)

    .mini-player
      position fixed
      bottom 0
      left 0
      right 0
      width 100%
      background $color-icon
      height 60px
      display flex
      align-items center
      z-index 150

      .icon
        flex 0 0 40px
        width 40px
        padding 0 10px 0 20px

        img
          border-radius 50%

          &.play
            animation: rotate 10s linear infinite

          &.pause
            animation-play-state: paused

      .text
        flex 1
        text-align left
        line-height 20px
        width 100%
        no-wrap()

        .song
          color $color-text
          font-size $font-size-medium

        .singer
          color $color-text-d
          font-size $font-size-small


      .control
        flex 0 0 30px
        width 30px
        padding 0 10px
        font-size 25px

        .mini-icon
          position absolute
          top 0
          left 0
          font-size 32px

          &.icon-play-mini
            color $color-text

          &.icon-pause-mini
            color $color-theme

      &.mini-enter-active, &.mini-leave-active
        transition all .4s

      &.mini-enter, &.mini-leave-to
        transform translate3d(0, 60px, 0)
        opacity 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
