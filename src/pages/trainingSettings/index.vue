<template>
	<page-layout class="page" :loading="loading" element-loading-text="拼命加载中">
		<div slot="operation" class="f-e" v-if="$_has('PXSZBtnSave')">
			<div class="input-content f--c">
				<el-button type="primary" @click='Submit()'>保存设置</el-button>
			</div>
		</div>
		<!-- 表单开始 -->
		<el-form class="form" ref="form" :model="form" :rules="rules" v-if="$_has('PXSZBtnSave')">
			<div class="title spacing-bottom">培训设置</div>
			<div class="z-table-box">
				<table>
					<thead>
						<tr>
							<th style="width: 60px" class=""><span>序号</span></th>
							<th style="width: 70%;"><span>名称</span></th>
							<th style="200px"><span>操作</span></th>
						</tr>
					</thead>
					<tbody>
						<tr class="tr-border">
							<td>1</td>
							<td>抓拍照片数</td>
							<td>
								<el-form-item prop="CatchPicCount">
									<el-input-number v-model="form.CatchPicCount" size="small" :min="0"
										style="width: 50%;" :max="10000"></el-input-number>
								</el-form-item>
							</td>
						</tr>
						<tr class="tr-border">
							<td>2</td>
							<td>培训完签字</td>
							<td>
								<el-form-item prop="IsAfterTrainSign">
									<el-switch v-model="form.IsAfterTrainSign" active-text="开启" inactive-text="关闭"
										:active-value="1" :inactive-value="0">
									</el-switch>
								</el-form-item>
							</td>
						</tr>
						<tr class="tr-border">
							<td>3</td>
							<td>考试完签字</td>
							<td>
								<el-form-item prop="IsAfterExaminationSign">
									<el-switch v-model="form.IsAfterExaminationSign" active-text="开启" inactive-text="关闭"
										:active-value="1" :inactive-value="0">
									</el-switch>
								</el-form-item>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</el-form>
		<div v-else class="no-data-box">
			<no-data text="您的账号没有权限,请联系管理员添加."></no-data>
		</div>
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		name: "trainingSettings",
		mixins: [request_mixin],
		data() {
			return {
				input: "",
				form: {
					CatchPicCount: "",
					IsAfterTrainSign: "",
					IsAfterExaminationSign: "",
				},
				loading: false,

				rules: {},
			};
		},
		methods: {
			GetTrainTasksConfig() {
				this.loading = true;
				this.Get("/GetTrainTasksConfig").then((res) => {
					if (res.status == 2000) {
						this.form = res.data
					}
					this.loading = false;
				});
			},
			Submit() {
				var that = this;
				that.$refs.form.validate((valid) => {
					if (valid) {
						this.loading = true;
						that.Post("/SaveTrainTaskConfig", this.form).then((result) => {
							if (!result || !result.status) {
								this.$message({
									message: "请求异常",
									type: "error",
								});
								return;
							}
							if (result.status == 2000) {
								this.$message({
									message: "保存成功",
									type: "success",
								});
							} else {
								this.$message({
									message: result.message,
									type: "error",
								});
							}
							this.loading = false;
						});
					}
				});
			},
		},
		created() {
			this.GetTrainTasksConfig();
		}
	};
</script>
<style lang="scss" scoped>
	.no-data-box {
		box-sizing: border-box;
		padding-top: 200px;
	}

	.title {
		display: flex;
		align-items: center;
		font-size: 16px;
		line-height: 22px;
		font-weight: 600;

		&::before {
			content: '';
			border-radius: 2px;
			margin-right: 8px;
			width: 5px;
			height: 16px;
			background: $--color-primary;
		}
	}

	.spacing-bottom {
		margin-bottom: 20px;
	}

	/deep/.form .el-form-item__label {
		font-size: 16px !important;
	}

	/deep/.z-table-box .el-form-item {
		margin: 5px !important;
	}
</style>