<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info" width="70%"
		top="8vh">
		<div class="operation f">
			<el-input placeholder="检查企业" clearable v-model="filters.InspectionEnterpriseName"
				v-if="isEnterprise"></el-input>
			<el-input placeholder="检查编号" clearable v-model="filters.Number"></el-input>
			<custom-date-range style="width: 360px;margin-right:5px;" :hasIsLong="false" v-model="filters.date" />
			<el-select placeholder="隐患状态" clearable v-model="filters.PotentialStatus">
				<el-option :value="0" label="无隐患"></el-option>
				<el-option :value="1" label="有隐患"></el-option>
			</el-select>
			<el-select placeholder="完成状态" clearable v-model="filters.IsComplete">
				<el-option :value="0" label="未完成"></el-option>
				<el-option :value="1" label="已完成"></el-option>
			</el-select>
			<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
		</div>
		<el-scrollbar ref="scrollbar" class="scrollbar">
			<div class="content">
				<el-table ref="table" :data="list" :header-cell-style="$tableStyle" v-loading="loading">
					<el-table-column type="index" width="60" label="序号" align="center">
					</el-table-column>
					<!-- <el-table-column
                        label="检查企业"
                        align="center"
                        prop="InspectionEnterpriseName"
                        v-if="isEnterprise"
                    ></el-table-column> -->
					<el-table-column
					    label="检查编号"
					    align="center"
					    prop="Number"
						width="150"
					></el-table-column>
					<el-table-column label="部门" align="center" prop="DepartmentName"></el-table-column>
					<el-table-column label="检查人" align="center">
						<template slot-scope="{ row }">
							<template v-if="row.InspectionRecordUsers && row.InspectionRecordUsers.length">
								<span v-for="(item, i) in row.InspectionRecordUsers" :key="i">
									<template>
										{{ item.UserName }}
									</template>
								</span>
							</template>
						</template>
					</el-table-column>
					<el-table-column label="计划开始时间" align="center" prop="StartInspectionDateDesc"></el-table-column>
					<el-table-column label="计划结束时间" align="center" prop="EndInspectionDateDesc"></el-table-column>
					<el-table-column label="检查时间" align="center" prop="PlanInspectionDateDesc"></el-table-column>
					<el-table-column label="检查项" align="center" prop="ItemContentCount"></el-table-column>
					<el-table-column label="完成项" align="center" prop="CompleteCount"></el-table-column>
					<el-table-column label="隐患数" align="center" prop="PotentialCount">
						<template slot-scope="{ row }">
							<span @click="onDanger(row)" style="cursor: pointer;">{{row.PotentialCount}}</span>
						</template>
					</el-table-column>
					<el-table-column label="状态" align="center" prop="PotentialLevelName">
						<template slot-scope="{ row }">
							<whether :yes="row.IsComplete == 1" :text="row.IsComplete == 1 ? '已完成' : '未完成'" />
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="80">
						<template slot-scope="{ row }">
							<el-button type="text" @click="preview(row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-scrollbar>
		<el-pagination style="text-align: right;" layout="total, prev, pager, next" background
			@current-change="handlePageChange" :page-size="pages.rows" :total="pages.total" :current-page="pages.page"
			class="customPagination">
		</el-pagination>
		<info class="sub-info" ref="info" />
		<el-dialog v-dialog-drag title="隐患详情" :visible.sync="dangerShow" @close="dangerShow = false" class="info" width="80%"
			top="1vh" v-loading="loading" element-loading-text="数据加载中" :append-to-body="true">
			<dangerInfo ref="dinfo"></dangerInfo>
		</el-dialog>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	import info from './info';
	import dangerInfo from './dangerInfo';
	export default {
		components: {
			info,
			dangerInfo
		},
		props: {
			isEnterprise: {
				type: Boolean,
				default: false
			}
		},
		mixins: [request_mixin],
		data() {
			return {
				dangerShow: false,
				id: '',
				loading: false,
				dislogShow: false,
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {
					date: ''
				},
			}
		},
		computed: {
			title() {
				return '检查记录'
			}
		},
		methods: {
			async show(item) {
				this.dislogShow = true;
				this.id = item.InspectionPlanId;
				this.handlePageChange(1);
			},
			onDanger(row) {
				if (row.PotentialCount > 0) {
					this.dangerShow = true;
					this.$nextTick(()=>{
						this.$refs.dinfo.show(row.InspectionRecordId)
					})
				}
			},
			close() {
				this.dislogShow = false;
				this.id = '';
			},
			handlePageChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			async GetList() {
				this.loading = true;
				let params = {
					InspectionPlanId: this.id,
					// IsSub: +this.isEnterprise,
					...this.pages,
					...this.filters,
				}
				let date = params.date.split(',');
				params.InspectionStartDate = date[0] || '';
				params.InspectionEndDate = date[1] || '';
				try {
					let res = await this.Post('/GetInspectionRecords', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			preview(item) {
				this.$refs.info.show(item)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.info {
		/deep/ .el-dialog__body {
			padding: 0 !important;

			.el-scrollbar__wrap {
				margin-bottom: 0 !important;
			}
		}

		/deep/ :not(.sub-info) .el-dialog {
			min-width: 1200px;
		}

		.operation {
			padding: 20px 20px 10px;

			[class^=el]:not(.el-button) {
				margin-right: 5px;
				width: 180px;
			}
		}

		.split-line {
			&::before {
				content: '';
				display: block;
				margin: 0 -25px 25px;
				height: 10px;
				background: #f2f2f2;
			}
		}

		.content {
			padding: 10px 20px;
		}
	}
</style>