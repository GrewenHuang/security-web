<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: zy
 * @Date: 2021-01-18 15:44:00
 * @LastEditors: Aidam_Bo
 * @LastEditTime: 2022-05-16 22:59:04
-->
<template>
	<page-layout :loading="loading">
		<div class="box" style="overflow: hidden;">
			<div class="el_card_left_box">
				<div>
					<el-input placeholder="车牌号码" v-model="carlist.car" clearable>
						<el-button slot="append" @click="search()">搜索</el-button>
					</el-input>
				</div>
				<div>
					<el-scrollbar style="height: 60vh;">
						<!-- default-expand-all 默认树结构打开 -->
						<!-- <el-tree :data="list.companys" node-key="id" :props="defaultProps">
						<span slot-scope="{ node, data }" @click="onClickName(data)">
							<img src="@/assets/images/adas/carHh.png" alt="" v-if="!data.children && data.ol == 1">
							<img src="@/assets/images/adas/car-offline.png" alt=""
								v-if="!data.children && data.ol != 1">
							<img src="@/assets/images/adas/department-open.png" alt="" v-if="data.children">
							{{ data.nm }}
						</span>
					</el-tree> -->
						<el-tree :data="carList" show-checkbox node-key="id" :props="defaultProps">
							<span slot-scope="{ node, data }" @click="onClickName(data)">
								<img src="@/assets/images/adas/carHh.png" alt="" v-if="!data.children && data.ol == 1">
								<img src="@/assets/images/adas/car-offline.png" alt=""
									v-if="!data.children && data.ol != 1">
							<a href="#" style="color: #000" :title="data.LicensePlateNumber" v-if="data.isTitle"
								class="parent-box">
								{{ data.LicensePlateNumber}}
							</a>
							<span v-else>{{data.LicensePlateNumber}}</span>
							</span>
						</el-tree>
					</el-scrollbar>
				</div>
			</div>
			<div class="el_card_right_box">
				<div style="width: 100%;height: 70vh; margin: auto; background-color: #F8F8F8;" class="main">
					<div class="box" style="display: flex;flex-wrap: wrap;" v-if="listForm && listForm.length > 0">
						<div v-for="(item, index) in listForm" :key="index" :style="{
													'marginRight': '5px',
													'marginBottom': '5px',
													'width': listForm.length == 1? '100%' : listForm.length == 2? '49.5%' : listForm.length == 3 || listForm.length == 4? '49%' : listForm.length > 4 ? '30%' : '',
													'height': listForm.length == 1? '100%' : listForm.length == 2? '100%' : listForm.length == 3 || listForm.length == 4? '49%' : listForm.length > 4 ? '50%' : '',
												}">
							<video style="width: 100%;height: 100%" :id="'video' + index"
								:disablePictureInPicture="true" controls autoplay muted></video>
						</div>
						<div style="width:49%;height: 49%;text-align: center;box-sizing: border-box;"
							v-if="listForm.length == 3">
							<el-image style="width: 50%; height: 50%;margin-top: 70px;"
								src="https://file.hnztjia.com/mini/icons/empty2.png" fit="cover">
							</el-image>
							<div style="margin-top: 5px; color: #999;">暂无视频</div>
						</div>
					</div>
					<div style="display: flex;flex-direction:column;align-items: center;justify-content: center; height: 100%;"
						v-else>
						<el-image style="width: 210px; height: 140px;"
							src="https://file.hnztjia.com/mini/icons/empty2.png" fit="cover">
						</el-image>
						<div style="margin-top: 5px; color: #999;">暂无视频</div>
					</div>
				</div>
			</div>
		</div>
	</page-layout>
