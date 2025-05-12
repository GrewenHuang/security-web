<!-- 应急专家 -->
<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<select-enterpirse clearable placeholder="企业" collapseTags
					v-model="filters.EnterpriseId"></select-enterpirse>
				<el-input placeholder="专家名称" clearable v-model="filters.ExpertName"></el-input>
				<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
			</div>
			<div class="f--c" >
				<!-- <el-button @click="downloadmbs(1210, 12105,filters)">导出</el-button> -->
				<!-- <el-button>导出</el-button> -->
				<el-button type="primary" icon="el-icon-plus" @click="add()" v-if="$_has('YJZJBtnAdd')">新增</el-button>
			</div>
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column prop="EnterpriseName" align="center" label="企业">
			</el-table-column>
			<el-table-column prop="ExpertName" label="专家姓名" align="center" width="200">
			</el-table-column>
			<el-table-column prop="ExpertTel" label="专家电话" align="center">
			</el-table-column>
			<el-table-column prop="Specialty" label="专家领域" align="center" width="180">
			</el-table-column>
			<el-table-column prop="Education" label="学历" align="center" width="150">
			</el-table-column>
			<el-table-column prop="Major" label="专业" align="center" width="150">
			</el-table-column>
			<el-table-column prop="Remark" label="备注" align="center" width="150">
			</el-table-column>
			<!-- <el-table-column label="安全等级" align="center" width="80"  prop="SecurityLevel"></el-table-column> -->
			<el-table-column label="操作" align="center" width="150">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="add(row)" v-if="$_has('YJZJBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="remove(row)"
							v-if="$_has('YJZJBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<info ref="info" @load="handlePageChange(1)" />
	</page-layout>
</template>

<script>
	import Import_export from "@/mixins/Import_export.js";
	import request_mixins from '@/mixins/request-mixin';
	import info from './addSpecialist';
	export default {
		name: 'specialist',
		components: {
			info
		},
		mixins: [request_mixins,Import_export],
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

				}
			}
		},
		created() {
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
				this.loading = true;
				try {
					let res = await this.Post('/GetEmergencyExperts', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			add(item) {
				this.$refs.info.show(item);
			},
			remove(row) {
				this.$confirm("确认删除该条数据吗？").then((_) => {
					this.Get("/DeleteEmergencyExpert", {
						emergencyExpertId: row.ExpertId,
					}).then((res) => {
						if (res.status == 2000) {
							this.getList();
							this.$message({
								message: "删除成功！",
								type: "success",
							});
						} else {
							this.$message.error(res.message);
						}
					});
				});
			}
		}
	}
</script>

<style>

</style>