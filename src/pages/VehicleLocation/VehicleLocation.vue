<template>
	<page-layout :loading="loading">
	<div class="box" style="overflow: hidden;">
		<div class="el_card_left_box">
			<div>
				<el-input placeholder="车牌号码" v-model="vehicleNo" clearable>
					<el-button slot="append" @click="search()">搜索</el-button>
				</el-input>
			</div>
			<div>
				<el-scrollbar style="height: 60vh;overflow-x: hidden;">
					<el-tree :data="carList" show-checkbox node-key="id" :props="defaultProps" @check="handleNodeClick" >
						<span slot-scope="{ node, data }" @click="onClickName(data)">
							<img src="@/assets/images/adas/carHh.png" alt="">
							<a href="#" :title="data.LicensePlateNumber" v-if="data.isTitle" class="parent-box">
								{{ data.LicensePlateNumber}}
							</a>
							<span v-else>{{data.LicensePlateNumber}}</span>
						</span>
					</el-tree>
					<!-- <el-tree :data="list.companys" show-checkbox node-key="id" :props="defaultProps"
						@check="handleNodeClick" default-expand-all>
						<span slot-scope="{ node, data }" @click="onClickName(data)">
							<img src="@/assets/images/adas/carHh.png" alt="" v-if="!data.children && data.ol == 1">
							<img src="@/assets/images/adas/car-offline.png" alt="" v-if="!data.children && data.ol != 1">
							<img src="@/assets/images/adas/department-open.png" alt="" v-if="data.children"> 
							{{ data.nm }}
						</span>
					</el-tree> -->
					<!-- <div class="list" v-for="(item,i) in list" :key="i" :class="[ id === item.id?'active':'']"
						@click="toPage(item)">
						<div style="width:200px;height:100%;display:flex;align-items:center">
							<img :src="require('@/assets/images/adas/car.png')" alt="" style="width:50px;height:50px;">
							<div>
								<div :class="[id=== item.VehicleId?'fontwColor':'font1']">
									{{item.pnm + '-' + item.nm || '无'}}
								</div>
							</div>
						</div>
					</div> -->
				</el-scrollbar>
			</div>
			<!--  <div>
        <div>
          <div style="font-size:12px;margin-bottom:8px;display:flex;justify-content:space-between">
            <span>在线车辆</span>
            <span class="icon"></span>
          </div>
          <div style="font-size:18px;font-weight:700">{{VehicleInLineTotal}}</div>
        </div>
        <div>
          <div style="font-size:12px;margin-bottom:8px;display:flex;justify-content:space-between">
            <span>离线车辆</span>
            <span class="icon" style="background:#8797A7"></span>
          </div>
          <div style="font-size:18px;font-weight:700">{{VehicleOffLineTotal}}</div>
        </div>
        <div>
          <div style="font-size:12px;margin-bottom:8px">
            <span>全部车辆</span>
          </div>
          <div style="font-size:18px;font-weight:700">{{VehicleTotal}}</div>
        </div>
        <div>
          <div style="font-size:12px;margin-bottom:8px">
            <span>在线率</span>
          </div>
          <div style="font-size:18px;font-weight:700">{{parseInt(VehicleInLineRate)}}%</div>
        </div>
      </div> -->
		</div>
		<div class="el_card_right_box" v-loading="loadingMap">
			<!-- <component :is="comb" :data="TableList" :id="id"></component> -->
			<Car :data="TableList" ref="car"></Car>
		</div>
	</div>
	</page-layout>
