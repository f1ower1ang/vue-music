<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots" v-if="showDots">
      <i class="dot" :class="pageIndex===index ? 'active' :''" v-for="(dot,index) in dots"></i>
    </div>
  </div>
</template>

<script>
  import {addClass} from "../../common/js/dom";
  import BScroll from 'better-scroll'

  export default {
    name: "slider",
    data() {
      return {
        dots: [],
        pageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      showDots: {
        type: Boolean,
        default: true
      },
      bounce: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay)
          this._play()
      }, 20)
      window.addEventListener('resize', () => {
        if (!this.slider)
          return
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _scrollTo(index) {
        this.slider && this.slider.goToPage(index)
      },
      _setSliderWidth(flag) {
        this.children = this.$refs.sliderGroup.children
        let sliderWidth = this.$refs.slider.clientWidth
        let width = 0

        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          child.style.width = sliderWidth + 'px'
          addClass(child, 'slider-item')
          width += sliderWidth
        }

        if (this.loop && !flag) {
          width += sliderWidth * 2
        }

        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          click: true,
          autoBlur: true,
          bounce: this.bounce
        })
        this.slider.on('scrollEnd', () => {
          this.pageIndex = this.slider.getCurrentPage().pageX
          this.$emit('scrollEnd', this.pageIndex)
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      },
      refresh(){
        this.slider && this.slider.refresh()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .slider
    min-height 1px

    .slider-group
      position relative
      overflow hidden
      white-space nowrap

      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center

        img
          display block
          width 100%

    .dots
      position absolute
      height 10px
      left 0
      right 0
      bottom 12px
      text-align center

      .dot
        display inline-block
        width 8px
        height 8px
        margin 0 4px
        border-radius 50%
        border: 1px solid #fefefe;

        &.active
          border-radius 50%
          background $color-theme
</style>
