import axios from 'axios'
import {formalizeDisc} from "../../common/js/recommend";

export function ntGetHotKey() {
  const url = 'http://zhongsir.online:8080/search/hot'

  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function ntSearchSong(keywords, page, limit) {
  const url = 'https://api.itooi.cn/music/netease/search'
  return axios.get(url, {
    params: {
      key: '579621905',
      s: keywords,
      offset: page - 1,
      limit,
      type: 'song'
    }
  }).then(res => {
    let list = []
    let data = res.data
    if (data.code === 200) {
      list = data.data.map(item => {
        return {
          name: item.name,
          image: item.pic,
          ntId: item.id,
          singer: item.singer.split('/'),
          type: 'nt',
          album: '',
          duration: item.time,
          url: item.url
        }
      })
    }
    return Promise.resolve(list)
  })
}

export function ntSearchSinger(keywords, page, limit) {
  const url = 'http://zhongsir.online:8080/search'

  return axios.get(url, {
    params: {
      keywords,
      offset: page - 1,
      limit,
      type: 100
    }
  }).then(res => {
    res = res.data
    let singers = []
    if (res.code === 200) {
      res.result.artists.forEach(item => {
        singers.push({
          avator: item.img1v1Url,
          imgUrl: item.picUrl || item.img1v1Url,
          ntId: item.id,
          singer: item.name
        })
      })
    }
    return Promise.resolve(singers)
  })
}

export function ntSearchDisc(keywords, page, limit) {
  const url = 'http://zhongsir.online:8080/search'
  return axios.get(url, {
    params: {
      keywords,
      offset: page - 1,
      limit,
      type: 1000
    }
  }).then(res => {
    res = res.data
    let info = {
      count: 0,
      list: []
    }
    if (res.code === 200) {
      info.count = res.result.playlistCount
      res.result.playlists.forEach(item => {
        info.list.push({
          type: 'nt',
          discName: item.name,
          playNum: item.playCount.toString().length > 5 ? (item.playCount / 10000).toFixed(1) + '万' : item.playCount,
          discId: item.id,
          imgUrl: item.coverImgUrl,
          count: item.trackCount
        })
      })
    }
    return Promise.resolve(info)
  })
}
