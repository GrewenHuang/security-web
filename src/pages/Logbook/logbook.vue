<template>
	<page-layout :loading="loading" @scroll-height="getScrollHeight">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filtersDay">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags
							v-model="filtersDay.EnterpriseId" @clear="filtersDay.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filtersDay.DepartmentId"
							:enterpriseId="filtersDay.EnterpriseId"
							:disabled="!filtersDay.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="filtersDay.SearchDate" type="date" placeholder="查询日期"
							value-format="yyyy-MM-dd" :clearable="false">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filtersDay.VehicleNo" placeholder="车牌号" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-model="filtersDay.Status" placeholder="状态" clearable>
							<el-option v-for="(item,index) in StatusList" :key="index" :label="item.text"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearchDay">查询</el-button>
						
					</el-form-item>
				</el-form>
			</div>
			<div class="f-c-c">
				<el-button-group>
					<el-button @click="downloadmbs(70,703,filtersDay)" v-if="$_has('CARLogDayBtnExport')">导出</el-button>
				</el-button-group>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="listDay" :cell-style="{ textAlign: 'center' }" ref="listTable"
			:header-cell-style="{ ...$tableStyle, textAlign: 'center' }" :height="contentHeight"
			@selection-change="handleSelectionChange">
			<!-- <el-table-column type="selection" width="55" align="center" v-if="$_has('CARLogDayBtnExport')"></el-table-column> -->
			<el-table-column label="序号" type="index" width="80">
			</el-table-column>
			<el-table-column prop="LogDateDesc" align="center" label="行车日期">
			</el-table-column>
			<el-table-column prop="DepartmentName" align="center" label="所属部门">
			</el-table-column>
			<el-table-column prop="LicensePlateNumber" align="center" label="车牌号">
			</el-table-column>
			<el-table-column width="120" label="车辆负责人">
				<template slot-scope="{ row }">
					<div>{{ row.DriverName }}</div>
				</template>
			</el-table-column>
			<el-table-column width="120" label="驾驶员">
				<template slot-scope="{ row }">
					<div>{{ row.DriverName }}</div>
				</template>
			</el-table-column>

			<el-table-column label="状态" align="center" header-align="center">
				<template slot-scope="{ row }">
					<whether :yes="row.Status == 3" :warning="row.Status == 4" :text="getStatus(row)" />
				</template>
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="showViewDialog(scope.$index, scope.row)"
							v-if="scope.row.LogbookId != 0 && $_has('CARLogDayBtnLook')">查看</el-button>
						<!-- 需要前端实现一车一档 -->
						<!-- <el-button type="text" @click="downloadmbs(20, 202, scope.row.LogbookId)"
							v-if="scope.row.LogbookId != 0 && $_has('CARLogDayBtnDown')">下载</el-button> -->
					</div>
				</template>
			</el-table-column>
		</el-table>

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" width="1000px" top="8vh">
			<logInfo ref="dialogView" :hidden="!addShow"></logInfo>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addShow = false">关闭</el-button>
			</span>
		</el-dialog>
		<!--弹层结束-->
	</page-layout>
</template>

<script>
	import logInfo from "./logInfo";
	import request_mixin from "@/mixins/request-mixin.js";
	import Download from "@/mixins/Download.js";
	import Import_export from "@/mixins/Import_export.js";
	export default {
		name: "logbook",
		components: {
			logInfo,
		},
		data() {
			return {
				//列表行的ID，编辑和删除时需要使用
				id: "",
				filtersDay: {},
				listDay: [],
				StatusList: [],
				//弹层数据
				addShow: false,
				dialogTitle: "",
				//列表页面是否加载变量
				loading: false,
				contentHeight: 200,
				multipleSelection: []
			};
		},
		mixins: [request_mixin, Download, Import_export],
		methods: {
			handleSelectionChange(val) {
				// 选择列表
				this.multipleSelection = val;
			},
			getScrollHeight(height) {
				this.contentHeight = height;
			},
			download(url, filename) {
				if (!!this.multipleSelection.length) {
					this.downloadmbs(70, 703, this.multipleSelection.map(item => item.VehicleUserId))
					this.$refs.listTable.clearSelection();
				} else {
					this.$message.warning('请选择行车日志');
				}
				// const loading = this.$loading({
				// 	lock: true,
				// 	text: "下载中,请稍等...",
				// 	spinner: "el-icon-loading",
				// 	background: "rgba(0, 0, 0, 0.7)",
				// });
				// this.Post("/" + url, {}, "blob").then((res) => {
				// 	loading.close();
				// 	this.readFileDownload(res, filename);
				// });
			},
			handleSearchDay() {
				this.getListDay();
			},
			getListDay() {
				this.loading = true;
				this.Post("/GetLogbookDay", this.filtersDay).then((result) => {
					if (result.status == 2000 && result.data) {
						this.listDay = result.data;
					}
				}).finally(() => {
					this.loading = false;
				});
			},
			//弹层的取消
			dialogClear() {
				let than = this;
				than.addShow = false;
			},
			//检查执行
			showViewDialog(index, row) {
				let than = this;
				than.dialogTitle = "查看";
				than.addShow = true;
				than.id = row.LogbookId;
				setTimeout(() => {
					than.$refs.dialogView.getLogbookById(than.id);
				}, 500);
			},
			getStatus(item) {
				let statusObj = {
					1: '未做',
					2: '未完成',
					3: '完成',
					4: '补做'
				}
				return statusObj[item.Status];
			},
			getStatusList() {
				this.Get("/GetLogbookStatusCom").then((res) => {
					if (res.status == 2000) {
						this.StatusList = res.data
					}
				});
			}
		},
		mounted() {
			this.filtersDay.SearchDate = new Date();
			this.handleSearchDay();
			this.getStatusList()
		},
	};
</script>

<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>