<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input placeholder="分组名称" v-model="filters.RoleName" clearable></el-input>
				<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
			</div>
			<div class="f--c">
				<el-button type="primary" @click="add()" v-if="$_has('YHFZBtnAdd')">新增</el-button>
			</div>
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
			<el-table-column label="分组名称" align="center" width="120" prop="GroupName">
			</el-table-column>
			<el-table-column label="分组人数" align="center" width="100" prop="UserCount">
			</el-table-column>
			<el-table-column label="人员" align="center" prop="LeaderName">
				<template slot-scope="{ row }">
					<span v-if="row.Users && row.Users.length > 0">
						{{row.Users.map(item => item.UserName).join(',')}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="更新时间" align="center" width="150" prop="UpdateTImeDesc">
			</el-table-column>
			<el-table-column label="操作" align="center" width="150">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="add(row, true)" v-if="$_has('YHFZBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="remove(row)" v-if="$_has('YHFZBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog v-dialog-drag :title="title" :visible.sync="isShow" :close-on-click-modal="false" @close="close"
			top="8vh" width="60%">
			<el-scrollbar ref="scrollbar" class="scrollbar">
				<el-form ref="form" label-position="top" :model="info" :rules="rules">
					<el-form-item label="分组名称" prop="GroupName">
						<el-input v-model="info.GroupName" maxlength="10" show-word-limit></el-input>
					</el-form-item>
					<div class="f-b-c">
						<div>人员</div>
						<div class="f--c">
							<el-button type="primary" @click="addInfo()">添加</el-button>
						</div>
					</div>
					<el-table :data="info.Users" highlight-current-row :header-cell-style="$tableStyle"
						style="width: 100%">
						<el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
						<el-table-column label="姓名" align="center" prop="UserName">
						</el-table-column>
						<el-table-column label="部门" prop="DepartmentName">
							<template slot-scope="scope">
								<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
									{{ scope.row.DepartmentListJustShow.map(item => item.DepartmentName).join('、') }}
								</span>
							</template>
						</el-table-column>
						<el-table-column label="岗位" prop="PositionName">
							<template slot-scope="scope">
								<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
									{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
								</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center" width="150">
							<template slot-scope="{ $index }">
								<div class="table-operation">
									<el-button type="text" text-plain @click="removeInfo($index)">删除</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-form>
			</el-scrollbar>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close()">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="submit()" slot="reference">提交</el-button>
			</div>
		</el-dialog>
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import RULECONFIG from '@/common/ruleConfig';

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	const defaultInfo = {
		GroupName: "",
		Users: [],
		GroupMembersJson: []
	}
	export default {
		components: {},
		mixins: [request_mixins],
		data() {
			return {
				submitLoading: false,
				title: '新增',
				isShow: false,
				loading: false,
				list: [],
				info: _extends(defaultInfo),
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {},
				rules: {
					GroupName: RULECONFIG.Text('分组名称'),
				}
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
					let res = await this.Post('/GetUserGroupSets', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			add(item) {
				this.isShow = true
				if (item) {
					this.title = '编辑'
					this.info = _extends(item)
				} else {
					this.title = '新增'
					this.info = _extends(defaultInfo)
				}
			},
			addInfo() {
				this.$chooseUser({
					single: true,
					choosed: this.info.Users
				}).then(user => {
					this.info.Users = user
				})
			},
			remove(row) {
				this.$confirm('确认删除该条数据吗？').then((_) => {
					this.Get('/DeleteUserGroupSet', {
						id: row.UserGroupSetId
					}).then((res) => {
						if (res.status == 2000) {
							this.getList();
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
			removeInfo(index) {
				this.info.Users.splice(index, 1)
			},
			async submit() {
				if (!this.info.Users.length) {
					this.$message.error('请添加分组人员');
					return
				}
				this.info.GroupMembersJson = this.info.Users.map(item => item.UserId)
				this.$refs.form.validate(async valid => {
					if (!valid) return;
					this.submitLoading = true;
					let params = {
						...this.info
					}
					params.GroupMembersJson = JSON.stringify(params.GroupMembersJson)
					let res = await this.Post('/SaveUserGroupSet', params);
					if (res.status === 2000) {
						this.close();
						this.handlePageChange(1);
						this.$message.success('保存成功');
					} else {
						this.$message.error(res.message);
					}
					this.submitLoading = false;
				})
			},
			close() {
				this.isShow = false
				this.submitLoading = false;
				this.$nextTick(() => {
					this.info = _extends(defaultInfo)
				})
			}
		}
	}
</script>

<style scoped lang="less">

</style>