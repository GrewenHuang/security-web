<template>
	<page-layout class="warp" :loading="loading" element-loading-text="拼命加载中" :pages="pages"
		@current-change="handleCurrentChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters" @submit.native.prevent>
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags v-model="filters.EnterpriseId"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-fleet placeholder="所属车队" clearable
							v-model="filters.VehicleGroupSetId"></cascader-fleet>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters.VehicleNo" placeholder="车牌号" style="min-width: 200px;"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange()">查询</el-button>
						<el-popover width="400" trigger="click">
							<el-form-item>
								<el-input v-model="filters.UserName" placeholder="当前驾驶员"></el-input>
							</el-form-item>
							<el-form-item>
								<el-date-picker v-model="searchTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
									@change="onChangeTime"
									style="width: 100%" align="right" unlink-panels range-separator="至"
									start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
								</el-date-picker>
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
				<el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=13')"
					v-if="$_has('CARWarnBtnDrmbxz')">导入模板下载</el-button>
				<el-button v-if="$_has('CARWarnBtnImport')">
					<el-upload action="#" :show-file-list="false" :on-change="
			           (file) => {
			               handleExcel(file, 'ImportVehicleWarning');
			           }
			       " accept=".xls,.xlsx" :auto-upload="false">导入
					</el-upload>
				</el-button>
				<el-button @click="downloadFile" v-if="$_has('CARWarnBtnexport')">导出</el-button>
				<el-button type="primary" icon="el-icon-plus" style="margin-left: 20px;" @click="add()"
					v-if="$_has('CARWarnBtnAdd')">新增</el-button>
			</el-button-group>
		</div>
		<!--列表开始-->
		<el-table :data="list" highlight-current-row border :header-cell-style="$tableStyle" v-loading="loading"
			@selection-change="handleSelectionChange" ref="listTable">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="序号" align="center" fixed header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" fixed label="企业" align="center" header-align="center"
				show-overflow-tooltip width="150">
			</el-table-column>
			<el-table-column prop="VehicleGroupSetName" fixed label="车队" align="center" header-align="center"
				show-overflow-tooltip width="150">
			</el-table-column>
			<el-table-column prop="VehicleNo" label="车牌号" align="center" header-align="center" width="100">
			</el-table-column>
			<el-table-column prop="UserName" align="center" header-align="center" label="当前驾驶员" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="WarningDateDesc" align="center" header-align="center" label="发生时间" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="RiskTypeDesc" align="center" label="风险类型" show-overflow-tooltip min-width="100">
			</el-table-column>
			<el-table-column align="center" label="风险等级" show-overflow-tooltip min-width="100">
				<template slot-scope="{row}">
					<span>{{row.RiskLevel == 1? '一级风险' : row.RiskLevel == 2? '二级风险' : row.RiskLevel == 3? '三级风险' : ''}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="Speed" align="center" header-align="center" label="速度(km/h)" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="SecurityLevelDesc" align="center" header-align="center" label="安全等级" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="RiskPlace" align="center" header-align="center" label="风险位置" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="操作" fixed="right" align="center" header-align="center" width="150">
				<template slot-scope="{row}">
					<el-button type="text" @click="edit(row)" v-if="$_has('CARWarnBtnEdit')">编辑</el-button>
					<el-button type="text" @click="remove(row)" v-if="$_has('CARWarnBtnDelete')">删除</el-button>
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
	import {
		AMapManager,
		lazyAMapApiLoaderInstance
	} from 'vue-amap'
	export default {
		components: {
			unfold,
			info
		},
		name: "list",
		mixins: [Import_export, request_mixin],
		data() {
			return {
				multipleSelection: [],
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
			downloadFile() {
				if (!this.multipleSelection.length) {
					this.$confirm('确定导出所有数据吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then((res) => {
						if(res){
							this.downloadmbs(50, 506, this.filters)
						}
					})
				}else {
					let params = {
						...this.filters,
						VehicleWarningIds: this.multipleSelection.map(item => item.VehicleWarningId)
					}
					this.downloadmbs(50, 506, params)
					this.$refs.listTable.clearSelection();
				}
			},
			getAddress(row,index) {
				let self = this;
				let geocoder = new window.AMap.Geocoder({
					radius: 1000,
					extensions: 'all'
				})
				geocoder.getAddress([row.Longitude, row.Latitude], function(status, result) {
					if (status === 'complete' && result.info === 'OK') {
						if (result && result.regeocode) {
							// address = result.regeocode.formattedAddress
							self.list[index].RiskPlace = result.regeocode.formattedAddress
							// console.log(result.regeocode.formattedAddress)
							// self.lnglatInfo.addr = result.regeocode.formattedAddress
						}
					}
				})
				this.$forceUpdate()
			},
			onChangeTime(e){
				this.filters.StartDate = e[0]
				this.filters.EndDate = e[1]
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 新增
			add() {
				this.$refs.info.show()
			},
			edit(row) {
				this.$refs.info.show(row)
			},
			remove(row) {
				this.$confirm('确认删除选中的数据吗？','提示',{type: 'warning'}).then((_) => {
					
					this.Get('/DeleteVehicleWarning', {
						vehicleWarningId: row.VehicleWarningId,
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
				}, that.filters);
				that.loading = true;
				that.Post('/GetVehicleWarnings', params).then((res) => {
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
			// this.getAddress()
		}
	}
</script>

<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>