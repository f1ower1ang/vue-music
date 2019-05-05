import axios from 'axios'

export async function ntGetSingerList() {
  const url = 'http://zhongsir.online:8080/top/artists'
  const {data} = await axios.get(url)
  return data.artists
}

export async function ntGetSingerDetail(id) {
  if(!id)
    return {
      code:-1
    }
  const url = 'http://zhongsir.online:8080/artists'
  const {data} = await axios.get(url,{
    params:{
      id
    }
  })
  return data
}
