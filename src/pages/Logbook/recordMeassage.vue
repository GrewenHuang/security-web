<template>
	<page-layout class="logbook-record" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
		
					<el-form-item>
						<el-input v-model="filters.LicensePlateNumber" placeholder="车牌号" clearable
							@keyup.enter.native="handleSearch"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters.DriverName" placeholder="司机" clearable
							@keyup.enter.native="handleSearch"></el-input>
					</el-form-item>
							<el-form-item>
									<el-date-picker
											v-model="DateMonth"
											value-format="yyyy-MM"
											type="month"
											@change="changeDate"
											placeholder="选择月">
										</el-date-picker>
									
								</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch">查询</el-button>
				
					</el-form-item>
				</el-form>
			</div>
			<div class="f-c-c">
				<el-button-group>
					<el-button @click="downloadmbs(70, 704, filters)"
						v-if="$_has('CARLogDayRecordBtnExport')">导出</el-button>
				</el-button-group>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" :max-height="500" border :cell-style="{ textAlign: 'center' }"
		   style="width: 100%"	:header-cell-style="{ ...$tableStyle, textAlign: 'center' }">
			<el-table-column label="序号" type="index" width="60">
			</el-table-column>
	 
			<el-table-column width="100" label="车牌号">
				<template slot-scope="scope">
					<div>{{ scope.row.LicensePlateNumber }}</div>
				</template>
			</el-table-column>
			<el-table-column width="80" label="司机">
				<template slot-scope="scope">
					<div>{{ scope.row.DriverName }}</div>
				</template>
			</el-table-column>
         	<el-table-column width="80" :label="index+1" v-for="(item,index) in getDaysInMonth()" :key="index">
				<template slot-scope="scope">
					<div>{{ scope.row[index+1] }}</div>
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
	import {GetList} from "@/api/Management";
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
				searchTime: [],
				DateMonth:""
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
			changeDate(e){
		
				this.filters.DateMonth = e
			},
			getDaysInMonth() {
			 let arr = this.filters.DateMonth.split('-');
				// 获取一个月多少天
				let 	month = arr[1]-1;
					return new Date(arr[0], month + 1, 0).getDate();
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
				GetList(params)
					.then(
						function(result) {
							that.loading = false;
							if (result.status == 2000) {
					         let list = result.data.list;
							 console.log(list,'list')
								// that.list = result.data.list.map((item) => {
								// 	if (!!item.PreTripInspection) {
								// 		if (
								// 			item.PreTripInspection.InspectionItems
								// 			.length
								// 		) {
								// 			item.PreTripInspection.InspectionItems =
								// 				item.PreTripInspection.InspectionItems.filter(
								// 					(pre) => pre.IsNormal != 1
								// 				);
								// 		}
								// 	}
								// 	if (!!item.PostTripInspection) {
								// 		if (
								// 			item.PostTripInspection.InspectionItems
								// 			.length
								// 		) {
								// 			item.PostTripInspection.InspectionItems =
								// 				item.PostTripInspection.InspectionItems.filter(
								// 					(pre) => pre.IsNormal != 1
								// 				);
								// 		}
								// 	}
								// 	if (
								// 		!!item.InTrainInspection &&
								// 		item.InTrainInspection.length
								// 	) {
								// 		let items = [];
								// 		let abnormalIds = [];
								// 		item.InTrainInspection.forEach(
								// 			(inTrain) => {
								// 				inTrain.InspectionItems =
								// 					inTrain.InspectionItems.filter(
								// 						(m) => {
								// 							let flag = m.IsNormal != 1
								// 							if (m.IsNormal != 1) {
								// 								if (abnormalIds.indexOf(m.ItemId) == -1) {
								// 									abnormalIds.push(m.ItemId)
								// 								} else {
								// 									flag = false;
								// 								}
								// 							}
								// 							return flag;
								// 						}
								// 					);
								// 				items.push(...inTrain.InspectionItems);
								// 			}
								// 		);
								// 		item.InTrainInspection.InspectionItems = items;
								// 	}
								// 	return item;
								// });
								console.log(result,'resultresult')
								if(list && list.length>0){
									list.forEach(item=>{
										if(item.LogbookMonthDay && item.LogbookMonthDay.length>0){
											item.LogbookMonthDay.forEach(chilItem=>{
												item[chilItem.Day] = chilItem.Status;
											})
										}
									})
								}
								that.list = list
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
			getNewData(){
				var currentDate = new Date();
				var currentYear = currentDate.getFullYear();
				var currentMonth = currentDate.getMonth() + 1; 
				currentMonth=currentMonth>9?currentMonth:`0${currentMonth}`;
				return `${currentYear}-${currentMonth}`
			}
		},
		mounted() {
			// console.log(this.getNewData(),'年月')
			// const currentDate = new Date();
			// const year = currentDate.getFullYear();
			// const month = currentDate.getMonth() + 1; // 注意月份是从0开始计数的，需要加1
			// const day = currentDate.getDate();
			// let StartTime = year + '-' + month + '-' + 1
			// let EndTime = year + '-' + month + '-' + day
			// this.filters.StartDate = StartTime
			// this.filters.EndDate = EndTime
			// this.searchTime = [StartTime,EndTime]
			this.DateMonth = this.getNewData()
			this.filters.DateMonth = this.getNewData();
			this.getList()                                                                                                                                                                                                                                                                                                               
			// this.handleSearch(1);
			// this.GetDepartments();
			// this.getStatus()
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