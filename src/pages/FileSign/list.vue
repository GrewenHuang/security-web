<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!-- 条件栏 开始 -->
		<div slot="operation" class="f-e-c">
			<div>
				<el-button type="primary" icon="el-icon-plus" @click="dialogEditOpen(0)"
					v-if="$_has('ZXQZBtnAdd')">新增</el-button>
			</div>
		</div>
		<!-- 条件栏 结束 -->
		<!--列表 开始-->
		<el-table :data="pages.list" highlight-current-row :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="FileName" label="签字文件名称" align="center">
			</el-table-column>
			<el-table-column prop="SignType" label="签订层级" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.SignType == 1? '单层级' : '多层级'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="FileSignTempName" label="文件模板名称" align="center">
			</el-table-column>
			<!-- <el-table-column prop="RoleName" label="人员信息" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.DepartmentPositionDesc }}<br />{{
                            scope.row.DepartmentPositionUserDesc
                        }}</span>
				</template>
			</el-table-column> -->
			<el-table-column prop="CreateTimeDesc" label="下发日期" align="center">
			</el-table-column>
			<el-table-column prop="SignedNum" label="完成情况" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.SignedNum }}/{{
                            scope.row.TotalNum
                        }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="250">
				<template slot-scope="scope">
					<div class="table-operation">
						<a class="target" :href="ViewUrl(scope.row.FileSignTempUrl)" target="_blank"
							v-if="$_has('ZXQZBtnMB')">
							<el-button type="text">查看模板</el-button>
						</a>
						<el-button type="text" @click="dialogSignDetailOpen(scope.row)"
							v-if="$_has('ZXQZBtnXQ')">签字详情</el-button>
						<el-button type="text" text-plain @click="DeleteData(scope.row.FileSignId)"
							v-if="$_has('ZXQZBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表 结束-->
		<!--编辑弹层 开始-->
		<el-dialog v-dialog-drag :title="edits.dialogEditTitle" :visible.sync="edits.dialogEditShow"
			:close-on-click-modal="false" @close="dialogEditClose()" top="8vh" width="70%">
			<template>
				<el-scrollbar class="scrollbar" ref="scrollbar">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="font-size: 15px; font-weight: 600">模板信息</span>
						</div>
						<el-form :rules="edits.rules" ref="editsform" :model="edits.Data">
							<el-form-item label="文件名称" prop="FileName">
								<el-input v-model="edits.Data.FileName" maxlength="100" show-word-limit></el-input>
							</el-form-item>
							<div class="form-2-col">
								<div class="no-spacing">
									<el-form-item label="关联证照" prop="CertificateId">
										<el-select v-model="edits.Data.CertificateId" clearable placeholder="关联证照"
											:collapse-tags="true" style="width: 100%">
											<el-option v-for="(item, index) in byUserType" :key="index"
												:label="item.CertificateName" :value="item.CertificateId"></el-option>
										</el-select>
									</el-form-item>
								</div>
								<div class="no-spacing">
									<el-form-item class="gutter" label="安全等级" prop="SecurityLevel" ref="SecurityLevel">
										<select-level v-model="edits.Data.SecurityLevel" :multiple="false"
											:value="edits.Data.SecurityLevel"></select-level>
									</el-form-item>
								</div>
							</div>
							<el-form-item label="签订方式" prop="SignType">
								<el-radio-group v-model="edits.Data.SignType" style="width: 100%"
									@change="onChangeRadio">
									<el-radio-button :label="1">单层级</el-radio-button>
									<el-radio-button :label="2">多层级</el-radio-button>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="文件模板" prop="FileSignTempUrl">
								<el-tooltip class="item" effect="dark" placement="top-start">
									<div slot="content" style="width: 520px;height: 500px">
										<span
											style="color: #fff;font-size: 14px">{{`注：文件只能是.doc文件,里面需要包含${'{' + '{'+'SignUrl' + '}' + '}'}字符，字符后不能存在其他文字`}}</span>
										<img src="@/assets/images/sign1.png" alt=""
											style="width: 100%;height: 95%;margin-top: 10px"
											v-if="edits.Data.SignType == 1">
										<img src="@/assets/images/sign2.png" alt=""
											style="width: 100%;height: 95%;margin-top: 10px" v-else>
									</div>
									<span><i class="el-icon-question"></i></span>
								</el-tooltip>
								<el-upload class="el-input" :action="UploadUrl" accept=".doc,.docx"
									:on-progress="uploadFileProcess" :on-success="handleFileSuccess"
									:before-upload="beforeUploadFile" :show-file-list="false" v-if="
                                        edits.FileFlag &&
                                        edits.FileUploadPercent != 100
                                    ">
									<el-button size="small" icon="el-icon-upload" v-if="edits.FileFlag"
										type="primary">点击上传</el-button>
									<el-progress v-else :format="format" style="width: 200px" v-bind:percentage="
                                            edits.FileUploadPercent
                                        "></el-progress>
									<!-- <span class="comment">注：文件只能是.doc文件,里面需要包含{{
                                            "\{\{SignUrl\}\}"
                                        }}字符，字符后不能存在其他文字</span> -->
								</el-upload>
								<div class="el-input" v-else>
									{{ edits.Data.FileSignTempName }}
									<a class="target" :href="
                                            ViewUrl(
                                                edits.Data
                                                    .FileSignTempUrl
                                            )
                                        " target="_blank">
										<el-button size="mini" type="success">预览</el-button>
									</a>
									<el-button size="mini" type="danger" @click="delFile()">删除</el-button>
								</div>
							</el-form-item>
						</el-form>
					</el-card>
					<el-card class="box-card" style="margin-top: 20px">
						<div slot="header" class="clearfix">
							<span style="font-size: 15px; font-weight: 600">人员信息</span>
						</div>
						<div>
							<div>
								<div style="
                                        height: 50px;
                                        line-height: 50px;
                                        text-align: center;
                                        font-size: 17px;
                                        background: #f5f5f5;
                                        color: #888;
                                    ">
									人员
								</div>
								<template v-if="edits.Data.SignType == 1">
									<el-table border :data="edits.Personnellist" :cell-style="{ textAlign: 'center' }"
										:header-cell-style="{ textAlign: 'center' }">
										<el-table-column type="index" label="序号" width="60">
										</el-table-column>
										<el-table-column label="部门" prop="DepartmentName">
											<template slot-scope="scope">
												{{ scope.row.DepartmentListJustShow.map(item => item.DepartmentName).join('、') }}
											</template>
										</el-table-column>
										<el-table-column label="姓名" prop="UserName">
										</el-table-column>
										<el-table-column label="手机号" prop="Tel">
										</el-table-column>
										<el-table-column label="操作" width="100">
											<template slot-scope="scope">
												<el-button type="text" @click="
									                    deleValuePersonnellist(
									                        scope.$index
									                    )
									                ">删除</el-button>
											</template>
										</el-table-column>
									</el-table>
									<el-button type="primary" icon="el-icon-plus" style="width: 100%"
										@click="chooseUser">选择人员</el-button>
								</template>
								<template v-else>
									<el-table border :data="list" :cell-style="{ textAlign: 'center' }"
										:header-cell-style="{ textAlign: 'center' }">
										<el-table-column type="index" label="序号" width="60">
										</el-table-column>
										<el-table-column prop="UseName" label="上级人员" align="center" width="250">
											<template slot-scope="scope">
												<span>{{ scope.row.UserName }}</span>
											</template>
										</el-table-column>
										<el-table-column label="企业/部门" align="center" width="250"
											prop="Ende"></el-table-column>
										<el-table-column label="下级人员" align="center" prop="videoName">
										</el-table-column>
										<el-table-column label="操作" width="180">
											<template slot-scope="scope">
												<el-button type="text" @click="addUserName(scope)">添加人员</el-button>
												<el-button type="text" @click="detail(scope)">删除</el-button>
											</template>
										</el-table-column>
									</el-table>
									<el-button type="primary" icon="el-icon-plus" style="width: 100%"
										@click="addUser">选择上级人员</el-button>
								</template>
							</div>
						</div>
					</el-card>
				</el-scrollbar>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="dialogEditClose()">取消</el-button>
					<el-button type="primary" @click="dialogEditSave('editsform')"
						:loading="edits.dialogSaveLoading">提交</el-button>
				</div>
			</template>
		</el-dialog>
		<!--编辑弹层 结束-->
		<!--多层级签字详情弹层 开始-->
		<el-dialog v-dialog-drag :title="signDetail.dialogSignDetailTitle"
			:visible.sync="MultipleDetail.dialogSignDetailShow" :close-on-click-modal="false"
			@close="MultipleDetail.dialogSignDetailShow = false" top="8vh" width="60%">
			<el-table border :data="MultipleDetail.pages.list" :cell-style="{ textAlign: 'center' }"
				:header-cell-style="{ textAlign: 'center' }">
				<el-table-column type="index" label="序号" width="60">
				</el-table-column>
				<el-table-column prop="UserName" label="上级人员" align="center" width="250">

				</el-table-column>
				<el-table-column label="企业/部门" align="center" width="250">
					<template slot-scope="scope">
						<span>{{ scope.row.UserDepartmentJsonDesc.map(item => item.EnterpriseName + '-' + item.DepartmentName).join(',') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="下级人员" align="center" prop="videoName">
					<template slot-scope="scope">
						<span>{{ scope.row.PartBUserDesc.map(item => item.UserName).join(',') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<div class="table-operation">
							<el-button type="text" @click="onLookSing(scope.row)">签字详情</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination layout="total, prev, pager, next" background @current-change="handleDetailCurrentChangeMore"
					:page-size="MultipleDetail.pages.rows" :total="MultipleDetail.pages.total" class="customPagination">
				</el-pagination> -->
			</el-scrollbar>
		</el-dialog>
		<!--多层级签字详情弹层 结束-->
		<!--多层级明细弹层 开始-->
		<el-dialog v-dialog-drag title="多层级签字详情" :visible.sync="MultipleDetaildia.dialogSignDetailShow"
			:close-on-click-modal="false" @close="MultipleDetaildia.dialogSignDetailShow = false" top="8vh" width="60%">
			<el-scrollbar class="scrollbar">
				<!-- 条件栏 开始 -->
				<el-card shadow="hover" class="toolbar">
					<el-form :inline="true">
						<el-form-item>
							<el-button type="warning" plain size="small" icon="el-icon-download" @click="
			                            downloadmbs(120, 1201, {
			                                FileSignId: MultipleDetail.FileSignId,
											RelId: MultipleDetaildia.RelId
			                            });
			                            MultipleDetaildia.dialogSignDetailShow = false;
			                        ">导出全部</el-button>
						</el-form-item>
					</el-form>
				</el-card>
				<!-- 条件栏 结束 -->
				<!--列表 开始-->
				<el-table :data="MultipleDetaildia.pages.list" highlight-current-row
					v-loading="MultipleDetaildia.loading" :header-cell-style="$tableStyle" border>
					<el-table-column label="序号" align="center" type="index" width="60">
					</el-table-column>
					<el-table-column prop="UserName" label="签字人" align="center" width="160">
					</el-table-column>
					<el-table-column prop="FileSignDetailUrl" label="签字后文件" align="center">
						<template slot-scope="scope">
							<el-image style="
			                            width: 50px;
			                            height: 50px;
			                            margin-right: 5px;
			                        " v-for="(item, i) in scope.row
			                            .FileSignDetailUrlList" :key="i" :preview-src-list="[item]" :src="item"
								fit="fit"></el-image>
						</template>
					</el-table-column>
					<el-table-column prop="UpdateTimeDesc" label="签字时间" align="center" width="160">
					</el-table-column>
					<el-table-column label="操作" align="center" header-align="center" width="120">
						<template slot-scope="{ row }">
							<el-button type="danger" plain size="mini" @click="
			                            DeleteSignDetailData(
			                                row.FileSignDetailId
			                            )
			                        " v-if="row.Status == 2 && $_has('ZXQZBtnDHCQ')">打回重签</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--列表 结束-->
				<!--分页 开始-->
				<el-pagination layout="total, prev, pager, next" background
					@current-change="handleDetailCurrentChangeMultipleDetaildia"
					:page-size="MultipleDetaildia.pages.rows" :total="MultipleDetaildia.pages.total"
					class="customPagination">
				</el-pagination>
				<!-- 分页 结束 -->
			</el-scrollbar>
		</el-dialog>
		<!--多层级明细弹层 结束-->

		<!--签字详情弹层 开始-->
		<el-dialog v-dialog-drag :title="signDetail.dialogSignDetailTitle"
			:visible.sync="signDetail.dialogSignDetailShow" :close-on-click-modal="false"
			@close="signDetail.dialogSignDetailShow = false" top="8vh" width="60%">
			<el-scrollbar class="scrollbar">
				<!-- 条件栏 开始 -->
				<el-card shadow="hover" class="toolbar">
					<el-form :inline="true">
						<el-form-item>
							<el-button type="warning" plain size="small" icon="el-icon-download" @click="
                                    downloadmbs(120, 1201, {
                                        FileSignId: signDetail.FileSignId,
                                    });
                                    signDetail.dialogSignDetailShow = false;
                                ">导出全部</el-button>
						</el-form-item>
					</el-form>
				</el-card>
				<!-- 条件栏 结束 -->
				<!--列表 开始-->
				<el-table :data="signDetail.pages.list" highlight-current-row v-loading="signDetail.loading"
					:header-cell-style="$tableStyle" border>
					<el-table-column label="序号" align="center" type="index" width="60">
					</el-table-column>
					<el-table-column prop="UserName" label="签字人" align="center" width="160">
					</el-table-column>
					<el-table-column prop="FileSignDetailUrl" label="签字后文件" align="center">
						<template slot-scope="scope">
							<el-image style="
                                    width: 50px;
                                    height: 50px;
                                    margin-right: 5px;
                                " v-for="(item, i) in scope.row
                                    .FileSignDetailUrlList" :key="i" :preview-src-list="[item]" :src="item"
								fit="fit"></el-image>
						</template>
					</el-table-column>
					<el-table-column prop="UpdateTimeDesc" label="签字时间" align="center" width="160">
					</el-table-column>
					<el-table-column label="操作" align="center" header-align="center" width="120">
						<template slot-scope="{ row }">
							<el-button type="danger" plain size="mini" @click="
                                    DeleteSignDetailData(
                                        row.FileSignDetailId
                                    )
                                " v-if="row.Status == 2 && $_has('ZXQZBtnDHCQ')">打回重签</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--列表 结束-->
				<!--分页 开始-->
				<el-pagination layout="total, prev, pager, next" background @current-change="handleDetailCurrentChange"
					:page-size="signDetail.pages.rows" :total="signDetail.pages.total" class="customPagination">
				</el-pagination>
				<!-- 分页 结束 -->
			</el-scrollbar>
		</el-dialog>
		<!--签字详情弹层 结束-->
	</page-layout>
</template>
<script>
	import upload_mixin from "@/mixins/upload-mixin.js";
	import request_mixin from "@/mixins/request-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import RULECONFIG from "@/common/ruleConfig";
	export default {
		mixins: [upload_mixin, request_mixin, Import_export],
		data() {
			return {
				filters: {},
				byUserType: [],
				list: [],
				UploadUrl: process.env.API_UPLOAD_URL, //上传文件URL
				loading: false, //页面加载遮罩层显示状态
				pages: {
					list: [],
					total: 0,
					page: 1,
					rows: 10
				}, //分页
				isSelectType: 1,
				edits: {
					//编辑
					dialogEditShow: false, //弹窗显示状态
					dialogSaveLoading: false, //保存提交状态
					dialogEditTitle: "", //弹窗标题
					FileFlag: true, //上传标签(是否正在上传)
					FileUploadPercent: 0, //上传进度
					Personnellist: [], //人员
					Data: {
						//编辑数据
						CertificateId: "",
						SignType: 1,
						FileName: "", //文件名称
						FileSignUserRels: [], //人员
						FileSignTempName: "", //文件模板名称
						FileSignTempUrl: "", //文件模板URL
					},
					rules: {
						//表单验证规则
						// CertificateId: RULECONFIG.Select("关联证照"),
						FileName: RULECONFIG.Text("文件名称"),
						FileSignTempUrl: RULECONFIG.Select("文件模板"),
						SecurityLevel: RULECONFIG.Select("安全等级")
					},
				},
				multipleUserImg: [],
				signDetail: {
					FileSignId: 0, //查看指定模板
					dialogSignDetailShow: false, //弹窗显示状态
					dialogSignDetailTitle: "", //弹窗标题
					pages: {
						list: [],
						total: 0,
						page: 1,
						rows: 10
					}, //分页
					loading: false, //页面加载遮罩层显示状态
				},
				MultipleDetail: {
					FileSignId: 0, //查看指定模板
					dialogSignDetailShow: false, //弹窗显示状态
					dialogSignDetailTitle: "", //弹窗标题
					pages: {
						list: [],
						total: 0,
						page: 1,
						rows: 10
					}, //分页
					loading: false, //页面加载遮罩层显示状态
				},
				MultipleDetaildia: {
					dialogSignDetailShow: false, //弹窗显示状态
					RelId: 0,
					pages: {
						list: [],
						total: 0,
						page: 1,
						rows: 10
					}, //分页
					loading: false, //页面加载遮罩层显示状态
				}
			};
		},
		methods: {
			// 删除多层级
			detail(e) {
				this.list.splice(e.$index, 1)
			},
			//切换层级
			onChangeRadio() {
				this.list = []
				this.edits.Personnellist = []
				this.edits.Data.Users = []
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			//分页事件
			handleDetailCurrentChange(val) {
				this.signDetail.pages.page = val;
				this.GetSignDetailList();
			},
			handleDetailCurrentChangeMore(val) {
				this.MultipleDetail.pages.page = val;
				this.GetMultipleList();
			},
			handleDetailCurrentChangeMultipleDetaildia(val) {
				this.MultipleDetail.pages.page = val;
				this.GetSignDetailList();
			},
			scrollToTop() {
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				});
			},
			//搜索事件
			handleSearch() {
				this.pages.page = 1;
				this.GetList();
			},
			//加载列表数据
			GetList() {
				this.Post("/GetFileSigns", {
					page: this.pages.page,
					rows: this.pages.rows,
				}).then((res) => {
					if (res.status == 2000) {
						this.pages.list = res.data.list;
						this.pages.total = res.data.count;
					}
				});
			},
			//加载列表数据
			GetSignDetailList() {
				this.signDetail.loading = true;
				this.Post("/GetFileSignDetails", {
					FileSignId: this.signDetail.FileSignId,
					page: this.signDetail.pages.page,
					rows: this.signDetail.pages.rows,
				}).then((res) => {
					if (res.status == 2000) {
						this.signDetail.pages.list = res.data.list;
						this.signDetail.pages.total = res.data.count;
					}
				});
				this.signDetail.loading = false;
			},
			//打开弹窗
			dialogEditOpen(index, row) {
				this.edits.dialogEditShow = true;
				this.edits.dialogEditTitle = "新增";
				this.edits.FileFlag = true;
				this.edits.FileUploadPercent = 0;
				this.edits.Personnellist = []; //人员
				this.edits.Data = {
					FileSignUserRels: [],
					Users: [], //人员
					SignType: 1,
					SecurityLevel: "1",
					CertificateId: '',
					FileSignTempUrl: ""
				};
				this.scrollToTop()
			},
			//关闭弹窗
			dialogEditClose() {
				this.edits.dialogEditShow = false;
			},
			onLookSing(item) {
				this.MultipleDetaildia.loading = true;
				this.MultipleDetaildia.dialogSignDetailShow = true;
				this.MultipleDetaildia.RelId = item.RelId
				this.Post("/GetMultilevelSignDetails", {
					RelId: item.RelId,
					page: this.MultipleDetaildia.pages.page,
					rows: this.MultipleDetaildia.pages.rows,
				}).then((res) => {
					if (res.status == 2000) {
						this.MultipleDetaildia.pages.list = res.data.list
						this.MultipleDetaildia.pages.total = res.data.count
					}
				});
				this.MultipleDetaildia.loading = false;
			},
			//打开签字详情弹窗
			dialogSignDetailOpen(row) {
				this.isSelectType = row.SignType
				this.signDetail.dialogSignDetailTitle = "签字详情";
				if (row.SignType == 1) {
					this.signDetail.dialogSignDetailShow = true;
					this.signDetail.FileSignId = row.FileSignId;
					this.GetSignDetailList();
				} else {
					this.MultipleDetail.dialogSignDetailShow = true
					this.MultipleDetail.FileSignId = row.FileSignId
					this.GetMultipleList()
				}
			},
			GetMultipleList() {
				this.MultipleDetail.loading = true;
				this.Get("/GetFileSignUserRels?FileSignId=" + this.MultipleDetail.FileSignId).then((res) => {
					if (res.status == 2000) {
						this.MultipleDetail.pages.list = res.data
						// this.MultipleDetail.pages.total = res.data.count
					}
				});
				this.MultipleDetail.loading = false;
			},
			//关闭签字详情弹窗
			dialogSignDetailClose() {
				this.signDetail.dialogSignDetailShow = false;
				this.MultipleDetail.dialogSignDetailShow = false
			},
			//保存弹窗数据
			dialogEditSave(editsform) {
				this.$refs.editsform.validate((valid) => {
					if (valid) {
						this.edits.dialogSaveLoading = true;
						let params = {
							...this.edits.Data
						}
						params.SecurityLevel = parseInt(params.SecurityLevel)
						if (params.SignType == 2) {
							params.FileSignUserRels = this.list
						}
						this.Post("/SaveFileSign", params).then((res) => {
							if (res.status == 2000) {
								this.$message({
									message: "保存成功",
									type: "success",
								});
								this.edits.dialogEditShow = false;
								this.GetList();
							} else {
								this.$message.error(res.message);
							}
							this.edits.dialogSaveLoading = false;
						});
					}
				});
			},
			//上传进度条
			uploadFileProcess(event, file, fileList) {
				this.edits.FileFlag = false;
				this.edits.FileUploadPercent = parseInt(file.percentage);
			},
			//上传前检查
			beforeUploadFile(file) {
				if (
					[
						"application/msword",
						"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					].indexOf(file.type) == -1
				) {
					this.$message.error("请上传正确的文件格式");
					return false;
				}
				this.isShowUploadVideo = false;
			},
			//上传成功回调
			handleFileSuccess(res, file) {
				this.edits.Data.FileSignTempName = res.files[0].name;
				this.edits.Data.FileSignTempUrl = res.files[0].url;
				this.edits.FileFlag = true;
				this.edits.FileUploadPercent = 100;
			},
			//删除文件
			delFile() {
				this.edits.Data.FileSignTempName = "";
				this.edits.Data.FileSignTempUrl = "";
				this.edits.FileUploadPercent = 0;
			},
			//查看模板
			ViewUrl(url) {
				return url
				// (
				// 	"https://view.officeapps.live.com/op/view.aspx?src=" +
				// 	escape(url)
				// );
			},
			//删除列表数据
			DeleteData(Id) {
				this.$confirm("确认要删除该条数据吗？").then((p) => {
					this.Post("/DeleteFileSign", {
						Id
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
			//打回重签
			DeleteSignDetailData(Id) {
				this.$confirm("确认要打回重签吗？").then((p) => {
					this.Post("/ReturnFileSignDetail", {
						Id
					}).then((res) => {
						if (res.status == 2000) {
							this.GetSignDetailList();
							this.GetMultipleList()
							this.GetList();
							this.$message({
								message: "打回成功！",
								type: "success",
							});
						} else {
							this.$message.error(res.message);
						}
					});
				});
			},
			//选择人员
			chooseUser(e) {
				this.$chooseUser({
					choosed: this.edits.Personnellist
				}).then(data => {
					console.log(data)
					this.edits.Personnellist = data;
					this.edits.Data.FileSignUserRels = data.map(e => {
						return {
							UserId: e.UserId,
							UserName: e.UserName,
							UserDepartmentJson: JSON.stringify(e.DepartmentListJustShow),
							UserDepartmentJsonDesc: e.DepartmentListJustShow
						}
					});
				});
			},
			addUserName(e) {
				this.$chooseUser({
					choosed: this.list[e.$index].PartBUserDesc
				}).then(data => {

					let arr = []
					let arrData = []
					let obj = ""
					data.forEach((item) => {
						let objData = {
							DepartmentList: item.DepartmentListJustShow,
							UserDepartmentJsonDesc: item.DepartmentListJustShow,
							UserId: item.UserId,
							UserName: item.UserName,
						}
						let name = item.DepartmentListJustShow.map(item => item.DepartmentName).join('、')
						arr.push(`${item.UserName}(${item.EnterpriseName}-${name})`)
						arrData.push(objData)
					})
					// let isList = [...this.list[e.$index].userList, ...arrData]
					// this.list[e.$index].userList = Array.from(new Set(isList.map(item => item.UserId))).map(UserId => {
					// 	return isList.find(item => item.UserId === UserId);
					// });
					// this.list[e.$index].userList.forEach(item =>{
					// 	let name = item.DepartmentList.map(item => item.DepartmentName).join('、')
					// 	arr.push(`${item.UserName}(${item.EnterpriseName}-${name})`)
					// })
					this.list[e.$index].PartBUserDesc = arrData
					this.list[e.$index].PartBUserJson = JSON.stringify(arrData)
					this.list[e.$index].videoName = arr.join(',')
				});
			},
			// 选择组长
			addUser() {
				this.$chooseUser({
					choosed: this.list
				}).then(personnel => {
					if (personnel && personnel.length > 0) {
						let arrData = []
						personnel.forEach((item, index) => {

							let name = item.DepartmentListJustShow.map(item => item.DepartmentName).join('、')
							let objData = {
								UserDepartmentJson: JSON.stringify(item.DepartmentListJustShow),
								UserDepartmentJsonDesc: item.DepartmentListJustShow,
								DepartmentList: item.DepartmentListJustShow,
								EnterpriseId: item.EnterpriseId,
								EnterpriseName: item.EnterpriseName,
								Ende: `${item.UserName}(${item.EnterpriseName}-${name})`,
								UserId: item.UserId,
								UserName: item.UserName,
								videoName: '',
								PartBUserDesc: [],
								PartBUserJson: ""
							}
							arrData.push(objData)
						})
						this.list = arrData
						// let isList = [...this.list, ...arrData]
						// this.list = Array.from(new Set(isList.map(item => item.UserId))).map(UserId => {
						// 	return isList.find(item => item.UserId === UserId);
						// });
					}
				})
			},
			deleValuePersonnellist(index) {
				this.edits.Data.Users.splice(index, 1);
				this.edits.Personnellist.splice(index, 1);
			},
		},
		mounted() {
			this.GetList();
			this.Get('/GetCertificateListByUserType').then((res) => {
				//部门
				if (res.status == 2000) {
					this.byUserType = res.data
				}
			})
		},
	};
</script>
<style scoped lang="less">
	.comment {
		color: red;
		text-align: left;
	}

	.el-button+.el-button {
		margin-left: 0px;
	}

	.form-2-col {
		display: flex;
		justify-content: space-between;
	}

	.no-spacing {
		width: 49%;
		margin-bottom: 10px;
	}

	.sing-box {
		cursor: pointer;
		margin-right: 5px;
	}
</style>