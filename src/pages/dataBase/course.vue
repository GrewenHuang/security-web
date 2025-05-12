<!-- 课程库 /data-base-course -->
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
				<el-input v-model="filters.CurriculumNo" placeholder="课程编号"
					@keyup.enter.native="handleSearch"></el-input>
				<el-input v-model="filters.CurriculumName" placeholder="课程名称"
					@keyup.enter.native="handleSearch"></el-input>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</div>
			<div>
				<el-button type="primary" icon="el-icon-plus" @click="addshow()" v-if="$_has('PXKKCBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" header-align="center" width="60">
			</el-table-column>
			<el-table-column label="所属公司" align="center" header-align="center" prop="EnterpriseName" width="200">
			</el-table-column>
			<el-table-column label="课程编号" align="center" header-align="center" width="200" prop="CurriculumNo">
			</el-table-column>
			<el-table-column label="课程名称" prop="CurriculumName">
			</el-table-column>
			<el-table-column label="课程时长" align="center" header-align="center" width="120">
				<template slot-scope="{ row }">
					{{ calcDuration(row) }}
				</template>
			</el-table-column>
			<el-table-column label="创建日期" align="center" header-align="center" width="120" prop="CreateDateDesc">
			</el-table-column>

			<el-table-column label="操作" align="center" header-align="center" width="280">
				<template slot-scope="scope">
					<div class="table-operta">
						<el-button type="text" @click="seeCour(scope.row)"  v-if="$_has('PXKKCBtnLook')">查看</el-button>
						<el-button type="text" @click="editCour(scope.row)" v-if="$_has('PXKKCBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="delCour(scope.row.CurriculumId)" v-if="$_has('PXKKCBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->
		<!--弹层开始-->
		<el-dialog v-dialog-drag title="查看" :visible.sync="addShow2" :close-on-click-modal="false" width="1000px">
			<el-scrollbar class="scrollbar">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 700">基本信息</span>
					</div>
					<div>
						<el-form :model="parms" :rules="rules" ref="ruleForm">
							<div class="form-2-col">
								<el-form-item label="课程编号">
									<div class="el-input">{{ parms.CurriculumNo }}</div>
								</el-form-item>
								<el-form-item label="课程名称">
									<div class="el-input">{{ parms.CurriculumName }}</div>
								</el-form-item>
							</div>
							<el-form-item label="课程时长">
								<div class="el-input">{{ calcTotalDuration() }}</div>
							</el-form-item>
							<el-form-item label="课程图片">
								<el-image class="el-input" v-for="(
                                        item, index
                                    ) in parms.AttachmentFiles" :src="item.Url" :key="index"
									style="width: 100px; height: 100px"></el-image>
							</el-form-item>
							<el-form-item label="课程详情">
								<div class="el-input" v-html="parms.Remark"></div>
							</el-form-item>
						</el-form>
					</div>
				</el-card>

				<el-card style="margin-top: 10px">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 700">关联课件</span>
					</div>
					<div>
						<el-table :data="checkCourList" border :cell-style="{ textAlign: 'center' }"
							:header-cell-style="{ textAlign: 'center' }" style="width: 100%">
							<el-table-column type="index" label="序号">
							</el-table-column>
							<el-table-column prop="CoursewareNo" label="课件编号" width="180">
							</el-table-column>
							<el-table-column prop="CoursewareName" label="课件名称">
							</el-table-column>
							<el-table-column label="课件附件">
								<template slot-scope="scope">
									<div v-for="(item, index) in scope.row
                                            .AttachmentFiles" :key="index">
										<el-button type="text"
											@click="preview(item.Url, item)">{{ item.Name }}</el-button>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="课件时长" width="120">
								<template slot-scope="{ row }">
									{{ calcCourseDuration(row) }}
								</template>
							</el-table-column>
							<el-table-column prop="TeacherName" label="教师名称" width="120">
							</el-table-column>
						</el-table>
					</div>
				</el-card>
			</el-scrollbar>
		</el-dialog>
		<!--弹层结束-->
		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" top="8vh" width="1000px">
			<el-scrollbar class="scrollbar">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 700">基本信息</span>
					</div>
					<div>
						<el-form :model="parms" :rules="rules" ref="ruleForm">
							<div class="form-2-col">
								<el-form-item label="课程编号" prop="CurriculumNo">
									<el-input class="el-input" maxlength="20" show-word-limit
										v-model="parms.CurriculumNo"></el-input>
								</el-form-item>
								<el-form-item label="课程名称" prop="CurriculumName">
									<el-input class="el-input" v-model="parms.CurriculumName" maxlength="50"
										show-word-limit></el-input>
								</el-form-item>
							</div>
							<el-form-item label="课程时长">
								<div class="el-input">{{ calcTotalDuration() }}</div>
							</el-form-item>
							<el-form-item label="课程图片" prop="name">
								<el-upload class="el-input" :action="url()" :accept="upload.all_suffix"
									list-type="picture-card" :before-upload="before" :on-change="
                                        (file, fileList) => {
                                            change(file, 1);
                                        }
                                    " :before-remove="
                                        (file, fileList) => {
                                            return before_remove(
                                                file,
                                                1
                                            );
                                        }
                                    " :file-list="arrFilesFun(1)" :on-preview="preview">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
							<el-form-item label="课程详情" prop="name">
								<el-input class="el-input" type="textarea" v-model="parms.Remark" rows="6"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</el-card>

				<el-card style="margin-top: 10px">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 700">关联课件</span>
					</div>
					<div>
						<el-table :data="checkCourList" border :cell-style="{ textAlign: 'center' }"
							:header-cell-style="{ textAlign: 'center' }" style="width: 100%">
							<el-table-column type="index" label="序号" width="50">
							</el-table-column>
							<el-table-column prop="CoursewareNo" label="课件编号" width="140">
							</el-table-column>
							<el-table-column prop="CoursewareName" label="课件名称">
							</el-table-column>
							<el-table-column label="课件附件" show-overflow-tooltip>
								<template slot-scope="scope">
									<div v-for="(item, index) in scope.row
                                            .AttachmentFiles" :key="index">
										<el-button type="text"
											@click="preview(item.Url, item)">{{ item.Name }}</el-button>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="课件时长" width="120">
								<template slot-scope="{ row }">
									{{ calcCourseDuration(row) }}
								</template>
							</el-table-column>
							<el-table-column prop="TeacherName" label="教师名称" width="100">
							</el-table-column>
							<el-table-column label="排序" width="80">
								<template slot-scope="scope">
									<el-input v-model="scope.row.Order" @blur="fileItemBlur(scope.row)"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="80">
								<template slot-scope="scope">
									<el-button type="text" text-plain @click="del(scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-button icon="el-icon-plus" style="width: 100%" type="primary" @click="adds(checkCourList)">
							新增课件
						</el-button>
					</div>
				</el-card>
			</el-scrollbar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addShow = false">关闭</el-button>
				<el-button @click="submit('ruleForm')" type="primary" :loading="btn">确定</el-button>
			</span>
		</el-dialog>
		<!--弹层结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag title="添加课件" :visible.sync="addShow1" :close-on-click-modal="false" width="900px">
			<el-form :inline="true">
				<!-- <el-form-item>
            <el-input v-model="filterss.SerialNumber"
                      placeholder="课件编号"
                      style="min-width: 200px;"></el-input>
          </el-form-item> -->
				<el-form-item>
					<el-input v-model="filterss.CoursewareName" placeholder="课件名称" style="min-width: 200px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filterss.TeacherName" placeholder="教师名称" style="min-width: 200px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch1">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="CourList" border :cell-style="{ textAlign: 'center' }"
				:header-cell-style="{ textAlign: 'center' }" style="width: 100%">
				<el-table-column label="序号" type="index" width="60">
				</el-table-column>
				<el-table-column prop="EnterpriseName" label="所属公司" width="180"></el-table-column>
				<el-table-column prop="CoursewareNo" label="编号" width="160">
				</el-table-column>
				<el-table-column label="课件名称" prop="CoursewareName">
				</el-table-column>
				<el-table-column label="教师名称" width="100" prop="TeacherName">
				</el-table-column>
				<el-table-column label="操作" width="80">
					<template slot-scope="scope">
						<el-button type="text" plain-text @click="SelectionChange(scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页开始-->
			<el-row>
				<el-col :span="24" style="text-align: center">
					<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChanges"
						:page-size="rowss" :total="totals" class="customPagination">
					</el-pagination>
				</el-col>
			</el-row>

			<!--分页结束-->
		</el-dialog>
		<preview-media ref="previewMedia"></preview-media>
	</page-layout>
