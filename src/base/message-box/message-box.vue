<template>
  <transition name="fade">
    <div class="message-box" v-show="showMsg">
      <div class="content">
        <p>{{msgText}}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "message-box",
    computed: {
      ...mapGetters([
        'showMsg',
        'msgText'
      ])
    },
    watch: {
      showMsg(newVal) {
        if (newVal)
          setTimeout(() => {
            this.setMsgFlag(false)
          }, 1000)
      }
    },
    methods: {
      ...mapMutations({
        setMsgFlag: 'SET_SHOW_MESSAGE'
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .message-box
    position fixed
    z-index 500
    .content
      position fixed
      top 50%
      left 50%
      background rgba(0,0,0,.6)
      border-radius 8px
      text-align center
      padding 0 10px
      line-height 40px
      color rgba(255,255,255,.6)
      min-width 60px
      min-height 40px
      transform translate3d(-50%, -50%, 0)
      p
        font-size $font-size-medium-x


    &.fade-enter-active, &.fade-leave-active
      transition all .4s

    &.fade-enter, &.fade-leave-to
      opacity 0

</style>
