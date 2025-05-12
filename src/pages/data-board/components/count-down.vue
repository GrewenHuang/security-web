<template>
	<div style="font-size: 16px">{{ value | dateFormat}}</div>
</template>
<script>
function zero(num) {
    return num < 10 ? '0' + num : num;
}
export default {
	name:"count-down",
	data(){
		return{
			value: new Date(),
		}
	},
	filters:{
		//格式化时间
	    dateFormat() {
	      var date = new Date();
	      var year = date.getFullYear();
	      var month = zero(date.getMonth() + 1);
	      var day = zero(date.getDate());
	      var hours = zero(date.getHours());
	      var minutes = zero(date.getMinutes());
	      var seconds = zero(date.getSeconds());
	      let week = date.getDay(); // 星期
	      let weekArr = ["星期日","星期一","星期二","星期三","星期四","星期五", "星期六",];
	      return (
	        year + "年" + month + "月" + day + "日 " + hours + ":" + minutes + ":" + seconds + " " + weekArr[week]
	      );
	    },
	}, 
	//在挂载时启动定时器
	mounted() {
	    this.timer = setInterval(() => {
	      this.value = new Date();
	    }, 1000);
  	},
  	//实例销毁之前清除定时器
	beforeDestroy() {
	    if (this.timer) {
	      clearInterval(this.timer);
	    }
  	},
}
</script>