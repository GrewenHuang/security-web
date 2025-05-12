<template>
	<div class="transit-board">
		<!-- <echartMap /> -->
		<!-- <dv-loading v-if="loading">数据加载中...</dv-loading> -->
		<!-- <img src="../../../static/large/bg.png" style="width: 100%;height: auto;"> -->
		<!-- <dv-full-screen-container v-if="!loading && false"> -->
		<dv-full-screen-container>
			<board-header :loading.sync="loading" />
			<!-- <div class="weather-date" style="padding: 0px 60px;margin-bottom: 50px">
				<count-down />
			</div> -->
			<div class="title-switch">
				<a href="#" @click="onIsColor(index)" v-for="(item,index) in list" :key="index"
					:style="{'color': index == isColor ? '#EDF3FF' : '' }">{{item.name}}</a>
			</div>
			<div class="content" v-if="isColor == 0">
				<!-- 左侧 -->
				<div class="left">
					<div class="first-row">
						<div class="title f-b-c">
							<span>站场车次</span>
							<!-- <a href="#">更多</a> -->
						</div>
						<div class="right-content">
							<train-number-column />
						</div>

					</div>
					<!-- 风险统计 -->
					<div class="second-row">
						<div class="title f-b-c">
							<span>风险统计</span>
							<!-- <a href="#">更多</a> -->
						</div>
						<div class="right-content">
							<risk-pie />
						</div>
					</div>
					<!-- 隐患统计 -->
					<div class="third-row">
						<div class="title f-b-c">
							<span>隐患统计</span>
							<!-- <a href="#">更多</a> -->
						</div>
						<div class="right-content">
							<echart-broken-line-smooth />
						</div>
					</div>

				</div>
				<div class="map-box">
					<div class="mid-row">
						
						<!-- <busMap :icon="enterpriseInfo.iconActive" /> -->
					</div>
				</div>
				<div class="right">
					<div class="second-row station-type">
						<div class="title f-b-c">
							<span>场站类型</span>
							<!-- <a href="#">更多</a> -->
						</div>
						<div class="right-content type-content">
							<div v-for="(item,index) in enterpriseList" :key="index" class="type-div">
								<div>
									<img :src="item.icon" alt="">
								</div>
								<div>
									<p>{{item.name}}</p>
									<p
										:style="{'color': item.type == 1? '#479FFE' : item.type == 2? '#85B1FF' : item.type == 3? '#90FFAD' : item.type == 4 ? '#E5B55B' : ''}">
										{{item.value}}</p>
								</div>
							</div>
						</div>
					</div>
					<div class="first-row ranking-height">
						<div class="title f-b-c">
							<span>场站超载排行榜</span>
							<!-- <a href="#">更多</a> -->
						</div>
						<div class="right-content">
							<template v-if="!!noticeList.length">
								<div class="table-box">
									<span>排名</span>
									<span>站场名称</span>
									<span>超载(正常)</span>
									<span>超载(异常)</span>
								</div>
								<!-- <div class="message">共有<span style="white-space: pre;"> {{ noticeList.length }} </span>条未读信息</div> -->
								<vue-seamless-scroll class="scroll-board" :data="noticeList"
									:class-option="classOption">
									<ul ref="scrollBoard">
										<li class="item f--c cursor-p" v-for="(item, index) in noticeList" :key="index"
											@click="openUrl('')">
											<div class="table-box">
												<span v-if="index < 3"
													:class="[index == 0 ? 'no1' : index ==1 ? 'no2' : index == 2? 'no3' : '']"></span>
												<span v-else>{{index + 1}}</span>
												<span>测试数据</span>
												<span
													:class="[index == 0 ? 'no1-color' : index ==1 ? 'no2-color' : index == 2? 'no3-color' : 'no-color']">32</span>
												<span
													:class="[index == 0 ? 'no1-color' : index ==1 ? 'no2-color' : index == 2? 'no3-color' : 'no-color1']">18</span>
											</div>
										</li>
									</ul>
								</vue-seamless-scroll>
							</template>
							<empty-data v-else />
						</div>
					</div>
					<div class="third-row">
						<div class="title f-b-c">
							<span>任务情况</span>
							<!-- <a href="#">更多</a> -->
						</div>
						<div class="right-content">
							<train-number-right-column />
						</div>
					</div>
				</div>
			</div>
			<!-- 	<div class="content">
				<video-play/>
			</div> -->
		</dv-full-screen-container>
	</div>
