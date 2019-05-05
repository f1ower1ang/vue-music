export function filterSliders(sliders) {
  return sliders.filter(slider => {
    return slider.targetId !== 0 && slider.targetType.toString().length!==4 && !slider.adid
  })
}

export function formalizeSlider(slider,type) {
  if(type === 'qq'){
    return {
      imgUrl:slider.picUrl,
      type:'qq',
      id:slider.id
    }
  }else
    return{
      imgUrl: slider.imageUrl,
      type:'nt',
      id:slider.targetId
    }
}

export function formalizeDisc(disc, type) {
  if(type === 'qq')
    return{
      type:'qq',
      discId:disc.dissid,
      imgUrl:disc.imgurl,
      discName:disc.dissname,
      discTag:disc.creator.name,
      playNum:disc.listennum >= 10000 ? (disc.listennum / 10000).toFixed(1) + '万' : disc.listennum
    }
  else
    return{
      type:'nt',
      discId:disc.id,
      imgUrl:disc.coverImgUrl,
      discName:disc.name,
      discTag:disc.tags.join(' · '),
      playNum:disc.playCount >= 10000 ? (disc.playCount / 10000).toFixed(1) + '万' : disc.playCount
    }
}
