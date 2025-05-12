<template>
	<page-layout :loading="tableLoading" element-loading-text="拼命加载中" :pages="pages"
		@current-change="handleCurrentChange">
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
						<el-input placeholder="参与人" clearable v-model="filters.UserName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="主要议题" clearable v-model="filters.Topics"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
						<el-popover width="300" trigger="click">
							<div>
								<el-form-item>
									<el-select placeholder="会议类型" v-model="filters.MeetingTypeCode" style="width: 100%" clearable>
										<el-option v-for="(item, index) in MeetingType" :key="index" :label="item.text"
											:value="item.id"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item>
									<el-select placeholder="完成情况" clearable v-model="filters.IsFinished"
										style="width: 100%" clearable>
										<el-option label="已完成" :value="1"></el-option>
										<el-option label="未完成" :value="0"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table ref="listTable" :data="pages.list" highlight-current-row :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="DepartmentName" label="企业/部门" align="center" header-align="center"
				show-overflow-tooltip width="200">
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' + item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="参与人" align="center" header-align="center" prop="UserName" show-overflow-tooltip
			></el-table-column>
			<el-table-column prop="SafetyMeetingTypeDesc" label="会议方式" align="center" header-align="center">
			</el-table-column>
			<el-table-column prop="MeetingTypeName" label="会议类型" align="center" header-align="center">
			</el-table-column>
			<el-table-column prop="Topics" label="主要议题" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="会议时间" align="center" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<span v-if="row.SafetyMeetingType == 1">{{ row.SessionStartTime | format('yyyy-MM-dd') }}至{{ row.SessionEndTime | format('yyyy-MM-dd') }}</span>
					<span v-else>{{ row.SessionStartTimeDesc }}至{{ row.SessionEndTimeDesc}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="IsRelease" label="完成情况" align="center" header-align="center" show-overflow-tooltip
				width="120">
				<template slot-scope="scope">
					<whether :yes="scope.row.IsRelease == 1" :text="scope.row.IsRelease ? '已完成' : '未完成'" />
				</template>
			</el-table-column>

			<!-- <el-table-column label="操作" align="center" header-align="center" width="120">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" v-if="$_has('AQLHBtnLook')"
							@click="dialogImgShow(scope.row, 'see')">查看</el-button>
					</div>
				</template>
			</el-table-column> -->
		</el-table>
		<meet-table-detail ref="meetTableDetail" @success="handleCurrentChange(1)"></meet-table-detail>
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import MeetTableDetail from '@/pages/Meeting/meetTableDetail.vue';
	export default {
		mixins: [request_mixin],
		components: {
			MeetTableDetail
		},
		data() {
			return {
				tableLoading: false,
				pages: {
					list: [],
					total: 0,
					page: 1,
					rows: 10
				},
				filters: {},
				MeetingType: [],
			};
		},
		//自定义方法
		methods: {
			dialogImgShow(item) {
				this.$refs.meetTableDetail.show(item)
			},
			uploadfile(url) {
				//档案下载
				let that = this;
				var elemIF = document.createElement("iframe");
				elemIF.src = url;
				if (url.indexOf("http") == -1) {
					that.Get("/GetOssUrl", {
						key: url
					}).then((result) => {
						elemIF.src = result.data.url;
					});
				} else {
					elemIF.src = url;
				}
				elemIF.style.display = "none";
				document.body.appendChild(elemIF);
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},

			//加载列表数据
			GetList() {
				this.tableLoading = true;
				this.Post("/GetTaskSafetyMeetings", {
					page: this.pages.page,
					rows: this.pages.rows,
					...this.filters
				}).then((res) => {
					this.tableLoading = false;
					if (res.status == 2000) {
						this.pages.list = res.data.list;
						this.pages.total = res.data.count;
					}
				}).finally(() => {
					this.tableLoading = false;
				});
			},
		},
		created() {},
		//页面初始化加载事件
		mounted() {
			this.handleCurrentChange(1)
			this.Get("/GetSafeMeetingTypeCom").then((res) => {
				if (res.status == 2000) {
					this.MeetingType = res.data;
				}
			});
		},
	};
</script>
<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>