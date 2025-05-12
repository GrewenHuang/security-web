<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags
							v-model="filters.EnterpriseId" @clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<!-- <el-form-item>
						<select-position v-model="filters.PositionList" :multiple="true"
							placeholder="岗位"></select-position>
					</el-form-item> -->
					<el-form-item>
						<el-input placeholder="姓名" clearable v-model="filters.UserName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="手机号" clearable v-model="filters.Tel"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="batchExamine(1)"  v-if="$_has('BMSHTabPLTG')">批量通过</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="danger" @click="batchExamine(-1)"  v-if="$_has('BMSHTabPLBH')">批量驳回</el-button>
					</el-form-item>
					<!-- <select-department placeholder="部门" clearable v-model="filters.DepartmentList" :enterpriseId="filters.EnterpriseIds" :disabled="!filters.EnterpriseIds ? true : false"></select-department> -->
					<!-- <el-select placeholder="审核状态" v-model="filters.ApproveStatus" @change="handlePageChange(1)">
				    <el-option label="待审核" value="0"></el-option>
				    <el-option label="已审核" value="1"></el-option>
				</el-select> -->
				</el-form>
			</div>
			<!-- <div class="f--c">
                <el-switch
                    v-model="examineStatus"
                    active-text="开启审核"
                    inactive-text="关闭审核"
                    active-value="1"
                    inactive-value="0"
                    @change="changeExamineStatus"
                ></el-switch>
            </div> -->
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%"
			@selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<!-- <el-table-column label="照片" align="center" prop="Photo">
				<template slot-scope="scope">
					<el-image v-if="scope.row.Photo" style="width:50px;height:50px;border-radius: 50%;"
						:preview-src-list="[scope.row.Photo]" :z-index='9999' :src="scope.row.Photo" fit="fit">
					</el-image>
				</template>
			</el-table-column> -->
			<el-table-column label="姓名" align="center" prop="UserName">
			</el-table-column>
			<el-table-column label="手机号" align="center" width="120" prop="Tel">
			</el-table-column>
			<el-table-column label="性别" align="center" width="100" prop="GenderDesc">
			</el-table-column>
			<el-table-column label="年龄" align="center" width="100" prop="BirthdayDESC">
			</el-table-column>
			<!-- <el-table-column label="岗位" align="center" show-overflow-tooltip>
			    <template slot-scope="scope">
			        {{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
			    </template>
			</el-table-column> -->
			<el-table-column label="安全级别" align="center" prop="SecurityLevelDesc">
			</el-table-column>

			<el-table-column label="申请企业" align="center" prop="EnterpriseName">
			</el-table-column>
			<el-table-column label="申请部门" align="center" show-overflow-tooltip prop="DepartmentName">
				<!-- <template slot-scope="scope">
					{{ scope.row.DepartmentList.map(item => item.DepartmentName).join('、') }}
				</template> -->
			</el-table-column>
			<el-table-column label="入岗日期" align="center" width="120" prop="EntryDateDesc">
			</el-table-column>
			<el-table-column label="操作" align="center" width="120">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="save(row)" v-if="$_has('BMSHTabTG')">通过</el-button>
						<!-- <el-button type="text" @click="add(row)">{{ row.UDApproveStatus == 0 ? '审核' : '查看'}}</el-button> -->
						<el-button type="text" size="mini" @click="reject(row)" v-if="$_has('BMSHTabBH')">驳回</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<userExamineInfo ref="info" @load="handlePageChange(1)" />
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import userExamineInfo from './Users/userExamineInfo';
	export default {
		name: 'task-distribution',
		components: {
			userExamineInfo
		},
		mixins: [request_mixins],
		data() {
			return {
				loading: false,
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {
					ApproveStatus: '0',
					EnterpriseId: '',
					DepartmentIds: [],
					Tel: '',
					LoginName: '',
					PositionList: []
				},
				examineStatus: '1',
				multipleSelection: []
			}
		},
		created() {
			this.handlePageChange(1);
		},
		methods: {
			handlePageChange(val) {
				this.pages.page = val;
				this.getList();
			},
			async getList() {
				let params = {
					...this.pages,
					...this.filters,
				}
				this.loading = true;
				try {
					let res = await this.Post('/GetEnterpriseUsersByDepartmentApprove', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			// add(item) {
			// 	this.$refs.info.show(item)
			// },
			async save(row) {
				this.$confirm('此操作将通过当前申请, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					try {
						let res = await this.Post('/BatchDepartmentApproved', {
							ApproveStatus: 1,
							Ids: [row.UserDepartmentId]
						});
						if (res.status == 2000) {
							this.$message.success('审批成功');
							this.handlePageChange(1);
						} else {
							this.$message.error(res.message)
						}
					} catch (error) {
			
					}
				});
			
			},
			async reject(row) {
				this.$confirm('此操作将驳回当前申请, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					try {
						let res = await this.Post('/BatchDepartmentApproved', {
							ApproveStatus: -1,
							Ids: [row.UserDepartmentId]
						});
						if (res.status == 2000) {
							this.$message.success('审批成功');
							this.handlePageChange(1);
						} else {
							this.$message.error(res.message)
						}
					} catch (error) {

					}
				});

			},
			async batchExamine(ApproveStatus, row) {
				if (!this.multipleSelection.length) {
					return this.$message.error('请在列表中选择需要审核用户');
				}
				let res = await this.Post('/BatchDepartmentApproved', {
					ApproveStatus: ApproveStatus,
					Ids: this.multipleSelection.map(item => item.UserDepartmentId)
				});
				if (res.status == 2000) {
					this.$message.success('审批成功');
					this.handlePageChange(1);
				} else {
					this.$message.error(res.message)
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			changeExamineStatus(val, ...arg) {
				this.$confirm(val == 0 ? '关闭审核后，用户注册直接通过审核，确认关闭吗？' : '开启审核后，需要审核后，注册用户才能使用系统，确认开启吗？', '提示', {

				}).then(async _ => {
					let res = await this.Get('/UpdateApproveStatus?approveStatus=' + val);
					if (res.status == 2000) {
						this.$message.success(`已${val == 1? '开启' : '关闭'}`);
					} else {
						this.$message.error(res.message);
					}
				}).catch(err => {
					this.examineStatus = +!+val + '';
				})
			}
		}
	}
</script>

<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>