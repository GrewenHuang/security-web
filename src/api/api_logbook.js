import request from './index'

export default {
  GetLogbooks: data => {
    return request({
      url: '/GetLogbooks',
      method: 'post',
      data
    })
  },
}
