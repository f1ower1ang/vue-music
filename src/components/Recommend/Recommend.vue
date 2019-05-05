<template>
  <transition name="fade">
    <div class="recommend" ref="recommend">
      <scroll class="recommend-content" :data="discList" ref="scroll">
        <div>
          <div v-if="sliders.length" class="slider-wrapper">
            <slider ref="slider">
              <div v-for="item in sliders">
                <img class="needsclick" @load="imgLoad" :src="item.imgUrl" alt="">
              </div>
            </slider>
          </div>
          <div class="recommend-list" v-show="discList.length">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li class="list-item" v-for="item in discList" @click="selectItem(item)">
                <div class="icon">
                  <p><i class="icon-play-mini"></i>{{item.playNum}}</p>
                  <img v-lazy="item.imgUrl" alt="" width="70" height="70">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.discName"></h2>
                  <p class="desc" v-html="item.discTag"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
      <transition name="slide">
        <router-view></router-view>
      </transition>
    </div>
  </transition>
</template>

<script>
  import {_getDiscList, _getRecommend} from "../../api/index/recommend";
  import Slider from '../../base/slider/slider'
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import {playListMixin} from "../../common/js/mixin";

  export default {
    name: "Recommend",
    components: {Slider, Scroll, Loading},
    mixins: [playListMixin],
    data() {
      return {
        sliders: [],
        discList: [],
      }
    },
    created() {
      this.sliders = _getRecommend()
      _getDiscList().then(res => {
        this.discList = res
      })
    },
    watch: {
      sliders() {
        this.$refs.slider && this.$refs.slider.refresh()
      },
      discList() {
        this.$refs.scroll && this.$refs.scroll.refresh()
      }
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList && playList.length > 0 ? '60px' : 0
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      imgLoad() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      selectItem(item) {
        this.$router.push({
          path: '/recommend/detail',
          query: {
            id: item.discId,
            type: item.type
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"

  .recommend
    position fixed
    width 100%
    top 130px
    bottom 0

    .recommend-content
      overflow hidden
      height: 100%

      .slider-wrapper
        width: 100%
        overflow: hidden
        position: relative

      .recommend-list
        width 100%

        .list-title
          font-size $font-size-medium
          color: $color-theme
          text-align: center
          height: 65px
          line-height: 65px

        .list-item
          display: flex
          padding: 0 20px 20px 20px
          align-items center
          box-sizing border-box

          .icon
            flex: 0 0 60px
            width: 70px
            padding-right: 20px
            position relative

            p
              position absolute
              /*width 60px*/
              height 12px
              display block
              right 25px
              text-align: right
              line-height 12px
              top 2px
              color $color-icon
              font-size 9px

              i
                font-size 12px

            img
              width 70px
              height 70px
              overflow hidden
              border-radius 3px

          .text
            display: flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            font-size: $font-size-medium

            .name
              margin-bottom: 10px
              color: $color-text

            .desc
              color $color-text-d

      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)

    .slide-enter-active, .slide-leave-active
      transition all .4s

    .slide-enter, .slide-leave-to
      transform translate3d(100%, 0, 0)

  .fade-enter-active, .fade-leave-active
    transition all .4s

  .fade-enter, .fade-leave-to
    opacity 0
</style>
