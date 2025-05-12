/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: zy
 * @Date: 2022-05-16 22:16:09
 * @LastEditors: Aidam_Bo
 * @LastEditTime: 2022-05-16 22:21:37
 */
import request from './index'

export default {
  //车辆报警类型
  GetWarnTypeCom: data => {
    return request({
      url: '/GetWarnTypeCom',
      method: 'get',
      data
    })
  },
  //车辆报警级别
  GetVehicleWarnLevelEnumCom: data => {
    return request({
      url: '/GetVehicleWarnLevelEnumCom',
      method: 'get',
      data
    })
  },
  GetVehicleWarns: data => {
    return request({
      url: '/GetVehicleWarns',
      method: 'post',
      data
    })
  },

  GetList: data => {
    return request({
      url: '/GetVehicleLocations',
      method: 'post',
      data
    })
  },
  GetCount: data => {
    return request({
      url: '/GetVehicleLocationCount',
      method: 'get',
      data
    })
  },

  GetCount: data => {
    return request({
      url: '/GetVehicleLocationCount',
      method: 'get',
      data
    })
  },
  //获取车辆报警信息
  GetVehicleWarn: data => {
    return request({
      url: '/GetVehicleWarn',
      method: 'get',
      data
    })
  },
  // 车辆报警附件
  GetVehicleWarnAttachments: data => {
    return request({
      url: '/GetVehicleWarnAttachments',
      method: 'get',
      data
    })
  },

  //处罚
  SavePunishVehicleWarn: data => {
    return request({
      url: '/SavePunishVehicleWarn',
      method: 'post',
      data
    })
  },






}