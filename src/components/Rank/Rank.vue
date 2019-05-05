<template>
  <transition name="fade">
    <div class="rank" ref="rank">
      <scroll :data="rankList" class="rank-wrapper" ref="list">
        <ul>
          <li v-for="list in rankList" class="rank-list" @click="selectItem(list)">
            <div class="avatar">
              <img v-lazy="list.imgUrl" height="115"/>
              <p><i class="icon icon-play-mini"></i>{{list.playNum | currency}}万</p>
            </div>
            <ul class="songlist">
              <h2 class="title">{{list.name}}</h2>
              <li class="song" v-for="(song,index) in list.tracks">
                <span>{{index + 1}}</span> <span>{{song.song}}-{{song.singer}}</span>
              </li>
            </ul>
          </li>
        </ul>
        <div class="loading-container" v-show="!rankList.length">
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
  import Scroll from '../../base/scroll/scroll'
  import {getRank} from "../../api/index/rank";
  import Loading from '../../base/loading/loading'
  import {playListMixin} from "../../common/js/mixin";

  export default {
    name: "Rank",
    mixins: [playListMixin],
    filters: {
      currency(val) {
        let result = [], counter = 0;
        val = (val || 0).toString().split('');
        for (let i = val.length - 1; i >= 0; i--) {
          counter++;
          result.unshift(val[i]);
          if (!(counter % 3) && i !== 0) {
            result.unshift(',');
          }
        }
        return result.join('');
      }
    },
    watch: {
      rankList() {
        setTimeout(() => {
          this.$refs.list&&this.$refs.list.refresh()
        }, 20)
      }
    },
    methods: {
      selectItem(list) {
        let ntId = list.type === 'nt' ? list.topId : -1
        let qqId = list.type === 'qq' ? list.topId : -1
        this.$router.push({
          path: '/rank/detail',
          query: {
            ntId,
            qqId
          }
        })
      },
      handlePlayList(playList) {
        const bottom = playList && playList.length > 0 ? '60px' : 0
        this.$refs.rank.style.bottom = bottom
        this.$refs.list.refresh()
      }
    },
    data() {
      return {
        rankList: []
      }
    },
    created() {
      getRank().then(res => {
        this.rankList = res
      })
    },
    components: {Scroll, Loading}
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .rank
    position fixed
    top 130px
    width 100%
    bottom 0
    left 0
    right 0
    background $color-background

    .rank-wrapper
      height 100%
      overflow hidden
      position relative

      .rank-list
        align-items center
        display flex
        height 115px
        margin 0 20px
        margin-top 10px
        border-radius 10px
        overflow hidden

        &:last-child
          margin-bottom 20px

        .avatar
          height 115px
          flex: 0 0 115px
          position relative
          display block
          background rgba(7, 17, 27, 0.4);

          p
            position absolute
            top 5px
            right 5px
            line-height 15px
            font-size $font-size-small
            color $color-icon


        .songlist
          flex 1
          padding 0 20px
          display flex
          justify-content center
          flex-direction column
          color $color-text
          background $color-background-d
          height 115px
          font-size $font-size-small
          overflow hidden

          .title
            font-size $font-size-medium
            line-height 25px
            font-weight 700

          .song
            display block
            line-height 25px
            no-wrap()

      .loading-container
        position absolute
        top 50%
        width 100%
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
