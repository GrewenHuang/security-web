<template>
	<div class="board-header f-b-c">
		<div class="left-operation">
			<!-- <div class="back-btn">
				<img class="rect" src="../imges/back-btn.png">
				<img class="iris" src="../imges/back-btn-iris.png">
				<div class="back-btn-text" @click="back">返回工作台</div>
			</div> -->
			<!-- <div style="font-size: 16px">{{ value | dateFormat}}</div> -->
		</div>
		<div class="header-bg">
			<div class="header-title">简单示例</div>
			<!-- <img src="../imges/top2.png"> -->
			<!-- <div class="update-btn" @click="update">
				<el-tooltip content="更新数据">
					<div>
						数据更新时间 {{ updateTime | format('HH:mm:ss')}}
					</div>
				</el-tooltip>
			</div> -->
		</div>
		
	<!-- 	<div class="right-operation" @click="loginOut">
			<span>admin,欢迎你</span>
		</div> -->
	</div>
</template>

<script>
	import API from "@/api/api_user";
	import util from '@/common/util';
	let loginUrl = util.getLoginUrl();
	function zero(num) {
	    return num < 10 ? '0' + num : num;
	}
	export default {
		props: {
			loading: Boolean
		},
		data() {
			return {
				value: new Date(),
				updateTime: new Date(),
			}
		},
		filters:{
			//格式化时间
		    dateFormat() {
		      var date = new Date();
		      var year = date.getFullYear();
		      var month = zero(date.getMonth() + 1);
		      var day = zero(date.getDate());
		      var hours = zero(date.getHours());
		      var minutes = zero(date.getMinutes());
		      var seconds = zero(date.getSeconds());
		      let week = date.getDay(); // 星期
		      let weekArr = ["星期日","星期一","星期二","星期三","星期四","星期五", "星期六",];
		      return (
		        year + "年" + month + "月" + day + "日 " + hours + ":" + minutes + ":" + seconds + " " + weekArr[week]
		      );
		    },
		},
		 mounted() {
		     this.timer = setInterval(() => {
		       this.value = new Date();
		     }, 1000);
		 },
		 //实例销毁之前清除定时器
		 beforeDestroy() {
		     if (this.timer) {
		       clearInterval(this.timer);
		     }
		 },
		methods: {
			back() {
				location.href = '/';
			},
			update() {
				// this.$emit('update:loading', true)
				setTimeout(() => {
					this.updateTime = new Date();
					this.$emit('update:loading', false)
				}, 1000);
			},
			loginOut() {
				this.$confirm('确认退出吗？', '提示').then(() => {
					API.logout()
						.then(res => {
							window.localStorage.removeItem("userinfo");
							window.localStorage.removeItem("ttoken");
							window.localStorage.removeItem("enterpriseId");
							window.localStorage.removeItem("menus");
							this.$router.go(loginUrl); //用go刷新
						})
						.catch(err => {
							this.$message.error({
								showClose: true,
								message: err.message,
								duration: 2000,
							});
						});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.board-header {
		color: #fff;
		position: relative;
		width: 100%;
		min-width: 1920px;
		height: 52px;
		color: #fff;
		margin-bottom: 50px;
		// background: #1A264B;
		.header-bg {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 2;
			width: 100%;
			pointer-events: none;
			user-select: none;

			img {
				pointer-events: none;
			}

			.header-title {
				position: absolute;
				top: 10px;
				left: 50%;
				height: 50px;
				transform: translateX(-50%);
				font-size: 37px;
				font-family: Source Han Sans CN;
				font-weight: bold;
				color: #FFFFFF;
				line-height: 50px;
				text-shadow: 0px 2px 3px rgba(9, 35, 51, 0.21);
				background: linear-gradient(180deg, #FFF 40%, #8BBFFF 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				pointer-events: all;
			}

			.update-btn {
				position: absolute;
				left: 150px;
				top: 75px;
				transform: translateX(-50%);
				font-size: 16px;
				pointer-events: all;
				cursor: pointer;

				.icon-board {
					margin-right: 8px;
					font-size: 12px;
				}
			}
		}

		.left-operation,
		.right-operation {
			z-index: 3;
			height: 100%;
		}

		.left-operation {
			padding: 6px 0 6px 8px;

			.back-btn {
				position: relative;
				height: 100%;
				cursor: pointer;
				user-select: none;

				.rect {
					height: 100%;
					pointer-events: none;
				}

				.iris {
					position: absolute;
					top: -18px;
					right: -20px;
					pointer-events: none;

					// animation: scale linear 1.6s infinite;
					@keyframes scale {
						0% {
							transform: scale(.5);
						}

						40% {
							transform: scale(1);
						}

						60% {
							transform: scale(1);
						}

						100% {
							transform: scale(.5);
						}
					}
				}

				.back-btn-text {
					position: absolute;
					z-index: 9;
					top: 50%;
					right: 35px;
					transform: translateY(-70%);
					font-size: 14px;
					font-weight: 600;
					background: linear-gradient(180deg, #FFF 40%, #8BBFFF 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}
		}

		.right-operation {
			cursor: pointer;
			// padding-right: 2.8% !important;
			display: flex;
			align-items: center;
			font-size: 16px;
			margin-top: 50px;
			.icon-board {
				margin-left: 12px;
			}
		}
		.left-operation {
			// padding-left: 2.8% !important;
			margin-top: 75px;
		}
	}
</style>