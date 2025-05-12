<template>
	<page-layout class="logbook-record" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags v-model="filters.EnterpriseId"
							@clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<!-- <cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department> -->
							<cascader-fleet placeholder="所属车队" clearable
								v-model="filters.VehicleGroupSetId"></cascader-fleet>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters.LicensePlateNumber" placeholder="车牌号" clearable
							@keyup.enter.native="handleSearch"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters.DriverName" placeholder="驾驶员" clearable
							@keyup.enter.native="handleSearch"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="handleSearch">查询</el-button>
						<el-popover width="400" trigger="click">
							<div>
								<el-form-item>
									<el-select v-model="filters.LogbookStatus" placeholder="状态" clearable style="width: 100%">
										<el-option v-for="(item,index) in StatusList" :key="index" :label="item.text"
											:value="item.id"></el-option>
									</el-select>

								</el-form-item>
								<el-form-item>
									<el-date-picker @change="onChangeTime" v-model="searchTime" type="daterange" value-format="yyyy-MM-dd"
										style="width: 100%" align="right" unlink-panels range-separator="至"
										start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
								<!-- <el-form-item>
									<el-date-picker v-model="filters.StartDate" type="date" placeholder="行车开始日期"
										value-format="yyyy-MM-dd" clearable @keyup.enter.native="handleSearch">
									</el-date-picker>

								</el-form-item>
								<el-form-item>
									<el-date-picker v-model="filters.EndDate" type="date" clearable placeholder="行车结束日期"
										value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item> -->
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
			</div>
			<div class="f-c-c">
				<el-button-group>
					<el-button @click="downloadmbs(70, 701, filters)"
						v-if="$_has('CARLogDayRecordBtnExport')">导出</el-button>
				</el-button-group>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" :cell-style="{ textAlign: 'center' }"
			:header-cell-style="{ ...$tableStyle, textAlign: 'center' }">
			<el-table-column label="序号" type="index" width="60">
			</el-table-column>
			<el-table-column width="200" prop="EnterpriseName" align="center" label="企业">
			</el-table-column>
			<el-table-column prop="VehicleGroupSetName" label="车队" align="center"
				show-overflow-tooltip width="150">
			</el-table-column>
			<!-- <el-table-column width="200" prop="DepartmentName" align="center" label="部门">
			</el-table-column> -->
			<el-table-column width="100" label="车牌号">
				<template slot-scope="scope">
					<div>{{ scope.row.LicensePlateNumber }}</div>
				</template>
			</el-table-column>
			<el-table-column width="80" label="驾驶员">
				<template slot-scope="scope">
					<div>{{ scope.row.DriverName }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="LogDateDesc" label="日期" width="100">
			</el-table-column>
			<el-table-column label="行车前检查" align="center">
				<template slot-scope="scope">
					<div class="grid-content" v-if="scope.row.PreTripInspection != null">
						<template v-if="
                                scope.row.PreTripInspection.InspectionItems
                                    .length
                            ">
							<custom-tag type="warning" v-for="(item, i) in scope.row.PreTripInspection.InspectionItems"
								:key="i" :text="item.ItemName" />
						</template>
						<div v-else>正常</div>
					</div>
					<div v-else>无</div>
				</template>
			</el-table-column>
			<el-table-column label="行车中检查">
				<template slot-scope="scope">
					<div v-if="
                            scope.row.InTrainInspection &&
                            scope.row.InTrainInspection.length
                        ">
						<div class="grid-content">
							<template v-if="scope.row.InTrainInspection.InspectionItems.length">
								<custom-tag type="warning"
									v-for="(item, i) in scope.row.InTrainInspection.InspectionItems" :key="i"
									:text="item.ItemName" />
							</template>
							<div v-else>正常</div>
						</div>
					</div>
					<div v-else>无</div>
				</template>
			</el-table-column>
			<el-table-column label="收车后检查" header-align="center" align="center">
				<template slot-scope="scope">
					<div class="grid-content" v-if="scope.row.PostTripInspection != null">
						<template v-if="
                                scope.row.PostTripInspection.InspectionItems.length
                            ">
							<custom-tag type="warning" v-for="(item, i) in scope.row.PostTripInspection.InspectionItems"
								:key="i" :text="item.ItemName" />
						</template>
						<div v-else>正常</div>
					</div>
					<div v-else>无</div>
				</template>
			</el-table-column>

			<el-table-column label="状态" align="center" header-align="center">
				<template slot-scope="{ row }">
					<whether :yes="row.LogbookStatus == 3" :warning="row.LogbookStatus == 4"
						:text="row.LogbookStatusDesc" />
				</template>
			</el-table-column>
			<el-table-column label="操作" width="220">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="showViewDialog(scope.$index, scope.row)"
							v-if="$_has('CARLogDayRecordBtnLook')">查看</el-button>
						<!-- 需要前端实现一车一档PDF下载 -->
						<el-button
                            type="text"
                            @click="downloadmbs(70, 702, scope.row.LogbookId)"
							v-if="scope.row.LogbookId != 0 && $_has('CARLogDayBtnDown')"
                            >下载</el-button
                        >
						<el-button type="text" text-plain @click="deleteLogbook(scope.row.LogbookId)"
							v-if="$_has('CARLogDayRecordBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" width="1000px" top="8vh">
			<logInfo ref="dialogView" :hidden="!addShow"></logInfo>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addShow = false">关闭</el-button>
			</span>
		</el-dialog>
		<!--弹层结束-->
	</page-layout>
</template>

<script>
	import API_LOGBOOK from "@/api/api_logbook";
	import logInfo from "./logInfo";
	import request_mixin from "@/mixins/request-mixin.js";
	import Download from "@/mixins/Download.js";
	import Import_export from "@/mixins/Import_export.js";
	export default {
		name: "logbook-record",
		components: {
			logInfo,
		},
		mixins: [request_mixin, Download, Import_export],
		data() {
			return {
				//搜索时的过滤条件
				filters: {},
				//数据列表
				list: [],
				StatusList: [],
				pages: {
					total: 0,
					page: 1,
					rows: 10,
				},
				//弹层数据
				addShow: false,
				dialogTitle: "",
				//列表页面是否加载变量
				loading: false,
				DepartmentCom: [],
				searchTime: []
			};
		},
		methods: {
			download(url, filename) {
				const loading = this.$loading({
					lock: true,
					text: "下载中,请稍等...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)",
				});
				this.Post("/" + url, {}, "blob").then((res) => {
					loading.close();
					this.readFileDownload(res, filename);
				});
			},

			//搜索事件
			handleSearch() {
				this.pages.page = 1;
				this.getList();
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			onChangeTime(e){
				if(e && e.length > 0){
					this.filters.StartDate = e[0]
					this.filters.EndDate = e[1]
				}else {
					this.filters.StartDate = ""
					this.filters.EndDate = ""
				}
			},
			//获取列表数据
			getList: function() {
				let that = this;
				let params = Object.assign({
						page: that.pages.page,
						rows: that.pages.rows,
					},
					that.filters
				);

				that.loading = true;
				API_LOGBOOK.GetLogbooks(params)
					.then(
						function(result) {
							that.loading = false;
							if (result.status == 2000) {
								that.list = result.data.list.map((item) => {
									if (!!item.PreTripInspection) {
										if (
											item.PreTripInspection.InspectionItems
											.length
										) {
											item.PreTripInspection.InspectionItems =
												item.PreTripInspection.InspectionItems.filter(
													(pre) => pre.IsNormal != 1
												);
										}
									}
									if (!!item.PostTripInspection) {
										if (
											item.PostTripInspection.InspectionItems
											.length
										) {
											item.PostTripInspection.InspectionItems =
												item.PostTripInspection.InspectionItems.filter(
													(pre) => pre.IsNormal != 1
												);
										}
									}
									if (
										!!item.InTrainInspection &&
										item.InTrainInspection.length
									) {
										let items = [];
										let abnormalIds = [];
										item.InTrainInspection.forEach(
											(inTrain) => {
												inTrain.InspectionItems =
													inTrain.InspectionItems.filter(
														(m) => {
															let flag = m.IsNormal != 1
															if (m.IsNormal != 1) {
																if (abnormalIds.indexOf(m.ItemId) == -1) {
																	abnormalIds.push(m.ItemId)
																} else {
																	flag = false;
																}
															}
															return flag;
														}
													);
												items.push(...inTrain.InspectionItems);
											}
										);
										item.InTrainInspection.InspectionItems = items;
									}
									return item;
								});
								that.pages.total = result.data.count;
							}
						},
						function(err) {
							that.loading = false;
							that.$message.error({
								showClose: true,
								message: err.toString(),
								duration: 2000,
							});
						}
					)
					.catch(function(error) {
						that.loading = false;
						that.$message.error({
							showClose: true,
							message: "请求出现异常",
							duration: 2000,
						});
					});
			},
			//弹层的取消
			dialogClear() {
				let than = this;
				than.addShow = false;
			},
			//检查执行
			showViewDialog(index, row) {
				let than = this;
				than.dialogTitle = "查看";
				than.addShow = true;
				than.id = row.LogbookId;
				setTimeout(() => {
					than.$refs.dialogView.getLogbookById(than.id);
				}, 500);
			},
			deleteLogbook(Id) {
				let than = this;
				than.$confirm("确认删除该条数据吗？").then((_) => {
					than.Post("/DeleteLogbook", {
						Id: Id,
					}).then((res) => {
						if (res.status == 2000) {
							this.getList();
							than.$message({
								message: "删除成功！",
								type: "success",
							});
						} else {
							than.$message.error(res.message);
						}
					});
				});
			},
			getStatus() {
				this.Get("/GetLogbookStatusCom").then((res) => {
					if (res.status == 2000) {
						this.StatusList = res.data
					}
				});
			},
			GetDepartments() {
				this.Get("/GetEnterpriseDepartments").then((res) => {
					if (res.status == 2000) {
						this.DepartmentCom = res.data;
					}
				});
			},
		},
		mounted() {
			const currentDate = new Date();
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth() + 1; // 注意月份是从0开始计数的，需要加1
			const day = currentDate.getDate();
			let StartTime = year + '-' + month + '-' + 1
			let EndTime = year + '-' + month + '-' + day
			this.filters.StartDate = StartTime
			this.filters.EndDate = EndTime
			this.searchTime = [StartTime,EndTime]
			this.handleSearch(1);
			this.GetDepartments();
			this.getStatus()
		},
	};
</script>

<style lang="scss" scoped>
	.grid-content {
		>div {
			margin-bottom: 5px;

			&:not(:first-child) {
				margin-left: 5px;
			}
		}
	}

	.logbook-record {
		.el-scrollbar {
			/deep/ .el-scrollbar__wrap {
				margin-bottom: 0 !important;
			}
		}
	}

	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>