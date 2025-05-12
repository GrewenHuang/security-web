<template>
	<page-layout class="warp" :loading="loading" element-loading-text="拼命加载中" :pages="pages"
		@current-change="handleCurrentChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters" @submit.native.prevent>
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags
							v-model="filters.EnterpriseId" ></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<!-- <cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department> -->
							<cascader-fleet placeholder="所属车队" clearable
								v-model="filters.VehicleGroupSetId"></cascader-fleet>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters.CarNumber" placeholder="车牌号" style="min-width: 200px;"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange()">查询</el-button>
						<el-popover width="400" trigger="click">
							<el-form-item>
								<el-date-picker v-model="searchTime" type="daterange" value-format="yyyy-MM-dd"
									style="width: 100%" align="right" unlink-panels range-separator="至"
									start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
								</el-date-picker>
							</el-form-item>
							<el-form-item>
								<el-select clearable v-model="filters.HandleSign" style="width: 100%">
									<el-option v-for="(item, index) in statusList" :key="index" :label="item.text"
										:value="item.id"></el-option>
								</el-select>
							</el-form-item>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
					<!-- <el-form-item>
				    <el-button class="btn"
				        type="warning"
				        plain
				        size="small"
				        icon="el-icon-download"
				        @click="downloadmbs(30,304,filters)">导出</el-button>
				</el-form-item> -->
				</el-form>
			</div>
			<el-button-group style="margin-right: 20px;">
				<el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=12')" v-if="$_has('CARRecordBtnDown')">导入模板下载</el-button>
				<el-button v-if="$_has('CARRecordBtnImport')">
					<el-upload action="#" :show-file-list="false" :on-change="
			           (file) => {
			               handleExcel(file, 'ImportVehicleViolation',{IsPrivate: 0});
			           }
			       " accept=".xls,.xlsx" :auto-upload="false">导入
					</el-upload>
				</el-button>
				<el-button @click="downloadmbs(50,503,filters)" v-if="$_has('CARRecordBtnExport')">导出</el-button>
				<el-button type="primary" icon="el-icon-plus" style="margin-left: 20px;" @click="add()" v-if="$_has('CARRecordBtnAdd')">新增</el-button>
			</el-button-group>
		</div>
		<!--列表开始-->
		<el-table :data="list" highlight-current-row border :header-cell-style="$tableStyle" v-loading="loading"
			style="width: 100%;">
			<el-table-column label="序号" align="center" fixed header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" fixed label="企业" align="center" header-align="center"
				show-overflow-tooltip width="150">
			</el-table-column>
			<!-- <el-table-column prop="DepartmentName" fixed label="部门" align="center" header-align="center"
				show-overflow-tooltip width="150">
			</el-table-column> -->
			<el-table-column prop="VehicleGroupSetName" fixed label="车队" align="center" header-align="center"
				show-overflow-tooltip width="150">
			</el-table-column>
			<el-table-column prop="car_no" label="车牌号" align="center" header-align="center" width="100">
			</el-table-column>
			<el-table-column prop="vio_timeDesc" align="center" header-align="center" label="违法时间" width="200">
			</el-table-column>
			<el-table-column prop="vio_address" align="center" label="违法地点" show-overflow-tooltip min-width="200">
			</el-table-column>
			<el-table-column prop="vio_action" align="center" label="违法原因" show-overflow-tooltip min-width="200">
			</el-table-column>
			<!-- <el-table-column prop="vio_action"
		                 align="center"
		                 label="违章行为"
		                 min-width="150">
		</el-table-column> -->
			<el-table-column prop="vio_score" align="center" header-align="center" label="扣分" width="100">
			</el-table-column>
			<el-table-column prop="vio_fine" align="center" header-align="center" label="罚款" width="100">
			</el-table-column>
			<el-table-column prop="UserName" align="center" header-align="center" label="责任人" width="100">
			</el-table-column>
			<el-table-column prop="handle_sign" align="center" header-align="center" label="处理结果" width="100">
				<template slot-scope="{ row }">
					<whether :yes="row.handle_sign == 2" :text="row.handle_sign == 1? '未处理' : '已处理'" />
				</template>
			</el-table-column>
			<!-- <el-table-column prop="Remark"
		                 align="center"
		                 header-align="center"
		                 label="备注"
		                 min-width="100">
		</el-table-column> -->
			<el-table-column label="操作" fixed="right" align="center" header-align="center" width="150">
				<template slot-scope="{row}">
					<el-button type="text" @click="edit(row)" v-if="$_has('CARRecordBtnEdit')">{{row.handle_sign == '2'? '查看' : '编辑'}}</el-button>
					<el-button type="text" @click="remove(row)" v-if="$_has('CARRecordBtnDelete')">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->
		<info ref="info" @success="onInfoSuccess"></info>
	</page-layout>

</template>



<script>
	import API_VEHICHEVIOLATION from '@/api/api_vehicleViolation'
	import unfold from '@/components/common/unfold.vue';
	import Import_export from "@/mixins/Import_export.js";
	import request_mixin from "@/mixins/request-mixin.js";
	import info from './info.vue'
	export default {
		components: {
			unfold,
			info
		},
		name: "list",
		mixins: [Import_export, request_mixin],
		data() {
			return {
				statusList: [{
						id: 1,
						text: "未处理"
					},
					{
						id: 2,
						text: "已处理"
					}
				],
				//列表行的ID，编辑和删除时需要使用
				id: '',
				//搜索时的过滤条件
				filters: {},
				//数据列表
				list: [],
				//分页
				pages: {
					total: 0,
					page: 1,
					rows: 10
				},
				//列表页面是否加载变量
				loading: false,
				//编辑
				edits: {
					dialogEditShow: false, //弹窗显示状态
					dialogSaveLoading: false, //保存提交状态
					dialogEditTitle: "", //弹窗标题
					Data: {
						handle_num: 0,
						Remark: '',
					},
					rules: {},
				},
				searchTime: '',
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
			};
		},
		computed: {
			startTime: function() {
				return this.searchTime != null && this.searchTime != '' ? this.searchTime[0] : null;
			},
			endtime: function() {
				return this.searchTime != null && this.searchTime != '' ? this.searchTime[1] : null;
			},
		},
		methods: {
			// 新增
			add() {
				this.$refs.info.show()
			},
			edit(row) {
				this.$refs.info.show(row)
			},
			remove(row) {
				this.$confirm('确认删除选中的数据吗？','提示',{type: 'warning'}).then((_) => {
					this.Get('/DeleteVehicleViolationRec', {
						VehicleViolationRecId: row.VehicleViolationRecId,
					}).then((res) => {
						if (res.status == 2000) {
							this.GetList();
							this.$message({
								message: '删除成功！',
								type: 'success',
							});
						} else {
							this.$message.error(res.message);
						}
					});
				});
			},
			onInfoSuccess() {
				this.handleCurrentChange(1)
			},
			//分页事件
			handleCurrentChange(val) {
				this.page = val;
				this.GetList();
			},
			//获取列表数据
			GetList() {
				let that = this;
				let params = Object.assign({
					page: that.pages.page,
					rows: that.pages.rows,
					StartDate: this.startTime,
					EndDate: this.endtime,
				}, that.filters);
				that.loading = true;
				that.Post('/GetVehicleViolationRecListPage', params).then((res) => {
					that.loading = false;
					if (res.status == 2000) {
						that.list = res.data.list
						that.pages.total = res.data.count
					}
				})
			},
		},
		mounted() {
			this.handleCurrentChange(1);
		}
	}
</script>

<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>
