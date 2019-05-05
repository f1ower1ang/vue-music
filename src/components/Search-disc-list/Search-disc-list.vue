<template>
  <div class="disc-list" ref="discList">
    <scroll :probe-type="3" @scrollToStart="refresh" @scroll="refresh" :listen-scroll="listenScroll" ref="scroll"
            :pull-up="pullUp" class="disc-content" :data="discs" @scrollToEnd="searchMore">
      <ul>
        <li ref="topTip" v-show="discs.length === 0">
          <loading title=""></loading>
        </li>
        <li v-for="item in discs" class="item" @click="selectDisc(item)">
          <img v-lazy="item.imgUrl" class="avator" width="50" height="50" alt="">
          <div class="info">
            <h2 class="title" v-html="item.discName.trim()"></h2>
            <p class="desc">{{item.count}}首 播放{{item.playNum}}次</p>
          </div>
        </li>
        <li ref="bottomTip" v-show="hasMore && discs.length > 0">
          <loading title=""></loading>
        </li>
      </ul>
    </scroll>

  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import loading from '../../base/loading/loading'
  import {playListMixin} from "../../common/js/mixin";
  import {ntSearchDisc} from "../../api/NeteaseCloudMusic/search";

  const limit = 30

  export default {
    name: "Search-disc-list",
    mixins: [playListMixin],
    components: {Scroll, loading},
    data() {
      return {
        discs: [],
        page: 1,
        type: 'list',
        hasMore: true,
        pullUp: true,
        listenScroll: true
      }
    },
    mounted() {
      this.$refs.discList.style.width = window.innerWidth + 'px'
      this.$refs.topTip.style.width = window.innerWidth + 'px'
      this.$refs.bottomTip.style.width = window.innerWidth + 'px'
      this.$refs.topTip.style.display = 'none'
      this.$refs.bottomTip.style.display = 'block'
    },
    created() {
      this.keywords = this.$route.query.keyword
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
        this.$refs.discList.style.height = newVal + 'px'
      },
      keywords() {
        if (this.discs.length === 0) {
          this.search()
        }
      }
    },
    methods: {
      refresh(pos) {
        pos = pos.y
        if (pos > 0) {
          clearTimeout(this.timer1)
          this.$refs.topTip.style.display = 'block'
          this.$refs.bottomTip.style.display = 'none'
          this.timer1 = setTimeout(() => {
            this.page = 1
            this.discs = []
            this.hasMore = true
            this.search()
          }, 500)
        }
      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectDisc(item) {
        this.$router.push({
          path: '/search/result/disc',
          query: {
            type: item.type,
            id: item.discId
          }
        })
      },
      async search() {
        let ntInfo = {
          count: 0,
          list: []
        }
        ntInfo = await ntSearchDisc(this.keywords, this.page, limit)
        this.hasMore = this._checkMore(this.discs, ntInfo.list)
        this.discs = this.discs.concat(ntInfo.list)
      },
      searchMore() {
        if (!this.hasMore)
          return
        else
          this.page++
        this.search()
      },
      _checkMore(discs, list) {
        if (list.length === 0 || list.length < limit)
          return false
        for (let i = 0; i < list.length; i++) {
          let index = discs.findIndex(item => {
            return item.discId === list[i].discId
          })
          if (index > 0) {
            return false
          }
        }
        return true
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  .disc-list
    .disc-content
      position absolute
      top 0
      bottom 0

      .item
        width 100%
        display flex
        padding 20px 0 0 15px

        .avator
          display block
          width 50px
          height 50px
          border-radius 4px
          overflow hidden

        .info
          margin-left 20px
          line-height 50px
          font-size $font-size-medium
          color $color-text
          text-align left
          no-wrap()

          .title
            line-height 30px
            color $color-text
            font-size $font-size-medium

          .desc
            line-height 15px
            color $color-text-d
            font-size $font-size-small


</style>
