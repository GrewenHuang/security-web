<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input v-model="filters.BusinessName" placeholder="业务名" clearable></el-input>
				<el-input v-model="filters.ProductionProcessesName" placeholder="作业名" clearable></el-input>
				<el-input v-model="filters.ProductionProcessesNo" placeholder="作业No" clearable></el-input>
				<el-button type="primary" @click="handleCurrentChange()">查询</el-button>
			</div>
			<div>
				<el-button type="primary" icon="el-icon-plus" @click="onAdd('','','edit')" v-if="$_has('ZYBZBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="业务名称" align="center" prop="BusinessName">
			</el-table-column>
			<el-table-column label="作业名" align="center" prop="OperationName">
			</el-table-column>
			<el-table-column label="作业No" align="center" prop="OperationNo">
			</el-table-column>
			<el-table-column label="版本号" align="center" prop="Verson">
			</el-table-column>
			<el-table-column label="状态" align="center">
				<template slot-scope="{row}">
					<span>{{row.Status == -1? '不通过' : row.Status == 0? '审核中' : row.Status == 1? '已审批' : row.Status == 2? '已发布' : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column label="作成人" align="center" prop="BedoneByName">
			</el-table-column>
			<el-table-column label="作成时间" align="center" prop="BedoneTimeDesc"></el-table-column>
			
			<el-table-column label="操作" align="center" width="320">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="onAdd(scope.row,true)" v-if="$_has('ZYBZBtnLook') && scope.row.Status != 0">查看</el-button>
						<el-button type="text" @click="onAdd(scope.row,false,'edit')"
							v-if="scope.row.Status == 0 && $_has('ZYBZBtnEdit')">编辑</el-button>
						<el-button type="text" @click="onAdd(scope.row,false,'emx')"
								v-if="scope.row.Status == -1 && $_has('ZYBZBtnEdit')">重新审核</el-button>
						<el-button type="text" @click="operate(scope.row,1,'确认发布吗?')"
							v-if="scope.row.Status == 1 && $_has('ZYBZBtnFb')">发布</el-button>
						<el-button type="text" @click="DeleteData(scope.row.OperationStandardId)"
							v-if="scope.row.Status != 2 && $_has('ZYBZBtnDelete')">删除</el-button>
						<el-button type="text" v-if="scope.row.Status == 2 && $_has('ZYBZBtnCh')"
							@click="operate(scope.row,0,'确认撤回吗?')">撤回</el-button>
						<el-button type="text" v-if="scope.row.Status == 2 && $_has('ZYBZBtnZf') && scope.row.IsRelease != 2"
							@click="operate(scope.row,2,'确认中止任务吗?')">中止</el-button>
						<el-button type="text" @click="train(scope.row)" v-if="scope.row.Status == 2 && $_has('ZYBZBtnPx')">培训</el-button>
						<el-button type="text" @click="copy(scope.row,'edit')" v-if="$_has('ZYBZBtnCopy')">复制</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<add ref="add" @success="getList()"></add>
		<study ref="study" @success="getList()"></study>
		<info ref="info"></info>
		<!--列表结束-->
	</page-layout>
</template>



<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import add from './add'
	import study from './study'
	import info from '../Education/trainTaskInfo';
	export default {
		components: {
			add,
			study,
			info
		},
		mixins: [request_mixin, upload_mixin],
		data() {
			return {
				//搜索时的过滤条件
				filters: {},
				btn: false,
				//数据列表
				list: [],
				//分页相关数据
				pages: {
					page: 1,
					rows: 10,
					total: 0,
				},
				//列表页面是否加载变量
				loading: false,
			};
		},
		methods: {
			onAdd(row, Boolean,type) {
				this.$refs.add.show(row, Boolean,type)
			},
			copy(row,type) {
				this.$refs.add.copy(row,type)
			},
			train(row) {
				console.log('培训')
				let params = {
						page: 1,
						rows: 10,
						total: 0,
						RelationId: row.OperationStandardId
				}
				this.Post('/GetTrainCurriculums2',params).then(res => {
					if(res.status == 2000){
						if(res.data.list && res.data.list.length > 0){
							console.log('11111')
							row.TrainTaskId = res.data.list[0].TrainTaskId
							this.$refs.info.show(row)
						}else {
							console.log('222222')

							this.$refs.study.show(row)
						}
					}
				})
			},
			revoke(row, status, title){
				let params = {
						page: 1,
						rows: 10,
						total: 0,
						RelationId: row.OperationStandardId
				}
				this.Post('/GetTrainCurriculums2',params).then(res => {
					if(res.status == 2000){
						if(res.data.list && res.data.list.length > 0){
							this.$message.error('当前作业标准书存在培训人员，无法撤回')
						}else {
							this.operate(row, status, title)
						}
					}
				})
			},
			operate(row, status, title) {
				this.$confirm(`${title}`, '提示', {type: 'warning'}).then((_) => {
					this.Get("/UpdateOperationStandardStatus", {
						operationStandardId: row.OperationStandardId,
						status,
					}).then((res) => {
						if (res.status == 2000) {
							this.getList();
							this.$message({
								message: "操作成功！",
								type: "success",
							});
						} else {
							this.$message.error(res.message);
						}
					});
				});
			},
			//删除列表数据
			DeleteData(Id) {
				this.$confirm("确认删除该条数据吗？").then((_) => {
					this.Get("/DeleteLabour", {
						operationStandardId: Id
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
			//获取列表数据
			getList() {
				let params = {
					...this.pages,
					...this.filters
				}
				this.loading = true;
				this.Post("/GetOperationStandards", params)
					.then((res) => {
						if (res.status == 2000) {
							this.list = res.data.list;
							this.pages.total = res.data.count;
						}
						this.loading = false;
					})
			},
		},
		mounted() {
			this.handleCurrentChange(1);
		},
	};
</script>

<style scoped></style>