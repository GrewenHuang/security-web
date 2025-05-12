<template>
	<div>
		<el-dialog v-dialog-drag title="查看" :visible.sync="dislogShow" @close="dislogShow = false" class="info"
			width="60%" top="8vh" v-loading="loading" element-loading-text="数据加载中" :append-to-body="true">
			<el-scrollbar ref="scrollbar" class="scrollbar">
				<el-form class="form" ref="form" :model="form" :rules="rules">
					<div class="title spacing-bottom">基本信息</div>
					<div class="form-2-col">
						<el-form-item label="企业名称" class="form_box">
							<el-input v-model="form.EnterpriseName" :disabled="disabled"></el-input>
						</el-form-item>
						<el-form-item label="企业简称" class="form_box" prop="EnterpriseNameAs">
							<el-input v-model="form.EnterpriseNameAs" maxlength="20" show-word-limit></el-input>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="主要负责人姓名" class="form_box" prop="LegalPersionName">
							<el-input v-model="form.LegalPersionName" maxlength="10" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="主要负责人电话" class="form_box" prop="LegalPersionTel">
							<el-input v-model="form.LegalPersionTel" maxlength="20" show-word-limit></el-input>
						</el-form-item>
					</div>
					<el-form-item label="企业地址" class="form_box" prop="EnterpriseAddress">
						<el-input v-model="form.EnterpriseAddress" maxlength="100" show-word-limit>
							<el-button slot="append" class="map-btn" @click="showMap()" type="primary">地图选点</el-button>
						</el-input>
					</el-form-item>
					<div class="form-2-col">
						<el-form-item label="纬度" class="form_box" prop="Latitude">
							<el-input type="number" disabled v-model="form.Latitude" :min="0" :max="90"></el-input>
						</el-form-item>
						<el-form-item label="经度" class="form_box" prop="Longitude">
							<el-input type="number" disabled v-model="form.Longitude" :min="0" :max="180"></el-input>
						</el-form-item>
					</div>
					<el-form-item label="公司简介" class="form_box">
						<el-input type="textarea" rows="5" v-model="form.EnterpriseProfile" maxlength="1000"
							show-word-limit></el-input>
					</el-form-item>
					<div v-if="form.Certificates && form.Certificates.length > 0">
						<div class="gutter"></div>
						<div class="f-b-c">
							<div class="title">证件信息</div>
						</div>
						<el-collapse v-model="collapseActive">
							<el-collapse-item v-for="(item, i) in form.Certificates" :key="i"
								:name="item.CertificateId">
								<div slot="title" class="f-b-c f1">
									<span>{{ item.CertificateName }}</span>
									<div class="f--c operation">
										<div class="switch"
											:class="{open: collapseActive.includes(item.CertificateId)}">
											{{ collapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
										</div>
									</div>
								</div>
								<template v-for="(filed, index) in item.CertificateFileds">
									<div class="form-2-col" :key="index" v-if="index % 2 == 0">
										<el-form-item :label="filed.FiledName">
											<el-input placeholder="请输入" v-model="filed.FiledValue"
												v-if="filed.TextType == 2"></el-input>
											<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
												v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
											<custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4" />
										</el-form-item>
										<el-form-item
											:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''">
											<el-input placeholder="请输入"
												v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
											<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
												v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
											<custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 4" />
										</el-form-item>
										<!-- <el-form-item
											:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
											v-if="item.CertificateFileds[index + 1] && item.CertificateFileds[index + 1].FiledName != '营业期限'">
											<el-input placeholder="请输入"
												v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
											<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
												v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
											<custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 4" />
										</el-form-item> -->
										<!-- <el-form-item
											:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
											>
												<div style="display: flex;width:100%">
													<el-input placeholder="请输入"
														style="width: 80%;margin-right: 18px"
														:disabled="item.CertificateFileds[index + 1].IsReminder == 1 || item.CertificateFileds[index + 1].IsReminder == true"
														v-model="item.CertificateFileds[index + 1].FiledValue"
													></el-input>
													 <el-checkbox 
													 v-model="item.CertificateFileds[index + 1].IsReminder"
													 @change="item.CertificateFileds[index + 1].FiledValue = ''"
													 >长期</el-checkbox>
												</div>
										</el-form-item> -->
									</div>
								</template>
								<el-form-item label="照片" v-if="item.CertificateName == '营业执照'">
									<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
										:fileList.sync="item.CertificateManagePhotos" list-type="picture-card"  @OcrChange="onChangeFile(item,i)">
										<i class="el-icon-plus"></i>
									</custom-upload>
								</el-form-item>
								<el-form-item label="照片" v-else>
									<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
										:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
										<i class="el-icon-plus"></i>
									</custom-upload>
								</el-form-item>
							</el-collapse-item>
						</el-collapse>
					</div>
					<div v-if="form.Insures && form.Insures.length > 0">
						<div class="gutter"></div>
						<div class="f-b-c">
							<div class="title">保险信息</div>
						</div>
						<el-collapse v-model="insureCollapseActive">
							<el-collapse-item v-for="(item, i) in form.Insures" :key="i" :name="item.CertificateId">
								<div slot="title" class="f-b-c f1">
									<span>{{ item.CertificateName }}</span>
									<div class="f--c operation">
										<div class="switch"
											:class="{open: insureCollapseActive.includes(item.CertificateId)}">
											{{ insureCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
										</div>
									</div>
								</div>
								<template v-for="(filed, index) in item.CertificateFileds">
									<div class="form-2-col" :key="index" v-if="index % 2 == 0">
										<el-form-item :label="filed.FiledName">
											<el-input placeholder="请输入" v-model="filed.FiledValue"
												v-if="filed.TextType == 2"></el-input>
											<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
												v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
											<custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4" />
										</el-form-item>
										<el-form-item
											:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
											v-if="item.CertificateFileds[index + 1]">
											<el-input placeholder="请输入"
												v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
											<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
												v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
											<custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue"
												v-if="item.CertificateFileds[index + 1].TextType == 4" />
										</el-form-item>
										<div v-else></div>
									</div>
								</template>
								<el-form-item label="照片">
									<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
										:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
										<i class="el-icon-plus"></i>
									</custom-upload>
								</el-form-item>
							</el-collapse-item>
						</el-collapse>
					</div>
					<div class="gutter"></div>
					<div class="f-b-c"  v-if="form.Others && form.Others.length > 0">
						<div class="title">其他信息</div>
					</div>
					<el-collapse v-model="otherCollapseActive">
						<el-collapse-item v-for="(item, i) in form.Others" :key="i" :name="item.CertificateId">
							<div slot="title" class="f-b-c f1">
								<span>{{ item.CertificateName }}</span>
								<div class="f--c operation">
									<div class="switch"
										:class="{open: otherCollapseActive.includes(item.CertificateId)}">
										{{ otherCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
									</div>
								</div>
							</div>
							<template v-for="(filed, index) in item.CertificateFileds">
								<div class="form-2-col" :key="index" v-if="index % 2 == 0">
									<el-form-item :label="filed.FiledName">
										<el-input placeholder="请输入" v-model="filed.FiledValue"
											v-if="filed.TextType == 2"></el-input>
										<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
											v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
										<custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4" />
									</el-form-item>
									<el-form-item
										:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
										v-if="item.CertificateFileds[index + 1]">
										<el-input placeholder="请输入"
											v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
										<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
											v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
										<custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 4" />
									</el-form-item>
									<div v-else></div>
								</div>
							</template>
							<el-form-item label="照片">
								<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
									:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
									<i class="el-icon-plus"></i>
								</custom-upload>
							</el-form-item>
						</el-collapse-item>
					</el-collapse>
				</el-form>
			</el-scrollbar>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close()">取消</el-button>
				<el-button type="primary" @click="SaveEnterprise()">保存</el-button>
			</div>
		</el-dialog>
		<page-layout class="page">
			<el-dialog v-dialog-drag title="地图" :visible.sync="gaodeDialogVisible" width="70%"
				:append-to-body="true" top="8vh">
				<div id="container">
					<el-amap-search-box class="search-box" :search-option="searchOption"
						:on-search-result="onSearchResult"></el-amap-search-box>
					<el-amap class="amap-box" :amap-manager="amapManager" :vid="'amap-vue'" :zoom="zoom"
						:center="center" :events="events" :plugin="plugins">
						<el-amap-marker :position="center"> </el-amap-marker>
					</el-amap>
					<el-row style="margin-top: 10px" :gutter="20">
						<el-col :span="4">
							<el-input :value="form.Longitude">
								<template slot="prepend">经度：</template>
							</el-input>
						</el-col>
						<el-col :span="4">
							<el-input :value="form.Latitude">
								<template slot="prepend">纬度</template>
							</el-input>
						</el-col>
						<el-col :span="11">
							<el-input :value="form.EnterpriseAddress">
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
		</page-layout>
	</div>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import {
		AMapManager
	} from "vue-amap";
	let amapManager = new AMapManager();

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	const certKeysName = {
		Certificates: '证件',
		Insures: '保险',
		Others: '其他'
	};
	export default {
		name: "enterpriseinfo",
		mixins: [request_mixin],
		data() {
			let self = this;
			return {
				disabled: true,
				dislogShow: false,
				input: "",
				form: {
					EnterpriseName: "", //企业名称
					EnterpriseAddress: "", //企业地址
					EnterpriseNameAs: "", // 企业简称
					LegalPersionName: "", // 主要负责人姓名
					LegalPersionTel: "", // 主要负责人电话
					Longitude: 0, // 经度
					Latitude: 0, // 纬度
					Certificates: [], // 证件集
					Insures: [], // 保险
					Others: [], // 其他
				},
				address: null,
				searchKey: "",
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
						self.form.Longitude = lng;
						self.form.Latitude = lat;
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
									self.form.EnterpriseAddress =
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
				loading: false,

				rules: {
					Longitude: [{
						required: true,
						message: "请选择经纬度",
					}, ],
					Latitude: [{
						required: true,
						message: "请选择经纬度",
					}, ],
					EnterpriseAddress: [{
						required: true,
						message: "请输入企业地址",
						trigger: "blur",
					}, ],
					LegalPersionName: [{
						required: true,
						message: "请输入主要负责人姓名",
						trigger: "blur",
					}, ],
					LegalPersionTel: [{
							required: true,
							message: "请输入主要负责人电话",
							trigger: "blur",
						},
						{
							validator: function(rule, value, callback) {
								if (/^((0\d{2,4}-\d{7,8})|(1[3456789]\d{9}))$/.test(value) == false) {
									callback(new Error("电话号格式错误"));
								} else {
									callback();
								}
							},
							trigger: "blur",
						},
					],
				},
				collapseActive: [],
				insureCollapseActive: [],
				otherCollapseActive: [],
				isAdd: false
			};
		},
		methods: {
			onChangeFile(item, i) {
				let arr = ""
				if (item.CertificateManagePhotos && item.CertificateManagePhotos.length > 0) {
					arr = item.CertificateManagePhotos[item.CertificateManagePhotos.length - 1].viewurl.toString()
				} else {
					return
				}
				this.$nextTick(() => {
					this.Get('/AliOCR?url=' + arr + '&type=6').then(res => {
						if (res.Code == 200) {
							let ObjData = JSON.parse(res.obj.Body.Data)
							let Data = ObjData.data
							item.CertificateFileds.map((item) => {
								if (item.FiledName == "统一社会信用代码/注册号" && item.TextType == 2 && Data
									.creditCode) {
									item.FiledValue = Data.creditCode
								}
								if (item.FiledName == "营业期限" && item.TextType == 4 && Data
									.validPeriod) {
									if(Data.validPeriod.includes('长期') || Data.validPeriod.includes('永久')){
										item.FiledValue = ',,1'
									}else {
										let obj = Data.validPeriod.split('至').join(',')
										item.FiledValue = obj.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "")
									}
								}
								if (item.FiledName == "名称" && item.TextType == 2 && Data
									.companyName) {
									item.FiledValue = Data.companyName
								}
								if (item.FiledName == '注册资本' && item.TextType == 2 && Data.registeredCapital) {
									item.FiledValue = Data.registeredCapital
								}
								if (item.FiledName == '类型' && item.TextType == 2 && Data.companyType) {
									item.FiledValue = Data.companyType
								}
								if (item.FiledName == '成立日期' && item.TextType == 3 && Data
									.issueDate) {
									if(Data.issueDate){
										item.FiledValue = Data.issueDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "")
									}
								}
								if (item.FiledName == '法定代表人' && item.TextType == 2 && Data
									.legalPerson) {
									item.FiledValue = Data.legalPerson
								}
								// if (item.FiledName == '营业期限' && item.TextType == 4 && Data
								// 	.validPeriod) {
								// 	item.FiledValue = Data.validPeriod
								// }
								if (item.FiledName == '经营范围' && item.TextType == 2 && Data
									.businessScope) {
									item.FiledValue = Data.businessScope
								}
								if (item.FiledName == '住所' && item.TextType == 2 && Data
									.businessAddress) {
									item.FiledValue = Data.businessAddress
								}
								if (item.FiledName == '注册时间' && item.TextType == 3 && Data
									.RegistrationDate) {
										if(Data.RegistrationDate){
											item.FiledValue = Data.RegistrationDate.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, "")
										}
								}
							})
							this.$forceUpdate()
						}else if(res.Code == 400) {
							this.$message.error(res.obj)
						}else{
							this.$message.error('请上传有效的证件图片')
						}
					})
				})
			},
			async show(item) {
				this.dislogShow = true;
				if (item) {
					this.isAdd = false
					this.disabled = true
					this.getEditInfo(item.EnterpriseId)
				} else {
					this.isAdd = true
					this.getAddInfo(null,1)
					this.disabled = false
				}
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			async getEditInfo(id){
				this.loading = true;
				let res = await this.Post(`/GetEnterpriseById?EnterpriseId=${id}`);
				this.form = res.data
				this.setCerts(res.data.CertificateList || [], this.form);
				this.collapseActive = this.form.Certificates.map(item => item.CertificateId);
				this.insureCollapseActive = this.form.Insures.map(item => item.CertificateId);
				this.otherCollapseActive = this.form.Others.map(item => item.CertificateId);
				this.loading = false;
			},
			async getAddInfo(type,classification){
				let res = await this.Get(`/GetCertificateList?certificateClassification=${type}&certificateType=${classification}`);
				this.form = {
					EnterpriseName: "", //企业名称
					EnterpriseAddress: "", //企业地址
					EnterpriseNameAs: "", // 企业简称
					LegalPersionName: "", // 主要负责人姓名
					LegalPersionTel: "", // 主要负责人电话
					Longitude: 0, // 经度
					Latitude: 0, // 纬度
					Certificates: [], // 证件集
					Insures: [], // 保险
					Others: [], // 其他
				}
				if(res.status == 2000){
					if(res.data && res.data.length > 0){
						res.data.forEach(item =>{
							if(item.CertificateClassification == 1){
								this.form.Certificates.push(item)
							}else if (item.CertificateClassification == 2){
								this.form.Insures.push(item)
							}else if (item.CertificateClassification == 3){
								this.form.Insures.push(item)
							}
						})
					}
				}
				this.setCerts(res.data.CertificateList || [], this.form);
				this.collapseActive = this.form.Certificates.map(item => item.CertificateId);
				this.insureCollapseActive = this.form.Insures.map(item => item.CertificateId);
				this.otherCollapseActive = this.form.Others.map(item => item.CertificateId);
			},
			close() {
				this.dislogShow = false;
				this.exportLoading = false;
			},
			onSearchResult(pois) {
				this.input = document.querySelector(
					".search-box-wrapper input"
				).value;
				this.form.EnterpriseAddress = this.input;
				this.center = [pois[0].lng, pois[0].lat];
				this.form.Longitude = pois[0].lng;
				this.form.Latitude = pois[0].lat;
			},
			showMap() {
				this.gaodeDialogVisible = true;
				if(this.disabled){
					this.center = [this.form.Longitude,this.form.Latitude]
					this.input = this.form.EnterpriseAddress
				}else {
					this.center = [113.457405,23.016454]
					this.input = '广东省广州市番禺区化龙镇谭山村科美工业园综合楼三楼'
				}
				this.$nextTick(()=>{
					let arr = document.querySelector(".search-box-wrapper input")
					arr.value = this.input
				})
			},
			hide() {
				this.gaodeDialogVisible = false;
			},
			SaveEnterprise() {
				var that = this;
				that.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm(this.isAdd? '根据公司行业的唯一性,公司名称不允许重复修改, 是否确认新增?' : '是否确认修改?', '提示', {
						    confirmButtonText: '确定',
						    cancelButtonText: '取消',
						    type: 'warning'
						}).then(() => {
							this.loading = true;
							that.Post("/SaveSubEnterprise", this.form).then((result) => {
								if (!result || !result.status) {
									this.$message({
										message: "请求异常",
										type: "error",
									});
									return;
								}
								if (result.status == 2000) {
									this.$message({
										message: "保存成功",
										type: "success",
									});
									this.$emit('success')
								} else {
									this.$message({
										message: result.message,
										type: "error",
									});
								}
								this.dislogShow = false
								this.loading = false;
							});
						})
					}
				});
			},

			GetEnterprise() {
				this.loading = true;
				this.Post("/GetEnterprise", {}).then((result) => {
					if (result.status != 2000 || !result.data) {
						this.$confirm('获取企业信息失败，点击刷新按钮重新获取', '提示', {
							confirmButtonText: '刷新',
						}).then(res => {
							this.GetEnterprise();
						})
						return;
					}
					this.form.Certificates = result.data.Certificates
					this.form.Certificates = result.data.Insures
					this.form.Certificates = result.data.Others
					this.setCerts(result.data.CertificateList || [], this.form);
					this.collapseActive = this.form.Certificates.map(item => item.CertificateId);
					this.insureCollapseActive = this.form.Insures.map(item => item.CertificateId);
					this.otherCollapseActive = this.form.Others.map(item => item.CertificateId);
					this.loading = false;
				});
			},
			chooseCert(collapse, list, classification) {
				this.$chooseCert({
					type: 1,
					classification,
					choosed: list
				}).then(res => {
					collapse.push(...res.map(item => item.CertificateId));
					let ids = list.map(item => item.CertificateId);
					let resList = _extends(res.map(item => {
						item.CertificateManagePhotos = [];
						return item;
					})).filter(item => ids.indexOf(item.CertificateId) == -1);
					if (resList.length) {
						list.push(...resList);
					}
				})
			},

			setCerts(list, info) {
				list.forEach(item => {
					Object.keys(certKeysName).forEach((key, index) => {
						if (!info[key]) {
							this.$set(info, key, []);
						}
						if (item.CertificateClassification == (index + 1)) {
							let o = info[key].find(o => o.CertificateId == item.CertificateId);
							if (!o) {
								info[key].push(item);
							}
						}
					});
				});
			},
		},
		async created() {
			// this.GetEnterprise();
		}
	};
</script>
<style lang="scss" scoped>
	#container {
		width: 100%;
		height: 650px;
	}

	.amap-box {
		width: 100%;
		height: 600px;
	}

	/deep/ .el-form--inline .el-form-item__content {
		width: 70%;
	}

	/deep/ .el-vue-search-box-container {
		position: absolute;
		right: 25px;
		top: 79px;
	}

	.save-btn {
		width: 110px;
		height: 45px;
	}

	.form {
		padding: 20px 30px 0;

		/deep/ .el-form-item__label {
			margin-bottom: 8px;
			line-height: 1;
		}

		/deep/ .el-input-group__append {
			border-color: $--color-primary;
		}

		.map-btn {
			border-radius: 0;
			background: $--color-primary;
			color: #fff;
		}

		/deep/ .el-collapse {
			margin-top: 28px;
			border: 0;

			.el-collapse-item {
				border: 1px solid #DCDFE6;
				border-radius: 6px;
				margin-bottom: 20px;
				overflow: hidden;

				&.is-active {
					.el-collapse-item__header {
						border-bottom: 1px solid #DCDFE6;
					}
				}

				.el-input.is-disabled .el-input__inner,
				.el-textarea.is-disabled .el-textarea__inner {
					color: #84888f;
					background: #f7f8f9;
				}

				.el-collapse-item__header {
					border: 1px solid transparent;
					padding: 14px 20px;
					background: #F5F6FA;
					line-height: inherit;

					.title {
						display: flex;
						align-items: center;
						font-size: 16px;
						line-height: 22px;
						color: #302E37;
						font-weight: 600;
					}

					.operation {
						color: $primary-color;

						.switch {
							display: flex;
							align-items: center;

							&::before {
								content: '';
								border: 8.25px solid $primary-color;
								border-bottom: 0;
								border-right: 6px solid transparent;
								border-left: 6px solid transparent;
								margin-right: 6px;
								width: 0;
								height: 0;
								transform-origin: center;
								transform: rotateX(0);
								transition: all .2s linear;
							}

							&.open {
								&::before {
									transform: rotateX(180deg);
								}
							}
						}

						>div:last-child {
							margin-left: 22px;
						}
					}
				}

				.el-collapse-item__arrow {
					display: none;
				}

				.el-collapse-item__wrap {
					border: none;
				}

				.el-collapse-item__content {
					padding: 20px;
				}
			}
		}
	}

	.el-date-editor,
	.el-select {
		width: 100%;
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

	.gutter {
		margin: 30px -30px;
		height: 10px;
		background: #F2F2F2;
	}

	.page {
		/deep/ .el-button--primary.is-plain {
			border-style: dashed;
		}
	}

	.title {
		display: flex;
		align-items: center;
		font-size: 16px;
		line-height: 22px;
		font-weight: 600;

		&::before {
			content: '';
			border-radius: 2px;
			margin-right: 8px;
			width: 5px;
			height: 16px;
			background: $--color-primary;
		}
	}

	.spacing-bottom {
		margin-bottom: 20px;
	}
</style>