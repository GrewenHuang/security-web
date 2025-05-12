/*
 * @Description:
 * @Date: 2020-11-30 17:24:05
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-25 16:43:44
 * @FilePath: \zt-traffic-enterprise-view\src\mixins\request-mixin.js
 */

import request from '@/api/index'
import Qs from "qs";

export default {
	data() {
		return {
			userInfo: Qs.parse(window.localStorage.getItem("userinfo")),
			Power: []
		}
	},
	methods: {
		async Post(url, data, responseType, arg) {
			let response = request({
				url: url,
				method: 'post',
				responseType: responseType,
				data,
				...arg
			});

			return response;
		},
		Get: (url, data) => {
			let response = request({
				url: url,
				method: 'get',
				data
			});
			return response;
		},

		async Posts(url, data, responseType) {
			let response = request({
				url: url,
				method: 'get',
				responseType: responseType,
				data
			});

			return response;
		},
},
created: function() {
		var that = this;
	},
	mounted() {
		var that = this;
	},
}