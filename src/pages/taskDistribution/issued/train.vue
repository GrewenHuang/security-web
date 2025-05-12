<template>
    <div class="train-item">
        <el-form-item
            label="培训类型"
            :rules="rules.TrainTypeCode"
            prop="TaskTrainTask.TrainTypeCode"
            ref="TaskTrainTask.TrainTypeCode"
        >
            <ZYselect
                url="GetTrainingTypeCodeCom"
                placeholder="请选择"
                propid="id"
                propname="text"
                v-model="TaskTrainTask.TrainTypeCode"
                @change="handleTrainTypeChange"
                :disabled="isView"
            />
        </el-form-item>
        
        <el-form-item
            label="任务名称"
            prop="TaskTrainTask.TrainTaskName"
            :rules="rules.TrainTaskName"
            ref="TaskTrainTask.TrainTaskName"
        >
            <el-input
                maxlength="200"
                v-model="TaskTrainTask.TrainTaskName"
                show-word-limit
                :disabled="isView"
            ></el-input>
        </el-form-item>
        <div class="f-b-c">
            <el-form-item
                class="w50 gutter"
                label="培训课时"
                prop="TaskTrainTask.TrainHours"
                :rules="rules.TrainHours"
                ref="TaskTrainTask.TrainHours"
            >
                <el-input-number
                    :min="1"
                    :max="1000"
                    style="width: 100%"
                    v-model="TaskTrainTask.TrainHours"
                    :disabled="isView"
                ></el-input-number>
            </el-form-item>
            
            <el-form-item
                class="w50"
                label="培训周期"
                prop="TaskTrainTask.TrainDateRange"
                ref="TrainDateRange"
                :rules="TaskTrainTask.IsTrainTime == 1 ? rules.TrainDateRange : []"
            >
                <div class="f-b-c">
                    <el-switch
                        class="gutter"
                        v-model="TaskTrainTask.IsTrainTime"
                        active-text="限制"
                        inactive-text="不限"
                        :active-value="1"
                        :inactive-value="0"
                        :disabled="isView"
                        @change="changeTime()"
                    >
                    </el-switch>
                    <el-date-picker
                        class="f1"
                        v-model="
                            TaskTrainTask.TrainDateRange
                        "
                        type="daterange"
                        :disabled="TaskTrainTask.IsTrainTime == 0 || isView"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="handleDateRange"
                    >
                    </el-date-picker>
                </div>
            </el-form-item>
        </div>
        
        <div class="prominent">
            <div class="global-divider"></div>
            <el-form-item 
                prop="TaskTrainTask.CurriculumId"
                :rules="rules.CurriculumId"
                style="width: 0;height:0;margin:0;opacity: 0;"
            >
            </el-form-item>
            <div class="table-content">
                <div class="title-content f-b-c">
                    <div class="label">培训课程</div>
                    <div class="f--c" v-if="!isView">
                        <el-button type="primary" @click="addShow1 = true">选择培训课件</el-button>
                    </div>
                </div>
                <el-table
                    :data="Course.Coursewares"
                    highlight-current-row
                    :header-cell-style="$tableStyle"
                    style="width: 100%"
                >
                    <el-table-column
                        label="序号"
                        type="index"
                        align="center"
                        width="50"
                    ></el-table-column>
                    <el-table-column
                        label="编号"
                        align="center"
                        prop="CoursewareNo"
                        width="160"
                    >
                    </el-table-column>
                    <el-table-column
                        label="课件名称"
                        align="left"
                        prop="CoursewareName"
                    ></el-table-column>
                    <el-table-column
                        label="课件附件"
                        align="left"
                        width="350"
                    >
                        <template slot-scope="{ row }">
                            <div class="file-list">
                                <div class="item" v-for="(item, index) in row.AttachmentFiles" :key="index" @click="openFile(item)">
                                    <i class="file-icon" :style="{backgroundImage: `url(${$fileIcons[item.Ext.toLocaleLowerCase()]})`}"></i>
                                    {{ item.Name }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="培训时长"
                        align="center"
                        width="120"
                    >
                        <template slot-scope="{ row }">
                            {{ calcDuration(row) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="教师名称"
                        align="center"
                        prop="TeacherName"
                        width="120"
                    >
                    </el-table-column>
                </el-table>
            </div>
            <div class="global-divider"></div>
            <div class="table-content">
                <div class="title-content f-b-c">
                    <div class="label">考试试卷</div>
                    <div class="f--c" v-if="!isView">
                        <el-button type="primary" @click="addShow4 = true">选择考试试卷</el-button>
                    </div>
                </div>
                <el-table
                    :data="PaperList"
                    highlight-current-row
                    :header-cell-style="$tableStyle"
                    style="width: 100%"
                >
                    <el-table-column
                        label="序号"
                        type="index"
                        align="center"
                        width="50"
                    ></el-table-column>
                    <el-table-column
                        label="试卷名称"
                        align="left"
                        prop="ExaminationPaperName"
                    ></el-table-column>
                    <el-table-column
                        label="考试时长"
                        align="center"
                        width="100"
                        prop="TestTime"
                    ></el-table-column>
                    <el-table-column
                        label="总分"
                        align="center"
                        width="100"
                        prop="TotalScore"
                    ></el-table-column>
                    <el-table-column
                        label="合格线"
                        align="center"
                        width="100"
                        prop="PassScore"
                    ></el-table-column>
                    <el-table-column
                        label="考试次数"
                        align="center"
                        width="160"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-input-number
                                :min="1"
                                :step="1"
                                style="width: 100%"
                                v-model="row.ExamCount"
                                @change="changeExamCount(row, $index)"
                                v-if="!isView"
                            ></el-input-number>
                            <span v-else>{{ row.ExamCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="80"
                        v-if="!isView"
                    >
                        <template slot-scope="{ row, index }">
                            <el-button type="text" @click="PaperList.splice(index, 1)">删除</el-button>
                        </template>                
                    </el-table-column>
                </el-table>
            </div>
        </div>
        
        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            title="选择课程"
            :visible.sync="addShow1"
            :close-on-click-modal="false"
            :append-to-body="true"
            width="70%"
        >
            <Course @getValue="getValueCourse($event)" />
        </el-dialog>
        <el-dialog v-dialog-drag 
            title="选择试卷"
            :visible.sync="addShow4"
            :close-on-click-modal="false"
            :append-to-body="true"
            width="70%"
        >
            <Paper @getValue="getValuePaper($event)" />
        </el-dialog>
        <!--弹层结束-->
    </div>
</template>

<script>
import ZYselect from "@/components/common/zy_select";
import Course from "@/pages/Education/Traintask/course"; //课程列表
import Paper from "@/pages/Education/Traintask/paper"; //试卷列表
import util from '@/common/util';
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'train-item',
    components: {
        ZYselect,
        Course,
        Paper
    },
    props: {
        value: {
            type: Object,
            default() {
                return {}
            }
        },
        isView: {
            type: Boolean,
            default: false
        }
    },
    model: {
        event: 'change'
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                if (!this.watchUpdate) {
                    this.TaskTrainTask = val;
                    if (val.Curriculum) {
                        this.Course = val.Curriculum;
                    }
                    if (!!val.TaskExaminationPaper.length) {
                        this.PaperList = val.TaskExaminationPaper.map(item => {
                            return {
                                ...item,
                                ...item.ExaminationPaper,
                                ExamCount: item.ExamCount
                            }
                        })
                    };
                }
            }
        },
        TaskTrainTask: {
            deep: true,
            handler() {
                this.watchUpdate = true;
                this.$emit('change', this.TaskTrainTask);
                this.$nextTick(() => {
                    this.watchUpdate =false;
                })
            },
        }
    },
    data() {
        const validator = (rule, value, callback) => {
            if (!value && !this.TaskTrainTask.TaskExaminationPaper.length) {
                this.$message.error('请选择培训课件或考试试卷');
                callback(new Error('请选择培训课件或考试试卷'));
            } else {
                callback();
            }
        }
        return {
            watchUpdate: false,
            TaskTrainTask: {
                TrainTypeCode: '',
                TrainTypeName: '',
                TrainTaskName: '',
                IsTrainTime: false,
                TrainDateRange: [],
                TrainHours: '',
                TrainStartDate: '',
                TrainEndDate: '',
                CurriculumId: '',
                TaskExaminationPaper: [],
            },
            rules: {
                TrainTypeCode: [{required: true, message: '请选择培训类型', trigger: ['change', 'blur']}],
                TrainTaskName: [{required: true, message: '请输入任务名称', trigger: ['change', 'blur']}],
                TrainHours: [{required: true, message: '请选择培训课时', trigger: ['change', 'blur']}],
                TrainDateRange: [{required: true, message: '请选择培训周期', trigger: ['change']}],
                CurriculumId: [
                    {
                        validator: validator,
                        trigger: 'change'
                    }
                ]
            },
            addShow1: false,
            addShow4: false,
            Course: [],
            PaperList: [],
        }
    },
    methods: {
        changeTime(){
            if (this.TaskTrainTask.IsTrainTime) {
                this.$refs.TrainDateRange.clearValidate();
            }
            this.TaskTrainTask.TrainDateRange = [];
            this.handleDateRange();
        },
        getValueCourse(e) {
            this.Course = e;
            this.TaskTrainTask.CurriculumId = e.CurriculumId;
            this.addShow1 = false;
        },
        getValuePaper(e) {
            if (this.PaperList && this.PaperList.length) {
                var isExist = 0;
                this.PaperList.forEach((key) => {
                    if (key.ExaminationPaperId == e.ExaminationPaperId) {
                        isExist = 1;
                    }
                });
                if (!isExist) {
                    this.PaperList.push(e);
                    this.$message({
                        type: "success",
                        message: "添加成功!",
                    });
                } else {
                    this.$message.error("请勿添加重复数据！");
                }
            } else {
                this.PaperList.push(e);
                this.$message({
                    type: "success",
                    message: "添加成功!",
                });
            }
            this.TaskTrainTask.TaskExaminationPaper = this.PaperList.map(item => {
                return {
                    ExaminationPaperId: item.ExaminationPaperId,
                    ExamCount: item.ExamCount,
                    ExaminationPaper: item
                }
            })
            this.addShow4 = false;
        },
        openFile(file) {
            let url = file.Url;
            if (url.indexOf('http') != -1) {
                window.open(url);
            } else {
                this.Get("/GetOssUrl?key="+url).then((result) => {
                    window.open(result.data.url);
                });
            }
        },
        handleDateRange() {
            let [startDate, endDate] = this.TaskTrainTask.TrainDateRange;
            this.TaskTrainTask.TrainStartDate = startDate;
            this.TaskTrainTask.TrainEndDate = endDate
        },
        handleTrainTypeChange(val, name) {
            this.TaskTrainTask.TrainTypeName = name;
        },
        calcDuration(row) {
            let duration = 0;
            row.AttachmentFiles.forEach(file => {
                duration += file.Lengths
            });
            return util.durationFormat(duration);
        },
        changeExamCount(item, index) {
            this.TaskTrainTask.TaskExaminationPaper[index].ExamCount = item.ExamCount;
        },
    },
}
</script>

<style lang="scss" scoped>
    .custom-divider{
        margin: 30px -30px;
        background: #F2F2F2;
        height: 10px;
    }
    .file-list{
        .item{
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            color: $primary-color;
            cursor: pointer;
            .file-icon{
                display: inline-block;
                margin-right: 12px;
                width: 23px;
                height: 27px;
                background: no-repeat center center;
                background-size: contain;
            }
        }
    }
</style>
