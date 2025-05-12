<template>
	<div class="bus-map">
		<!-- <div ref="busMap" style="width: 100%;height: 100%;"></div> -->
		<!-- <div class="tooltip" v-if="tooltipShow" :style="{left: `${left}px`, top: `${top}px`}">
            <div class="content">
                <div class="company"><i class="icon" :style="{backgroundImage: `url(${icon})`}"></i>公交一公司</div>
                <div class="address">长沙市岳麓区长望路与北二环路交叉口东北侧</div>
            </div>
        </div> -->
		<div class="num-box">
			<div v-for="(item,index) in list">
				<p>{{item.value + '%'}}</p>
				<span>{{item.name}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import echarts from "@/plugins/echarts";
	import chinaAll from '../assets/china-all.json';
	let chinaGeoCoordMap = {
		'厦门': [118.087828, 24.462059],
		'2': [118.069692, 24.458256],
	};
	let chinaDatas = [
		[{
			name: '厦门',
			value: 0
		}],
		[{
			name: '2',
			value: 0
		}],
	];

	let convertData = function(data) {
		var res = [];
		for (var i = 0; i < data.length; i++) {
			var dataItem = data[i];
			var fromCoord = chinaGeoCoordMap[dataItem.name];
			if (fromCoord) {
				fromCoord.push(dataItem.value)
				res.push({
					name: dataItem.name,
					value: fromCoord,
				});
			}
		}
		return res;
	};

	let series = [];
	let mapSize = '65%';
	const aspectScale = .85;
	chinaDatas.forEach(function(item, i) {
		series.push({
			type: 'map',
			mapType: 'bus-china',
			aspectScale: aspectScale,
			layoutCenter: ["50%", "35%"], //地图位置
			layoutSize: mapSize,
			zoom: 1, //当前视角的缩放比例
			// roam: true, //是否开启平游或缩放
			scaleLimit: { //滚轮缩放的极限控制
				min: 1,
				max: 2
			},
			itemStyle: {
				normal: {
					areaColor: '#12235c',
					borderColor: '#2A60A9',
					borderWidth: .72,
					shadowColor: 'rgba(0,54,255, 0.4)',
					shadowBlur: 100

				},
				emphasis: {
					areaColor: '#02102b',
					label: {
						color: "#fff"
					}

				}
			},
			emphasis: {
				label: {
					show: false
				}
			}
		}, {
			type: "effectScatter", //标识点
			coordinateSystem: "geo",
			color: '#FFED1B',
			symbolSize: 26,
			//自定义图片的 路径
			symbol: `pin`,
			emphasis: {
				//当鼠标放上去  地区区域是否显示名称
				label: {
					show: false
				},
				itemStyle: {
					color: "#fff"
				},
			},
			data: convertData(item),
		});
	});
	let option = {
		geo: [{
				map: 'bus-china',
				aspectScale: aspectScale,
				layoutCenter: ["50%", `35%`], //地图位置
				layoutSize: mapSize,
				zIndex: 5,
				label: {
					show: false
				},
				roam: false,
				itemStyle: {
					normal: {
						areaColor: 'transparent',
						borderWidth: 4, //设置外层边框
						borderColor: '#60E4FF',
					},
					emphasis: {
						show: false,
					}
				}
			},
			{
				map: 'bus-china',
				aspectScale: aspectScale,
				layoutCenter: ["49.4%", `36.6%`], //地图位置
				layoutSize: mapSize,
				zlevel: -1,
				itemStyle: {
					normal: {
						borderWidth: 0,
						areaColor: "rgba(0, 0, 0, .5)",
					},
				}
			}
		],
		series: series
	};
	export default {
		props: {
			icon: String
		},
		data() {
			return {
				tooltipShow: false,
				top: 0,
				left: 0,
				list: [{
						id: 1,
						name: '场站容积数量',
						value: 32
					},
					{
						id: 2,
						name: '管理人员培训',
						value: 25
					},
					{
						id: 3,
						name: '机械维护保养',
						value: 75
					},
					{
						id: 4,
						name: '管理信息完整度',
						value: 93
					},
				]
			}
		},
		mounted() {
			this.$nextTick(() => {
				let chart = echarts.init(this.$refs.busMap);
				echarts.registerMap('bus-china', chinaAll);
				chart.setOption(option);
				window.chart = chart;
				chart.on("mousemove", val => {
					if (val.componentSubType == "effectScatter") {
						window.event.cancelBubble = true;
						this.tooltipShow = true;
						// this.DialogInfo = val.data;
						// let {offsetX: x, offsetY: y} = val.event.event;
						let [x, y] = chart.convertToPixel('geo', val.value.slice(0, 2))
						this.left = x - 42;
						this.top = y + 30;
					} else {
						this.tooltipShow = false;
					}
				});
			});
		}
	}
</script>

<style lang="scss" scoped>
	.bus-map {
		width: 100%;
		height: 100%;
		position: relative;

		.num-box {
			position: fixed;
			left: 46%;
			bottom: 0%;
			transform: translate(-50%, -50%);
			display: flex;
			justify-items: center;

			div {

				margin-right: 15%;
				text-align: center;

				p {
					height: 110px;
					line-height: 80px;
					width: 110px;
					font-size: 36px;
					font-weight: bold;
					background: url(../imges/mapicon.png) no-repeat top left;
					background-size: 100% 100%;
				}

				span {
					margin-top: 20%;
				}
			}
		}
	}

	.tooltip {
		position: fixed;
		top: 20vh;
		left: 5vw;
		box-shadow: 0 0 20px 0 rgba(0, 238, 255, .4);

		&::before {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: 15px;
			height: 15px;
			background: #FFED1B;
			clip-path: polygon(0 90%, 0 0, 90% 0%);
		}

		&::after {
			content: '';
			display: block;
			position: absolute;
			left: 30px;
			bottom: -10px;
			border: 2px solid transparent;
			border-right-color: #00F0FF;
			border-bottom-color: #00F0FF;
			width: 20px;
			height: 20px;
			background: linear-gradient(right bottom, #01E6F8 0, #162957 50%);
			transform: rotate(45deg) translateY(-.5px);
			box-shadow: 0 0 9px 0 rgba(0, 238, 255, .3) inset;
			clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 100%);

		}

		.content {
			border: 2px solid #00F0FF;
			width: 250px;
			background: #162957;
			clip-path: polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px);
			box-shadow: 0 12px 30px 0 rgba(0, 238, 255, .3) inset;

			&::after {
				content: '';
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				width: 21px;
				height: 21px;
				background-color: #00F0FF;
				clip-path: polygon(100% 0, 0 0, 0 100%);
			}
		}

		.company {
			position: relative;
			padding: 15px 18px;
			font-size: 22px;
			font-weight: 600;

			&::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: 0;
				display: block;
				width: 100%;
				height: 1px;
				background: linear-gradient(90deg, rgba(0, 240, 255, .7) 0, transparent 100%);
			}

			.icon {
				float: left;
				display: block;
				margin-top: -3px;
				width: 35px;
				height: 35px;
				background: no-repeat center center;
				background-size: contain;
			}
		}

		.address {
			padding: 15px 20px;
		}
	}
</style>