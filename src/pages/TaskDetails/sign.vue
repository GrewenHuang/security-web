<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags v-model="filters.EnterpriseId"
							@clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<el-form-item>
						<select-position v-model="filters.PositionId" :multiple="false" clearable
							placeholder="岗位"></select-position>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="签字人" clearable v-model="filters.UserName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="签字任务名称" clearable v-model="filters.FileName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-select placeholder="完成情况" clearable v-model="filters.Status">
							<el-option label="未签订" :value="1"></el-option>
							<el-option label="已签订" :value="2"></el-option>
							<el-option label="已打回" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- 条件栏 结束 -->
		<!--列表 开始-->
		<el-table :data="pages.list" highlight-current-row :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="企业/部门" align="center" show-overflow-tooltip width="200">
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' + item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="UserName" label="签字人" align="center" width="110">
			</el-table-column>
			<el-table-column prop="FileName" label="签字任务名称" align="center">
			</el-table-column>
			<el-table-column prop="CertificateName" label="关联证照" align="center" width="110" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="签订层级" align="center" width="100">
				<template slot-scope="scope">
						{{ scope.row.SignType == 1? '单层级' : '多层级'}}
				</template>
			</el-table-column>
			<el-table-column prop="FileSignTempName" label="签字文件模板" align="center" width="110" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<a class="target" :href="ViewUrl(row.FileSignTempUrl)" target="_blank">
						<el-button type="text">{{row.FileSignTempName}}</el-button>
					</a>
				</template>
			</el-table-column>
			<el-table-column prop="FileSignDetailUrl" label="签字文件" align="center">
				<template slot-scope="scope">
					<el-image v-if="scope.row.FileSignDetailUrl" style="width:50px;height:50px;"
						:preview-src-list="[scope.row.FileSignDetailUrl]" :z-index='9999'
						:src="scope.row.FileSignDetailUrl" fit="fit">
					</el-image>
				</template>
			</el-table-column>
			<el-table-column label="完成情况" align="center" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<whether :yes="scope.row.Status  == 2"
						:text="scope.row.Status == 1 ? '未签订' : scope.row.Status == 2?'已签订' : scope.row.Status == 3?'已打回' : ''" />
				</template>
			</el-table-column>
			<!-- <el-table-column label="操作" align="center" header-align="center">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="dialogSignDetailOpen(scope.row)"
							v-if="$_has('ZXQZBtnXQ')">签字详情</el-button>
					</div>
				</template>
			</el-table-column> -->
		</el-table>
		<!--列表 结束-->
		<!--签字详情弹层 开始-->
		<el-dialog v-dialog-drag :title="signDetail.dialogSignDetailTitle"
			:visible.sync="signDetail.dialogSignDetailShow" :close-on-click-modal="false"
			@close="signDetail.dialogSignDetailShow = false" top="8vh" width="60%">
			<el-scrollbar class="scrollbar">
				<!-- 条件栏 开始 -->
				<el-card shadow="hover" class="toolbar">
					<el-form :inline="true">
						<el-form-item>
							<el-button type="warning" plain size="small" icon="el-icon-download" @click="
                                    downloadmbs(120, 1201, {
                                        FileSignId: signDetail.FileSignId,
                                    });
                                    signDetail.dialogSignDetailShow = false;
                                ">导出全部</el-button>
						</el-form-item>
					</el-form>
				</el-card>
				<!-- 条件栏 结束 -->
				<!--列表 开始-->
				<!-- <el-table :data="signDetail.pages.list" highlight-current-row v-loading="signDetail.loading"
					:header-cell-style="$tableStyle" border>
					<el-table-column label="序号" align="center" type="index" width="60">
					</el-table-column>
					<el-table-column prop="UserName" label="签字人" align="center" width="160">
					</el-table-column>
					<el-table-column prop="FileSignDetailUrl" label="签字后文件" align="center">
						<template slot-scope="scope">
							<el-image style="
                                    width: 50px;
                                    height: 50px;
                                    margin-right: 5px;
                                " v-for="(item, i) in scope.row
                                    .FileSignDetailUrlList" :key="i" :preview-src-list="[item]" :src="item"
								fit="fit"></el-image>
						</template>
					</el-table-column>
					<el-table-column prop="UpdateTimeDesc" label="签字时间" align="center" width="160">
					</el-table-column>
				</el-table>
				<el-pagination layout="total, prev, pager, next" background @current-change="handleDetailCurrentChange"
					:page-size="signDetail.pages.rows" :total="signDetail.pages.total" class="customPagination">
				</el-pagination> -->
				<!-- 分页 结束 -->
			</el-scrollbar>
		</el-dialog>
		<!--签字详情弹层 结束-->
	</page-layout>
</template>
<script>
	import upload_mixin from "@/mixins/upload-mixin.js";
	import request_mixin from "@/mixins/request-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import RULECONFIG from "@/common/ruleConfig";
	export default {
		mixins: [upload_mixin, request_mixin, Import_export],
		data() {
			return {
				filters: {},
				byUserType: [],
				list: [],
				loading: false, //页面加载遮罩层显示状态
				pages: {
					list: [],
					total: 0,
					page: 1,
					rows: 10
				}, //分页
				signDetail: {
					FileSignId: 0, //查看指定模板
					dialogSignDetailShow: false, //弹窗显示状态
					dialogSignDetailTitle: "", //弹窗标题
					pages: {
						list: [],
						total: 0,
						page: 1,
						rows: 10
					}, //分页
					loading: false, //页面加载遮罩层显示状态
				},
			};
		},
		methods: {
			ViewUrl(url) {
				return url
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			//分页事件
			handleDetailCurrentChange(val) {
				this.signDetail.pages.page = val;
				this.GetSignDetailList();
			},
			scrollToTop() {
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				});
			},
			//加载列表数据
			GetList() {
				this.Post("/GetTaskFileSignDetails", {
					page: this.pages.page,
					rows: this.pages.rows,
					...this.filters
				}).then((res) => {
					if (res.status == 2000) {
						this.pages.list = res.data.list;
						this.pages.total = res.data.count;
					}
				});
			},
			//加载列表数据
			GetSignDetailList() {
				this.signDetail.loading = true;
				this.Post("/GetFileSignDetails", {
					FileSignId: this.signDetail.FileSignId,
					page: this.signDetail.pages.page,
					rows: this.signDetail.pages.rows,
				}).then((res) => {
					if (res.status == 2000) {
						this.signDetail.pages.list = res.data.list;
						this.signDetail.pages.total = res.data.count;
					}
				});
				this.signDetail.loading = false;
			},
			//打开签字详情弹窗
			dialogSignDetailOpen(row) {
				this.signDetail.dialogSignDetailTitle = "签字详情";
				this.signDetail.dialogSignDetailShow = true;
				this.signDetail.FileSignId = row.FileSignId;
				this.GetSignDetailList();
			},
			//关闭签字详情弹窗
			dialogSignDetailClose() {
				this.signDetail.dialogSignDetailShow = false;
			},
		},
		mounted() {
			this.handleCurrentChange(1);
			this.Get('/GetCertificateListByUserType').then((res) => {
				//部门
				if (res.status == 2000) {
					this.byUserType = res.data
				}
			})
		},
	};
</script>
<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>