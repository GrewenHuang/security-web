<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input placeholder="请输入岗位名称" clearable v-model="filters.Name"></el-input>
				<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
			</div>
			<div class="f--c">
				<el-button type="primary" icon="el-icon-plus" @click="dialogEditOpen(-1)" v-if="$_has('GWSZBtnAdd')">新增</el-button>
			</div>
		</div>
		<!-- 条件栏 结束 -->

		<!--列表 开始-->
		<el-table :data="tableData" row-key="id" :header-cell-style="$tableStyle" default-expand-all
			:tree-props="{ children: 'children' }">
			<el-table-column label="序号" header-align="center" align="center" type="index" width="50">
			</el-table-column>
			<el-table-column prop="Name" label="岗位名称" header-align="center" align="center"
				width="260"></el-table-column>
			<el-table-column prop="Describe" label="岗位描述" align="center"></el-table-column>
			<el-table-column prop="CreateByName" width="100" header-align="center" align="center"
				label="创建人"></el-table-column>
			<el-table-column prop="CreateTimeDesc" width="160" header-align="center" align="center"
				label="创建时间"></el-table-column>
			<el-table-column prop="operation" width="240" header-align="center" align="center" label="操作">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="dialogEditOpen(1, scope.row)" v-if="$_has('GWSZBtnEdit')">编辑</el-button>
						<el-button v-if="scope.row.IsSystem != 1 && $_has('GWSZBtnQX')" type="text"
							@click="showPositionAuthSetting(scope.row)">权限</el-button>
						<el-button v-if="scope.row.IsSystem != 1 && $_has('GWSZBtnDelete')" type="text" text-plain
							@click="DeleteData(scope.row.PositionId)">删除</el-button>
						<el-button type="text" @click="dialogEditOpen(3, scope.row)" v-if="$_has('GWSZBtnCopy')">复制</el-button>
						<!-- <el-dropdown>
                            <el-button type="text">更多</el-button>
                            <el-dropdown-menu class="custom-dropdown-menu" slot="dropdown">
                                <el-dropdown-item v-if="scope.row.IsSystem != 1">
                                    <el-button
                                        type="text"
                                        @click="showPositionAuthSetting(scope.row)"
                                    >权限</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button
                                        type="text"
                                        @click="showBindingFile(scope.row)"
                                    >签订文件</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item v-if="scope.row.QRCodes">
                                    <el-button type="text" @click="showQrcode(scope.row)">二维码</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item v-if="scope.row.IsSystem != 1">
                                    <el-button
                                        type="text"
                                        text-plain
                                        @click="DeleteData(scope.row.PositionId)"
                                    >删除</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                            </el-dropdown> -->
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 列表 结束 -->

		<!--编辑弹层 开始-->
		<el-dialog v-dialog-drag :title="edits.dialogEditTitle" :visible.sync="edits.dialogEditShow"
			:close-on-click-modal="false" @close="dialogEditClose()" width="40%">
			<el-scrollbar class="scrollbar">
				<el-form :rules="edits.rules" ref="editsform" :model="parms">
					<el-form-item label="岗位名称" prop="Name">
						<el-input placeholder="请输入岗位名称" v-model="parms.Name" maxlength="100" show-word-limit></el-input>
					</el-form-item>
					<el-form-item label="排序">
						<div class="el-input">
							<el-input-number style="width: 100%;" placeholder="请输入" :min="1"
								v-model="parms.Sort"></el-input-number>
						</div>
					</el-form-item>
					<el-form-item label="岗位描述" prop="Describe">
						<el-input type="textarea" v-model="parms.Describe" rows="5" cols="76" placeholder="请输入描述"
							maxlength="1000" show-word-limit></el-input>
					</el-form-item>
					<el-form-item prop="CertificateIds" v-if="edits.dialogEditShow">
						<span slot="label">
							<el-tooltip content="作用于小程序初次登录时，需要收集的信息">
								<span>收集信息<i class="el-icon-question"></i></span>
							</el-tooltip>
						</span>
						<div class="el-input">
							<div>
								<div>证件</div>
								<el-checkbox-group v-model="parms.CertificateIds">
									<el-checkbox v-for="(item, index) in certList" :key="index"
										:label="item.CertificateId" :disabled="item.CertificateCategory == 1">
										{{ item.CertificateName }} </el-checkbox>
								</el-checkbox-group>
							</div>
							<div>
								<div>保险</div>
								<el-checkbox-group v-model="parms.CertificateIds">
									<el-checkbox v-for="(item, index) in insureList" :key="index"
										:label="item.CertificateId"> {{ item.CertificateName }} </el-checkbox>
								</el-checkbox-group>
							</div>
							<div>
								<div>其他</div>
								<el-checkbox-group v-model="parms.CertificateIds">
									<el-checkbox v-for="(item, index) in otherList" :key="index"
										:label="item.CertificateId"> {{ item.CertificateName }} </el-checkbox>
								</el-checkbox-group>
							</div>
						</div>
					</el-form-item>
				</el-form>
			</el-scrollbar>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogEditClose()">取消</el-button>
				<el-button type="primary" :loading="edits.dialogSaveLoading" @click="dialogEditSave()"
					slot="reference">提交</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹层 结束 -->
		<positionAuth ref="positionAuth" />
		<bindingFile ref="bindingFile" />
	</page-layout>
