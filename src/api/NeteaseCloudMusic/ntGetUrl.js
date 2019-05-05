import axios from 'axios'
export async function getUrl(id) {
  const url = 'http://zhongsir.online:8080/check/music'
  const mUrl = 'http://zhongsir.online:8080/song/url'
  let {data} = await axios.get(url,{
    params:{
      id
    }
  })
  console.log(data)
  if(data.success){
    return axios.get(mUrl,{
      params:{
        id
      }
    }).then(res => {
      return Promise.resolve(res.data)
    })
  }else
    return false
}