</template>

<script>
	import vueSeamlessScroll from 'vue-seamless-scroll';
	import {
		countDown,
		boardHeader,
		borderBox1,
		borderBox2,
		echartMap,
		busMap,
		emptyData,
		echartBrokenLine,
		echartBrokenLineSmooth,
		trainNumberColumn,
		RiskPie,
		trainNumberRightColumn,
		videoPlay
	} from './components';
	export default {
		name: 'transit-board',
		components: {
			vueSeamlessScroll,
			countDown,
			boardHeader,
			borderBox1,
			borderBox2,
			busMap,
			echartMap,
			emptyData,
			echartBrokenLine,
			echartBrokenLineSmooth,
			trainNumberColumn,
			RiskPie,
			trainNumberRightColumn,
			videoPlay
		},
		data() {
			let enterpriseList = [{
					id: 1,
					name: '货运站(场)',
					value: 44,
					type: 1,
					icon: require('./imges/icon.png'),
					// iconActive: require('./imges/icon-project-1-t.png'),
				},
				{
					id: 2,
					name: '普通货运站',
					value: 18,
					type: 2,
					icon: require('./imges/icon2.png'),
					// iconActive: require('./imges/icon-project-2-t.png'),
				},
				{
					id: 3,
					name: '集装箱(重箱)',
					value: 12,
					type: 3,
					icon: require('./imges/icon3.png'),
					// iconActive: require('./imges/icon-project-3-t.png'),
				},
				{
					id: 4,
					name: '集装箱(空箱)',
					value: 14,
					type: 4,
					icon: require('./imges/icon4.png'),
					// iconActive: require('./imges/icon-project-4-t.png'),
				},
			]
			return {
				isColor: 0,
				loading: true,
				updateTime: new Date(),
				noticeList: [{}, {}, {}, {}, {}],
				classOption: {
					singleHeight: 39
				},
				enterpriseActive: 1,
				enterpriseList: enterpriseList,
				enterpriseInfo: enterpriseList[0],
				list: [{
						id: 1,
						name: '测试1',
						type: 1
					},
					{
						id: 2,
						name: '测试2',
						type: 2
					},
					{
						id: 3,
						name: '测试3',
						type: 3
					},
				]
			}
		},
		methods: {
			openUrl() {

			},
			createdNoticeScroll() {

			},
			changeEntperiseData(item) {
				this.enterpriseActive = item.id;
				this.enterpriseInfo = item;
			},
			onIsColor(index) {
				this.isColor = index
				return
				if (index == 2) {
					location.href = '/';
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.loading = false;
				}, 1000);
			});
		},
	}
</script>

