<template>
	<div>
		<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" :close-on-click-modal="false" @close="close"
			width="50%" top="6vh">
			<!-- <el-scrollbar class="scrollbar"> -->
				<el-form :model="info" ref="ruleForm" :rules="rules" :disabled="disabled">
					<div class="form-2-col">
						<el-form-item label="车牌号" prop="VehicleNo">
							<el-input placeholder="请选择" readonly v-model="info.VehicleNo" class="input-with-select">
								<template v-if="!!info.VehicleNo">
									<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
										slot="suffix" @click="removeItemCarNo()"></i>
								</template>
								<el-button slot="append" @click="chooseCar()">选择车牌</el-button>
							</el-input>
						</el-form-item>
						<el-form-item label="违规司机" prop="UserName">
							<el-input placeholder="请选择" readonly v-model="info.UserName" class="input-with-select">
								<template v-if="!!info.UserName">
									<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
										slot="suffix" @click="removeItem()"></i>
								</template>
								<el-button slot="append" @click="chooseModerator()">选择人员</el-button>
							</el-input>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="发生时间" prop="WarningDate">
							<el-date-picker v-model="info.WarningDate" type="datetime" clearable value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期" style="width: 100%">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="风险类型" prop="RiskTypeDesc">
							<el-input v-model="info.RiskTypeDesc" maxlength="30" show-word-limit placeholder="风险类型"></el-input>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="风险等级" prop="RiskLevel">
							<el-select placeholder="风险等级" clearable v-model="info.RiskLevel" style="width: 100%;">
								<el-option label="一级风险" :value="1"></el-option>
								<el-option label="二级风险" :value="2"></el-option>
								<el-option label="三级风险" :value="3"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="安全等级" prop="SecurityLevel">
							<select-level v-model="info.SecurityLevel" :multiple="false"
								:value="info.SecurityLevel"></select-level>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="速度(km/h)">
							<el-input-number clearable :min="0" v-model="info.Speed"
								style="width: 100%"></el-input-number>
						</el-form-item>
						<el-form-item label="风险位置">
							<el-input v-model="info.RiskPlace" maxlength="100" show-word-limit placeholder="风险位置">
								<el-button slot="append" class="map-btn" @click="showMap()"
									type="primary">地图选点</el-button>
							</el-input>
						</el-form-item>
					</div>
				</el-form>
			<!-- </el-scrollbar> -->
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close()">取消</el-button>
				<el-button type="primary" @click.native="addSubmit('ruleForm')" :loading="btnloading">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog v-dialog-drag title="地图" :visible.sync="gaodeDialogVisible" width="70%" :append-to-body="true"
			top="8vh">
			<div id="container">
				<el-amap-search-box class="search-box" :search-option="searchOption"
					:on-search-result="onSearchResult"></el-amap-search-box>
				<el-amap class="amap-box" :amap-manager="amapManager" :vid="'amap-vue'" :zoom="zoom" :center="center"
					:events="events" :plugin="plugins">
					<el-amap-marker :position="center"> </el-amap-marker>
				</el-amap>
				<el-row style="margin-top: 10px" :gutter="20">
					<el-col :span="4">
						<el-input v-model="info.Longitude">
							<template slot="prepend">经度：</template>
						</el-input>
					</el-col>
					<el-col :span="4">
						<el-input v-model="info.Latitude">
							<template slot="prepend">纬度</template>
						</el-input>
					</el-col>
					<el-col :span="11">
						<el-input v-model="info.RiskPlace">
							<template slot="prepend">地址：</template>
						</el-input>
					</el-col>
					<el-col :span="4">
						<el-button type="info" @click="hide()">取消</el-button>
						<el-button type="primary" @click="hide()">确定</el-button>
					</el-col>
				</el-row>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import RULECONFIG from "@/common/ruleConfig";
	import request_mixin from '@/mixins/request-mixin';
	import Import_export from "@/mixins/Import_export.js";
	import {
		AMapManager
	} from "vue-amap";
	let amapManager = new AMapManager();
	export default {
		mixins: [request_mixin, Import_export],
		props: {},
		data() {
			let self = this;
			return {
				btnloading: false,
				disabled: false,
				title: '新增',
				id: '',
				loading: false,
				dislogShow: false,
				info: {},
				rules: {
					VehicleNo: RULECONFIG.Select("车牌号"),
					UserName: RULECONFIG.Select("违规司机"),
					WarningDate: RULECONFIG.Select("发生时间")
				},
				beLongList: [],
				statusList: [{
						id: '1',
						text: "未处理"
					},
					{
						id: '2',
						text: "已处理"
					}
				],
				amapManager,
				center: process.env.BASE_CENTER,
				zoom: 15,
				loaded: false,
				searchOption: {
					city: "全国",
					citylimit: true,
				},
				events: {
					click(e) {
						let {
							lng,
							lat
						} = e.lnglat;
						self.info.Longitude = lng;
						self.info.Latitude = lat;
						self.center = [lng, lat];

						AMap.service("AMap.Geocoder", function() {
							//回调函数
							//实例化Geocoder
							let geocoder = new AMap.Geocoder({
								city: "010", //城市，默认：“全国”
							});
							//TODO: 使用geocoder 对象完成相关功能
							geocoder.getAddress(
								[e.lnglat.lng, e.lnglat.lat],
								function(status, result) {
									self.info.RiskPlace =
										result.regeocode.formattedAddress;
									document.querySelector(
										".search-box-wrapper input"
									).value = self.input;
									document.querySelector(
										".search-box-wrapper input"
									).value = result.regeocode.formattedAddress;
									self.$nextTick();
								}
							);
						});
					},
				},
				plugins: [{
						pName: "Geocoder", //使用AMap.Geocoder插件
						events: {
							init(o) {
								o.getAddress(
									self.center,
									function(status, result) {
										if (
											status === "complete" &&
											result.info === "OK"
										) {
											setTimeout(() => {
												self.input =
													result.regeocode.formattedAddress;
												document.querySelector(
													".search-box-wrapper input"
												).value = self.input;
											}, 50);

											self.$nextTick();
										}
									}
								);
							},
						},
					},
					{
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						timeout: 100, //超过10秒后停止定位，默认：无穷大
						maximumAge: 0, //定位结果缓存0毫秒，默认：0
						convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
						showButton: true, //显示定位按钮，默认：true
						buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
						showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
						showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
						panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
						zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
						extensions: "all",
						//地图定位按钮
						pName: "Geolocation",
						init(o) {
							// o 是高德地图定位插件实例
							o.getCurrentPosition((status, result) => {
								if (result && result.position) {
									self.lng = result.position.lng;
									self.lat = result.position.lat;
									self.center = [self.lng, self.lat];
									self.loaded = true;
									self.$nextTick();
								}
							});
						},
					},
					{
						//地图工具条
						pName: "ToolBar",
						init(o) {},
					},
					{
						//左下角缩略图插件 比例尺
						pName: "Scale",
						init(o) {},
					},
				],
				gaodeDialogVisible: false,
			}
		},
		methods: {
			showMap() {
				this.gaodeDialogVisible = true;
				if (this.disabled) {
					this.center = [this.info.Longitude, this.info.Latitude]
					this.input = this.info.RiskPlace
				} else {
					this.center = [113.457405, 23.016454]
					this.input = '广东省广州市番禺区化龙镇谭山村科美工业园综合楼三楼'
				}
				this.$nextTick(() => {
					let arr = document.querySelector(".search-box-wrapper input")
					arr.value = this.input
				})
			},
			hide() {
				this.gaodeDialogVisible = false;
			},
			onSearchResult(pois) {
				this.input = document.querySelector(
					".search-box-wrapper input"
				).value;
				this.info.RiskPlace = this.input;
				this.center = [pois[0].lng, pois[0].lat];
				this.info.Longitude = pois[0].lng;
				this.info.Latitude = pois[0].lat;
			},
			async show(row) {
				this.dislogShow = true;
				this.btnloading = false;
				await this.Get('/GetIllegalAttributionCom').then((res) => {
					this.beLongList = res.data
				})
				if (row) {
					this.title = '编辑'
					this.info = JSON.parse(JSON.stringify(row))
					this.info.SecurityLevel = this.info.SecurityLevel.toString()

				} else {
					this.title = '新增'
					this.disabled = false
					this.info = {
						VehicleWarningld: 0,
						Vehicleld: "",
						Enterpriseld: "",
						Departmentld: "",
						Userld: "",
						UserName: "",
						VehicleNo: "",
						RiskTypeDesc: "",
						RiskLevel: 1,
						WarningDate: "", 
						Speed: "",
						RiskPlace: "",
						Longitude: "",
						Latitude: "",
						SecurityLevel: "1",
						Remark: "",
						VehicleNo: ''
					}
				}
				// this.filters.TrainTaskId = id;
				// this.getList();
			},
			close() {
				this.dislogShow = false;
			},
			chooseModerator() {
				// 选择人员
				this.$chooseUser({
					single: false,
				}).then(data => {
					this.info.UserName = data.UserName
					this.info.UserId = data.UserId
				});
			},
			chooseCar() {
				this.$chooseCar({
					single: false,
				}).then(data => {
					this.info.VehicleId = data.VehicleId
					this.info.EnterpriseId = data.EnterpriseId
					this.info.DepartmentId = data.DepartmentId
					this.info.VehicleNo = data.LicensePlateNumber
				});
			},
			removeItemCarNo() {
				// 删除所选车牌
				this.info.VehicleId = ''
				this.info.EnterpriseId = ''
				this.info.DepartmentId = ''
				this.info.VehicleNo = ''
			},
			removeItem() {
				// 删除所选人员
				this.info.UserName = '';
				this.info.UserId = '';
			},
			addSubmit(formName) {
				//保存
				this.btnloading = true
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.info.SaveVehicleWarning = parseInt(this.info.SecurityLevel)
						this.Post("/SaveVehicleWarning", this.info).then(
							(res) => {
								if (res.status == 2000) {
									this.$message({
										message: "保存成功",
										type: "success",
									});

									this.dislogShow = false
									this.btnloading = false;
									this.$emit('success')
								} else {
									this.$message.error(res.message);
									this.btnloading = false;
								}
							}
						);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.amap-box {
		width: 100%;
		height: 600px;
	}

	/deep/ .el-vue-search-box-container {
		position: absolute;
		right: 25px;
		top: 79px;
	}

	.form-2-col {
		display: flex;

		>div {
			width: 50%;

			&:first-child {
				margin-right: 40px;
			}
		}
	}
</style>