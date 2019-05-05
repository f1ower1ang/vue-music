<template>
  <music-list :image="image" :song-list="songs" :title="title" :blur="blur">
    <div class="top-wrapper">
      <div class="bg-image" ref="bgImage"></div>
      <div class="filter"></div>
      <div class="info" ref="info">
        <div ref="img" class="left">
          <img :src="image" width="120" height="120" alt="">
          <p class="text"><i class="icon-play-mini" style="font-size: 16px"></i>{{num}}</p>
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
  import {getSongList} from "../../api/index/recommend";
  import {createSong} from "../../common/js/song";

  export default {
    name: "Disc",
    components: {MusicList},
    data() {
      return {
        title: '',
        playNum: '',
        desc: '',
        songs: [],
        image: '',
        blur: false
      }
    },
    computed: {
      num() {
        return this.playNum.toString().length > 5 ? (this.playNum / 10000).toFixed(1) + '万' : this.playNum
      }
    },
    created() {
      let type = this.$route.query.type, id = this.$route.query.id
      let ntId = type === 'nt' ? id : -1
      let qqId = type === 'qq' ? id : -1
      getSongList(ntId, qqId).then(res => {
        this.title = res.title
        this.playNum = res.playNum
        this.desc = res.desc
        this.songs = this._formalizeSong(res.list)
        this.image = res.image
        this.$refs.bgImage.style.backgroundImage = `url(${this.image})`
      })
    },
    methods: {
      _formalizeSong(songs) {
        let ret = []
        songs.forEach(item => {
          ret.push(createSong(item))
        })
        return ret
      }
    },
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
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
      background-size: cover;
      background-position 50%
      background-repeat no-repeat
      transform scale(1.5)
      overflow hidden

    .filter
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      background-color rgba(7, 17, 27, 0.8);

    .info
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
          color $color-text-d
          text-overflow ellipsis

</style>
