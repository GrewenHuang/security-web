<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<select-enterpirse clearable placeholder="企业" collapseTags
					v-model="search_value.EnterpriseId"></select-enterpirse>
				<el-select placeholder="演练类型" v-model="search_value.DrillTypeCode" clearable>
					<el-option v-for="(item, i) in DrillTypeCom" :key="i" :value="item.id"
						:label="item.text"></el-option>
				</el-select>
				<el-input placeholder="演练名称" v-model="search_value.DrillName"></el-input>
				<el-input placeholder="演练地点" v-model="search_value.DrillLocation"></el-input>
				<el-date-picker type="daterange" v-model="DrillDate" value-format="yyyy-MM-dd" range-separator="至"
					start-placeholder="演练开始日期" end-placeholder="演练结束日期">
				</el-date-picker>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</div>

			<div class="f--c">
				<!-- <el-button @click="downloadmbs(1210, 12105,filters)">导出</el-button> -->
				<!-- <el-button>导出</el-button> -->
				<el-button type="primary" icon="el-icon-plus" @click="showAdddialog" v-if="$_has('YJYLBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" align="center" label="企业">
			</el-table-column>
			<el-table-column prop="DrillTypeName" label="演练类型" align="center" width="150">
			</el-table-column>
			<el-table-column prop="DrillDateDesc" align="center" label="演练时间" width="180">
			</el-table-column>
			<el-table-column prop="DrillName" align="center" label="演练名称">
			</el-table-column>

			<el-table-column prop="DrillLocation" align="center" label="演练地点">
			</el-table-column>
			<el-table-column prop="DrillPeopleNumber" align="center" width="80" label="演练人数">
			</el-table-column>
			<el-table-column prop="DrillVisitorPeopleNumber" align="center" width="80" label="观摩人数">
			</el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="editList(scope.row.DrillId)" v-if="$_has('YJYLBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="deleList(scope.row.DrillId)" v-if="$_has('YJYLBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" width="1000px">
			<el-scrollbar class="scrollbar">
				<el-form :model="parms" ref="ruleForm" :rules="rules">
					<div class="form-2-col">

						<el-form-item label="演练类型" prop="DrillTypeCode">
							<el-select class="el-input" placeholder="请选择演练类型" v-model="parms.DrillTypeCode" clearable>
								<el-option v-for="(item, i) in DrillTypeCom" :key="i" :value="item.id"
									:label="item.text"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="安全等级" prop="SecurityLevel">
							<select-level v-model="parms.SecurityLevel" :multiple="false"
								:value="parms.SecurityLevel"></select-level>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="演练时间" prop="DrillDate">
							<div class="el-input">
								<el-date-picker style="width: 100%;" v-model="parms.DrillDate" type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
								</el-date-picker>
							</div>
						</el-form-item>
						<el-form-item label="演练名称" prop="DrillName">
							<el-input placeholder="请输入演练名称" maxlength="100" v-model="parms.DrillName"
								show-word-limit></el-input>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="演练地点" prop="DrillLocation">
							<el-input placeholder="请输入演练地点" v-model="parms.DrillLocation" maxlength="100"
								show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="演练人数">
							<el-input-number :min="1" v-model="parms.DrillPeopleNumber" :max="10000"></el-input-number>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="观摩人数">
							<el-input-number :min="0" v-model="parms.DrillVisitorPeopleNumber"
								:max="10000"></el-input-number>
						</el-form-item>
						<el-form-item label="应急预案">
							<el-select class="el-input" v-model="parms.ReservePlanId" clearable>
								<el-option v-for="item in EnterpriseEmergencyReservePlans" :key="item.ReservePlanId"
									:value="item.ReservePlanId" :label="item.ReservePlanName"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<el-form-item label="演练内容">
						<el-input maxlength="500" v-model="parms.DrillContent" type="textarea" show-word-limit>
						</el-input>
					</el-form-item>
					<el-form-item label="演练照片">
						<el-upload class="el-input" :action="url()" :accept="upload.image_suffix" :multiple="true"
							list-type="picture-card" :before-upload="before" :on-change="
                                (file, fileList) => {
                                    change(file, 1);
                                }
                            " :before-remove="
                                (file, fileList) => {
                                    return before_remove(file, 1);
                                }
                            " :file-list="arrFilesFun(1)" :on-preview="preview">
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="演练视频" class="el_upload">
						<el-upload :action="url()" accept=".mp4" class="el-upload el-input" list-type="text"
							:before-upload="before" :on-change="
                                (file, fileList) => {
                                    change(file, 4);
                                }
                            " :before-remove="
                                (file, fileList) => {
                                    return before_remove(file, 4);
                                }
                            " :file-list="arrFilesFun(4)" :on-preview="preview">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item label="演练评估" class="el_upload">
						<el-upload :action="url()" :accept="upload.all_suffix" class="el-upload el-input"
							list-type="text" :before-upload="before" :on-change="
                                (file, fileList) => {
                                    change(file, 2);
                                }
                            " :before-remove="
                                (file, fileList) => {
                                    return before_remove(file, 2);
                                }
                            " :file-list="arrFilesFun(2)" :on-preview="preview">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item label="附件" class="el_upload">
						<el-upload :action="url()" :accept="upload.all_suffix" class="el-upload el-input"
							list-type="text" :before-upload="before" :on-change="
                                (file, fileList) => {
                                    change(file, 3);
                                }
                            " :before-remove="
                                (file, fileList) => {
                                    return before_remove(file, 3);
                                }
                            " :file-list="arrFilesFun(3)" :on-preview="preview">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-form-item>
				</el-form>
			</el-scrollbar>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogClear">取消</el-button>
				<el-button type="primary" @click.native="addSubmit('ruleForm')" :loading="btnloading">提交</el-button>
			</div>
		</el-dialog>
		<!--弹层结束-->
	</page-layout>
</template>



<script>
	import RULECONFIG from "@/common/ruleConfig";
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import zySelect from '@/components/common/zy_select.vue';
	import Import_export from "@/mixins/Import_export.js";
	export default {
		components: {
			zySelect
		},
		mixins: [request_mixin, upload_mixin,Import_export],
		data() {
			return {
				pages: {
					page: 1,
					rows: 10,
					total: 0,
				},
				loading: false,
				dialogTitle: "新增",
				addShow: false,
				btnloading: false,
				formWidth: "100px",
				DrillDate: [],
				DrillTypeCom: [], //演练类型
				search_value: {
					DrillTypeCode: "",
					DrillName: "",
					DrillName: "",
					DrillLocation: "",
					DrillDateStart: "",
					DrillDateEnd: "",
				},
				list: [],
				EnterpriseEmergencyReservePlans: [], //应急预案下拉
				parms: {
					DrillTypeCode: "", //string 演练类型 必填
					DrillName: "", // string 演练名称 必填
					DrillDate: "", // datetime 演练日期 必填
					DrillLocation: "", // string 演练地点 必填
					DrillPeopleNumber: 1, // int 演练人数 必填
					DrillVisitorPeopleNumber: 0, // int 观摩人数
					ReservePlanId: "", // long 应急预案Id 必填
					DrillContent: "", // string 演练内容 选填
					DrillPics: "", // array 图片 选填
					DrillassessmentAttas: "", // array 评估 选填
					DrillAttas: "", // array 附件 选填
					EmergencyDrillPlanId: '', // 应急演练计划名称
					SecurityLevel: "1",
				},
				rules: {
					SecurityLevel: RULECONFIG.Select("安全等级"),
					DrillTypeCode: RULECONFIG.Select("演练类型"),
					// DrillName: RULECONFIG.Text("演练名称"),
					DrillDate: RULECONFIG.DateTime("演练日期"),
					// DrillLocation: RULECONFIG.Select("演练地点")
					// EmergencyDrillPlanId: RULECONFIG.Select("演练计划"),
				},
			};
		},
		methods: {
			async GetEmergencyDrillTypeCom() {
				return await this.Get("/GetEmergencyDrillTypeCom");
			},
			GetEnterpriseEmergencyReservePlans() {
				this.Get("/GetEnterpriseEmergencyReservePlans").then((res) => {
					if (res.status == 2000) {
						this.EnterpriseEmergencyReservePlans = res.data;
					}
				});
				// if(that.differenceTemp.balance_reason = '0'){
				//   that.differenceTemp.balance_reason=''
				// }
			},
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			showAdddialog() {
				this.GetEnterpriseEmergencyReservePlans();
				this.addShow = true;
				this.parms = {
					DrillName: "", // string 演练名称 必填
					DrillDate: "", // datetime 演练日期 必填
					DrillLocation: "", // string 演练地点 必填
					DrillPeopleNumber: 1, // int 演练人数 必填
					DrillVisitorPeopleNumber: 0, // int 观摩人数 必填
					ReservePlanId: "", // long 应急预案Id 必填
					DrillContent: "", // string 演练内容 选填
					DrillPics: "", // array 图片 选填
					DrillassessmentAttas: "", // array 评估 选填
					DrillAttas: "", // array 附件 选填
					SecurityLevel: "1",
				};
			},
			dialogClear() {
				this.addShow = false;
				this.upload.arrFiles = [
					[],
					[],
					[],
					[],
					[]
				];
			},
			GetList() {
				this.Post("/GetEnterpriseEmergencyDrills", {
					...this.search_value,
					page: this.pages.page,
					rows: this.pages.rows,
				}).then((res) => {
					if (res.status == 2000) {
						this.loading = false;
						this.pages.total = res.data.count;
						this.list = res.data.list;
					}
				});
				this.GetEmergencyDrillTypeCom().then((res) => {
					if (res.status == 2000) {
						this.DrillTypeCom = res.data;
					}
				});
			},
			deleList(Id) {
				this.$confirm("确认删除该条数据吗？").then((_) => {
					this.Get("/DeleteEmergencyDrill", {
						Id,
					}).then((res) => {
						if (res.status == 2000) {
							this.GetList();
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
			editList(Id) {
				this.addShow = true;
				this.GetEnterpriseEmergencyReservePlans();
				this.Get("/GetEnterpriseEmergencyDrill", {
					Id
				}).then((res) => {
					if (res.status == 2000) {
						this.upload.arrFiles[1] = res.data.DrillPics;
						this.upload.arrFiles[2] = res.data.DrillassessmentAttas;
						this.upload.arrFiles[3] = res.data.DrillAttas;
						this.upload.arrFiles[4] = res.data.DrillVideos;
						this.parms = res.data;
						this.parms.DrillId = Id;
						this.parms.ReservePlanId =
							this.parms.ReservePlanId == 0 ?
							" " :
							this.parms.ReservePlanId;
						this.parms.SecurityLevel = this.parms.SecurityLevel ? this.parms.SecurityLevel.toString() : "1"
					}
				});
			},
			addSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.btnloading = true;
						let params = JSON.parse(JSON.stringify(this.parms))
						params.DrillPics = this.upload.arrFiles[1];
						params.DrillassessmentAttas = this.upload.arrFiles[2];
						params.DrillAttas = this.upload.arrFiles[3];
						params.DrillVideos = this.upload.arrFiles[4];
						params.SecurityLevel = parseInt(params.SecurityLevel)
						this.Post("/SaveEmergencyDrill", params).then((res) => {
							if (res.status == 2000) {
								this.$message({
									message: "保存成功",
									type: "success",
								});
								this.GetList();
								this.addShow = false;
								this.btnloading = false;
							} else {
								this.$message.error(res.message);
								this.btnloading = false;
							}
						});
					}
				});
			},
			handleSearch() {
				//搜索
				if (this.DrillDate != null) {
					this.search_value.DrillDateStart = this.DrillDate[0];
					this.search_value.DrillDateEnd = this.DrillDate[1];
				} else {
					this.search_value.DrillDateStart = "";
					this.search_value.DrillDateEnd = "";
				}
				this.handleCurrentChange(1);
			},
			add() {
				this.items.push({
					name: "",
					phone: "",
					index: 0,
				});
			},
			del(i) {
				this.items.splice(i, 1);
			},
		},
		mounted() {
			this.upload.arrFiles = [
				[],
				[],
				[],
				[],
				[]
			];
			this.GetList();
		},
	};
</script>

<style lang="scss" scoped>
	/deep/ .el-form--inline .el-form-item__content {
		width: 85%;
	}

	/deep/ .head .el-form-item__content {
		width: 100% !important;
	}

	/deep/ .el-input-number {
		position: relative;
		display: inline-block;
		width: 100% !important;
		line-height: 38px;
	}

	/deep/ .el-upload--picture-card {
		width: 60px;
		height: 60px;
		line-height: 60px;
	}

	/deep/ .el-upload-list--picture-card .el-upload-list__item {
		width: 60px;
		height: 60px;
		line-height: 70px;
	}

	/deep/ .el-upload .el-upload--text {
		width: 100%;
		height: 50px;
		line-height: 0;
	}

	/deep/ .el_upload .el-upload {
		display: inline-block;
		text-align: left;
		cursor: pointer;
		outline: 0;
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
</style>