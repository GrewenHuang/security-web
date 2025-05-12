<template>
	<page-layout class="warp" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags v-model="filters.EnterpriseId"
							@clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="风险单元" v-model="filters.RiskUnitName" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="风险点" v-model="filters.RiskPointName" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="巡查人" v-model="filters.InspectorName" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-model="filters.Status" placeholder="巡查状态" clearable>
							<el-option value="0" label="未完成"></el-option>
							<el-option value="1" label="已完成"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
						<el-popover width="400" trigger="click">
							<div>
								<el-form-item>
									<el-select v-model="filters.InspectionStatus" placeholder="巡查结果" clearable
										style="width: 100%">
										<el-option v-for="item in InspectionStatusEnumCom" :key="item.id"
											:value="item.id" :label="item.text">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-date-picker style="width: 100%" v-model="timeData" type="daterange"
										@change="onChangeDate" value-format="yyyy-MM-dd" start-placeholder="开始日期"
										end-placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>

			</div>
			<div v-if="!isSelect">
				<el-button @click="downloadmbs(40, 402, filters)" v-if="$_has('FXXCXCJLBtnExport2')">导出</el-button>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table class='tableStyle' :data="list" style="width:100%;" :header-cell-style="$tableStyle"
			@selection-change="handleRightSelectionChange">
			<el-table-column type="selection" align="center" width="55" v-if="!isSelect"></el-table-column>
			<el-table-column label="序号" type="index" align="center" width='60'></el-table-column>
			<el-table-column label="所属企业" align="center" width="100" prop="EnterpriseName" show-overflow-tooltip
				v-if="!isSelect">
			</el-table-column>
			<el-table-column label="所属部门" align="center" width="100" prop="DepartmentName" show-overflow-tooltip
				v-if="!isSelect"></el-table-column>
			<el-table-column label="企业/部门" align="center" width="200" prop="EnterpriseName" show-overflow-tooltip  v-if="isSelect">
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' + item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="InspectorName" align="center" width="120" label="巡查人"
				v-if="isSelect"></el-table-column>
			<el-table-column prop="RiskUnitName" align="center" show-overflow-tooltip label="风险单元"></el-table-column>
			<el-table-column prop="RiskPointName" align="center" show-overflow-tooltip label="风险点"></el-table-column>
			<el-table-column prop="RiskTypeName" align="center" width="120" label="风险类型"></el-table-column>
			<el-table-column prop="RiskLevelName" align="center" width="120" label="风险级别"></el-table-column>
			<el-table-column prop="RiskControlDegreeName" align="center" width="120" label="管控层级"></el-table-column>
			<el-table-column prop="InspectorName" align="center" width="120" label="巡查人"
				v-if="!isSelect"></el-table-column>
			<el-table-column prop="PlanInspectionTimeDesc" align="center" width="120" label="计划巡查日期"></el-table-column>
			<el-table-column label="巡查状态" align="center" width="120">
				<template slot-scope="scope">
					<whether :yes="scope.row.Status == 1" :text="scope.row.Status ? '已完成' : '未完成'" />
				</template>
			</el-table-column>
			<el-table-column label="巡查结果" align="center" width="120">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.InspectionStatus==1?'success':(scope.row.InspectionStatus==2?'danger':'info')"
						effect="dark" size="small">{{scope.row.InspectionStatusDesc}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="look(scope.row)"
							v-if="scope.row.Status != 0 && $_has('FXXCXCJLBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 列表 结束 -->
		<!-- 弹窗开始 -->
		<el-dialog v-dialog-drag title="查看" :visible.sync="dialogEditShow" :close-on-click-modal="false"
			@close="dialogEditShow = false" top="8vh" width="30%">
			<el-form label-position="left" class="demo-table-expand">
				<el-form-item label="巡查照片：">
					<el-image v-for="item in form.AttachmentFiles" :key="item.url" :preview-src-list="[item.url]"
						:src='item.url' style='width:100px;height:100px;margin-right:10px;'></el-image>
				</el-form-item>
				<el-form-item label="巡查备注：">
					<span>{{ form.Situation || "无" }}</span>
				</el-form-item>
				<el-form-item label="巡查时间：">
					<span>{{ form.InspectionTimeDesc || "无" }}</span>
				</el-form-item>
				<el-form-item label="巡查签名：" v-if="form.SignInUrl!=null">
					<el-image :preview-src-list="[form.SignInUrl]" :src='form.SignInUrl'
						style='width:auto;height:45px;'></el-image>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 弹窗结束 -->
	</page-layout>

</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	export default {
		name: "Inspection",
		mixins: [request_mixin, Import_export],
		props: {
			isSelect: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dialogEditShow: false,
				loading: false, //页面加载遮罩层显示状态
				InspectionStatusEnumCom: [],
				timeData: [],
				form: {},
				pages: {
					total: 0,
					page: 1,
					rows: 10,

				},
				list: [],
				filters: {
					// RiskUnitName: '',
					// RiskPointName: '',
					// InspectorName: '',
					// WhetherEnum: null,
					// InspectionStatus: null,
					// StartTime: null, //开始时间可选
					// EndTime: null, //结束时间 可选
					// page: 1,
					// rows: 10
				},
				ChooseList: []
			}
		},
		//自定义方法
		methods: {
			show(data) {
				Object.assign(this.filters, data);
				this.timeData = [data.StartTime, data.EndTime];
				this.GetList()
			},
			handleRightSelectionChange(val) {
				this.ChooseList = val;
			},
			look(row) {
				this.form = row
				this.dialogEditShow = true
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			onChangeDate(e) {
				// 选择时间
				if(e){
					this.filters.StartTime = e[0]
					this.filters.EndTime = e[0]
				}else {
					this.filters.StartTime = ''
					this.filters.EndTime = ''
				}
				
			},
			//加载列表数据
			GetList() {
				let that = this;
				that.loading = true;
				// this.filters.StartTime = this.timeData != null ? this.timeData[0] : ''
				// this.filters.EndTime = this.timeData != null ? this.timeData[1] : ''
				let params = {
					...this.filters,
					...this.pages
				}
				let isRiskUrl = ['/GetRiskInspections','/GetTaskRiskInspections']
				let isUrl = this.isSelect ? isRiskUrl[1] : isRiskUrl[0]
				this.Post(isUrl, params)
					.then(
						function(result) {
							if (result.status == 2000) {
								result.data.list.forEach(k => {
									k.Attachmentimglist = k.AttachmentFiles.map(res => {
										return res.url
									})
								})
								that.list = result.data.list
								that.pages.total = result.data.count
							}
							that.loading = false;
						},
						function(err) {
							that.loading = false;
							that.message.error({
								showClose: true,
								message: err.toString(),
								duration: 2000,
							});
						}
					)
					.catch(function(error) {
						that.loading = false;
						that.message.error({
							showClose: true,
							message: "请求出现异常",
							duration: 2000,
						});
					});
			},
		},
		//页面初始化加载事件
		mounted() {
			this.Get('/GetInspectionStatusEnumCom').then(res => {
				if (res.status == 2000) {
					this.InspectionStatusEnumCom = res.data
				}
			})
			// let routeParams = this.$route.params;
			// if ('StartTime' in routeParams) {
			// 	Object.assign(this.filters, routeParams);
			// 	this.timeData = [routeParams.StartTime, routeParams.EndTime];
			// }
			this.GetList()
		},
	};
</script>
<style scoped>
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>