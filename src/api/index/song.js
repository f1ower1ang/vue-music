import {qqGetLyrics} from "../qqMusic/song";
import axios from 'axios'
import {ntGetLyric} from "../NeteaseCloudMusic/song";

export function getLyrics(qqMid, ntId) {
  if (qqMid !== 0) {
    return qqGetLyrics(qqMid).then(res => Promise.resolve(res))
  } else
    return axios.get(`https://api.itooi.cn/music/netease/lrc?key=579621905&id=${ntId}`).then(res => Promise.resolve(res.data))
}
