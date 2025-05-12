import request from './index'

export default {
  /**
   * 获取企业违章信息
   * @param {*} data 
   */
  GetEnterpriseVehicleViolationRecords: data => {
    return request({
      url: '/GetEnterpriseVehicleViolationRecords',
      method: 'post',
      data
    })
  },
  UpdateVehicleViolationRecordRemark: data => {
    return request({
      url: '/UpdateVehicleViolationRecordRemark',
      method: 'post',
      data
    })
  },
}