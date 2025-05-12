<template>
	<el-dialog v-dialog-drag title="模板设置" :visible.sync="dislogShow" @close="close()" class="info" width="1000px"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar ref="scrollbar" class="scrollbar">
			<el-form ref="formRef" class="form-data" :model="data" :rules="rules" :disabled="data.Status != 1">
				<el-form-item label="行车日志模板名称" prop="LogbookConfigName" class="card">
					<el-input v-model="data.LogbookConfigName"></el-input>
				</el-form-item>
				<div class="card">
					<div class="title">
						<div class="f-b-c f1">
							<span>检查设置</span>
						</div>
					</div>
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
									<td colspan="3" class="set-box">
										整车检查配置<span>(温馨提示：只有开启整车检查照片/视频强制上传后,才能选择是否强制上传)</span>
									</td>
								</tr>
								<tr class="tr-border">
									<td>1</td>
									<td>押运员</td>
									<td>
										<el-form-item>
											<el-switch v-model="data.SetUploadFileModel.IsSuperCargo" active-text="开启"
												inactive-text="关闭" :active-value="1" :inactive-value="0">
											</el-switch>
										</el-form-item>
									</td>
								</tr>
								<tr class="tr-border">
									<td>2</td>
									<td>整车检查照片强制上传</td>
									<td>
										<el-form-item>
											<el-switch v-model="data.SetUploadFileModel.IsPicUpload" active-text="开启"
												inactive-text="关闭" :active-value="1" :inactive-value="0">
											</el-switch>
										</el-form-item>
									</td>
								</tr>
								<tr class="tr-border">
									<td>3</td>
									<td>整车检查照片强制现场上传</td>
									<td>
										<el-form-item>
											<el-switch v-model="data.SetUploadFileModel.IsPicMustUpload"
												active-text="开启" inactive-text="关闭" :active-value="1"
												:inactive-value="0" @change="onChange('image')">
											</el-switch>
										</el-form-item>
									</td>
								</tr>
								<tr class="tr-border">
									<td>4</td>
									<td>整车检查视频强制上传</td>
									<td>
										<el-form-item>
											<el-switch v-model="data.SetUploadFileModel.IsVideoUpload" active-text="开启"
												inactive-text="关闭" :active-value="1" :inactive-value="0">
											</el-switch>
										</el-form-item>
									</td>
								</tr>
								<tr class="tr-border">
									<td>5</td>
									<td>整车检查视频强制现场上传</td>
									<td>
										<el-form-item>
											<el-switch v-model="data.SetUploadFileModel.IsVideoMustUpload"
												active-text="开启" inactive-text="关闭" :active-value="1"
												:inactive-value="0" @change="onChange('video')">
											</el-switch>
										</el-form-item>
									</td>
								</tr>
								<tr class="tr-border">
									<td colspan="3" class="set-box">签字配置<span>(温馨提示：只有开启押运员配置以后,才能开启押运员签字)</span></td>
								</tr>
								<tr class="tr-border">
									<td>6</td>
									<td>驾驶员签字</td>
									<td>
										<el-form-item>
											<el-switch v-model="data.SetSignModel.IsDriverSign" active-text="开启" inactive-text="关闭"
												:active-value="1" :inactive-value="0">
											</el-switch>
										</el-form-item>
									</td>
								</tr>
								<tr class="tr-border">
									<td>7</td>
									<td>押运员签字</td>
									<td>
										<el-form-item>
											<el-switch v-model="data.SetSignModel.IsSuperCargoSign" active-text="开启" inactive-text="关闭"
												:active-value="1" :inactive-value="0" @change="onChange('yyy')">
											</el-switch>
										</el-form-item>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="gutter"></div>
				<div v-for="(item, index) in list" :key="index">
					<el-form-item class="card" :prop="item.key">
						<div class="title">
							<div class="f-b-c f1" v-if="data.Status == 1">
								<span>{{ item.title }}</span>
								<div class="clear" @click="data[item.key] = [];"
									v-if="edit && data[item.key] && !!data[item.key].length"><i
										class="el-icon-brush"></i>清空</div>
							</div>
							<div v-else>
								<span>{{ item.title }}</span>
							</div>
						</div>
						<div class="setting-item">
							<div class="custom-input" v-for="(cItem, cIndex) in (data[item.key] || [])" :key="cIndex">
								<el-input type="text" placeholder="请输入" v-model="cItem.ItemName"
									:readonly="data.Status == 2"></el-input>
								<i class="remove el-icon-delete-solid" @click="data[item.key].splice(cIndex, 1)"
									v-if="edit && data.Status == 1"></i>
							</div>
							<div class="add-btn" @click="add(item.key)" v-if="edit && data.Status == 1">+ 添加检查项</div>
						</div>

					</el-form-item>
				</div>
			</el-form>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" @click="save()" :loading="submitLoading">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	let josnFields = ['PreTripInspectionItems', 'InTrainInspectionItems', 'PostTripInspectionItems', 'SetSign',
		'SetUploadFile'
	];
	import request_mixins from '@/mixins/request-mixin';
	export default {
		mixins: [request_mixins],
		props: {
			edit: {
				type: Boolean,
				default: true
			}
		},
		data() {
			const validator = (rule, value, callback) => {
				if (!value.length) {
					let message = rule.message1;
					setTimeout(() => {
						this.$message.warning(message)
					}, 100 * rule.index);
					callback(new Error(message))
				} else if (!!value.length) {
					for (let i = 0; i < value.length; i++) {
						let item = value[i];
						if (!item.ItemName) {
							let message1 = rule.message1.replace('请添加', '') + '中还有检查项未输入内容';
							setTimeout(() => {
								this.$message.warning(message1)
							}, 100 * rule.index);
							callback(new Error(message1))
							break;
						}
					}
					callback();
				} else {
					callback();
				}
			}
			return {
				loading: false,
				dislogShow: false,
				submitLoading: false,
				data: {
					LogbookConfigName: "",
					PreTripInspectionItemList: [],
					InTrainInspectionItemList: [],
					PostTripInspectionItemList: [],
					SetSignModel: {
						IsDriverSign: 0,
						IsSuperCargoSign: 0
					},
					SetUploadFileModel: {
						IsSuperCargo: 0,
						IsVideoUpload: 0,
						IsPicUpload: 0,
						IsVideoMustUpload: 0,
						IsPicMustUpload: 0
					},
					Status: 1,
				},
				list: [{
						title: '出车前检查项',
						key: 'PreTripInspectionItemList',
					},
					{
						title: '行车中检查项',
						key: 'InTrainInspectionItemList',
					},
					{
						title: '收车后检查项',
						key: 'PostTripInspectionItemList',
					},
				],
				rules: {
					LogbookConfigName: [{
						required: true,
						message: "请输入行车日志模板名称",
						trigger: "blur",
					}, ],
					PreTripInspectionItemList: [{
						type: 'array',
						message1: '请添加出车前检查项',
						validator,
						index: 0,
						trigger: ['change', 'blur']
					}],
					InTrainInspectionItemList: [{
						type: 'array',
						message1: '请添加行车中检查项',
						validator,
						index: 1,
						trigger: ['change', 'blur']
					}],
					PostTripInspectionItemList: [{
						type: 'array',
						message1: '请添加收车后检查项',
						validator,
						index: 2,
						trigger: ['change', 'blur']
					}],
				}
			}
		},
		methods: {
			add(key) {
				this.data[key].push({
					ItemName: ''
				});
			},
			close() {
				this.dislogShow = false
			},
			onChange(type){
				if(type == 'yyy'){
					if(this.data.SetUploadFileModel.IsSuperCargo == 0){
						this.$message.error('请先开启押运员配置');
						this.data.SetSignModel.IsSuperCargoSign = 0
					}
				}else if(type == 'image'){
					if(this.data.SetUploadFileModel.IsPicUpload == 0){
						this.$message.error('请先开启整车检查照片强制上传配置');
						this.data.SetUploadFileModel.IsPicMustUpload = 0
					}
				}else if(type == 'video'){
					if(this.data.SetUploadFileModel.IsVideoUpload == 0){
						this.$message.error('请先开启整车检查视频强制上传配置');
						this.data.SetUploadFileModel.IsVideoMustUpload = 0
					}
				}
			},
			async show(item) {
				this.dislogShow = true;
				this.$nextTick(() => {
					if (item) {
						this.data = JSON.parse(JSON.stringify(item))
					}
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			save() {
				this.$refs.formRef.validate(async valid => {
					if (valid) {
						this.submitLoading = true;
						let params = {
							...this.data,
						}
						// josnFields.forEach(key => {
						// 	params[key] = JSON.stringify(params[key]);
						// });
						let res = await this.Post('/SaveLogbookConfig', params);
						if (res.status == 2000) {
							this.$message.success('保存成功');
							this.close()
							this.$emit('success')
						}
						this.submitLoading = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gutter {
		width: 100%;
		height: 10px;
		background: #F2F2F2;
	}

	.form-data {
		.el-form-item {
			margin-bottom: 0;
		}

		.card,
		.card1 {
			padding: 18px 25px;

			.title {
				display: flex;
				align-items: center;
				margin-bottom: 20px;
				font-size: 16px;
				font-weight: 600;
				line-height: 1;

				&::before {
					content: '';
					margin-right: 10px;
					width: 5px;
					height: 18px;
					background: $--color-primary;
				}
			}

			/deep/ textarea {
				border-radius: 4px;
				padding: 14px 15px;
				width: 100%;
				height: 130px;
				resize: none;
				font-size: 14px;

				&:focus-visible {
					outline: none;
				}
			}

			/deep/ input {
				border-radius: 4px;
				padding: 0 16px;
				width: 100%;
				height: 45px;

				&:focus-visible {
					outline: none;
				}
			}

			.custom-input {
				position: relative;

				&:hover {
					.remove {
						display: block;
					}
				}

				.remove {
					position: absolute;
					top: 50%;
					right: 13px;
					transform: translateY(-50%);
					font-size: 16px;
					color: #FE3F51;
					cursor: pointer;
					display: none;
				}
			}

			.setting-item {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				grid-gap: 20px;
				width: 100%;
			}

			.add-btn {
				border-radius: 4px;
				border: 1px dashed #E7E8F2;
				height: 45px;
				background: #FBFDFF;
				line-height: 45px;
				text-align: center;
				cursor: pointer;
			}

			.clear {
				font-size: 14px;
				color: #959595;
				cursor: pointer;

				i {
					margin-right: 8px;
				}
			}
		}

		.card1 {
			// padding: 0px 25px !important;
		}
	}
</style>