<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input placeholder="被约谈人" clearable v-model="filters.IntervieweeName"></el-input>
				<el-input placeholder="驾驶车辆" clearable v-model="filters.LicensePlateNumber"></el-input>
				<el-input placeholder="约谈人" clearable v-model="filters.InterviewerName"></el-input>
				<el-date-picker v-model="timeData" type="daterange" @change="onChangeDate"
					value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
			</div>
			<div class="f-c-c">
				<el-button-group style="margin-right: 20px;">
					<el-button @click="downloadFile" v-if="$_has('YTGLBtnExport')">导出</el-button>
				</el-button-group>
				<el-button type="primary" icon="el-icon-plus" @click="add()" v-if="$_has('YTGLBtnAdd')">新增</el-button>
			</div>
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%"
			@selection-change="handleSelectionChange" ref="listTable">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="被约谈人" align="center">
				<template slot-scope="{ row }">
					{{row.IntervieweeName}}
					<!-- <span v-if="row.AssociationIntervieweeList && row.AssociationIntervieweeList.length > 0">{{row.AssociationIntervieweeList.map(item => item.UserName).join(',')}}</span> -->
				</template>
			</el-table-column>
			<el-table-column label="驾驶车辆" align="center" prop="LicensePlateNumber">
			</el-table-column>
			<el-table-column label="约谈人" align="center">
				<template slot-scope="{ row }">
					<span v-if="row.InterviewerList && row.InterviewerList.length > 0">{{row.InterviewerList.map(item => item.UserName).join(',')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="约谈日期" align="center" prop="InterviewTimeDesc">
			</el-table-column>
			<el-table-column label="约谈原因" align="center" prop="ReasonForDesc">
			</el-table-column>
			<el-table-column label="操作" align="center" width="120">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="add(row, 2)" v-if="$_has('YTGLBtnLook')">查看</el-button>
						<!-- <el-button type="text"  v-if="$_has('YTGLBtnDown')">下载</el-button> -->
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- <userExamineInfo ref="info" @load="handlePageChange(1)"/> -->
		<userExamineInfo ref="info" @success="handlePageChange(1)" />
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import userExamineInfo from './info';
	import Download from "@/mixins/Download.js";
	import Import_export from "@/mixins/Import_export.js";
	export default {
		name: 'task-distribution',
		components: {
			userExamineInfo
		},
		mixins: [request_mixins,Download,Import_export],
		data() {
			return {
				loading: false,
				list: [],
				timeData: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {},
				multipleSelection: []
			}
		},
		created() {
			this.handlePageChange(1);
		},
		methods: {
			downloadFile() {
				if (!this.multipleSelection.length) {
					this.$confirm('确定导出所有数据吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then((res) => {
						if(res){
							this.downloadmbs(1810, 18101, this.filters)
						}
					})
					
				}else {
					let params = {
						...this.filters,
						InterviewIds: this.multipleSelection.map(item => item.InterviewId)
					}
					this.downloadmbs(1810, 18101, params)
					this.$refs.listTable.clearSelection();
				}
			},
			onChangeDate(e) {
				// 选择时间
				if (e) {
					this.filters.InterviewStartTime = e[0]
					this.filters.InterviewEndTime = e[1]
				} else {
					this.filters.InterviewStartTime = ''
					this.filters.InterviewEndTime = ''
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
					let res = await this.Post('/GetInterviews', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			add(item,type) {
				this.$refs.info.show(item,type)
			},
			async batchExamine() {
				if (!this.multipleSelection.length) {
					return this.$message.error('请在列表中选择需要审核用户');
				}
				let res = await this.Post('/BatchApproved', {
					Ids: this.multipleSelection.map(item => item.UserId)
				});
				if (res.status == 2000) {
					this.$message.success('审批成功');
					this.handlePageChange(1);
				} else {
					this.$message.error(res.message)
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		}
	}
</script>

<style>

</style>