</template>
<script>
	import flvjs from "flv.js";
	import API_CARALARM from "@/api/api_caralarm";
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		mixins: [request_mixin],
		data() {
			return {
				defaultProps: {
					children: 'children',
					label: 'nm'
				},
				flvPlayers: [],
				// listForm: [
				// 	{
				// 		src: "https://4g.gz56pip.com:16604/3/3?AVType=1&jsession=ca8a5deb842345758467d1902ca76595&DevIDNO=013306010577&Channel=0&Stream=1",
				// 		id: 0,
				// 	}
				// ],
				listForm: [],
				show: false,
				show1: false,
				loading: false,
				list: [],
				TableList: [],
				id: "",
				VehicleInLineRate: 0, //在线率
				VehicleInLineTotal: 0, //在线车辆
				VehicleOffLineTotal: 0, //离线车辆
				VehicleTotal: 0, //全部车辆
				pages: {
					page: 1,
					rows: 10,
					BeginDate: "",
					EndDate: "",
					WarnType: "",
					WarnLevel: "",
					VehicleId: ""
				},
				total: 0,
				carlist: {
					car: ""
				},
				tableData: [],
				WarnTypeCom: [],
				VehicleWarnLevelEnumCom: [],

				Punishs: {
					Id: "",
					PunishRemark: ""
				},
				isList: [],
				Imagefile: [], //图片文件
				Videofile: [], //视频文件
				Textfile: [], //文本文件
				monitorList: [],
				arrList: [1, 2, 3, 4],
				showIndex: 4,
				jsession: "",
				carList: [],
				carNameList: [],
				LicensePlateNumber: "",
				isArr: [],
				isEnterpriseName: '',
				vehicleNo: '',
				isG7orDay: ''
			};
		},
		mounted() {
			// this.init();
			this.GetHHLogin()
			this.GetCarList();
		},
		beforeDestroy() {
			this.destroyVideos();
		},
		methods: {
			async GetCarList() {
				let res = await this.Get('/GetEnterpriseGroupByIFVehicle', {
					vehicleNo: this.vehicleNo
				})
				if (res.status == 2000) {
					if (res.data && res.data.length > 0) {
						let arr = res.data
						this.isArr = []
						for (let i = 0; i < arr.length; i++) {
							let result = await this.Get('/GetEnterpriseStructureByEnterpriseId2', {
								vehicleNo: this.vehicleNo,
								enterpriseId: res.data[i].EnterpriseId
							})
							if (result.status == 2000) {
								this.isEnterpriseName = result.data.label
								// this.getEnterpriseId(result.data.children)
								// this.isArr.push(this.getEnterpriseId(result.data.children))
								// this.GetHHStarus
								let item1 = this.getEnterpriseId(result.data.children)
								for (let t = 0; t < item1.length; t++) {
									let childrenData = item1[t].children
									for (let j = 0; j < childrenData.length; j++) {
										let dataChildren = childrenData[j]
										// if(dataChildren.ServiceProviderType == 1){

										// }
										let params = {
											jsession: this.jsession,
											vehiIdno: dataChildren.LicensePlateNumber
										}
										this.Post('/HHThirdGetDeviceStatus', params).then(res => {
											if (res.status == 2000) {
												let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)))
												if (objData.result != 0) {
													// this.$message.error(`未找到对应的车辆！`)
												} else {
													if (objData.status) {
														for (let k = 0; k < objData.status.length; k++) {
															if (objData.status[k].vid == dataChildren
																.LicensePlateNumber) {
																if (objData.status[k].ol == 1) {
																	dataChildren.ol = 1
																} else {
																	dataChildren.ol = 0
																}
															} else {
																dataChildren.ol = 0
															}
															// for (let m = 0; m < this.isList.vehicles.length; m++) {
															// 	if (objData.status[k].vid == this.isList.vehicles[m].nm) {
															// 		   // 以下判断： 如果只需要看视频的话 拿注释的判断
															// 		// if(objData.status[i].sp && objData.status[i].sp > 0 && objData.status[i].ol == 1){
															// 		if(objData.status[k].ol == 1){	
															// 			dataChildren.ol = 1
															// 		}else {
															// 			dataChildren.ol = 0
															// 		}
															// 		// this.isList.vehicles[j].ol = objData.status[i].ol
															// 	}
															// }
														}
													}
												}
											}
										})
									}

								}
								// this.isArr.push(result.data)
								this.isArr = [...this.isArr, ...item1]
							}

						}

					}
					this.carList = this.isArr
					// this.carList = this.getCarList(this.isArr)
					let carArr = []
					for (let i = 0; i < this.carList.length; i++) {
						for (let j = 0; j < this.carList[i].children.length; j++) {
							carArr.push(this.carList[i].children[j].LicensePlateNumber)
						}
					}
					this.carNameList = carArr
				}
			},
			getEnterpriseId(arr) {
				let list = [];
				if (arr && arr.length > 0) {
					arr.forEach(item => {
						if (item.Vehicles && item.Vehicles.length > 0) {
							list.push({
								isTitle: true,
								LicensePlateNumber: this.isEnterpriseName + '(' + item.label + ')',
								children: item.Vehicles
							});
						}
						if (item.children && !!item.children.length) {
							list.push(...this.getEnterpriseId(item.children));
						}
					})
					return list;
				}
			},
			init() {
				this.GetData();
				this.GetCount();
				this.GetVehicleWarns();
				this.GetWarnTypeCom();
				this.GetVehicleWarnLevelEnumCom();
			},
			GetHHLogin() {
				this.loading = true
				this.Get('/HHThirdLogin').then(res => {
					if (res.status == 2000) {
						let objData = JSON.parse(res.data)
						// let objData = res.data
						this.jsession = objData.jsession
						this.GetVehicle(this.jsession)
					}
				})
			},
			async GetVehicle() {
				await this.Get('/HHThirdQueryUserVehicle?jsession=' + this.jsession).then(res => {
					if (res.status == 2000) {
						let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)))

						if (objData.companys && objData.companys.length > 0 && objData.vehicles && objData
							.vehicles.length > 0) {
							let arr = []
							objData.vehicles.forEach(vehicle => {
								arr.push(vehicle.nm)
							});
							objData.companys.forEach(company => {
								// 创建 children 数组用于存放匹配到的车辆数据
								company.children = [];
								// 遍历车辆数组
								objData.vehicles.forEach(vehicle => {
									// 如果车辆的 pid 与当前公司的 id 相同，则将车辆数据放入公司的 children 数组中
									if (vehicle.pid === company.id) {
										company.children.push(vehicle);
									}
								});
							});
							this.isList = objData
							this.$nextTick(() => {
								this.GetHHStarus(arr.join(','));
							})

						} else {
							this.$message({
								error: "数据获取失败,请稍后再试",
								type: "success",
							});
						}
					}
					this.loading = false
				})
			},
			onClickName(data) {
				if (data.children) {
					return
				} else {
					// this.pages.car = data.nm
					// this.GetHHVideo(data.nm)
					// return
					if (data.ol == 1) {
						this.pages.car = data.LicensePlateNumber
						this.GetHHVideo(data.LicensePlateNumber)
					} else {
						this.$message.error(`当前车辆不在线,无法查看视频！`)
					}

					// if (data.ol == 1) {
					// 	this.pages.car = data.nm
					// 	this.GetHHVideo(data.nm)
					// } else {
					// 	this.$message.error(`当前车辆不在线,无法查看视频！`)
					// }

				}
			},
			GetHHVideo(item) {
				this.destroyVideos();
				this.$nextTick(() => {
					let params = {
						jsession: this.jsession,
						vehiIdno: item,
					}
					this.listForm = []
					this.Get('/HHThirdGetDeviceByVehicle', params).then(res => {

						if (res.status == 2000) {
							let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)))
							if (objData.result != 0) {
								this.$message.error(`未找到对应的车辆视频！`)
							} else {
								if (objData.devices && objData.devices.length > 0) {
									objData.devices.map(item => {
										if (item.type == 0) {
											this.$message.error(`当前车辆视频不存在！`)
										}
										Object.entries(item.channel).forEach((data, index) => {
											if (item.type == 1) {
												this.GetHHVideoPlay(item.did, index)
											}
										})
									})

								} else {
									this.$message.error(`未找到对应的车辆视频！`)
								}

							}

						}
					})
				})
			},
			GetHHStarus(item) {
				let params = {
					jsession: this.jsession,
					vehiIdno: item
				}
				this.Post('/HHThirdGetDeviceStatus', params).then(res => {
					if (res.status == 2000) {
						let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)))
						if (objData.result != 0) {
							this.$message.error(`未找到对应的车辆！`)
						} else {
							if (objData.status) {
								for (let i = 0; i < objData.status.length; i++) {
									for (let j = 0; j < this.isList.vehicles.length; j++) {
										if (objData.status[i].vid == this.isList.vehicles[j].nm) {
											// 以下判断： 如果只需要看视频的话 拿注释的判断
											// if(objData.status[i].sp && objData.status[i].sp > 0 && objData.status[i].ol == 1){
											if (objData.status[i].ol == 1) {
												this.isList.vehicles[j].ol = 1
											} else {
												this.isList.vehicles[j].ol = 0
											}
											// this.isList.vehicles[j].ol = objData.status[i].ol
										}
									}

								}
								this.list = this.isList
							}
						}
					}
				})
			},
			GetHHVideoPlay(id, key) {
				let params = {
					jsession: this.jsession,
					DevIDNO: id,
					Channel: key,
					AVType: 1,
					Stream: 1
				}
				this.Get('/HHThirdHTTP_FLV', params).then(res => {

					if (res.status == 2000) {
						let objData = JSON.parse(JSON.stringify(res.data))
						this.listForm.push({
							src: objData
						})
						this.$nextTick(() => {
							this.startPlay();
						})
					}
					this.loading = false
				})
			},
			toPage(item) {
				this.id = item.id
				this.GetHHVideo(item.nm)
				this.GetHHStarus(item.nm)
			},
			startPlay() {
				this.listForm.forEach((item, index) => {
					const videoElement = document.getElementById("video" + index);
					const flvPlayer = flvjs.createPlayer({
						type: "flv",
						isLive: true,
						hasAudio: false,
						url: item.src,
					});
					flvPlayer.attachMediaElement(videoElement);
					flvPlayer.load();
					flvPlayer.play();
					this.$set(this.flvPlayers, index, flvPlayer);
				});
			},
			destroyVideos() {
				this.flvPlayers.forEach((flvPlayer) => {
					flvPlayer.pause();
					flvPlayer.unload();
					flvPlayer.detachMediaElement();
					flvPlayer.destroy();
				});
				this.flvPlayers = [];
			},
			reloadVideos() {
				this.destroyVideos();
				this.startPlay();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.pages.VehicleId = this.id;
				this.GetVehicleWarns();
			},
			search() {
				if (this.carlist.car) {
					this.GetHHVideo(this.carlist.car)
				} else {
					this.$message({
						message: "请输入车牌号码",
						type: "error"
					});
				}
			},
			async GetMonitor(Obj) {
				let params = this.getParams(Obj.MonitorId);
				let res = await this.Post('/GetMonitorConfigTopFour', params);
				if (res.status === 2000) {
					this.monitorList = res.data.list.map((item, index) => {
						// item.ServerPort = index + 1;
						return item;
					});
					this.showIndex = 4 - this.monitorList.length;
					this.current = Obj;
				}
			},
			changeVideo(item) {
				this.current = item;
				this.GetMonitor(item);
			},
			handleSearch() {
				this.GetVehicleWarns();
			},
			ScreenCarData(id) {
				this.id = id;
				this.pages.VehicleId = id;
				this.GetVehicleWarns();
			},
			GetWarnTypeCom() {
				API_CARALARM.GetWarnTypeCom().then(res => {
					this.WarnTypeCom = res.data;
				});
			},
			GetVehicleWarnLevelEnumCom() {
				API_CARALARM.GetVehicleWarnLevelEnumCom().then(res => {
					this.VehicleWarnLevelEnumCom = res.data;
				});
			},
			GetData() {
				API_CARALARM.GetList(this.carlist).then(res => {
					if (res.status == 2000) {
						this.list = res.data;
					}
				});
			},
			GetCount() {
				API_CARALARM.GetCount().then(res => {
					if (res.status == 2000) {
						for (let key in res.data) {
							this[key] = res.data[key];
						}
					}
				});
			},
			handleLookFile(id) {
				this.show1 = true;
				API_CARALARM.GetVehicleWarnAttachments({
					warnId: id
				}).then(res => {
					this.Imagefile = res.data.filter(item => {
						return item.FileType == 0;
					});
					this.Videofile = res.data.filter(item => {
						return item.FileType == 1 || item.FileType == 2;
					});
					this.Textfile = res.data.filter(item => {
						return item.FileType == 3;
					});
				});
			},
			handlePunish(id, PunishRemark) {
				this.show = true;
				this.Punishs.PunishRemark = PunishRemark;
				this.Punishs.Id = id;
			},
			dialogClear() {
				this.show = false;
			},
			handleSave() {
				API_CARALARM.SavePunishVehicleWarn(this.Punishs).then(res => {
					if (res.status == 2000) {
						this.$message({
							message: "操作成功",
							type: "success"
						});
					}
				});
			},

			GetVehicleWarns() {
				API_CARALARM.GetVehicleWarns(this.pages).then(res => {
					if (res.status == 2000) {
						this.tableData = res.data.list;
						this.total = res.data.count;
						this.loading = false;
					}
				});
			},
			setTime(date) {
				if (date) {
					let arr = date.split("T");
					return arr[0] + " " + arr[1];
				} else {
					return "无";
				}
			}
		}
	};
