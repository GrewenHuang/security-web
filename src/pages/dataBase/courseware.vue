<!-- 课件库 /data-base-courseware -->
<template>
	<page-layout :loading="loading" element-loading-text="拼命加载中" :pages="pages" @current-change="handleCurrentChange">
		<!-- <div slot="header" class="header f-c">
            <div class="header-tab f-c-c">
                <div class="item" :class="{active: QueryScope == 1}" @click="changeStore(1)">公库</div>
                <div class="item" :class="{active: QueryScope == 0}" @click="changeStore(0)">私库</div>
            </div>
        </div> -->
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input v-model="filters.CoursewareName" placeholder="课件名称"
					@keyup.enter.native="handleSearch"></el-input>
				<el-input v-model="filters.TeacherName" placeholder="教师名称"
					@keyup.enter.native="handleSearch"></el-input>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</div>
			<div>
				<el-button type="primary" icon="el-icon-plus" @click="addshow()" v-if="$_has('PXKKJBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="EnterpriseName" label="所属公司" width="200"></el-table-column>
			<el-table-column prop="CoursewareName" label="课件名称">
			</el-table-column>
			<el-table-column label="课件编号" align="center" header-align="center" width="145" prop="CoursewareNo">
			</el-table-column>
			<el-table-column label="教师名称" align="center" header-align="center" width="110">
				<template slot-scope="scope">{{
                    scope.row.TeacherName || "无"
                }}</template>
			</el-table-column>
			<el-table-column label="创建日期" align="center" header-align="center" width="100" prop="CreateDateDesc">
			</el-table-column>

			<el-table-column label="操作" align="center" header-align="center" width="200">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="editCour(scope.row,'look')" v-if="$_has('PXKKJBtnLook')">查看</el-button>
						<el-button type="text" @click="editCour(scope.row,'edit')" v-if="$_has('PXKKJBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="delCour(scope.row.CoursewareId)" v-if="$_has('PXKKJBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->
		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" top="8vh" width="50%">
			<el-scrollbar class="scrollbar">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 700">课件信息</span>
					</div>
					<div>
						<el-form :model="parms" :rules="rules" ref="ruleForm" :disabled="isTrue">
							<el-form-item label="课件名称" prop="CoursewareName">
								<el-input v-model="parms.CoursewareName" maxlength="100" show-word-limit></el-input>
							</el-form-item>
							<div class="form-col">
								<el-form-item label="课件编号" prop="CoursewareNo">
									<el-input v-model="parms.CoursewareNo" maxlength="20" show-word-limit></el-input>
								</el-form-item>
								<el-form-item label="教师名称">
									<el-input v-model="parms.TeacherName" maxlength="20" show-word-limit></el-input>
								</el-form-item>
							</div>
							<el-form-item label="课件简介">
								<el-input type="textarea" v-model="parms.Remark" maxlength="1000"
									show-word-limit></el-input>
							</el-form-item>
						</el-form>
					</div>
				</el-card>

				<el-card style="margin-top: 10px">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 700">课件附件</span>
					</div>
					<div>
						<el-table :data="fileList" border height="200" style="width: 100%">
							<el-table-column type="index" label="序号" width="50">
							</el-table-column>
							<el-table-column label="附件名称">
								<template slot-scope="scope">
									<el-input v-model="scope.row.Name" :disabled="isTrue"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="培训时长(秒)" width="110">
								<template slot-scope="scope">
									<el-input v-model="scope.row.Lengths" :disabled="
									        /mp4|mp3/.test(scope.row.Ext) || isTrue"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="排序" width="110">
								<template slot-scope="scope">
									<el-input v-model="scope.row.Order" @blur="fileItemBlur(scope.row)"  :disabled='isTrue'></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="address" label="操作" width="150" header-align="center" align="center">
								<template slot-scope="scope" v-if='!isTrue'>
									<el-button type="text" @click="
                                            preview(scope.row.Url, scope.row)
                                        ">预览</el-button>
									<el-button type="text" text-plain @click="del(scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div 
							v-if="!isTrue"
								style="
                                display: flex;
                                justify-content: space-around;
                                margin: 10px auto;
                                width: 175px;
                            ">
							<el-upload action="" accept=".mp4,.mp3" :http-request="handleAvatarSuccessMP4"
								:before-upload="beforeAvatarUploadMP4" :show-file-list="false" v-if="uploadModel == 1">
								<el-button size="small" type="primary" style="margin-right: 9px;">上传音视频</el-button>
							</el-upload>
							<custom-upload :accept="'.mp4,.mp3'" :onlyUpload="true" @change="mediaUploadChnage" v-else>
								<el-button size="small" type="primary" style="margin-right: 9px;">上传音视频</el-button>
							</custom-upload>
							<el-upload action="" accept=".pdf" :http-request="handleAvatarSuccessPDF"
								:before-upload="beforeAvatarUploadPDF" :show-file-list="false" v-if="uploadModel == 1">
								<el-button size="small" type="primary">上传PDF</el-button>
							</el-upload>
							<custom-upload :onlyUpload="true" @change="pdfUploadChnage" accept=".pdf" v-else>
								<el-button size="small" type="primary">上传PDF</el-button>
							</custom-upload>
						</div>
					</div>
				</el-card>
			</el-scrollbar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addShow = false">关闭</el-button>
				<el-button @click="submit('ruleForm')" type="primary" :loading="btn">确定</el-button>
			</span>
		</el-dialog>
		<!--弹层结束-->
		<preview-media ref="previewMedia"></preview-media>
	</page-layout>
</template>



<script>
	import util from "@/common/util.js";
	import request_mixin from "@/mixins/request-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import RULECONFIG from "@/common/ruleConfig";
	import * as qiniu from "qiniu-js";
	import Qs from "qs";
	const IsPrivate = 0;
	export default {
		mixins: [request_mixin, Import_export, upload_mixin],
		data() {
			return {
				isTrue: false,
				fileList: [],
				options: [], //下拉
				//搜索时的过滤条件
				filters: {},
				//数据列表
				list: [],
				//分页相关数据
				pages: {
					total: 0,
					page: 1,
					rows: 10,
				},
				//弹层数据
				addShow: false,
				dialogTitle: "新增",
				//列表页面是否加载变量
				loading: false,
				parms: {
					CoursewareName: "", // string 课件名称 必填
					CoursewareNo: "", // string 课件编号 必填
					CatalogueCode: "", // string 培训目录 必选
					TeacherName: "", // string 教师姓名 选填
					Remark: "", // string 课件简介 选填
					AttachmentFiles: [], //文件集合
					IsPrivate
				},
				rules: {
					CoursewareName: RULECONFIG.Text("课件名称"),
					CoursewareNo: RULECONFIG.Text("课件编号"),
				},
				btn: false,
				uploadModel: 0, // 0 本地上传，1 七牛云上传
				QueryScope: 0
			};
		},
		methods: {
			del(index) {
				this.fileList.splice(index, 1);
			},
			addshow() {
				this.fileList = [];
				this.parms = {
					CoursewareName: "", // string 课件名称 必填
					CoursewareNo: "", // string 课件编号 必填
					CatalogueCode: "", // string 培训目录 必选
					TeacherName: "", // string 教师姓名 选填
					Remark: "", // string 课件简介 选填
					AttachmentFiles: [], //文件集合
					IsPrivate
				};
				this.isTrue = false
				this.addShow = true;
				this.dialogTitle = "新增";
				this.parms.CoursewareNo = this.getCoursewareNo();
			},
			submit(formName) {
				this.btn = true;
				this.parms.AttachmentFiles = this.fileList;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.Post("/SaveCourseware", this.parms).then((res) => {
							if (res.status == 2000) {
								this.$message({
									message: "保存成功",
									type: "success",
								});
								this.getList();
								this.addShow = false;
							} else {
								this.$message.error(res.message);
							}
							this.btn = false;
						});
					}
				});
			},
			delCour(id) {
				//删除课件
				this.$confirm("此操作将永久删除该课件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					this.Get("/DeleteCourseware", {
						CoursewareId: id,
						IsPrivate
					}).then((res) => {
						if (res.status == 2000) {
							this.$message({
								type: "success",
								message: "删除成功!",
							});
							this.getList();
						} else {
							this.$message.error(res.message);
						}
					});
				});
			},

			getCoursewareNo() {
				//获取随机编号
				return "KJ" + new Date().getTime();
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			//搜索事件
			handleSearch() {
				this.pages.page = 1;
				this.getList();
			},
			//获取列表数据
			getList() {
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
				this.Post("/GetEnterpriseCoursewares", params).then((res) => {
					if (res.status == 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
					that.loading = false;
				});
			},

			//弹层的取消
			dialogClear() {
				let than = this;
				than.addShow = false;
			},
			//检查执行
			editCour(row,title) {
				if(title == 'look'){
					this.dialogTitle = '查看';
					this.isTrue = true
				}else {
					this.isTrue = false
					this.dialogTitle = '编辑';
				}
				this.addShow = true;
				this.parms = JSON.parse(JSON.stringify(row));
				this.fileList = this.parms.AttachmentFiles;
			},
			fileItemBlur(item) {
				if (+!!item.Order === 0) {
					item.Order = 0;
				}
				// 对文件进行排序
				this.fileList.sort((a, b) => a.Order - b.Order);
			},

			pdfUploadChnage(files) {
				let file = files[0];
				let orderNum = Math.max(
					...this.fileList.map((item) => item.Order),
					0
				);
				// 接收成功后返回的信息
				let pdfFile = {
					Name: file.name,
					Url: file.url,
					Size: file.size,
					Ext: "pdf",
					CoverUrl: "  ",
					Lengths: 0,
					Order: ++orderNum,
				};
				this.fileList.push(pdfFile);
			},
			handleAvatarSuccessPDF(e) {
				let that = this;
				//获取oss的token
				that.Get("/GetOssToken", {}).then((result) => {
					if (result.status == 2000) {
						let config = {
							useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
							forceDirect: true,
						};
						let userinfo = Qs.parse(localStorage.getItem("userinfo"));
						let key = util.getOssKey(
							userinfo.Enterprise.EnterpriseName,
							"培训课件",
							e.file
						);
						let putExtra = {
							params: {}, //用来放置自定义变量
							mimeType: [
							"application/pdf"], //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
						};
						var observable = qiniu.upload(
							e.file,
							key,
							result.data.token,
							putExtra,
							config
						);
						observable.subscribe({
							next: (result) => {
								that.unloadloading.text =
									"上传中(" +
									result.total.percent.toFixed(2) +
									"%)...";
							},
							error: (errResult) => {
								// 失败报错信息
								that.unloadloading.close();
								that.$message.error(
									"上传出错:" + errResult.message
								);
							},
							complete: (result) => {
								// 接收成功后返回的信息
								let orderNum = Math.max(
									...that.fileList.map((item) => item.Order),
									0
								);
								let mp4File = {
									Name: result.fname,
									Url: result.key,
									Size: result.fsize,
									Ext: "pdf",
									CoverUrl: "  ",
									Lengths: 0,
									Order: ++orderNum,
								};
								that.fileList.push(mp4File);
								that.unloadloading.close();
							},
						});
					} else {
						that.$message.error("获取osstoken失败,请联系管理员!");
						that.unloadloading.close();
						return false;
					}
				});
			},
			beforeAvatarUploadPDF(file) {
				let that = this;
				that.unloadloading = this.$loading({
					lock: true,
					text: "上传中(0%)...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)",
				});
				if (file.type != "application/pdf") {
					that.$message.error("上传的文件只能是 pdf 格式!");
					that.unloadloading.close();
					return false;
				}
				let fileSize = file.size / 1024 / 1024;
				let MaxFileSize = 100;
				if (fileSize > MaxFileSize) {
					that.$message.error(
						"上传的文件过大，请压缩至" + MaxFileSize + "M之内再进行上传"
					);
					that.unloadloading.close();
					return false;
				}
			},
			mediaUploadChnage(files) {
				let file = files[0];
				let orderNum = Math.max(
					...this.fileList.map((item) => item.Order),
					0
				);
				let mp4File = {
					Name: file.name,
					Url: file.url,
					Size: file.size,
					Ext: file.ext,
					CoverUrl: "  ",
					Lengths: Number(file.duration).toFixed(0),
					Order: ++orderNum,
				};
				this.fileList.push(mp4File);
			},
			handleAvatarSuccessMP4(e) {
				let that = this;
				//获取oss的token
				that.Get("/GetOssToken", {}).then((result) => {
					if (result.status == 2000) {
						let config = {
							useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
							forceDirect: true,
						};
						let userinfo = Qs.parse(localStorage.getItem("userinfo"));
						let key = util.getOssKey(
							userinfo.Enterprise.EnterpriseName,
							"培训课件",
							e.file
						);
						let putExtra = {
							params: {}, //用来放置自定义变量
							mimeType: [
							"video/mp4"], //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
						};
						var observable = qiniu.upload(
							e.file,
							key,
							result.data.token,
							putExtra,
							config
						);
						observable.subscribe({
							next: (result) => {
								that.unloadloading.text =
									"上传中(" +
									result.total.percent.toFixed(2) +
									"%)...";
							},
							error: (errResult) => {
								// 失败报错信息
								that.unloadloading.close();
								that.$message.error(
									"上传出错:" + errResult.message
								);
							},
							complete: (result) => {
								let orderNum = Math.max(
									...that.fileList.map((item) => item.Order),
									0
								);
								// 接收成功后返回的信息
								let mp4File = {
									Name: result.fname,
									Url: result.key,
									Size: result.fsize,
									Ext: "mp4",
									CoverUrl: "  ",
									Lengths: Number(result.totalSeconds).toFixed(0),
									Order: ++orderNum,
								};
								that.fileList.push(mp4File);
								that.unloadloading.close();
							},
						});
					} else {
						that.$message.error("获取osstoken失败,请联系管理员!");
						that.unloadloading.close();
						return false;
					}
				});
			},
			beforeAvatarUploadMP4(file) {
				let that = this;
				that.unloadloading = this.$loading({
					lock: true,
					text: "上传中(0%)...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)",
				});
				if (file.type != "video/mp4" && file.type != "audio/mpeg") {
					that.$message.error("上传的文件只能是 MP3/MP4 格式!");
					that.unloadloading.close();
					return false;
				}
				let fileSize = file.size / 1024 / 1024;
				let MaxFileSize = 500;
				if (fileSize > MaxFileSize) {
					that.$message.error(
						"上传的文件过大，请压缩至" + MaxFileSize + "M之内再进行上传"
					);
					that.unloadloading.close();
					return false;
				}
			},
			async preview(url, item) {
				if (url.indexOf("http") == -1) {
					let result = await this.Get("/GetOssUrl", {
						key: url
					});
					url = result.data.url;
				}
				if (/mp4|mp3/.test(item.Ext)) {
					this.$refs.previewMedia.show(url, item.Ext);
				} else {
					window.open(url);
				}
			},
			async getUploadModel() {
				let res = await this.Get("/GetFileType");
				this.uploadModel = +res.data.fileType;
			},
			changeStore(num) {
				if (this.QueryScope == num) return;
				this.QueryScope = num;
				this.handleSearch(1);
			},
		},
		created() {
			this.getUploadModel();
		},
		mounted() {
			this.getList();
		},
	};
</script>

<style lang="scss" scoped>
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