</template>
<script>
	import Car from "./car.vue";
	import Carinfo from "./carinfo.vue";
	import API_ADAS from "@/api/api_adas";
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		components: {
			Car,
			Carinfo
		},
		mixins: [request_mixin],
		data() {
			return {
				defaultProps: {
					children: 'children',
					label: 'nm'
				},
				loading: false,
				loadingMap: false,
				comb: "Car",
				id: "",
				list: [],
				TableList: [],
				isList: [],
				pages: {
					car: ""
				},
				VehicleInLineRate: 0, //在线率
				VehicleInLineTotal: 0, //在线车辆
				VehicleOffLineTotal: 0, //离线车辆
				VehicleTotal: 0, //全部车辆
				jsession: "", //华恒登录token
				timer: "",
				SelectArr: [],
				StatusList: [],
				carList: [],
				carNameList: [],
				LicensePlateNumber: "",
				isArr: [],
				isEnterpriseName: '',
				vehicleNo: ''
			};
		},
		mounted() {
			this.GetData();
			this.GetCount();
			this.GetCarList();
		},
		beforeDestroy() {
			// 组件销毁前清除定时器
			clearInterval(this.timer);
		},
		methods: {
			// getCarList(arr) {
			// 	let list = [];
			// 	arr.forEach(item => {
			// 		if (item.Vehicles && item.Vehicles.length > 0) {
			// 			list.push({
			// 				LicensePlateNumber: item.label,
			// 				children: item.Vehicles
			// 			});
			// 		}
			// 		if (item.children && !!item.children.length) {
			// 			list.push(...this.getCarList(item.children));
			// 		}
			// 	})
			// 	return list;
			// },
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
			async GetCarList() {
				let res = await this.Get('/GetEnterpriseGroupByIFVehicle',{vehicleNo: this.vehicleNo})
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
								this.isArr = [...this.isArr, ...this.getEnterpriseId(result.data.children)]
								// this.isArr.push(result.data)
							}

						}

					}
					this.timer = setInterval(() => {
						this.LicensePlateNumber = ''
						this.GetCarList()
					}, 600000);
					this.carList = this.isArr
					// this.carList = this.getCarList(this.isArr)
					let carArr = []
					for (let i = 0; i < this.carList.length; i++) {
						for (let j = 0; j < this.carList[i].children.length; j++) {
							carArr.push(this.carList[i].children[j].LicensePlateNumber)
						}
					}
					this.carNameList = carArr
					this.GetCarLocation()
				}

				return
				this.loading = true
				this.Post('/GetVehicles', {
					page: 1,
					rows: 9999,
					LicensePlateNumber: this.LicensePlateNumber
				}).then(res => {
					if (res.status == 2000) {
						let result = []
						for (let i = 0; i < res.data.list.length; i++) {
							if (!res.data.list[i].LicensePlateNumber.includes('挂')) {
								result.push(res.data.list[i]);
							}
						}
						this.carList = result
						this.timer = setInterval(() => {
							this.LicensePlateNumber = ''
							this.GetCarList()
						}, 600000);
						if (res.data.list && res.data.list.length > 0) {
							this.carNameList = result.map(item => item.LicensePlateNumber)
							this.GetCarLocation()
						} else {
							this.TableList = []
							this.$message.error('当前没有车辆信息,请添加后在尝试!')
						}

					}
					this.loading = false
				})
			},
			chunkArray(array, chunkSize) {
			  let result = [];
			  for (let i = 0; i < array.length; i += chunkSize) {
			    result.push(array.slice(i, i + chunkSize));
			  }
			  return result;
			},
			async GetCarLocation() {
				const chunkedData = this.chunkArray(this.carNameList, 30)
				this.loadingMap = true
				if(chunkedData && chunkedData.length > 0){
					let arr = []
					for(let i = 0;i< chunkedData.length;i ++ ){
						let item = chunkedData[i]
						let res = await this.Get('https://gps.gzhhl.com.cn/api/last-positions/truck?truckIds=' + item.join(','))
						if (res.code == 0) {
							arr.push(...res.data)
						} else {
							this.$message.error(res.msg)
						}
					}
					this.loadingMap = false
					this.TableList = [...arr]
				}
				
			},
			GetHHLogin() {
				return
				this.loading = true
				this.Get('/HHThirdLogin').then(res => {
					if (res.status == 2000) {
						let objData = JSON.parse(res.data)
						// let objData = res.data
						this.jsession = objData.jsession
						this.GetVehicle(this.jsession)
						this.timer = setInterval(() => {
							this.GetPosition()
						}, 600000);
					}
				})
			},
			GetPosition() {
				this.pages.car = ""
				let arr = []
				if (this.list.vehicles && this.list.vehicles.length > 0) {
					this.list.vehicles.forEach(vehicle => {
						arr.push(vehicle.nm)
					});
					this.getLocation(arr.join(','));
				}
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
								this.GetHHGps(arr.join(','))
							})
						} else {
							this.$message({
								error: "数据获取失败,请稍后再试",
								type: "success",
							});
						}
					}
				})
			},
			GetHHGps(data) {
				let params = {
					jsession: this.jsession,
					vehiIdno: data
				}
				this.Post('/HHThirdGetDeviceStatus', params).then(res => {
					if (res.status == 2000) {
						let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)))
						if (objData.result != 0) {
							this.$message.error(`未找到对应的车辆！`)
						} else {
							// if (objData.status && objData.status.length) {
							if (objData.status) {
								this.StatusList = objData.status
								for (let i = 0; i < objData.status.length; i++) {
									for (let j = 0; j < this.isList.vehicles.length; j++) {
										if (objData.status[i].vid == this.isList.vehicles[j].nm) {
											this.isList.vehicles[j].ol = objData.status[i].ol
										}
									}
								}
								this.list = this.isList
								this.getLocation(data);
							}
						}
					}
				})
			},
			handleNodeClick(data, checked, indeterminate) {
				if (checked.checkedNodes && checked.checkedNodes.length > 0) {
					this.carNameList = checked.checkedNodes.map(item => item.LicensePlateNumber)
					this.GetCarLocation()
				} else {
					this.LicensePlateNumber = ''
					this.TableList = []
					// this.GetCarList()

				}

				return
				this.SelectArr = checked.checkedNodes
				if (this.SelectArr && this.SelectArr.length > 0) {
					let arr = []
					this.SelectArr.map(item => {
						if (!item.children) {
							arr.push(item.nm)
						}
					})
					this.getLocation(arr.join(','))
				} else {
					this.GetPosition()
				}
			},
			onClickName(data) {
				if (data.children) {
					return
				} else {
					this.carNameList = [data.LicensePlateNumber]
					this.GetCarLocation()
					// this.pages.car = data.LicensePlateNumber
					// this.getLocation(data.nm)
				}
			},
			getLocation(data) {
				let params = {
					// jsession: this.jsession,
					vehiIdno: data,
					toMap: 1
				}
				this.Post('/HHThirdVehicleStatus', {
					vehiIdno: data
				}).then(res => {
					if (res.status == 2000) {
						let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)))
						if (objData.result != 0) {
							this.$message.error(`未找到对应的车辆！`)
						} else {
							if (objData.infos) {
								for (let i = 0; i < objData.infos.length; i++) {
									for (let j = 0; j < this.StatusList.length; j++) {
										if (objData.infos[i].vi == this.StatusList[j].vid) {
											objData.infos[i].ol = this.StatusList[j].ol
										}
									}
								}
								this.loading = false
								this.TableList = objData.infos
							}
						}

					}
				})
			},
			setTime(date) {
				if (date) {
					let arr = date.split("T");
					return arr[0] + " " + arr[1];
				} else {
					return "无";
				}
			},
			toPage(item) {
				this.id = item.id;
				// this.comb = "Carinfo";
				this.pages.car = item.nm
				this.$refs.car.currentWindow.visible = false
				this.getLocation()
			},
			search() {
				// this.GetData();
				this.$refs.car.currentWindow.visible = false
				this.GetCarList()
				// this.getLocation(this.pages.car)
			},

			GetData() {
				API_ADAS.GetList(this.pages).then(res => {
					if (res.status == 2000) {
						this.list = res.data;
					}
				});
			},

			GetCount() {
				API_ADAS.GetCount().then(res => {
					if (res.status == 2000) {
						for (let key in res.data) {
							this[key] = res.data[key];
						}
					}
				});
			}
		}
	};
</script>
<style scoped >
	.box {
		width: 100%;
		height: 100%;
		display: flex;
		margin-top: 5px;
		justify-content: space-between;
	}

	.el_card_left_box {
		width: 20%;
		height: 65vh;
		display: flex;
		flex-direction: column;
		background: #ffffff;
		/* box-shadow: 1px 0px 6px 1px rgba(0, 0, 0, 0.1); */
	}

	.el_card_left_box>div:nth-child(1) {
		display: flex;
		align-items: center;
		height: 50px;
		width: 100%;
		padding: 5px 20px;
		box-sizing: border-box;
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
		padding: 5px 20px;
		box-sizing: border-box;
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
		height: 70vh;
	}

	/deep/ .el-input-group__append .el-button {
		border-color: #3385ff;
		background-color: #3385ff;
		color: #fff;
	}

	.amap-box {
		width: 100%;
		height: 100%;
	}

	.list {
		height: 55px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #f3f3f3;
		padding: 5px 20px;
		box-sizing: border-box;
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

	.parent-box {
		display: inline-block;
		color: #333;
		width: 200px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>