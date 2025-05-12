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

	export default {
		props: {
			value: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				chart: null,
				content: ''
			}
		},
		watch: {
			value: {
				deep: true,
				handler() {
					this.setOption();
				}
			},
		},
		methods: {
			setOption() {
				this.content = this.value.reduce((sum, item) => sum + item.value, 0) || 0
				let option = {
					title: { // 圆环中央文字
						show: true, // 是否显示
						text: '' + this.content,
						subtext: '总数',
						textStyle: {
							fontSize: 20,
							fontWeight: 700,
							color: '#fff'
						},
						subtextStyle: {
							fontSize: 16,
							fontWeight: 600,
							color: '#fff'
						},
						textAlign: 'center',
						left: '49%',
						top: '20%'
					},
					tooltip: {
						trigger: 'item',
					},
					color: ['#68EBED', '#858DC8', '#B5BCE7', '#4A80E5'],
					legend: {
						type: 'scroll',
						show: false,
						orient: 'circle',
						icon: 'circle',
						bottom: 'bottom',
						itemWidth: 7, // 图例标记的图形宽度。
						itemGap: 20, // 图例每项之间的间隔。
						itemHeight: 7, //  图例标记的图形高度。
						textStyle: {
							color: "#fff"
						}, // 文字的颜色。
					},
					series: [{

						type: 'pie',
						radius: ['60%', '40%'],
						center: ['50%', '35%'],
						data: this.value,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							},
							normal: {

								color: (params) => {
									var colorList = [{
											c1: '#68EBED',
											c2: '#68EBED'
										},
										{
											c1: '#858DC8',
											c2: '#858DC8'
										},
										{
											c1: '#B5BCE7',
											c2: '#B5BCE7'
										},
										{
											c1: '#4A80E5',
											c2: '#4A80E5'
										},

									]
									return new echarts.graphic.LinearGradient(1, 0, 0, 0,
										[{ //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
											offset: 0,
											color: colorList[params.dataIndex].c1
										}, {
											offset: 1,
											color: colorList[params.dataIndex].c2
										}])

								},
								label: {
									show: true,
									formatter: '{d}%',
									// position: 'center',
								},

							},

						},

					}],

				}
				if (this.chart) {
				    this.chart.setOption(option);
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
			    setTimeout(() => {
			        if (this.$refs.chart) {
			            this.chart = echarts.init(this.$refs.chart);
						let that = this
						this.chart.on('click', function(params) {
							that.$emit('success', params.data)
						});
			            this.setOption();
			        }
			    }, 100);
			})
			window.addEventListener('resize', () => {
			    if (this.chart) {
			        this.chart.resize();
			    }
			})
			this.setOption()
		},
	}
</script>

<style lang="scss" scoped>
	.echart-broken-line {
		width: 100%;
		height: 100%;
	}
</style>