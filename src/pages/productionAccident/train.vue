<template>
  <page-layout :loading="loading">
    <!--弹层开始-->
    <el-dialog
      v-dialog-drag
      :title="dialogTitle"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      @close="dialogClear"
      top="8vh"
      width="70%"
    >
      <el-scrollbar class="scrollbar">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: 15px; font-weight: 600">基本信息</span>
          </div>
          <div>
            <el-form :model="info" :rules="rules" ref="ruleForm">
              <div class="form-col">
                <el-form-item
                  label="部门"
                  prop="DepartmentId"
                  ref="DepartmentId"
                >
                  <span>{{ info.DepartmentName }}</span>
                </el-form-item>
                <el-form-item
                  label="培训人"
                  prop="DepartmentId"
                  ref="DepartmentId"
                >
                  <span>{{ info.ResponsibleUserName }}</span>
                </el-form-item>
              </div>
              <div class="form-col">
                <el-form-item label="任务名称" prop="TrainTaskName">
                  <el-input
                    maxlength="200"
                    v-model="info.TrainTaskName"
                    placeholder="任务名称"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="培训课时" prop="TrainHours">
                  <el-input-number
                    class="el-input"
                    :min="1"
                    :max="1000"
                    style="width: 100%"
                    v-model="info.TrainHours"
                  ></el-input-number>
                </el-form-item>
              </div>
              <div class="form-col">
                <el-form-item
                  label="培训周期"
                  prop="TrainDateRange"
                >

                  <!--  :prop="ISTrainDateRange == false ? 'TrainDateRange' : ''" -->
                  <div class="el-input f--c">
                    <!-- <el-switch
                      class="gutter"
                      v-model="info.IsTrainTime"
                      active-text="限制"
                      inactive-text="不限"
                      :active-value="1"
                      :inactive-value="0"
                      @change="changeTime()"
                    >
                    </el-switch> -->
                    <el-date-picker
                      v-model="info.TrainDateRange"
                      type="daterange"
                      :disabled="ISTrainDateRange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </div>
                </el-form-item>
                <el-form-item
                  label="安全等级"
                  prop="SecurityLevel"
                  ref="SecurityLevel"
                >
                  <select-level
                    v-model="info.SecurityLevel"
                    :multiple="false"
                    :value="info.SecurityLevel"
                  ></select-level>
                </el-form-item>
              </div>
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
                  <div class="el-input">
                    {{ Course.CurriculumName || "无" }}
                  </div>
                </el-form-item>
                <el-form-item label="课程编号">
                  <div class="el-input">{{ Course.CurriculumNo || "无" }}</div>
                </el-form-item>
              </div>
              <el-form-item label="课程详情">
                <div class="el-input" v-html="Course.Remark || '无'"></div>
              </el-form-item>
            </el-form>
            <el-table
              border
              :data="Course.Coursewares"
              :cell-style="{ textAlign: 'center' }"
              :header-cell-style="$tableStyle"
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
              >
              </el-table-column>
              <el-table-column label="编号" align="center" prop="CoursewareNo">
              </el-table-column>
              <el-table-column
                label="课件名称"
                align="center"
                prop="CoursewareName"
              >
              </el-table-column>
              <el-table-column label="课程时长" align="center">
                <template slot-scope="{ row }">
                  {{ calcCourseDuration(row) }}
                </template>
              </el-table-column>
              <el-table-column
                label="教师名称"
                align="center"
                prop="TeacherName"
              >
              </el-table-column>
            </el-table>
            <el-button
              type="primary"
              icon="el-icon-plus"
              style="width: 100%"
              @click="addShow1 = true"
              >选择课程</el-button
            >
          </div>
        </el-card>

        <el-card class="box-card" style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <span style="font-size: 15px; font-weight: 600">培训考试</span>
          </div>
          <div>
            <el-table
              border
              :data="Paperlist"
              :cell-style="{ textAlign: 'center' }"
              :header-cell-style="$tableStyle"
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
              >
              </el-table-column>
              <el-table-column
                label="试卷编号"
                align="center"
                prop="ExaminationPaperNumber"
              >
              </el-table-column>
              <el-table-column
                label="试卷名称"
                align="center"
                prop="ExaminationPaperName"
              >
              </el-table-column>
              <el-table-column
                label="考试时长(分)"
                align="center"
                prop="TestTime"
              >
              </el-table-column>
              <el-table-column
                label="试题数"
                align="center"
                prop="QuestionNumber"
              >
              </el-table-column>
              <el-table-column label="总分" align="center" prop="TotalScore">
              </el-table-column>
              <el-table-column label="合格分数" align="center" prop="PassScore">
              </el-table-column>
              <el-table-column label="考试次数" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    size="mini"
                    :min="1"
                    v-model="scope.row.ExamCount"
                    @change="changeExamCount(scope.$index)"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleValuePaperlist(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-button
              type="primary"
              icon="el-icon-plus"
              style="width: 100%"
              @click="addShow4 = true"
              >选择试卷</el-button
            >
          </div>
        </el-card>

        <el-card class="box-card" style="margin-top: 20px">
      <el-form>
        <template >
						<el-form-item label="附件">
							<div class="f-b-c">
								<customUploadDrag class="w50" @onUpload="handleUpload" :Data="fileList"
									:showFileList="false"
									:acceptList="['mp4', 'mp3', 'png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'xls', 'xlsx', 'pdf']">
									<div class="f-c-c">
										<i class="el-icon-upload"></i>
										<div class="el-upload__text">
											将文件拖到此处或<em>点击上传</em>
										</div>
									</div>
								</customUploadDrag>
								<div class="f--c w50" style="color: #959595;margin-left: 15px;">

									<span>支持mp4、pdf、doc、jpeg、jpg、png文件</span>
								</div>
							</div>
							<div class="file-list" v-for="(item, index) in fileList" :key="index">
								<div class="file-item" @click="$openFile(item.url)">
									<div class="file f-b-c">
										<div class="f">
											<img style="width:30px;height:30px;margin-right: 13px;"
												:src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
											<div class="text">
												<div style="color:#44566C;font-size:12px;line-height: 1;;">
													{{item.Name}}
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
					</template>
      </el-form>



        </el-card>
        <!-- <el-card class="box-card" style="margin-top: 20px">
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
									{{ scope.row.DepartmentList.map(item => item.DepartmentName).join('、') }}
								</template>
							</el-table-column>
							<el-table-column label="岗位" align="center">
								<template slot-scope="scope">
									{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
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
				</el-card> -->
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">{{
          info.TrainTaskId ? "关闭" : "取消"
        }}</el-button>
        <el-button
          @click="submit('ruleForm')"
          type="primary"
          :loading="btn"
          v-if="!info.TrainTaskId"
          >提交</el-button
        >
      </span>
    </el-dialog>
    <!--弹层结束-->

    <!--弹层开始-->
    <el-dialog
      v-dialog-drag
      title="选择课程"
      :visible.sync="addShow1"
      :close-on-click-modal="false"
      width="70%"
    >
      <Course @getValue="getValueCourse($event)" />
    </el-dialog>
    <!--弹层结束-->

    <!--弹层开始-->
    <el-dialog
      v-dialog-drag
      title="选择试卷"
      :visible.sync="addShow4"
      :close-on-click-modal="false"
      width="70%"
    >
      <Paper @getValue="getValuePaper($event)" />
    </el-dialog>
    <!--弹层结束-->
    <info ref="info" />
  </page-layout>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import RULECONFIG from "@/common/ruleConfig";
