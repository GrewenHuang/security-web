<template>
	<el-dialog v-dialog-drag title="生成培训报告" :visible.sync="dislogShow" @close="close()" class="info" width="1000px"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar ref="scrollbar" class="scrollbar">
			<el-form :model="info" :inline="true">
				<div class="table-box" id="pdf-content">
					<table>
						<tr>
							<td colspan="4"><span class="t-t">{{info.EventReportName}}</span></td>
						</tr>
						<tr>
							<td><span>事件名称</span></td>
							<td>
								<span>{{info.EventReportName}}</span>
							</td>
							<td><span>发生时间</span></td>
							<td>
								<span>{{info.EventReportTimeDesc}}</span>
							</td>
						</tr>
						<tr>
							<td><span>发生地点</span></td>
							<td>
								<span>{{info.Place}}</span>
							</td>
							<td><span>事件类型</span></td>
							<td>
								<el-select placeholder="事件类型" clearable v-model="info.AccidentTypeCode"
									style="width: 100%" disabled>
									<el-option v-for="(item,index) in AccidentTypeList" :key="item.id"
										:label="item.text" :value="item.id"></el-option>
								</el-select>
							</td>
						</tr>
						<tr>
							<td><span>事件等级</span></td>
							<td>
								<el-select placeholder="事件等级" clearable v-model="info.AccidentlevelCode"
									style="width: 100%" disabled>
									<el-option v-for="(item,index) in AccidentLevelList" :key="item.id"
										:label="item.text" :value="item.id"></el-option>
								</el-select>
							</td>
							<td><span>责任归属</span></td>
							<td>
								<el-select placeholder="责任归属" clearable v-model="info.AccidentNatureCode"
									style="width: 100%" disabled>
									<el-option v-for="(item,index) in AccidentList" :key="item.id" :label="item.text"
										:value="item.id"></el-option>
								</el-select>
							</td>
						</tr>
						<tr>
							<td><span>受伤人数</span></td>
							<td>
								<span>{{info.GetHurtCount}}</span>
							</td>
							<td><span>财损金额(元)</span></td>
							<td>
								<span>{{info.LossAmount}}</span>
							</td>
						</tr>
						<tr>
							<td><span>安全等级</span></td>
							<td>
								<span>{{info.SecurityLevelDesc}}</span>
							</td>
							<td><span>主观原因分析</span></td>
							<td>
								<span>{{info.SubjectiveReason}}</span>
							</td>
						</tr>

						<tr>
							<td><span>车辆</span></td>
							<td>
								<span>{{info.ResponsibleUserName}}</span>
							</td>
							<td><span>责任人</span></td>
							<td>
								<span>{{info.LicensePlateNumber}}</span>
							</td>
						</tr>
						<tr>
							<td><span>事件经过</span></td>
							<td colspan="3">
								<span>{{info.EventProcess}}</span>
							</td>
						</tr>
						<tr>
							<td><span>紧急处理措施</span></td>
							<td colspan="3">
								<span>{{info.EmergencyHandling}}</span>
							</td>
						</tr>
						<tr>
							<td><span>后续跟进措施</span></td>
							<td colspan="3">
								<span>{{info.FollowUp}}</span>
							</td>
						</tr>
						<tr>
							<td><span>备注</span></td>
							<td colspan="3">
								<span>{{info.Remark}}</span>
							</td>
						</tr>
						<tr>
							<td><span>现场照片</span></td>
							<td colspan="3" class="t-t-l-p" style="padding: 2px 0 2px 10px;">
								<div v-if="info.Pics">
									<!-- <custom-upload class="el-input" :accept="'.jpeg,.png,.jpg'" :onlyUpload="true"
										:fileList.sync="info.Pics" list-type="picture-card" disabled>
									</custom-upload> -->
									<img v-for="(item,index) in info.Pics" :key="index" :src="item.url" alt=""
										style="width: 100px;height: 100px;margin-right: 5px">
								</div>
							</td>
						</tr>
					</table>
				</div>
			</el-form>
		</el-scrollbar>

		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">{{info.CurriculumId? '关闭' : '取消'}}</el-button>
			<el-button type="primary" @click="generatePDF()" v-if="!info.CurriculumId">一键生成</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	import axios from 'axios'
	// import userInfo from './userAdd.vue';
	import {
		Pdf
	} from '@/plugins/htmlToPdf';
	import jsPDF from 'jspdf';
	import html2canvas from 'html2canvas';
	const localUploadUrl = process.env.API_UPLOAD_URL;
	const defaultInfo = {
		ResponsibleUserId: '',
		ResponsibleUserName: '',
		VehicleId: '',
		LicensePlateNumber: '',
		ExpertName: '',
		ExpertTel: '',
		Specialty: '',
		Education: '',
		Major: '',
		Remark: '',
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		mixins: [request_mixin],
		components: {
			// userInfo
		},
		props: ["AccidentLevelList", "AccidentList", "AccidentTypeList"],
		data() {
			return {
				loading: false,
				dislogShow: false,
				info: _extends(defaultInfo),
				isImage: "",
				isType: -1
			}
		},
		methods: {
			async generatePDF() {
				if (!this.info.InterviewId > 0) {
					this.$message.error('此快报未进行约谈')
					return
				}
				if (!this.info.TrainTaskId > 0) {
					this.$message.error('此快报未进行培训')
					return
				}
				if (this.info.Status != 1) {
					this.$message.error('此快报未结案')
					return
				}
				let loading = this.$loading({
					lock: true,
					text: '正在生成中,请勿关闭页面',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.exportLoading = true;
				this.$nextTick(() => {
					Pdf.downPdfImg('pdf-content', this.info.EventReportName).then(res => {
						this.exportLoading = false;
						let config = {
							headers: {
								"Content-type": "multipart/form-data",
							},
						};
						axios.post(localUploadUrl, res, config).then((res) => {
							if (res.status == 200 && res.data.status == 2000) {
								if (res.data.errors.length) {
									this.$message.error(
										"上传失败," + res.data.errors[0].error
									);
								} else {
									let params = {
										EventReportId: this.info.EventReportId,
										CoursewareNo: this.getCoursewareNoKJ(),
										CurriculumNo: this.getCoursewareNoKC(),
										EventReportPDF: {
											Name: res.data.files[0].name,
											Url: res.data.files[0].url,
											Size: res.data.files[0].size,
											Ext: res.data.files[0].ext,
											Lengths: 1,
											CoverUrl: res.data.files[0].viewurl,
											Order: 0
										}
									}
									this.Post('/SaveCoursewareAndCurriculum', params).then(
										res => {
											if (res.status == 2000) {
												this.$message.success("保存成功");
												this.dislogShow = false
												this.$emit("success")
											} else {
												this.$message.error(res.message);
											}
										})
								}
							} else {
								this.$message.error("网络异常，请稍后重试");
							}
						});
						loading.close();
					})
				})
				// const pdf = new jsPDF('p', 'mm', 'a4');
				// const element = document.getElementById('pdf-content');
				// html2canvas(element,{
				// 	backgroundColor: 'white',
				// 	useCORS: true, //支持图片跨域
				// 	scale: 1, //设置放大的倍数
				// }).then((canvas) => {
				// 	  const imgData = canvas.toDataURL('image/png', 1.0);
				// 	  pdf.addImage(imgData, 'PNG', 10, 10, 190, 277); // 修改此行，将参数传递给 addImage() 方法
				// 	  const pdfData = pdf.output('blob'); // 修改此行，将输出 Blob 对象保存到 pdfData 变量中
				// 	  const formData = new FormData();
				// 	  formData.append('file', pdfData, `${this.info.EventReportName}.pdf`);
				// 	let config = {
				// 		headers: {
				// 			"Content-type": "multipart/form-data",
				// 		},
				// 	};
				// 	const loading = this.$loading({
				// 		lock: true,
				// 		text: "上传中...",
				// 		spinner: "el-icon-loading",
				// 		background: "rgba(0, 0, 0, 0.7)",
				// 	});
				// 	axios.post(localUploadUrl, formData, config).then((res) => {
				// 		if (res.status == 200 && res.data.status == 2000) {
				// 			if (res.data.errors.length) {
				// 				this.$message.error(
				// 					"上传失败," + res.data.errors[0].error
				// 				);
				// 			} else {
				// 				let params = {
				// 					EventReportId: this.info.EventReportId,
				// 					CoursewareNo: this.getCoursewareNoKJ(),
				// 					CurriculumNo: this.getCoursewareNoKC(),
				// 					EventReportPDF: {
				// 						Name: res.data.files[0].name,
				// 						Url: res.data.files[0].url,
				// 						Size: res.data.files[0].size,
				// 						Ext: res.data.files[0].ext,
				// 						Lengths: 1,
				// 						CoverUrl: res.data.files[0].viewurl,
				// 						Order: 0
				// 					}
				// 				}
				// 				this.Post('/SaveCoursewareAndCurriculum', params).then(res => {
				// 					if (res.status == 2000) {
				// 						this.$message.success("保存成功");
				// 						this.dislogShow = false
				// 						this.$emit("success")
				// 					} else {
				// 						this.$message.error(res.message);
				// 					}
				// 				})
				// 			}
				// 		} else {
				// 			this.$message.error("网络异常，请稍后重试");
				// 		}
				// 	});
				// 	loading.close();
				// });
				// return false;
			},
			async show(item) {
				this.dislogShow = true;
				this.info = Object.assign({}, item)
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			close() {
				this.dislogShow = false;
				this.id = '';
				this.info = _extends(defaultInfo);
			},
			getCoursewareNoKJ() {
				//课件获取随机编号
				return "KJ" + new Date().getTime();
			},
			getCoursewareNoKC() {
				//课程获取随机编号
				return "KC" + new Date().getTime();
			},
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
		background: #fff !important;
		color: #000 !important;
		text-align: center;
		border: none;
		box-shadow: none;
		cursor: default !important;
	}

	/deep/.el-input__suffix {
		display: none !important;
	}

	/deep/.el-checkbox {
		margin-right: 10px !important;
		margin-left: 10px;
	}

	.info {
		/deep/ .el-textarea__inner {
			border: 0;
			border-radius: 0px;

			&:focus {
				border: none;
			}
		}

		/deep/ .el-upload--picture-card {
			background-color: none !important;
			border: none !important;
			cursor: default !important;
		}

		/deep/ .el-input.is-disabled {
			background-color: #fff !important;
			color: #333 !important;
			cursor: default !important;
		}

		/deep/ .el-input__suffix {
			display: none !important;
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
				color: #333;

			}

			.t-t {
				text-align: center;
				font-size: 16px;
				font-weight: bold;
				width: 100%;
			}
		}
	}
</style>