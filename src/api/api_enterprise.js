import request from './index'

export default {
  /**
   * @author: Bing
   * @method: 获取车辆档案列表
   * @param {*}
   * @Date: 2020-11-28 11:13:02
   * @return {*}
   */
	SaveVehicle: data => {
	  return request({
	    url: '/SaveVehicle',
	    method: 'post',
	    data
	  })
	},
	SaveVehicleDrivingLine: data => {
	  return request({
	    url: '/SaveVehicleDrivingLine',
	    method: 'post',
	    data
	  })
	},
  GetVehicles: data => {
    return request({
      url: '/GetVehicles',
      method: 'post',
      data
    })
  },
  /**
   * @author: Bing
   * @method: 删除车辆档案
   * @param {*}
   * @Date: 2020-11-28 11:13:32
   * @return {*}
   */
  DeleteVehicle: data => {
    return request({
      url: '/DeleteVehicle',
      method: 'get',
      data
    })
  },

  /**
   * @author: Bing
   * @method: 获取 特种设备 列表
   * @param {*}
   * @Date: 2020-11-30 10:41:36
   * @return {*}
   */
  GetSpecialEquipments: data => {
    return request({
      url: '/GetSpecialEquipments',
      method: 'post',
      data
    })
  },

  /**
   * @author: Bing
   * @method: 保存 特种设备
   * @param {*}
   * @Date: 2020-11-30 10:41:45
   * @return {*}
   */
  SaveSpecialEquipment: data => {
    return request({
      url: '/SaveSpecialEquipment',
      method: 'post',
      data
    })
  },

  /**
   * @author: Bing
   * @method: 删除 特种设备
   * @param {*}
   * @Date: 2020-11-30 10:41:53
   * @return {*}
   */
  DeleteSpecialEquipment: data => {
    return request({
      url: '/DeleteSpecialEquipment',
      method: 'get',
      data
    })
  },

  /**
   * @author: ZY
   * @method: 获取特种设备目录
   * @param {*}
   * @Date: 2021-1-12 8:41:00
   * @return {*}
   */
  GetCatalogueTreeNodes: () => {
    return request({
      url: '/GetCatalogueTreeNodes',
      method: 'get',
    })
  },

  /**
   * @author: ZY
   * @method: 获取部门管理信息列表
   * @param {*}
   * @Date: 2020-12-29 18:30:00
   * @return {*}
   */
  GetTreeEnterpriseDepartments: () => {
    return request({
      url: '/GetTreeEnterpriseDepartments',
      method: 'get',
    })
  },

  /**
   * @author: ZY
   * @method: 获取上级部门下拉框数据
   * @param {*}
   * @Date: 2020-12-29 18:30:00
   * @return {*}
   */

  GetEnterpriseDepartments: () => {
    return request({
      url: '/GetEnterpriseDepartments',
      method: 'get',
    })
  },
  /**
   * @author: ZY
   * @method: 保存部门数据
   * @param {*}
   * @Date: 2020-12-29 18:30:00
   * @return {*}
   */
  SaveEnterpriseDepartment: data => {
    return request({
      url: '/SaveEnterpriseDepartment',
      method: 'post',
      data
    })
  },
  /**
   * @author: ZY
   * @method: 删除部门数据
   * @param {*}
   * @Date: 2020-12-29 18:30:00
   * @return {*}
   */

  DeleteEnterpriseDepartment: data => {
    return request({
      url: '/DeleteDepartment',
      method: 'get',
      data
    })
  },
  /**
   * @author: ZY
   * @method: 获取树形岗位列表数据
   * @param {*}
   * @Date: 2020-12-29 18:30:00
   * @return {*}
   */
  GetTreeEnterprisePositions: () => {
    return request({
      url: '/GetTreeEnterprisePositions',
      method: 'get',
    })
  },
  /**
     * @author: ZY
     * @method: 获取组织架构数据
     * @param {*}
     * @Date: 2020-12-29 18:30:00
     * @return {*}
     */
  GetEnterpriseStructure: () => {
    return request({
      url: '/GetEnterpriseStructure',
      method: 'get',
    })
  },

}
