import jsonp from '../../common/js/jsonp'
import axios from 'axios'
import {commonParams, options} from "./config";

export function qqGetRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    uin: 0,
    platform: 'h5'
  })
  return jsonp(url, data, options)
}

export function qqGetDisc() {
  const url = 'http://zhongsir.online:81/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sortId: 5,
    ein: 29,
    sin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function qqGetSongList(qqId) {
  const url = 'http://zhongsir.online:81/api/getSongList'

  const data = Object.assign({}, commonParams, {
    disstid:qqId,
    g_tk: 5381,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq.json',
    sin:0,
    ein:19,
    hostUin: 0,
    needNewCode: 0,
    data: {"comm":{"ct":24,"cv":10000},"pass":{"module":"yqq.WhiteListServer","method":"Pass","param":{}}}
  })

  return axios.get(url,{
    params:data
  }).then(res=>{
    return Promise.resolve(res.data)
  })
}
