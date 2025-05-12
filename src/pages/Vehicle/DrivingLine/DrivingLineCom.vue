<template>
		<div class="box">
			<el-card class='card_left'>
				<el-scrollbar class='scrollbar' style="height:100%;">
					<div id="container"></div>
					<div style="margin-bottom:25px;">
						<el-row>
							<el-col :span='24' style="padding-left:5px;margin-top:10px">
								<el-input :value='params.StartAddressPois.Address' disabled>
									<template slot="prepend">起运地</template>
								</el-input>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='24' style="padding-left:5px;margin-top:10px">
								<el-input :value='params.EndAddressPois.Address' disabled>
									<template slot="prepend">目的地</template>
								</el-input>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='8' style="padding-left:5px;margin-top:10px">
								<el-input :value='(params.Distance/1000).toFixed(2)' disabled>
									<template slot="prepend">驾车距离</template>
									<template slot="append">公里</template>
								</el-input>
							</el-col>
							<el-col :span='8' style="padding-left:5px;margin-top:10px">
								<el-input :value='(params.Tolls_distance/1000).toFixed(2)' disabled>
									<template slot="prepend">收费路段</template>
									<template slot="append">公里</template>
								</el-input>
							</el-col>
							<el-col :span='8' style="padding-left:5px;margin-top:10px">
								<el-input :value='params.Tolls' disabled>
									<template slot="prepend">收费金额</template>
									<template slot="append">元</template>
								</el-input>
							</el-col>
						</el-row>
					</div>
				</el-scrollbar>
			</el-card>
			<el-card class='card_right'>
				<el-scrollbar style="height:100%;">
					<el-form :model="params" ref="editsform" label-width="100px" :rules="rules">
						<el-row style='margin-top:10px' :gutter='10'>
							<el-col :span='20'>
								<el-input :value='params.StartAddressPois.Address' disabled>
									<template slot="prepend">起运地</template>
								</el-input>
							</el-col>
							<el-col :span='4'>
								<el-button type="primary" @click='showStartAddress()'>选择</el-button>
							</el-col>
						</el-row>
						<el-row style='margin-top:10px' :gutter='10'>
							<el-col :span='20'>
								<el-input :value='params.EndAddressPois.Address' disabled>
									<template slot="prepend">目的地</template>
								</el-input>
							</el-col>
							<el-col :span='4'>
								<el-button type="primary" @click='showEndAddress()'>选择</el-button>
							</el-col>
						</el-row>
						<el-row style='margin-top:10px' :gutter='10'>
							<el-col :span='20' class="card_title">
								<span>途经地</span>
							</el-col>
							<el-col :span='4' class="card_title">
								<el-button type="success" @click='showWayAddress()'>添加</el-button>
							</el-col>
						</el-row>
						<el-row style='margin-top:10px' :gutter='10' v-for='(item,i) in params.WayAddressPois' :key='i'>
							<el-col :span='20'>
								<el-input :value='item.Address' disabled>
									<template slot="prepend">途经点</template>
								</el-input>
							</el-col>
							<el-col :span='4'>
								<el-button type="danger" @click='delWayAddressPois(i)'>删除</el-button>
							</el-col>
						</el-row>
						<el-row style='margin-top:10px' :gutter='10'>
							<el-col :span='24' class="card_title">
							</el-col>
						</el-row>
						<el-row style='margin-top:10px'>
							<el-col :span='23'>
								<el-form-item label="路线方案" prop="DrivingPolicy">
									<el-select v-model="params.DrivingPolicy" placeholder="请选择"
										@change="DrivingPolicySelect()">
										<el-option v-for="item in PolicyOptions" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='23'>
								<el-form-item label="路线名称" prop="DrivingLineName">
									<el-input placeholder="请输入线路名称" maxlength="100" show-word-limit
										v-model="params.DrivingLineName"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='23'>
								<el-form-item label="起运地简写" prop="SimpleStartAddress">
									<el-input placeholder="请输入起运地简写" maxlength="100" show-word-limit
										v-model="params.SimpleStartAddress"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='23'>
								<el-form-item label="目的地简写" prop="SimpleEndAddress">
									<el-input placeholder="请输入目的地简写" maxlength="100" show-word-limit
										v-model="params.SimpleEndAddress"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='23'>
								<el-form-item label="运送货物" prop="GoodsName">
									<el-input placeholder="请输入运送货物" maxlength="100" show-word-limit
										v-model="params.GoodsName"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row style='margin-top:10px' :gutter='10'>
							<el-col :span='24' style="text-align:center;">
								<el-button @click='cancelEditSave()'>取消</el-button>
								<el-button type="primary" @click='dialogEditSave("editsform")'
									:loading="SaveLoading">提交</el-button>
							</el-col>
						</el-row>
					</el-form>
				</el-scrollbar>
			</el-card>
			<el-dialog title="选择途经点" :visible.sync="SelectWayAddressvisible" width="70%">
				<Map @Map='getWayAddressPois($event)' :fatherMethod="ClearMap" />
			</el-dialog>
			<el-dialog title="选择目的地" :visible.sync="SelectEndAddressvisible" width="70%" >
				<Map @Map='getEndAddressPois($event)' :fatherMethod="ClearMap" />
			</el-dialog>
			<el-dialog title="选择起运地" :visible.sync="SelectStartAddressvisible" width="70%">
				<Map @Map='getStartAddressPois($event)' :fatherMethod="ClearMap" />
			</el-dialog>
			<!--弹层结束-->
		</div>
