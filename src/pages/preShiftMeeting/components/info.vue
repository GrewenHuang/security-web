<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info" width="1400px"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar ref="scrollbar" class="scrollbar">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
				<el-form-item>
					<el-date-picker type="date" placeholder="召开日期" clearable
						v-model="filters.MeetingDate"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-input placeholder="班组长" v-model="filters.LeaderName"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
				</el-form-item>
			</el-form>
			<div class="content">
				<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
					<el-table-column label="序号" type="index" align="center" width="50">
					</el-table-column>
					<el-table-column
					    label="部门"
					    align="center"
					    width="120"
					    prop="DepartmentName"
					>
					</el-table-column>
					<el-table-column
					    label="岗位"
					    align="center"
					    width="120"
					    prop="PositionName"
					>
					</el-table-column>
					<el-table-column
					    label="班组长"
					    align="center"
					    width="120"
					    prop="LeaderName"
					>
					</el-table-column>
					<el-table-column label="参与人" align="center" show-overflow-tooltip width="150">
						<template slot-scope="{ row }">
							{{ row.Users.map(item => item.UserName).join('、') }}
						</template>
					</el-table-column>
					<el-table-column label="完成情况" align="center">
						<template slot-scope="{ row }">
							{{ meetingStatus[row.Status] }}
						</template>
					</el-table-column>
					<el-table-column label="计划召开日期" align="center">
						<template slot-scope="{ row }">
							{{ row.CreateTimeDesc | format('yyyy-MM-dd')}}
						</template>
					</el-table-column>
					<el-table-column label="召开时间" align="center" width="150" prop="MeetingDateDesc">
					</el-table-column>
					<el-table-column label="完成时间" align="center" width="150" prop="MeetingEndDateDesc">
					</el-table-column>
					<el-table-column label="评分" align="center" width="100" prop="Score">
					</el-table-column>
					
					<el-table-column label="操作" align="center" width="150">
						<template slot-scope="{ row }">
							<div class="table-operation">
								<el-button type="text" @click="showPreview(row, true)">查看</el-button>
								<el-button type="text" @click="showPreview(row, true)" v-if="row.Status == 2 && $_has('BQHRWBtnScore')">打分</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<el-col :span="24" style="text-align: center">
					<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange"
						:page-size="pages.rows" :current-page="pages.page" :total="pages.total"
						class="customPagination">
					</el-pagination>
				</el-col>
			</div>
		</el-scrollbar>
		<preview ref="preview" @load="getList()"/>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	import Import_export from "@/mixins/Import_export.js";
	import preview from '../preview';
	export default {
		mixins: [request_mixin, Import_export],
		components: {
			preview
		},
		data() {
			return {
				id: '',
				loading: false,
				dislogShow: false,
				filters: {
					MeetingDate: '',
					LeaderName: '',
					IsStart: -1,
					PreMeetingSignLeaderId: ''
				},
				meetingStatus: {
					0: '未开始',
					1: '进行中',
					2: '已结束',
					3: '已逾期'
				},
				pages: {
					page: 1,
					rows: 10,
					total: 0
				},
				list: []
			}
		},
		computed: {
			title() {
				return '召开详情'
			}
		},
		created() {
		},
		methods: {
			async show(row) {
				this.dislogShow = true;
				if(row){
					this.filters.PreMeetingSignLeaderId = row.PreMeetingSignLeaderId
					this.handleCurrentChange(1)
				}
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			close() {
				this.dislogShow = false;
				this.filters.TrainTaskId = '';
			},
			showPreview(row) {
				this.$refs.preview.show(row);
			},
			handleCurrentChange(page) {
				this.pages.page = page;
				this.getList();
			},
			async getList() {
				this.loading = true;
				let params = {
					...this.pages,
					...this.filters
				};
				let res = await this.Post("/GetPreMeetingSigns", params);
				if (res.status == 2000) {
					this.list = res.data.list;
					this.pages.total = res.data.count;
				} else {
					this.$message(res.message);
				}
				this.loading = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.info {
		/deep/ .el-dialog__body {
			padding: 0 !important;
		}

		/deep/ .el-dialog {
			min-width: 1200px;
		}

		.el-form {
			border-bottom: 1px solid #eee;
			margin-bottom: 10px;
			padding: 8px 15px 0;
		}

		.content {
			padding: 0 15px 20px;
		}
	}
</style>