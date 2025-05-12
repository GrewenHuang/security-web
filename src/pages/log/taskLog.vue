<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input placeholder="转出人" clearable v-model="filters.SendUserName"></el-input>
				<el-input placeholder="接收人" clearable v-model="filters.ReceiveUserName"></el-input>
				<el-input placeholder="任务Id" clearable v-model="filters.TaskId"></el-input>
				<el-select v-model="filters.SourceType" placeholder="任务来源" clearable
					style="min-width: 180px">
					<el-option v-for="item in SourceCom" :key="item.id" :label="item.text" :value="item.id">
					</el-option>
				</el-select>
				<el-date-picker v-model="timeData" type="daterange" @change="onChangeDate"
					value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
        <el-button @click="downloadmbs(30101, 30103,filters)">导出</el-button>

			</div>
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="任务来源" align="center" prop="SourceTypeName"></el-table-column>
			<el-table-column label="任务Id" align="center" prop="TaskId">
			</el-table-column>
			<el-table-column label="转出人" align="center" prop="SendUserName"></el-table-column>
			<el-table-column label="接收人" align="center" prop="ReceiveUserName"></el-table-column>
			<el-table-column label="操作时间" align="center" prop="SendTimeStr">
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
		mixins: [request_mixins,Download,Import_export,page_mixin],
		data() {
			return {
				loading: false,
				list: [],
				SourceCom: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				timeData: [],
				filters: {},
			}
		},
		created() {
			this.handlePageChange(1);
		},
		mounted() {
			//获取隐患排查性质
			this.Post('/RelayPageTypeList').then((res) => {
				if (res.status === 2000) {
					this.SourceCom = res.data
				}
			})
		},
		methods: {
			onChangeDate(e) {
				// 选择时间
				if (e) {
					this.filters.SendTimeStart = e[0]
					this.filters.SendTimeEnd = e[1] + ' 23:59:59'
				} else {
					this.filters.SendTimeStart = ''
					this.filters.SendTimeEnd = ''
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
					let res = await this.Post('/RelayPage', params);
					if (res.status === 2000) {
						this.list = res.data.data;
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
