/*
 * @Description:
 * @Date: 2020-12-03 15:26:57
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-03 15:28:06
 * @FilePath: \zt-traffic-enterprise-view\src\mixins\formatter-mixin.js
 */

function dateTimeFormate(date, fmt) {
    if (typeof date === 'string') {
       date = new Date(date)
    }
  
    var o = {
       "M+": date.getMonth() + 1, //月份   
       "d+": date.getDate(), //日   
       "h+": date.getHours(), //小时   
       "m+": date.getMinutes(), //分   
       "s+": date.getSeconds(), //秒   
       "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
       "S": date.getMilliseconds() //毫秒   
    }
  
    if (/(y+)/.test(fmt)) {
       fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
  
    for (var k in o) {
       if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
       }
    }
  
    return fmt
}

export default {
  data() {
    return {
    }
  },
  methods: {
    //日期格式化 年-月-日
    FormatterDate(data) {
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    },
    FormatterSecondDate (second) {
      let result = parseInt(second)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
      let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result /
        60 % 60));
      let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
      let res = '';
      if (h !== '00') res += `${h}时`;
      if (m !== '00') res += `${m}分`;
      res += `${s}秒`;
      return res;
    },
    //时间格式化 年-月-日 时:分:秒
    FormatterDateTime(data) {
      let dt = new Date(data);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
    //金额格式化
    FormatterAmountOfMoney(num) {
      num = num * 1;
      return num.toFixed(2);
    },
    //状态格式化
    FormatterStatus(status) {
      if (Status) return "启用";
      return "禁用";
    },
    //是否格式化
    FormatterWhether(whether) {
      if (whether) return "是";
      return "否";
    },
    dateTimeFormate
  },
  created: function () {
    var that = this;
  },
  mounted() {
    var that = this;
  },
}
