<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation"   class="f-b-c">
			<div class="input-content">
				<el-form :model="filters" :inline="true">
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
							<el-input v-model="filters.RectificationUserName" clearable placeholder="整改人"></el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-model="filters.PotentialLevelCode" placeholder="请选择隐患级别" clearable style="min-width: 180px">
							<el-option v-for="item in LevelList" :key="item.id" :label="item.text" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
						<el-popover width="300" trigger="click">
							<div>
								<el-form-item>
									<el-select v-model="filters.PotentialSource" placeholder="请选择隐患来源" clearable style="width: 100%" >
										<el-option v-for="item in SourceCom" :key="item.id" :label="item.text" :value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-select placeholder="状态" clearable v-model="filters.SearchStatus" style="width: 100%">
										<el-option v-for="(item,index) in statusList" :key="index" :label="item.text"
											:value="item.id"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
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
			<el-table-column
			    prop="ResponsibleName"
			    label="整改人"
			    align="center"
			    header-align="center"
			>
			</el-table-column>
			<el-table-column label="隐患级别" align="center" header-align="center" width="100">
				<template slot-scope="scope">
					<el-tag size="small" effect="dark" :type="
			                scope.row.PotentialLevelCode == '058002'
			                    ? ''
			                    : 'danger'
			            ">
						{{ scope.row.PotentialLevelName }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="隐患来源" align="center" header-align="center" width="150" prop="PotentialSourceDesc">
			</el-table-column>
			<el-table-column label="隐患项目" prop="Project" width="120" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column label="隐患内容"  width="150" show-overflow-tooltip align="center">
				<template slot-scope="{ row }">
					<span v-if="row.Content" v-html="row.Content"></span>
				</template>
			</el-table-column>
			<el-table-column label="上报人" prop="SubmitUserName" align="center"> </el-table-column>
			<el-table-column label="上报时间" prop="SubmitDateDesc" align="center" width="100" show-overflow-tooltip> </el-table-column>
			<el-table-column label="限期整改日期" prop="ReformDeadlineTimeDesc" align="center" width="150" show-overflow-tooltip> </el-table-column>
			<el-table-column label="状态" align="center" header-align="center" width="80">
				<template slot-scope="scope">
					<el-tag :type="scope.row | filterscolor" effect="dark" size="small">
						{{ scope.row.StatusDesc }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" header-align="center" width="120">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="showViewDialog(scope.row.PotentialId, scope.row)"  v-if="$_has('YHZLBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->
		<!--弹层开始-->
		<viewInfo ref="info"></viewInfo>
		<!--弹层结束-->
	</page-layout>
</template>

<script>
	import API_POTENTIAL from '@/api/api_potential'
	import viewInfo from "@/pages/Potential/info";
	import request_mixin from "@/mixins/request-mixin.js";
	import util from '@/common/util';
	export default {
		name: "list",
		components: {
			viewInfo,
		},

		mixins: [request_mixin],
		data() {
			return {
				row: [],
				SourceCom: [],
				NatureList: [],
				filters: {},
				list: [],
				pages: {
					total: 0,
					page: 1,
					rows: 10,
				},
				loading: false,
				statusList: [],
				LevelList: []
			};
		},
		methods: {
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			//获取列表数据
			getList() {
				let that = this;
				let params = Object.assign({
					page: that.pages.page,
					rows: that.pages.rows
				}, that.filters);

				that.loading = true;
				this.Post('/GetTaskPotentials', params).then(res => {
					if (res.status == 2000) {
						that.list = res.data.list;
						that.pages.total = res.data.count;
					} else {
						that.$message.error(err.toString());
					}
					that.loading = false;
				}).finally(() => {
					this.loading = false;
				})

			},
			//检查执行
			showViewDialog(PotentialId, row) {
				this.row = []
				this.row = row
				this.$refs.info.show(row)
			},

		},
		mounted() {
			let url = util.getLoginUrl() == '/rb-login' ? 'GetRoadPotentialSourceCom' : 'GetPotentialSourceCom'
			//获取隐患排查性质
			this.Get(url).then((res) => {
				if (res.status === 2000) {
					this.SourceCom = res.data
				}
			})
			this.Get('/GetPotentialStatusCom').then((res) => {
				if (res.status === 2000) {
					this.statusList = res.data
				}
			})
			this.Get('/GetPotentialLevelCom').then((res) => {
				if (res.status === 2000) {
					this.LevelList = res.data
				}
			})
			this.handleCurrentChange(1);
		}

	}
</script>

<style scoped lang="less">
	/deep/ .el-scrollbar__wrap {
		overflow-x: hidden;
	}

	.box-card {
		margin-top: 20px;
	}

	/deep/ .el-button+.el-button {
		margin-left: 0px;
	}
	.form-col div {
		margin-bottom: 15px !important;
	}
	/deep/.input-content .el-form-item {
		margin-bottom: 0 !important;
	}
	.detail-box {
		width: 100%;
		padding-bottom: 20px;
		.num-box {
			width: 100%;
			text-align: right;
			font-size: 16px;
			color: #000;
			font-weight: bold;
			margin-bottom: 10px;

			span:nth-child(2) {
				color: #FF4040;
			}
		}
	}
</style>