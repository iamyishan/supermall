import {request,requestNew} from './request'

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type,page) {
  return requestNew({
    url: '/home/data',
    params:{
      type,
      page
    }
  })
}
