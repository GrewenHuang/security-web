<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<select-enterpirse clearable placeholder="企业" collapseTags
					v-model="search_value.EnterpriseId"></select-enterpirse>
				<el-select placeholder="队伍类型" v-model="search_value.TeamTypeCode" clearable>
					<el-option v-for="(item, i) in s_EmergencyTeamTypeCom" :key="i" :value="item.id"
						:label="item.text"></el-option>
				</el-select>
				<el-input placeholder="队伍名称" v-model="search_value.TeamName"></el-input>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</div>
			<div class="f--c">
				<!-- <el-button @click="downloadmbs(1210, 12105,filters)">导出</el-button> -->
				<!-- <el-button>导出</el-button> -->
				<el-button type="primary" icon="el-icon-plus" @click="showAdddialog"  v-if="$_has('YJDWBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" align="center" label="企业">
			</el-table-column>
			<el-table-column prop="TeamTypeName" align="center" width="200" label="队伍类型">
			</el-table-column>
			<el-table-column prop="TeamName" align="center" label="队伍名称">
			</el-table-column>
			<el-table-column label="队伍负责人" align="center" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.TeamDirector.UserName }} /
						{{ scope.row.TeamDirector.Tel }}</span>
				</template>
			</el-table-column>
			<el-table-column label="分管负责人" align="center" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.ChargeDirector.UserName }} /
						{{ scope.row.ChargeDirector.Tel }}</span>
				</template>
			</el-table-column>

			<el-table-column prop="OtherMemberCount" align="center" label="成员数量" width="80">
			</el-table-column>
			<!-- <el-table-column label="安全等级" align="center" width="80"  prop="SecurityLevel"></el-table-column> -->
			<el-table-column label="操作" align="center" header-align="center" width="200">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="editList(scope.row.TeamId)" v-if="$_has('YJDWBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="deleList(scope.row.TeamId)" v-if="$_has('YJDWBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" width="60%">
			<el-scrollbar class="scrollbar">
				<el-form :model="parms" ref="ruleForm" :rules="rules">
					<div class="form-3-col">
						<el-form-item label="队伍类型" prop="TeamTypeCode">
							<el-select placeholder="请选择队伍类型" clearable v-model="parms.TeamTypeCode">
								<el-option v-for="(item, i) in EmergencyTeamTypeCom" :key="i" :value="item.id"
									:label="item.text"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="队伍名称" prop="TeamName">
							<el-input placeholder="请输入队伍名称" maxlength="100" v-model="parms.TeamName" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="安全等级" prop="SecurityLevel">
							<select-level v-model="parms.SecurityLevel" :multiple="false"
								:value="parms.SecurityLevel"></select-level>
						</el-form-item>
					</div>
					<el-row>
						<el-col :span="24">
							<el-form-item label="队伍负责人">
								<div class="el-input">
									<el-col :span="5">
										<el-input v-model="parms.TeamDirector.UserName">
											<template slot="prepend">姓名</template>
										</el-input>
									</el-col>
									<el-col :span="6">
										<el-input v-model="parms.TeamDirector.Tel">
											<template slot="prepend">电话</template>
										</el-input>
									</el-col>
									<el-col :span="13">
										<el-input v-model="parms.TeamDirector.Address">
											<template slot="prepend">地址</template>
										</el-input>
									</el-col>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="分管负责人">
								<div class="el-input">
									<el-col :span="5">
										<el-input v-model="parms.ChargeDirector.UserName">
											<template slot="prepend">姓名</template>
										</el-input>
									</el-col>
									<el-col :span="6">
										<el-input v-model="parms.ChargeDirector.Tel">
											<template slot="prepend">电话</template>
										</el-input>
									</el-col>
									<el-col :span="13">
										<el-input v-model="parms.ChargeDirector.Address">
											<template slot="prepend">地址</template>
										</el-input>
									</el-col>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="成员名单">
								<div class="el-input">
									<el-row v-for="(item, i) in parms.OtherMemberList" :key="i"
										:style="{marginTop: i != 0 ? '5px': 0}">
										<el-col :span="5">
											<el-input v-model="item.UserName">
												<template slot="prepend">姓名</template>
											</el-input>
										</el-col>
										<el-col :span="6">
											<el-input v-model="item.Tel">
												<template slot="prepend">电话</template>
											</el-input>
										</el-col>
										<el-col :span="12">
											<el-input v-model="item.Address">
												<template slot="prepend">地址</template>
											</el-input>
										</el-col>
										<el-col :span="1" :offset="1">
											<el-button type="text" @click="add()" v-if="item.flag == 1">新增</el-button>
											<el-button type="text" @click="del(i)" v-else>删除</el-button>
										</el-col>
									</el-row>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
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
	import Import_export from "@/mixins/Import_export.js";
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
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
				formWidth: "100px",
				s_EmergencyTeamTypeCom: [], //搜索类型下拉
				EmergencyTeamTypeCom: [], //类型下拉
				search_value: {
					TeamName: "",
					TeamTypeCode: "",
				},
				list: [],
				parms: {
					TeamName: "", // string 应急队伍名称 必填
					TeamTypeCode: "", // string 应急队伍类型 必填
					SecurityLevel: "1",
					TeamDirector: {
						UserName: "",
						Tel: "",
						Address: "",
					}, // object 队伍负责人 选填
					ChargeDirector: {
						UserName: "",
						Tel: "",
						Address: "",
					}, // object 分管负责人 选填
					OtherMemberList: [{
						UserName: "",
						Tel: "",
						Address: "",
						flag: 1
					}, ], // array 其他成员 选填
				},
				rules: {
					TeamName: RULECONFIG.Text("队伍名称"),
					TeamTypeCode: RULECONFIG.Select("队伍类型"),
					SecurityLevel: RULECONFIG.Select("安全等级"),
				},
			};
		},
		methods: {
			async GetEmergencyTeamTypeCom() {
				return await this.Get("/GetEmergencyTeamTypeCom");
			},
			showAdddialog() {
				(this.parms = {
					TeamName: "", // string 应急队伍名称 必填
					TeamTypeCode: "", // string 应急队伍类型 必填
					SecurityLevel: "1",
					TeamDirector: {
						UserName: "",
						Tel: "",
						Address: "",
					}, // object 队伍负责人 选填
					ChargeDirector: {
						UserName: "",
						Tel: "",
						Address: "",
					}, // object 分管负责人 选填
					OtherMemberList: [{
						UserName: "",
						Tel: "",
						Address: "",
						flag: 1
					}, ], // array 其他成员 选填
				}),
				(this.addShow = true);
				this.GetEmergencyTeamTypeCom().then((res) => {
					if (res.status == 2000) {
						this.EmergencyTeamTypeCom = res.data;
					}
				});
			},
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			dialogClear() {
				this.addShow = false;
			},
			editList(Id) {
				this.addShow = true;
				this.GetEmergencyTeamTypeCom().then((res) => {
					if (res.status == 2000) {
						this.EmergencyTeamTypeCom = res.data;
					}
				});

				this.Get("/GetEnterpriseEmergencyTeam", {
					Id
				}).then((res) => {
					if (res.status == 2000) {
						this.parms = res.data;
						this.parms.OtherMemberList[0].flag = 1;
						this.parms.SecurityLevel = this.parms.SecurityLevel ? this.parms.SecurityLevel.toString() :
							"1"
						this.parms.TeamId = Id;
					}
				});
			},
			deleList(Id) {
				this.$confirm("确认删除该条数据吗？").then((_) => {
					this.Get("/DeleteEmergencyTeam", {
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
			GetList() {
				this.Post("/GetEnterpriseEmergencyTeams", {
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
			},
			addSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = JSON.parse(JSON.stringify(this.parms))
						params.SecurityLevel = parseInt(params.SecurityLevel)
						this.btnloading = true;
						this.Post("/SaveEmergencyTeam", params).then((res) => {
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
				this.handleCurrentChange(1);
			},
			add() {
				this.parms.OtherMemberList.push({
					name: "",
					phone: "",
					Address: "",
					index: 0,
				});
			},
			del(i) {
				this.parms.OtherMemberList.splice(i, 1);
			},
		},
		mounted() {
			this.GetEmergencyTeamTypeCom().then((res) => {
				if (res.status == 2000) {
					this.s_EmergencyTeamTypeCom = res.data;
				}
			});
			this.loading = true;
			this.GetList();
		},
	};
</script>

<style scoped>
	.el-select {
		width: 100%;
	}

	/deep/ .head .el-form-item__content {
		width: 100% !important;
	}

	/deep/ .el-col-offset-1 {
		margin-left: 0px;
	}

	.form-3-col {
		display: flex;

		>div {
			flex: 1;

			&:not(:last-child) {
				margin-right: 20px;
			}
		}
	}
</style>