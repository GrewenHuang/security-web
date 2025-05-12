<template>
	<el-dialog v-dialog-drag title="组织架构" :visible.sync="dislogShow" @close="close()" width="70%"
		top="8vh" v-loading="loading" element-loading-text="数据加载中" :append-to-body="true">
		<el-scrollbar ref="scrollbar" class="scrollbar">
			<div class="f-b-c" style="margin-bottom: 10px;">
				<div>
					<el-button style="padding: 12px 26px" @click="dialogtreeShow()">查看组织架构</el-button>
				</div>
				<div>
					<el-button type="primary" icon="el-icon-plus" @click="dialogEditOpen(-1)">新增</el-button>
				</div>
			</div>
			<el-table class="tableStyle" :data="tableData" style="width: 100%" row-key="DepartmentId" default-expand-all
				:header-cell-style="$tableStyle" :tree-props="{ children: 'children' }">
				<el-table-column label="序号" header-align="center" align="center" type="index" width="60">
				</el-table-column>
				<el-table-column prop="Name" align="center" label="部门名称" width="300" show-overflow-tooltip></el-table-column>
				<el-table-column prop="Head" align="center" label="部门负责人"></el-table-column>
				<el-table-column prop="Describe" label="部门职责"></el-table-column>
				<el-table-column prop="Sort" align="center" label="排序"></el-table-column>
				<el-table-column prop="CreateByName" header-align="center" align="center" label="创建人"></el-table-column>
				<el-table-column prop="CreateTimeDesc" header-align="center" align="center"
					label="创建时间"></el-table-column>
				<el-table-column prop="operation" header-align="center" align="center" label="操作" width="200">
					<template slot-scope="scope">
						<el-button type="text" v-if="$_has('ZZJGUpdate')" @click="dialogEditOpen(1, scope.row)">编辑</el-button>
						<el-button type="text"  text-plain @click="DeleteData(scope.row.DepartmentId)"
							v-if="scope.row.children == 0 && $_has('ZZJGDelete')">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog v-dialog-drag :title="edits.dialogEditTitle" :visible.sync="edits.dialogEditShow"
				:close-on-click-modal="false" :append-to-body="true" @close="dialogEditClose()" width="40%" top="8vh">
				<template>
					<el-form :rules="edits.rules" ref="editsform" :model="parms">
						<el-row>
							<el-col :span="24">
								<el-form-item label="上级部门">
									<!-- <el-select class="el-input" placeholder="请选择上级部门" v-model="parms.ParentDepartmentId"
										clearable filterable>
										<el-option :label="item.Name" v-for="(item, i) in Departments" :key="i"
											:value="item.DepartmentId + ''"></el-option>
									</el-select> -->
									<el-cascader v-model="parms.ParentDepartmentId" clearable :options="tableData" placeholder="上级部门"
										:show-all-levels="false"
										style="width: 100%"
										:props="{ value: 'DepartmentId', label: 'Name', children: 'children',emitPath: false,checkStrictly: true  }">
									</el-cascader>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24">
								<el-form-item label="部门名称" prop="Name">
									<el-input placeholder="请输入部门名称" maxlength="100" show-word-limit
										v-model="parms.Name"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24">
								<el-form-item label="部门负责人" prop="Head">
									<el-input placeholder="请输入部门负责人" maxlength="20" show-word-limit
										v-model="parms.Head"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24">
								<el-form-item label="排序" prop="Head">
									<el-input-number :min="1" :max="1000" style="width: 100%"
										v-model="parms.Sort"></el-input-number>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24">
								<el-form-item label="部门职责">
									<el-input type="textarea" v-model="parms.Describe" rows="5" cols="78"
										placeholder="请输入部门职责" maxlength="1000" show-word-limit></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="dialogEditClose()">取消</el-button>

						<el-button type="primary" :loading="edits.dialogSaveLoading" @click="dialogEditSave()"
							slot="reference">提交</el-button>
					</div>
				</template>
			</el-dialog>
			<!-- 编辑弹层 结束 -->

			<el-dialog v-dialog-drag title="组织架构" :close-on-click-modal="false" @close="dialogtreeClose()"
				:visible.sync="dialogtreeshow" :append-to-body="true" width="1100px">
				<el-row style="display: flex; align-items: center">
					<el-col :span="5">
						<el-switch :active-value="false" :inactive-value="true" active-text="竖排显示" inactive-text="横排显示"
							v-model="horizontal" active-color="#409eff" inactive-color="#dddddd">
						</el-switch>
					</el-col>
					<el-col :span="4">
						<el-switch :active-value="true" :inactive-value="false" active-text="收缩" inactive-text="展开"
							v-model="treeStatus" active-color="#409eff" inactive-color="#dddddd" @change="treeChange()">
						</el-switch>
					</el-col>
					<el-col :span="6">
						<el-switch :active-value="true" :inactive-value="false" active-text="去掉子节点收缩"
							inactive-text="显示子节点收缩" active-color="#409eff" inactive-color="#dddddd"
							v-model="collapsable">
						</el-switch>
					</el-col>

					<!-- <el-col :span="5">
						<span>背景切换：</span>
						<el-select style="width: 40% !important" v-model="labelClassName">
							<el-option v-for="(item, i) in labelClassArr" :key="i" :label="item.name"
								:value="item.value"></el-option>
						</el-select>
					</el-col> -->
					<el-col :span="9" style="text-align: right;">
						<el-button @click="exportOrgTree">导出</el-button>
					</el-col>
				</el-row>
				<div style="margin: 0 auto; width: 100%; text-align: center">
					<vue2-org-tree ref="orgTree" :data="treeData" :horizontal="horizontal"
						:label-class-name="treeLabelClassName" @on-expand="onExpand" :collapsable="collapsable" />
				</div>
			</el-dialog>
		</el-scrollbar>
	</el-dialog>
