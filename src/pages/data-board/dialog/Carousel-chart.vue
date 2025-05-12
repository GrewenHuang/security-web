<template>
	<div>
		<transition name="fade">
			<div @touchend="end" @touchstart="start" @touchmove="move" class="swiper" @mouseover="mouseover"
				@mouseout="mouseout">
				<div class="content" @click="chooseItem(item, index)" v-for="(item, index) in imgs"
					:style="config5[index]" :key="index">
					<!-- <img :src="item.cover" style="width: 100%; height: 100%" /> -->
					<pdf :key="index" :src="src" :page="index" class="pdf-preview">
					</pdf>
				</div>
			</div>
		</transition>
		<!-- <ul class="ul-box">
			<li v-for="(item, index) in imgs" @mouseover="imgMouse(index)" :style="{'background': currentIndex == index ? '#409EFF' : ''}"></li>
		</ul> -->
		<div @click="next" class="right"><i class="el-icon-arrow-right"></i></div>
		<div @click="prev" class="left"><i class="el-icon-arrow-left"></i></div>
		<h1>当前：{{ centerInfo.id }}</h1>
	</div>
</template>
<script>
	import pdf from "vue-pdf";
	export default {
		name: "zt",
		components: {
			pdf,
		},
		props: {
			// pdf预览的地址 由父组件中传入 也可在本组件中直接赋值
			url: {
				type: String,
				default: "",
			},
		},
		watch: {
			url: {
				deep: true, //true为进行深度监听,false为不进行深度监听
				handler(newVal) {
					this.currentPage = 1;
					this.src = pdf.createLoadingTask(this.url);
					this.$nextTick(() => {
						this.src.promise.then((pdf1) => {
							this.numPages = pdf1.numPages;
							let arr = []
							for(let i = 0;i<this.numPages;i++ ){
								let obj = {
									id: i + 'pdf',
									index: i
								}
								arr.push(obj)
							}
							this.imgs = arr
							this.getData();
							this.centerCard(); // 获取中间卡片信息
							this.addCardStyle(); // 加入样式位置的index
							this.mouseout()
						});
						
					});
				},
			},
		},
		data() {
			return {
				currentPage: 1,
				src: "",
				numPages: undefined,
				loading: true,
				currentIndex: 0, //当前中间imgs数组中index
				centerInfo: "", // 当前中间信息
				startX: "",
				endX: "",
				imgs: [{
						id: "莱因哈特1",
						index: 0,
						cover: "http://pic2.zhimg.com/v2-1c9b73f260ea2652dcdedfc782fde90d_b.jpg",
					},
					{
						id: "安娜2",
						index: 1,
						cover: "http://pic2.zhimg.com/v2-1c9b73f260ea2652dcdedfc782fde90d_b.jpg",
					},
					{
						id: "卢西奥3",
						index: 2,
						cover: "http://ztd00.photos.bdimg.com/ztd/w=700;q=50/sign=ea29fa95c13d70cf4cfaa80dc8e7a03d/42166d224f4a20a4d334946b98529822720ed070.jpg",
					},
					{
						id: "DVA4",
						index: 3,
						cover: "http://ztd00.photos.bdimg.com/ztd/w=700;q=50/sign=ea29fa95c13d70cf4cfaa80dc8e7a03d/42166d224f4a20a4d334946b98529822720ed070.jpg",
					},
					{
						id: "莫伊拉5",
						index: 4,
						cover: "http://pic2.zhimg.com/v2-1c9b73f260ea2652dcdedfc782fde90d_b.jpg",
					},
					{
						id: "裂空6",
						index: 5,
						cover: "http://ztd00.photos.bdimg.com/ztd/w=700;q=50/sign=ea29fa95c13d70cf4cfaa80dc8e7a03d/42166d224f4a20a4d334946b98529822720ed070.jpg",
					},
					{
						id: "麦克雷7",
						index: 6,
						cover: "http://pic2.zhimg.com/v2-1c9b73f260ea2652dcdedfc782fde90d_b.jpg",
					},
					{
						id: "士兵76  8",
						index: 7,
						cover: "http://pic2.zhimg.com/v2-1c9b73f260ea2652dcdedfc782fde90d_b.jpg",
					},
					{
						id: "狂鼠9",
						index: 8,
						cover: "http://ztd00.photos.bdimg.com/ztd/w=700;q=50/sign=ea29fa95c13d70cf4cfaa80dc8e7a03d/42166d224f4a20a4d334946b98529822720ed070.jpg",
					},
					{
						id: "死神 10",
						index: 9,
						cover: "http://ztd00.photos.bdimg.com/ztd/w=700;q=50/sign=ea29fa95c13d70cf4cfaa80dc8e7a03d/42166d224f4a20a4d334946b98529822720ed070.jpg",
					},
					{
						id: "禅雅塔 11",
						index: 10,
						cover: "http://pic2.zhimg.com/v2-1c9b73f260ea2652dcdedfc782fde90d_b.jpg",
					},
					{
						id: "黑百合 12",
						index: 11,
						cover: "http://pic2.zhimg.com/v2-1c9b73f260ea2652dcdedfc782fde90d_b.jpg",
					},
				],
				previous: 0,
				config: [{
						id: "-A",
						position: "absolute",
						width: "22%",
						height: "72%",
						top: "19.2%",
						left: "-22%",
						opacity: 0,
						zIndex: 0,
						transition: ".4s",
					},
					{
						id: "A",
						position: "absolute",
						width: "20%",
						height: "67%",
						top: "21.5%",
						left: "-6%",
						opacity: 1,
						zIndex: 1,
						transition: ".4s",
						"clip-path": "polygon(0 100%, 100% 90%, 100% 10%, 0 0, 0 100%)",
					},
					{
						id: "B",
						position: "absolute",
						width: "24%",
						height: "74%",
						top: "18%",
						left: "4.4%",
						opacity: 0.95,
						zIndex: 2,
						transition: ".4s",
						"clip-path": "polygon(0 100%, 100% 90%, 100% 10%, 0 0, 0 100%)",
					},
					{
						id: "center",
						position: "absolute",
						width: "40%",
						height: "100%",
						top: "0%",
						left: "53%",
						marginLeft: "-22.5%",
						opacity: 1,
						zIndex: 4,
						transition: ".4s",
					},
					{
						id: "D",
						position: "absolute",
						width: "23%",
						height: "74%",
						top: "18%",
						left: "72.8%",
						opacity: 0.98,
						zIndex: 2,
						transition: ".4s",
						"clip-path": "polygon(100% 0, 0 10%,0 90%, 100% 100%, 100% 0)",
					},
					{
						id: "E",
						position: "absolute",
						width: "20%",
						height: "67%",
						top: "21.5%",
						left: "90%",
						opacity: 0.98,
						zIndex: 1,
						transition: ".4s",
						"clip-path": "polygon(100% 0, 0 10%,0 90%, 100% 100%, 100% 0)",
					},
					{
						id: "E+",
						position: "absolute",
						width: "22%",
						height: "72%",
						top: "19.2%",
						left: "100%",
						opacity: 0,
						zIndex: 0,
						transition: ".4s",
					},
				],
				config5: [],
				timer: null
			};
		},
		destroyed() {
			clearTimeout(this.timer);
		},
		//实例销毁之前清除定时器
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer);
			}
		},
		methods: {
			mountedLoaded() {
				// 去除遮罩
				this.boxLoading = false;
			},
			imgMouse(){
				this.next()
			},
			mouseover() {
				clearInterval(this.timer);
				this.timer = null;
			},
			mouseout() {
				this.timer = setInterval(() => {
					this.next()
				}, 8000);
			},
			// 获取数据
			async getData() {
				this.$nextTick(() => {
					this.loading = false;
				});
			},
			// 滑动上一个
			prev(index) {
				// this.config5.push(this.config5.shift());
				this.currentIndex --
				if (this.currentIndex < 0) {
					this.currentIndex = this.imgs.length - 1;
				}
				// this.centerCard();
				// this.centerIndex("prev");
			},
			// 滑动下一个
			next() {
				// this.config5.unshift(this.config5.pop());
				this.currentIndex ++
				if (this.currentIndex > this.imgs.length - 1) {
					this.currentIndex = 0;
				}
				// this.centerCard();
				// this.centerIndex("next");
			},
			// 开始移动端滑动屏幕
			start(event) {
				this.startX = event.changedTouches[0].clientX;
				this.startY = event.changedTouches[0].clientY;
			},
			// 连续滑动
			move(event) {
				this.endY = event.changedTouches[0].clientY;
				this.endX = event.changedTouches[0].clientX;
				this.stopDefault(event);
				// 如果是滑动，注解（223行到231行）这段。如果是连续滑动，放开（223行到231行）注解
				this.interval = this.endX - this.startX;
				if (this.interval > 40) {
					this.startX = this.endX;
					this.prev();
				}
				if (this.interval < -40) {
					this.startX = this.endX;
					this.next();
				}
			},
			// 滑动
			end(event) {
				// 如果是滑动，放开（236行到238行）的注解。如果是连续滑动，注解（236行到238行）
				// this.endY = event.changedTouches[0].clientY;
				// this.endX = event.changedTouches[0].clientX;
				// this.formatSwiper();
			},
			formatSwiper() {
				if (this.startX > this.endX) {
					if (this.startX > this.endX + 40) {
						this.next();
					}
				} else {
					if (this.endX > this.startX + 40) {
						this.prev();
					}
				}
			},
			// 阻止touchmove的横向默认事件（ios快捷操作会关闭页面）
			stopDefault(event) {
				let differenceY = this.endY - this.startY;
				let differenceX = this.endX - this.startX;
				if (Math.abs(differenceX) > Math.abs(differenceY)) {
					event.preventDefault();
				}
			},
			// 当前imgs在位置上的index（并非img数组的index）
			centerIndex(val) {
				if (val == "prev") {
					for (let val of this.imgs) {
						if (val.index == this.imgs.length - 1) {
							val.index = 0;
						} else {
							val.index = val.index + 1;
						}
					}
				} else {
					for (let val of this.imgs) {
						if (val.index == 0) {
							val.index = this.imgs.length - 1;
						} else {
							val.index = val.index - 1;
						}
					}
				}
			},
			// 点击
			chooseItem(item, index) {
				var showPics;
				var imgsL = this.imgs.length;

				if (imgsL >= 7) {
					console.log(8888);
					showPics = 3;
				} else if (imgsL < 7 && imgsL > 4) {
					console.log(77777);
					showPics = 2;
				} else if (imgsL > 1 && imgsL <= 4) {
					console.log(5555);
					showPics = 1;
				}

				let cycles = item.index;

				if (item.index < showPics) {
					for (let i = 0; i < showPics - cycles; i++) {
						this.prev();
					}
				} else if (item.index > showPics) {
					for (let i = -1; i < item.index - showPics; i++) {
						this.next();
					}
				} else if (item.index == showPics) {
					console.log("投票");
				}
			},
			// 计算中间卡片信息
			centerCard() {
				if (this.imgs.length > 3) {
					this.centerInfo = this.imgs[this.currentIndex];
					this.$emit("centerInfo", this.centerInfo);
				}
			},

			addCardStyle() {
				var con = this.config;
				var imgsL = this.imgs.length;

				if (imgsL == 1) {
					this.config5 = con[3];
				} else if (imgsL == 2) {
					this.config5 = [con[2], con[3]];
				} else if (imgsL == 3) {
					this.config5 = [con[2], con[3], con[4]];
				} else if (imgsL == 4) {
					this.config5 = [con[2], con[3], con[4], con[5]];
				} else if (imgsL == 5) {
					this.config5 = [con[1], con[2], con[3], con[4], con[5]];
				} else if (imgsL == 6) {
					this.config5 = [con[1], con[2], con[3], con[4], con[5], con[6]];
				} else if (imgsL >= 7) {
					this.config5 = this.config;
				}

				// if (this.imgs.length > 7) {
				//   let addtime = this.imgs.length - 7;
				//   for (let i = 0; i < addtime; i++) {
				//     this.config5.push({
				//       id: "center",
				//       position: "absolute",
				//       width: "45%",
				//       height: "100%",
				//       top: "0px",
				//       left: "50%",
				//       marginLeft: "-22.5%",
				//       opacity: 0,
				//       transition: ".1s",
				//     });
				//   }
				// }
			},
		},
		mounted() {
			this.src = pdf.createLoadingTask(this.url);
			this.$nextTick(() => {
				this.src.promise.then((pdf1) => {
					this.numPages = pdf1.numPages;
					let arr = []
					for(let i = 0;i<this.numPages;i++ ){
						let obj = {
							id: i + 'pdf',
							index: i
						}
						arr.push(obj)
					}
					this.imgs = arr
					this.getData();
					this.centerCard(); // 获取中间卡片信息
					this.addCardStyle(); // 加入样式位置的index
					this.mouseout()
				});
				
			});
			
			
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.pdf-preview canvas {
		//提高指定样式规则的应用优先权（优先级）
		//   width: 500px !important;
		height: 100% !important;
		min-height: calc(100vh - 150px) !important;
	}
	.swiper {
		width: 100%;

		height: 80vh;
		position: relative;
		overflow: hidden;

		div {
			opacity: 0;
		}

		.content {
			min-width: 210px;
			height: 100%;
			position: relative;
			top: -4px;
			// background: #4fa6e5;
			background: linear-gradient(0deg, rgba(0, 50, 126, 0.1) 20%, rgba(0, 50, 126, 0.3) 40%, rgba(0, 50, 126, 0.6) 60%, rgba(0, 50, 126, 0.5) 100%);
			padding: 10px;
			// border-bottom: 1px solid #4fa6e5;
			// clip-path: polygon(0 0, 10px 100%, calc(100% - 10px) 100%, 100% 0);
			box-sizing: border-box;

			img {
				box-sizing: border-box;
				// background: #5cb4f700;
				// box-shadow: 1px 13px 19px 5px gray;
				// background: linear-gradient(0deg, #00327E 100%);
				// opacity: 0.32;
			}
		}
	}

	.right,
	.left {
		font-size: 4rem;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		color: #ffffff91;
		z-index: 66;
		background: #ffffff63;
		border-radius: 1rem;
		padding: 0.2rem 0.5rem;
	}

	.right {
		right: 0;
	}

	.left {
		left: 0;
	}

	.ul-box {
		color: #fff;
		display: flex;
		justify-items: center;
		justify-content: center;
		width: 100%;
		margin-top: 10px;
		&:hover {
			cursor: pointer;
		}
		li {
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background: #C0C4CC;
			margin-right: 5px;
			&:hover {
				background:#409EFF;
			}
		}
	}
</style>