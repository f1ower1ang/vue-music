import axios from 'axios'
import jsonp from '../../common/js/jsonp'
import {commonParams, options} from "./config";

import {formalizeSong} from "../index/singer";

export function qqGetHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function qqSearchSongAndSinger(type, keywords, page, limit) {
  const url = 'http://zhongsir.online:81/api/searchSongAndSinger'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    w: keywords,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: limit,
    n: limit,
    p: page,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    let data = res.data
    if (type === 'song') {
      let list = []
      if (data.code === 0) {
        if (data.code === 0) {
          data.data.song.list.forEach(item => {
            list.push(formalizeSong(item, 'qq', true))
          })
        }
      }
      return Promise.resolve(list)
    } else if (type === 'singer') {
      let singers = []
      if (data.code === 0 && data.data.zhida && data.data.zhida.singerid) {
        let item = data.data.zhida
        singers.push({
          avator: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`,
          imgUrl: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`,
          qqId: item.singerid,
          qqMid: item.singermid,
          singer: item.singername
        })
      }
      return Promise.resolve(singers)
    }
  })
}

