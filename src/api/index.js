import axios from 'axios'
import store from "../vuex/store"
import { bus } from '../bus.js'
import util from "@/common/util.js";

// create an axios instance
const service = axios.create({
  baseURL: process.env.API_ROOT, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  //timeout: 5000 // request timeout

})

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 10 秒
service.defaults.timeout = 30000
//添加一个请求拦截器
service.interceptors.request.use(
  config => {
    if (config.responseType == "blob") {
      config.responseType = config.responseType
      config.timeout = 60000
    }
    if (window.localStorage.getItem('ttoken')) {
      config.headers.ttoken = window.localStorage.getItem('ttoken');
    }
    store.state.loading = true;
    if (config.method.toUpperCase() == "get".toUpperCase()) {
      if (config.data) {
        config.params = config.data
        config.t = Date.parse(new Date()) / 1000
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)


  }
);
let loginUrl = util.getLoginUrl();
// 添加一个响应拦截器
service.interceptors.response.use(function (response) {
	// var startTime = "11:38"; 
	// var endTime = "11:39";
	// var currentDate = new Date();
	// var currentHour = parseInt(currentDate.getHours());
	// var currentMinute = parseInt(currentDate.getMinutes());
	// var startHour = parseInt(startTime.split(":")[0]);
	// var startMinute = parseInt(startTime.split(":")[1]);
	// var endHour = parseInt(endTime.split(":")[0]);
	// var endMinute = parseInt(endTime.split(":")[1]);
	// if (currentHour < startHour || (currentHour === startHour && currentMinute < startMinute)) {
	//     console.log("当前时间早于指定时间段");
	// } else if (currentHour > endHour || (currentHour === endHour && currentMinute >= endMinute)) {
	//     console.log("当前时间晚于指定时间段");
	// } else {
	//      window.location.reload()
	// 	 return
	// }
  store.state.loading = false
  let data = response.data;
  if (data && data.status) {
    if (data.status == 2030 || data.status == 2031) {
      bus.$emit('goto', loginUrl)
    }
  }
  return response.data;
}, function (error) {
  console.log(error)
  return {
    status: error.response.status,
    message: error.response.data.Message || '接口请求异常'
  }
});


export default service
