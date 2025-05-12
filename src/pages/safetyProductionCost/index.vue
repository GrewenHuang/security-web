<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="企业" align="center" header-align="center" width="150" prop="EnterpriseName">
			</el-table-column>
			<el-table-column label="上年度营业收入(万)" prop="PreviousYearIncome" width="150" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column label="提取标准(%)" prop="ExtractionStandard" width="150" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column label="本年度提取金额(万)"  prop="CurrentYearExtraction" width="150" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column label="上年度结余金额(万)" prop="PreviousYearBalance" align="center" header-align="center" width="150">
			</el-table-column>
			<el-table-column label="本年度实际可使用金额(万)" prop="CurrentYearActual" width="200" align="center"> </el-table-column>
			<el-table-column label="实际支出金额(万)" prop="CurrentYearActualTotalPay" align="center"> </el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="300">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="plan(scope.row)" v-if="$_has('AQTRBtnTRJH')">投入计划</el-button>
						<el-button type="text" @click="voucher(scope.row)" v-if="$_has('AQTRBtnZCPZ')">支出凭证</el-button>
						<el-button type="text" @click="ledger(scope.row)" v-if="$_has('AQTRBtnFYTZ')">费用台账</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag title="投入计划" :visible.sync="planShow" :close-on-click-modal="false"
			@close="dialogClear" width="90%" top="8vh">
			<el-scrollbar class="scrollbar" ref="scrollbar">
				<fundingPlan ref="plan" :EnterpriseId="EnterpriseId"></fundingPlan>
			</el-scrollbar>
			<div slot="footer">
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>
		<!--弹层结束-->
		<!--弹层开始-->
		<el-dialog v-dialog-drag title="支出凭证" :visible.sync="voucherShow" :close-on-click-modal="false" width="90%"
			top="8vh">
			<el-scrollbar class="scrollbar" ref="scrollbar">
				<useExpenseAccount ref="voucher" :EnterpriseId="EnterpriseId"></useExpenseAccount>
			</el-scrollbar>
			<div slot="footer">
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>
		<!--弹层结束-->
		<!--弹层开始-->
		<el-dialog v-dialog-drag title="费用台账" :visible.sync="ledgerShow" :close-on-click-modal="false" width="90%"
			top="8vh">
			<el-scrollbar class="scrollbar" ref="scrollbar">
				<annualLedger ref="ledger" :EnterpriseId="EnterpriseId"></annualLedger>
			</el-scrollbar>
			<div slot="footer">
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>
		<!--弹层结束-->
	</page-layout>
</template>

<script>
	import API_POTENTIAL from '@/api/api_potential'
	import request_mixin from "@/mixins/request-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import util from '@/common/util';
	import fundingPlan from '@/pages/safetyProductionCost/fundingPlan'
	import useExpenseAccount from '@/pages/safetyProductionCost/useExpenseAccount'
	import annualLedger from '@/pages/safetyProductionCost/annualLedger'
	export default {
		name: "safetyProductionCost",
		components: {
			fundingPlan,
			useExpenseAccount,
			annualLedger
		},
		
		mixins: [request_mixin, Import_export],
		data() {
			return {
				planShow: false,
				voucherShow: false,
				ledgerShow: false,
				list: [],
				pages: {
					total: 0,
					page: 1,
					rows: 10,
				},
				loading: false,
				EnterpriseId: ""
			};
		},
		methods: {
			plan(row) {
				this.planShow = true
				this.scrollbar(row)
			},
			voucher(row) {
				this.voucherShow = true
				this.scrollbar(row)
			},
			ledger(row) {
				this.ledgerShow = true
				this.scrollbar(row)
			},
			scrollbar(row){
				this.EnterpriseId = row.EnterpriseId
				this.$nextTick(()=>{
					this.$refs.scrollbar.wrap.scrollTop = 0
				})
			},
			close(){
				this.planShow = false
				this.voucherShow = false
				this.ledgerShow = false
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			//搜索事件
			handleSearch() {
				this.pages.page = 1;
				this.getList();
			},
			//获取列表数据
			getList: function() {
				let that = this;
				let params = Object.assign({
					page: that.pages.page,
					rows: that.pages.rows
				}, that.filters);

				that.loading = true;
				this.Post('/EnterpriseFundingPlanListPage', params).then(res => {
					if (res.status == 2000) {
						that.list = res.data.list;
						that.pages.total = res.data.count;
					} else {
						that.$message.error(err.toString());
					}
					that.loading = false;
				}).finally(() => {
					this.loading = false;
				})

			},
			//弹层的取消
			dialogClear() {
				let than = this
				than.addShow = false
			},
		},
		mounted() {
			this.Get('/GetPotentialStatusCom').then((res) => {
				if (res.status === 2000) {
					this.statusList = res.data
				}
			})
			this.handleSearch();
		}

	}
</script>

<style scoped lang="less">
	/deep/ .el-scrollbar__wrap {
		overflow-x: hidden;
	}

	.box-card {
		margin-top: 20px;
	}

	/deep/ .el-button+.el-button {
		margin-left: 0px;
	}

	.form-col div {
		margin-bottom: 15px !important;
	}

	/deep/.input-content .el-form-item {
		margin-bottom: 0 !important;
	}

	.detail-box {
		width: 100%;
		padding-bottom: 20px;
		.num-box {
			width: 100%;
			text-align: right;
			font-size: 16px;
			color: #000;
			font-weight: bold;
			margin-bottom: 10px;

			span:nth-child(2) {
				color: #FF4040;
			}
		}
	}
</style>