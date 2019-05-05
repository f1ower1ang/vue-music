<template>
  <music-list :rank="rank" :color="color" :image="bgImg" :title="title" :song-list="rankList" :blur="blur">
    <div class="top-wrapper">
      <div class="bg-image" ref="bgImage"></div>
      <div class="filter" ref="filter">
        <div ref="img" class="left">
          <img :src="image" width="120" height="120" alt="">
        </div>
        <div class="right">
          <h2 class="right-title" v-html="title"></h2>
          <p class="right-desc" v-html="desc"></p>
        </div>
      </div>
    </div>
  </music-list>
</template>

<script>
  import MusicList from '../Music-list/Music-list'
  import {getMusicList} from "../../api/index/rank";
  import {createSong} from "../../common/js/song";

  export default {
    name: "Rank-detail",
    data() {
      return {
        title: '',
        rankList: [],
        image: '',
        blur: false,
        desc: '',
        color: '-1',
        bgImg: '',
        rank: true
      }
    },
    components: {MusicList},
    async created() {
      let {ntId, qqId} = this.$route.query

      let res = await getMusicList(ntId, qqId)
      this.rankList = this._formalizeSong(res.list)
      this.bgImg = res.bgImg
      this.image = res.image
      this.title = res.title
      this.desc = res.desc
      this.$refs.bgImage.style.backgroundImage = `url(${this.bgImg})`
      if (res.color !== -1) {
        this.color = '#' + res.color
        let color = this._toRgb(res.color)
        color = `rgba(${color[0]},${color[1]},${color[2]},.9), rgba(${color[0]},${color[1]},${color[2]},.9)`
        this.$refs.bgImage.style = `background:linear-gradient(to bottom right,${color} );`
        // this.$refs.bgImage.style.background = '#' + res.color
        // this.$refs.bgImage.style.background = `rgba(${color[0]},${color[1]},${color[2]},1)`
      }
    },
    methods: {
      _toRgb(color) {
        let i = 0
        let num = ['a', 'b', 'c', 'd', 'e', 'f']
        let r = 0, g = 0, b = 0
        for (let j = 0; j < color.length; j++) {
          let index = num.indexOf(color[j])

          let cur = 0
          if (parseInt(index) === -1) {
            cur = parseInt(color[j] * Math.pow(16, 1 - i))
          } else
            cur = (10 + index) * Math.pow(16, 1 - i)

          if (j < 2) {
            r += cur
          } else if (j >= 2 && j < 4) {
            g += cur
          } else
            b += cur
          i = (i + 1) % 2
        }
        return [r, g, b]
      },
      _formalizeSong(songs) {
        let ret = []
        songs.forEach(item => {
          ret.push(createSong(item))
        })
        return ret
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .disc
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background $color-icon

  .top-wrapper
    position relative
    width 100%
    height 0
    padding-top 70%
    z-index -1
    overflow hidden
    transform-origin top

    .bg-image
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      background-size: 200%;
      background-position top
      background-repeat no-repeat
      transform scale(1.5)
      overflow hidden

    .filter
      position absolute
      top 70px
      left 0
      height 120px
      width 100%
      display flex
      align-items center

      .left
        position relative
        width 120px
        height 120px
        margin-left 20px
        flex 0 0 120px

        img
          position absolute
          left 0
          top 0
          border-radius 8px

        .text
          position absolute
          right 3px
          top 0
          font-size $font-size-small
          color $color-icon

      .right
        margin-left 20px
        line-height 20px
        width 100%
        height 100%
        display flex
        flex-direction column
        align-self flex-start
        overflow hidden

        .right-title
          flex 1
          overflow hidden
          text-overflow ellipsis
          color $color-icon
          font-size $font-size-large
          line-height 25px

        .right-desc
          flex 1
          width 100%
          font-size $font-size-small
          overflow hidden
          color $color-background-d
          text-overflow ellipsis
</style>
