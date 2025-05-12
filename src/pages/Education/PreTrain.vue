<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input v-model="filters.TrainTaskName" placeholder="培训名称" clearable></el-input>
				<select-position v-model="filters.PositionList" :multiple="true" placeholder="岗位"></select-position>
				<el-button type="primary" @click="handleSearch()">查询</el-button>
			</div>
			<div>
				<el-button type="primary" icon="el-icon-plus" @click="addshow()"
					v-if="$_has('GQPXBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<!-- <el-table-column
                label="培训类型"
                align="center"
                width="120"
                prop="TrainTypeName"
            >
            </el-table-column> -->
			<el-table-column label="培训名称" align="center" prop="TrainTaskName">
			</el-table-column>
			<el-table-column label="培训岗位" align="center" show-overflow-tooltip width="120">
				<template slot-scope="scope">
					{{ scope.row.Positions.map(item => item.PositionName).join('、') }}
				</template>
			</el-table-column>
			<el-table-column label="培训课时" align="center" width="120">
				<template slot-scope="scope">
					<div>
						{{ scope.row.TrainHours }}课时({{
                            scope.row.TrainHours * 45
                        }}分钟)
					</div>
				</template>
			</el-table-column>
			<el-table-column label="在岗人数" align="center" width="100" prop="PlanUserCount">
			</el-table-column>
			<el-table-column label="完成人数" align="center" width="100" prop="PlanUserCompleteCount">
			</el-table-column>
			<el-table-column label="完成率" align="center" width="80">
				<template slot-scope="scope">
					{{ scope.row.CompleteRate }}%
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" width="300">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="seeTrain(scope.row.TrainTaskId)"
							v-if="$_has('GQPXBtnPXXQ')">培训详情</el-button>
						<el-button v-if="$_has('GQPXBtnDown')" type="text" @click="
                                downloadmbs(60, 602, {
                                    TrainTaskId: scope.row.TrainTaskId,
                                })
                            ">档案下载</el-button>
						<el-button type="text" text-plain @click="delTrain(scope.row.TrainTaskId)"
							v-if="$_has('GQPXBtnDetele')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" top="8vh" width="70%">
			<el-scrollbar class="scrollbar">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 600">基本信息</span>
					</div>
					<div>
						<el-form :model="parms" :rules="rules" ref="ruleForm">
							<div class="form-3-col">
								<el-form-item label="培训名称" prop="TrainTaskName">
									<el-input maxlength="200" v-model="parms.TrainTaskName" show-word-limit></el-input>
								</el-form-item>
								<el-form-item label="安全等级" prop="SecurityLevel" ref="SecurityLevel">
									<select-level v-model="parms.SecurityLevel" :multiple="false"
										:value="parms.SecurityLevel"></select-level>
								</el-form-item>
								<el-form-item label="培训课时" prop="TrainHours">
									<el-input-number class="el-input" :min="1" :max="1000"
										v-model="parms.TrainHours"></el-input-number>
								</el-form-item>
							</div>
							<!-- <div class="form-col">
								<el-form-item  label="岗位" prop="PositionList">
									<select-position v-model="parms.PositionList" :multiple="true" placeholder="岗位"></select-position>
								</el-form-item>
							</div> -->
						</el-form>
					</div>
				</el-card>
				<el-card class="box-card" style="margin-top: 20px">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 600">培训课程</span>
					</div>
					<div>
						<el-form :model="Course" v-if="Course.CurriculumName">
							<div class="form-col">
								<el-form-item label="课程名称">
									<div class="el-input">{{
                                        Course.CurriculumName || "无"
                                    }}</div>
								</el-form-item>
								<el-form-item label="课程编号">
									<div class="el-input">{{ Course.CurriculumNo || "无" }}</div>
								</el-form-item>
							</div>
							<el-form-item label="课程详情">
								<div class="el-input" v-html="Course.Remark || '无'"></div>
							</el-form-item>
						</el-form>
						<el-table border :data="Course.Coursewares" :cell-style="{ textAlign: 'center' }"
							:header-cell-style="$tableStyle">
							<el-table-column type="index" label="序号" align="center" width="60">
							</el-table-column>
							<el-table-column label="编号" align="center" prop="CoursewareNo">
							</el-table-column>
							<el-table-column label="课件名称" align="center" prop="CoursewareName">
							</el-table-column>
							<el-table-column label="课程时长" align="center">
								<template slot-scope="{ row }">
									{{ calcCourseDuration(row) }}
								</template>
							</el-table-column>
							<el-table-column label="教师名称" align="center" prop="TeacherName">
							</el-table-column>
						</el-table>
						<el-button type="primary" icon="el-icon-plus" style="width: 100%"
							@click="addShow1 = true">选择课程</el-button>
					</div>
				</el-card>

				<el-card class="box-card" style="margin-top: 20px">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 600">培训考试</span>
					</div>
					<div>
						<el-table border :data="Paperlist" :cell-style="{ textAlign: 'center' }"
							:header-cell-style="$tableStyle">
							<el-table-column type="index" label="序号" align="center" width="60">
							</el-table-column>
							<el-table-column label="试卷编号" align="center" prop="ExaminationPaperNumber">
							</el-table-column>
							<el-table-column label="试卷名称" align="center" prop="ExaminationPaperName">
							</el-table-column>
							<el-table-column label="考试时长(分)" align="center" prop="TestTime">
							</el-table-column>
							<el-table-column label="试题数" align="center" prop="QuestionNumber">
							</el-table-column>
							<el-table-column label="总分" align="center" prop="TotalScore">
							</el-table-column>
							<el-table-column label="合格分数" align="center" prop="PassScore">
							</el-table-column>
							<el-table-column label="考试次数" align="center">
								<template slot-scope="scope">
									<el-input-number size="mini" :min="1" v-model="scope.row.ExamCount"
										@change="changeExamCount(scope.$index)"></el-input-number>
								</template>
							</el-table-column>
							<el-table-column label="操作" align="center" width="100">
								<template slot-scope="scope">
									<el-button size="mini" type="danger" @click="
                                            deleValuePaperlist(scope.$index)
                                        ">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-button type="primary" icon="el-icon-plus" style="width: 100%"
							@click="addShow4 = true">选择试卷</el-button>
					</div>
				</el-card>
				<el-card class="box-card" style="margin-top: 20px">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 600">培训岗位</span>
					</div>
					<div class="card-title">岗位</div>
					<el-table border :data="positionList" :header-cell-style="$tableStyle">
						<el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
						<el-table-column label="岗位名称" align="center" prop="Name"></el-table-column>
						<el-table-column label="操作" width="100">
							<template slot-scope="{ $index }">
								<el-button type="text" @click="positionList.splice($index, 1)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-button type="primary" icon="el-icon-plus" style="width: 100%"
						@click="choosePosition">选择岗位</el-button>
				</el-card>
			</el-scrollbar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addShow = false">关闭</el-button>
				<el-button @click="submit('ruleForm')" type="primary" :loading="btn">确定</el-button>
			</span>
		</el-dialog>
		<!--弹层结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag title="选择课程" :visible.sync="addShow1" :close-on-click-modal="false" width="70%">
			<Course @getValue="getValueCourse($event)" />
		</el-dialog>
		<!--弹层结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag title="选择试卷" :visible.sync="addShow4" :close-on-click-modal="false" width="70%">
			<Paper @getValue="getValuePaper($event)" />
		</el-dialog>
		<!--弹层结束-->

		<!--弹层开始-->
		<info ref="info" @load="getList()" />
		<!--弹层结束-->
	</page-layout>
