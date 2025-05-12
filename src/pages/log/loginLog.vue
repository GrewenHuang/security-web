<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input placeholder="登录人" clearable v-model="filters.UserName"></el-input>
				<el-input placeholder="登录名" clearable v-model="filters.LoginName"></el-input>
				<el-select v-model="filters.TerminalId" clearable placeholder="登录端口" :collapse-tags="true"
					style="min-width: 180px">
					<el-option label="企业端" :value="1"></el-option>
					<el-option label="微信小程序" :value="2"></el-option>
				</el-select>
				<el-select v-model="filters.IsSuccess" clearable placeholder="登录状态" :collapse-tags="true"
					style="min-width: 180px">
					<el-option label="成功" :value="1"></el-option>
					<el-option label="失败" :value="0"></el-option>
				</el-select>
				<el-date-picker v-model="timeData" type="daterange" @change="onChangeDate"
					value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
        <el-button @click="downloadmbs(30101, 30101, filters)"  v-if="$_has('FXKBtnExport')">导出</el-button>
				<el-popover width="300" trigger="click">
					<div>
						<el-input placeholder="登录IP" clearable v-model="filters.LoginIP"></el-input>
					</div>
					<el-button slot="reference" type="text">更多筛选</el-button>
				</el-popover>
			</div>
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="登录人" align="center">
				<template slot-scope="scope">
					<span>
						{{scope.row.EnterpriseName + '-' + scope.row.UserName}}
					</span>
				</template>
			</el-table-column>
      <el-table-column label="登录人部门" align="center" prop="DepartmentName">
			</el-table-column>

			<el-table-column label="登录名" align="center" prop="LoginName">
			</el-table-column>
			<el-table-column label="登录IP" align="center" prop="LoginIP">
			</el-table-column>
			<el-table-column label="登录端口" align="center">
				<template slot-scope="scope">
					<span>
						{{scope.row.TerminalId == 1? '企业端' : '微信小程序'}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="登录状态" align="center">
				<template slot-scope="scope">
					<whether :yes="scope.row.IsSuccess == 1" :text="scope.row.IsSuccess == 1? '成功' : '失败'" />
				</template>
			</el-table-column>
			<el-table-column label="登录时间" align="center" prop="LoginDateDesc">
			</el-table-column>
			<el-table-column label="备注" align="center" prop="Remark">
			</el-table-column>
		</el-table>
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
  import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";


	import page_mixin from "@/mixins/page-minxin.js";

	export default {
		name: 'task-distribution',
		mixins: [request_mixins,Download,page_mixin,Import_export],

		data() {
			return {
				loading: false,
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				timeData: [],
				filters: {

				},
			}
		},
		created() {
			this.handlePageChange(1);
		},
		methods: {
			onChangeDate(e) {
				// 选择时间
				if (e) {
					this.filters.LoginDate = e[0]
					this.filters.LoginEndDate = e[1]
				} else {
					this.filters.LoginDate = ''
					this.filters.LoginEndDate = ''
				}
			},
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
					let res = await this.Post('/GetEnterpriseLogLoginList', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
		}
	}
</script>
