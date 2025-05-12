<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
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
					<!-- <el-form-item>
						<select-position v-model="filters.PositionList" :multiple="false" clearable
							placeholder="岗位"></select-position>
					</el-form-item> -->
					<el-form-item>
						<el-input v-model="filters.CheckUserName" placeholder="巡检人" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters.VehicleNo" placeholder="巡检车辆" clearable></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
						<el-popover width="300" trigger="click">
							<div>
								<el-form-item>
									<el-select v-model="filters.Status" clearable placeholder="巡检状态"
										:collapse-tags="true" style="width: 100%">
										<el-option label="已巡查" :value="1"></el-option>
										<el-option label="未巡查" :value="0"></el-option>
									</el-select>
								</el-form-item>
								<el-date-picker v-model="filters.StartDate" type="date" placeholder="开始日期"
									value-format="yyyy-MM-dd" clearable style="width: 100%">
								</el-date-picker>
								<el-date-picker v-model="filters.EndDate" type="date" clearable placeholder="结束日期"
									value-format="yyyy-MM-dd" style="width: 100%;margin-top: 10px">
								</el-date-picker>
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
			</div>
			<div class="f--c" v-if="!isCar">
				<el-button @click="downloadmbs(140, 1401, filters)">导出</el-button>
			</div>
		</div>
		<!--工具条结束-->
		<!--列表开始-->
		<el-scrollbar class="scrollbar">
			<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle"
				@selection-change="handleSelectionChange">
				<!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
				<el-table-column label="序号" align="center" type="index" width="60">
				</el-table-column>
				<el-table-column prop="DepartmentName" width="200" align="center" label="企业/部门" v-if="!isCar">
					<template slot-scope="scope">
						{{ scope.row.EnterpriseName + '-' + scope.row.DepartmentName }}
					</template>
				</el-table-column>
				<el-table-column prop="DepartmentName" width="200" align="center" label="企业/部门" v-if="isCar"
					show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
							{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' + item.DepartmentName).join('、') }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="巡检人" align="center" prop="CheckUserName">
				</el-table-column>
				<el-table-column label="巡检车辆" align="center" prop="VehicleNo">
				</el-table-column>
				<el-table-column label="车辆负责人" align="center" prop="VehicleUserName">
				</el-table-column>
				<el-table-column label="计划开始时间" align="center" prop="CheckStartTimeDesc">
					<template slot-scope="{ row }">
						<span v-if="row.CheckStartTimeDesc">{{row.CheckStartTimeDesc | format('yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column label="计划结束时间" align="center" prop="CheckEndTimeDesc">
					<template slot-scope="{ row }">
						<span v-if="row.CheckEndTimeDesc">{{row.CheckEndTimeDesc | format('yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡检时间" width="160" align="center" prop="CheckLongTimeDesc">
				</el-table-column>
				<el-table-column label="巡检周期" align="center">
					<template slot-scope="{row}">
						<span>{{cycleList.find(item => item.id == row.CycleCode).text}}</span>
					</template>
				</el-table-column>
				<el-table-column label="巡检状态" align="center" prop="Status">
					<template slot-scope="{row}">
						<whether :yes="row.Status == 1" :text="row.Status == 1? '已巡检' : '未巡检'" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<div class="table-operation">
							<el-button type="text" @click="showViewDialog(scope.$index, scope.row)">查看</el-button>
							<!-- 需要前端实现一车一档PDF下载 -->
							<el-button type="text" v-if="!isCar"
								@click="downloadmbs(140, 1402, scope.row.VehicleSafelyCheckId)">下载</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-scrollbar>
		<!--列表结束-->
		<!--弹层开始-->
		<el-dialog v-dialog-drag title="查看详情" :visible.sync="addShow" :close-on-click-modal="false" @close="dialogClear"
			append-to-body width="50%" top="8vh">
			<el-scrollbar class="scrollbar">
				<checkInfo ref="dialogView"></checkInfo>
			</el-scrollbar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addShow = false">关闭</el-button>
			</span>
		</el-dialog>
		<!--弹层结束-->
	</page-layout>
</template>

<script>
	import checkInfo from "./checkInfo";
	import request_mixin from "@/mixins/request-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	export default {
		name: "safe-check-record",
		mixins: [request_mixin, Import_export],
		components: {
			checkInfo,
		},
		props: {
			cycleList: {
				type: Array,
				default: []
			},
			isCar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				loading: false,
				addShow: false,
				list: [],
				pages: {
					total: 0,
					page: 1,
					rows: 10,
				},
				filters: {
					VehicleSafelyCheckPlanId: '',
					VehicleNo: "",
					CheckUserName: "",
					Status: "",
					StartDate: "",
					EndDate: ""
				},
				multipleSelection: []
			};
		},
		methods: {
			handleSelectionChange(val) {
				// 选择列表
				this.multipleSelection = val;
			},
			//获取列表数据
			GetList() {
				let that = this;
				let params = Object.assign({
						page: that.pages.page,
						rows: that.pages.rows,
					},
					that.filters
				);
				let isCarUrl = ['/GetVehicleSafelyChecks', '/GetTaskVehicleSafelyChecks']
				let isUrl = this.isCar ? isCarUrl[1] : isCarUrl[0]
				this.Post(isUrl, params).then((res) => {
					if (res.status == 2000) {
						this.list = res.data.list.map(item => {
							item.CheckItems = item.CheckItems.filter(obj => {
								return obj.IsNormal != 1
							})
							return item;
						});
						this.pages.total = res.data.count;
					}
				});
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			//弹层的取消
			dialogClear() {
				let than = this;
				than.addShow = false;
			},
			show(row) {
				this.filters.VehicleSafelyCheckPlanId = row.VehicleSafelyCheckPlanId
				this.handleCurrentChange(1);
			},
			showViewDialog(index, row) {
				let than = this;
				than.addShow = true;
				than.id = row.VehicleSafelyCheckId;
				this.$nextTick(() => {
					than.$refs.dialogView.getMonthSafelyCheck(than.id);
				})
			},
		},
		mounted() {
			if (this.isCar) {
				this.handleCurrentChange(1);
			}
		},
	};
</script>

<style lang="less" scope>
	.input-content .el-form-item {
		margin-bottom: 0 !important;
	}

	.grid-content {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		>div {
			margin-bottom: 5px;

			&:not(:first-child) {
				margin-left: 5px;
			}
		}
	}

	.el-scrollbar__wrap {
		margin-bottom: 0 !important;
	}
</style>