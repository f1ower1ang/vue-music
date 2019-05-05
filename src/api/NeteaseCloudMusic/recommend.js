import axios from 'axios'

export function ntGetRecommend() {
  const url = 'http://zhongsir.online:8080/banner'
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function ntGetDisc() {
  const url = 'http://zhongsir.online:8080/top/playlist/highquality'
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function ntGetSongList(ntId) {
  const url = 'http://zhongsir.online:8080/playlist/detail'
  return axios.get(url, {
    params: {
      id: ntId
    }
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
