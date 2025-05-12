<template>
	<div class="echart-broken-line">
		<div ref="chart" style="width: 100%;height: 100%;"></div>
	</div>
</template>

<script>
	import echarts from "@/plugins/echarts";
	let monthList = [];
	for (let i = 1; i < 13; i++) {
		monthList.push(i + '月');
	}

	let series = [];

	function random(x = 1000) {
		return Math.round(Math.random() * x);
	}

	function mockData() {
		let list = [];
		for (let i = 0; i < 13; i++) {
			list.push(random());
		}
		return list
	}
	let dataList = [{
			name: '重大隐患',
			data: mockData(),
			areaStyleColor: [{
				offset: 0,
				color: 'rgba(220, 40, 40, .8)',
			}, {
				offset: 1,
				color: 'rgba(220, 40, 40, 0)',
			}],
			lineStyleColor: [{
				offset: 0,
				color: 'rgba(220, 40, 40, 0)',
			}, {
				offset: 0.5,
				color: 'rgba(220, 40, 40, 1)',
			}, {
				offset: 1,
				color: 'rgba(220, 40, 40, 0)',
			}]
		},
		{
			name: '一般隐患',
			data: mockData(),

			areaStyleColor: [{
				offset: 0,
				color: 'rgba(240, 150, 20, .8)',
			}, {
				offset: 1,
				color: 'rgba(240, 150, 20, 0)',
			}],
			lineStyleColor: [{
				offset: 0,
				color: 'rgba(240, 150, 20, 0)',
			}, {
				offset: 0.5,
				color: 'rgba(240, 150, 20, 1)',
			}, {
				offset: 1,
				color: 'rgba(240, 150, 20, 0)',
			}]
		},
		{
			name: '已整改',
			data: mockData(),
			areaStyleColor: [{
				offset: 0,
				color: 'rgba(55, 100, 255, .8)',
			}, {
				offset: 1,
				color: 'rgba(55, 100, 255,0)',
			}],
			lineStyleColor: [{
				offset: 0,
				color: 'rgba(5, 100, 255, 0)',
			}, {
				offset: 0.5,
				color: 'rgba(5, 100, 255, 1)',
			}, {
				offset: 1,
				color: 'rgba(5, 100, 255, 0)',
			}]
		},
		{
			name: '未整改',
			data: mockData(),
			areaStyleColor: [{
				offset: 0,
				color: 'rgba(250, 230, 0, .8)',
			}, {
				offset: 1,
				color: 'rgba(250, 230, 0, 0)',
			}],
			lineStyleColor: [{
				offset: 0,
				color: 'rgba(250, 230, 0, 0)',
			}, {
				offset: 0.5,
				color: 'rgba(250, 230, 1, 1)',
			}, {
				offset: 1,
				color: 'rgba(250, 230, 0, 0)',
			}]
		},
		{
			name: '超期未整改',
			data: mockData(),
			areaStyleColor: [{
				offset: 0,
				color: 'rgba(250, 230, 0, .8)',
			}, {
				offset: 1,
				color: 'rgba(250, 230, 0, 0)',
			}],
			lineStyleColor: [{
				offset: 0,
				color: 'rgba(250, 230, 0, 0)',
			}, {
				offset: 0.5,
				color: 'rgba(250, 230, 1, 1)',
			}, {
				offset: 1,
				color: 'rgba(250, 230, 0, 0)',
			}]
		},
	];
	dataList.forEach((item, index) => {
		series.push({
			type: 'line',
			name: item.name,
			showSymbol: false,
			data: item.data,
			smooth: true,
			lineStyle: {
				color: new echarts.graphic.LinearGradient(1, 0, 0, 0,
					item.lineStyleColor,
					false
				),
				shadowBlur: 6,
				shadowOffsetY: 6,
				shadowColor: '#000',
			},
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
						item.areaStyleColor,
						false
					),
				},
			},
		})
	})
	let option = {
		tooltip: {
			trigger: 'axis',
		},
		color: ['#DC2828', '#F09614', '#3764FF', '#FAE600', '#7B8F38'],
		legend: {
			show: false,
			x: 'left',
			top: '8%',
			left: '4%',
			icon: "roundRect",
			itemWidth: 10,
			itemHeight: 10,
			textStyle: {
				color: '#68a9ff',
				fontSize: 14,
				padding: [0, 8, 0, 8]
			}
		},
		grid: {
			top: '10%',
			left: '5%',
			right: '3%',
			bottom: '13%',
		},
		xAxis: [{
			type: 'category',
			axisLabel: {
				color: '#6292C8',
				margin: 25
			},
			axisTick: {
				show: true, // 不显示坐标轴刻度线
				length: 12,
				lineStyle: {
					width: 2,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
						[{
								offset: 0,
								color: 'rgba(255, 255, 255, 0)',
							},
							{
								offset: 0.5,
								color: 'rgba(255, 255, 255, 0)',
							},
							{
								offset: 0.5,
								color: 'rgba(255, 255, 255, 1)',
							},
							{
								offset: 1,
								color: 'rgba(255, 255, 255, 1)',
							},
						],
						false
					),
					dashOffset: 10
				}
			},
			axisLine: {
				show: true, // 不显示坐标轴线
			},
			splitLine: {
				show: true, // 不显示网格线

				lineStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
						[{
								offset: 0,
								color: 'rgba(255, 255, 255, 0)',
							},
							{
								offset: 1,
								color: 'rgba(255, 255, 255, .3)',
							},
						],
						false
					),
				},
			},
			boundaryGap: false,
			data: monthList,
		}, ],

		yAxis: [{
			type: 'value',
			axisLine: {
				show: false,
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				show: true,
				margin: 26,
				textStyle: {
					color: '#6292C8',
				},
			},
		}, ],
		series: series,
	};
	import {
		autoToolTip
	} from "./echarts_auto_tooltip.js";
	export default {
		props: {

		},
		data() {
			return {}
		},
		methods: {
			createEchart() {

			}
		},
		mounted() {
			this.$nextTick(() => {
				let chart = echarts.init(this.$refs.chart);
				chart.setOption(option);
				// autoToolTip(chart, option, 4000,)
				window.addEventListener("resize", function() {
					chart.resize();
				});
			});
		},
	}
</script>

<style lang="scss" scoped>
	.echart-broken-line {
		width: 100%;
		height: 100%;
	}
</style>