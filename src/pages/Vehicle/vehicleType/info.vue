<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info" width="800px"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar class="scrollbar" ref="scrollbar">
			<el-form ref="form" label-position="top" :model="info" :rules="rules">
				<el-form-item label="车辆类型" prop="VehicleTypeName">
					<el-input placeholder="请输入" v-model="info.VehicleTypeName"></el-input>
				</el-form-item>
				<el-form-item label="行车日志模板" prop="LogbookConfigId">
					<el-select clearable v-model="info.LogbookConfigId" style="width: 100%" placeholder="行车日志模板">
						<el-option v-for="(item, index) in LogbookList" :key="index" :label="item.LogbookConfigName"
							:value="item.LogbookConfigId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车辆巡检模板" prop="VehicleSafelyCheckConfigId">
					<el-select clearable v-model="info.VehicleSafelyCheckConfigId" style="width: 100%"
						placeholder="车辆巡检模板">
						<el-option v-for="(item, index) in vehicleList" :key="index"
							:label="item.VehicleSafelyCheckConfigName"
							:value="item.VehicleSafelyCheckConfigId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number :min="1" style="width: 100%;" placeholder="请输入"
						v-model="info.Sort"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" placeholder="请输入" :rows="7" v-model="info.Remark"></el-input>
				</el-form-item>

				<el-form-item prop="CertificateIds" label="收集信息"
					v-if="[...certList, ...insureList, ...otherList].length">
					<div class="el-input">
						<div v-if="certList.length">
							<div>证件</div>
							<el-checkbox-group v-model="info.CertificateIds">
								<el-checkbox v-for="(item, index) in certList" :key="index" :label="item.CertificateId">
									{{ item.CertificateName }}</el-checkbox>
							</el-checkbox-group>
						</div>
						<div v-if="insureList.length">
							<div>保险</div>
							<el-checkbox-group v-model="info.CertificateIds">
								<el-checkbox v-for="(item, index) in insureList" :key="index"
									:label="item.CertificateId"> {{ item.CertificateName }} </el-checkbox>
							</el-checkbox-group>
						</div>
						<div v-if="otherList.length">
							<div>其他</div>
							<el-checkbox-group v-model="info.CertificateIds">
								<el-checkbox v-for="(item, index) in otherList" :key="index"
									:label="item.CertificateId"> {{ item.CertificateName }} </el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
				</el-form-item>
			</el-form>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" :loading="submitLoading" @click="save()" slot="reference">提交</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	const defaultInfo = {
		VehicleTypeName: '',
		Sort: 1,
		Remark: '',
		LogbookConfigId: '',
		VehicleTypeId: '',
		VehicleSafelyCheckConfigId: '',
		CertificateIds: []
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		name: 'page-info',
		mixins: [request_mixin],
		data() {
			return {
				id: '',
				loading: false,
				dislogShow: false,
				submitLoading: false,
				info: _extends(defaultInfo),
				rules: {
					VehicleTypeName: [{
						required: true,
						message: '请输入车辆类型名称',
						trigger: ['change', 'blur']
					}],
					VehicleSafelyCheckConfigId: [{
						required: true,
						message: '请选择车辆巡检模板',
						trigger: ['change', 'blur']
					}],
					LogbookConfigId: [{
						required: true,
						message: '请选择行车日志模板',
						trigger: ['change', 'blur']
					}],
				},
				certList: [], // 证件集合
				insureList: [], // 保险集合
				otherList: [], // 其他信息集合
				vehicleList: [],
				LogbookList: []
			}
		},
		computed: {
			isEdit() {
				return !!this.id
			},
			title() {
				return this.isEdit ? '编辑' : '新增'
			}
		},
		methods: {
			async show(item) {
				this.dislogShow = true;
				this.loading = true;
				let res1 = await this.Post('/GetVehicleSafelyCheckConfigList', {
					page: 1,
					rows: 9999
				})
				if (res1.status == 2000) {
					this.vehicleList = res1.data.list
				}
				let res2 = await this.Post('/GetLogbookConfigList', {
					page: 1,
					rows: 9999
				})
				if (res2.status == 2000) {
					this.LogbookList = res2.data.list
				}
				if (item) {
					this.id = item.VehicleTypeId;
					let res = await this.Get(`/GetVehicleType?id=${item.VehicleTypeId}`)
					if (res.status == 2000) {
						res.data.CertificateIds = (res.data.CertificateIds || '').split(',').map(item => +item)
						this.info = Object.assign(_extends(defaultInfo), res.data);
					} else {
						this.$message.error('获取数据失败');
						this.close();
					}
					this.loading = false;
				} else {
					let res = await this.Post('/GetVehicleTypes', {
						page: 1,
						rows: 999
					});
					if (res.data.count > 999) {
						res = await this.Post('/ ', {
							page: 1,
							rows: res.data.count
						});
					}
					if (!!res.data.list.length) {
						this.info.Sort = res.data.list[res.data.list.length - 1].Sort + 1;
					}
					
				}
				this.loading = false;
				this.$nextTick(() => {
					this.$refs.form.clearValidate();
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			close() {
				this.dislogShow = false;
				this.submitLoading = false;
				this.id = '';
				this.info = _extends(defaultInfo);
			},
			save() {
				this.$refs.form.validate(async (valid, fields) => {
					for (let key in fields) {
						if (this.$refs[key]) {
							this.$refs.scrollbar.wrap.scrollTop = this.$refs[key].$el.offsetTop;
							break;
						}
					}
					if (valid) {
						this.submitLoading = true;
						try {
							let params = {
								...this.info
							}
							params.CertificateIds = params.CertificateIds.join(',');
							let res = await this.Post('/SaveVehicleType', params)
							if (res.status == 2000) {
								this.$message.success('保存成功')
								this.$emit('load');
								this.close();
							} else {
								this.$message.error(res.message);
							}
						} catch (error) {
							console.error(error);
						}
						this.submitLoading = false;
					}
				})
			},
			async getCertList() {
				let res = await this.Get(`/GetCertificateList?certificateType=3&certificateClassification=`);
				if (res.status == 2000) {
					this.certList = res.data.filter(item => item.CertificateClassification == 1);
					this.insureList = res.data.filter(item => item.CertificateClassification == 2);
					this.otherList = res.data.filter(item => item.CertificateClassification == 3);
				}
			},
		},
		created() {
			this.getCertList();
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
			min-width: 800px;
		}

		/deep/ .el-form {
			padding: 25px 25px 20px;

			.el-select {
				width: 100%;
			}
		}

		/deep/ .el-form-item {
			margin-bottom: 25px;

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
</style>