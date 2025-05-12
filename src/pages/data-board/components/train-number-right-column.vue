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
			name: '低风险区',
			data: [200, 85, 112, 275, 305, 415],
			color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
				[{
						offset: 0,
						color: 'rgba(55, 100, 255, .8)',
					},
					{
						offset: 1,
						color: 'rgba(55, 100, 255,0)',
					},
				],
				false
			)
		},
		{
			name: '一般风险',
			data: [200, 85, 112, 275, 305, 415],
			color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
				[{
						offset: 0,
						color: 'rgba(250, 230, 0, .8)',
					},
					{
						offset: 1,
						color: 'rgba(250, 230, 0, 0)',
					},
				],
				false
			)
		},
		{
			name: '较大风险',
			data: [200, 85, 112, 275, 305, 415],
			color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
				[{
						offset: 0,
						color: 'rgba(240, 150, 20, .8)',
					},
					{
						offset: 1,
						color: 'rgba(240, 150, 20, 0)',
					},
				],
				false
			)
		},
		{
			name: '重大风险',
			data: [200, 85, 112, 275, 305, 415],
			color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
				[{
						offset: 0,
						color: 'rgba(220, 40, 40, .8)',
					},
					{
						offset: 1,
						color: 'rgba(220, 40, 40, 0)',
					},
				],
				false
			)
		},
	];
	dataList.forEach((item, index) => {
		series.push({
			type: 'bar',
			name: item.name,
			showSymbol: false,
			data: item.data,
			lineStyle: {
				color: 'transparent'
			},
			areaStyle: {
				normal: {
					color: item.color,
				},
			},
		})
	})
	let option = {
		tooltip: {
			trigger: 'axis',
		},
		color: ['#3764FF', '#FAE600', '#F09614', '#DC2828'],
		legend: {
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
			show: false,
			left: "0",
			right: "5%",
			bottom: "0",
			top: "14px",
			containLabel: true,
		},
		yAxis: {
			data: ["同安区", "集美区", "翔安区", "海沧区", "思明区", "湖里区"],
			axisLine: {
				show: false, //隐藏X轴轴线
				lineStyle: {
					color: "#163a5f",
					width: 2,
				},
			},
			axisTick: {
				show: true, //隐藏X轴刻度
				alignWithLabel: true,
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: "#BDD8FB", //X轴文字颜色
					fontSize: 12,
				},
				interval: 0,
				formatter: function(value) {
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



		xAxis: [{
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
		series: {
			// name: "降雨量",
			type: "bar",
			barWidth: 10,
			barGap: '0%',
			barCategoryGap: '0%',
			itemStyle: {
				color: {
					type: 'linear',
					// x: 0, //右
					// y: 0, //下
					// x2: 0, //左
					// y2: 1, //上
					colorStops: [{
							offset: 0.1,
							color: '#13D5FC' // 0% 处的颜色
						},
						{
							offset: 1,
							color: '#2059B8' // 100% 处的颜色
						}
					]
				},
				barBorderRadius: [0, 20, 20, 0],
			},
			label: {
				show: true,
				position: "right",
				distance: 0,
				color: "#1ACDDC",
				formatter: "{c}%",
			},
			data: [20, 15, 12, 30, 13, 9],
		},

	};

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
				window.addEventListener("resize", function () {
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