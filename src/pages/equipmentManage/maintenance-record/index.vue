<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
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
						<select-position v-model="filters.PositionId" :multiple="false" clearable
							placeholder="岗位"></select-position>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="保养人" clearable v-model="filters.UserName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-select placeholder="保养状态" clearable v-model="filters.Status">
							<el-option label="已完成" value="1"></el-option>
							<el-option label="逾期未完成" value="2"></el-option>
							<el-option label="逾期已完成" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
						<el-popover width="400" trigger="click">
							<div>
								<el-form-item>
									<custom-date-range style="width: 360px;" startDatePlaceholder="保养开始日期"
										endDatePlaceholder="保养结束日期" :hasIsLong="false"
										v-model="filters.date"></custom-date-range>
								</el-form-item>
								<el-form-item>
									<el-select placeholder="设备类型" clearable v-model="filters.EquipmentTypeName" style="width: 100%;">
										<el-option v-for="(item, index) in typeList" :key="index" :label="item"
											:value="item"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-input placeholder="设备名称/自编号/安装位置" clearable v-model="filters.Query"></el-input>
								</el-form-item>
								<el-form-item>
									<el-input placeholder="负责人" clearable
										v-model="filters.ResponsibleUserName"></el-input>
								</el-form-item>

							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
			</div>
			<!-- <div class="f--c">
				<el-button @click="downloadmbs(1310, 13102, filters)">导出</el-button>
			</div> -->
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<!-- <el-table-column label="企业/部门" align="center" show-overflow-tooltip width="110">
				<template slot-scope="scope">
					{{scope.row.EnterpriseName + '-' + scope.row.DepartmentName}}
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center" show-overflow-tooltip width="110">
			</el-table-column> -->
			<el-table-column label="企业/部门" align="center" header-align="center"
				show-overflow-tooltip width="110">
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' + item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center" show-overflow-tooltip width="110">
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="保养人" align="center" prop="UserName" show-overflow-tooltip width="80">
			</el-table-column>
			<el-table-column label="设备类型" align="center" prop="EquipmentTypeName" show-overflow-tooltip width="80">
			</el-table-column>
			<el-table-column label="设备名称" align="center" show-overflow-tooltip prop="EquipmentName" width="80">
			</el-table-column>
			<el-table-column label="自编号" align="center"  prop="OwnCode" :formatter="formatterDefaultValue" show-overflow-tooltip width="80">
			</el-table-column>
			<el-table-column label="位置" align="center"  prop="UseLocation"
				:formatter="formatterDefaultValue" show-overflow-tooltip width="80">
			</el-table-column>
			<el-table-column label="负责人" align="center" prop="ResponsibleUserName"
				:formatter="formatterDefaultValue" show-overflow-tooltip width="80">
			</el-table-column>
			<el-table-column label="保养计划名称" align="center" show-overflow-tooltip prop="PlanName" width="110">
			</el-table-column>
			<el-table-column label="保养计划日期" align="center" prop="PlanDateDesc" show-overflow-tooltip width="110"> 
			</el-table-column>
			<el-table-column label="保养日期" align="center" prop="RecordDateDesc" show-overflow-tooltip width="80">
			</el-table-column>
			<el-table-column label="保养结果" align="center" prop="Result" :formatter="formatterResult" show-overflow-tooltip width="80">
			</el-table-column>
			<el-table-column label="保养状态" align="center" width="110">
				<template slot-scope="{ row }">
					<whether :yes="row.Status == 1"
						:class="{warning: row.SupplyStatus == 3, gray: row.SupplyStatus == 4}"
						:text="statusObj[row.Status]" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="add(row, true)" v-if="/1|3/.test(row.Status)">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<info ref="info" @load="handlePageChange(1)" />
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import Download from "@/mixins/Download.js";
	import Import_export from "@/mixins/Import_export.js";
	import info from './info';
	export default {
		components: {
			info
		},
		mixins: [request_mixins, Download, Import_export],
		data() {
			return {
				loading: false,
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {
					date: '',
				},
				typeList: [],
				statusObj: {
					0: '未完成',
					1: '已完成',
					2: '逾期未完成',
					3: '逾期已完成',
				}
			}
		},
		created() {
			this.getEquipmentTypeList();
			this.handlePageChange(1);
		},
		methods: {
			handlePageChange(val) {
				this.pages.page = val;
				this.getList();
			},
			async getList() {
				let params = {
					...this.pages,
					...this.filters,
				}
				let date = params.date.split(',');
				params.StartDate = date[0] || '';
				params.EndDate = date[1] || '';
				this.loading = true;
				try {
					// let res = await this.Post('/GetMaintenanceRecordList', params);
					let res = await this.Post('/GetTaskMaintenanceRecords', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			add(item) {
				this.$refs.info.show(item)
			},
			async getEquipmentTypeList() {
				let res = await this.Get('/GetEquipmentTypeList?equipmentTypeName=');
				if (res.status) {
					this.typeList = res.data;
				}
			},
			formatterDefaultValue(row, column, cellValue, index) {
				return cellValue || '-'
			},
			formatterResult(row, column, cellValue, index) {
				let obj = ['未保养', '正常', '异常', '异常当场解决'];
				return obj[cellValue];
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
	.el-form-item {
		margin-bottom: 10px !important;
	}
</style>