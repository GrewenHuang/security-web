<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" :close-on-click-modal="false" @close="close"
		width="50%">
		<el-scrollbar class="scrollbar" ref="scrollbar">
			<el-form :model="info" ref="ruleForm" :rules="rules" :disabled="disabled">
				<div class="form-2-col">
					<el-form-item label="车牌号" prop="car_no">
						<el-input placeholder="请选择" readonly v-model="info.car_no" class="input-with-select">
							<template v-if="!!info.car_no">
								<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
									slot="suffix" @click="removeItemCarNo()"></i>
							</template>
							<el-button slot="append" @click="chooseCar()">选择车牌</el-button>
						</el-input>
					</el-form-item>
					<el-form-item label="责任人" prop="UserName">
						<el-input placeholder="请选择" readonly v-model="info.UserName" class="input-with-select">
							<template v-if="!!info.UserName">
								<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
									slot="suffix" @click="removeItem()"></i>
							</template>
							<el-button slot="append" @click="chooseModerator()">选择人员</el-button>
						</el-input>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<el-form-item label="违法时间" prop="vio_time">
						<el-date-picker v-model="info.vio_time" type="date" clearable value-format="yyyy-MM-dd"
							placeholder="选择日期" style="width: 100%">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="违法城市" prop="vio_city_name">
						<el-input v-model="info.vio_city_name" maxlength="100" show-word-limit></el-input>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<el-form-item label="违法地点" prop="vio_address">
						<el-input v-model="info.vio_address" maxlength="100" show-word-limit></el-input>
					</el-form-item>
					<el-form-item label="违法原因" prop="vio_action">
						<el-input v-model="info.vio_action" maxlength="100" show-word-limit></el-input>
					</el-form-item>
				</div>
				<el-form-item label="违法原因分析" prop="vio_action_desc">
					<el-input type="textarea" rows="5" v-model="info.vio_action_desc" maxlength="200"
						show-word-limit></el-input>
				</el-form-item>
				<div class="form-2-col">
					<el-form-item label="违法归属" prop="decision_num">
						<el-select clearable v-model="info.decision_num" style="width: 100%">
							<el-option v-for="(item, index) in beLongList" :key="index" :label="item.text"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="采集单位" prop="col_organ">
						<el-input v-model="info.col_organ" maxlength="100" show-word-limit></el-input>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<el-form-item label="罚款" prop="vio_fine">
						<el-input-number clearable :min="0" v-model="info.vio_fine"
							style="width: 100%"></el-input-number>
					</el-form-item>
					<el-form-item label="扣分">
						<el-input-number clearable :min="0" :max="12" v-model="info.vio_score"
							style="width: 100%"></el-input-number>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<el-form-item label="处理结果" prop="handle_sign">
						<el-radio-group v-model="info.handle_sign" style="width: 100%">
							<el-radio-button v-for="(item, index) in statusList" :key="index"
								:label="item.id">{{ item.text }}</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="安全等级" prop="SecurityLevel">
						<select-level v-model="info.SecurityLevel" :multiple="false"
							:value="info.SecurityLevel"></select-level>
					</el-form-item>
				</div>
				<el-form-item label="备注" prop="Remark">
					<el-input type="textarea" rows="5" v-model="info.Remark" maxlength="200" show-word-limit></el-input>
				</el-form-item>
        <!-- v-if="info.handle_sign == '2'" -->
				<el-form-item label="图片" prop="ViolationFiles" >
					<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
						:fileList.sync="info.ViolationFiles" list-type="picture-card">
						<i class="el-icon-plus"></i>
					</custom-upload>
				</el-form-item>

			</el-form>
		</el-scrollbar>
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
		props: {},
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
					car_no: RULECONFIG.Select("车牌号"),
					ViolationFiles: [{
						required: true,
						type: 'array',
						message: '请上传图片'
					}]
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

					if(row.handle_sign == 2){
						this.title = '查看'
						this.disabled = true
					}else {
						this.title = '编辑'
						this.disabled = false
					}
					this.info = JSON.parse(JSON.stringify(row))
					this.info.SecurityLevel = this.info.SecurityLevel.toString()

				} else {
					this.title = '新增'
					this.disabled = false
					this.info = {
						VehicleId: "",
						EnterpriseId: "", //企业
						DepartmentId: "", // 部门
						car_no: "", //车牌
						vio_time: "", //违法时间
						UserName: "", // 违法人
						UserId: "", //违法人ID
						vio_city_name: "", // 违法城市
						vio_address: "", // 违法地点
						vio_action: "", // 违法原因
						vio_action_desc: "", // 违法原因分析
						col_organ: "", // 采集单位
						decision_num: "", // 归属
						vio_fine: "", // 罚款
						vio_score: "", // 扣分
						SecurityLevel: "1", // 安全等级
						handle_sign: 1, // 处理结果
						Remark: "", // 备注
						ViolationFiles: []
					}
				}
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0
				});
				// this.filters.TrainTaskId = id;
				// this.getList();
			},
			close() {
				this.dislogShow = false;
			},
			chooseModerator() {
				// 选择人员
				this.$chooseUser({
					single: false,
				}).then(data => {
					this.info.UserName = data.UserName
					this.info.UserId = data.UserId
				});
			},
			chooseCar() {
				this.$chooseCar({
					single: false,
				}).then(data => {
					this.info.VehicleId = data.VehicleId
					this.info.EnterpriseId = data.EnterpriseId
					this.info.DepartmentId = data.DepartmentId
					this.info.car_no = data.LicensePlateNumber
				});
			},
			removeItemCarNo() {
				// 删除所选车牌
				this.info.VehicleId = ''
				this.info.EnterpriseId = ''
				this.info.DepartmentId = ''
				this.info.car_no = ''
			},
			removeItem() {
				// 删除所选人员
				this.info.UserName = '';
				this.info.UserId = '';
			},
			addSubmit(formName) {
				//保存
				this.btnloading = true
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.info.SecurityLevel = parseInt(this.info.SecurityLevel)
						this.Post("/SaveVehicleViolationRec", this.info).then(
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
