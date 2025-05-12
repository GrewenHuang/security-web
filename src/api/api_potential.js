import request from './index'

export default {
  GetEnterprisePotentialPreForm: params => {
    return request({
      url: '/GetEnterprisePotentialPreForm',
      method: 'get',
      params
    })
  },

  SaveEnterprisePotentialForm: data => {
    return request({
      url: '/SaveEnterprisePotentialForm',
      method: 'post',
      data
    })
  },
  GetEnterprisePotentialPreView: params => {
    return request({
      url: '/GetEnterprisePotentialPreView',
      method: 'get',
      params
    })
  },

  SaveEnterprisePotentialView: data => {
    return request({
      url: '/SaveEnterprisePotentialView',
      method: 'post',
      data
    })
  },
  GetEnterprisePotentialView: params => {
    return request({
      url: '/GetEnterprisePotentialView',
      method: 'get',
      params
    })
  }
}
