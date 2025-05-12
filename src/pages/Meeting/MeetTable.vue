<template>
	<page-layout :loading="tableLoading" element-loading-text="拼命加载中" :pages="pages"
		@current-change="handleCurrentChange">
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input placeholder="主要议题" v-model="filters.Topics" clearable></el-input>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</div>
			<div class="f--c">
				<el-button-group style="margin-right: 20px;">
					<el-button @click="download" v-if="$_has('AQLHBtnPLXZ')">批量导出</el-button>
					<el-button type="danger" @click="onDelete" v-if="$_has('AQLHBtnPLDelete')">批量删除</el-button>
				</el-button-group>
				<el-button v-if="$_has('AQLHBtnAdd')" type="primary" icon="el-icon-plus"
					@click="dialogEditOpen(1)">新增</el-button>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table ref="listTable" :data="pages.list" highlight-current-row :header-cell-style="$tableStyle"
			@selection-change="handleSelectionChange">
			<el-table-column type="selection" align="center" width="55">
			</el-table-column>
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" label="企业" align="center" header-align="center" show-overflow-tooltip
				width="180">
			</el-table-column>
			<el-table-column prop="SafetyMeetingTypeDesc" label="会议方式" align="center" header-align="center"
				show-overflow-tooltip width="80">
			</el-table-column>
			<!-- <el-table-column prop="DepartmentName" label="部门" align="center" header-align="center"
				show-overflow-tooltip>
			</el-table-column> -->
			<el-table-column prop="MeetingTypeName" label="会议类型" align="center" header-align="center"
				show-overflow-tooltip width="180">
			</el-table-column>
			<el-table-column prop="Topics" label="主要议题" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="会议时间" align="center" show-overflow-tooltip width="150">
				<template slot-scope="scope">
					<span v-if="scope.row.SafetyMeetingType == 1">
					{{ utils.formatDate.format(scope.row.SafetyMeetingSessions[0].SessionStartTimeDesc , 'yyyy-MM-dd') }}-{{ utils.formatDate.format(scope.row.SafetyMeetingSessions[0].SessionEndTimeDesc , 'yyyy-MM-dd')}}
					</span>
					<span v-else>
						{{ scope.row.SafetyMeetingSessions[0].SessionStartTimeDesc }}-{{ scope.row.SafetyMeetingSessions[0].SessionEndTimeDesc }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="Topics" align="center" width="150">
				<div slot="header" style="line-height: 1;">
					<div>签名情况</div>
					<div>(已签名/总人数)</div>
				</div>
				<template slot-scope="{ row }">
					{{ calcSignDetail(row) }}
				</template>
			</el-table-column>
			<el-table-column
			    prop="SecurityLevelDesc"
			    label="安全等级"
				align="center"
			>
			</el-table-column>
			<!-- <el-table-column prop="IsRelease" label="状态" align="center" header-align="center" show-overflow-tooltip
				width="80">
				<template slot-scope="scope">
					<whether :yes="scope.row.IsRelease == 1" :text="scope.row.IsRelease ? '已发布' : '未发布'" />
				</template>
			</el-table-column> -->

			<el-table-column label="操作" align="center" header-align="center" width="200">
				<template slot-scope="scope">
					<div class="table-operation">
						<!-- <el-button type="text" v-if="!scope.row.IsRelease && $_has('AQLHBtnFB')"
							@click="res(scope.row.SafetyMeetingId)">发布</el-button> -->
						<el-button type="text" v-if="$_has('AQLHBtnEdit')"
							@click="dialogEditOpen(2, scope.row)">编辑</el-button>
						<!-- <el-button type="text" text-plain v-if="!scope.row.IsRelease && $_has('AQLHBtnDelete')"
							@click="DeleteData(scope.row.SafetyMeetingId)">删除</el-button> -->
						<el-button type="text" v-if="$_has('AQLHBtnLook')"
							@click="dialogImgShow(scope.row, 'see')">查看</el-button>
						<el-button type="text" @click="dialogEditOpen(3, scope.row)" v-if="$_has('AQLHBtnCopy')">复制</el-button>
						<!-- <el-button type="text" v-if="$_has('AQLHBtnDown')"
							@click="downloadmbs(100, 1001, scope.row.SafetyMeetingId)">下载</el-button> -->
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- <div slot="selection" class="selection">已选择<span>{{ selectedRow.length }}</span>条</div> -->
		<meetTableInfo ref="meetTableInfo" @success="handleSearch"></meetTableInfo>
		<meet-table-detail ref="meetTableDetail" @success="handleSearch"></meet-table-detail>
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import meetTableInfo from './meetTableInfo.vue';
	import MeetTableDetail from './meetTableDetail.vue';
	import Import_export from "@/mixins/Import_export.js";
	import utils from '@/common/util';
	export default {
		mixins: [request_mixin, Import_export],
		components: {
			meetTableInfo,
			MeetTableDetail
		},
		data() {
			return {
				utils,
				initResourceId: [],
				props: {
					multiple: true,
					checkStrictly: true,
					emitPath: false,
				},
				tableLoading: false, // 列表数据加载loading
				//分页
				pages: {
					list: [],
					total: 0,
					page: 1,
					rows: 10
				},
				filters: {
					Topics: ''
				},
				selectedRow: [],
			};
		},
		//自定义方法
		methods: {
			dialogImgShow(item) {
				this.$refs.meetTableDetail.show(item)
			},
			//打开弹窗
			dialogEditOpen(index, row) {
				if(index == 3){
					row.SafetyMeetingId = 0
					console.log(row)
				}
				this.$refs.meetTableInfo.show(row,index)
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
			res(Id) {
				//发布
				this.$confirm(
					"会议一旦发布将不能再进行信息编辑,您确定要发布吗？"
				).then((_) => {
					this.Post("/RelaseSafetyMeeting", {
						SafetyMeetingId: Id,
						IsRelease: 1,
					}).then((res) => {
						if (res.status == 2000) {
							this.GetList();
							this.$message({
								message: "发布成功！",
								type: "success",
							});
						} else {
							this.$message.error(res.message);
						}
					});
				});
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			//搜索事件
			handleSearch() {
				this.pages.page = 1;
				this.GetList();
			},

			//加载列表数据
			GetList() {
				this.tableLoading = true;
				this.Post("/GetSafetyMeetings", {
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
			//删除列表数据
			DeleteData(Id) {
				this.$confirm("确认删除该条数据吗？").then((_) => {
					this.Get("/DeleteSafetyMeeting", {
						Id,
					}).then((res) => {
						if (res.status == 2000) {
							this.GetList();
							this.$message({
								message: "删除成功！",
								type: "success",
							});
						} else {
							this.$message.error(res.message);
						}
					});
				});
			},
			handleSelectionChange(val) {
				this.selectedRow = val;
			},
			download() {
				if (!!this.selectedRow.length) {
					this.downloadmbs(100, 1002, this.selectedRow.map(item => item.SafetyMeetingId));
					this.$refs.listTable.clearSelection();
				} else {
					this.$message.warning('请选择会议');
				}
			},
			onDelete(){
				if (!!this.selectedRow.length) {
					this.$confirm('确定执行此操作?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(async () => {
						let params = {
							Ids: this.selectedRow.map(item => item.SafetyMeetingId)
						}
						this.Post('/DeleteBatchSafetyMeeting', params).then(res => {
							if (res.status == 2000) {
								this.$message({
									message: "保存成功",
									type: "success",
								});
								this.$refs.listTable.clearSelection();
								this.GetList()
							} else {
								this.$message({
									message: res.message,
									type: "error",
								});
							}
						})
					})
				} else {
					this.$message.warning('请选择会议');
				}
			},
			calcSignDetail(row) {
				let userList = row.SafetyMeetingSessions[0].SafetyMeetingPersonnels;
				let totalNum = userList.length;
				let singedNum = userList.filter(item => !!item.SignInUrl).length;
				return `${singedNum}/${totalNum}`;
			}
		},
		created() {},
		//页面初始化加载事件
		mounted() {
			this.GetList();
		},
	};
</script>
<style lang="scss" scoped>
	.p {
		height: auto;
		font-size: 14px;
		margin: 10px 0;
	}

	.selection {
		color: #959595;

		span {
			padding: 0 4px;
			color: #1C1D2F;
		}
	}
</style>