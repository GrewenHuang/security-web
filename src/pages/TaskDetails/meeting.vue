<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags v-model="filters.EnterpriseId"
							></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<!-- <cascader-fleet placeholder="所属车队" clearable
							v-model="filters.VehicleGroupSetId"></cascader-fleet> -->
						<!-- <cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department> -->
							<el-input placeholder="任务名称" clearable v-model="filters.PlanName"></el-input>
					</el-form-item>
					<!-- <el-form-item>
						<select-position v-model="filters.PositionId" :multiple="false" clearable
							placeholder="岗位"></select-position>
					</el-form-item> -->
					<el-form-item>
						<el-input placeholder="班组长" clearable v-model="filters.LeaderName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="timeData" type="daterange"
							@change="onChangeDate"
							value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<!-- <el-form-item>
						<el-select placeholder="完成情况" clearable v-model="filters.Status">
							<el-option label="未开始" :value="0"></el-option>
							<el-option label="进行中" :value="1"></el-option>
							<el-option label="已结束" :value="2"></el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item>
						<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
						<!-- <el-popover width="400" trigger="click">
							<div>
								<el-form-item>
									<el-date-picker v-model="timeData" type="daterange"
										@change="onChangeDate"
										value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover> -->
					</el-form-item>
				</el-form>
			</div>
			<div class="f--c">
				<el-button-group style="margin-right: 10px;">
					<el-button @click="downloadFile">导出台账</el-button>
				</el-button-group>
			</div>
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%"
			@selection-change="handleSelectionChange" ref="listTable">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="企业/部门" align="center" show-overflow-tooltip>
				<template slot-scope="{row}">
					<span>{{row.EnterpriseName + '-' + row.DepartmentName}}</span>
				</template>
			</el-table-column>
			<el-table-column label="任务名称" align="center" show-overflow-tooltip prop="PlanName"></el-table-column>
			
			<!-- <el-table-column label="部门" align="center" prop="DepartmentName" width="180">
			</el-table-column> -->
			<!-- <el-table-column label="车队" align="center" prop="VehicleGroupSetName">
			</el-table-column> -->
			<!-- <el-table-column label="岗位" align="center" prop="PositionName">
			</el-table-column> -->
			<el-table-column label="姓名" align="center" prop="LeaderName"></el-table-column>
			<el-table-column label="时间段" align="center">
				<template slot-scope="{row}">
					<span>{{row.SignStartTime + '-' + row.SignEndTime}}</span>
				</template>
			</el-table-column>
			<el-table-column label="安全等级" align="center" prop="SecurityLevelDesc">
			</el-table-column>
			<el-table-column label="完成情况" align="center">
				<template slot-scope="{ row }">
					{{ meetingStatus[row.Status] }}
				</template>
			</el-table-column>
			<el-table-column label="创建人" align="center"  prop="CreateByName">
			</el-table-column>
			<el-table-column label="评分" align="center"  prop="Score">
			</el-table-column>
			<el-table-column label="创建时间" align="center" prop="CreateTimeDesc">
				<template slot-scope="{row}">
					<span>{{utils.formatDate.format(row.CreateTimeDesc, 'yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			
			<el-table-column label="操作" align="center" width="150">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="show(row, true)" v-if="$_has('RWXQBQHBtnLook')">查看</el-button>
						<el-button type="text" @click="show(row, true)" v-if="row.Status == 2 && $_has('BQHRWBtnScore')">打分</el-button>
						<!-- <el-button type="text" @click="show(row, false)">编辑</el-button> -->
					</div>
				</template>
			</el-table-column> 
		</el-table>
		<preview ref="preview" @load="getList()" :look="true" />
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import Import_export from "@/mixins/Import_export.js";
	import Download from "@/mixins/Download.js";
	import preview from '@/pages/preShiftMeeting/preview';
	import utils from '@/common/util';
	export default {
		name: 'task-details-meeting',
		components: {
			preview
		},
		mixins: [request_mixins,Import_export,Download],
		data() {
			return {
				utils,
				timeData: [],
				loading: false,
				meetingStatus: {
					0: '未开始',
					1: '进行中',
					2: '已结束',
					3: '已逾期'
				},
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {
					IsStart: -1,
				},
				multipleSelection: []
			}
		},
		created() {
			this.handlePageChange(1);
		},
		methods: {
			downloadFile(){
				if (this.multipleSelection && this.multipleSelection.length > 0) {
					let params = {
						...this.filters,
						PreMeetingSignIds: this.multipleSelection.map(item => item.PreMeetingSignId)
					}
					this.downloadmbs(2010, 20101, params)
					this.$refs.listTable.clearSelection();
				} else {
					this.downloadmbs(2010, 20101, this.filters)
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handlePageChange(val) {
				this.pages.page = val;
				this.getList();
			},
			onChangeDate(e) {
				// 选择时间
				if(e){
					this.filters.StartTime = e[0]
					this.filters.EndTime = e[1]
				}else {
					this.filters.StartTime = ''
					this.filters.EndTime = ''
				}
				
			},
			async getList() {
				let params = {
					...this.pages,
					...this.filters,
				}
				this.loading = true;
				try {
					let res = await this.Post('/GetPreMeetingSigns', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			show(row) {
				this.$refs.preview.show(row);
			},
		}
	}
</script>

<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>