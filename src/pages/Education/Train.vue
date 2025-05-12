<template>
    <page-layout
        :loading="loading"
        :pages="pages"
        @current-change="handleCurrentChange"
    >
        <!--工具条开始-->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select
                    v-model="filters.TrainTypeCode"
                    clearable
                    placeholder="培训类型"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
                <el-input
                    v-model="filters.TrainPlanName"
                    placeholder="计划名称"
                    @keyup.enter.native="handleSearch"
                ></el-input>
                <el-input
                    v-model="filters.TrainLecturer"
                    placeholder="培训讲师"
                    @keyup.enter.native="handleSearch"
                ></el-input>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-plus" @click="addshow()"
                    >新增</el-button
                >
            </div>
        </div>
        <!--工具条结束-->

        <!--列表开始-->
        <el-table
            :data="list"
            highlight-current-row
            :header-cell-style="$tableStyle"
            style="width: 100%"
        >
            <el-table-column
                label="序号"
                type="index"
                align="center"
                header-align="center"
                width="60"
            >
            </el-table-column>
            <el-table-column label="计划名称" prop="TrainPlanName">
            </el-table-column>
            <el-table-column
                label="培训类型"
                align="center"
                header-align="center"
                prop="TrainTypeName"
            >
            </el-table-column>
            <el-table-column
                label="培训对象"
                align="center"
                header-align="center"
                prop="TrainObject"
                width="80"
            >
            </el-table-column>
            <el-table-column
                label="培训讲师"
                align="center"
                header-align="center"
                prop="TrainLecturer"
                width="80"
            >
            </el-table-column>
            <el-table-column
                label="计划学时"
                align="center"
                header-align="center"
                prop="ClassHours"
                width="80"
            >
            </el-table-column>
            <el-table-column
                label="考核方式"
                align="center"
                header-align="center"
                prop="AssessmentMethodName"
                width="80"
            >
            </el-table-column>
            <el-table-column
                label="考核评估要求"
                align="center"
                header-align="center"
                prop="Assessment"
                width="120"
            >
            </el-table-column>
            <el-table-column
                label="培训时间"
                align="center"
                header-align="center"
            >
                <template slot-scope="scope">
                    <div
                        v-if="
                            scope.row.TrainDateRange &&
                            scope.row.TrainDateRange.length
                        "
                    >
                        <div>开始时间：{{ scope.row.TrainDateRange[0] }}</div>
                        <div>结束时间：{{ scope.row.TrainDateRange[1] }}</div>
                    </div>
                    <div v-else>无</div>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="300"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button type="text" @click="editTrain(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            @click="seeTrain(scope.row.TrainPlanId)"
                            >关联培训</el-button
                        >
                        <el-button
                            type="text"
                            text-plain
                            @click="delTrain(scope.row.TrainPlanId)"
                            >删除</el-button
                        >
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--列表结束-->

        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            :title="dialogTitle"
            :visible.sync="addShow"
            :close-on-click-modal="false"
            @close="dialogClear"
            width="900px"
        >
            <el-form
                :model="parms"
                :rules="rules"
                ref="ruleForm"
            >
                <div class="form-col">
                    <el-form-item label="计划名称" prop="TrainPlanName">
                        <el-input
                            maxlength="200"
                            show-word-limit
                            v-model="parms.TrainPlanName"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="培训类型" prop="TrainTypeCode">
                        <el-select
                            class="el-input"
                            v-model="parms.TrainTypeCode"
                            clearable
                            placeholder="类型"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="el-input">
                    <el-form-item label="培训对象" prop="TrainObject">
                        <el-input
                            maxlength="200"
                            show-word-limit
                            v-model="parms.TrainObject"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="培训讲师" prop="TrainLecturer">
                        <el-input
                            maxlength="50"
                            show-word-limit
                            v-model="parms.TrainLecturer"
                        ></el-input>
                    </el-form-item>
                </div>
                <el-form-item
                    label="培训时间"
                    :prop="
                        ISTrainDateRange == true ? 'TrainDateRange' : ''
                    "
                >
                    <div class="el-input f--c">
                        <el-switch
                            class="gutter"
                            v-model="parms.IsTrainTime"
                            active-text="开启"
                            inactive-text="关闭"
                            :active-value="1"
                            :inactive-value="0"
                            @change="changeTime()"
                        >
                        </el-switch>
                        <el-date-picker
                            v-model="parms.TrainDateRange"
                            type="daterange"
                            :disabled="!ISTrainDateRange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <div class="form-col">
                        <el-form-item label="计划学时" prop="ClassHours">
                            <el-input-number
                                class="el-input"
                                :min="1"
                                :max="1000"
                                v-model="parms.ClassHours"
                                style="width: 100%"
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item
                            label="考核方式"
                            prop="AssessmentMethodCode"
                        >
                            <el-select
                                class="el-input"
                                v-model="parms.AssessmentMethodCode"
                                clearable
                                placeholder="类型"
                            >
                                <el-option
                                    v-for="item in options1"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                </div>
                <div class="form-col">
                    <el-form-item label="考核达标要求" prop="Assessment">
                        <el-input
                            maxlength="500"
                            show-word-limit
                            v-model="parms.Assessment"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="保障经费(元)">
                        <el-input-number
                            class="el-input"
                            :min="0"
                            :max="1000000"
                            v-model="parms.SecurityFunds"
                            style="width: 100%"
                        ></el-input-number>
                    </el-form-item>
            </div>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addShow = false">关闭</el-button>
                <el-button
                    @click="submit('ruleForm')"
                    type="primary"
                    :loading="btn"
                    >确定</el-button
                >
            </span>
        </el-dialog>
        <!--弹层结束-->

        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            title="添加课件"
            :visible.sync="addShow1"
            :close-on-click-modal="false"
            width="50%"
        >
            <el-table
                :data="CourList"
                border
                :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{ textAlign: 'center' }"
                style="width: 100%"
            >
                <el-table-column label="序号" type="index" width="50">
                </el-table-column>
                <el-table-column prop="CoursewareNo" label="编号">
                </el-table-column>
                <el-table-column label="课件名称" prop="CoursewareName">
                </el-table-column>
                <el-table-column label="教师名称" prop="TeacherName">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="SelectionChange(scope.row)"
                            >选择</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            title="关联培训"
            :visible.sync="addShow2"
            :close-on-click-modal="false"
            width="70%"
        >
            <el-table
                :data="TrainList"
                border
                :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{ textAlign: 'center' }"
                style="width: 100%; height: 600px"
            >
                <el-table-column label="序号" type="index" width="50">
                </el-table-column>
                <el-table-column label="培训名称" prop="TrainTaskName">
                </el-table-column>
                <el-table-column label="课程名称" prop="CurriculumName">
                </el-table-column>
                <el-table-column label="培训时间" width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.IsTrainTime">
                            <div>{{ scope.row.TrainDateRange[0] }}</div>
                            <div>{{ scope.row.TrainDateRange[1] }}</div>
                        </div>
                        <div v-else>无</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="计划培训人数"
                    width="120"
                    prop="PlanUserCount"
                >
                </el-table-column>
                <el-table-column
                    label="完成培训人数"
                    prop="PlanUserCompleteCount"
                    width="120"
                >
                </el-table-column>
            </el-table>
            <!--分页开始-->
            <el-col :span="24" style="text-align: center">
                <el-pagination
                    layout="total, prev, pager, next"
                    background
                    @current-change="handleCurrentChange1"
                    :page-size="rows1"
                    :total="total1"
                    class="customPagination"
                >
                </el-pagination>
            </el-col>
            <!--分页结束-->
        </el-dialog>
    </page-layout>
