import request from './index'


export default {
	GetStatusCom: params => {
		return request({
			url: '/GetStatusCom',
			method: 'get',
			params
		})
	},
	GetCarStatus: params => {
		return request({
			url: '/GetCarStatus',
			method: 'get',
			params
		})
	},
	GetVehicleTechnologyLevel: params => {
		return request({
			url: '/GetVehicleTechnologyLevelCom',
			method: 'get',
			params
		})
	},
	GetVehicleTypeCom: () => {
		return request({
			url: '/GetVehicleTypeCom',
			method: 'get',
		})
	}
}