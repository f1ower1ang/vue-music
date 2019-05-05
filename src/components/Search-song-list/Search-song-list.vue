<template>
  <div class="song-list" ref="songList">
    <scroll :pull-up="pullUp" @scrollToEnd="searchMore" :probe-type="3"
            ref="scroll" :data="songs" class="song-content">
      <div>
        <div class="play" @click="_randomPlay">
          <i class="icon-play-m"></i>
          <p>播放全部</p>
        </div>
        <ul>
          <li v-for="(song,index) in songs" @click="playSong(song)" class="item">
            <div class="rank">
              <span>{{index + 1}}</span>
            </div>
            <div class="content">
              <h2 class="name" v-html="song.name"></h2>
              <p class="desc" v-html="getDesc(song)"></p>
            </div>
            <div class="icon" @click.stop="showMenu(song)">
              <i class="icon-menu"></i>
            </div>
          </li>
        </ul>
        <div ref="bottomTip" v-show="hasMore">
          <loading title=""></loading>
        </div>
      </div>
    </scroll>
    <play-menu @nextplay="addNext" @addToFavor="addFavor" ref="playMenu"
               :song="selectedSong"></play-menu>

  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import {ntSearchSong} from "../../api/NeteaseCloudMusic/search";
  import {qqSearchSongAndSinger} from "../../api/qqMusic/search";
  import {uniqueSong} from "../../api/index/singer";
  import {createSong} from "../../common/js/song";
  import {playListMixin} from "../../common/js/mixin";
  import loading from '../../base/loading/loading'
  import {mapActions} from 'vuex'
  import PlayMenu from '../../base/play-menu/play-menu'

  const limit = 20

  export default {
    name: "Search-song-list",
    components: {Scroll, loading, PlayMenu},
    mixins: [playListMixin],
    data() {
      return {
        songs: [],
        page: 1,
        type: 'song',
        qqHasMore: true,
        ntHasMore: true,
        hasMore: true,
        pullUp: true,
        selectedSong: null
      }
    },
    mounted() {
      this.$refs.scroll.$el.style.width = window.innerWidth + 'px'
      this.$refs.bottomTip.style.display = 'block'
    },
    created() {
      this.keyword = this.$route.query.keyword
      this.search()
    },
    props: {
      clientHeight: {
        type: Number,
        default: 0
      }
    },
    watch: {
      clientHeight(newVal) {
        this.$refs.songList.style.height = newVal + 'px'
      },
    },
    methods: {
      addNext(song) {
        this.addToNext(song)
      },
      addFavor(song) {
        this.saveFavor(song)
      },
      showMenu(song) {
        this.selectedSong = song
        this.$refs.playMenu.show()
      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      playSong(song) {
        this.insertSong(song)
      },
      async search() {
        if (!this.hasMore)
          return
        let qqSongs = [], ntSongs = [], songs = []
        if (this.qqHasMore) {
          qqSongs = await qqSearchSongAndSinger('song', this.keyword, this.page, limit)
          if (qqSongs.length < limit)
            this.qqHasMore = false
        }
        if (this.ntHasMore) {
          ntSongs = await ntSearchSong(this.keyword, this.page, limit)
          if (ntSongs.length < limit)
            this.ntHasMore = false
        }

        let length = Math.max(qqSongs.length, ntSongs.length)
        for (let i = 0; i < length; i++) {
          if (qqSongs[i]) {
            songs.push(qqSongs[i])
          }
          if (ntSongs[i])
            songs.push(ntSongs[i])
        }
        songs = this._formalize(uniqueSong(songs))
        this.hasMore = (this.qqHasMore || this.ntHasMore) && this._checkMore(songs)

        if (!this.hasMore) {
          this.ntHasMore = this.qqHasMore = false
        }
        this.songs = this.songs.concat(songs)
      },
      searchMore() {
        if (!this.hasMore)
          return
        this.page++
        this.search()
      },
      getDesc(song) {
        return `${song.singer}· ${song.album}`
      },
      _checkMore(list) {
        for (let i = 0; i < list.length; i++) {
          let index = this.songs.findIndex(item => {
            return list[i].qqId === item.qqId && item.ntId === list[i].ntId
          })
          if (index > -1) {
            return false
          }
        }
        return true
      },
      _randomPlay() {
        this.randomPlay({list: this.songs})
      },
      _formalize(songs) {
        let ret = []
        songs.forEach(song => {
          ret.push(createSong(song))
        })
        return ret
      },
      ...mapActions([
        'randomPlay',
        'insertSong',
        'addToNext',
        'saveFavor'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .song-list
    width 100%
    height 100%
    overflow hidden

    .song-content
      position absolute
      top 0
      bottom 0
      overflow hidden

      .play
        display flex
        align-items center
        height 40px
        width 100%
        padding 0 10px
        box-sizing border-box

        p
          flex 1
          font-size $font-size-medium-x
          text-align left

        i
          text-align center
          flex 0 0 25px
          margin-right 10px
          font-size $font-size-large

      .item
        display flex
        height 64px
        padding 0 20px 0 10px
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

        .icon
          flex 0 0 25px
          extend-click()

  .content
    flex 1
    line-height 20px
    overflow hidden
    text-align left
    width 100%
    no-wrap()

    .name
      color $color-text
      no-wrap()

    .desc
      font-size $font-size-small
      color $color-text-d
      no-wrap()

</style>
