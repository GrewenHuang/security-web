<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<!-- <el-select
				    class="el-input"
				    v-model="filters.TrainTypeCode"
				    clearable
				    placeholder="培训类型"
				>
				    <el-option
				        v-for="item in trainTypeOptions"
				        :key="item.id"
				        :label="item.text"
				        :value="item.id"
				    >
				    </el-option>
				</el-select> -->
				<el-input v-model="filters.TrainTaskName" placeholder="任务名称" clearable></el-input>
				<select-position v-model="filters.PositionList" :multiple="true" placeholder="岗位"></select-position>
				<el-button type="primary" @click="handleSearch()">查询</el-button>
			</div>
			<div>
				<el-button v-if="$_has('ZJYPXBtnAdd')" type="primary" icon="el-icon-plus"
					@click="addshow()">新增</el-button>
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
			<el-table-column label="企业" align="center" prop="EnterpriseName">
			</el-table-column>
			<el-table-column label="部门" align="center" prop="DepartmentName">
			</el-table-column>
			<el-table-column label="任务名称" align="center" prop="TrainTaskName">
			</el-table-column>
			<!-- 	<el-table-column label="岗位" align="center" show-overflow-tooltip  width="120">
			    <template slot-scope="scope">
			        {{ scope.row.Positions.map(item => item.PositionName).join('、') }}
			    </template>
			</el-table-column> -->
			<el-table-column label="培训课时" align="center" width="120">
				<template slot-scope="scope">
					<div v-if="scope.row.TrainWay == 0">
						{{ scope.row.TrainHours }}课时({{
                            scope.row.TrainHours * 45
                        }}分钟)
					</div>
					<div v-else>
						-
					</div>
				</template>
			</el-table-column>
			<el-table-column label="培训周期" align="center" width="200">
				<template slot-scope="scope">
					<div v-if="
                            scope.row.TrainDateRange &&
                            scope.row.TrainDateRange.length
                        ">
						<div>开始时间：{{ scope.row.TrainDateRange[0] }}</div>
						<div>结束时间：{{ scope.row.TrainDateRange[1] }}</div>
					</div>
					<div v-else>不限</div>
				</template>
			</el-table-column>
			<el-table-column label="计划人数" align="center" width="100" prop="PlanUserCount">
			</el-table-column>
			<el-table-column label="完成人数" align="center" width="100">
				<template slot-scope="scope">
					<span>
						{{ scope.row.TrainWay == 2 ? '-' : scope.row.PlanUserCompleteCount }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="完成率" align="center" width="80">
				<template slot-scope="scope">
					<span>
						{{ scope.row.TrainWay == 2 ? '-' : scope.row.CompleteRate + '%' }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="创建人" align="center" width="100" prop="CreateByName">
			</el-table-column>
			<el-table-column label="创建时间" align="center" width="150" prop="CreateTimeDesc">
			</el-table-column>
			<el-table-column label="操作" align="center" width="300">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" v-if="scope.row.TrainWay == 2 && $_has('ZJYPXBtnLook')" @click="onLook(scope.row)">查看</el-button>
						<el-button v-if="$_has('ZJYPXBtnPXXQ') && scope.row.TrainWay != 2" type="text"
							@click="seeTrain(scope.row)">培训详情</el-button>
						<el-button v-if="$_has('ZJYPXBtnDown') && scope.row.TrainWay != 2" type="text" @click="
                                downloadmbs(60, 602, {
                                    TrainTaskId: scope.row.TrainTaskId,
                                })
                            ">档案下载</el-button>
						<el-button v-if="$_has('ZJYPXBtnDetele')" type="text" text-plain
							@click="delTrain(scope.row.TrainTaskId)">删除</el-button>
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

							<div class="form-col">
								<el-form-item label="部门" prop="DepartmentId" ref="DepartmentId">
									<el-cascader v-model="parms.DepartmentId" filterable clearable
										:options="DepartmentPositionUser"
										@change="handleCascaderChange"
										placeholder="部门" :show-all-levels="false" style="width: 100%"
										:props="{ value: 'value', label: 'label', children: 'children',checkStrictly: true }">
									</el-cascader>
									<!-- <custom-tree
									     v-model="parms.DepartmentList"
									     :data="DepartmentPositionUser"
									     :expand-all="true"
									     :check-strictly="true"
									     immediately
									     node-key="value"
									     selectedId="DepartmentId"
									 ></custom-tree> -->
								</el-form-item>
								<el-form-item label="安全等级" prop="SecurityLevel" ref="SecurityLevel">
									<select-level v-model="parms.SecurityLevel" :multiple="false"
										:value="parms.SecurityLevel"></select-level>
								</el-form-item>
							</div>
							<div class="form-col">
								<div>
									<el-form-item label="任务名称" prop="TrainTaskName">
										<el-input maxlength="200" v-model="parms.TrainTaskName" show-word-limit></el-input>
									</el-form-item>
								</div>
								<div>
									<el-form-item label="培训课时" prop="TrainHours" v-if="parms.TrainWay == '0'">
										<el-input-number class="el-input" :min="1" :max="1000" style="width: 100%"
											v-model="parms.TrainHours"></el-input-number>
									</el-form-item>
								</div>
								<!-- <el-form-item label="培训计划">
							        <el-select
							            class="el-input"
							            v-model="parms.TrainPlanId"
							            clearable
							            placeholder="培训计划"
							        >
							            <el-option
							                v-for="item in trainPlanOptions"
							                :key="item.TrainPlanId"
							                :label="item.TrainPlanName"
							                :value="item.TrainPlanId"
							            >
							            </el-option>
							        </el-select>
							    </el-form-item> -->
							</div>
							<div class="form-col">
								<el-form-item label="培训类型" prop="TrainWay">
									<el-select class="el-input" v-model="parms.TrainWay" clearable
										placeholder="培训类型">
										<el-option v-for="item in trainTypeOptions" :key="item.id" :label="item.text"
											:value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="培训周期" :prop="
								         'TrainDateRange'
								     ">
									<div class="el-input f--c">
										<!-- <el-switch class="gutter" v-model="parms.IsTrainTime" active-text="限制"
											inactive-text="不限" :active-value="1" :inactive-value="0"
											@change="changeTime()">
										</el-switch> -->
										<el-date-picker v-model="
								                 parms.TrainDateRange
								             " type="daterange"  value-format="yyyy-MM-dd" range-separator="至"
											start-placeholder="开始日期" end-placeholder="结束日期">
										</el-date-picker>
									</div>
								</el-form-item>
							</div>
							<el-form-item label="会议内容" prop="TrainContent" v-if="parms.TrainWay != '0'">
								<el-input type="textarea" v-model="parms.TrainContent" maxlength="1000" rows="8"
									show-word-limit></el-input>
							</el-form-item>
							<el-form-item label="会议地点" prop="TrainAddress" v-if="parms.TrainWay == '1'">
								<el-input v-model="parms.TrainAddress" maxlength="100" show-word-limit></el-input>
							</el-form-item>
              <!-- v-if="parms.TrainWay == '2'" -->
							<el-form-item label="附件" prop="TrainFiles" >
								<div>
									<customUploadDrag @onUpload="handleUpload" :Data="parms.TrainFiles" :showFileList="false"
										:acceptList="['mp4', 'png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'xls', 'xlsx', 'pdf']">
										<div class="f-c-c">
											<i class="el-icon-upload"></i>
											<div class="el-upload__text">
												将文件拖到此处或<em>点击上传</em>
											</div>
										</div>
									</customUploadDrag>
									<div style="color: #959595;margin-left: 15px;">
										<span>支持mp4、pdf、doc、jpeg、jpg、png文件</span>
									</div>
								</div>
								<div class="file-list" v-for="(item, index) in parms.TrainFiles" :key="index">
									<div class="file-item" @click="$openFile(item.url)">
										<div class="file f-b-c">
											<div class="f">
												<img style="width:30px;height:30px;margin-right: 13px;"
													:src="$fileIcons[item.name.substring(item.name.lastIndexOf('.') + 1)]" />
												<div class="text">
													<div style="color:#44566C;font-size:12px;line-height: 1;;">
														{{item.name}}
													</div>
													<div
														style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">
														{{ item.Size | formatSize}}
													</div>
												</div>
											</div>
											<div>
												<i class="el-icon-error cursor-p" @click="removeFile(index)"></i>
											</div>
										</div>
										<div></div>
									</div>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</el-card>
				<el-card class="box-card" style="margin-top: 20px" v-if="parms.TrainWay == '0'">
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

				<el-card class="box-card" style="margin-top: 20px" v-if="parms.TrainWay == '0'">
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

				<!--                <el-card class="box-card" style="margin-top: 20px" >
                    <div slot="header" class="clearfix">
                        <span style="font-size: 15px; font-weight: 600"
                            >培训岗位</span
                        >
                    </div>
                        <div class="card-title">岗位</div>
                        <el-table
                            border
                            :data="positionList"
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                label="序号"
                                type="index"
                                width="80"
                                align="center"
                            ></el-table-column>
                            <el-table-column
                                label="岗位名称"
                                align="center"
                                prop="Name"
                            ></el-table-column>
                            <el-table-column
                                label="操作"
                                width="100"
                            >
                                <template slot-scope="{ $index }">
                                    <el-button type="text" @click="positionList.splice($index, 1)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            style="width: 100%"
                            @click="choosePosition"
                        >选择岗位</el-button>
                </el-card> -->
				<el-card class="box-card" style="margin-top: 20px">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 600">培训人员</span>
					</div>
					<div>
						<div class="card-title">人员</div>
						<el-table border :data="Personnellist" :cell-style="{ textAlign: 'center' }"
							:header-cell-style="$tableStyle">
							<el-table-column type="index" label="序号" align="center" width="60">
							</el-table-column>
							<el-table-column label="部门" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">{{ scope.row.DepartmentListJustShow.map(item => item.DepartmentName).join('、') }}</span>
								</template>
							</el-table-column>
							<el-table-column label="岗位" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
									{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
									</span>
								</template>
							</el-table-column>
							<el-table-column label="姓名" align="center" prop="UserName">
							</el-table-column>
							<el-table-column label="手机号" align="center" prop="Tel">
							</el-table-column>
							<el-table-column label="操作" align="center" width="100">
								<template slot-scope="scope">
									<el-button type="text" @click="
                                            deleValuePersonnellist(
                                                scope.$index,scope.row
                                            )
                                        ">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-button type="primary" icon="el-icon-plus" style="width: 100%"
							@click="choosePersonnel">选择人员</el-button>
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

		<look ref="look"></look>
		<!--弹层结束-->
	</page-layout>
</template>



<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import RULECONFIG from "@/common/ruleConfig";
	import Course from "@/pages/Education/Traintask/course"; //课程列表
	import Paper from "@/pages/Education/Traintask/paper"; //试卷列表
	import Import_export from "@/mixins/Import_export.js";
	import util from '@/common/util';
	import info from './trainTaskInfo';
	import look from './Traintask/look'
	export default {
		components: {
			Course,
			Paper,
			info,
			look
		},
		mixins: [request_mixin, upload_mixin, Import_export],
		data() {
			return {
				DepartmentPositionUser: [],
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
				Personnellist: [], //人员
				Paperlist: [], //试卷
				//搜索时的过滤条件
				filters: {
					TrainTaskName: "",
					PositionList: [],
					TrainTypeCode: "0004501",
				},
				btn: false,
				trainPlanOptions: [], //培训计划选项
				trainTypeOptions: [{
						id: '0',
						text: '线上'
					},
					{
						id: '1',
						text: '线下'
					},
					{
						id: '2',
						text: '线下附件'
					},
				], //培训类型选项
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
        // MTIANCI
				ISTrainDateRange: true,
				parms: {
					TrainTaskName: "", // string 任务名称 [1-200]
					TrainPlanId: "", // long 培训计划
					TrainTypeCode: "0004501", // 培训类型
					TrainTypeCode: 1,
					TrainHours: 1, //培训课时
					IsTrainTime: 1, // int 是否开启培训时间 必填 [0,1]
					TrainDateRange: "", // 培训开始时间 开启培训时必填
					CurriculumId: "", // long 课程Id
					Users: [], // array 培训人员
					TaskExaminationPaper: [], //试卷
					SecurityLevel: "1",
					DepartmentId: '',
					TrainWay: 0,
					TrainFiles: [],
					TrainContent: '',
					TrainAddress: ''
				},
				rules: {
					TrainTaskName: RULECONFIG.Text("任务名称"),
					TrainDateRange: RULECONFIG.Text("培训时间"),
					TrainWay: RULECONFIG.Select("培训类型"),
					SecurityLevel: RULECONFIG.Select("安全等级"),
					DepartmentId: RULECONFIG.Select("部门"),
					TrainHours: RULECONFIG.Text("培训课时"),
					TrainContent: RULECONFIG.Text("会议内容"),
					TrainAddress: RULECONFIG.Text("会议地址"),
					TrainFiles: [{
						required: true,
						type: 'array',
						message: '请上传附件'
					}]
				},
				// positionList: [],
			};
		},
		methods: {
			onLook(row){
				this.$refs.look.show(row)
			},
			handleUpload(e) {
				e.forEach(item => {
					this.$set(item, 'name', item.name);
					this.$set(item, 'VideoUrl', item.url);
					this.$set(item, 'Size', item.size);
					this.$set(item, 'Ext', item.ext);
					this.$set(item, 'CoverUrl', item.coverUrl);
					this.$set(item, 'Lengths', item.lengths);
					this.$set(item, 'TotalSeconds', item.lengths);
				});
				this.parms.TrainFiles = e
			},
			removeFile(index) {
				this.parms.TrainFiles.splice(index, 1);
			},
			handleCascaderChange(value) {
				if (value.length > 0) {
					const lastId = value[value.length - 1];
					this.parms.DepartmentId = lastId
					// 在这里可以对最后一级的 ID 进行你需要的操作
				}
			},
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
			deleValuePersonnellist(index, row) {
				this.parms.Users.splice(index, 1)
				this.Personnellist.splice(index, 1)
			},
			deleValuePaperlist(index) {
				this.parms.TaskExaminationPaper.splice(index, 1);
				this.Paperlist.splice(index, 1);
			},
			choosePersonnel(item) {
				this.$chooseUser({
					choosed: this.Personnellist
				}).then(data => {
					this.Personnellist = data;
					this.parms.Users = data.map(e => {
						return {
							UserId: e.UserId,
						}
					});
				})
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
					IsTrainTime: "1", // int 是否开启培训时间 必填 [0,1]
					TrainDateRange: "", // 培训开始时间 开启培训时必填
					CurriculumId: "", // long 课程Id
					TrainTypeCode: "0004501", // 培训类型
					Users: [], // array 培训人员
					TaskExaminationPaper: [], //试卷，
					SecurityLevel: "1",
					DepartmentId: '',
					TrainWay: '0',
					TrainFiles: [],
					TrainContent: '',
					TrainAddress: ''
				};
				this.Course = {}; //课程
				// this.positionList = [];
				(this.Personnellist = []), //人员
				(this.Paperlist = []); //试卷
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
						if(params.TrainWay == 0){
							if (!this.parms.CurriculumId && !this.parms.TaskExaminationPaper.length) {
								return this.$message.error('请选择培训课程');
							} else {
								if (!this.parms.Users.length) {
									return this.$message.error('请选择培训人员');
								}
								// if(this.parms.TrainTypeCode == '0004501') {
								//     if (!this.positionList.length) {
								//         return this.$message.error('请选择岗位');
								//     }
								// } else if (!this.parms.Users.length) {
								//     return this.$message.error('请选择培训人员');
								// }
							}
							// if (this.parms.TrainTypeCode == '0004501') {
							//     params.Positions = this.positionList;
							//     params.Users = [];
							// } else {
							//     params.Positions = [];
							// }
						}else {
							if (!this.parms.Users.length) {
								return this.$message.error('请选择培训人员');
							}
						}

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
			choosePosition() {
				this.$choosePosition({
					choosed: this.positionList
				}).then(res => {
					this.positionList = res;
				})
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
			removeEmptyChildrenDepartment(data) {
				data.forEach(item => {
					if (item.children && item.children.length === 0) {
						delete item.children;
					} else if (item.children && item.children.length > 0) {
						this.removeEmptyChildrenDepartment(item.children);
					}
				});
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
			this.Get("/GetTrainPlansCom").then((res) => {
				if (res.status == 2000) {
					this.trainPlanOptions = res.data;
				}
			});

			// this.Get("/GetTrainingTypeCodeCom").then((res) => {
			//     if (res.status == 2000) {
			//         this.trainTypeOptions = res.data;
			//     }
			// });

			this.Get('/GetDepartmentTree').then((res) => {
				//部门
				if (res.status == 2000) {
					this.DepartmentPositionUser = res.data
					if (this.DepartmentPositionUser && this.DepartmentPositionUser.length > 0) {
						this.removeEmptyChildrenDepartment(this.DepartmentPositionUser)
					}

				}
			})
		},
	};
</script>

<style scoped>
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
