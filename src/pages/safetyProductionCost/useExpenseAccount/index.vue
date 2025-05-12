<template>
	<page-layout class="use-expense-account" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input style="width: 210px" clearable placeholder="项目/人/用途/凭证号/备注"
					v-model="filters.Query"></el-input>
				<custom-date-range :hasIsLong="false" v-model="filters.date"></custom-date-range>
				<el-button type="primary" @click="getFirstPage()">查询</el-button>
			</div>
			<div class="f--c">
				<el-button-group style="margin-right: 10px;">
					<el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=11')">导入模板下载</el-button>
					<el-button>
						<el-upload action="#" :show-file-list="false" :on-change="
                                        (file) => {
                                            handleExcel(file, 'ImportFundingRecord', {EnterpriseId: EnterpriseId});
                                        }
                                    " accept=".xls,.xlsx" :auto-upload="false">导入
						</el-upload>
					</el-button>
					<el-button @click="downloadmbs(1410, 14101, filters)">导出</el-button>
				</el-button-group>
				<el-button type="primary" icon="el-icon-plus" @click="viewInfo()">新增</el-button>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" header-align="center" width="50">
			</el-table-column>
			<el-table-column label="使用项目" align="center" header-align="center" prop="Classification" width="200"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="经手人" align="center" header-align="center" prop="HandledByName" width="140">
			</el-table-column>
			<el-table-column label="日期" align="center" header-align="center" prop="RecordDateDesc" width="120">
			</el-table-column>
			<el-table-column label="金额（万）" align="center" header-align="center" prop="Money"
				width="120"></el-table-column>
			<el-table-column label="用途" align="center" header-align="center" prop="Use"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="凭证号" align="center" header-align="center" prop="VoucherNo"
				width="120"></el-table-column>
			<el-table-column label="备注" align="center" header-align="center" prop="Remark" width="200"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="200">
				<template slot-scope="scope">
					<div class="table-operation" v-if="scope.row.Status != 2">
						<el-button type="text" @click="viewInfo(scope.row)">编辑</el-button>
						<el-popconfirm title="确认删除吗？" @confirm="removeData(scope.row)">
							<el-button slot="reference" type="text" text-plain>删除</el-button>
						</el-popconfirm>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 列表 结束 -->
		<detail ref="voyageLogDetail" @load="addSuccess" />
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import Download from "@/mixins/Download.js";
	import detail from './detail';
	export default {
		name: "use-expense-account",
		components: {
			detail
		},
		props: {
			EnterpriseId: {
				type: Number,
				default: ''
			}
		},
		mixins: [request_mixin, upload_mixin, Download, Import_export],
		data() {
			return {
				//分页
				pages: {
					total: 0,
					page: 1,
					rows: 10
				},
				filters: {
					date: '',
					EnterpriseId: ''
				}, // 查询条件
				loading: false,
				list: [],
			};
		},
		watch: {
			'EnterpriseId': {
				deep: true,
				handler(val) {
					this.filters.EnterpriseId = val
					this.getFirstPage();
				}
			}
		},
		created() {
			this.filters.EnterpriseId = this.EnterpriseId
			this.getFirstPage();
		},
		methods: {
			viewInfo(info) {
				this.$refs.voyageLogDetail.show(info,this.EnterpriseId);
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			getParams() {
				let params = {
					...this.pages,
					...this.filters,
					
				};
				return params;
			},
			async GetList() {
				let params = this.getParams();
				params.StartDate = params.date.split(',')[0] || '';
				params.EndDate = params.date.split(',')[1] || '';
				let res = await this.Post('/GetFundingRecords ', params);
				if (res.status === 2000) {
					let {
						list,
						count: total,
						page,
						rows
					} = res.data;
					this.list = list;
					this.pages.total = total;
					this.pages.page = page;
					this.pages.rows = rows;
				}
			},
			getFirstPage() {
				this.pages.page = 1;
				this.GetList();
			},
			async removeData(item) {
				let res = await this.Get('/DeleteFundingRecord', {
					FundingRecordId: item.FundingRecordId
				});
				if (res.status === 2000) {
					this.$message.success('删除成功');
					this.GetList();
				} else {
					this.$message.error(res.message);
				}
			},
			addSuccess() {
				this.getFirstPage();
			}
		},
	};
</script>
<style lang="scss" scoped>
	.use-expense-account {
		.date-range {
			width: 360px;
		}
	}
</style>