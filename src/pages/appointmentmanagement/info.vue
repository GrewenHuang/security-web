<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info" width="1000px"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar ref="scrollbar" class="scrollbar">
			<el-form :model="info" :inline="true" :disabled="isAdd">
				<div class="table-box" id="pdf-content">
					<table>
						<tr v-if="info.EnterpriseName">
							<td colspan="4"><span class="t-t">{{info.EnterpriseName}}</span></td>
						</tr>
						<tr>
							<td colspan="4"><span class="t-t">约谈记录表</span></td>
						</tr>
						<tr>
							<!-- <td><span>企业/部门</span></td> -->
							<td><span>部门</span></td>
							<!-- <td :class="isAdd? '' : 'active'"><span
									v-if="info.EnterpriseName">{{info.EnterpriseName + '-' + info.DepartmentName}}</span>
							</td> -->
							<td :class="isAdd? '' : 'active'"><span
									v-if="info.DepartmentName">{{info.DepartmentName}}</span>
							</td>
							<td><span>安全等级</span></td>
							<td>
								<el-form-item prop="SecurityLevel" ref="SecurityLevel" v-if="!isAdd">
									<select-level v-model="info.SecurityLevel" :multiple="false"
										:value="info.SecurityLevel" :disabled="isAdd"></select-level>
								</el-form-item>
								<span v-else>{{info.SecurityLevelDesc}}</span>
							</td>
						</tr>
						<tr>
							<td><span>被约谈人</span></td>
							<td>
								<el-form-item v-if="!isAdd">
									<el-input placeholder="请选择" readonly v-model="info.IntervieweeName"
										class="input-with-select" v-if="isType != 1" :disabled="isAdd">
										<template v-if="!!info.IntervieweeName">
											<i class="el-icon-error cursor-p f--c"
												style="height: 100%;line-height: 40px;" slot="suffix"
												@click="removeItem(1)"></i>
										</template>
										<el-button slot="append" @click="chooseUserName()">选择人员</el-button>
									</el-input>
									<span v-else style="padding-left: 10px;">{{info.IntervieweeName}}</span>
								</el-form-item>
								<span v-else>{{info.IntervieweeName}}</span>
							</td>
							<td><span>驾驶车辆</span></td>
							<td>
								<el-form-item v-if="!isAdd">
									<el-input placeholder="请选择" readonly v-model="info.LicensePlateNumber"
										class="input-with-select" v-if="isType != 1" :disabled="isAdd">
										<template v-if="!!info.LicensePlateNumber">
											<i class="el-icon-error cursor-p f--c"
												style="height: 100%;line-height: 40px;" slot="suffix"
												@click="removeItemCarNo()"></i>
										</template>
										<el-button slot="append" @click="chooseCar()">选择车辆</el-button>
									</el-input>
									<span v-else style="padding-left: 10px;">{{info.LicensePlateNumber}}</span>
								</el-form-item>
								<span v-else>{{info.LicensePlateNumber}}</span>
							</td>
						</tr>
						<tr>
							<td><span>关联被约谈人</span></td>
							<td colspan="3" style="text-align: left;padding-left: 15px;">
								<el-form-item v-if="!isAdd">
									<el-input placeholder="请选择" readonly v-model="info.AssociationIntervieweeName"
										class="input-with-select" :disabled="isAdd">
										<template v-if="!!info.AssociationIntervieweeName">
											<i class="el-icon-error cursor-p f--c"
												style="height: 100%;line-height: 40px;" slot="suffix"
												@click="removeItem(2)"></i>
										</template>
										<el-button slot="append" @click="chooseModerator(2)">选择人员</el-button>
									</el-input>
								</el-form-item>
								<span v-else>{{info.AssociationIntervieweeName}}</span>
							</td>
						</tr>
						<tr>
							<td><span>约谈时间</span></td>
							<td>
								<el-form-item v-if="!isAdd">
									<el-date-picker v-model="info.InterviewTime" type="date" value-format="yyyy-MM-dd"
										placeholder="选择日期" style="width: 100%" :disabled="isAdd">
									</el-date-picker>
								</el-form-item>
								<span v-else>{{info.InterviewTimeDesc}}</span>
							</td>
							<td><span>约谈人</span></td>
							<td>
								<el-form-item v-if="!isAdd">
									<el-input placeholder="请选择" readonly v-model="info.InterviewerName"
										class="input-with-select" :disabled="isAdd">
										<template v-if="!!info.InterviewerName">
											<i class="el-icon-error cursor-p f--c"
												style="height: 100%;line-height: 40px;" slot="suffix"
												@click="removeItem(3)"></i>
										</template>
										<el-button slot="append" @click="chooseModerator(3)">选择人员</el-button>
									</el-input>
								</el-form-item>
								<span v-else>{{info.InterviewerName}}</span>
							</td>
						</tr>
						<tr>
							<td><span>约谈原因</span></td>
							<td colspan="3">
								<el-form-item>
									<el-radio-group v-model="info.ReasonFor" :disabled="isAdd">
										<el-radio v-for="(item,index) in AccidentEnum" :key="index"
											:label="item.id">{{item.text}}</el-radio>
									</el-radio-group>
								</el-form-item>
							</td>
						</tr>
						<tr>
							<td><span>交通事故情况简述</span></td>
							<td colspan="3">
								<el-form-item>
									<el-input type="textarea" placeholder="交通事故情况简述" clearable maxlength="200"
										show-word-limit v-model="info.Desc"></el-input>
								</el-form-item>
							</td>
						</tr>
						<tr>
							<td><span>事故原因分析</span></td>
							<td colspan="3">
								<el-form-item>
									<el-input type="textarea" placeholder="事故原因分析" clearable maxlength="200"
										show-word-limit v-model="info.Analysis"></el-input>
								</el-form-item>
							</td>
						</tr>
						<tr>
							<td><span>处罚情况简述</span></td>
							<td colspan="3">
								<el-form-item>
									<el-input type="textarea" placeholder="处罚情况简述" clearable maxlength="200"
										show-word-limit v-model="info.Sketch"></el-input>
								</el-form-item>
							</td>
						</tr>
						<tr>
							<td><span>本次约谈教育内容</span></td>
							<td colspan="3">
								<el-form-item>
									<el-input type="textarea" placeholder="本次约谈教育内容" clearable maxlength="200"
										show-word-limit v-model="info.EducationalContent"></el-input>
								</el-form-item>
							</td>
						</tr>
						<tr>
							<td><span>约谈照片</span></td>
							<td colspan="3" class="t-t-l-p" style="padding: 2px 0 2px 10px;">
								<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'" :fileList.sync="info.Pics"
									list-type="picture-card">
									<i class="el-icon-plus"></i>
								</custom-upload>
							</td>
						</tr>
						<tr>
							<template v-if="info.InterviewerList && info.InterviewerList.length > 0 && isAdd">
								<td><span>约谈人签名</span></td>
								<td class="t-t-l-p"  colspan="3">
									<template v-for="(item,index) in info.InterviewerList">
										<el-image style="width:50px;height:50px;margin-right: 5px;"
											v-if="item.SignUrl"
											:preview-src-list="[item.SignUrl]" :z-index='9999'
											:src="item.SignUrl">
										</el-image>
									</template>
								</td>
							</template>
						</tr>
						<tr>
							<template v-if="info.IntervieweeSignUrl && isAdd">
								<td><span>被约谈人签名</span></td>
								<td class="t-t-l-p" colspan="3">
									<el-image style="width:50px;height:50px;margin-right: 5px;"
										:preview-src-list="[info.IntervieweeSignUrl]" :z-index='9999'
										:src="info.IntervieweeSignUrl">
									</el-image>
								</td>
							</template>
						</tr>
						<tr>
							<template v-if="info.AssociationIntervieweeList && info.AssociationIntervieweeList.length > 0 && isAdd">
								<td><span>关联被约谈人签名</span></td>
								<td class="t-t-l-p" colspan="3">
									<template v-for="(item,index) in info.AssociationIntervieweeList">
										<el-image style="width:50px;height:50px;margin-right: 5px;"
											v-if="item.SignUrl"
											:preview-src-list="[item.SignUrl]" :z-index='9999'
											:src="item.SignUrl">
										</el-image>
									</template>
								</td>
							</template>
						</tr>
					</table>
				</div>
			</el-form>
		</el-scrollbar>

		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">{{ info.InterviewId ? '关闭' : '取消'}}</el-button>
			<el-button type="primary" :loading="submitLoading" @click="save()" v-if="!info.InterviewId">提交</el-button>
			<el-button type="primary" @click="exportData()" :loading="submitLoading" v-else>生成PDF</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	const defaultInfo = {
		Interviewer: '', //约谈人Id
		InterviewerName: '',
		UserName: '',
		LicensePlateNumber: '', //车辆牌照
		InterviewTime: '', ///约谈时间
		Interviewee: '', //被约谈人Id
		IntervieweeName: '',
		ReasonFor: '', //约谈原因
		Desc: '', // 交通事故情况简述
		Analysis: '', //事故原因分析
		Sketch: '', //处罚情况简述
		EducationalContent: '', //本次约谈教育内容
		InterviewerSignUrl: '', //约谈人签字
		IntervieweeSignUrl: '', // 被约谈人签字
		Status: '', //约谈状态 0未约谈 1已约谈
		SecurityLevel: '1', //安全等级
		Pics: [], //约谈图片
		EnterpriseName: '',
		DepartmentName: '',
		EventReportId: '',
		AssociationIntervieweeJson: "",
		AssociationIntervieweeList: [],
		InterviewerJson: "",
		InterviewerList: [],
		AssociationIntervieweeName: '',
		VehicleId: ''
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	import {
		Pdf
	} from '@/plugins/htmlToPdf';
	export default {
		mixins: [request_mixin],
		components: {
			// userInfo
		},
		data() {
			return {
				title: '查看',
				id: '',
				loading: false,
				dislogShow: false,
				submitLoading: false,
				info: _extends(defaultInfo),
				checkList: ['qt'],
				isImage: "",
				isType: -1,
				AccidentEnum: [],
				isAdd: false
			}
		},
		computed: {
			isEdit() {
				return !!this.id
			},
		},
		methods: {
			chooseUserName() {
				this.$chooseTask({
					single: false,
				}).then(data => {
					this.info.IntervieweeName = data.UserName
					this.info.Interviewee = data.UserId
				});
			},
			chooseModerator(e) {
				// 选择人员
				this.$chooseUser({
					single: true,
				}).then(data => {
					if (e == 2) {
						this.info.AssociationIntervieweeList = data
						this.info.AssociationIntervieweeJson = JSON.stringify(data)
						this.info.AssociationIntervieweeName = data.map(item => item.UserName).join(',') || ''
					} else {
						this.info.InterviewerName = data.map(item => item.UserName).join(',') || ''
						this.info.InterviewerJson = JSON.stringify(data)
						this.info.InterviewerList = data
					}
				});
			},
			chooseCar() {
				this.$chooseCar({
					single: false,
				}).then(data => {
					this.info.VehicleId = data.VehicleId
					this.info.LicensePlateNumber = data.LicensePlateNumber
					this.info.DepartmentId = data.DepartmentId
					this.info.EnterpriseId = data.EnterpriseId
					this.info.EnterpriseName = data.EnterpriseName
					this.info.DepartmentName = data.DepartmentName
				});
			},
			removeItemCarNo() {
				// 删除所选车牌
				this.info.LicensePlateNumber = ""
				this.info.EnterpriseId = ''
				this.info.DepartmentId = ''
				this.info.EnterpriseName = ''
				this.info.DepartmentName = ''
			},
			removeItem(e) {
				if (e == 1) {
					this.info.IntervieweeName = ''
					this.info.Interviewee = ''
				} else if (e == 2) {
					this.info.AssociationIntervieweeList = []
					this.info.AssociationIntervieweeJson = ""
					this.info.AssociationIntervieweeName = ""
				} else {
					this.info.InterviewerList = ""
					this.info.InterviewerJson = ""
					this.info.InterviewerName = ""
				}
			},
			async show(item, type) {
				this.isType = type
				this.dislogShow = true;
				this.Get("/GetTrafficAccidentEnum").then(res => {
					if (res.status == 2000) {
						this.AccidentEnum = res.data
					}
				})
				if (item) {
					if (type == 1) {
						if (item.InterviewId) {
							this.isAdd = true
							this.loading = true
							this.title = '查看'
							this.Get("/GetInterview?interviewId=" + item.InterviewId).then(res => {
								if (res.status == 2000) {
									this.info = res.data
									this.info.ReasonFor = this.info.ReasonFor.toString()
									this.info.SecurityLevel = this.info.SecurityLevel.toString()
									this.info.AssociationIntervieweeName = this.info.AssociationIntervieweeList
										.map(item => item.UserName).join(',') || ''
									this.info.InterviewerName = this.info.InterviewerList.map(item => item
										.UserName).join(',') || ''
								}
							})
							this.loading = false
						} else {
							this.isAdd = false
							this.title = '编辑'
							this.info.Interviewee = item.ResponsibleUserId
							this.info.IntervieweeName = item.ResponsibleUserName
							this.info.EnterpriseName = item.EnterpriseName
							this.info.EnterpriseId = item.EnterpriseId
							this.info.DepartmentName = item.DepartmentName
							this.info.DepartmentId = item.DepartmentId
							this.info.VehicleId = item.VehicleId
							this.info.LicensePlateNumber = item.LicensePlateNumber
							this.info.EventReportId = item.EventReportId
							this.info.AssociationIntervieweeName = ''
						}
					} else {
						this.isAdd = true
						this.loading = true
						this.title = '查看'
						this.Get("/GetInterview?interviewId=" + item.InterviewId).then(res => {
							if (res.status == 2000) {
								this.info = res.data
								this.info.ReasonFor = this.info.ReasonFor.toString()
								this.info.SecurityLevel = this.info.SecurityLevel.toString()
								this.info.AssociationIntervieweeName = this.info.AssociationIntervieweeList
									.map(item => item.UserName).join(',') || ''
								this.info.InterviewerName = this.info.InterviewerList.map(item => item
									.UserName).join(',') || ''
							}
						})
						this.loading = false
					}
				} else {
					this.isAdd = false
					this.title = '新增'
					this.info = _extends(defaultInfo);
				}
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			exportData() {
				let loading = this.$loading({
					lock: true,
					text: '正在导出,请勿关闭当前页面',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.submitLoading = true;
				this.$nextTick(() => {
					Pdf.downPdf('pdf-content', '约谈记录表').then(res => {
						this.submitLoading = false;
						loading.close();
					})
				})
			},
			close() {
				this.dislogShow = false;
				this.submitLoading = false;
				this.id = '';
				this.info = _extends(defaultInfo);
			},
			async save() {
				let params = {
					...this.info
				}
				params.SecurityLevel = parseInt(params.SecurityLevel)
				this.submitLoading = true;
				try {
					let res = await this.Post('/SaveInterview', params)
					if (res.status == 2000) {
						this.$message.success('保存成功')
						this.$emit('success');
						this.close();
					} else {
						this.$message.error(res.message);
					}
				} catch (error) {

				}
				this.submitLoading = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.el-form--inline .el-form-item__content {
		width: 100%;
	}

	/deep/.el-form--inline {
		width: 100% !important;
	}

	/deep/ .el-input__inner {
		border: none;
		box-shadow: none;
	}

	/deep/.el-checkbox {
		margin-right: 10px !important;
		margin-left: 10px;
	}

	/deep/.el-radio-group {
		padding-left: 10px !important;
	}

	/deep/.el-textarea.is-disabled .el-textarea__inner {
		background: #fff !important;
		cursor: default !important;
		color: #000;
	}

	/deep/.el-radio.is-disabled .el-radio__label {
		color: #000 !important;
		cursor: default;
	}

	/deep/.el-radio.is-disabled .el-radio__input.is-checked .el-radio__inner {
		cursor: default;
	}

	/deep/.el-radio.is-disabled .el-radio__input .el-radio__inner {
		cursor: default;
	}

	.info {

		/deep/ .el-textarea__inner {
			border: 0;
			border-radius: 0px;

			&:focus {
				border: none;
			}
		}

		/deep/ .el-dialog__body {
			padding: 0 !important;

			.el-scrollbar__wrap {
				margin-bottom: 0 !important;
			}
		}

		/deep/ .el-dialog {
			min-width: 1000px;
		}

		/deep/ .el-form {
			padding: 25px 25px 20px;

			.el-select {
				width: 100%;
			}
		}

		/deep/ .el-form-item {
			margin-bottom: 0;
			margin-right: 0;
			text-align: left;
			width: 100%;

			.el-form-item__label {
				padding-bottom: 9px;
				line-height: 20px;
			}
		}

		.el-date-editor,
		.el-select {
			width: 100%;
		}

		.form-2-col {
			display: flex;

			>div {
				width: 50%;

				&:first-child {
					margin-right: 40px;
				}
			}
		}

		.split-line {
			&::before {
				content: '';
				display: block;
				margin: 0 -25px 25px;
				height: 10px;
				background: #f2f2f2;
			}
		}
	}

	.table-box /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
		border-color: #fff;
	}

	.table-box /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
		background-color: #409eff;
		border-color: #409eff;
	}

	.table-box /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label {
		color: #000;
		cursor: text;
	}

	.table-box {
		padding: 10px;

		table {
			width: 100%;
			border-collapse: collapse;
			border-spacing: 0;
			border: 1px solid #333;

			td {
				text-align: center;
				border: 1px solid #333;
			}

			.t-d-l {
				text-align: left !important;
				padding-left: 10px;
				height: 80px;
				vertical-align: top;

				span {
					line-height: 20px !important;

				}
			}

			.t-t-l-p {
				text-align: left !important;
				padding-left: 10px;
			}

			span {
				display: inline-block;
				height: 40px;
				line-height: 40px;
				font-size: 14px;

			}

			.t-t {
				text-align: center;
				font-size: 16px;
				font-weight: bold;
				width: 100%;
			}
		}
	}

	.active {
		text-align: left !important;
		padding-left: 10px;
	}
</style>