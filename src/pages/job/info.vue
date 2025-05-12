<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info" width="1200px"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-form :inline="true" :model="info" ref="form"  v-if="info.IsRelease != 2">
			<div class="form-3-col" >
				<el-form-item label="培训时长(分钟)">
					<el-input-number v-model="info.TrainTime" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="培训拍照">
					<el-switch v-model="info.IsTrainPhoto" active-text="开启" inactive-text="关闭" :active-value="1"
						:inactive-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="培训签字">
					<el-switch v-model="info.IsTrainSign" active-text="开启" inactive-text="关闭" :active-value="1"
						:inactive-value="0">
					</el-switch>
				</el-form-item>
				<div>
					<el-form-item>
						<el-button type="primary" icon="el-icon-plus" @click="chooseUser()"
							v-if="!disabled">添加</el-button>
					</el-form-item>
					<el-form-item>
						<el-button class="btn" type="warning" icon="el-icon-download"
							@click="downloadmbs(60, 604, { TrainTaskId: info.TrainTaskId });"
							v-if="!disabled">导出</el-button>
					</el-form-item>
				</div>
			</div>
			<div class="f-e-c">
				<!-- <div>
					<el-form-item label="培训人员">
						<select-department placeholder="所属部门" clearable v-model="info.DepartmentList"></select-department>
					</el-form-item>
				</div> -->

			</div>
		</el-form>
		<el-scrollbar class='scrollbar' ref="scrollbar">
			<el-table :data="list" :cell-style="{ textAlign: 'center' }" :header-cell-style="$tableStyle"
				style="width: 100%" border @selection-change="handleSelectionChange">
				<!-- <el-table-column type="selection" align="center" width="55">
				</el-table-column> -->
				<el-table-column label="学习人员" align="center" prop="UserName">
				</el-table-column>
				<el-table-column label="企业-部门" align="center">
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
				<el-table-column label="学习时间" align="center">
					<template slot-scope="scope">
						<!-- <div v-if="scope.row.IsLearned == 1">{{ dateFormat(scope.row.TotalDuration) }}</div> -->
						<div v-if="scope.row.IsLearned == 1">
							{{scope.row.TotalDuration? dateFormat(scope.row.TotalDuration) : scope.row.LearnTimeDesc}}
						</div>
						<div v-else>
							未学习
						</div>
					</template>
				</el-table-column>
				<el-table-column label="拍照" align="center">
					<template slot-scope="scope">
						<el-image v-if="scope.row.PhotoUrl" style="width:50px;height:50px;"
							:preview-src-list="[scope.row.PhotoUrl]" :z-index='9999' :src="scope.row.PhotoUrl"
							fit="fit">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column label="签名" align="center" prop="SignUrl">
					<template slot-scope="scope">
						<el-image v-if="scope.row.SignUrl" style="width:50px;height:50px;"
							:preview-src-list="[scope.row.SignUrl]" :z-index='9999' :src="scope.row.SignUrl"
							fit="fit">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="100" v-if="!disabled">
					<template slot-scope="{ row , $index}">
						<el-button v-if="row.IsLearned != 1" type="text" text-plain 
						@click="list.splice($index, 1)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-col :span="24" style="text-align: center">
				<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange"
					:page-size="pages.rows" :current-page="pages.page" :total="pages.total" class="customPagination">
				</el-pagination>
			</el-col>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" @click="submit()" :loading="isSaveLoading">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	import Import_export from "@/mixins/Import_export.js";
	const defaultInfo = {
		TrainTime: 0,
		IsTrainPhoto: "",
		IsTrainSign: "",
		OperationStandardId: "",
		Users: []
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		mixins: [request_mixin, Import_export],
		props: {
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				id: '',
				loading: false,
				dislogShow: false,
				isSaveLoading: false,
				info: _extends(defaultInfo),
				pages: {
					page: 1,
					rows: 10,
					total: 0
				},
				list: [],
				selectedRow: [],
				trainList: []
			}
		},
		computed: {
			title() {
				return '培训'
			}
		},
		methods: {
			handleSelectionChange(val) {
				this.selectedRow = val;
			},
			show(row) {
				this.dislogShow = true;
				this.info = _extends(row)
				this.getInfoList();
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0
				});
			},
			close() {
				this.dislogShow = false;
				this.$nextTick(() => {
					this.reset();
				})
			},
			reset() {
				this.isSaveLoading = false;
				this.list = []
				this.info = _extends(defaultInfo)
			},
			handleCurrentChange(page) {
				this.pages.page = page;
				this.getInfoList();
			},
			getInfoList() {
				this.loading = true;
				let params = {
					...this.pages,
					OperationStandardId: this.info.OperationStandardId
				};
				this.Post("/GetOperationStandardUsers", params).then(res => {
					if (res.status == 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					} else {
						this.$message(res.message);
					}
					this.loading = false;
				})
			},
			chooseUser() {
				this.$chooseUser({
					single: true,
					choosed: this.list
				}).then(data => {
					this.trainList = []
					if (this.list && this.list.length > 0) {
						let result = data.filter(item => !this.list.some(item2 => item2.UserId === item.UserId));
						this.trainList = result
						if (!result.length) {
							let result1 = this.list.filter(item => data.some(item2 => item2.UserId === item
								.UserId || item.IsLearned == 1));
							this.list = result1
						} else {
							this.list = [...(this.list || []), ...(this.trainList || [])]
						}
					} else {
						this.list = data
					}
				});
			},
			async submit() {
				if(!this.list.length > 0){
					this.$message('请添加培训人员')
					return
				}else {
					let Users = []
					this.list.map(item =>{
						if(item.IsLearned != 1){
							Users.push(item.UserId)
						}
					})
					this.info.Users = Users
				}
				console.log(this.info)
				return
				this.$refs.form.validate(async valid => {
					if (!valid) return;
					this.isSaveLoading = true;
					let res = await this.Post('/SaveOperationStandardUsers', this.info);
					if (res.status === 2000) {
						this.close();
						this.$emit('success');
						this.$message.success('保存成功');
					} else {
						this.$message.error(res.message);
					}
					this.isSaveLoading = false;
				})
			},
			dateFormat(examSecond) {
				let result = parseInt(examSecond);
				let h =
					Math.floor(result / 3600) < 10 ?
					"0" + Math.floor(result / 3600) :
					Math.floor(result / 3600);
				let m =
					Math.floor((result / 60) % 60) < 10 ?
					"0" + Math.floor((result / 60) % 60) :
					Math.floor((result / 60) % 60);
				let s =
					Math.floor(result % 60) < 10 ?
					"0" + Math.floor(result % 60) :
					Math.floor(result % 60);
				let res = "";
				if (h !== "00") res += `${h}时`;
				if (m !== "00") res += `${m}分`;
				res += `${s}秒`;
				return res;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.info {
		/deep/ .el-dialog__body {
			padding: 0 !important;
		}

		/deep/ .el-dialog {
			min-width: 1200px;
		}

		.el-form {
			border-bottom: 1px solid #eee;
			margin-bottom: 10px;
			padding: 8px 15px 0;
		}

		.content {
			padding: 0 15px 20px;
		}
	}

	.form-3-col {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}
</style>