<template>
	<page-layout ref="pageLayout" @scroll-height="getScrollHeight" :loading="loading" :pages="pages"
		@current-change="handleCurrentChange">
		<div slot="operation" class="f-e-c">
			<div class="f--d">
				<el-button type="primary" @click="EditDrivingLine(0)" v-if="$_has('XLKBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" v-loading="loading">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="线路名称" align="center" prop="DrivingLineName">
			</el-table-column>
			<el-table-column align="center" label="起运地" prop="SimpleStartAddress">
			</el-table-column>
			<el-table-column align="center" label="目的地" prop="SimpleEndAddress">
			</el-table-column>
			<el-table-column align="center" width="120" label="货物名称" prop="GoodsName">
			</el-table-column>
			<el-table-column align="center" width="120" label="驾车距离(公里)">
				<template slot-scope="scope" v-if="scope.row.Distance">
					{{ (scope.row.Distance/1000).toFixed(2) }}
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="200">
				<template slot-scope="scope">
					<el-button type="text" size="mini" plain icon="el-icon-edit" v-if="$_has('XLKBtnEdit')"
						@click="EditDrivingLine(scope.row.DrivingLineId)">编辑</el-button>
					<el-button type="text" size="mini" plain icon="el-icon-delete" v-if="$_has('XLKBtnDelete')"
						@click="Delete(scope.row.DrivingLineId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		name: "DrivingLine",
		mixins: [request_mixin],
		data() {
			return {
				//列表页面是否加载变量
				loading: false,
				//数据列表
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				minHeight: 0,
			}
		},
		methods: {
			getScrollHeight(height) {
				this.minHeight = height - 24;
			},
			EditDrivingLine(id) {
				this.$router.push('/AddDrivingLine?id=' + id);
			},
			Delete(id) {
				this.$confirm('确认删除该条数据吗？').then(_ => {
					this.Post('/DeleteDrivingLine', {
						Ids: [id]
					}).then(res => {
						if (res.status == 2000) {
							this.GetList()
							this.$message({
								message: "删除成功！",
								type: "success",
							});
						} else {
							this.$message.error(res.message);
						}
					})
				})
			},
			//获取列表数据
			GetList() {
				let that = this;
				let params = Object.assign({
					page: that.pages.page,
					rows: that.pages.rows
				});
				this.Post('/GetDrivingLines', params).then(res => {
					if (res.status == 2000) {
						that.list = res.data.list
						that.pages.total = res.data.count
					}
				})
			},
			//分页事件
			handleCurrentChange(val) {
				this.page = val;
				this.GetList();
			},
		},
		activated() {
			this.GetList();
		},
		mounted() {
			this.GetList();
		},
	}
</script>
<style scoped>
</style>