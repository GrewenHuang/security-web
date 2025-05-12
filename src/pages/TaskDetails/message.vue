<template>
	<page-layout class="production-accident" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
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
						<select-position v-model="filters.PositionId" :multiple="false" clearable
							placeholder="岗位"></select-position>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="接收人" clearable v-model="filters.UserName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="标题" clearable v-model="filters.Title"></el-input>
					</el-form-item>
					<el-form-item>
						<el-select placeholder="状态" clearable v-model="filters.Status">
							<el-option label="已浏览" :value="1"></el-option>
							<el-option label="未浏览" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">

			</el-table-column>
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="企业/部门" align="center" width="200" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.Departments.map(item => item.EnterpriseName + '-' + item.DepartmentName).join(',') }}
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center">
				<template slot-scope="scope">
					{{ scope.row.positions.map(item => item.PositionName).join(',') }}
				</template>
			</el-table-column>
			<el-table-column label="接收人" align="center" width="120" prop="UserName">
			</el-table-column>
			<el-table-column label="标题" align="center" width="120" prop="Title">
			</el-table-column>
			<el-table-column label="下发人" align="center" prop="CreateByName">
			</el-table-column>
			<el-table-column label="下发时间" align="center" prop="ReadTimeDesc"></el-table-column>
			<el-table-column label="状态" align="center" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<whether :yes="scope.row.IsRead == 1" :text="scope.row.IsRead ? '已浏览' : '未浏览'" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center"  width="240" fixed="right">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="addRecord(scope.row)" v-if="$_has('XXTZBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 列表 结束 -->
		<info ref="info" :isLook="true"></info>
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import info from './components/mssageInfo';
	export default {
		name: "notify",
		components: {
			info,
		},
		mixins: [request_mixin, upload_mixin, Import_export],
		data() {
			return {
				//分页
				pages: {
					total: 0,
					page: 1,
					rows: 10
				},
				filters: {},
				loading: false,
				list: [],
			};
		},

		methods: {
			addRecord(item) {
				this.$refs.info.show(item);
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			getParams() {
				let params = {
					...this.pages,
					...this.filters,
				};
				return params;
			},
			async getList() {
				this.loading = true
				let params = this.getParams();
				let res = await this.Post('/GetTaskNotifyRels', params);
				if (res.status === 2000) {
					let {
						list,
						count: total,
						page,
						rows
					} = res.data;
					this.list = list;
					this.pages.total = total;
					this.pages.page = page;
					this.pages.rows = rows;
				}
				this.loading = false
			},
			async removeVoyageLog(item) {
				let res = await this.Get('/DeleteProductionAccident', {
					productionAccidentId: item.ProductionAccidentId
				});
				if (res.status === 2000) {
					this.$message.success('删除成功');
					this.getList();
				}
			},
		},
		async created() {
			this.handleCurrentChange();
		},
		mounted() {}
	};
</script>
<style lang="scss" scoped>
	.production-accident {
		.status {
			color: #F56C6C;

			&.complete {
				color: #67C23A;
			}
		}
	}

	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>