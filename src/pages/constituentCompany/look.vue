<template>
	<el-dialog v-dialog-drag title="查看" :visible.sync="dislogShow" @close="close()" class="info" width="1000px"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar ref="scrollbar" class="scrollbar">
		<div id="enterprise-pdf" v-if="info.EnterpriseName">
			<h1>企业档案</h1>
			<table class="table-content" border="1" cellpadding="0" cellspacing="0">
				<colgroup>
					<col width="200px" />
					<col width="200px" />
					<col width="200px" />
					<col width="200px" />
				</colgroup>
				<tr>
					<td>企业名称</td>
					<td colspan="3">{{ info.EnterpriseName }}</td>
				</tr>
				<tr>
					<td>主要负责人姓名</td>
					<td>{{ info.LegalPersionName }}</td>
					<td>主要负责人电话</td>
					<td>{{ info.LegalPersionTel }}</td>
				</tr>
				<tr>
					<td>企业地址</td>
					<td colspan="3">{{ info.EnterpriseAddress }}</td>
				</tr>
				<tr>
					<td style="height: 100px;">公司简介</td>
					<td colspan="3" class="white-space">{{ info.EnterpriseProfile }}</td>
				</tr>
				<template v-for="(item, index) in [...info.Certificates, ...info.Insures, ...info.Others]">
				    <tr>
				        <td colspan="4">{{ item.CertificateName }}</td>
				    </tr>
				    <template v-for="(field, i) in item.CertificateFileds">
				        <tr v-if="i % 2 == 0">
				            <td>{{ field.FiledName }}</td>
				            <td>{{ field.FiledValue | formatCustom}}</td>
				            <td>{{ item.CertificateFileds[i + 1] ? item.CertificateFileds[i + 1].FiledName : '' }}</td>
				            <td>{{ (item.CertificateFileds[i + 1] ? item.CertificateFileds[i + 1].FiledValue : '') | formatCustom }}</td>
				        </tr>
				    </template>
				    <tr v-if="item.CertificateManagePhotos && !!item.CertificateManagePhotos.length">
				        <td colspan="4">
				            <template v-for="(img, i) in item.CertificateManagePhotos">
				                <img style="max-width: 100%;height:auto;" :src="img.url" alt="">
				            </template>
				        </td>
				    </tr>
				</template>
			</table>
		</div>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" :loading="exportLoading" @click="exportData()" slot="reference">导出PDF</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		Pdf
	} from '@/plugins/htmlToPdf';
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		mixins: [request_mixin],
		data() {
			return {
				id: '',
				loading: false,
				dislogShow: false,
				exportLoading: false,
				info: {

				},
			}
		},
		filters: {
			formatCustom(val) {
				if (val) {
					let list = val.split(',');
					if (list.length == 3) {
						let dateStr = list[0] + ' 至 ' + list[1];
						if (list[2] == 1) {
							dateStr = '长期'
						}
						return dateStr;
					}
				}
				return val;
			},
		},
		methods: {
			async show(item) {
				this.dislogShow = true;
				if (item) {
					this.loading = true;
					// this.info = item;
					this.loading = false;
					this.getEditInfo(item.EnterpriseId)
				}
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			async getEditInfo(id){
				this.loading = true;
				let res = await this.Post(`/GetEnterpriseById?EnterpriseId=${id}`);
				this.info = res.data
				// this.setCerts(res.data.CertificateList || [], this.form);
				// this.collapseActive = this.form.Certificates.map(item => item.CertificateId);
				// this.insureCollapseActive = this.form.Insures.map(item => item.CertificateId);
				// this.otherCollapseActive = this.form.Others.map(item => item.CertificateId);
				this.loading = false;
			},
			setCerts(list, info) {
				list.forEach(item => {
					Object.keys(certKeysName).forEach((key, index) => {
						if (!info[key]) {
							this.$set(info, key, []);
						}
						if (item.CertificateClassification == (index + 1)) {
							let o = info[key].find(o => o.CertificateId == item.CertificateId);
							if (!o) {
								info[key].push(item);
							}
						}
					});
				});
			},
			close() {
				this.dislogShow = false;
				this.exportLoading = false;
			},
			exportData() {
				let loading = this.$loading({
					lock: true,
					text: '正在导出,请勿关闭当前页面',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.exportLoading = true;
				this.$nextTick(() => {
					Pdf.downPdf('enterprise-pdf', '企业信息').then(res => {
						this.exportLoading = false;
						loading.close();
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.info {
		/deep/ .el-dialog__body {
			padding: 0 !important;

			.el-scrollbar__wrap {
				margin-bottom: 0 !important;
			}
		}

		/deep/ .el-dialog {
			min-width: 1000px;
		}

		.table-content {
			border-top: 1px solid #000;
			border-left: 1px solid #000;
			width: 100%;
			border-collapse: collapse;
			text-align: center;

			td {
				border-right: 1px solid #000;
				border-bottom: 1px solid #000;
				padding: 5px;
				height: 35px;
				background: #fff;
			}
		}
	}

	#enterprise-pdf {
		padding: 20px;

		h1 {
			margin-bottom: 10px;
			text-align: center;
		}

		.num {
			margin-bottom: 5px;
			text-align: right;
			font-size: 18px;
			font-weight: 600;
		}

		.white-space {
			white-space: pre-wrap;
			text-align: left;
		}
	}
	
</style>