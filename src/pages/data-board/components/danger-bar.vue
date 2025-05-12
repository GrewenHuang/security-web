<template>
	<div class="echart" ref="echartPie"></div>
</template>

<script>
	import echarts from "@/plugins/echarts";
	const color = [
		'#7585E5',
		'#5292FF',
		'#FFC372',
	];
	import {
			autoToolTip
		} from "./echarts_auto_tooltip.js";
	export default {
		props: {
			value: Array,
			prop: {
				type: Object,
				default () {
					return {
						name: 'name',
						value: 'value'
					}
				}
			},
			color: {
				type: Array,
				default () {
					return color;
				}
			},
			loading: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			value: {
				deep: true,
				handler() {
					this.setOption();
				}
			},
			loading(val) {
				if (this.chart) {
					if (val) {
						this.chart.showLoading({
							text: '数据加载中'
						});
					} else {
						this.chart.hideLoading();
					}
				}
			}
		},
		data() {
			return {
				option: {
					color: this.color,
					tooltip: {
						axisPointer: {
							type: 'shadow'
						},
						trigger: 'axis',
						formatter: (val, index) => {
							return val.map(item => {
								return `<div style="display: flex;justcontent: space-betbeen;align-items: center;">
                                ${item.marker} ${item.seriesName} <span style="margin-left: 10px;flex: 1;text-align:right;">${item.value}${item.seriesName == '完成率' ? '%' : ''}</span>
                                </div>`
							}).join('')
						}
					},
					legend: {
						show: false,
						top: '5%',
						left: '0%',
						icon: "rect",
						itemGap: 10,
						itemWidth: 8,
						itemHeight: 8,
						textStyle: {
							fontSize: 14,
							color: '#fff',
							padding: [1, 1, 1, 1],
						}
					},
					grid: {
						top: '10%',
						right: '1.5%',
						bottom: '10%',
						left: '5%'
					},
					xAxis: [{
						type: 'category',
						data: (() => {
							let list = new Array(12).fill('').map((item, index) => {
								return index + 1 + '月'
							});
							return list;
						})(),
						show: true,
						axisLabel: {
							interval: 0,
							color: '#fff' // 这里设置颜色为红色
						}
					}],
					yAxis: [
						
						{
							type: 'value',
							axisLabel: {
								color: '#fff',
								fontSize: 12,
							},
							splitLine: {
								lineStyle: {
									color: '#fff'
								}
							},
						},
						{
							type: 'value',
							axisLabel: {
								color: '#fff',
								fontSize: 12,
							},
							splitLine: {
								lineStyle: {
									color: '#fff'
								}
							},
						},
						{
							type: 'value',
							axisLabel: {
								color: '#fff',
								fontSize: 12,
							},
							splitLine: {
								lineStyle: {
									color: '#fff'
								}
							},
						},
						{
							type: 'value',
							axisLabel: {
								color: '#fff',
								fontSize: 12,
							},
							splitLine: {
								lineStyle: {
									color: '#fff'
								}
							},
						},
						{
							type: 'value',
							axisLabel: {
								color: '#fff',
								fontSize: 12,
							},
							splitLine: {
								lineStyle: {
									color: '#fff'
								}
							},
						}
					],
					series: []
				},
				chart: null
			}
		},
		methods: {
			setOption() {
				if (this.chart) {
					this.option.series = this.getSeries();
					this.chart.setOption(this.option);
					// autoToolTip(this.chart, this.option, 6000,)
				}
			},
			getSeries() {
				if (!this.value) return [];
				let list = [];
				this.value.forEach((item, index) => {
					let obj = {
						name: item.name,
						type: item.type || 'bar',
						data: item.value,
						barWidth: 12,
						barGap: 0,
						yAxisIndex: index
					}
					list.push(obj);
				});
				return list;
			}
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.$refs.echartPie) {
						this.chart = echarts.init(this.$refs.echartPie);
						this.setOption();
						let that = this
						this.chart.on('click', function (params) {
						   that.$emit('success',params)
						});
					}
				}, 100);
			})
			window.addEventListener('resize', () => {
				if (this.chart) {
					this.chart.resize();
				}
			})
		}
	}
</script>

<style scoped>
	.echart {
		width: 100%;
		height: 100%;
	}
</style>