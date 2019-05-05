<template>
  <transition name="fade">
    <div class="singer" ref="singer">
      <listview :data="singerList" @select="slectSinger" ref="list"></listview>
      <transition name="slide">
        <router-view></router-view>
      </transition>
    </div>
  </transition>
</template>

<script>
  import Listview from '../../base/listview/listview'
  import {getSingerList} from "../../api/index/singer";
  import {mapMutations} from 'vuex'
  import jpy from 'js-pinyin'
  import {playListMixin} from "../../common/js/mixin";

  const HOT_LEN = 20, HOT_NAME = '热门'

  export default {
    name: "Singer",
    mixins:[playListMixin],
    components: {
      Listview
    },
    data() {
      return {
        singerList: []
      }
    },
    watch:{
      singerList(){
        setTimeout(()=>{
          this.$refs.list && this.$refs.list.refresh()
        },20)
      }
    },
    created() {
      getSingerList().then(res => {
        this.singerList = this._normalizeSingerList(res)
      })
    },
    methods: {
      handlePlayList(playList){
        const bottom = playList && playList.length > 0 ? '60px' : 0
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      slectSinger(singer) {
        let qqId = singer.qqId ? singer.qqId : 0
        let qqMid = singer.qqMid ? singer.qqMid : 0
        let ntId = singer.ntId ? singer.ntId : 0
        this.$router.push({
          path: `/singer/detail`,
          query: {
            qqId,
            qqMid,
            ntId
          }
        })
        this.setSinger(singer)
      },
      _normalizeSingerList(list) {
        let hot = [], ret = []
        let map = {
          hot: {
            title: HOT_NAME,
            item: []
          }
        }
        if (list.length) {
          for (let i = 0; i < list.length; i++) {
            const key = jpy.getFullChars(list[i].singer).charAt(0).toUpperCase()
            if (i < HOT_LEN) {
              map.hot.item.push(list[i])
            }
            if (!map[key]) {
              map[key] = {
                title: key,
                item: []
              }
            }
            map[key].item.push(list[i])
          }
          for (let k in map) {
            let val = map[k]
            if (val.title.match(/[A-Z]/))
              ret.push(val)
            else
              hot.push(val)
          }
          ret.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })
        }
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable.styl"
  .singer
    position fixed
    top 130px
    bottom 0
    width 100%

    .slide-enter-active, .slide-leave-active
      transition all .3s

    .slide-enter, .slide-leave-to
      transform translate3d(100%, 0, 0)

  .fade-enter-active,.fade-leave-active
    transition all .4s
  .fade-enter,.fade-leave-to
    opacity 0
</style>
