<template>
	<div>
		<el-table :data="list" highlight-current-row :header-cell-style="tableStayle" style="min-height: 600px">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="设备类型" align="center" show-overflow-tooltip prop="EquipmentTypeName">
			</el-table-column>
			<el-table-column label="设备名称" align="center" show-overflow-tooltip prop="EquipmentName">
			</el-table-column>
			<el-table-column label="自编号" align="center" show-overflow-tooltip prop="OwnCode">
			</el-table-column>
			<el-table-column label="仓库" align="center" show-overflow-tooltip prop="WarehouseName">
			</el-table-column>
			<el-table-column label="使用位置" align="center" show-overflow-tooltip prop="UseLocation">
			</el-table-column>
			<el-table-column label="负责人" align="center" show-overflow-tooltip prop="ResponsibleUserName">
			</el-table-column>
			<el-table-column label="来源" align="center" show-overflow-tooltip prop="SupplySourceDesc">
			</el-table-column>
			<el-table-column label="进场日期" align="center" show-overflow-tooltip prop="EntryDateDesc">
			</el-table-column>
			<el-table-column label="状态" align="center" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<whether :yes="row.SupplyStatus == 1"
						:class="{warning: row.SupplyStatus == 3, gray: row.SupplyStatus == 4}"
						:text="row.SupplyStatusDesc" />
				</template>
			</el-table-column>
			<!-- <el-table-column label="操作" align="center" width="240">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="preview(row, true)" v-if="$_has('SBSSBtnLook')">查看</el-button>
						<el-button type="text" @click="add(row)" v-if="$_has('SBSSBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="remove(row)"
							v-if="$_has('SBSSBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column> -->
		</el-table>

		<el-row>
			<el-col :span="24">
				<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange"
					:page-size="pages.rows" :total="pages.total" :current-page.sync="pages.page"></el-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	export default {
		mixins: [request_mixin],
		data() {
			return {
				tableStayle: {
					background: 'rgba(13, 64, 105, 0.3)',
					height: '60px',
					color: '#fff',
					borderBottom: '1px solid #0f2a4b',
				},
				list: [],
				loading: false,
				pages: {
					total: 0,
					page: 1,
					rows: 10
				},
			}
		},
		props: ['isWarehouseSetId','EnterpriseId'],
		watch: {
			isWarehouseSetId: {
				deep: true,
				handler(val) {
					this.handleCurrentChange(1)
				}
			},
		},
		mounted() {
			this.handleCurrentChange(1)
		},
		methods: {
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			getList() {
				let params = {
					page: this.pages.page,
					rows: this.pages.rows,
					EnterpriseId: this.EnterpriseId,
					WarehouseSetId: this.WarehouseSetId
				}
				this.loading = true
				this.Post('/GetEquipmentManages', params).then(res => {
					if (res.status == 2000) {
						this.list = res.data.list
						this.pages.total = res.data.count
					}
				})
				this.loading = false;
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