</template>



<script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import RULECONFIG from "@/common/ruleConfig";
export default {
    mixins: [request_mixin, upload_mixin],
    data() {
        return {
            editorOption: {
                //富文本配置
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline", "strike"], // 字体
                        ["image", { align: [] }], // 图片与文本居中
                    ],
                },
            },
            options: [], //培训类型
            options1: [], //考核方式
            //搜索时的过滤条件
            filters: {},
            btn: false,
            TrainPlanId: "",
            //数据列表
            list: [],
            CourList: [],
            checkCourList: [],
            TrainList: [],
            //分页相关数据
            pages: {
                total: 0,
                page: 1,
                rows: 10,
            },

            total1: 0,
            page1: 1,
            rows1: 10,
            //弹层数据
            addShow: false,
            addShow1: false,
            addShow2: false,
            dialogTitle: "新增",
            //列表页面是否加载变量
            loading: false,
            ISTrainDateRange: true,
            parms: {
                TrainPlanName: "", // string 计划名称  必填 200
                TrainTypeCode: "", // string 培训类型 必选
                TrainObject: "", // string 培训对象 必填 200
                TrainLecturer: "", // string 培训讲师 必填 50
                IsTrainTime: 1, // int 是否开启培训时间 必填 [0,1]
                TrainDateRange: [], // datetime 培训时间 开启培训时必填
                ClassHours: "", // int  计划学时 必填[1-1000]
                AssessmentMethodCode: "", // string 考核方式 必选
                Assessment: "", // string 考核达标要求 必填 500
                SecurityFunds: "", // double 保障经费 选填 [0-1000000]
            },
            rules: {
                TrainPlanName: RULECONFIG.Text("计划名称"),
                TrainTypeCode: RULECONFIG.Text("培训类型"),
                TrainObject: RULECONFIG.Text("培训对象"),
                TrainLecturer: RULECONFIG.Text("培训讲师"),
                TrainDateRange: RULECONFIG.Text("培训时间"),
                ClassHours: RULECONFIG.Text("计划学时"),
                AssessmentMethodCode: RULECONFIG.Text("考核方式"),
                Assessment: RULECONFIG.Text("考核达标要求"),
            },
        };
    },
    methods: {
        seeTrain(id) {
            //关联培训
            this.addShow2 = true;
            this.TrainPlanId = id;
            this.getTrainList(id);
        },
        getTrainList(id) {
            this.Post("/GetTrainTasksByTrainPlanId", {
                page: this.page1,
                rows: this.rows1,
                TrainPlanId: id,
            }).then((res) => {
                if (res.status == 2000) {
                    this.TrainList = res.data.list;
                    this.total1 = res.data.count;
                }
            });
        },
        handleCurrentChange1(val) {
            this.page1 = val;
            this.getTrainList(this.TrainPlanId);
        },
        addshow() {
            this.parms = {
                TrainPlanName: "", // string 计划名称  必填 200
                TrainTypeCode: "", // string 培训类型 必选
                TrainObject: "", // string 培训对象 必填 200
                TrainLecturer: "", // string 培训讲师 必填 50
                IsTrainTime: 1, // int 是否开启培训时间 必填 [0,1]
                TrainDateRange: [], // datetime 培训时间 开启培训时必填
                ClassHours: "", // int  计划学时 必填[1-1000]
                AssessmentMethodCode: "", // string 考核方式 必选
                Assessment: "", // string 考核达标要求 必填 500
                SecurityFunds: "", // double 保障经费 选填 [0-1000000]
            };

            this.addShow = true;

            this.dialogTitle = "新增";
        },

        delTrain(id) {
            this.$confirm("此操作将永久删除该课件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.Get("/DeleteTrainPlan", {
                    TrainPlanId: id,
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
                    this.btn = true;
                    this.Post("/SaveTrainPlan", this.parms).then((res) => {
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
            let params = Object.assign(
                {
                    page: that.pages.page,
                    rows: that.pages.rows,
                },
                that.filters
            );

            that.loading = true;
            this.Post("/GetTrainPlans", params).then((res) => {
                if (res.status == 2000) {
                    res.data.list.forEach((val) => {
                        if (val.TrainDateRange) {
                            val.TrainDateRange = val.TrainDateRange.map(
                                (key) => {
                                    return (key = key.slice(0, 10));
                                }
                            );
                        }
                    });
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
                that.loading = false;
            });
        },
        changeTime() {
            if (this.parms.IsTrainTime) {
                this.ISTrainDateRange = true;
            } else {
                this.ISTrainDateRange = false;
                this.$refs.ruleForm.clearValidate("TrainDateRange");
            }
        },
        //弹层的取消
        dialogClear() {
            let than = this;
            than.addShow = false;
            this.$refs.ruleForm.clearValidate();
        },
        //检查执行
        editTrain(row) {
            this.dialogTitle = "编辑";
            this.addShow = true;
            this.parms = JSON.parse(JSON.stringify(row));
        },
    },
    mounted() {
        this.handleSearch();
        this.upload.arrFiles = [[], [], [], [], []];
        this.Get("/GetTrainingTypeCodeCom").then((res) => {
            if (res.status == 2000) {
                this.options = res.data;
            }
        });

        this.Get("/GetTrainAssessmentMethodCom").then((res) => {
            if (res.status == 2000) {
                this.options1 = res.data;
            }
        });
    },
};
</script>

<style scoped>
.el-select{
    width: 100%;
}
.gutter{
    margin-right: 20px;
}
/deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
    height: 600px;
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
</style>
