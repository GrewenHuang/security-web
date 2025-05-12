import request from "./index";

export default {

  //登录
  login: data => {
    return request({
      url: '/Login',
      method: 'post',
      data
    })
  },
  //登出
  logout: data => {
    return request({
      url: '/LoginOut',
      method: 'post',
      data
    })
  },
  LoginName: data => {
    return request({
      url: '/GetEnterprisesByLoginName',
      method: 'post',
      data
    })
  },
}
