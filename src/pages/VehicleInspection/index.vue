<template>
	<page-layout class="warp" :loading="loading" element-loading-text="拼命加载中" :pages="pages"
		@current-change="handleCurrentChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters" @submit.native.prevent>
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags
							v-model="filters.EnterpriseId" @clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters.UserName" placeholder="巡检人"
							style="min-width: 200px;"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters.LicensePlateNumber" placeholder="巡检车辆"
							style="min-width: 200px;"></el-input>
					</el-form-item>
					<el-form-item>
						<el-select clearable v-model="filters.CycleCode" style="width: 100%" placeholder="周期">
							<el-option v-for="(item, index) in cycleList" :key="index" :label="item.text"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-button type="primary" icon="el-icon-plus" @click="add()" style="margin-left: 20px;" v-if="$_has('CLXCBtnAdd')">新增</el-button>
		</div>
		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%;">
			<el-table-column label="序号" align="center" fixed header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" fixed label="企业" align="center" header-align="center"
				show-overflow-tooltip width="150">
			</el-table-column>
			<el-table-column prop="DepartmentName" fixed label="部门" align="center" header-align="center"
				show-overflow-tooltip width="150">
			</el-table-column>
			<el-table-column prop="UserName" label="巡检人" align="center" header-align="center" width="200">
				<template slot-scope="scope" v-if="scope.row.Users && scope.row.Users.length">
					{{ scope.row.Users.map(item => item.UserName).join('、') }}
				</template>
			</el-table-column>
			<el-table-column prop="vio_timeDesc" align="center" header-align="center" label="巡检车辆" width="200">
				<template slot-scope="scope" v-if="scope.row.Vehicles && scope.row.Vehicles.length">
					{{ scope.row.Vehicles.map(item => item.LicensePlateNumber).join('、') }}
				</template>
			</el-table-column>
			<el-table-column align="center" label="周期" show-overflow-tooltip min-width="100">
					<template slot-scope="{row}">
						<span>{{isWeekFun(row.CycleCode)}}</span>
				    </template>
			</el-table-column>
			<el-table-column prop="SecurityLevelDesc" align="center" label="安全等级" show-overflow-tooltip min-width="100">
			</el-table-column>
			<el-table-column label="操作" fixed="right" align="center" header-align="center" width="220">
				<template slot-scope="{row}">
					<el-button type="text" @click="edit(row)" v-if="$_has('CLXCBtnEdit')">编辑</el-button>
					<el-button type="text" @click="look(row)" v-if="$_has('CLXCBtnRecord')">查看记录</el-button>
					<el-button type="text" @click="remove(row)" v-if="$_has('CLXCBtnDelete')">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->
		<info ref="info" @success="onInfoSuccess" :cycleList="cycleList"></info>
		<!-- 查看记录弹窗 -->
		<el-dialog v-dialog-drag title="车辆巡检记录" :visible.sync="dislogShow" :close-on-click-modal="false" @close="close"
			width="80%" top="5vh" append-to-body>
			<!-- <el-scrollbar ref="scrollbar" class="scrollbar"> -->
				<checkInfo ref="check" :cycleList="cycleList"></checkInfo>
			<!-- </el-scrollbar> -->
		</el-dialog>

	</page-layout>
</template>



<script>
	import API_VEHICHEVIOLATION from '@/api/api_vehicleViolation'
	import unfold from '@/components/common/unfold.vue';
	import Import_export from "@/mixins/Import_export.js";
	import request_mixin from "@/mixins/request-mixin.js";
	import info from './info.vue'
	import checkInfo from './checkList'
	export default {
		components: {
			unfold,
			info,
			checkInfo
		},
		name: "list",
		mixins: [Import_export, request_mixin],
		data() {
			return {
				dislogShow: false,
				cycleList: [],
				statusList: [{
						id: '1',
						text: "未处理"
					},
					{
						id: '2',
						text: "已处理"
					}
				],
				//列表行的ID，编辑和删除时需要使用
				id: '',
				//搜索时的过滤条件
				filters: {
					EnterpriseId: '',
					DepartmentId: '',
					LicensePlateNumber: '',
					CycleCode: '',
					UserName: '',
				},
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
			isWeekFun(data){
				return this.cycleList.find(item => item.id == data).text
			},
			// 新增
			add() {
				this.$refs.info.show()
			},
			edit(row) {
				this.$refs.info.show(row)
			},
			close() {
				this.dislogShow = false
			},
			look(row) {
				this.dislogShow = true
				this.$nextTick(()=>{
					this.$refs.check.show(row)
				})
			},
			remove(row) {
				this.$confirm('确认删除选中的数据吗？').then((_) => {
					this.Get('/DeleteVehicleSafelyCheckPlan', {
						VehicleSafelyCheckPlanId: row.VehicleSafelyCheckPlanId,
					}).then((res) => {
						if (res.status == 2000) {
							this.violationList();
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
				this.violationList();
			},
			//获取列表数据
			violationList() {
				let that = this;
				let params = Object.assign({
					page: that.pages.page,
					rows: that.pages.rows,
				}, that.filters);
				that.loading = true;
				that.Post('/GetVehicleSafelyCheckPlanList', params).then((res) => {
					that.loading = false;
					if (res.status == 2000) {
						that.list = res.data.list
						that.pages.total = res.data.count
					}
				})
			},
		},
		mounted() {
			this.Get("/GetVehicleChcekCycleCom", {}).then((res) => {
				//检查频次
				if (res.status == 2000) {
					this.cycleList = res.data
				}
			});
			this.handleCurrentChange(1);
		}
	}
</script>

<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>