</template>



<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import RULECONFIG from "@/common/ruleConfig";
	import util from '@/common/util';
	const IsPrivate = 0;
	export default {
		mixins: [request_mixin, upload_mixin],
		data() {
			return {
				//搜索时的过滤条件
				filters: {},
				filterss: {},

				//数据列表
				list: [],
				CourList: [],
				checkCourList: [],
				//分页相关数据
				pages: {
					total: 0,
					page: 1,
					rows: 10,
				},
				page1: 1,
				rowss: 10,
				totals: 0,
				//弹层数据
				addShow: false,
				addShow1: false,
				addShow2: false,
				dialogTitle: "新增",
				//列表页面是否加载变量
				loading: false,
				parms: {
					CurriculumName: "", // 课程名称 必填
					CurriculumNo: "", // 课程编号 必填
					TrainingTypeCode: "", // 培训类型 必选
					Remark: "", // string 课程详情 选填
					CoursewareIds: [], // array 课件Id集合
					PictureFiles: [], // array 课程图片集合
				},
				rules: {
					CurriculumName: RULECONFIG.Text("课程名称"),
					CurriculumNo: RULECONFIG.Text("课程编号"),
					TrainingTypeCode: RULECONFIG.Text("培训类型"),
				},
				btn: false,
				QueryScope: 0
			};
		},
		methods: {
			addshow() {
				this.checkCourList = [];
				this.upload.arrFiles = [
					[],
					[],
					[],
					[],
					[]
				];
				(this.parms = {
					CurriculumName: "", // 课程名称 必填
					CurriculumNo: "", // 课程编号 必填
					TrainingTypeCode: "", // 培训类型 必选
					Remark: "", // string 课程详情 选填
					CoursewareIds: [], // array 课件Id集合
					PictureFiles: [], // array 课程图片集合
				}),
				this.addShow = true
				this.dialogTitle = "新增";
				this.parms.CurriculumNo = this.getCoursewareNo();
			},
			adds() {
				//新增课件
				this.addShow1 = true;
				this.getCourList();
			},
			del(index) {
				//删除课件
				this.checkCourList.splice(index, 1);
				this.parms.CoursewareIds.splice(index, 1);
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
			getCourList(item) {
				this.Post("/GetEnterpriseCoursewares", {
					page: this.page1,
					rows: this.rowss,
					QueryScope: 2,
					...this.filterss
				}).then((res) => {
					if (res.status == 2000) {
						this.CourList = res.data.list;
						this.totals = res.data.count;
					}
				});
			},
			handleCurrentChanges(val) {
				this.page1 = val;
				this.getCourList(this.checkCourList);
			},
			SelectionChange(item) {
				//选择课件的勾选
				let orderNum = Math.max(
					...this.checkCourList.map((item) => item.Order),
					0
				);
				let val = {
					...JSON.parse(JSON.stringify(item)),
					Order: ++orderNum,
				};
				if (this.checkCourList && this.checkCourList.length) {
					var isExist = 0;
					this.checkCourList.forEach((key) => {
						if (key.CoursewareId == val.CoursewareId) {
							isExist = 1;
						}
					});
					if (!isExist) {
						this.checkCourList.push(val);
						this.parms.CoursewareIds.push({
							CoursewareId: val.CoursewareId,
							Order: val.Order,
						});
					}
				} else {
					this.checkCourList.push(val);
					this.parms.CoursewareIds.push({
						CoursewareId: val.CoursewareId,
						Order: val.Order,
					});
				}
			},
			getCoursewareNo() {
				//获取随机编号
				return "KC" + new Date().getTime();
			},
			seeCour(row) {
				this.addShow2 = true;
				this.checkCourList = row.Coursewares;
				this.parms = JSON.parse(JSON.stringify(row));
				this.upload.arrFiles[1] = this.parms.AttachmentFiles;
			},
			delCour(id) {
				this.$confirm("此操作将永久删除该课件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					this.Get("/DeleteCurriculum", {
						CurriculumId: id,
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
			submit(formName) {
				this.btn = true;
				this.parms.PictureFiles = this.upload.arrFiles[1];
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.Post("/SaveCurriculum", {
							...this.parms,
							IsPrivate
						}).then((res) => {
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
						});
					}
					this.btn = false;
				});
			},
			handleSearch1() {
				//查询课件按钮
				this.getCourList();
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
					that.filters,
				);

				that.loading = true;
				this.Post("/GetCurriculums", params).then((res) => {
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
			//编辑
			editCour(row) {
				this.dialogTitle = "编辑";
				this.addShow = true;
				this.parms = JSON.parse(JSON.stringify(row));
				this.parms.AttachmentFiles.forEach((key) => {
					key.url = key.Url;
					key.lengths = key.Lengths;
					key.size = key.Size;
					key.ext = key.Ext;
					key.name = key.Name;
				});
				this.upload.arrFiles[1] = this.parms.AttachmentFiles;
				this.checkCourList = row.Coursewares;
				this.parms.CoursewareIds = row.Coursewares.map((key) => {
					return {
						CoursewareId: key.CoursewareId,
						Order: key.Order,
					};
				});
			},
			fileItemBlur(item) {
				if (+!!item.Order === 0) {
					item.Order = 0;
				}
				// 对文件进行排序
				this.checkCourList.sort((a, b) => a.Order - b.Order);
				this.parms.CoursewareIds.forEach((item) => {
					let cItem = this.checkCourList.find(
						(sItem) => item.CoursewareId == sItem.CoursewareId
					);
					if (cItem) {
						item.Order = cItem.Order;
					}
				});
			},
			changeStore(num) {
				if (this.QueryScope == num) return;
				this.QueryScope = num;
				this.handleSearch(1);
			},
			calcDuration(row) {
				let duration = 0;
				row.Coursewares.forEach(item => {
					item.AttachmentFiles.forEach(file => {
						duration += file.Lengths
					});
				});
				return util.durationFormat(duration);
			},
			calcCourseDuration(row) {
				let duration = 0;
				if (row) {
					row.AttachmentFiles.forEach(file => {
						duration += file.Lengths;
					});
				}
				return util.durationFormat(duration);
			},
			calcTotalDuration() {
				let duration = 0;
				this.checkCourList.forEach(item => {
					item.AttachmentFiles.forEach(file => {
						duration += file.Lengths
					});
				});
				return util.durationFormat(duration);
			},
		},
		mounted() {
			this.handleSearch();
			this.upload.arrFiles = [
				[],
				[],
				[],
				[],
				[]
			];
		},
	};
</script>

<style lang="scss" scoped>
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

	/deep/ .el_upload .el-upload {
		display: inline-block;
		text-align: left;
		cursor: pointer;
		outline: 0;
	}

	/deep/ .el-upload-list__item {
		transition: none !important;
	}

	/deep/ .ql-editor {
		min-height: 200px;
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