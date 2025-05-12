<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<select-enterpirse clearable placeholder="企业" collapseTags
					v-model="search_value.EnterpriseId"></select-enterpirse>
				<el-select placeholder="预案类型" v-model="search_value.ReservePlanTypeCode" clearable>
					<el-option v-for="(item, i) in s_ReservePlanTypeCom" :key="i" :value="item.id"
						:label="item.text"></el-option>
				</el-select>
				<el-input placeholder="预案名称" v-model="search_value.EmergencyReservePlanName"
					style="min-width: 200px"></el-input>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</div>

			<div class="f-c-c">
				<!-- <el-button @click="downloadmbs(1210, 12105,filters)">导出</el-button> -->
				<!-- <el-button>导出</el-button> -->
				<el-button type="primary" icon="el-icon-plus" @click="showAdddialog"  v-if="$_has('YJYABtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table highlight-current-row :data="list" :header-cell-style="$tableStyle">
			<el-table-column label="序号" type="index" align="center" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" align="center" label="企业">
			</el-table-column>
			<el-table-column prop="ReservePlanTypeName" label="应急预案类型" align="center" width="120">
			</el-table-column>
			<el-table-column prop="ReservePlanName" align="center" label="应急预案名称">
			</el-table-column>

			<el-table-column prop="RegisterDepartment" align="center" label="备案部门">
			</el-table-column>
			<el-table-column label="指挥长/电话" align="center" width="170">
				<template slot-scope="scope">
					<span>{{ scope.row.Commander.UserName }} /
						{{ scope.row.Commander.Tel }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="RegisterNo" align="center" label="备案登记号" width="150">
			</el-table-column>
			<el-table-column label="是否备案" align="center" width="80">
				<template slot-scope="scope">
					<whether :yes="scope.row.IsRegister == 1" :text="scope.row.IsRegister ? '是' : '否'" />
				</template>
			</el-table-column>
			<!-- <el-table-column label="安全等级" align="center" width="80"  prop="SecurityLevel"></el-table-column> -->
			<el-table-column label="操作" align="center" width="200">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="editList(scope.row.ReservePlanId)"  v-if="$_has('YJYABtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="deleList(scope.row.ReservePlanId)" v-if="$_has('YJYABtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" width="50%">
			<el-scrollbar class="scrollbar">
				<el-form :model="parms" ref="ruleForm" :rules="rules">
					<div class="form-2-col">
						<el-form-item label="应急预案类型" prop="ReservePlanTypeCode">
							<el-select class="el-input" placeholder="请选择预案类型" v-model="parms.ReservePlanTypeCode"
								clearable>
								<el-option v-for="(item, i) in ReservePlanTypeCom" :key="i" :value="item.id"
									:label="item.text"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="应急预案名称" prop="ReservePlanName">
							<el-input placeholder="请输入应急预案名称" v-model="parms.ReservePlanName" maxlength="100"
								show-word-limit></el-input>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="安全等级" prop="SecurityLevel">
							<select-level v-model="parms.SecurityLevel" :multiple="false"
								:value="parms.SecurityLevel"></select-level>
						</el-form-item>
						<el-form-item label="是否已备案">
							<div class="el-input">
								<el-radio-group size="mini" @change="isBox()" v-model="parms.IsRegister">
									<el-radio-button :label="item.id + ''" v-for="(item, i) in WhetherCom"
										:key="i">{{ item.text }}</el-radio-button>
								</el-radio-group>
							</div>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="备案部门" v-if="isBoxs">
							<el-input maxlength="100" v-model="parms.RegisterDepartment" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="备案登记号" v-if="isBoxs">
							<el-input maxlength="50" v-model="parms.RegisterNo" show-word-limit></el-input>
						</el-form-item>
					</div>
					<el-form-item label="指挥长">
						<div class="el-input form-col">
							<el-input maxlength="10" show-word-limit v-model="parms.Commander.UserName">
								<template slot="prepend">姓名</template>
							</el-input>
							<el-input maxlength="11" show-word-limit v-model="parms.Commander.Tel">
								<template slot="prepend">电话</template>
							</el-input>
						</div>
					</el-form-item>
					<el-form-item label="副指挥长">
						<template>
							<div class="el-input form-col" v-for="(
                                item, i
                            ) in parms.Vice_CommanderList" :key="i">
								<el-input maxlength="10" show-word-limit v-model="item.UserName">
									<template slot="prepend">姓名</template>
								</el-input>
								<el-input maxlength="11" v-model="item.Tel" show-word-limit>
									<template slot="prepend">电话</template>
								</el-input>
								<div class="f" style="flex: initial;margin-left: 10px;">
									<el-button icon="el-icon-plus" size="mini" type="primary" @click="add(1)"
										v-if="item.flag == 1"></el-button>
									<el-button icon="el-icon-delete" size="mini" type="danger" @click="del(i, 1)"
										v-else></el-button>
								</div>
							</div>
						</template>
					</el-form-item>
					<el-form-item label="其他成员">
						<template>
							<div class="el-input form-col" v-for="(item, i) in parms.OtherMemberList" :key="i">
								<el-input maxlength="10" show-word-limit v-model="item.UserName">
									<template slot="prepend">姓名</template>
								</el-input>
								<el-input maxlength="11" v-model="item.Tel" show-word-limit>
									<template slot="prepend">电话</template>
								</el-input>
								<div class="flex" style="flex: initial;margin-left:10px;">
									<el-button icon="el-icon-plus" size="mini" type="primary" @click="add(0)"
										v-if="item.flag == 1"></el-button>
									<el-button icon="el-icon-delete" size="mini" type="danger" @click="del(i, 0)"
										v-else></el-button>
								</div>
							</div>
						</template>
					</el-form-item>
					<el-form-item label="附件" class="el_upload">
						<el-upload :action="url()" :accept="upload.all_suffix" class="el-input el-upload"
							list-type="text" :before-upload="before" :on-change="
                            (file, fileList) => {
                                change(file, 1);
                            }
                        " :before-remove="
                            (file, fileList) => {
                                return before_remove(file, 1);
                            }
                        " :file-list="arrFilesFun(1)" :on-preview="preview">
							<el-button size="small" type="primary">上传</el-button>
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
	import Import_export from "@/mixins/Import_export.js";
	export default {
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
				formWidth: "120px",
				isBoxs: false,
				search_value: {
					ReservePlanTypeCode: "",
					EmergencyReservePlanName: "",
				},
				s_ReservePlanTypeCom: [], //搜索预案下拉
				ReservePlanTypeCom: [], //预案下拉
				WhetherCom: [], //是否
				list: [],
				parms: {
					ReservePlanAttas: "", //附件
					ReservePlanName: "", //string 应急预案名称 必填
					ReservePlanTypeCode: "", //string 应急预案类型 必填
					IsRegister: 0, //int 是否备案 选填
					RegisterDepartment: "", //string 备案部门 (备案状态为是: 必填,备案状态为否: 不填)
					RegisterNo: "", // string 备案号 (备案状态为是: 必填,备案状态为否: 不填)
					SecurityLevel: "1",
					Commander: {
						UserName: "",
						Tel: "",
					}, //object 指挥长 必填
					Vice_CommanderList: [{
						UserName: "",
						Tel: "",
						flag: 1,
					}, ], //array 副指挥长 选填
					OtherMemberList: [{
						UserName: "",
						Tel: "",
						flag: 1,
					}, ], // array 其他成员 选填
				},

				rules: {
					ReservePlanName: RULECONFIG.Text("应急预案名称"),
					ReservePlanTypeCode: RULECONFIG.Select("预案类型"),
					SecurityLevel: RULECONFIG.Select("安全等级"),

				},
			};
		},
		methods: {
			async GetReservePlanTypeCom() {
				return await this.Get("/GetReservePlanTypeCom");
			},
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},

			GetList() {
				this.loading = true;
				this.Post("/GetEnterpriseEmergencyReservePlans", {
					...this.search_value,
					page: this.pages.page,
					rows: this.pages.rows,
				}).then((res) => {
					if (res.status == 2000) {
						this.loading = false;
						this.pages.total = res.data.count;
						this.list = res.data.list;
					}
				}).finally(() => {
					this.loading = false;
				});
			},

			deleList(Id) {
				this.$confirm("确认删除该条数据吗？").then((_) => {
					this.Get("/DeleteEmergencyReservePlan", {
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

			showAdddialog() {
				this.upload.arrFiles = [
					[],
					[],
					[],
					[],
					[]
				];
				this.addShow = true;
				this.parms = {
					ReservePlanAttas: "", //附件
					ReservePlanName: "", //string 应急预案名称 必填
					ReservePlanTypeCode: "", //string 应急预案类型 必填
					IsRegister: 0, //int 是否备案 选填
					RegisterDepartment: "", //string 备案部门 (备案状态为是: 必填,备案状态为否: 不填)
					RegisterNo: "", // string 备案号 (备案状态为是: 必填,备案状态为否: 不填)
					SecurityLevel: "1",
					Commander: {
						UserName: "",
						Tel: "",
					}, //object 指挥长 必填
					Vice_CommanderList: [{
						UserName: "",
						Tel: "",
						flag: 1,
					}, ], //array 副指挥长 选填
					OtherMemberList: [{
						UserName: "",
						Tel: "",
						flag: 1,
					}, ], // array 其他成员 选填
				};
				this.isBox();
				this.GetReservePlanTypeCom().then((res) => {
					if (res.status == 2000) {
						this.ReservePlanTypeCom = res.data;
					}
				});
				this.Get("GetWhether").then((res) => {
					//是否
					if (res.status === 2000) {
						this.WhetherCom = res.data;
					}
				});
			},

			editList(Id) {
				this.addShow = true;
				this.GetReservePlanTypeCom().then((res) => {
					if (res.status == 2000) {
						this.ReservePlanTypeCom = res.data;
					}
				});
				this.Get("/GetWhether").then((res) => {
					//是否
					if (res.status === 2000) {
						this.WhetherCom = res.data;
					}
				});
				this.Get("/GetEnterpriseEmergencyReservePlan", {
					Id
				}).then(
					(res) => {
						if (res.status == 2000) {
							this.parms = res.data;
							this.parms.Vice_CommanderList[0].flag = 1;
							this.parms.OtherMemberList[0].flag = 1;
							this.parms.ReservePlanId = Id;
							this.parms.SecurityLevel = this.parms.SecurityLevel ? this.parms.SecurityLevel.toString() :
								"1"
							this.upload.arrFiles[1] = res.data.ReservePlanAttas;
							this.isBox();
						}
					}
				);
			},
			isBox() {
				if (this.parms.IsRegister == 0) {
					this.isBoxs = false;
				} else {
					this.isBoxs = true;
				}
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
			addSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = JSON.parse(JSON.stringify(this.parms))
						this.btnloading = true;
						params.SecurityLevel = parseInt(params.SecurityLevel)
						params.ReservePlanAttas = this.upload.arrFiles[1];
						this.Post("/SaveEmergencyReservePlan", params).then(
							(res) => {
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
							}
						);
					}
				});
			},
			handleSearch() {
				//搜索
				this.GetList();
			},
			add(v) {
				if (v == 1) {
					this.parms.Vice_CommanderList.push({
						UserName: "",
						Tel: "",
						flag: 0,
					});
				} else {
					this.parms.OtherMemberList.push({
						UserName: "",
						Tel: "",
						flag: 0,
					});
				}
			},
			del(i, v) {
				if (v == 1) {
					this.parms.Vice_CommanderList.splice(i, 1);
				} else {
					this.parms.OtherMemberList.splice(i, 1);
				}
			},
		},
		mounted() {
			this.loading = true;
			this.upload.arrFiles = [
				[],
				[],
				[],
				[],
				[]
			];
			this.GetReservePlanTypeCom().then((res) => {
				if (res.status == 2000) {
					this.s_ReservePlanTypeCom = res.data;
				}
			});
			this.GetList();
		},
	};
</script>

<style scoped>
	/deep/ .head .el-form-item__content {
		width: 100% !important;
	}

	/deep/ .el_upload .el-upload {
		display: inline-block;
		text-align: left;
		cursor: pointer;
		outline: 0;
	}

	/deep/ .el-upload-list__item {
		transition: none !important;
	}
	 .form-2-col{
	            display: flex;
	            >div{
	                width: 50%;
	                &:first-child{
	                    margin-right: 40px;
	                }
	            }
	        }
</style>