</template>

<script>
	import RULECONFIG from "@/common/ruleConfig";
	import request_mixin from "@/mixins/request-mixin.js";
	import {
		lazyAMapApiLoaderInstance
	} from 'vue-amap'
	import Map from "@/components/common/map";
	export default {
		name: "AddDrivingLine",
		components: {
			Map,
		},
		mixins: [request_mixin],
		data() {
			return {
				submitLoading: false,
				dislogShowChildren: false,
				SaveLoading: false,
				SelectStartAddressvisible: false,
				SelectEndAddressvisible: false,
				SelectWayAddressvisible: false,
				PolicyOptions: [{
						label: "最快捷",
						value: "AMap.DrivingPolicy.LEAST_TIME"
					},
					{
						label: "最经济",
						value: "AMap.DrivingPolicy.LEAST_FEE"
					},
					{
						label: "最短距离",
						value: "AMap.DrivingPolicy.LEAST_DISTANCE"
					},
				],
				params: {
					DrivingLineId: 0,
					DrivingLineName: '',
					SimpleStartAddress: "",
					SimpleEndAddress: "",
					GoodsName: '',
					DrivingPolicy: '',
					Tolls: 0,
					Tolls_distance: 0,
					Distance: 0,
					StartAddressPois: {
						Address: "",
						Latitude: 0,
						Longitude: 0,
					},
					EndAddressPois: {
						Address: "",
						Latitude: 0,
						Longitude: 0,
					},
					WayAddressPois: [],
				},
				rules: {
					DrivingPolicy: RULECONFIG.Select('路线方案'),
					DrivingLineName: RULECONFIG.Text('路线名称'),
				},
				// SelectTrafficightsAddressvisible:false,
				// TrafficightsAddress:[],
				// SelectSpeedLimitAddressvisible:false,
				// SpeedLimitAddress:[],
			}
		},
		computed: {},
		methods: {
			async show(item) {
			},
			CanvasDrivingLine() {
				let that = this;
				lazyAMapApiLoaderInstance.load().then(() => {
					//基本地图加载
					var map = new AMap.Map("container", {
						resizeEnable: true,
					});
					let DrivingPolicy;
					if (that.params.DrivingPolicy == "AMap.DrivingPolicy.LEAST_TIME") {
						DrivingPolicy = AMap.DrivingPolicy.LEAST_TIME
					} else if (that.params.DrivingPolicy == "AMap.DrivingPolicy.LEAST_FEE") {
						DrivingPolicy = AMap.DrivingPolicy.LEAST_FEE
					} else if (that.params.DrivingPolicy == "AMap.DrivingPolicy.LEAST_DISTANCE") {
						DrivingPolicy = AMap.DrivingPolicy.LEAST_DISTANCE
					} else {
						DrivingPolicy = AMap.DrivingPolicy.REAL_TRAFFIC
					}
					//构造路线导航类
					var driving = new AMap.Driving({
						policy: DrivingPolicy,
						map: map,
					});
					var points = [];
					if (this.params.StartAddressPois.Address != "" && this.params.EndAddressPois.Address != "") {
						points.push({
							keyword: this.params.StartAddressPois.Address
						});
						this.params.WayAddressPois.forEach(element => {
							points.push({
								keyword: element.Address
							});
						});
						points.push({
							keyword: this.params.EndAddressPois.Address
						});
						// 根据起终点经纬度规划驾车导航路线
						driving.search(points, function(status, result) {
							// result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
							if (status === 'complete') {
								that.params.Tolls = result.routes[0].tolls;
								that.params.Tolls_distance = result.routes[0].tolls_distance;
								that.params.Distance = result.routes[0].distance;
							} else {
								console.log('获取驾车数据失败：' + result)
							}
						});
					}
				});
			},
			dialogEditSave(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						//this.SaveLoading = true
						this.Post('/SaveDrivingLine', that.params).then(res => {
							if (res.status == 2000) {
								this.$message({
									message: "保存成功",
									type: "success",
								});
								this.$router.push('/vehicleRoute');
								this.SaveLoading = false
							} else {
								this.$message.error(res.message);
								this.SaveLoading = false
							}
						})
					}
				});
			},
			cancelEditSave() {
				this.$parent.dislogShow = true
			},
			showStartAddress() {
				this.SelectStartAddressvisible = true
			},
			showEndAddress() {
				this.SelectEndAddressvisible = true
			},
			showWayAddress() {
				this.SelectWayAddressvisible = true
			},
			// showTrafficightsAddress(){
			//   this.SelectTrafficightsAddressvisible = true
			// },
			// showSpeedLimitAddress(){
			//   this.SelectSpeedLimitAddressvisible = true
			// },
			getStartAddressPois(e) {
				this.params.StartAddressPois.Address = e.Address;
				this.params.SimpleStartAddress = this.params.SimpleStartAddress == '' ? e.Address : this.params
					.SimpleStartAddress;
				// this.params.SimpleStartAddress = e.Address;
				this.params.StartAddressPois.Latitude = e.Latitude;
				this.params.StartAddressPois.Longitude = e.Longitude;
				this.CanvasDrivingLine();
				this.SelectStartAddressvisible = false;
			},
			getEndAddressPois(e) {
				this.params.EndAddressPois.Address = e.Address;
				this.params.SimpleEndAddress = this.params.SimpleEndAddress == '' ? e.Address : this.params
					.SimpleEndAddress;
				// this.params.SimpleEndAddress = e.Address
				this.params.EndAddressPois.Latitude = e.Latitude;
				this.params.EndAddressPois.Longitude = e.Longitude;
				this.CanvasDrivingLine();
				this.SelectEndAddressvisible = false;
			},
			getWayAddressPois(e) {
				this.params.WayAddressPois.push({
					Address: e.Address,
					Latitude: e.Latitude,
					Longitude: e.Longitude,
				});
				this.CanvasDrivingLine();
				this.SelectWayAddressvisible = false;
			},
			// getTrafficightsAddressPois (e) {
			//   this.TrafficightsAddress.push({
			//     Address:e.Address,
			//     Latitude:e.Latitude,
			//     Longitude:e.Longitude,
			//   });
			//   this.SelectTrafficightsAddressvisible = false;
			//   this.CanvasDrivingLine();
			// },   
			// getSpeedLimitAddressPois (e) {
			//   this.SpeedLimitAddress.push({
			//     Address:e.Address,
			//     Latitude:e.Latitude,
			//     Longitude:e.Longitude,
			//     SpeedLimit:0,
			//   });
			//   this.SelectSpeedLimitAddressvisible = false;
			//   this.CanvasDrivingLine();
			// },   
			delWayAddressPois(i) {
				this.params.WayAddressPois.splice(i, 1);
				this.CanvasDrivingLine();
			},
			// delTrafficightsAddressPois (i) {
			//   this.TrafficightsAddress.splice(i, 1);
			//   this.CanvasDrivingLine();
			// },
			// delSpeedLimitAddressPois (i) {
			//   this.SpeedLimitAddress.splice(i, 1);
			//   this.CanvasDrivingLine();
			// },
			ClearMap() {
				this.SelectStartAddressvisible = false
				this.SelectEndAddressvisible = false
				this.SelectWayAddressvisible = false
				// this.SelectTrafficightsAddressvisible = false
				// this.SelectSpeedLimitAddressvisible = false
			},
			InitData(id) {
				let that = this;
				if (id != 0) {
					this.Get('/GetDrivingLine', {
						id
					}).then(res => {
						if (res.status == 2000) {
							that.params = res.data;
							that.CanvasDrivingLine();
						}
					})
				} else {
					that.params.DrivingPolicy = that.PolicyOptions[0].value;
				}
			},
			DrivingPolicySelect() {
				this.CanvasDrivingLine();
			},
		},
		mounted() {
			// let id = this.$route.query.id;
			// this.InitData(id);
		},
		created() {

		},
	}
</script>

<style scoped lang="scss">
	.full-screen-edit {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10;
		background: #F4F5F7;
	}

	.edit-footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		border-radius: 10px;
		margin-top: 10px;
		padding: 0 32px;
		height: 60px;
		background: #fff;

		.el-button {
			width: 110px;
		}

		[cancel] {
			border-color: #F5F6FA;
			background: #F5F6FA;
		}
	}

	.box {
		width: 100%;
		height: 100%;
		padding: 20px;
		box-sizing: border-box;
		background: #fff;
		display: flex;
	}

	#container {
		width: 100%;
		height: 500px;
	}

	.card_left {
		height: 100%;
		width: 60%;
	}

	.card_right {
		height: 100%;
		margin-left: 10px;
		width: 40%;
	}

	.card_title {
		border-bottom: 1px solid #ebeef5;
		font-size: 15px;
		font-weight: 700;
		line-height: 50px;
	}

	/deep/ .el-scrollbar__wrap {
		overflow-x: hidden;
		height: 100%;
	}

	/deep/ .el-card__body {
		height: 100%;
		padding: 20px;
	}
</style>