</template>

<script>
	import API_BASIC from "@/api/api_basic";
	import API_ENTERPRISE from "@/api/api_enterprise";
	import RULECONFIG from "@/common/ruleConfig";
	import html2canvas from 'html2canvas';
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		mixins: [request_mixin],
		data() {
			return {
				dislogShow: false,
				collapsable: true,
				treeStatus: true,
				horizontal: false,
				labelClassArr: [{
						name: "蓝色",
						value: "bg-color-blue"
					},
					{
						name: "绿色",
						value: "bg-color-green"
					},
					{
						name: "灰色",
						value: "bg-color-ccc"
					},
					{
						name: "黄色",
						value: "bg-color-yellow"
					},
					{
						name: "红色",
						value: "bg-color-red"
					},
					{
						name: "白色",
						value: "bg-color-wihte"
					},
				],
				labelClassName: "bg-color-blue",
				treeData: [],
				dialogtreeshow: false,
				loading: false, //页面加载遮罩层显示状态
				dialogAttachmentShow: false, //附件弹窗显示状态
				tableData: [], //表格数据
				Departments: [], //上级部门下拉框数据
				StatusList: [], //状态列表
				enterpriseId: '',
				parms: {
					Name: "",
					ParentDepartmentId: "",
					Describe: "",
					Sort: 0,
					Remark: "",
					Status: 1,
					// Users: []
				},
				//编辑
				edits: {
					dialogEditShow: false, //弹窗显示状态
					dialogSaveLoading: false, //保存提交状态
					dialogEditTitle: "", //弹窗标题
					dialogFormLabelWidth: "150px", //弹窗表单label宽度
					dialogFormLabelWidths: "250px",

					//表单验证规则
					rules: {
						Name: RULECONFIG.Text("部门名称"),
					},
				},
			}
		},
		computed: {
			treeLabelClassName() {
				return this.labelClassName
			}
		},
		methods: {
			async show(item) {
				this.dislogShow = true;
				if (item) {
					this.loading = true;
					this.info = item;
					this.info.RelationId = item.EnterpriseId
					this.enterpriseId = item.EnterpriseId
					this.GetList()
					this.GetEnterpriseStructure()
					this.loading = false;
				}
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			close() {
				this.dislogShow = false;
				this.exportLoading = false;
			},
			treeChange() {
				this.toggleExpand(this.treeData, this.treeStatus);
			},
			toggleExpand(data, val) {
				var _this = this;
				if (Array.isArray(data)) {
					data.forEach(function(item) {
						_this.$set(item, "expand", val);
						if (item.children) {
							_this.toggleExpand(item.children, val);
						}
					});
				} else {
					_this.$set(data, "expand", val);
					if (data.children) {
						_this.toggleExpand(data.children, val);
					}
				}
			},
			collapse(list) {
				var _this = this;
				list.forEach(function(child) {
					if (child.expand) {
						child.expand = false;
					}
					child.children && _this.collapse(child.children);
				});
			},
			onExpand(e, data) {
				if ("expand" in data) {
					data.expand = !data.expand;
					if (!data.expand && data.children) {
						this.collapse(data.children);
					}
				} else {
					this.$set(data, "expand", true);
				}
			},
			dialogtreeClose() {
				this.dialogtreeshow = false;
			},

			dialogtreeShow() {
				this.dialogtreeshow = true;
				this.toggleExpand(this.treeData, this.treeStatus);
				this.$nextTick(() => {
					// console.log(this.$refs.orgTree)
				});
			},
			exportOrgTree() {
				let el = this.$refs.orgTree.$el
				html2canvas(el, {
					backgroundColor: 'white',
					useCORS: true, //支持图片跨域
					scale: 1, //设置放大的倍数
					height: el.scrollHeight,
					windowHeight: el.scrollHeight
				}).then(canvas => {
					let base64 = canvas.toDataURL('image/png', 1.0);
					let blob = dataURLtoBlob(base64);
					let objurl = URL.createObjectURL(blob);
					let link = document.createElement('a');
					link.download = 'org-tree.png';
					link.href = objurl;
					link.click();
					link.remove();
					link = null;

					function dataURLtoBlob(dataurl) {
						let arr = dataurl.split(','),
							mime = arr[0].match(/:(.*?);/)[1],
							bstr = atob(arr[1]),
							n = bstr.length,
							u8arr = new Uint8Array(n);
						while (n--) {
							u8arr[n] = bstr.charCodeAt(n);
						}
						return new Blob([u8arr], {
							type: mime
						});
					}
				});
			},
			//打开弹窗
			dialogEditOpen(index, row) {
				this.GetEnterpriseDepartments();
				var that = this;

				if (index == -1) {
					//新增
					that.edits.dialogEditTitle = "新增";
					that.dialogEditInit();
				} else {
					//编辑
					that.edits.dialogEditTitle = "编辑";
					let {
						Name,
						Status,
						ParentDepartmentId,
						Describe,
						Sort,
						Remark,
						Head,
					} = row;
					ParentDepartmentId = ParentDepartmentId == 0 ? "" : ParentDepartmentId;
					// ParentDepartmentId = ParentDepartmentId.toString();
					this.parms = {
						Name,
						Status,
						ParentDepartmentId,
						Describe,
						Sort,
						Remark,
						Head,
						DepartmentId: row.DepartmentId,
					};
				}

				that.edits.dialogEditShow = true;
			},
			//初始化弹窗数据
			dialogEditInit() {
				this.GetEnterpriseDepartments();
				var that = this;
				that.parms = {
					Name: null,
					ParentDepartmentId: "",
					Describe: null,
					Sort: 0,
					Remark: null,
					Status: 1,
				};
			},
			//关闭弹窗
			dialogEditClose() {
				var that = this;
				that.edits.dialogEditShow = false;
			},
			//保存弹窗数据
			dialogEditSave() {
				var that = this;
				that.$refs.editsform.validate((valid) => {
					if (valid) {
						that.edits.dialogSaveLoading = true;
						that.parms.EnterpriseId = that.info.EnterpriseId
						that.parms.RelationId = that.info.RelationId
						API_ENTERPRISE.SaveEnterpriseDepartment(that.parms).then(
							(result) => {
								if (result.status != 2000) {
									this.$message({
										message: result.message,
										type: "error",
									});
								} else {
									this.$message({
										message: "保存成功",
										type: "success",
									});

									that.dialogEditInit();
									that.edits.dialogEditShow = false;
									that.GetList();
									this.GetEnterpriseStructure();
								}

								that.edits.dialogSaveLoading = false;
							}
						);
					}
				});
			},

			//获取上级部门下拉框数据
			GetEnterpriseDepartments() {
				// API_ENTERPRISE.GetEnterpriseDepartments().then((res) => {
				// 	this.Departments = res.data;
				// });
				this.Get('/GetEnterpriseDepartmentsByEnterpriseId?enterpriseId=' + this.enterpriseId).then(res => {
					this.Departments = res.data;
				})
			},

			//加载列表数据
			GetList() {
				let that = this;
				that.loading = true;
				this.Get('/GetTreeEnterpriseDepartments?enterpriseId=' + this.enterpriseId).then(res => {
					that.loading = false;
					if (res.status == 2000) {
						that.tableData = res.data;
					} else {
						that.$message({
							message: res.message,
							type: "error",
						});
					}
				})
				// API_ENTERPRISE.GetTreeEnterpriseDepartments({
				// 				EnterpriseId: this.enterpriseId,
				// 			})
				// 	.then(
				// 		function(result) {
				// 			that.loading = false;
				// 			if (result.status == 2000) {
				// 				that.tableData = result.data;
				// 			} else {
				// 				that.$message({
				// 					message: result.message,
				// 					type: "error",
				// 				});
				// 			}
				// 		},
				// 		function(err) {
				// 			that.loading = false;
				// 			that.message.error({
				// 				showClose: true,
				// 				message: err.toString(),
				// 				duration: 2000,
				// 			});
				// 		}
				// 	)
				// 	.catch(function(error) {
				// 		that.loading = false;
				// 		that.message.error({
				// 			showClose: true,
				// 			message: "请求出现异常",
				// 			duration: 2000,
				// 		});
				// 	});
			},
			//删除列表数据
			DeleteData(Id) {
				let that = this;
				this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						that.loading = true;
						API_ENTERPRISE.DeleteEnterpriseDepartment({
								departmentId: Id,
							})
							.then(
								function(result) {
									that.loading = false;
									if (result.status == 2000) {
										that.$message({
											showClose: true,
											message: result.message,
											type: "success",
										});
										that.GetList();
										that.GetEnterpriseStructure();
									} else {
										that.$message({
											message: result.message,
											type: "error",
										});
									}
								},
								function(err) {
									that.loading = false;
									that.message.error({
										showClose: true,
										message: err.toString(),
										duration: 2000,
									});
								}
							)
							.catch(function(error) {
								that.loading = false;
								that.message.error({
									showClose: true,
									message: "请求出现异常",
									duration: 2000,
								});
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},

			GetEnterpriseStructure() {
				// API_ENTERPRISE.GetEnterpriseStructure().then((res) => {
				// 	this.treeData = res.data;
				// });
				this.Get("/GetEnterpriseStructureByEnterpriseId?enterpriseId=" + this.enterpriseId).then(res =>{
					this.treeData = res.data;
				})
			},
		},
		//页面初始化加载事件
		mounted() {
			// this.GetEnterpriseStructure();
			// this.GetList();
			API_BASIC.GetStatusCom().then((result) => {
				if (
					result.status != 2000 ||
					!result.data ||
					result.data.length < 1
				) {
					return;
				}
				this.StatusList = result.data;
			});
		},
	}
</script>

<style lang="scss" scoped>
	.page {
		/deep/ .org-tree {
			.bg-color-red {
				color: #fff;
				background: #f78989;
			}

			.bg-color-green {
				color: #fff;
				background: #85ce61;
			}

			.bg-color-wihte {
				color: #000;
				background: #ffffff;
			}

			.bg-color-ccc {
				color: #fff;
				background: #a6a9ad;
			}

			.bg-color-blue {
				color: #fff;
				background: #66b1ff;
			}

			.bg-color-yellow {
				color: #fff;
				background: #e6a23c;
			}
		}
	}
</style>