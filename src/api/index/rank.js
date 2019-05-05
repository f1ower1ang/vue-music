import {qqGetRank, qqGetMusicList} from "../qqMusic/rank";
import {ntGetRank, ntGetMusicList} from "../NeteaseCloudMusic/rank";
import {formalizeSong} from "./singer";

function formalizeRank(list, type) {
  let rank = []
  let num = ['云音乐新歌榜', '云音乐热歌榜', '网易原创歌曲榜', '云音乐飙升榜', '云音乐电音榜', 'UK排行榜周榜',
    '美国Billboard周榜', 'KTV嗨榜', 'iTunes榜', 'Hit FM Top榜', '日本Oricon周榜韩国Melon排行榜周榜',
    '韩国Mnet排行榜周榜', '韩国Melon原声周榜', '中国TOP排行榜(港台榜)', '中国TOP排行榜(内地榜)',
    '香港电台中文歌曲龙虎榜', '华语金曲榜', '中国嘻哈榜', '法国 NRJ EuroHot 30周榜', '台湾Hito排行榜',
    'Beatport全球电子舞曲榜', '云音乐ACG音乐榜', '云音乐嘻哈榜']
  if (type === 'nt') {
    list.forEach(item => {
      rank.push({
        type: 'nt',
        topId: num.indexOf(item.name),
        name: item.name,
        imgUrl: item.coverImgUrl,
        tracks: item.tracks.map((item) => {
          return {
            song: item.first,
            singer: item.second
          }
        }),
        playNum: parseInt(item.playCount / 10000)
      })
    })
  } else {
    list.forEach(item => {
      rank.push({
        type: 'qq',
        topId: item.id,
        name: item.topTitle,
        imgUrl: item.picUrl,
        tracks: item.songList.map(item => {
          return {
            song: item.songname,
            singer: item.singername
          }
        }),
        playNum: parseInt(item.listenCount / 10000)
      })
    })
  }
  return rank
}

export async function getRank() {
  let qqRank = [], ntRank = [], qq, nt, i = 0
  let fil = ['巅峰榜·网络歌曲', '抖音排行榜', '巅峰榜·MV', '巅峰榜·K歌金曲', '台湾地区榜']
  qq = await qqGetRank()
  nt = await ntGetRank()
  // console.log(qq.data.topList)
  // console.log(nt.list)
  qqRank = formalizeRank(qq.data.topList, 'qq').filter(item => {
    return fil.indexOf(item.name) === -1
  })


  ntRank = formalizeRank(nt.list, 'nt').slice(0, 4)
  ntRank.forEach((item, index) => {
    qqRank.splice(index + i, 0, item)
    i++
  })
  return qqRank
}

export async function getMusicList(ntId, qqId) {
  let data, rankInfo = {
    bgImg: '',
    image: '',
    list: [],
    title: '',
    desc: '',
    color: -1
  }

  if (parseInt(ntId) !== -1) {
    data = await ntGetMusicList(ntId)
    if (data.code === 200) {
      data.playlist.tracks.slice(0,100).forEach(item => {
        let song = formalizeSong(item, 'nt')
        rankInfo.list.push(Object.assign({}, song, {
          url: `https://api.itooi.cn/music/netease/url?key=579621905&id=${item.id}&br=999000`,
          qqId: 0,
          qqMid: 0
        }))

      })
      rankInfo.bgImg = data.playlist.coverImgUrl
      rankInfo.image = rankInfo.list[0].image
      rankInfo.title = data.playlist.name
      rankInfo.desc = data.playlist.description
    }
  } else if(parseInt(qqId) !== -1){
    data = await qqGetMusicList(qqId)
    if (data.code === 0) {
      data.songlist.slice(0, 100).forEach(item => {
        let song = formalizeSong(item.data, 'qq', true)
        rankInfo.list.push(Object.assign({}, song, {
          ntId: 0
        }))
      })
      rankInfo.bgImg = ''
      rankInfo.image = rankInfo.list[0].image
      rankInfo.title = data.topinfo.ListName
      rankInfo.desc = data.topinfo.info
      let color = data.color.toString(16)
      while(color.length < 6){
        color = '0' + color
      }
      rankInfo.color = color
    }
  }

  return rankInfo
}
