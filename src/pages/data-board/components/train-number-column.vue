<template>
	<div class="echart-broken-line">
		<div ref="chart" style="width: 100%;height: 100%;"></div>
	</div>
</template>

<script>
import echarts from "@/plugins/echarts";
import {
	autoToolTip
} from "./echarts_auto_tooltip.js";
let monthList = [];
for (let i = 1; i < 13; i++) {
	monthList.push(i + '月');
}

let series = [];
export default {
	props: {
		value: {
			type: Array,
			default: []
		}
	},
	data() {
		return {};
	},
	watch: {
		value: {
			deep: true,
			handler() {
				this.setOption();
			}
		},
	},
	mounted() {
		this.setOption()
	},
	methods: {
		setOption() {
			this.$nextTick(() => {
				let chart = echarts.init(this.$refs.chart);
				chart.setOption(this.getChartOption());
				// autoToolTip(chart, this.getChartOption(), 3000)
				let that = this
				chart.on('click', function (params) {
					that.$emit('success', params.data)
				});
				window.addEventListener("resize", function () {
					chart.resize();
				});
			});
		},
		getChartOption() {
			return {
				tooltip: {
					trigger: 'axis',
					formatter(params) {
						let spanStyle = `<span style="margin-left: 15px;"><span>`
						return `${params[0].marker}${params[0].axisValue}${params[0].seriesName} </br> 
									${spanStyle}${params[0].data + '人'}
									`;
					},
					axisPointer: {
						type: 'shadow'
					}
				},
				xAxis: {
					data: monthList,
					type: 'category',
					axisLine: {
						show: true, //隐藏X轴轴线
						lineStyle: {
							color: "#163a5f",
							width: 2,
						},
					},
					axisTick: {
						show: false, //隐藏X轴刻度
						alignWithLabel: true,
					},
					axisLabel: {
						show: true,
						textStyle: {
							color: "#BDD8FB", //X轴文字颜色
							fontSize: 12,
						},
						interval: 0,
						formatter: function (value) {
							var ret = ""; //拼接加\n返回的类目项
							var maxLength = 4; //每项显示文字个数
							var valLength = value.length; //X轴类目项的文字个数
							var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
							if (rowN > 1) {
								//如果类目项的文字大于5,
								for (var i = 0; i < rowN; i++) {
									var temp = ""; //每次截取的字符串
									var start = i * maxLength; //开始截取的位置
									var end = start + maxLength; //结束截取的位置
									//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
									temp = value.substring(start, end) + "\n";
									ret += temp; //凭借最终的字符串
								}
								return ret;
							} else {
								return value;
							}
						},
					},
				},
				yAxis: [{
					type: "value",
					// name: "单位：ml",
					nameTextStyle: {
						color: "#BDD8FB",
						fontSize: 12,
					},
					splitLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					axisLine: {
						show: false, //隐藏X轴轴线
						lineStyle: {
							color: "#163a5f",
							width: 1,
						},
					},
					axisLabel: {
						show: true,
						textStyle: {
							color: "#BDD8FB",
							fontSize: 12,
						},
					},
				},
				{
					type: "value",
					name: "",
					nameTextStyle: {
						color: "#BDD8FB",
						fontSize: 12,
					},
					splitLine: {
						show: false,
						lineStyle: {
							width: 1,
							color: "#CED2DB",
						},
					},
					axisTick: {
						show: false,
					},
					axisLine: {
						show: false, //隐藏X轴轴线
						lineStyle: {
							color: "#163a5f",
							width: 2,
						},
					},
					axisLabel: {
						show: false,
						textStyle: {
							color: "#797A7F",
							fontSize: 12,
						},
					},
				},
				],
				series: [{
					name: '教育培训',
					type: 'bar',
					label: {
						show: true,
						position: 'top',
						valueAnimation: true
					},
					itemStyle: {
						color: new echarts.graphic.LinearGradient(
							0, 0, 0, 1,
							[{
								offset: 0,
								color: '#13D5FC'
							},
							{
								offset: 1,
								color: '#86E5E9'
							}
							]
						)
						// barBorderRadius: [20, 20, 0, 0],
					},
					data: this.value,
				},]
			};
		},
	}
};
</script>

<style lang="scss" scoped>
.echart-broken-line {
	width: 100%;
	height: 100%;
}
</style>