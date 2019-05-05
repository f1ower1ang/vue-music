export function uniqueSinger(singers) {
  let newSingers = []

  singers.forEach((item, index) => {
    let flag = true
    for (let i = singers.length - 1; i >= 0; i--) {
      if (item.singer.replace(/\s+/g,"") === singers[i].singer.slice(0,item.singer.length+1).replace(/\s+/g,"")
        && index !== i && (('ntId' in item && 'qqId' in singers[i]) || ('ntId' in singers[i] && 'qqId' in item))
      ) {
        if ('ntId' in item)
          newSingers.push(Object.assign({}, item, {
            qqId: singers[i].qqId,
            qqMid: singers[i].qqMid
          }))
        else
          newSingers.push(Object.assign({}, singers[i], {
            qqId: item.qqId,
            qqMid: item.qqMid
          }))
        flag = false
        singers.splice(i,1)
        break
      }
    }
    if (flag){
      newSingers.push(item)
    }
  })
  return newSingers
}
