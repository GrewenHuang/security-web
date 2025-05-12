<template>
    <div class="super-train-info">
        <div class="content">
            <el-form ref="form" :model="info">
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label="任务名称">
                        <el-input
                            maxlength="200"
                            v-model="info.TrainTaskName"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item class="w50" label="培训类型">
                        <el-input
                            maxlength="200"
                            v-model="info.TrainTypeName"
                            disabled
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label="培训课时">
                        <el-input
                            v-model="info.TrainHours"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item class="w50" label="培训周期">
                        <div class="el-input" v-if="info.IsTrainTime == 0">
                            不限
                        </div>
                        <div class="el-input" v-else>
                            {{ info.TrainStartDateDesc }} 至
                            {{ info.TrainEndDateDesc }}
                        </div>
                    </el-form-item>
                </div>
            </el-form>
            <el-collapse v-model="collapseActive">
                <el-collapse-item name="course" v-if="info.Curriculum">
                    <div slot="title" class="f-b-c f1">
                        <div class="title">
                            <span>培训课程</span>
                        </div>
                        <div
                            class="operation"
                            :class="{
                                open: collapseActive.includes('course'),
                            }"
                        >
                            {{
                                collapseActive.includes('course')
                                    ? '收起'
                                    : '展开'
                            }}
                        </div>
                    </div>
                    <div class="f-b-c" style="margin-bottom: 20px;">
                        <div class="f1">
                            <span>课程名称：</span
                            ><span>{{
                                info.Curriculum.CurriculumName || '无'
                            }}</span>
                        </div>
                        <div class="f1">
                            <span>课程编号：</span
                            ><span>{{
                                info.Curriculum.CurriculumNo || '无'
                            }}</span>
                        </div>
                    </div>
                    <div class="f" style="margin-bottom: 20px;">
                        <div>课程详情：</div>
                        <div v-html="info.Curriculum.Remark || '无'"></div>
                    </div>
                    <el-table
                        
                        :data="info.Curriculum.Coursewares"
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
                            label="编号"
                            align="center"
                            width="150"
                            prop="CoursewareNo"
                        >
                        </el-table-column>
                        <el-table-column
                            label="课件名称"
                            align="center"
                            prop="CoursewareName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="教师名称"
                            width="100"
                            align="center"
                            prop="TeacherName"
                        >
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
                        <el-table-column label="课件附件">
                            <template slot-scope="scope">
                                <div
                                    v-for="(item, index) in scope.row
                                        .AttachmentFiles"
                                    :key="index"
                                >
                                    <el-button
                                        type="text"
                                        @click="$openFile(item.Url)"
                                        >{{ item.Name }}</el-button
                                    >
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item name="exam" v-if="info.TaskExaminationPaper && info.TaskExaminationPaper.length">
                    <div slot="title" class="f-b-c f1">
                        <div class="title">
                            <span>培训考试</span>
                        </div>
                        <div
                            class="operation"
                            :class="{
                                open: collapseActive.includes('exam'),
                            }"
                        >
                            {{
                                collapseActive.includes('exam')
                                    ? '收起'
                                    : '展开'
                            }}
                        </div>
                    </div>
                    <el-table
                        :data="info.TaskExaminationPaper"
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
                            width="160"
                            prop="ExaminationPaper.ExaminationPaperNumber"
                        >
                        </el-table-column>
                        <el-table-column
                            label="试卷名称"
                            align="center"
                            prop="ExaminationPaper.ExaminationPaperName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="考试时长(分)"
                            align="center"
                            width="110"
                        >
                            <template slot-scope="scope">
                                <div>
                                    {{
                                        scope.row.ExaminationPaper
                                            .TestTime || '不限'
                                    }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="试题数"
                            align="center"
                            width="110"
                            prop="ExaminationPaper.QuestionNumber"
                        >
                        </el-table-column>
                        <el-table-column
                            label="总分"
                            align="center"
                            width="110"
                            prop="ExaminationPaper.TotalScore"
                        >
                        </el-table-column>
                        <el-table-column
                            label="合格分数"
                            align="center"
                            width="110"
                            prop="ExaminationPaper.PassScore"
                        >
                        </el-table-column>
                        <el-table-column
                            label="考试次数"
                            align="center"
                            width="110"
                            prop="ExamCount"
                        >
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    @click="
                                        previewPaper(
                                            scope.row.ExaminationPaperId
                                        )
                                    "
                                    >查看</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                
                <el-collapse-item name="remark" v-if="$slots.default">
                    <div slot="title" class="f-b-c f1">
                        <div class="title">
                            <span>意见</span>
                        </div>
                        <div
                            class="operation"
                            :class="{
                                open: collapseActive.includes('remark'),
                            }"
                        >
                            {{
                                collapseActive.includes('remark')
                                    ? '收起'
                                    : '展开'
                            }}
                        </div>
                    </div>
                    <div>
                        <slot></slot>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="personnel" ref="personnel" v-if="executeType == 1 && info.TrainTypeCode != '0004502'">
                    <div slot="title" class="f-b-c f1">
                        <div class="title">
                            <span>培训人员</span>
                        </div>
                        <div
                            class="operation"
                            :class="{
                                open: collapseActive.includes('personnel'),
                            }"
                        >
                            {{
                                collapseActive.includes('personnel')
                                    ? '收起'
                                    : '展开'
                            }}
                        </div>
                    </div>
                    <div>
                        <el-table
                            border
                            :data="Personnellist"
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
                            <!-- <el-table-column
                                label="部门"
                                align="center"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    {{ scope.row.DepartmentList.map(item => item.DepartmentName).join('、') }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="岗位"
                                align="center"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    {{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
                                </template>
                            </el-table-column> -->
                            <el-table-column
                                label="姓名"
                                align="center"
                                prop="UserName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="手机号"
                                align="center"
                                prop="Tel"
                            >
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="100"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        text-plain
                                        @click="
                                            deleValuePersonnellist(
                                                scope.$index
                                            )
                                        "
                                        >删除</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button
                            type="primary"
                            style="width: 100%"
                            @click="chooseUser"
                            >选择人员</el-button
                        >
                    </div>
                </el-collapse-item>
                <el-collapse-item name="position" ref="position" v-else-if="executeType == 1">
                    <div slot="title" class="f-b-c f1">
                        <div class="title">
                            <span>培训岗位</span>
                        </div>
                        <div
                            class="operation"
                            :class="{
                                open: collapseActive.includes('position'),
                            }"
                        >
                            {{
                                collapseActive.includes('position')
                                    ? '收起'
                                    : '展开'
                            }}
                        </div>
                    </div>
                    <div>
                        <el-table
                            :data="positionList"
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
                                label="岗位名称"
                                align="center"
                                prop="Name"
                            ></el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="100"
                            >
                                <template
                                    slot-scope="{ $index }"
                                >
                                    <el-button
                                        type="text"
                                        text-plain
                                        @click="delPosition($index)"
                                        >删除</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button
                            type="primary"
                            style="width: 100%"
                            @click="choosePosition"
                            >选择岗位</el-button
                        >
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <!-- 试卷详情 -->
        <el-dialog v-dialog-drag 
            :title="paperTilte"
            :visible.sync="addShowPaper"
            :close-on-click-modal="false"
            :append-to-body="true"
            center
            class="paperTilte"
            width="70%"
        >
            <el-scrollbar class="scrollbar">
                <div
                    class="paperBox"
                    v-for="(item, index) in paperList"
                    :key="index"
                >
                    <div v-if="item.ExaminationPaperQuestions.length">
                        <div>
                            {{ item.TypeName }}(共{{
                                item.ExaminationPaperQuestions.length
                            }}题，总共{{ item.TotalScore }}分)
                        </div>
                        <div
                            style="color: #000; padding-left: 20px"
                            v-for="(items, i) in item.ExaminationPaperQuestions"
                            :key="i"
                        >
                            <div
                                style="
                                    font-size: 15px;
                                    font-weight: 600;
                                    height: auto;
                                    display: flex;
                                    margin: 20px 0 5px 0;
                                    align-items: center;
                                "
                            >
                                <span style="width: 30px">{{ i + 1 }}.</span>
                                <p
                                    v-html="items.Content"
                                    style="width: 97%"
                                ></p>
                            </div>
                            <div
                                style="
                                    height: 30px;
                                    line-height: 30px;
                                    display: flex;
                                "
                                v-for="(
                                    itemss, j
                                ) in items.ExaminationPaperAnswers"
                                :key="j"
                            >
                                {{
                                    String.fromCharCode('A'.charCodeAt(0) + j)
                                }}.
                                <p v-html="itemss.Answer"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import util from '@/common/util';
const defaultInfo = {
    TrainTaskName: '',
    TrainTypeName: '',
    TrainHours: '',
    IsTrainTime: '',
    TrainStartDateDesc: '',
    TrainEndDateDesc: '',
    Curriculum: {},
    TaskExaminationPaper: [],
    Users: [], // 人员
    Positions: [],
};
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'super-train-info',
    components: {
    },
    mixins: [request_mixin],
    props: {
        loading: false,
        submitLoading: false,
        item: {
            type: Object,
            required: true
        },
        executeType: {
            type: [Number, String]
        }
    },
    data() {
        return {
            id: '',
            info: _extends(defaultInfo),
            rules: {},
            collapseActive: ['course', 'exam', 'personnel', 'remark', 'position'],
            Personnellist: [],
            positionList: [],
            addShowPaper: false,
            paperList: [],
            paperTilte: '',
        };
    },
    computed: {
        isEdit() {
            return !!this.id;
        },
        title() {
            return '执行（培训任务）';
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            if (this.item) {
                this.$emit('update:loading', true);
                this.id = this.item.TaskAssignmentId;
                try {
                    let res = await this.Get(`/GetTaskTrainTask?relationId=${this.item.RelationId}&taskAssignmentId=${this.item.TaskAssignmentId}`);
                    if (res.status == 2000) {
                        this.info = _extends(Object.assign(defaultInfo, res.data, {Users: [], Positions: []}));
                        this.$emit('remark', res.data.RemarkObjects);
                    } else {
                        this.$message.error(res.message);
                        this.$emit('close')
                    }
                } catch (error) {
                    console.error(error)
                }
                this.$emit('update:loading', false);
            }
        },
        save(fn) {
            this.$refs.form.validate( async valid => {
                if (valid) {
                    if (this.executeType == 1) {
                        if (this.info.TrainTypeCode == '0004502') {
                            if (!this.info.Positions.length && this.executeType == 1){
                                this.$message.error('请选择岗位');
                                this.$refs.position.$el.scrollIntoView({behavior: 'smooth'});
                                return
                            }
                        } else {
                            if (!this.info.Users.length) {
                                this.$message.error('请选择培训人员');
                                this.$refs.personnel.$el.scrollIntoView({behavior: 'smooth'});
                                return
                            }
                        }
                    }
                    let params = {
                        TaskAssignmentId: this.id,
                    }
                    if (typeof fn === 'function' && this.executeType == 2) {
                        let otherParam = fn();
                        if (!otherParam) {
                            return 
                        } else {
                            Object.assign(params, otherParam);
                        }
                    } else {
                        Object.assign(params, {
                            Users: this.info.Users,
                            Positions: this.info.Positions
                        })
                    }
                    this.$emit('update:submitLoading', true);
                    try {
                        let res = {};
                        if (this.executeType == 2) {
                            res = await this.Post('/SaveTaskRelay', params);
                        } else {
                            res = await this.Post('/SaveEnterpriseTrainTask', params);
                        }
                        if (res.status === 2000) {
                            this.$message.success('操作成功');
                            this.$emit('load');
                            this.$emit('close')
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        console.error(error)
                    }
                    this.$emit('update:submitLoading', false)
                }
            });
        },
        previewPaper(id) {
            //查看
            this.addShowPaper = true;
            this.Post('/GetExaminationPaper?Id=' + id).then((res) => {
                if (res.status == 2000) {
                    this.paperTilte = res.data.ExaminationPaperName;
                    this.paperList = res.data.ExaminationPaperRules;
                }
            });
        },
        chooseUser() {
            this.$chooseUser({
                choosed: this.Personnellist
            }).then(data => {
                this.Personnellist = data;
                this.info.Users = data.map(item => {
                    return {
                        UserId: item.UserId
                    }
                });
            })
        },
        deleValuePersonnellist(index) {
            this.Personnellist.splice(index, 1);
            this.info.Users.splice(index, 1);
        },
        delPosition(index) {
            this.positionList.splice(index, 1);
            this.info.Positions.splice(index, 1);
        },
        choosePosition() {
            this.$choosePosition({
                choosed: this.positionList
            }).then(res => {
                this.positionList = res;
                this.info.Positions = res.map(item => {
                    return {
                        PositionId: item.PositionId
                    }
                })
            })
        },
        calcDuration(row) {
            let duration = 0;
            row.AttachmentFiles.forEach(file => {
                duration += file.Lengths
            });
            return util.durationFormat(duration);
        },
    },
};
</script>

<style lang="scss" scoped>
.super-train-info {
    .content {
        padding: 25px 25px 20px;
    }
    /deep/ .el-form {
        .el-select {
            width: 100%;
        }
    }
    /deep/ .el-form-item {
        margin-bottom: 34px;
        &:first-child {
            margin-right: 20px;
        }
        .el-form-item__label {
            padding-bottom: 9px;
            line-height: 20px;
        }
        .el-select {
            width: 100%;
        }
    }
    .w50 {
        width: 50%;
    }
    .mr20 {
        margin-right: 20px;
    }
    /deep/ .el-collapse {
        border: none;
        .el-collapse-item {
            &.is-disabled {
                .el-collapse-item__header {
                    cursor: inherit;
                    color: inherit;
                }
            }
            &:not(:last-child) {
                padding-bottom: 15px;
            }
            .el-collapse-item__header {
                border: none;
                border-radius: 4px;
                padding: 15px;
                background: #f8f8f8;
                line-height: inherit;
                .title {
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    line-height: 22px;
                    color: $base-color;
                    &::before {
                        content: '';
                        border-radius: 2px;
                        margin-right: 8px;
                        width: 5px;
                        height: 16px;
                        background: $primary-color;
                    }
                }
                .operation {
                    display: flex;
                    align-items: center;
                    color: $primary-color;
                    &::before {
                        content: '';
                        border: 8.25px solid $primary-color;
                        border-bottom: 0;
                        border-right: 6px solid transparent;
                        border-left: 6px solid transparent;
                        margin-right: 6px;
                        width: 0;
                        height: 0;
                        transform-origin: center;
                        transform: rotateX(0);
                        transition: all 0.2s linear;
                    }
                    &.open {
                        &::before {
                            transform: rotateX(180deg);
                        }
                    }
                }
            }
            .el-collapse-item__arrow {
                display: none;
            }
            .el-collapse-item__wrap {
                border: none;
            }
            .el-collapse-item__content {
                padding: 15px;
                .abnormal-content {
                    > div {
                        &:not(:last-child) {
                            margin-bottom: 5px;
                        }
                    }
                }
                .in-train {
                    &:not(:last-child) {
                        position: relative;
                        &::after {
                            content: '';
                            position: absolute;
                            right: -15px;
                            bottom: 0;
                            left: -15px;
                            border-bottom: 1px dashed #ddd;
                        }
                    }
                }
                .table-title {
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    font-size: 17px;
                    background: #f5f5f5;
                    color: #888;
                }
            }
        }
    }
}
</style>
