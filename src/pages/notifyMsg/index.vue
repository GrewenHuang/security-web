<template>
	<page-layout class="production-accident" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input v-model="filters.Title" placeholder="标题" clearable></el-input>
				<!-- <el-input v-model="filters.CreateByName" placeholder="下发人" clearable></el-input> -->
				<el-date-picker v-model="timeData" type="daterange" @change="onChangeDate"
					value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button type="primary" @click="getFirstPage()">查询</el-button>

			</div>
			<div class="f--c" v-if="$_has('XXTZBtnAdd')">
				<el-button type="primary" icon="el-icon-plus" @click="addRecord('',true)">新增</el-button>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			
			</el-table-column>
			<el-table-column label="序号" type="index" align="center" header-align="center" width="50">
			</el-table-column>
			<el-table-column label="标题" align="center" header-align="center" prop="Title"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="内容" align="center" header-align="center" prop="Context" width="500"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="浏览情况" align="center" header-align="center" width="155"
				show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{scope.row.ReadedCount}}/{{scope.row.TotalCount}}</span>
				</template>
			</el-table-column>
			<el-table-column label="下发人" align="center" header-align="center" prop="CreateByName">
			</el-table-column>
			<el-table-column label="下发时间" align="center" header-align="center" prop="CreateTimeDesc"></el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="240" fixed="right">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="addRecord(scope.row,true)"  v-if="$_has('XXTZBtnLook')">查看</el-button>
						<el-button slot="reference" type="text" text-plain @click="DeleteData(scope.row.NotifyId)"  v-if="$_has('XXTZBtnDelete')">删除</el-button>
						
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 列表 结束 -->
		<info ref="info" @success="getFirstPage"></info>
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import info from './info';
	export default {
		name: "notify",
		components: {
			info,
		},
		mixins: [request_mixin, upload_mixin, Import_export],
		data() {
			return {
				//分页
				pages: {
					total: 0,
					page: 1,
					rows: 10
				},
				timeData: [],
				filters: {
					Title: '',
					CreateByName: '',
					StartTime: '',
					EndTime: '',
					
				}, // 查询条件
				loading: false,
				list: [],
				AccidentList: [],
				AccidentLevelList: [],
				AccidentTypeList: []
			};
		},

		methods: {
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
			addRecord(item, isPreview) {
				//新增
				this.$refs.info.show(item, isPreview);
			},
			//删除列表数据
			DeleteData(Id) {
				this.$confirm("确认要删除该条数据吗？").then((p) => {
					this.Get("/DeleteNotify", {
						notifyId:Id
					}).then((res) => {
						if (res.status == 2000) {
							this.getList();
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
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			getParams() {
				let params = {
					...this.pages,
					...this.filters,
				};
				return params;
			},
			async getList() {
				this.loading = true
				let params = this.getParams();
				let res = await this.Post('/GetNotifys', params);
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
				this.loading = false
			},
			getFirstPage() {
				this.pages.page = 1;
				this.getList();
			},
			async removeVoyageLog(item) {
				let res = await this.Get('/DeleteProductionAccident', {
					productionAccidentId: item.ProductionAccidentId
				});
				if (res.status === 2000) {
					this.$message.success('删除成功');
					this.getList();
				}
			},
		},
		async created() {
			this.getFirstPage();
		},
		mounted() {}
	};
</script>
<style lang="scss" scoped>
	.production-accident {
		.status {
			color: #F56C6C;

			&.complete {
				color: #67C23A;
			}
		}
	}
</style>