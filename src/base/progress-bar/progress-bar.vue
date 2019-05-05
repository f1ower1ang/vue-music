<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="inner-bar" ref="innerBar">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd"
      >
        <div class="btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from "../../common/js/dom";

  const transform = prefixStyle('transform')

  export default {
    name: "progress-bar",
    created() {
      this.touch = {}
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initial) {
          const barWidth = this.$refs.innerBar.clientWidth
          const offsetWidth = barWidth * newPercent
          this._offset(offsetWidth)
        }
      }
    },
    methods: {
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      _trigger(){
        this.$emit('progressChange',this.$refs.progress.clientWidth / this.$refs.innerBar.clientWidth)
      },
      progressClick(e){  // 记录手指点击的x偏移量
        let offsetWidth = e.offsetX
        this._offset(offsetWidth)
        this._trigger()
      },
      progressTouchStart(e) {  // 记录一开始手指触摸的位置
        this.touch.initial = true
        this.touch.left = this.$refs.progress.clientWidth
        this.touch.offsetX = e.touches[0].pageX
      },
      progressTouchMove(e) {  // 实时监听手指滑动的距离，并计算当前进度
        let delta = e.touches[0].pageX - this.touch.offsetX
        let offsetWidth = Math.min(this.$refs.innerBar.clientWidth,Math.max(0,this.touch.left + delta))
        this._offset(offsetWidth)
      },
      progressTouchEnd() {  // 滑动结束，向父组件派发进度修改事件，并将当前进度传递给父组件
        this._trigger()
        this.touch.initial = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .progress-bar
    height 30px

    .inner-bar
      position relative
      top 14px
      width 100%
      height 2px
      background #d9d9d9

      .progress
        position absolute
        height 100%
        background $color-theme

      .progress-btn-wrapper
        position absolute
        height 14px
        width 14px
        left -7px
        top -6px
        background $color-theme-d
        border-radius 50%
</style>