</template>



<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import RULECONFIG from "@/common/ruleConfig";
	import Course from "@/pages/Education/Traintask/course1"; //课程列表
	import Paper from "@/pages/Education/Traintask/paper1"; //试卷列表
	import Import_export from "@/mixins/Import_export.js";
	import util from '@/common/util';
	import info from '@/pages/Education/Traintask/info';
	export default {
		components: {
			Course,
			Paper,
			info
		},
		mixins: [request_mixin, upload_mixin, Import_export],
		data() {
			return {
				editorOption: {
					//富文本配置
					modules: {
						toolbar: [
							["bold", "italic", "underline", "strike"], // 字体
							["image", {
								align: []
							}], // 图片与文本居中
						],
					},
				},
				Course: {}, //课程
				Paperlist: [], //试卷
				//搜索时的过滤条件
				filters: {
					TrainTaskName: "",
					PositionList: [],
					TrainTypeCode: "0004502",
				},
				btn: false,
				trainPlanOptions: [], //培训计划选项
				trainTypeOptions: [], //培训类型选项
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
				addShow4: false,
				dialogTitle: "新增",
				//列表页面是否加载变量
				loading: false,
				ISTrainDateRange: true,
				parms: {
					TrainTaskName: "", // string 任务名称 [1-200]
					TrainPlanId: "", // long 培训计划
					TrainTypeCode: "0004502", // 培训类型
					TrainHours: 1, //培训课时
					IsTrainTime: 1, // int 是否开启培训时间 必填 [0,1]
					TrainDateRange: "", // 培训开始时间 开启培训时必填
					CurriculumId: "", // long 课程Id
					TaskExaminationPaper: [], //试卷
					SecurityLevel: "1",
					PositionList: []
				},
				rules: {
					TrainTaskName: RULECONFIG.Text("任务名称"),
					TrainDateRange: RULECONFIG.Text("培训时间"),
					SecurityLevel: RULECONFIG.Select("安全等级"),
					TrainHours: RULECONFIG.Text("培训课时"),
				},
				positionList: [],
			};
		},
		methods: {
			changeExamCount(index) {
				this.parms.TaskExaminationPaper[index].ExamCount =
					this.Paperlist[index].ExamCount;
			},
			getValueCourse(e) {
				//获取选择的课程
				this.Course = e;
				this.parms.CurriculumId = e.CurriculumId;
				this.addShow1 = false;
			},
			deleValuePaperlist(index) {
				this.parms.TaskExaminationPaper.splice(index, 1);
				this.Paperlist.splice(index, 1);
			},
			getValuePaper(e) {
				if (this.Paperlist && this.Paperlist.length) {
					var isExist = 0;
					this.Paperlist.forEach((key) => {
						if (key.ExaminationPaperId == e.ExaminationPaperId) {
							isExist = 1;
						}
					});
					if (!isExist) {
						this.Paperlist.push(e);
						this.parms.TaskExaminationPaper.push({
							ExaminationPaperId: e.ExaminationPaperId,
							ExamCount: e.ExamCount,
						});

						this.$message({
							type: "success",
							message: "添加成功!",
						});
					} else {
						this.$message.error("请勿添加重复数据！");
					}
				} else {
					this.Paperlist.push(e);
					this.parms.TaskExaminationPaper.push({
						ExaminationPaperId: e.ExaminationPaperId,
						ExamCount: e.ExamCount,
					});
					this.$message({
						type: "success",
						message: "添加成功!",
					});
				}
				this.addShow4 = false;
			},
			addshow() {
				this.parms = {
					TrainTaskName: "", // string 任务名称 [1-200]
					TrainPlanId: "", // long 培训计划
					TrainHours: 1,
					IsTrainTime: "", // int 是否开启培训时间 必填 [0,1]
					TrainDateRange: "", // 培训开始时间 开启培训时必填
					CurriculumId: "", // long 课程Id
					TaskExaminationPaper: [], //试卷，
					SecurityLevel: "1",
					TrainTypeCode: "0004502",
					PositionList: []
				};
				this.Course = {}; //课程
				this.Paperlist = []; //试卷
				this.addShow = true;
				this.dialogTitle = "新增";
			},
			delTrain(id) {
				this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					this.Get("/DeleteTrainTask", {
						TrainTaskId: id,
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
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = JSON.parse(JSON.stringify(this.parms));
						if (!this.parms.CurriculumId && !this.parms.TaskExaminationPaper.length) {
							return this.$message.error('请选择培训课程或考试');
						}
						if (!this.positionList.length) {
							return this.$message.error('请选择岗位');
						}
						params.Positions = this.positionList;
						params.SecurityLevel = parseInt(params.SecurityLevel)
						this.btn = true;
						this.Post("/SaveTrainTask", params).then((res) => {
							this.btn = false;
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
				});
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
			choosePosition() {
				this.$choosePosition({
					choosed: this.positionList
				}).then(res => {
					this.positionList = res;
				})
			},
			//获取列表数据
			getList() {
				let that = this;
				let params = Object.assign({
						page: that.pages.page,
						rows: that.pages.rows,
					},
					that.filters
				);

				that.loading = true;
				this.Post("/GetTrainTasks", params)
					.then((res) => {
						if (res.status == 2000) {
							res.data.list.forEach((val) => {
								if (val.TrainDateRange && val.TrainDateRange.length > 0) {
									val.TrainDateRange = val.TrainDateRange.map(
										(key) => {
											return (key = key.slice(0, 10));
										}
									);
								} else {
									val.TrainDateRange = "";
								}
							});
							this.list = res.data.list;
							this.pages.total = res.data.count;
						}
						that.loading = false;
					})
					.finally(() => {
						this.loading = false;
					});
			},
			changeTime() {
				if (this.parms.IsTrainTime) {
					this.ISTrainDateRange = false;
				} else {
					this.ISTrainDateRange = true;
					this.$refs.ruleForm.clearValidate("TrainDateRange");
				}
			},
			//弹层的取消
			dialogClear() {
				let than = this;
				than.addShow = false;
				this.$refs.ruleForm.clearValidate();
			},
			//详情列表数据
			seeTrain(id) {
				this.$refs.info.show(id);
			},
			calcCourseDuration(row) {
				let duration = 0;
				if (row) {
					row.AttachmentFiles.forEach(file => {
						duration += file.Lengths;
					});
				}
				return util.durationFormat(duration);
			}
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
			this.Get("/GetTrainPlansCom").then((res) => {
				if (res.status == 2000) {
					this.trainPlanOptions = res.data;
				}
			});

			this.Get("/GetTrainingTypeCodeCom").then((res) => {
				if (res.status == 2000) {
					this.trainTypeOptions = res.data;
				}
			});
		},
	};
</script>

<style scoped lang="less">
	.form-3-col {
		display: flex;

		>div {
			flex: 1;

			&:not(:last-child) {
				margin-right: 20px;
			}
		}
	}

	.split-line {
		&::before {
			content: '';
			display: block;
			margin: 0 -25px 25px;
			height: 10px;
			background: #f2f2f2;
		}
	}

	.el-select {
		width: 100%;
	}

	.gutter {
		margin-right: 20px;
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

	/deep/ .detailTable td,
	.detailTable th {
		padding: 9px 0;
	}

	.card-title {
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 17px;
		background: #f5f5f5;
		color: #888;
		margin-top: 10px;
	}
</style>