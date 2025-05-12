<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: zy
 * @Date: 2021-01-18 15:44:00
 * @LastEditors: Aidam_Bo
 * @LastEditTime: 2022-05-16 22:59:04
-->
<template>
	<div class="box">
		<div class="el_card_left_box" v-loading="loading">
			<div>
				<el-input placeholder="车牌号码" v-model="carlist.licensePlateNumber">
					<el-button slot="append" @click="search">搜索</el-button>
				</el-input>
			</div>
			<div>
				<el-scrollbar style="height:630px;">
					<el-tree :data="list.companys" show-checkbox node-key="id" :props="defaultProps"
						@check="handleNodeClick" default-expand-all>
						<span slot-scope="{ node, data }" @click="onClickName(data)">
							<img src="@/assets/images/adas/carHh.png" alt="" v-if="!data.children && data.ol == 1">
							<img src="@/assets/images/adas/car-offline.png" alt=""
								v-if="!data.children && data.ol != 1">
							<img src="@/assets/images/adas/department-open.png" alt="" v-if="data.children">
							{{ data.nm }}
						</span>
					</el-tree>
				</el-scrollbar>
			</div>
		</div>

		<div class="el_card_right_box">
			<!-- 条件栏 开始 -->
			<el-card shadow="hover" class="toolbar">
				<el-form :inline="true">
					<el-form-item class="s">
						<el-date-picker type="date" v-model="pages.begintime" value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="开始时间"></el-date-picker>
					</el-form-item>
					<el-form-item class="s">
						<el-date-picker type="date" v-model="pages.endtime" value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="结束时间"></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" plain icon="el-icon-search" @click="search()">查询</el-button>
					</el-form-item>
				</el-form>
			</el-card>
			
			<el-table :data="tableData" border :cell-style="{'text-align':'center'}"
				:header-cell-style="{'text-align':'center'}"  v-loading="loading">
				<el-table-column label="序号" type="index" width="50"></el-table-column>
				<el-table-column prop="vid" label="车牌号码" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column width="80" prop="desc" label="报警描述" show-overflow-tooltip></el-table-column>
				<el-table-column width="100" prop="atpStr" label="报警类型"></el-table-column>
				<el-table-column width="120" prop="bTimeStr" label="报警开始时间" show-overflow-tooltip></el-table-column>
				<el-table-column width="120" prop="eTimeStr" label="报警结束时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="报警开始速度" width="120">
					<template slot-scope="scope">
						<span>{{scope.row.ssp? scope.row.ssp/10 +'km/h' : ''}}</span>
					</template>
				</el-table-column>
				<el-table-column label="报警结束速度" width="120">
					<template slot-scope="scope">
						<span>{{scope.row.esp? scope.row.esp/10+'km/h' : ''}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="Speed" label="报警开始经纬度">
					<template slot-scope="scope">
						<span>{{scope.row.smlng + '-' + scope.row.smlat }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="Speed" label="报警结束经纬度">
					<template slot-scope="scope">
						<span>{{scope.row.emlng + '-' + scope.row.emlat }}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="操作" width="240" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" @click="handleLookFile(scope.row)" v-if="$_has('CARWarnBtnFile')">报警附件</el-button>

						<el-button type="text"
							@click="handlePunish(scope.row.Id,scope.row.PunishRemark)">安全证据</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<!-- 列表 结束 -->

			<!--分页开始-->
			<el-col :span="24" class="toolbar bottompagation" style="text-align: center;">
				<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange"
					:page-size="pages.rows" :total="total" class="customPagination"></el-pagination>
			</el-col>
			<!--分页结束-->

			<!--弹层开始-->
			<el-dialog title="处罚" :visible.sync="show" :close-on-click-modal="false" width="40%">
				<el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="Punishs.PunishRemark"></el-input>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="dialogClear()">取消</el-button>
					<el-button type="primary" @click.native="handleSave()">确定</el-button>
				</div>
			</el-dialog>
			<!--弹层结束-->

			<!--弹层开始-->
			<el-dialog title="查看" :visible.sync="show1" :close-on-click-modal="false" width="40%">
				<el-tabs type="card">
					<el-tab-pane label="图片">
						<el-scrollbar style="height: 100%;width:100%">
							<div class="img_box">
								<div v-for="(k,v) in Imagefile" :key="v">
									<el-image style="width: 100%; height: 100%" :src="k.FileUrl"></el-image>
								</div>
							</div>
						</el-scrollbar>
					</el-tab-pane>
					<el-tab-pane label="视频/音频">
						<el-scrollbar style="height: 100%;width:100%">
							<div class="img_box">
								<div v-for="(k,v) in Videofile" :key="v">
									<video :src="k.FileUrl" controls width="100%" height="100%"></video>
								</div>
							</div>
						</el-scrollbar>
					</el-tab-pane>
					<el-tab-pane label="文本">
						<el-scrollbar style="height: 100%;width:100%">
							<div class="text_box">
								<div v-for="(k,v) in Textfile" :key="v">
									<div class="text">{{k.FileName}}</div>
									<div>{{k.FileSize}}MB</div>
								</div>
							</div>
						</el-scrollbar>
					</el-tab-pane>
				</el-tabs>
			</el-dialog>
			<!--弹层结束-->
		</div>
	</div>
</template>
<script>
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
				show: false,
				show1: false,
				loading: false,
				list: [],
				id: "",
				pages: {
					page: 1,
					rows: 10,
					begintime: "",
					endtime: "",
					alarmType: '2,9,11',
					vehiIdno: ""
				},
				total: 0,
				carlist: {
					licensePlateNumber: ""
				},
				tableData: [],
				isList: [],
				Punishs: {
					Id: "",
					PunishRemark: ""
				},
				Imagefile: [], //图片文件
				Videofile: [], //视频文件
				Textfile: [], //文本文件
				SelectArr: []
			};
		},
		mounted() {
			this.getDateTime()
			this.GetHHLogin()
		},

		methods: {
			getDateTime() {
				let currentTime = new Date();
				let year = currentTime.getFullYear();
				let month = currentTime.getMonth() + 1; // 月份从 0 开始，需要加 1
				let day = currentTime.getDate();
				let hours = currentTime.getHours();
				let minutes = currentTime.getMinutes();
				let seconds = currentTime.getSeconds();
				let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
				let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
				// let time = currentTime.setHours(0, 0, 0, 0);
				let time = `${year}-${month}-${day} ${hours}:${formattedMinutes}:${formattedSeconds}`
				this.pages.begintime = `${year}-${month}-${1} 00:00:00`
				this.pages.endtime = time

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
							this.$nextTick(() => {
								this.GetHHGps(arr.join(','));
							})
							this.isList = objData
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
			handleNodeClick(data, checked, indeterminate) {
				this.SelectArr = checked.checkedNodes
				if (this.SelectArr && this.SelectArr.length > 0) {
					let arr = []
					this.SelectArr.map(item => {
						if (!item.children) {
							if (item.ol == 1) {
								arr.push(item.nm)
							}
						}
					})
					// this.pages.vehiIdno = arr.join(',')
					this.pages.page = 1
					this.pages.vehiIdno = arr
					this.GetHHwarnList()
				}
			},
			onClickName(data) {
				if (data.children) {
					return
				} else {
					if (data.ol == 1) {
						this.pages.page = 1
						this.pages.vehiIdno = [data.nm]
						this.GetHHwarnList()
					} else {
						this.$message.error(`当前车辆不在线,无法查看报警数据！`)
					}
				}
			},
			GetHHGps(data) {
				let params = {
					jsession: this.jsession,
					vehiIdno: data
				}
				this.Post('/HHThirdGetDeviceStatus', params).then(res => {
					if (res.status == 2000) {
						let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)))
						this.GetHHwarnList()
						if (objData.result != 0) {
							this.$message.error(`未找到对应的车辆！`)
						} else {
							if (objData.status) {
								for (let i = 0; i < objData.status.length; i++) {
									for (let j = 0; j < this.isList.vehicles.length; j++) {
										if (objData.status[i].vid == this.isList.vehicles[j].nm) {
											this.isList.vehicles[j].ol = objData.status[i].ol
										}
									}
								}
								this.list = this.isList
							}
						}
					}
				})
			},
			GetHHwarnList() {
				let params = {
					page: this.pages.page,
					rows: this.pages.rows,
					/* 'jsession: this.jsession,
					begintime: this.pages.begintime,
					endtime: this.pages.endtime,
					alarmType: '2,9,11',' */
					vihicleNoList: this.pages.vehiIdno
				}
				this.loading = true
				this.Post('/HHThirdQueryAlarmDetail', params).then(res => {
					if (res.status == 2000) {
						this.tableData = res.data.list
						this.total = res.data.count
					}else {
						this.$message.error(`未找到对应的车辆！`)
					}
					this.loading = false
				})
				
			},
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetHHwarnList();
			},
			search() {
				this.pages.vehiIdno = this.carlist.licensePlateNumber
				this.GetHHwarnList();
			},
			handleLookFile(item) {
				let params = {
					jsession: this.jsession,
					devIdno: item.vid,
					begintime: item.bTimeStr,
					alarmType: '2,9,11',
					guid: item.guid
				}
				this.Get('/HHThirdAlarmEvidence', params).then(res => {
					if (res.status == 2000) {
						let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)))
						if(objData.result !=0){
							this.$message.error(`未找到对应的车辆数据！`)
						}else {
							console.log(123456)
						}
					}
				})
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
		}
	};
</script>
<style scoped>
	.bottompagation {
		bottom: 16px !important;
		z-index: 9999;
	}
	.box {
		width: 100%;
		height: 100%;

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
		width: 80%;
		height: 680px;
		padding: 5px 20px;
		box-sizing: border-box;
		/* box-shadow: 1px 0px 6px 1px rgba(0, 0, 0, 0.1); */
		overflow: hidden;
		overflow-y: auto;
	}
	 .el_card_right_box::-webkit-scrollbar {
	    width: 8px;
	  }
	
	  .el_card_right_box::-webkit-scrollbar-track {
	    background-color: #eee;
	  }
	
	  .el_card_right_box::-webkit-scrollbar-thumb {
	    background-color: #eee;
	    border-radius: 4px;
	  }
	
	  .el_card_right_box::-webkit-scrollbar-thumb:hover {
	    background-color: #ccc;
	  }
	
	  .el_card_right_box::-webkit-scrollbar-thumb:active {
	    background-color: #eee;
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