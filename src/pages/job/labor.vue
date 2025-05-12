<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-e-c">
			<div>
				<el-button type="primary" icon="el-icon-plus" @click="add()" v-if="$_has('LBYPKBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="劳保用品" align="center" prop="LabourName">
			</el-table-column>
			<el-table-column label="图标" align="center" prop="Icon">
				<template slot-scope="scope">
					<el-image v-if="scope.row.Icon" style="width:50px;height:50px;border-radius: 50%;"
						:preview-src-list="[scope.row.Icon]" :z-index='9999' :src="scope.row.Icon" fit="fit">
					</el-image>
				</template>
			</el-table-column>
			<el-table-column label="更新人" align="center" prop="UpdateByName">
			</el-table-column>
			<el-table-column label="更新时间" align="center" prop="UpdateTimeDesc">
			</el-table-column>
			<el-table-column label="操作" align="center" width="240">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" v-if="$_has('LBYPKBtnEdit')" @click="edit(scope.row)">编辑</el-button>
						<el-button type="text" @click="DeleteData(scope.row)" v-if="$_has('LBYPKBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog v-dialog-drag :title="title" :visible.sync="isShow" @close="close" width="30%"
			:append-to-body="true" top="6vh">
			<el-scrollbar class='scrollbar' ref="scrollbar">
				<el-form :rules="rules" ref="form" :model="info">
					<div class="form-3-col">
						<el-form-item label="劳保用品名称" prop="LabourName">
							<el-input v-model="info.LabourName" placeholder="请输入" maxlength="40"
								show-word-limit></el-input>
						</el-form-item>
						<div class="portrait">
							<el-form-item label="图标" prop="Icon">
								<el-upload :action="url()" :accept="upload.image_suffix" :show-file-list="false"
									:on-success="uploadPortrait">
									<img v-if="info.Icon" :src="info.Icon" style="width: 100%; height: 160px" />
									<div style="
							            width: 150px;
							            height: 160px;
							            display: flex;
							            align-items: center;
							            justify-content: center;
							        " v-else>
										<div>
											<i class="
							                    el-icon-plus
							                    avatar-uploader-icon
							                " style="font-size: 40px;margin-bottom: 10px;"></i>
											<div>上传图标</div>
										</div>
									</div>
								</el-upload>
							</el-form-item>
						</div>
					</div>
				</el-form>
			</el-scrollbar>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close()">取消</el-button>
				<el-button type="primary" @click="submit()" :loading="isSaveLoading">保存</el-button>
			</div>
		</el-dialog>
		<!--列表结束-->
	</page-layout>
</template>



<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import RULECONFIG from "@/common/ruleConfig";
	const defaultInfo = {
		Icon: '',
		LabourName: ''
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		mixins: [request_mixin, upload_mixin],
		data() {
			return {
				isSaveLoading: false,
				isShow: false,
				title: '新增',
				//数据列表
				list: [],
				//分页相关数据
				pages: {
					total: 0,
					page: 1,
					rows: 10,
				},
				info: _extends(defaultInfo),
				//列表页面是否加载变量
				loading: false,
				rules: {
					Icon: RULECONFIG.Select("图标"),
					LabourName: RULECONFIG.Text("劳保用品名称"),
				},
			};
		},
		methods: {
			close() {
				this.isShow = false
			},
			uploadPortrait(res, file) {
				this.$set(this.info, 'Icon', res.files[0].url);
			},
			add() {
				this.isShow = true
				this.title = '新增'
				this.info = _extends(defaultInfo)
			},
			edit(row){
				this.isShow = true
				this.title = '编辑'
				this.info = _extends(row)
			},
			submit() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.isSaveLoading = true;
						this.Post("/SaveLabour", this.info).then((res) => {
							if (res.status == 2000) {
								this.getList();
								this.$message({
									message: "保存成功",
									type: "success",
								});
								this.isShow = false
							} else {
								this.$message.error(res.message);
							}
						});
					}
					this.isSaveLoading = false;
				});
			},
			//删除列表数据
			DeleteData(row) {
				this.$confirm("确认删除该条数据吗？").then((_) => {
					this.Get("/DeleteLabour", {
						labourId: row.LabourId
					}).then((res) => {
						if (res.status == 2000) {
							this.getList();
							this.$message({
								message: "删除成功！",
								type: "success",
							});
						} else {
							this.$message.error(res.message);
						}
					});
				});
			},
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
					rows: that.pages.rows,
				}, );

				that.loading = true;
				this.Post("/GetLabours", params)
					.then((res) => {
						if (res.status == 2000) {
							this.list = res.data.list;
							this.pages.total = res.data.count;
						}
						that.loading = false;
					})
					.finally(() => {
						this.loading = false;
					});
			},
		},
		mounted() {
			this.handleCurrentChange(1);
		},
	};
</script>

<style scoped lang="less">
	.portrait {
		flex: 1;
		height: 160px;

	}

	.portrait>div {
		width: 150px;
		height: 100%;
	}

	.flex-box {
		width: 100%;
		display: flex;
	}

	.portrait /deep/ .el-form-item__content {
		line-height: 0 !important;
	}

	.portrait /deep/ .el-upload {
		width: 100%;
		height: 100%;
		border: 1px dashed #c0ccda;
		background: #fbfdff;
		border-radius: 4px;
		color: #c0ccda;
		overflow: hidden;
	}
</style>