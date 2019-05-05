import {qqGetSingerList, qqGetSingerDetail} from "../qqMusic/singer";
import {ntGetSingerList, ntGetSingerDetail} from "../NeteaseCloudMusic/singer";
import {uniqueSinger} from "../../common/js/singer";

export function formalizeSong(song, type, flag = false) {
  if (type === 'nt') {
    return {
      name: song.name,
      image: song.al.picUrl,
      ntId: song.id,
      singer: song.ar.map(item => item.name),
      type: 'nt',
      album: song.al.name,
      duration: parseInt(song.dt / 1000)
    }
  } else {
    song = !flag ? song.musicData : song
    return {
      name: song.songname,
      image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`,
      qqId: song.songid,
      qqMid: song.songmid,
      album: song.albumname,
      singer: song.singer.map(item => item.name),
      duration: song.interval,
      type: 'qq',
      url: `https://api.itooi.cn/music/tencent/url?key=579621905&id=${song.songmid}&br=192`
    }
  }
}

export function uniqueSong(list, flag) {
  let newList = []
  if (flag) {
    if (list[0].type === 'nt') {
      list.forEach(item => {
        newList.push(Object.assign({}, item, {
          qqId: 0,
          qqMid: 0
        }))
      })
    } else
      list.forEach(item => {
        newList.push(Object.assign({}, item, {
          ntId: 0
        }))
      })
  } else {
    // let j = 0

    list.forEach((item, index) => {
      let flag = true
      for (let i = list.length - 1; i >= 0; i--) {
        if (item.name === list[i].name && index !== i && (('ntId' in item && 'qqId' in list[i])||('ntId' in list[i] && 'qqId' in item))) {
          // j++
          if ('ntId' in list[i])
            newList.push(Object.assign({}, item, {
              ntId: list[i].ntId
            }))
          else
            newList.push(Object.assign({}, list[i], {
              ntId: item.ntId
            }))
          flag = false
          list.splice(index, 1)
          break
        }
      }
      if (flag) {
        if ('ntId' in item)
          newList.push(Object.assign({}, item, {
            qqId: 0,
            qqMid: 0
          }))
        else
          newList.push(Object.assign({}, item, {
            ntId: 0
          }))
      }
    })
    // console.log(j)
  }
  return newList
}

export async function getSingerList() {
  let singerLists = []
  let data = await ntGetSingerList()
  let {singerList} = await qqGetSingerList()
  data = data.map(item => {
    return {
      avator: item.img1v1Url,
      imgUrl: item.picUrl,
      ntId: item.id,
      singer: item.name
    }
  })
  let singerlist = singerList.data.singerlist.map((item) => {
    return {
      avator: item.singer_pic.replace('webp', 'png'),
      imgUrl: item.singer_pic.replace('webp', 'png'),
      qqId: item.singer_id,
      qqMid: item.singer_mid,
      singer: item.singer_name
    }
  })
  singerLists = data.slice(0, 10)
  singerLists = singerLists.concat(singerlist.slice(0, 10))
  singerLists = singerLists.concat(data.slice(10))
  singerLists = singerLists.concat(singerlist.slice(10))

  return uniqueSinger(singerLists)
}

export async function getSingerDetail(ntId, qqId, qqMid) {
  let singerDetail = {}
  let qqDetail = [], ntDetail = [], qq, nt

  qq = await qqGetSingerDetail(qqMid, qqId)
  nt = await ntGetSingerDetail(ntId)
  // console.log(qq,nt)

  if (qq.code === 0)
    qq.data.list.forEach(item => {
      qqDetail.push(formalizeSong(item, 'qq'))
    })
  if (nt.code === 200)
    nt.hotSongs.forEach(item => {
      ntDetail.push(formalizeSong(item, 'nt'))
    })


  let flag = (qq.code === -1 || nt.code === -1) ? true : false

  singerDetail = {
    singer: qq.code === 0 ? qq.data.singer_name : nt.artist.name,
    imgUrl: nt.code === 200 ? nt.artist.picUrl : `https://y.gtimg.cn/music/photo_new/T001R300x300M000${qq.data.singer_mid}.jpg?max_age=2592000`,
    list: uniqueSong(ntDetail.concat(qqDetail),flag)
  }
  return singerDetail
}


