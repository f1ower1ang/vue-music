<template>
  <transition name="drop">
    <div class="play-menu" ref="playMenu" @click="hidden" v-show="showFlag">
      <div class="menu-content" @click.stop>
        <div class="item">{{name}}</div>
        <div class="item" @click.stop="nextPlay">
          <i class="icon icon-next-play"></i>
          <p>下一首播放</p>
        </div>
        <div class="item" @click.stop="addFavor">
          <i class="icon icon-add-favor"></i>
          <p>添加到我喜欢</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {playListMixin} from "../../common/js/mixin";
  import {mapGetters,mapMutations} from 'vuex'

  export default {
    name: "play-menu",
    props: {
      song: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        showFlag: false
      }
    },
    mixins: [playListMixin],
    mounted() {
      this.$refs.playMenu.style.width = window.innerWidth + 'px'
      this.$refs.playMenu.style.height = window.innerHeight + 'px'
    },
    watch: {
      fullScreen(newVal) {
        if (newVal)
          this.$refs.playMenu.style.display = 'none'
      }
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.playMenu.style.bottom = bottom
      },
      hidden() {
        this.showFlag = false
      },
      show() {
        this.showFlag = true
      },
      nextPlay() {
        this.hidden()
        this.setMsgFlag(true)
        this.setMsgText('已加入下一首播放')
        this.$emit('nextplay', this.song)
      },
      addFavor() {
        this.hidden()
        this.setMsgFlag(true)
        this.setMsgText('已添加到我喜欢')
        this.$emit('addToFavor', this.song)
      },
      ...mapMutations({
        setMsgFlag: 'SET_SHOW_MESSAGE',
        setMsgText: 'SET_MESSAGE_TEXT'
      }),
    },
    computed: {
      name() {
        return this.song ? this.song.name : ''
      },
      ...mapGetters([
        'fullScreen',
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .play-menu
    position fixed
    background rgba(0, 0, 0, .5)
    z-index 300
    bottom 0

    .menu-content
      position absolute
      bottom 0
      left 0
      right 0
      height 140px
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      background $color-icon
      font-size $font-size-medium
      transition all .4s

      .item
        padding-left 5%
        height 40px
        line-height 40px
        width 100%
        text-align left
        display flex
        align-items center
        transition all .4s

        &.item:active
          background rgba(0, 0, 0, .1)

        .icon
          flex 0 0 20px
          padding-right 10px


    &.drop-enter-active, &.drop-leave-active
      transition all .4s

    &.drop-enter, &.drop-leave-to
      opacity 0

      .menu-content
        transform translate3d(0, 140px, 0)


</style>
