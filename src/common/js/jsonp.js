import OrgJsonp from 'jsonp'

export default function jsonp(url, data, opt) {
  url = url + (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve,reject)=>{
    OrgJsonp(url,opt,(err,data)=>{
      if(!err)
        resolve(data)
      else
        reject(err)
    })
  })
}

function param(data) {
  let url = ''
  for(let k in data){
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${value}`
  }
  return url ? url.substring(1) : url
}