<style lang="scss" scoped>
	.transit-board {
		width: 100%;
		height: 100%;
		color: #fff;
		background: url(./imges/board-bg.png) no-repeat top left;
		background-size: 100% 100%;

		.content {
			display: flex;
			height: calc(100% - 52px);

			.map-box {
				display: flex;
				flex-direction: column;
				height: 100%;

				.first-row {
					padding-top: 6.420233463035019%;
					padding-left: 11.296296296296296%;
					padding-right: 10.277777777777777%;
					height: 17.315175097276264%;

					.list {
						height: 100%;
						display: grid;
						grid-template-columns: repeat(6, 10.66%);
						grid-auto-rows: 100%;
						grid-gap: 7.2%;
					}
				}

				.last-row {
					height: 11.964980544747082%;

					.list {
						padding-bottom: 4.439428141459744%;
						padding-left: 11.296296296296296%;
						height: 100%;
						display: grid;
						grid-template-columns: repeat(5, 20%);
						grid-auto-rows: 100%;
					}
				}
			}

			.map-box {
				width: calc(100% - 50.5625%) !important;
			}

			.mid-row {
				flex: 1;
			}

			.right,
			.left {
				padding-right: 1.1979166666666667%;
				width: calc(100% - 73.21875%);
				height: 100%;

				.weather-date {
					display: flex;
					align-items: center;
					padding: 22px 0 18px 23px;

					.weather {
						margin-right: 35px;
						font-size: 16px;
						font-weight: 600;
						background: linear-gradient(0deg, #8BBFFF 0%, #EDF5FF 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}

				.title {
					padding: 10px 26px 16px 68px;
					background: url(./imges/title.png) no-repeat left top;
					background-size: 100% 100%;

					span {
						position: relative;
						font-size: 20px;
						font-family: Source Han Sans CN;
						font-weight: 600;
						line-height: 1;
						color: #D9EAF5;
						background: linear-gradient(180deg, #fff 50%, #7CA7DD 80%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;

						&::before {
							content: '';
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 100%;
							box-shadow: 0 0 28px 5px rgba(255, 255, 255, 0.5);
						}
					}

					a {
						color: #6292C8;
					}
				}

				.first-row {
					height: 21.415615%;

					.right-content {
						margin-top: 2.688728024819028%;
						padding-left: 23px;
						padding-right: 38px;
						height: calc(100% - 71px);

						.message {
							color: #00D8FF;
							font-weight: bold;
						}

						.scroll-board {
							height: calc(100% - 31px);
							overflow: hidden;

							.item {
								padding: 10px 0;

								.unread {
									position: relative;
									margin-right: 4px;
									color: #FFED1B;

									&::after {
										content: '';
										position: absolute;
										right: 0;
										bottom: -10px;
										left: 0;
										height: 1px;
										background: #137CFC;
									}
								}

								.last-time {
									color: #6292C8;
								}

								.text {
									position: relative;

									&::after {
										content: '';
										position: absolute;
										right: 0;
										bottom: -10px;
										left: 0;
										height: 1px;
										background: rgba(19, 124, 252, .5);
									}
								}
							}
						}
					}
				}

				.station-type {
					height: 21.415615% !important;

					.type-content {
						display: flex;
						justify-items: center;
						flex-wrap: wrap;

						.type-div {
							display: flex;
							justify-items: center;
							width: 50%;
							height: 50%;

							div:nth-child(1) {
								img {
									vertical-align: middle;
								}
							}

							div:nth-child(2) {
								margin-top: 12%;
								margin-left: 5%;

								p:nth-child(2) {
									font-size: 28px;
									font-family: YouSheBiaoTiHei;
									font-weight: bold;
								}
							}
						}
					}
				}

				.ranking-height {
					height: 33.503309% !important;
				}

				.second-row {
					height: 33.503309%;

					.right-content {
						padding-right: 32px;
						height: calc(90% - 48px);
					}
				}

				.third-row {
					height: 32.95687885010267%;

					.right-content {
						padding-right: 32px;
						height: calc(100% - 48px);
					}
				}
			}

			.left {
				// width: calc(100% - 65.21875%);
				padding-right: 0;
				padding-left: 1.8979166666666667%;
			}
		}
	}

	.table-box {
		width: 100%;
		display: flex;
		justify-items: center;

		span {
			display: inline-block;
		}

		span:nth-child(1) {
			text-align: center;
			width: calc(100% - 85%);
		}

		span:nth-child(2) {
			width: calc(100% - 55%);
			margin-left: 10px;
		}

		span:nth-child(3),
		span:nth-child(4) {
			text-align: center;
			width: calc(100% - 80%);
		}

		.no1 {
			background: url(./imges/no1.png) no-repeat top left;
			background-size: 100% 100%;
		}

		.no2 {
			background: url(./imges/no2.png) no-repeat top left;
			background-size: 100% 100%;
		}

		.no3 {
			background: url(./imges/no3.png) no-repeat top left;
			background-size: 100% 100%;
		}

		.no1-color {
			color: #E8C14E;
		}

		.no2-color {
			color: #fff;
		}

		.no3-color {
			color: #E06F40;
		}

		.no-color {
			color: #90FFAD;
		}

		.no-color1 {
			color: #FE4B67;
		}
	}

	.title-switch {
		width: 100%;
		text-align: center;

		a {
			display: inline-block;
			font-size: 18px;
			color: #98B3E1;
			margin-right: 3%;
		}
	}
</style>
<style>
	svg {
		vertical-align: bottom;
	}
</style>