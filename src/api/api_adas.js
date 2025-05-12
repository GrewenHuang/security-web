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

  GetThirdInterfaceVehicle: data => {
    return request({
      url: '/GetThirdInterfaceVehicle',
      method: 'get',
      data
    })
  },

  GetVehicleDynamicLocations: data => {
    return request({
      url: '/GetVehicleDynamicLocations',
      method: 'get',
      data
    })
  },

  GetVehicleDynamicLocationRecords: data => {
    return request({
      url: '/GetVehicleDynamicLocationRecords',
      method: 'get',
      data
    })
  },

  GetVehicleStaticLocations: data => {
    return request({
      url: '/GetVehicleStaticLocations',
      method: 'get',
      data
    })
  },

}