</script>
<style scoped lang="less">
	/deep/ .el-scrollbar {
		overflow-x: hidden !important;
	}
	/deep/ .el-scrollbar__thumb {
		display: none;
	}
	.box {
		width: 100%;
		height: 100%;
		margin-top: 6px;
		display: flex;
		justify-content: space-between;
	}

	.el_card_left_box {
		width: 19%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background: #ffffff;
		padding: 5px 20px;
		box-sizing: border-box;
		/* box-shadow: 1px 0px 6px 1px rgba(0, 0, 0, 0.1); */
	}

	.el_card_left_box>div:nth-child(1) {
		display: flex;
		align-items: center;
		height: 50px;
		width: 100%;
	}

	.el_card_left_box>div:nth-child(2) {
		flex: 1;
		width: 100%;
	}

	.el_card_left_box>div:nth-child(3) {
		height: 165px;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.el_card_left_box>div:nth-child(3)>div {
		width: 48%;
		background: #eaedf0;
		height: 70px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.el_card_right_box {
		background: #fff;
		width: calc(100% - 20%);
		/* height: 100%; */
		height: 70vh;
		/* padding: 5px 20px; */
		box-sizing: border-box;
		/* box-shadow: 1px 0px 6px 1px rgba(0, 0, 0, 0.1); */
	}

	/deep/ .el-input-group__append button.el-button {
		border-color: #3385ff;
		background-color: #3385ff;
		color: #fff;
	}

	/deep/ .el-input-group__append .el-input__inner {
		border-right: none !important;
	}

	.list {
		height: 55px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #f3f3f3;
	}

	.list:hover {
		background: #f2f4f6;
	}

	.active {

		background: #3385ff !important;
	}

	.active .font1 {
		color: #fff;
	}

	.fontwColor {
		color: #fff !important;
	}

	.font1 {
		font-size: 14px;
		color: #44566c;
	}

	.font2 {
		font-size: 12px;
		color: #b5bec8;
	}

	.icon {
		height: 8px;
		width: 8px;
		border-radius: 50%;
		background: #09b66d;
		display: inline-block;
	}

	.img_box {
		padding: 10px 0;
		box-sizing: border-box;
		height: 600px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: flex-start;
		flex-direction: row;
	}

	.img_box>div {
		border-radius: 2px;
		width: 235px;
		height: 185px;
		margin-bottom: 20px;
	}

	.text_box {
		padding: 10px 0;
		box-sizing: border-box;
		height: 600px;
	}

	.text_box>div {
		height: 50px;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
		border: 1px solid #e4e7ec;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		margin-bottom: 10px;
	}

	.text_box>div:hover {
		background: #f8f8f8;
	}

	.text_box>div:hover .text {
		color: #3385ff;
	}
</style>