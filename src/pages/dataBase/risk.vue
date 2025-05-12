<!-- 风险库 /data-base-risk -->
<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!-- <div slot="header" class="header f-c">
            <div class="header-tab f-c-c">
                <div class="item" :class="{active: QueryScope == 1}" @click="changeStore(1)">公库</div>
                <div class="item" :class="{active: QueryScope == 0}" @click="changeStore(0)">私库</div>
            </div>
        </div> -->
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-select v-model="filters.RiskTypeCode" placeholder="风险类型" clearable>
					<el-option v-for="item in TypeCom" :key="item.id" :value="item.id" :label="item.text">
					</el-option>
				</el-select>
				<el-select v-model="filters.RiskLevelCode" placeholder="风险等级" clearable>
					<el-option v-for="item in RiskLevelList" :key="item.id" :value="item.id" :label="item.text">
					</el-option>
				</el-select>
				<el-input v-model="filters.RiskUnitName" placeholder="风险单元"></el-input>
				<el-input v-model="filters.RiskPointName" placeholder="风险点"></el-input>
				<el-button type="primary" @click="handleSearch()">查询</el-button>
			</div>
			<div class="f-c-c">
				<el-button-group style="margin-right: 20px;">
					<el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=7')" v-if="$_has('FXKBtnDown')">下载导入模板</el-button>
					<el-button  v-if="$_has('FXKBtnImport')">
						<el-upload action="#" :show-file-list="false" :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportViewRiskControl', {IsPrivate: 0});
                                }
                            " accept=".xls,.xlsx" :auto-upload="false">导入
						</el-upload>
					</el-button>
					<el-button @click="downloadmbs(40, 401, filters)"  v-if="$_has('FXKBtnExport')">导出</el-button>
				</el-button-group>

				<el-button type="primary" icon="el-icon-plus" @click="add()"
					v-if="QueryScope == 0 && $_has('FXKBtnAdd')">新增</el-button>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table :data="pages.list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="所属公司" align="center" width="180" prop="EnterpriseName"></el-table-column>
			<el-table-column label="风险类型" align="center" width="100" prop="RiskTypeName">
			</el-table-column>
			<el-table-column label="风险单元" align="center" width="150" prop="RiskUnitName">
			</el-table-column>
			<el-table-column label="风险点" align="center" width="200" prop="RiskPointName">
			</el-table-column>
			<el-table-column label="风险因素" align="center" prop="RiskFactors" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="事故类型" align="center" width="120" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.RiskAccidentTypeList.join('\r') }}
				</template>
			</el-table-column>
			<el-table-column label="风险级别" align="center" width="100">
				<template slot-scope="scope">
					<el-tag :color="scope.row.RiskLevelBgColor" size="small"
						style="color: #fff;border-color:transparent;" :hit="false">
						{{ scope.row.RiskLevelName }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="250">
				<template slot-scope="scope">
					<el-button type="text" @click="edit(1, scope.row)"  v-if="$_has('FXKBtnLook')">查看</el-button>
					<el-button type="text" @click="edit(2, scope.row)"  v-if="$_has('FXKBtnEdit')">编辑</el-button>
					<el-popconfirm title="是否删除该数据？" icon-color="red" @confirm="DeleteData(scope.row.RiskControlId)">
						<el-button type="text" text-plain slot="reference"  v-if="$_has('FXKBtnDelete')">删除</el-button>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<!-- 列表 结束 -->
		<!--编辑弹层 开始-->
		<el-dialog v-dialog-drag :title="edits.dialogEditTitle" :visible.sync="edits.EditShow"
			:close-on-click-modal="false" @close="close()" top="8vh" width="50%">
			<template>
				<el-scrollbar class="scrollbar">
					<el-form :rules="edits.rules" ref="editsform" :model="edits.Data" :disabled="isLook">
						<div class="form-col">
							<el-form-item label="风险单元" prop="RiskUnitName">
								<el-input v-model="edits.Data.RiskUnitName"></el-input>
							</el-form-item>
							<el-form-item label="风险点" prop="RiskPointName">
								<el-input v-model="edits.Data.RiskPointName"></el-input>
							</el-form-item>
						</div>
						<div class="form-col">
							<el-form-item label="风险类型" prop="RiskTypeCode">
								<el-select class="el-input" v-model="edits.Data.RiskTypeCode" placeholder="风险类型">
									<el-option v-for="item in TypeCom" :key="item.id" :value="item.id"
										:label="item.text">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="风险级别" prop="RiskLevelCode">
								<el-select class="el-input" v-model="edits.Data.RiskLevelCode" placeholder="风险级别">
									<el-option v-for="item in RiskLevelList" :key="item.id" :value="item.id"
										:label="item.text">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
						<el-form-item label="风险因素" prop="RiskFactors">
							<el-input v-model="edits.Data.RiskFactors"></el-input>
						</el-form-item>
						<el-form-item label="事故类型" prop="RiskAccidentTypeList" class="picker">
							<div class="el-input" v-for="(item, index) in edits.Data
                                    .RiskAccidentTypeList" :key="'rid' + index"
								style="display: flex; margin-bottom: 2px;">
								<el-input class="gutter" type="text" v-model="
                                        edits.Data.RiskAccidentTypeList[
                                            index
                                        ]
                                    ">
									<template slot="prepend">{{
                                        index + 1
                                    }}</template>
								</el-input>
								<el-button @click="RiskAccidentTypeAdd(index)" v-if="index == 0"
									type="text">新增</el-button>
								<el-button @click="
                                        RiskAccidentTypeReduce(index)
                                    " v-if="index != 0" type="text">删除</el-button>
							</div>
						</el-form-item>
						<el-form-item label="管控措施" prop="MeasuresList" class="picker">
							<div class="el-input" v-for="(item, index) in edits.Data
                                    .MeasuresList" :key="'mid' + index" style="display: flex;margin-bottom: 2px;">
								<el-input class="gutter" type="text" v-model="
                                        edits.Data.MeasuresList[index]
                                    " prefix-icon="">
									<template slot="prepend">{{
                                        index + 1
                                    }}</template>
								</el-input>
								<el-button @click="MeasureAdd()" v-if="index == 0" type="text">新增</el-button>
								<el-button @click="MeasureReduce(index)" v-if="index != 0" type="text">删除</el-button>
							</div>
						</el-form-item>
						<el-form-item label="备注" prop="Remark">
							<el-input v-model="edits.Data.Remark"></el-input>
						</el-form-item>
					</el-form>
				</el-scrollbar>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="close()">取消</el-button>
					<el-button type="primary" :loading="edits.dialogSaveLoading" slot="reference"
						@click="dialogEditSave()" v-if="!isLook">提交</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 编辑弹层 结束 -->
	</page-layout>
</template>
<script>
	import RULECONFIG from "@/common/ruleConfig";
	import request_mixin from "@/mixins/request-mixin.js";
	import formatter_mixin from "@/mixins/formatter-mixin.js";
	import page_mixin from "@/mixins/page-minxin.js";
	import Import_export from "@/mixins/Import_export.js";
	import Download from "@/mixins/Download.js";
	const IsPrivate = 0;
	export default {
		mixins: [
			request_mixin,
			formatter_mixin,
			page_mixin,
			Import_export,
			Download,
		],
		data() {
			return {
				isLook: false,
				RiskLevelList: [], //风险级别列表
				TypeCom: [],
				loading: false, //页面加载遮罩层显示状态
				pages: {
					page: 1,
					rows: 10,
					list: [],
					count: 0,
				},
				//查询条件
				filters: {
					IsPrivate,
					RiskTypeCode: "",
					RiskLevelCode: "",
					RiskUnitName: "",
					RiskPointName: "",
				},
				//编辑
				edits: {
					EditShow: false,
					dialogEditShow: false, //弹窗显示状态
					dialogSaveLoading: false, //保存提交状态
					dialogEditTitle: "", //弹窗标题
					dialogFormLabelWidth: "120px", //弹窗表单label宽度
					//编辑数据
					Data: {},
					//表单验证规则
					rules: {
						RiskUnitName: RULECONFIG.Text("风险单元"),
						RiskPointName: RULECONFIG.Text("风险点"),
						RiskLevelCode: RULECONFIG.Select("风险级别"),
						RiskTypeCode: RULECONFIG.Select("风险类型"),
						RiskFactors: RULECONFIG.Text("风险因素"),
						RiskAccidentTypeList: RULECONFIG.Text("事故类型"),
						MeasuresList: RULECONFIG.Text("管控措施"),
					},
				},
				QueryScope: 0
			};
		},
		//自定义方法
		methods: {
			//打开弹窗
			add() {
				var that = this;
				that.edits.EditShow = true
				that.isLook = false
				that.edits.dialogEditTitle = "新增";
				that.dialogEditInit();
			},
			edit(index, row) {
				this.edits.EditShow = true
				if(index == 1){
					this.isLook = true
					this.edits.dialogEditTitle = "查看";
				}else {
					this.isLook = false
					this.edits.dialogEditTitle = "编辑";
				}
				this.Get("/GetRiskControl", {
					riskControlId: row.RiskControlId,
					IsPrivate
				}).then((result) => {
					//检查频次
					if (result.status == 2000) {
						this.edits.Data = result.data;
					}
				});
			},
			//初始化弹窗数据
			dialogEditInit() {
				var that = this;
				that.edits.Data = {
					//初始化编辑数据
					RiskControlId: "0", //Id
					RiskUnitName: "", //风险点Id
					RiskPointName: "", //风险点名称
					RiskLevelCode: "", //风险级别编码
					RiskFactors: "", //危险因素描述
					RiskAccidentTypeList: [""],
					MeasuresList: [""],
					Remark: "",
				};
			},
			close() {
				this.edits.EditShow = false
			},
			//关闭弹窗
			dialogEditClose() {
				var that = this;
				this.$refs.editsform && this.$refs.editsform.resetFields();
				that.edits.dialogEditShow = false;
				that.edits.dialogSaveLoading = false;
			},
			//保存弹窗数据
			dialogEditSave() {
				var that = this;
				that.$refs.editsform.validate((valid) => {
					if (valid) {
						that.edits.dialogSaveLoading = true;
						that.Post("/SaveRiskControlBase", {
							...that.edits.Data,
							IsPrivate,
						}).then(
							function(result) {
								if (result && result.status == 2000) {
									that.$message({
										message: "保存成功",
										type: "success",
									});
									that.edits.dialogEditShow = false;
									that.edits.EditShow = false
									that.GetList();
								} else {
									that.$message({
										message: result.Message || result.message,
										type: "error",
									});
								}
								that.edits.dialogSaveLoading = false;
								that.loading = false;
							}
						);
					}
				});
			},
			RiskAccidentTypeAdd(index) {
				this.edits.Data.RiskAccidentTypeList.push("");
			},
			RiskAccidentTypeReduce(index) {
				this.edits.Data.RiskAccidentTypeList.splice(index, 1);
			},
			//管控措施条目增减
			MeasureAdd() {
				this.edits.Data.MeasuresList.push("");
			},
			MeasureReduce(index) {
				this.edits.Data.MeasuresList.splice(index, 1);
			},
			//加载列表数据
			GetList() {
				let that = this;
				let params = Object.assign({
						page: that.pages.page,
						rows: that.pages.rows,
						IsPrivate,
						QueryScope: 2 || this.QueryScope
					},
					that.filters
				);
				that.loading = true;
				that.Post("/GetRiskControlBaseList", params).then(
					function(result) {
						that.loading = false;
						if (result && result.status == 2000) {
							that.pages.list = result.data.list;
							that.pages.total = result.data.count;
						}
					},
					function(err) {
						that.loading = false;
						that.$message.error({
							showClose: true,
							message: err.toString(),
							duration: 2000,
						});
					}
				);
			},
			//删除列表数据
			DeleteData(Id) {
				let that = this;
				that.loading = true;
				that.Post("/DeleteRiskControl", {
					Id: Id,
					IsPrivate
				}).then((result) => {
					if (result.status != 2000) {
						that.$message({
							message: result.message,
							type: "error",
						});
						return;
					} else {
						that.$message({
							message: "删除成功",
							type: "success",
						});
						that.GetList();
					}
				});
			},
			changeStore(num) {
				if (this.QueryScope == num) return;
				this.QueryScope = num;
				this.handleSearch(1);
			},
		},
		//页面初始化加载事件
		mounted() {
			var that = this;
			that.Get("/GetRiskTypeCom", {}).then((result) => {
				//风险类型
				if (result.status == 2000) {
					that.TypeCom = result.data;
				}
			});
			that.Get("/GetRiskLevelCom", {}).then((result) => {
				//风险分级
				if (result.status == 2000) {
					that.RiskLevelList = result.data;
				}
			});
			this.GetList();
		},
	};
</script>
<style lang="scss" scoped>
	.el-select {
		width: 100%;
	}

	.gutter {
		margin-right: 20px;
	}

	/deep/.el-button+.el-button,
	.el-checkbox.is-bordered+.el-checkbox.is-bordered {
		margin-left: 0px;
	}

	.table {
		width: 100%;
		border: 1px solid #666;
		border-collapse: collapse;
		margin-bottom: 20px;
	}

	.table tr {
		width: 100%;
	}

	.table tr td {
		width: 25%;
		border: 1px solid #666;
		text-align: center;
		padding: 10px;
	}

	.header {
		position: relative;
		padding-bottom: 24px;
		font-size: 18px;
		font-weight: 600;

		.header-tab {
			margin: 0 auto;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				border-radius: 74px;
				border: 1px solid #fff;
				width: 74px;
				height: 74px;
				background: #63B0FF url(../../assets/images/data-base/learn.png) no-repeat center center;
				background-size: cover;
			}
		}

		.item {
			border-radius: 6px;
			padding: 15px 72px;
			background: #fff;
			color: $--color-primary;
			cursor: pointer;

			&.active {
				background: $--color-primary;
				color: #fff;
			}
		}

		.operation {
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
		}
	}
</style>
