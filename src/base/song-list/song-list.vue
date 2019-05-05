<template>
  <div class="song-list">
    <ul>
      <li v-for="(song,index) in songs" @click="select(song,index)" class="item">
        <div class="rank" v-show="num">
          <span :class="{top:rank && index <= 2}">{{index + 1}}</span>
        </div>
        <div class="content">
          <h2 class="name" v-html="song.name"></h2>
          <p class="desc" v-html="desc(song)"></p>
        </div>
        <div class="icon" @click.stop="showMenu(song)">
          <i class="icon-menu"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "song-list",
    props: {
      songs: {
        type: Array,
        default: null
      },
      rank: {
        type: Boolean,
        default: false
      },
      num: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      desc(song) {
        return `${song.singer}· ${song.album}`
      },
      select(item, index) {
        this.$emit('select', item, index)
      },
      showMenu(song) {
        this.$emit('showMenu', song)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .song-list
    .item
      display flex
      height 64px
      align-items center
      font-size $font-size-medium

      .rank
        flex 0 0 25px
        text-align center
        margin-right 10px
        color $color-text-d
        font-size $font-size-large

        .top
          color $color-theme

      .content
        flex 1
        line-height 20px
        overflow hidden
        text-align left

        .name
          color $color-text
          no-wrap()

        .desc
          font-size $font-size-small
          color $color-text-d
          no-wrap()

      .icon
        flex 0 0 25px
        extend-click()
</style>
