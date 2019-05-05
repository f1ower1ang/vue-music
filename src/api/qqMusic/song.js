import axios from 'axios'
import {commonParams} from "./config";


export function qqGetLyrics(qqMid) {
  const url = 'http://zhongsir.online:81/api/lyric'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    songmid: qqMid,
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0,
    pcachetime: +new Date()
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    if(res.data.code === 0)
      return Promise.resolve(res.data.lyric)
    else
      return Promise.resolve('')
  })

}
