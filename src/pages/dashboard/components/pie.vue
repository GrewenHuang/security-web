<!-- 饼状图 -->
<template>
	<div class="echart" ref="echartPie"></div>
</template>

<script>
	import echarts from "@/plugins/echarts";
	const color = [
		'#0065FF',
		'#FAD800',
		'#F49E21',
		'#FE706E',
		'#FE706E',
		'#FFC372',
	];
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
			size: {
				type: [Array, String],
				default () {
					return [0, '75%']
				}
			},
			loading: {
				type: Boolean,
				default: false
			},
			labelFormat: {
				type: Function,
				default: (e) => {
					return `${e.value}\n${e.data.rate}%`
				},
			},
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
						trigger: 'item'
					},
					legend: {
						show: true,
						left: 'center',
						bottom: '10%',
						icon: "circle",
						itemWidth: 8,
						itemHeight: 8,
						textStyle: {
							fontSize: 14,
							padding: [1, 1, 1, 7],
						},
					},
					series: [{
						type: "pie",
						center: ['50%', '40%'],
						radius: ["50%", "80%"],
						top: 0,
						left: 'center',
						avoidLabelOverlap: false,
						label: {
							formatter: this.labelFormat,
						},
						itemStyle: {
							borderWidth: 0, //设置border的宽度有多大
							borderColor: "#fff",
						},
						data: [],
					}, ],
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				},
				chart: null
			}
		},
		methods: {
			setOption() {
				if (this.chart) {
					if (this.value && this.value.length) {
						this.option.series[0].data = this.value;
					}
					this.chart.setOption(this.option);
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.$refs.echartPie) {
						this.chart = echarts.init(this.$refs.echartPie);

						this.setOption();
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