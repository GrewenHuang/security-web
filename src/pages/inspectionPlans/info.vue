<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info" width="600px"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar ref="scrollbar" class="scrollbar">
			<el-form ref="form" label-position="top" :model="info" :rules="rules" :disabled="isEdit">
				<el-form-item v-if="isEdit" label="企业" prop="EnterpriseId">
					<el-select v-model="info.EnterpriseId" placeholder="企业" clearable collapseTags>
						<el-option v-for="(item, index) in EnterpriseList" :key="index" :label="item.EnterpriseName"
							:value="item.EnterpriseId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="isEdit" label="部门" prop="EnterpriseId">
					<el-cascader v-model="info.DepartmentId" clearable style="width: 100%" :options="DepartmentCom"
						placeholder="部门" :show-all-levels="false" :disabled="!info.EnterpriseId ? true : false"
						:props="{ value: 'DepartmentId', label: 'Name', children: 'children' }">
					</el-cascader>
				</el-form-item>
				<el-form-item label="企业" prop="EnterpriseId" v-if="!isEdit">
					<select-enterpirse clearable placeholder="企业" collapseTags v-model="info.EnterpriseId"
						@clear="info.DepartmentId = ''"></select-enterpirse>
				</el-form-item>
				<el-form-item label="部门" prop="DepartmentId" v-if="!isEdit">
					<cascader-department placeholder="部门" clearable v-model="info.DepartmentId"
						:enterpriseId="info.EnterpriseId"
						:disabled="!info.EnterpriseId ? true : false"></cascader-department>
				</el-form-item>
				<el-form-item label="检查计划名称" prop="InspectionPlanName">
					<el-input placeholder="请输入" v-model="info.InspectionPlanName"></el-input>
				</el-form-item>
				<el-form-item label="检查表" prop="InspectionId">
					<el-input placeholder="请选择" v-model="info.InspectionName" readonly>
						<el-button slot="append" @click="chooseTable" v-if="!isEdit">请选择</el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="检查频次" prop="InspectionNatureCode">
					<!-- <el-input v-model="info.InspectionNatureName"
						v-if="isEdit || info.InspectionNatureCode == '0030408'"></el-input> -->
					<el-select placeholder="请选择" v-model="info.InspectionNatureCode" @change="natureChange">
						<el-option v-for="(item, index) in list" :key="index" :label="item.text"
							:value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<!-- 综合检查需要选择检查日期 -->
				<el-form-item label="检查日期" prop="InspectionPlanDate" v-if="info.InspectionNatureCode == '0030408'">
					<el-date-picker v-model="TrainDateRange" type="daterange" value-format="yyyy-MM-dd"
						range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
						:picker-options="pickerOptions" @change="onChangeDate">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="检查方式" prop="InspectionPlanWay">
					<el-select placeholder="检查方式" clearable v-model="info.InspectionPlanWay" :disabled="isEditBtn">
						<el-option label="独立检查" :value="0"></el-option>
						<el-option label="多人检查" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检查人" prop="Enterprises">
					<el-input placeholder="请选择" v-model="userNames" readonly :disabled="isEditBtn">
						<el-button slot="append" @click="chooseUser" v-if="!isEdit && !isEditBtn">请选择</el-button>
					</el-input>
				</el-form-item>

				<el-form-item label="安全等级" prop="SecurityLevel" ref="SecurityLevel">
					<select-level v-model="info.SecurityLevel" :multiple="false"
						:value="info.SecurityLevel"></select-level>
				</el-form-item>
			</el-form>
		</el-scrollbar>
		<chooseInspections ref="chooseTable" :single="true" />
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" :loading="submitLoading" @click="save(1)" slot="reference"
				v-if="!isEdit && !isEditBtn">提交</el-button>
			<el-button type="primary" :loading="submitLoading" @click="save(0)" slot="reference"
				v-if="isEditBtn">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	import chooseInspections from '@/pages/dataBase/inspections/choose-inspections';
	import Qs from 'qs';
	const defaultInfo = {
		InspectionPlanName: '',
		InspectionId: '',
		InspectionNatureCode: '',
		InspectionNatureName: '',
		InspectionPlanDate: '',
		InspectionName: '',
		InspectionId: '',
		Enterprises: [],
		SecurityLevel: '1',
		DepartmentId: [],
		EnterpriseIds: '',
		InspectionPlanEndDate: "",
		TrainDateRange: [],
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		mixins: [request_mixin],
		components: {
			chooseInspections
		},
		props: {
			isEditBtn: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				id: '',
				isLength: 0,
				loading: false,
				dislogShow: false,
				submitLoading: false,
				info: _extends(defaultInfo),
				list: [], // 检查周期
				userNames: '',
				TrainDateRange: [],
				DepartmentCom: [],
				EnterpriseList: [], // 企业
				rules: {
					SecurityLevel: [{
						required: true,
						message: '请选择等级',
						trigger: ['change', 'blur']
					}, ],
					EnterpriseId: [{
						required: true,
						message: '请选择企业',
						trigger: ['change', 'blur']
					}, ],
					DepartmentId: [{
						required: true,
						message: '请选择部门',
						trigger: ['change', 'blur']
					}, ],
					InspectionPlanName: [{
						required: true,
						message: '请输入检查计划',
						trigger: ['change', 'blur']
					}, ],
					InspectionId: [{
						required: true,
						message: '请选择检查表',
						trigger: ['change', 'blur']
					}, ],
					InspectionNatureCode: [{
						required: true,
						message: '请选择检查类型',
						trigger: ['change', 'blur']
					}, ],
					InspectionPlanDate: [{
						required: true,
						message: '请选择检查日期',
						trigger: ['change', 'blur']
					}, ],
					Enterprises: [{
						type: 'array',
						required: true,
						message: '请添加检查人',
						trigger: ['change', 'blur']
					}, ],
					InspectionPlanWay: [{
						required: true,
						message: '请选择检查方式',
						trigger: ['change', 'blur']
					}, ]
				},
				pickerOptions: {
					disabledDate(time) {
						let today = new Date();
						today.setHours(0, 0, 0, 0);
						return time.getTime() < today.getTime();
					}
				}
			}
		},
		computed: {
			isEdit() {
				return this.isEditBtn ? false : !!this.id 
			},
			title() {
				return this.isEditBtn ? '编辑' : this.isEdit ? '查看' : '新增'
			}
		},
		methods: {
			async show(item, copy) {
				this.dislogShow = true;
				await this.getInspectionNatureCom();
				if (item) {
					if (!copy) {
						this.loading = true;
						// this.id = item.InspectionRecordId;
						this.id = item.InspectionId
						try {
							this.GetEnterpriseList(item.EnterpriseId)
							let res = await this.Get(`/GetInspectionPlan?inspectionPlanId=${this.id}`)
							if (res.status == 2000) {
								this.info = Object.assign(_extends(defaultInfo), item)
								this.info.SecurityLevel = this.info.SecurityLevel.toString()
								this.TrainDateRange = [this.info.InspectionPlanDate, this.info.InspectionPlanEndDate]
								if (this.info.Enterprises && this.info.Enterprises.length > 0) {
									this.isLength = this.info.Enterprises[0].EnterpriseUsers.length
									this.userNames = this.info.Enterprises.map(item => item.EnterpriseUsers.map(user =>
										user.UserName).join(',')).join('');
								} else {
									this.isLength = this.info.InspectionRecordUsers.length
									this.userNames = this.info.InspectionRecordUsers.map(user => user.UserName).join(
										'');
								}
							} else {
								this.$message.error('获取数据失败');
								this.close();
							}
						} catch (error) {
							console.error(error);
						}
						this.loading = false;
					} else {
						this.info = Object.assign(_extends(defaultInfo), item)
						this.info.InspectionPlanId = 0
						this.info.InspectionRecordId = 0
						this.info.SecurityLevel = this.info.SecurityLevel.toString()
						this.TrainDateRange = [this.info.InspectionPlanDate, this.info.InspectionPlanEndDate]
						if (this.info.Enterprises && this.info.Enterprises.length > 0) {
							this.isLength = this.info.Enterprises[0].EnterpriseUsers.length
							this.userNames = this.info.Enterprises.map(item => item.EnterpriseUsers.map(user => user
								.UserName).join(',')).join('');
						} else {
							this.isLength = this.info.InspectionRecordUsers.length
							this.userNames = this.info.InspectionRecordUsers.map(user => user.UserName).join('');
						}
					}

				}
				this.$nextTick(() => {
					this.$refs.form.clearValidate();
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			GetEnterpriseList(id) {
				this.Post('/GetSubEnterpriseList', {
					page: 1,
					rows: 9999
				}).then((res) => {
					if (res.status == 2000) {
						this.EnterpriseList = res.data
						this.GetDepartments(id)
					}
				})
			},
			GetDepartments(id) {
				this.Get("/GetEnterpriseDepartments?enterpriseId=" + id).then((res) => {
					if (res.status == 2000) {
						this.DepartmentCom = res.data;
						// if(this.DepartmentCom && this.DepartmentCom.length > 0){
						// 	this.removeEmptyChildrenDepartment(this.DepartmentCom)
						// }

					}
				});
			},
			removeEmptyChildrenDepartment(data) {
				data.forEach(item => {
					if (item.children && item.children.length === 0) {
						delete item.children;
					} else if (item.children && item.children.length > 0) {
						this.removeEmptyChildrenDepartment(item.children);
					}
				});
			},
			close() {
				this.dislogShow = false;
				this.submitLoading = false;
				this.id = '';
				this.userNames = '';
				this.info = _extends(defaultInfo);
			},
			onChangeDate() {
				this.info.InspectionPlanDate = this.TrainDateRange[0]
				this.info.InspectionPlanEndDate = this.TrainDateRange[1]
			},
			save(type) {
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
							params.SecurityLevel = parseInt(params.SecurityLevel)
							if (params.Enterprises && params.Enterprises.length > 0) {
								params.Enterprises.map(item => {
									item.EnterpriseId = this.info.EnterpriseId
								})
							}
							let urlList = ['/UpdateInspectionPlan','/SaveInspectionPlan']
							console.log(urlList[type])
							let res = await this.Post(urlList[type], params)
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
			async getInspectionNatureCom() {
				let res = await this.Get('/GetInspectionNatureCom');
				if (res.status == 2000) {
					// this.list = res.data.filter(item => item.id != '0030408');
					this.list = res.data
				};
				return Promise.resolve();
			},
			natureChange() {
				let item = this.list.find(item => item.id == this.info.InspectionNatureCode);
				this.info.InspectionNatureName = item.text;
				this.TrainDateRange = []
				this.info.InspectionPlanDate = ""
				this.info.InspectionPlanEndDate = ""
			},
			chooseTable() {
				this.$refs.chooseTable.show().then(res => {
					this.info.InspectionName = res.InspectionName;
					this.info.InspectionId = res.InspectionId;
				});
			},
			chooseUser() {
				// let userInfo = Qs.parse(localStorage.getItem('userinfo'));
				// let enterpriseId = userInfo.EnterpriseId;
				let choosed = (this.info.Enterprises[0] || {}).EnterpriseUsers || [];
				this.$chooseUser({
					choosed: choosed,
				}).then(res => {
					this.isLength = res.length
					this.userNames = res.map(item => item.UserName).join(',');
					this.info.Enterprises = [{
						// EnterpriseId: res.EnterpriseId,
						EnterpriseUsers: res,
					}]
				});
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
			min-width: 600px;
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