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
		watch: {
			value: {
				deep: true,
				handler() {
					this.setOption();
				}
			},
		},
		data() {
			return {
				chart: null,
				content: ''
			}
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
						top: '26%'
					},
					tooltip: {
						trigger: 'item',
					},
					color: ['#27E3FF', '#F7FA70', '#FFB12A', '#EF2B67'],
					legend: {
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
							normal: {
				
								color: (params) => {
									var colorList = [{
											c1: '#27E3FF',
											c2: '#1D7EA6'
										},
				
										{
											c1: '#F7FA70',
											c2: '#B3D6E6'
										},
										{
											c1: '#FFB12A',
											c2: '#5F400F'
										},
										{
											c1: '#EF2B67',
											c2: '#430926'
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
								},
				
							},
				
						},
				
					}]
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
							that.$emit('pieSuccess', params.data)
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
		},
	}
</script>

<style lang="scss" scoped>
	.echart-broken-line {
		width: 100%;
		height: 100%;
	}
</style>