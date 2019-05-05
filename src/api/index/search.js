import {qqGetHotKey} from "../qqMusic/search";
import {ntGetHotKey} from "../NeteaseCloudMusic/search";
import axios from "axios";

function formalizeKey(key, type) {
  if (type === 'nt') {
    return key.first
  } else if (type === 'qq') {
    return key.k
  }
}

function unique(list) {

}

export async function getHotKey() {
  let qqData = '', ntData = '', hotKey = [], key1 = [], key2 = []

  qqData = await qqGetHotKey()
  ntData = await ntGetHotKey()

  if (qqData.code === 0)
    qqData.data.hotkey.slice(0, 7).forEach(item => {
      key1.push(formalizeKey(item, 'qq'))
    })
  if (ntData.code === 200)
    ntData.result.hots.slice(0, 7).forEach(item => {
      key2.push(formalizeKey(item, 'nt'))
    })

  let length = key1.length || key2.length
  for (let i = 0; i < length; i++) {
    if (key1.length)
      hotKey.push(key1[i])
    if (key2.length)
      hotKey.push(key2[i])
  }

  return hotKey.filter((item, index, self) => {
    return self.indexOf(item) === index
  })

}

export function getSuggest(query) {
  const url = `http://zhongsir.online:8080/search/suggest`
  return axios.get(url, {
    params: {
      keywords: query,
      type: 'mobile'
    }
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export async function getSearchResult(keywords, page, type, limit) {
  let zhiDa = type === 'singer' ? true : false
  let qqData = await qqGetSearchResult(keywords, page, limit)
  let ntData = await ntGetSearchResult(keywords, page, type, limit)

  let qqList = [], ntList = [], list = []
  // if (qqData.code === 0) {
  //   qqData.data.song.list.forEach(item => {
  //     qqList.push(formalizeSong(item, 'qq', true))
  //   })
  // }
  // if (ntData.code === 200) {
  //   ntList = ntData.data.map(item => {
  //     return {
  //       name: item.name,
  //       image: item.pic,
  //       ntId: item.id,
  //       singer: item.singer.split('/'),
  //       type: 'nt',
  //       album: '',
  //       duration: item.time
  //     }
  //   })
  // }
  //
  //
  // list = uniqueSong(list, false)
}
