<template>
	<div>
		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 1">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>

			<el-table-column label="检查编号" align="center" prop="Number" show-overflow-tooltip></el-table-column>
			<el-table-column label="部门" align="center" prop="DepartmentName" show-overflow-tooltip></el-table-column>
			<el-table-column label="检查计划名称" align="center" prop="InspectionPlanName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="检查表" align="center" prop="InspectionName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="检查类型" align="center" prop="InspectionNatureName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="检查人" align="center" show-overflow-tooltip>
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
			<el-table-column label="检查日期" align="center" prop="PlanInspectionDateDesc"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="检查项" align="center" prop="ItemContentCount" show-overflow-tooltip></el-table-column>
			<el-table-column label="完成项" align="center" prop="CompleteCount" show-overflow-tooltip></el-table-column>
			<el-table-column label="隐患数" align="center" prop="PotentialCount" show-overflow-tooltip>
				<!-- <template slot-scope="{ row }">
					<span @click="onDanger(row)" style="cursor: pointer;">{{row.PotentialCount}}</span>
				</template> -->
			</el-table-column>
			<el-table-column label="检查状态" align="center" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<whether :yes="row.IsComplete == 1" :text="row.IsComplete == 1 ? '已完成' : '未完成'" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="190">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="SafeCheckInfo(row)" v-if="$_has('AQJCBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 2">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="DepartmentName" show-overflow-tooltip align="center" label="企业/部门">
				<template slot-scope="scope">
					{{ scope.row.EnterpriseName + '-' + scope.row.DepartmentName }}
				</template>
			</el-table-column>
			<el-table-column label="巡检人" align="center" prop="CheckUserName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="巡检车辆" align="center" prop="VehicleNo" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="车辆负责人" align="center" prop="VehicleUserName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="计划开始时间" align="center" prop="CheckStartTimeDesc" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<span v-if="row.CheckStartTimeDesc">{{row.CheckStartTimeDesc | format('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="计划结束时间" align="center" prop="CheckEndTimeDesc" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<span v-if="row.CheckEndTimeDesc">{{row.CheckEndTimeDesc | format('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="巡检时间" show-overflow-tooltip align="center" prop="CheckLongTimeDesc">
			</el-table-column>
			<el-table-column label="巡检周期" align="center" show-overflow-tooltip>
				<template slot-scope="{row}">
					<span v-if="row.CycleCode">{{statusObj[row.CycleCode]}}</span>
				</template>
			</el-table-column>
			<el-table-column label="巡检状态" align="center" prop="Status" show-overflow-tooltip>
				<template slot-scope="{row}">
					<whether :yes="row.Status == 1" :text="row.Status == 1? '已巡检' : '未巡检'" />
				</template>
			</el-table-column>
			<el-table-column label="操作" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="CarViewDialog(scope.$index, scope.row)">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 3">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="EnterpriseName" align="center" label="企业">
			</el-table-column>
			<el-table-column prop="VehicleGroupSetName" label="车队" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="车牌号">
				<template slot-scope="scope">
					<div>{{ scope.row.LicensePlateNumber }}</div>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="驾驶员">
				<template slot-scope="scope">
					<div>{{ scope.row.DriverName }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="LogDateDesc" label="日期" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="行车前检查" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="grid-content" v-if="scope.row.PreTripInspection">
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
			<el-table-column label="行车中检查" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div v-if="
			                scope.row.InTrainInspection &&
			                scope.row.InTrainInspection.length
			            ">
						<div class="grid-content">
							<template v-if="scope.row.InTrainInspection.InspectionItems && scope.row.InTrainInspection.InspectionItems.length">
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
			<el-table-column label="收车后检查" header-align="center" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="grid-content" v-if="scope.row.PostTripInspection">
						<template v-if="
						scope.row.PostTripInspection.InspectionItems &&  scope.row.PostTripInspection.InspectionItems.length
			                ">
							<custom-tag type="warning" v-for="(item, i) in scope.row.PostTripInspection.InspectionItems"
								:key="i" :text="item.ItemName" />
						</template>
						<div v-else>正常</div>
					</div>
					<div v-else>无</div>
				</template>
			</el-table-column>

			<el-table-column label="状态" align="center" header-align="center" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<whether :yes="row.LogbookStatus == 3" :warning="row.LogbookStatus == 4"
						:text="row.LogbookStatusDesc" />
				</template>
			</el-table-column>
			<el-table-column label="操作" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="LogInfoShow(scope.$index, scope.row)"
							v-if="$_has('CARLogDayRecordBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<el-row>
			<el-col :span="24">
				<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange"
					:page-size="pages.rows" :total="pages.total" :current-page.sync="pages.page"></el-pagination>
			</el-col>
		</el-row>
		<!-- 安全检查 -->
		<SafeCheckInfo ref="safeInfo" />
		<!-- 行车日志 -->
		<el-dialog v-dialog-drag title="查看详情" :visible.sync="LogShow" :close-on-click-modal="false"
			@close="LogShow = false" width="50%" top="8vh" append-to-body>
			<logInfo ref="dialogView" :hidden="!LogShow"></logInfo>
			<span slot="footer" class="dialog-footer">
				<el-button @click="LogShow = false">关闭</el-button>
			</span>
		</el-dialog>
		<!-- 车辆巡查 -->
		<el-dialog v-dialog-drag title="查看详情" :visible.sync="CarShow" :close-on-click-modal="false"
			@close="CarShow = false" append-to-body width="50%" top="8vh">
			<el-scrollbar class="scrollbar">
				<CarCheckInfo ref="CarInfo" />
			</el-scrollbar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="CarShow = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	import SafeCheckInfo from '@/pages/inspectionRecords/info';
	import CarCheckInfo from '@/pages/VehicleInspection/checkInfo'
	import logInfo from "@/pages/Logbook/logInfo";
	export default {
		mixins: [request_mixin],
		components: {
			SafeCheckInfo,
			CarCheckInfo,
			logInfo
		},
		data() {
			return {
				tableStayle: {
					background: 'rgba(13, 64, 105, 0.3)',
					height: '60px',
					color: '#fff',
					borderBottom: '1px solid #0f2a4b',
				},
				LogShow: false,
				CarShow: false,
				list: [],
				loading: false,
				isTypeSearch: 1,
				pages: {
					total: 0,
					page: 1,
					rows: 10
				},
				statusObj: {
					'0003901': '周',
					'0003902': '月',
					'0003903': '季',
					'0003904': '年',
				},
				EnterpriseIdName: 0
			}
		},
		props: ['isCheck','EnterpriseId'],
		watch: {
			isCheck: {
				deep: true,
				handler(val) {
					this.isTypeSearch = val
					this.handleCurrentChange(1)
				}
			},
			EnterpriseId: {
				deep: true,
				handler(val) {
					this.EnterpriseIdName = val 
				}
			}
		},
		created() {
			
		},
		mounted() {
			this.isTypeSearch = this.isCheck
			this.EnterpriseIdName = this.EnterpriseId
			this.handleCurrentChange(1)
		},
		methods: {
			LogInfoShow(index, row) {
				let than = this;
				than.LogShow = true;
				setTimeout(() => {
					than.$refs.dialogView.getLogbookById(row.LogbookId);
				}, 500);
			},
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			// 安全检查
			SafeCheckInfo(row) {
				this.$refs.safeInfo.show(row)
			},
			// 车辆巡查
			CarViewDialog(index, row) {
				let than = this
				than.CarShow = true;
				this.$nextTick(() => {
					than.$refs.CarInfo.getMonthSafelyCheck(row.VehicleSafelyCheckId);
				})
			},
			getDetail(params) {
				let url = ["", '/GetAllInspectionRecordsDaPing', '/GetTaskVehicleSafelyChecksDaPing', '/GetLogbooksDaPing']
				this.loading = true
				this.Post(url[this.isTypeSearch], params).then(res => {
					if (res.status == 2000) {
						this.list = res.data.list
						this.pages.total = res.data.count
					}
				})

				this.loading = false;
			},
			getList() {
				let params = {
					page: this.pages.page,
					rows: this.pages.rows,
					EnterpriseId: this.EnterpriseIdName
				}
				switch (this.isTypeSearch) {
					case 1:
						this.getDetail(params)
						break;
					case 2:
						this.getDetail(params)
						break;
					case 3:
						this.getDetail(params)
						break;
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	@import '../assets/table.less';

	/deep/ .el-pagination {
		padding: 5px 5px !important;
		text-align: right;
		margin: 10px 0;
	}

	/deep/ .el-pagination__total {
		color: #fff;
	}
</style>