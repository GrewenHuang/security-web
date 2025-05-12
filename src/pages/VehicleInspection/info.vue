<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" :close-on-click-modal="false" @close="close"
		width="50%">
		<!-- <el-scrollbar class="scrollbar"> -->
		<el-form :model="info" ref="ruleForm" :rules="rules">
			<div class="form-2-col">
				<el-form-item label="企业" prop="EnterpriseId">
				   <select-enterpirse clearable placeholder="企业" collapseTags v-model="info.EnterpriseId" @clear="info.DepartmentId = ''"></select-enterpirse>
				</el-form-item>
				<el-form-item label="部门" prop="DepartmentId">
					<cascader-department placeholder="部门" clearable v-model="info.DepartmentId" :enterpriseId="info.EnterpriseId" :disabled="!info.EnterpriseId ? true : false"></cascader-department>
				</el-form-item>
			</div>
			<div class="form-2-col">
				<el-form-item label="巡检人" prop="Users">
					<el-input placeholder="请选择" readonly v-model="info.UserName" class="input-with-select">
						<template v-if="!!info.UserName">
							<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;" slot="suffix"
								@click="removeItem()"></i>
						</template>
						<el-button slot="append" @click="chooseModerator()">选择人员</el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="巡检车辆" prop="Vehicles">
					<el-input placeholder="请选择" readonly v-model="info.VehiclesName" class="input-with-select">
						<template v-if="!!info.VehiclesName">
							<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;" slot="suffix"
								@click="removeItemCarNo()"></i>
						</template>
						<el-button slot="append" @click="chooseCar()">选择车牌</el-button>
					</el-input>
				</el-form-item>
			</div>
			<div class="form-2-col">
				<el-form-item label="周期" prop="CycleCode">
					<el-select clearable v-model="info.CycleCode" style="width: 100%" placeholder="周期"
						:disabled="disabled">
						<el-option v-for="(item, index) in cycleList" :key="index" :label="item.text"
							:value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="安全等级" prop="SecurityLevel">
					<select-level v-model="info.SecurityLevel" :multiple="false"
						:value="info.SecurityLevel"></select-level>
				</el-form-item>
			</div>
			<!-- <el-form-item label="备注" prop="Remark">
					<el-input type="textarea" rows="5" v-model="info.Remark" maxlength="200" show-word-limit></el-input>
				</el-form-item> -->
		</el-form>
		<!-- </el-scrollbar> -->
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" @click.native="addSubmit('ruleForm')" :loading="btnloading">提交</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import RULECONFIG from "@/common/ruleConfig";
	import request_mixin from '@/mixins/request-mixin';
	import Import_export from "@/mixins/Import_export.js";
	export default {
		mixins: [request_mixin, Import_export],
		props: {
			cycleList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				btnloading: false,
				disabled: false,
				title: '新增',
				id: '',
				loading: false,
				dislogShow: false,
				info: {},
				rules: {
					EnterpriseId: RULECONFIG.Select("企业"),
					DepartmentId: RULECONFIG.Select("部门"),
					UserId: RULECONFIG.Select("车牌号"),
					SecurityLevel: RULECONFIG.Select("安全等级"),
					CycleCode: RULECONFIG.Select("周期"),
					Vehicles:[{
						required: true,
						type: 'array',
						message: '请选择车牌'
					}],
					Users: [{
						required: true,
						type: 'array',
						message: '请选择人员'
					}] // 如果多选的情况下
				},
				beLongList: [],
				statusList: [{
						id: '1',
						text: "未处理"
					},
					{
						id: '2',
						text: "已处理"
					}
				]
			}
		},
		methods: {
			async show(row) {
				this.dislogShow = true;
				this.btnloading = false;
				await this.Get('/GetIllegalAttributionCom').then((res) => {
					this.beLongList = res.data
				})
				if (row) {
					this.title = '编辑'
					this.disabled = true
					this.info = JSON.parse(JSON.stringify(row))
					this.info.SecurityLevel = this.info.SecurityLevel.toString()
					if(this.info.Vehicles && this.info.Vehicles.length > 0){
						let arr = []
						this.info.Vehicles.map(item =>{
							arr.push(item.LicensePlateNumber)
						})
						this.$set(this.info, 'VehiclesName', arr.join(','));
					}
					if(this.info.Users && this.info.Users.length > 0){
						this.info.UserName = this.info.Users.map(item => item.UserName).join(',')
					}
				} else {
					this.title = '新增'
					this.disabled = false
					this.info = {
						Vehicles: [],
						EnterpriseId: "", //企业
						DepartmentId: "", // 部门
						VehiclesName: "",
						UserName: "", 
						UserId: "", 
						SecurityLevel: "1",
						Users: []
					}
				}
				// this.filters.TrainTaskId = id;
				// this.getList();
			},
			close() {
				this.dislogShow = false;
			},
			chooseModerator() {
				// 选择人员
				this.$chooseUser({
					single: true,
				}).then(data => {
					// this.info.UserName = data.UserName
					// this.info.UserId = data.UserId
					// this.info.EnterpriseId = data.EnterpriseId
					// this.info.DepartmentId = data.DepartmentId
					this.info.UserName = data.map(item => item.UserName).join(',')
					let arr = []
					data.map(item =>{
						let obj = {
							UserId: item.UserId
						}
						arr.push(obj)
					})
					this.info.Users = arr
				});
			},
			chooseCar() {
				this.$chooseCar({
					single: true,
				}).then(data => {
					let arr = []
					this.info.Vehicles = data.map(item =>{
						arr.push(item.LicensePlateNumber)
						return {
							VehicleId: item.VehicleId
						}
					})
					this.info.VehiclesName = arr.join(',')
				});
			},
			removeItemCarNo() {
				// 删除所选车牌
				this.info.Vehicles = []
				this.info.VehiclesName = ""
			},
			removeItem() {
				// 删除所选人员
				this.info.UserName = '';
				this.info.Users = [];
			},
			addSubmit(formName) {
				//保存
				this.btnloading = true
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = JSON.parse(JSON.stringify(this.info))
						params.SecurityLevel = parseInt(params.SecurityLevel)
						this.Post("/SaveVehicleSafelyCheckPlan", params).then(
							(res) => {
								if (res.status == 2000) {
									this.$message({
										message: "保存成功",
										type: "success",
									});

									this.dislogShow = false
									this.btnloading = false;
									this.$emit('success')
								} else {
									this.$message.error(res.message);
									this.btnloading = false;
								}
							}
						);
					}
				});
				this.btnloading = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-2-col {
		display: flex;

		>div {
			width: 50%;

			&:first-child {
				margin-right: 40px;
			}
		}
	}
</style>