</template>
<script>
	import RULECONFIG from "@/common/ruleConfig";
	import positionAuth from "./positionComponents/position-auth.vue";
	import bindingFile from './positionComponents/binding-file.vue';
	import request_mixin from '@/mixins/request-mixin'

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	function getIds(arr) {
		let list = [];
		arr.forEach(item => {
			if (item.IsSelect == 1) {
				list.push(item.MenuId);
			}
			if (item.SubMenus && !!item.SubMenus.length) {
				list.push(...getIds(item.SubMenus));
			}
		})
		return list;
	}
	export default {
		name: "organList",
		mixins: [request_mixin],
		components: {
			positionAuth,
			bindingFile
		},
		data() {
			return {
				loading: false, //页面加载遮罩层显示状态
				dialogAttachmentShow: false, //附件弹窗显示状态
				tableData: [], //表格数据
				parms: {
					Name: "",
					PositionId: "",
					Describe: "",
					Sort: 0,
					Remark: "",
					Status: 1,
					Sort: 1,
					CertificateIds: []
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
						Name: RULECONFIG.Text("岗位名称"),
						// CertificateIds: [{type: 'array', required: true, message: '请选择收集证件', trigger: ['change', 'blur']}],
					},
				},
				certList: [], // 证件集合
				insureList: [], // 保险集合
				otherList: [], // 其他信息集合
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {
					Name: ''
				},
				isCopy: -1
			};
		},
		//自定义方法
		methods: {
			//打开弹窗
			dialogEditOpen(index, row) {
				var that = this;
				this.isCopy = index
				if (index == -1) {
					//新增
					that.edits.dialogEditTitle = "新增";
					that.dialogEditInit();
					this.certList.forEach(item => {
						// 身份证固定
						if (item.CertificateCategory == 1) {
							this.parms.CertificateIds.push(item.CertificateId);
						}
					});
				} else {
					//编辑
					// let res = await this.Get(`/GetPositionMenus?positionId=${this.id}`);
					if(index == 3){
						that.edits.dialogEditTitle = "复制";
						this.Get(`/GetPositionMenus?positionId=${row.PositionId}`).then(res =>{
							if(res.status == 2000){
								row.PositionMenu = {
									AppMenuIds: res.data.AppMenuList.length > 0 ? getIds(res.data.AppMenuList) : [],
									MenuIds: res.data.MenuList.length > 0 ? getIds(res.data.MenuList) : []
								}
								let params = _extends(row)
								if(params.CertificateIds){
									params.CertificateIds = params.CertificateIds.split(',').map(id => +id)
								}else {
									params.CertificateIds = []
								}
								this.certList.forEach(item => {
									if (item.CertificateCategory == 1 && params.CertificateIds.indexOf(item.CertificateId) == -1) {
										params.CertificateIds.push(item.CertificateId);
									}
								});
								this.parms = params;
							}
						})
					}else {
						that.edits.dialogEditTitle = "编辑";
						let {
							Name,
							Describe,
							Status,
							CertificateIds,
							Sort
						} = row;
						let params = {
							Name,
							Describe,
							Status,
							PositionId: row.PositionId,
							Sort,
							CertificateIds: CertificateIds ? CertificateIds.split(',').map(id => +id) : []
						};
						this.certList.forEach(item => {
							if (item.CertificateCategory == 1 && params.CertificateIds.indexOf(item.CertificateId) == -1) {
								params.CertificateIds.push(item.CertificateId);
							}
						});
						this.parms = params;
					}
				}
				// this.parms = params;
				that.edits.dialogEditShow = true;
			},
			//初始化弹窗数据
			dialogEditInit() {
				var that = this;
				that.parms = {
					Name: "",
					PositionId: "",
					Describe: "",
					Sort: 0,
					Remark: "",
					Status: 1,
					Sort: 1,
					CertificateIds: []
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
						let params = _extends(that.parms);
						params.CertificateIds = params.CertificateIds.join(',');
						if(this.isCopy == 3){
							params.PositionId = 0
						}
						this.Post('/SavePosition_Copy', params).then(
							(result) => {
								try {
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
										that.getList();
										that.edits.dialogEditShow = false;
									}
								} catch (error) {
									console.error(error)
								}
								that.edits.dialogSaveLoading = false;
							}
						);
					}
				});
			},
			handlePageChange(val) {
				this.pages.page = val;
				this.getList();
			},
			//加载列表数据
			getList() {
				let that = this;
				that.loading = true;
				let params = {
					...this.pages,
					...this.filters
				}
				this.Post('/GetPositionList', params)
					.then(
						function(result) {
							that.loading = false;
							if (result.status == 2000) {
								that.tableData = result.data.list;
								that.pages.total = result.data.count;
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
			},
			//删除列表数据
			DeleteData(Id) {
				let that = this;
				this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					that.loading = true;
					this.Get(`/DeletePosition?positionId=${Id}`)
						.then(
							(result) => {
								that.loading = false;
								if (result.status == 2000) {
									that.$message({
										showClose: true,
										message: result.message,
										type: "success",
									});
									that.getList();
								} else {
									that.$message.error(result.message)
								}
							},
							(err) => {
								that.loading = false;
								that.$message.error({
									showClose: true,
									message: err.toString(),
									duration: 2000,
								});
							}
						)
						.catch((error) => {
							console.error(error)
							that.loading = false;
							that.$message.error({
								showClose: true,
								message: "请求出现异常",
								duration: 2000,
							});
						});
				});
			},
			showPositionAuthSetting(item) {
				this.$refs.positionAuth.show(item)
			},
			showBindingFile(item) {
				this.$refs.bindingFile.show(item);
			},
			async getCertList() {
				let res = await this.Get(`/GetCertificateList?certificateType=2&certificateClassification=`);
				if (res.status == 2000) {
					this.certList = res.data.filter(item => item.CertificateClassification == 1).sort((a, b) => {
						let sort1 = a.CertificateCategory;
						let sort2 = b.CertificateCategory;
						if (sort1 == 1) {
							sort1 = -2
						}
						if (sort2 == 1) {
							sort2 = -2
						}
						if (sort1 == 2) {
							sort1 = -1
						}
						if (sort2 == 2) {
							sort2 = -1
						}
						return sort1 - sort2
					});
					this.insureList = res.data.filter(item => item.CertificateClassification == 2);;
					this.otherList = res.data.filter(item => item.CertificateClassification == 3);;
				}
			},
			showQrcode(item) {
				this.$qrcode({
					url: item.QRCodes,
					title: item.Name,
					tips: '微信扫描二维码，注册账号'
				})
			}
		},

		//页面初始化加载事件
		mounted() {
			this.handlePageChange(1);
		},
		created() {
			this.getCertList();
		},
	};
</script>
<style lang="scss" scoped>
	.custom-dropdown-menu {
		/deep/ .el-dropdown-menu__item {
			padding: 0;

			.el-button {
				padding: 0 20px;
				width: 100%;
				line-height: 36px;
			}
		}
	}

	/deep/ .el-form-item__label {
		position: relative;
		z-index: 5;
	}
</style>