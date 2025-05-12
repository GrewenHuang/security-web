<template>
	<div class="video-box">
		<div class="content">
			<div class="left">
				<div class="title">
					<span>监控列表</span>
					<!-- <a href="#">更多</a> -->
				</div>
				<div class="input-box">
					<el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 100%">
						<i slot="suffix" class="el-icon-search" @click="onselect"></i>
					</el-input>
					<el-collapse accordion class="accordion-box">
						<el-collapse-item v-for="(item,index) in listLeft" :key="index">
							<template slot="title">
								<div class="accordion-title">
									象屿物流配送园区
								</div>
							</template>
							<div @click="onClick(index,item)" class="lan-mu" :style="{'color' : isColor == index ? '#01A3FF' : ''}">
								<img src="../imges/icon-project-2.png" alt="">
								<!-- <img src="../imges/icon-project-2-t.png" alt="" v-else> -->
								11111111
							</div>
						</el-collapse-item>

					</el-collapse>
				</div>
			</div>
			<div class="right">
				<el-container>
				    <el-main class="main">
				        <!-- <video class="max" poster="../../../static/img/yanshiImg.png"></video> -->
				        <div style="width: 1280px; height: 460px; margin: auto; background-color: #F8F8F8;" class="main">
				          <iframe
				            :src="`https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/${current.DeviceSerial}/${current.ServerPort}.live&autoplay=1&accessToken=${current.AccressToken}`"
				            width="1260"
				            height="440"
				            allowfullscreen
				            v-if="this.list != null && this.list != '' && this.list != undefined"
				          >
				          </iframe>
				          <div style="display: flex;flex-direction:column;align-items: center;justify-content: center; height: 100%;" v-else> 
				            <el-image
				            style="width: 210px; height: 140px;"
				            src="https://file.hnztjia.com/mini/icons/empty2.png"
				            fit="cover"
				            >
				            </el-image>
				            <div style="margin-top: 5px; color: #999;">暂无视频</div>
				          </div>
				        </div>
				        <div style="display: inline-flex;">
				          <template v-for="(item,indexs) in monitorList">
				            <div class="video-box" :key="indexs" @click="changeVideo(item, indexs)">
				              <iframe
				                style="pointer-events: none;"
				                :src="`https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/${item.DeviceSerial}/${item.ServerPort}.live&autoplay=1&accessToken=${item.AccressToken}`"
				                width="310"
				                height="190"
				                allowfullscreen
				              >
				              </iframe>
				            </div>
				          </template>
				          <!-- <div class="video-box empty" v-for="(item,indexss) in arrList.slice(0,this.showIndex)"></div> -->
				        </div>
				    </el-main>
				</el-container>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isColor: -1,
				input3: '',
				listLeft: [{id:1,name:1},{id:5,name:5},{id:4,name:4},{id:3,name:3},{id:2,name:2}],
				list:[],
				monitorList:[],
				current: {},
				arrList:[1,2,3,4],
				showIndex:4,
			}
		},
		methods: {
			onselect() {
			},
			onClick(index){
				this.isColor = index
			},
			changeVideo(item) {
			  this.current = item;
			  // this.GetMonitor(item);
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.input-with-select .el-input__inner {
		background: #28487B !important;
		border: none !important;
		color: #fff !important;
	}

	/deep/.input-with-select .el-icon-search {
		color: #fff !important;
		margin: 12px 20px 0 0 !important;
	}

	/deep/.accordion-box .el-collapse-item__header {
		background: none !important;
		border: none !important;
	}

	/deep/.accordion-box .el-collapse-item__arrow {
		color: #fff;
	}

	/deep/.el-collapse {
		border: none !important;
		border-image: linear-gradient(0deg, #143C71, #0E478F) 10 10;
		background: linear-gradient(0deg, rgba(35, 89, 177, 0.2) 0%, rgba(42, 215, 255, 0) 100%);
		border-radius: 5px;
	}
	/deep/.el-collapse-item__wrap{
		padding-bottom: 0 !important;
		border-bottom: none !important;
		background-color:  none !important;
	}
	/deep/.el-collapse-item__content {
		padding-bottom: 0 !important;
	}

	.input-with-select {
		margin-bottom: 15px;
	}
	.lan-mu {
		width: 100%;
		height: 40px;
		line-height: 40px;
		color: #000;
		background: #fff;
		padding: 0 30px;
		cursor: pointer;
		img {
			vertical-align: middle;
		}
	} 
	.video-box {
		width: 100%;
		height: calc(100% - 52px);
		padding: 0 1.8979166666666667%;

		.content {
			display: flex;

			.title {
				padding: 10px 26px 16px 68px;
				background: url(../imges/title.png) no-repeat left top;
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

			.left {
				width: calc(100% - 75%);

				.input-box {
					padding: 20px;

					.accordion-title {
						padding: 0 20px;
						font-size: 16px;
						color: #fff;
						width: 100%;
						height: 40px;
						line-height: 40px;
						// border-image: linear-gradient(0deg, #143C71, #0E478F) 10 10;
						// background: linear-gradient(0deg, rgba(35, 89, 177, 0.2) 0%, rgba(42, 215, 255, 0) 100%);
						// border-radius: 5px;
					}
				}

			}

			.right {
				width: calc(100% - 20%);
				margin-left: 10%;
			}
		}
	}
	// .video-box{
	//     margin: 10px 15px 0 0;
	//     width: 310px;
	//     height: 190px;
	//     &.empty{
	//       position: relative;
	//       &::before{
	//         content: '';
	//         position: absolute;
	//         top: 0;
	//         right: 0;
	//         bottom: 0;
	//         left: 0;
	//         background: #f8f8f8 url(https://file.hnztjia.com/mini/icons/empty.png) no-repeat center center;
	//         background-size: 210px 140px;
	//       }
	//       &::after{
	//         content: '暂无视频';
	//         position: absolute;
	//         left: 50%;
	//         bottom: 3%;
	//         transform: translateX(-50%);
	//         color: #999;
	//       }
	//     }
	// }
</style>