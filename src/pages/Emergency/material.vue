<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<select-enterpirse clearable placeholder="企业" collapseTags
					v-model="search_value.EnterpriseId"></select-enterpirse>
				<el-cascader :options="s_options" :show-all-levels="false" :clearable="true"
					v-model="search_value.Catalogue"></el-cascader>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</div>

			<div class="f--c">
				<!-- <el-button @click="downloadmbs(1210, 12105,filters)">导出</el-button> -->
				<!-- <el-button>导出</el-button> -->
				<el-button type="primary" icon="el-icon-plus" @click="showAdddialog"  v-if="$_has('YJWZBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table highlight-current-row :data="list" :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" align="center" label="企业">
			</el-table-column>
			<el-table-column label="应急物资类别" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.CatalogueList.length">
						<span v-for="(item, i) in scope.row.CatalogueList" :key="i">{{ item.Name
                            }}<span v-if="i < scope.row.CatalogueList.length - 1">>></span></span>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="Location" align="center" label="存放地点">
			</el-table-column>

			<el-table-column align="center" label="主要负责人" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.Director.UserName }} /
						{{ scope.row.Director.Tel }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="保管责任人" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.Vice_Director.UserName }} /
						{{ scope.row.Vice_Director.Tel }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="MaterialQuantity" align="center" label="数量" width="80">
			</el-table-column>
			<!-- <el-table-column label="安全等级" align="center" width="80"  prop="SecurityLevel"></el-table-column> -->
			<el-table-column label="操作" align="center" header-align="center" width="200">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="editList(scope.row.MaterialId)"  v-if="$_has('YJWZBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="deleList(scope.row.MaterialId)"  v-if="$_has('YJWZBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->
		<el-dialog v-dialog-drag title="地图" :visible.sync="MapShow" :close-on-click-modal="false" @close="ClearMap"
			width="50%">
			<Map @Map="getMap($event)" :fatherMethod="ClearMap" />
		</el-dialog>
		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" width="50%">
			<el-scrollbar class="scrollbar">
				<el-form :model="parms" ref="ruleForm" :rules="rules">
					<div class="form-2-col">
						<el-form-item label="应急物资类别">
							<el-cascader :options="options" v-model="parms.Catalogue"></el-cascader>
						</el-form-item>
						<el-form-item label="安全等级" prop="SecurityLevel">
							<select-level v-model="parms.SecurityLevel" :multiple="false"
								:value="parms.SecurityLevel"></select-level>
						</el-form-item>
					</div>
					<div class="form-2-col">
						<el-form-item label="数量">
							<el-input-number :min="1" v-model="parms.MaterialQuantity" :max="100000"></el-input-number>
						</el-form-item>
						<el-form-item label="存放地点">
							<el-input maxlength="100" show-word-limit v-model="parms.Location"></el-input>
						</el-form-item>
					</div>
					<div class="form-col">
						<el-form-item label="经度">
							<el-input v-model="parms.Longitude" disabled></el-input>
						</el-form-item>
						<el-form-item label="纬度">
							<el-input v-model="parms.Latitude" disabled></el-input>
						</el-form-item>
						<el-form-item style="width: 100px;flex:initial;margin-top:auto;margin-left: 10px;">
							<el-button class="el-input" size="mini" @click="showMap()" icon="el-icon-s-promotion"
								type="warning" round>地图选点</el-button>
						</el-form-item>
					</div>
					<el-form-item label="主要负责人">
						<div class="el-input form-col">
							<el-input maxlength="10" show-word-limit v-model="parms.Director.UserName">
								<template slot="prepend">姓名</template>
							</el-input>
							<el-input maxlength="11" show-word-limit v-model="parms.Director.Tel">
								<template slot="prepend">电话</template>
							</el-input>
						</div>
					</el-form-item>
					<el-form-item label="保管责任人">
						<div class="el-input form-col">
							<el-input maxlength="10" show-word-limit v-model="parms.Vice_Director.UserName">
								<template slot="prepend">姓名</template>
							</el-input>
							<el-input maxlength="11" show-word-limit v-model="parms.Vice_Director.Tel">
								<template slot="prepend">电话</template>
							</el-input>
						</div>
					</el-form-item>
					<el-row>
						<el-col :span="24">
							<el-form-item label="备注">
								<el-input maxlength="500" type="textarea" show-word-limit v-model="parms.Remark">
								</el-input>
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
	import Map from "@/components/common/map";
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	export default {
		components: {
			Map,
		},
		mixins: [request_mixin, upload_mixin,Import_export],

		data() {
			return {
				pages: {
					page: 1,
					rows: 10,
					total: 0,
				},
				MapShow: false,
				loading: false,
				dialogTitle: "新增",
				addShow: false,
				btnloading: false,
				formWidth: "100px",
				options: [], //物质下拉
				s_options: [], //搜索
				list: [],
				search_value: {
					Catalogue: "",
				},
				parms: {
					Catalogue: "", // string 物资类别 必填
					MaterialQuantity: "", // int 物资数量 必填
					Longitude: "", // double 经度 必填
					Latitude: "", // double 纬度 必填
					Location: "", // string 存放地点 选填
					SecurityLevel: "1",
					Director: {
						UserName: "",
						Tel: "",
					}, // object 主负责人 选填
					Vice_Director: {
						UserName: "",
						Tel: "",
					}, // object 副负责人 选填
					Remark: "", // string 备注 选填
				},
				rules: {
					Catalogue: RULECONFIG.Select("物资类别"),
					MaterialQuantity: RULECONFIG.Select("物资数量"),
					Longitude: RULECONFIG.Select("经度"),
					Latitude: RULECONFIG.Select("纬度"),
					SecurityLevel: RULECONFIG.Select("安全等级"),
				},
			};
		},
		methods: {
			GetEnterpriseEmergencyMaterialCatalogue() {
				this.Get("/GetEnterpriseEmergencyMaterialCatalogue").then((res) => {
					if (res.status == 2000) {
						this.options = this.filter(res.data);
					}
				});
			},
			filter(options) {
				options.filter((res) => {
					if (res.children.length == 0) {
						delete res.children;
						return res;
					} else {
						this.filter(res.children);
					}
				});
				return options;
			},
			showAdddialog() {
				(this.parms = {
					Catalogue: "", // string 物资类别 必填
					MaterialQuantity: "", // int 物资数量 必填
					Longitude: "", // double 经度 必填
					Latitude: "", // double 纬度 必填
					Location: "", // string 存放地点 选填
					SecurityLevel: "1",
					Director: {
						UserName: "",
						Tel: "",
					}, // object 主负责人 选填
					Vice_Director: {
						UserName: "",
						Tel: "",
					}, // object 副负责人 选填
					Remark: "", // string 备注 选填
				}),
				this.GetEnterpriseEmergencyMaterialCatalogue();
				this.addShow = true;
			},
			dialogClear() {
				this.addShow = false;
			},
			GetList() {
				this.Post("/GetEnterpriseEmergencyMaterials", {
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
			editList(Id) {
				this.addShow = true;
				this.GetEnterpriseEmergencyMaterialCatalogue();

				this.Get("/GetEnterpriseEmergencyMaterial", {
					Id
				}).then((res) => {
					if (res.status == 2000) {
						this.parms = res.data;
						this.parms.SecurityLevel = this.parms.SecurityLevel ? this.parms.SecurityLevel.toString() :
							"1"
						this.parms.ReservePlanId = Id;
					}
				});
			},
			deleList(Id) {
				this.$confirm("确认删除该条数据吗？").then((_) => {
					this.Get("/DeleteEmergencyMaterial", {
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
			addSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.btnloading = true;
						this.parms.Catalogue =
							typeof this.parms.Catalogue == "object" ?
							this.parms.Catalogue[
								this.parms.Catalogue.length - 1
							] :
							this.parms.Catalogue;
						this.parms.SecurityLevel = parseInt(this.parms.SecurityLevel)
						this.Post("/SaveEmergencyMaterial", this.parms).then(
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
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			handleSearch() {
				//搜索
				if (this.search_value.Catalogue != null) {
					this.search_value.Catalogue =
						this.search_value.Catalogue[
							this.search_value.Catalogue.length - 1
						];
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
			getMap(data) {
				this.MapShow = false;
				this.parms.Longitude = data.Longitude;
				this.parms.Latitude = data.Latitude;
				this.parms.Location = data.Address;
			},
			ClearMap() {
				this.MapShow = false;
			},
			showMap() {
				this.MapShow = true;
			},
		},
		mounted() {
			this.GetList();

			this.Get("/GetEnterpriseEmergencyMaterialCatalogue").then((res) => {
				if (res.status == 2000) {
					this.s_options = this.filter(res.data);
				}
			});
		},
	};
</script>

<style scoped>
	/deep/ .el-input-number {
		position: relative;
		display: inline-block;
		width: 100% !important;
		line-height: 38px;
	}

	/deep/ .el-cascader {
		display: inline-block;
		position: relative;
		font-size: 14px;
		line-height: 40px;
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
</style>