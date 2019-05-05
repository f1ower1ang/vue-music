import axios from 'axios'
import {commonParams, options} from "./config";
import jsonp from "../../common/js/jsonp";

export function qqGetSingerList(){
  const url = 'http://zhongsir.online:81/api/getSingerList'
  const data = Object.assign({},commonParams,{
    hostUin: 0,
    loginUin:0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      "comm": {"ct": 24, "cv": 10000},
      "singerList": {
        "module": "Music.SingerListServer",
        "method": "get_singer_list",
        "param": {"area": -100, "sex": -100, "genre": -100, "index": -100, "sin": 0, "cur_page":1}
      }
    }
  })
  return axios.get(url,{
    params:data
  }).then(res=>{
    return Promise.resolve(res.data)
  })
}

export function qqGetSingerDetail(singermid,singerid) {
  if(!singermid||!singerid)
    return {
      code : -1
    }
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    needNewCode: 0,
    order: 'listen',
    platform: 'h5page',
    begin: 0,
    num: 100,
    songstatus: 1,
    singerid:singerid,
    singermid: singermid
  })
  return jsonp(url, data, options)
}
