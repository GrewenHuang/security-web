<template>
	<page-layout class="page-layout" :loading="loading" :pages="pages" @current-change="handleCurrentChange"
		v-bind="$attrs">
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
						<select-position v-model="filters.PositionList" :multiple="true"
							placeholder="岗位"></select-position>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="姓名" clearable v-model="filters.UserName"></el-input>
					</el-form-item>
					<el-form-item>
						<custom-date-range v-model="dateRange" @change="changeDaterange"
							:has-is-long="false"></custom-date-range>
					</el-form-item>
				</el-form>
				<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
			</div>
			<!-- <div class="f--c">
                <el-button-group>
                    <el-button>导出</el-button>
                </el-button-group>
            </div> -->
		</div>
		<el-table :data="list" :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="排名" prop="Rank" width="60" header-align="center" align="center">
			</el-table-column>
			<el-table-column label="姓名" align="center" prop="UserName" width="180">
			</el-table-column>
			<el-table-column label="部门" align="center" prop="DepartmentName" width="180" show-overflow-tooltip
				:formatter="formatName">
			</el-table-column>
			<el-table-column label="岗位" align="center" prop="PositionName" width="180" show-overflow-tooltip
				:formatter="formatName">
			</el-table-column>
			<el-table-column label="积分获取来源" align="center">
				<template slot-scope="{ row }">
					<custom-tags :successList="row.AddCodeList" :warningList="row.ReduceCodeList"></custom-tags>
				</template>
			</el-table-column>
			<el-table-column label="总积分" prop="TotalScore" align="center" width="140">
			</el-table-column>
			<el-table-column label="操作" width="100" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="show(scope.row)" v-if="$_has('NBKHBtnLook')">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<info ref="info" />
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import info from "./info.vue";
	export default {
		mixins: [request_mixin],
		components: {
			info
		},
		props: {
			issubsidiary: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				date: [],
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0,
				},
				loading: false,
				dateRange: '',
				filters: {}
			};
		},
		mounted() {
			this.getList();
		},
		methods: {
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			getList() {
				this.loading = true;
				let params = {
					...this.pages,
					...this.filters
				}
				this.Post("/GetIntegralsByUser", params)
					.then((res) => {
						if (res.status == 2000) {
							this.list = res.data.list;
							this.pages.total = res.data.count;
						}
					})
					.finally(() => {
						this.loading = false;
					});
			},
			changeDaterange() {
				let list = this.dateRange.split(',');
				this.filters.StartTime = list[0]
				this.filters.EndTime = list[1]
			},
			show(row) {
				this.$refs.info.show(row, 0, {
					StartTime: this.filters.StartTime,
					EndTime: this.filters.EndTime
				})
				this.$refs.info.updataissubsidiary(this.issubsidiary)
			},
			formatName(row, column, cellValue, index) {
				return cellValue.join('、');
			}
		},
	};
</script>
<style lang="scss" scoped>
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}

	.page-layout {
		/deep/ .operation {
			.input-content {

				.el-select,
				.el-input {
					width: 200px;
				}
			}
		}

	}
</style>