<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags
							v-model="filters.EnterpriseId" @clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<el-form-item>
						<el-select v-model="filters.RiskTypeCode" placeholder="风险类型" clearable>
							<el-option v-for="item in TypeCom" :key="item.id" :value="item.id" :label="item.text">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="filters.RiskLevelCode" placeholder="风险等级" clearable>
							<el-option v-for="item in RiskLevelList" :key="item.id" :value="item.id" :label="item.text">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch()">查询</el-button>
						<el-popover width="400" trigger="click">
							<div>
								<el-form-item>
									<el-input v-model="filters.RiskUnitName" placeholder="风险单元"></el-input>
								</el-form-item>
								<el-form-item>
									<el-input v-model="filters.RiskPointName" placeholder="风险点"></el-input>
								</el-form-item>
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
			</div>
			<div class="f-c-c">
				<el-button-group style="margin-right: 20px;">
					<el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=7')" v-if="$_has('FXXCFXGLBtnMB')">下载导入模板</el-button>
					<el-button  v-if="$_has('FXXCFXGLBtnImport')">
						<el-upload action="#" :show-file-list="false" :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportViewRiskControl', {IsPrivate: 0});
                                }
                            " accept=".xls,.xlsx" :auto-upload="false">导入
						</el-upload>
					</el-button>
					<el-button @click="downloadmbs(40, 401, filters)"  v-if="$_has('FXXCFXGLBtnExport')">导出</el-button>
				</el-button-group>

				<el-button type="primary" icon="el-icon-plus" @click="dialogEditOpen(-1)"  v-if="$_has('FXXCFXGLBtnAdd')">新增</el-button>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table :data="pages.list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="所属企业" align="center" width="100" prop="EnterpriseName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="所属部门" align="center" width="100" prop="DepartmentName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="风险类型" align="center" width="100" prop="RiskTypeName">
			</el-table-column>
			<el-table-column label="风险单元" align="center" width="150" prop="RiskUnitName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="风险点" align="center" width="150" prop="RiskPointName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="风险因素" align="center" width="150" prop="RiskFactors" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="事故类型" align="center" width="120">
				<template slot-scope="scope">
					<div v-for="(item, i) in scope.row.RiskAccidentTypeList" :key="i">
						{{ item }}
					</div>
				</template>
			</el-table-column>
			<el-table-column label="风险级别" align="center" width="100">
				<template slot-scope="scope">
					<el-tag :color="scope.row.RiskLevelBgColor" size="small"
						style="color: #fff;border-color:transparent;" :hit="false">
						{{ scope.row.RiskLevelName }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="管控责任" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div v-for="(item, i) in scope.row
                            .RiskControlResponsibilityList" :key="i">
						管控层级:{{ item.RiskControlDegreeName }};管控频次:{{
                            item.RiskCheckFrequencyName
                        }};责任部门:{{
                            item.ResponsibilityDepartmentName
                        }};责任人:{{ item.ResponsibilityUserName }};
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="250">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="dialogEditOpen(scope.$index, scope.row)"  v-if="$_has('FXXCFXGLBtnEdit')">编辑</el-button>
						<el-button type="text" @click="dialogEwmOpen(scope.$index, scope.row)"  v-if="$_has('FXXCFXGLBtnGZK')">风险告知卡</el-button>
						<el-popconfirm title="是否删除该数据？" icon-color="red" @confirm="DeleteData(scope.row.RiskControlId)">
							<el-button type="text" text-plain slot="reference"  v-if="$_has('FXXCFXGLBtnDelete')">删除</el-button>
						</el-popconfirm>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 列表 结束 -->
		<el-dialog v-dialog-drag title="风险告知卡" :visible.sync="ewm.dialogEwmShow" v-loading="ewm.dialogEwmShowloading"
			:close-on-click-modal="false" @close="dialogEwmClose()" width="50%">
			<el-scrollbar class="scrollbar">
				<table class="table" id="printMe">
					<tr>
						<td colspan="4" style="font-weight: 700; font-size: 16px">
							{{ ewm.EnterpriseName }}风险告知卡
						</td>
					</tr>
					<tr>
						<td>风险单元</td>
						<td>{{ ewm.Data.RiskUnitName }}</td>
						<td>风险点</td>
						<td>{{ ewm.Data.RiskPointName }}</td>
					</tr>
					<tr>
						<td>风险类型</td>
						<td>{{ ewm.Data.RiskTypeName }}</td>
						<td>风险分级</td>
						<td>{{ ewm.Data.RiskLevelName }}</td>
					</tr>
					<tr>
						<td>风险因素</td>
						<td colspan="3">{{ ewm.Data.RiskFactors }}</td>
					</tr>
					<tr>
						<td>事故类型</td>
						<td colspan="3">
							<div v-for="(item, i) in ewm.Data
                                    .RiskAccidentTypeList" :key="i">
								{{ item }}
							</div>
						</td>
					</tr>
					<tr>
						<td>管控措施</td>
						<td colspan="3" style="text-align: left">
							<div v-for="(item, i) in ewm.Data.MeasuresList" :key="i">
								{{ item }}
							</div>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<img :src="ewm.Data.QRCodes" width="300px;" />
						</td>
					</tr>
					<tr v-if="
                            ewm.Data.RiskControlResponsibilityList != null &&
                            ewm.Data.RiskControlResponsibilityList.length > 0
                        ">
						<td>管控层级</td>
						<td>管控频次</td>
						<td>责任部门</td>
						<td>责任人</td>
					</tr>
					<tr v-for="(item, i) in ewm.Data
                            .RiskControlResponsibilityList" :key="i">
						<td>{{ item.RiskControlDegreeName }}</td>
						<td>{{ item.RiskCheckFrequencyName }}</td>
						<td>{{ item.ResponsibilityDepartmentName }}</td>
						<td>{{ item.ResponsibilityUserName }}</td>
					</tr>
					<tr>
						<td>备注</td>
						<td colspan="3">{{ ewm.Data.Remark }}</td>
					</tr>
				</table>
			</el-scrollbar>
			<div style="
                    display: flex;
                    justify-content: center;
                    height: 50px;
                    align-items: center;
                ">
				<el-button type="primary" size="mini" style="margin-right: 10px" icon="el-icon-printer"
					v-print="'#printMe'">打印二维码</el-button>
			</div>
		</el-dialog>
		<!--编辑弹层 开始-->
		<el-dialog v-dialog-drag :title="edits.dialogEditTitle" :visible.sync="edits.dialogEditShow"
			:close-on-click-modal="false" @close="dialogEditClose()" top="8vh" width="80%">
			<template>
				<el-scrollbar class="scrollbar">
					<el-form :rules="edits.rules" ref="editsform" :model="edits.Data">
						<!--  <div style="margin-bottom: 10px;">
                            <el-button type="primary" @click="chooseDatabase()">数据库选择</el-button>
                        </div> -->
						<el-card shadow="never">
							<div class="form-col">
								<el-form-item label="所属企业" prop="EnterpriseId">
									<select-enterpirse clearable placeholder="所属企业" collapseTags
										v-model="edits.Data.EnterpriseId" @clear="edits.Data.DepartmentId = ''"></select-enterpirse>
								</el-form-item>
								<el-form-item label="所属部门" prop="DepartmentId">
									<cascader-department placeholder="所属部门" clearable v-model="edits.Data.DepartmentId"
										:enterpriseId="edits.Data.EnterpriseId"
										:disabled="!edits.Data.EnterpriseId ? true : false"></cascader-department>
									<!-- <select-department placeholder="所属部门" clearable clearable v-model="edits.Data.DepartmentList" :enterpriseId="edits.Data.EnterpriseIds" :disabled="!edits.Data.EnterpriseIds ? true : false"></select-department> -->
								</el-form-item>
							</div>
							<div class="form-col">
								<el-form-item label="风险单元" prop="RiskUnitName">
									<el-input v-model="edits.Data.RiskUnitName"></el-input>
								</el-form-item>
								<el-form-item label="风险点" prop="RiskPointName">
									<el-input v-model="edits.Data.RiskPointName" maxlength="100" show-word-limit>
										<el-button slot="append" class="map-btn" @click="chooseDatabase()"
											type="primary">从数据库选择</el-button>
									</el-input>
								</el-form-item>
							</div>
							<div class="form-col">
								<el-form-item label="风险类型" prop="RiskTypeCode">
									<el-select class="el-input" v-model="edits.Data.RiskTypeCode" placeholder="风险类型">
										<el-option v-for="item in TypeCom" :key="item.id" :value="item.id"
											:label="item.text">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="风险级别" prop="RiskLevelCode">
									<el-select class="el-input" v-model="edits.Data.RiskLevelCode" placeholder="风险级别">
										<el-option v-for="item in RiskLevelList" :key="item.id" :value="item.id"
											:label="item.text">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="form-col">
								<el-form-item class="gutter" label="安全等级" prop="SecurityLevel" ref="SecurityLevel">
									<select-level v-model="edits.Data.SecurityLevel" :multiple="false"
										:value="edits.Data.SecurityLevel"></select-level>
								</el-form-item>
								<el-form-item label="风险因素" prop="RiskFactors">
									<el-input v-model="edits.Data.RiskFactors"></el-input>
								</el-form-item>

							</div>
							<el-form-item label="事故类型" prop="RiskAccidentTypeList" class="picker">
								<div class="el-input" v-for="(item, index) in edits.Data
                                        .RiskAccidentTypeList" :key="'rid' + index"
									style="display: flex; margin-bottom: 2px;">
									<el-input class="gutter" type="text" v-model="
                                            edits.Data.RiskAccidentTypeList[
                                                index
                                            ]
                                        ">
										<template slot="prepend">{{
                                            index + 1
                                        }}</template>
									</el-input>
									<el-button @click="RiskAccidentTypeAdd(index)" v-if="index == 0"
										type="text">新增</el-button>
									<el-button @click="
                                            RiskAccidentTypeReduce(index)
                                        " v-if="index != 0" type="text">删除</el-button>
								</div>
							</el-form-item>
							<el-form-item label="管控措施" prop="MeasuresList" class="picker">
								<div class="el-input" v-for="(item, index) in edits.Data
                                        .MeasuresList" :key="'mid' + index" style="display: flex;margin-bottom: 2px;">
									<el-input class="gutter" type="text" v-model="
                                            edits.Data.MeasuresList[index]
                                        " prefix-icon="">
										<template slot="prepend">{{
                                            index + 1
                                        }}</template>
									</el-input>
									<el-button @click="MeasureAdd()" v-if="index == 0" type="text">新增</el-button>
									<el-button @click="MeasureReduce(index)" v-if="index != 0"
										type="text">删除</el-button>
								</div>
							</el-form-item>
							<el-form-item label="备注" prop="Remark">
								<el-input v-model="edits.Data.Remark"></el-input>
							</el-form-item>
							<table style="width: 100%">
								<colgroup>
									<col width="200">
									<col width="200">
									<col width="200">
									<col width="200">
									<col width="80">
								</colgroup>
								<tr>
									<td style="text-align: center">
										管控层级
									</td>
									<td style="text-align: center">
										管控频次
									</td>
									<td style="text-align: center">
										企业
									</td>
									<td style="text-align: center">
										部门
									</td>
									<td style="text-align: center">
										责任人
									</td>
									<td style="text-align: center;width: 50px;">操作</td>
								</tr>
								<tr v-for="(item, index) in edits.Data
                                        .RiskControlResponsibilityList" :key="'rrs' + index">
									<td>
										<el-select v-model="
                                               item.RiskControlDegreeCode
                                            " placeholder="管控层级">
											<el-option v-for="item in ControlDegreeCom" :key="item.id" :value="item.id"
												:label="item.text">
											</el-option>
										</el-select>
									</td>
									<td>
										<el-select v-model="
                                                item.RiskCheckFrequencyCode
                                            " placeholder="管控频次">
											<el-option v-for="item in CheckFrequencyCom" :key="item.id" :value="item.id"
												:label="item.text">
											</el-option>
										</el-select>
									</td>
									<td>
										<select-enterpirse clearable placeholder="企业" collapseTags
											v-model="item.ResponsibilityEnterpriseId" @clear="item.ResponsibilityDepartmentId = ''"></select-enterpirse>
									</td>
									<td>
										<cascader-department placeholder="部门" clearable v-model="item.ResponsibilityDepartmentId"
											:enterpriseId="item.ResponsibilityEnterpriseId"
											:disabled="!item.ResponsibilityEnterpriseId ? true : false"></cascader-department>
										
									</td>
									<td>
										<el-select class="select-position"
											v-if="item.RiskControlDegreeCode =='0003404'" 
										    v-model="item.ResponsibilityUserId" 
											placeholder="岗位"
										>
										    <el-option
										        v-for="(item, index) in DepartmentPositionCom"
										        :key="index"
										        :label="item.Name"
										        :value="item.PositionId"
										    >
										    </el-option>
										</el-select>
										<choose-user placeholder="责任人"
											v-model="edits.Data.RiskControlResponsibilityList[index]"
											idKey="ResponsibilityUserId" nameKey="ResponsibilityUserName"
											v-if="item.RiskControlDegreeCode != '0003404'"></choose-user>
									</td>
									<td style="text-align: center;">
										<el-button @click="
                                                ResponsibilityReduce(index)
                                            " type="text">删除</el-button>
									</td>
								</tr>
								<tr>
									<td colspan="5">
										<el-button type="primary" @click="ResponsibilityAdd()"
											style="width: 100%">新增</el-button>
									</td>
								</tr>
							</table>
						</el-card>
					</el-form>
				</el-scrollbar>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="dialogEditClose()">取消</el-button>
					<el-button type="primary" :loading="edits.dialogSaveLoading" slot="reference"
						@click="dialogEditSave()">提交</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 编辑弹层 结束 -->
	</page-layout>
</template>
<script>
	import RULECONFIG from "@/common/ruleConfig";
	import request_mixin from "@/mixins/request-mixin.js";
	import formatter_mixin from "@/mixins/formatter-mixin.js";
	import page_mixin from "@/mixins/page-minxin.js";
	import Import_export from "@/mixins/Import_export.js";
	import Download from "@/mixins/Download.js";
	import Qs from "qs";
	const IsPrivate = 0;
	export default {
		name: "RiskControl",
		mixins: [
			request_mixin,
			formatter_mixin,
			page_mixin,
			Import_export,
			Download,
		],
		data() {
			return {
				CheckFrequencyCom: [],
				ControlDegreeCom: [],
				RiskLevelList: [], //风险级别列表
				TypeCom: [],
				DepartmentCom: [],
				DepartmentPositionCom: [],
				loading: false, //页面加载遮罩层显示状态
				pages: {
					page: 1,
					rows: 10,
					list: [],
					count: 0,
				},
				//查询条件
				filters: {
					IsPrivate,
					RiskTypeCode: "",
					RiskLevelCode: "",
					RiskUnitName: "",
					RiskPointName: "",
				},
				//编辑
				edits: {
					dialogEditShow: false, //弹窗显示状态
					dialogSaveLoading: false, //保存提交状态
					dialogEditTitle: "", //弹窗标题
					dialogFormLabelWidth: "120px", //弹窗表单label宽度
					//编辑数据
					Data: {},
					//表单验证规则
					rules: {
						EnterpriseId: RULECONFIG.Select("所属企业"),
						DepartmentId: RULECONFIG.Select("所属部门"),
						RiskUnitName: RULECONFIG.Text("风险单元"),
						RiskPointName: RULECONFIG.Text("风险点"),
						RiskLevelCode: RULECONFIG.Select("风险级别"),
						RiskTypeCode: RULECONFIG.Select("风险类型"),
						RiskFactors: RULECONFIG.Text("风险因素"),
						RiskAccidentTypeList: RULECONFIG.Text("事故类型"),
						MeasuresList: RULECONFIG.Text("管控措施"),
						SecurityLevel: RULECONFIG.Select("安全等级"),
					},
				},
				ewm: {
					dialogEwmShow: false,
					dialogEwmShowloading: false,
					EnterpriseName: "",
					Data: {},
				},
			};
		},
		//自定义方法
		methods: {
			//打开弹窗
			dialogEditOpen(index, row) {
				var that = this;
				if (index == -1) {
					//新增
					that.edits.dialogEditTitle = "新增";
					that.dialogEditInit();
				} else {
					//编辑
					that.edits.dialogEditTitle = "编辑";
					that.Get("/GetRiskControl", {
						riskControlId: row.RiskControlId,
						IsPrivate
					}).then((result) => {
						//检查频次
						if (result.status == 2000) {
							that.edits.Data = result.data;
							if (that.edits.Data.SecurityLevel) {
								that.edits.Data.SecurityLevel = that.edits.Data.SecurityLevel.toString()
							}
						}
					});
				}
				that.edits.dialogEditShow = true;
			},
			//初始化弹窗数据
			dialogEditInit() {
				var that = this;
				that.edits.Data = {
					//初始化编辑数据
					RiskControlId: "0", //Id
					RiskUnitName: "", //风险点Id
					RiskPointName: "", //风险点名称
					RiskLevelCode: "", //风险级别编码
					RiskFactors: "", //危险因素描述
					RiskAccidentTypeList: [""],
					MeasuresList: [""],
					RiskControlResponsibilityList: [],
					Remark: "",
					EnterpriseIds: '',
					DepartmentId: '',
					SecurityLevel: "1"
				};
			},
			//关闭弹窗
			dialogEditClose() {
				var that = this;
				this.$refs.editsform.resetFields();
				that.edits.dialogEditShow = false;
				that.edits.dialogSaveLoading = false;
			},
			//保存弹窗数据
			dialogEditSave() {
				var that = this;
				that.$refs.editsform.validate((valid) => {
					if (valid) {
						that.edits.dialogSaveLoading = true;
						let params = JSON.parse(JSON.stringify(that.edits.Data))
						params.SecurityLevel = parseInt(params.SecurityLevel)
						that.Post("/SaveRiskControl", {
							...params,
							IsPrivate
						}).then(
							function(result) {
								if (result && result.status == 2000) {
									that.$message({
										message: "保存成功",
										type: "success",
									});
									that.edits.dialogEditShow = false;
									that.GetList();
								} else {
									that.$message({
										message: result.Message || result.message,
										type: "error",
									});
								}
								that.edits.dialogSaveLoading = false;
								that.loading = false;
							}
						);
					}
				});
			},
			RiskAccidentTypeAdd(index) {
				this.edits.Data.RiskAccidentTypeList.push("");
			},
			RiskAccidentTypeReduce(index) {
				this.edits.Data.RiskAccidentTypeList.splice(index, 1);
			},
			//管控措施条目增减
			MeasureAdd() {
				this.edits.Data.MeasuresList.push("");
			},
			MeasureReduce(index) {
				this.edits.Data.MeasuresList.splice(index, 1);
			},
			ResponsibilityAdd() {
				this.edits.Data.RiskControlResponsibilityList.push({
					RiskControlDegreeCode: "",
					RiskCheckFrequencyCode: "",
					ResponsibilityDepartmentId: "",
					ResponsibilityUserId: 0,
				});
			},
			ResponsibilityReduce(index) {
				this.edits.Data.RiskControlResponsibilityList.splice(index, 1);
			},
			//加载列表数据
			GetList() {
				let that = this;
				let params = Object.assign({
						page: that.pages.page,
						rows: that.pages.rows,
						IsPrivate
					},
					that.filters
				);
				that.loading = true;
				that.Post("/GetRiskControls", params).then(
					function(result) {
						that.loading = false;
						if (result && result.status == 2000) {
							that.pages.list = result.data.list;
							that.pages.total = result.data.count;
						}
					},
					function(err) {
						that.loading = false;
						that.$message.error({
							showClose: true,
							message: err.toString(),
							duration: 2000,
						});
					}
				);
			},
			//删除列表数据
			DeleteData(Id) {
				let that = this;
				that.loading = true;
				that.Post("/DeleteRiskControl", {
					Id: Id,
					IsPrivate
				}).then((result) => {
					if (result.status != 2000) {
						that.$message({
							message: result.message,
							type: "error",
						});
						return;
					} else {
						that.$message({
							message: "删除成功",
							type: "success",
						});
						that.GetList();
					}
				});
			},
			dialogEwmOpen(index, row) {
				let that = this;
				that.ewm.dialogEwmShowloading = true;
				let userinfo = Qs.parse(localStorage.getItem("userinfo"));
				that.ewm.EnterpriseName = userinfo.Enterprise.EnterpriseName;
				that.Get("/GetRiskControl", {
					riskControlId: row.RiskControlId,
					IsPrivate
				}).then((result) => {
					//检查频次
					if (result.status == 2000) {
						that.ewm.Data = result.data;
					}
				});
				that.ewm.dialogEwmShowloading = false;
				that.ewm.dialogEwmShow = true;
			},
			dialogEwmClose() {
				this.ewm.dialogEwmShow = false;
			},
			chooseDatabase() {
				this.$chooseRisk().then(res => {
					delete res.RiskControlId;
					// delete res.EnterpriseId
					// delete res.DepartmentId
					res.EnterpriseId = this.edits.Data.EnterpriseId
					res.DepartmentId = this.edits.Data.DepartmentId
					res.SecurityLevel = this.edits.Data.SecurityLevel
					this.edits.Data = res;
				})
			}
		},
		//页面初始化加载事件
		mounted() {
			var that = this;
			that.Get("/GetRiskCheckFrequencyCom", {}).then((result) => {
				//检查频次
				if (result.status == 2000) {
					that.CheckFrequencyCom = result.data;
				}
			});
			that.Get("/GetRiskControlDegreeCom", {}).then((result) => {
				//管控层级
				if (result.status == 2000) {
					that.ControlDegreeCom = result.data;
				}
			});
			that.Get("/GetRiskTypeCom", {}).then((result) => {
				//风险类型
				if (result.status == 2000) {
					that.TypeCom = result.data;
				}
			});
			that.Get("/GetRiskLevelCom", {}).then((result) => {
				//风险分级
				if (result.status == 2000) {
					that.RiskLevelList = result.data;
				}
			});
			that.Get("/GetEnterpriseDepartments").then((res) => {
				//责任部门列表
				if (res.status == 2000) {
					that.DepartmentCom = res.data;
				}
			});
			that.Get("/GetPositions").then((res) => {
				//岗位列表
				if (res.status == 2000) {
					that.DepartmentPositionCom = res.data;
				}
			});
			this.GetList();
		},
	};
</script>
<style scoped lang="scss">
	.el-select {
		width: 100%;
	}

	.gutter {
		margin-right: 20px;
	}

	/deep/.el-button+.el-button,
	.el-checkbox.is-bordered+.el-checkbox.is-bordered {
		margin-left: 0px;
	}

	.table {
		width: 100%;
		border: 1px solid #666;
		border-collapse: collapse;
		margin-bottom: 20px;
	}

	.table tr {
		width: 100%;
	}

	.table tr td {
		width: 25%;
		border: 1px solid #666;
		text-align: center;
		padding: 10px;
	}

	.map-btn {
		border-radius: 0;
		background: $--color-primary !important;
		color: #fff !important;
	}
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>