import Course from "@/pages/Education/Traintask/course"; //课程列表
import Paper from "@/pages/Education/Traintask/paper"; //试卷列表
import Import_export from "@/mixins/Import_export.js";
import util from "@/common/util";
import info from "../Education/trainTaskInfo";
import customUploadDrag from "@/components/common/custom-upload-drag.vue";


export default {
  components: {
    Course,
    Paper,
    info
  },
  mixins: [request_mixin, upload_mixin, Import_export],
  data() {
    return {
      fileList:[],//上传附件
      Course: {}, //课程
      Personnellist: [], //人员
      Paperlist: [], //试卷
      btn: false,
      trainPlanOptions: [], //培训计划选项
      trainTypeOptions: [], //培训类型选项
      //数据列表
      list: [],
      //弹层数据
      addShow: false,
      addShow1: false,
      addShow4: false,
      dialogTitle: "新增",
      //列表页面是否加载变量
      loading: false,
      ISTrainDateRange: false,
      info: {
        TrainTaskName: "", // string 任务名称 [1-200]
        TrainPlanId: "", // long 培训计划
        TrainTypeCode: "0004501", // 培训类型
        TrainHours: 1, //培训课时
        IsTrainTime: 0, // int 是否开启培训时间 必填 [0,1]
        TrainDateRange: "", // 培训开始时间 开启培训时必填
        CurriculumId: "", // long 课程Id
        Users: [], // array 培训人员
        TaskExaminationPaper: [], //试卷
        SecurityLevel: "1",
        ResponsibleUserId: "", //培训人ID
        ResponsibleUserName: "", // 培训人姓名
        EnterpriseId: "", // 企业
        EnterpriseName: "", // 企业名字
        DepartmentName: "", // 部门名字
        DepartmentId: "", // 部门ID
        TrainTaskId: ""
      },
      rules: {
        TrainTaskName: RULECONFIG.Text("任务名称"),
        TrainDateRange: RULECONFIG.Text("培训时间"),
        TrainTypeCode: RULECONFIG.Select("培训类型"),
        SecurityLevel: RULECONFIG.Select("安全等级"),
        DepartmentId: RULECONFIG.Select("部门"),
        TrainHours: RULECONFIG.Text("培训课时")
      }
      // positionList: [],
    };
  },
  methods: {
    handleUpload() {
				this.fileList.forEach(item => {
					this.$set(item, 'Name', item.name);
					this.$set(item, 'VideoUrl', item.url);
					this.$set(item, 'Size', item.size);
					this.$set(item, 'Ext', item.ext);
					this.$set(item, 'CoverUrl', item.coverUrl);
					this.$set(item, 'Lengths', item.lengths);
					this.$set(item, 'TotalSeconds', item.lengths);
					let hms = secondsToHms(parseInt(item.Lengths || 0))
					this.$set(item, 'hms', hms);
				});

    },
			removeFile(index) {
				this.fileList.splice(index, 1);
			},
    handlePreview(files, fileList){
      console.log(files,fileList,'8888888888866')
    },
    getFileList(e){
      console.log(e,'9999999999')
    },
    show(item) {
      if (!item.TrainTaskId) {
        this.addShow = true;
        this.info.ResponsibleUserId = item.ResponsibleUserName;
        this.info.ResponsibleUserName = item.ResponsibleUserName;
        this.info.EnterpriseId = item.EnterpriseId;
        this.info.EnterpriseName = item.EnterpriseName;
        this.info.DepartmentName = item.DepartmentName;
        this.info.DepartmentId = item.DepartmentId;
        this.info.EventReportId = item.EventReportId;
        this.info.Users = [{ UserId: item.ResponsibleUserId }];
      } else {
        this.$refs.info.show(item);
      }
    },
    changeExamCount(index) {
      this.info.TaskExaminationPaper[index].ExamCount = this.Paperlist[
        index
      ].ExamCount;
    },
    getValueCourse(e) {
      //获取选择的课程
      this.Course = e;
      this.info.CurriculumId = e.CurriculumId;
      this.addShow1 = false;
    },
    deleValuePersonnellist(index, row) {
      this.info.Users.splice(index, 1);
      this.Personnellist.splice(index, 1);
    },
    deleValuePaperlist(index) {
      this.info.TaskExaminationPaper.splice(index, 1);
      this.Paperlist.splice(index, 1);
    },
    choosePersonnel(item) {
      this.$chooseUser({
        choosed: this.Personnellist
      }).then(data => {
        this.Personnellist = data;
        this.info.Users = data.map(e => {
          return {
            UserId: e.UserId
          };
        });
      });
    },
    getValuePaper(e) {
      if (this.Paperlist && this.Paperlist.length) {
        var isExist = 0;
        this.Paperlist.forEach(key => {
          if (key.ExaminationPaperId == e.ExaminationPaperId) {
            isExist = 1;
          }
        });
        if (!isExist) {
          this.Paperlist.push(e);
          this.info.TaskExaminationPaper.push({
            ExaminationPaperId: e.ExaminationPaperId,
            ExamCount: e.ExamCount
          });

          this.$message({
            type: "success",
            message: "添加成功!"
          });
        } else {
          this.$message.error("请勿添加重复数据！");
        }
      } else {
        this.Paperlist.push(e);
        this.info.TaskExaminationPaper.push({
          ExaminationPaperId: e.ExaminationPaperId,
          ExamCount: e.ExamCount
        });
        this.$message({
          type: "success",
          message: "添加成功!"
        });
      }
      this.addShow4 = false;
    },
    addshow() {
      this.info = {
        TrainTaskName: "", // string 任务名称 [1-200]
        TrainPlanId: "", // long 培训计划
        TrainTypeCode: "0004501", // 培训类型
        TrainHours: 1, //培训课时
        IsTrainTime: 0, // int 是否开启培训时间 必填 [0,1]
        TrainDateRange: "", // 培训开始时间 开启培训时必填
        CurriculumId: "", // long 课程Id
        Users: [], // array 培训人员
        TaskExaminationPaper: [], //试卷
        SecurityLevel: "1",
        ResponsibleUserId: "", //培训人ID
        ResponsibleUserName: "", // 培训人姓名
        EnterpriseId: "", // 企业
        EnterpriseName: "", // 企业名字
        DepartmentName: "", // 部门名字
        DepartmentId: "", // 部门ID
        EventReportId: "",
        TrainWay: 0
      };
      this.Course = {}; //课程
      // this.positionList = [];
      (this.Personnellist = []), //人员
        (this.Paperlist = []); //试卷
      this.addShow = true;
      this.dialogTitle = "新增";
    },
    submit(formName) {


      this.$refs[formName].validate(valid => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.info));
          if (
            !this.info.CurriculumId &&
            !this.info.TaskExaminationPaper.length
          ) {
            return this.$message.error("请选择培训课程或考试");
          }
          info.SecurityLevel = parseInt(info.SecurityLevel);

          this.btn = true;

          if(this.fileList && this.fileList.length>0){
            info.TrainFiles = this.fileList;
          }


          this.Post("/SaveTrainTask", info).then(res => {
            this.btn = false;
            if (res.status == 2000) {
              this.$emit("success");
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.addShow = false;
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    changeTime() {
      if (this.info.IsTrainTime) {
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
    this.upload.arrFiles = [[], [], [], [], []];
    this.Get("/GetTrainPlansCom").then(res => {
      if (res.status == 2000) {
        this.trainPlanOptions = res.data;
      }
    });

    this.Get("/GetTrainingTypeCodeCom").then(res => {
      if (res.status == 2000) {
        this.trainTypeOptions = res.data;
      }
    });
  }
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
