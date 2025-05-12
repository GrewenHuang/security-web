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
                    placeholder="请选择题型"
                    v-model="filters.TypeCode"
                    clearable
                    @change="selectTypeCode()"
                >
                    <el-option
                        v-for="(item, index) in TypeCom"
                        :key="index"
                        :label="item.text"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <!-- <el-select
                    placeholder="请选择试题类型"
                    v-model="filters.ExamQuestionTypeId"
                    clearable
                >
                    <el-option
                        v-for="(item, index) in questionsTypeList"
                        :key="index"
                        :label="item.Name"
                        :value="item.ExamQuestionTypeId"
                    ></el-option>
                </el-select> -->
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </div>
            <div class="f-c-c">
                <el-button-group style="margin-right: 20px">
                    <el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=8')"
                        >导入模板下载</el-button
                    >

                    <el-button>
                        <el-upload
                            action="#"
                            :show-file-list="false"
                            :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportExamQuestion', {IsPrivate: 1});
                                }
                            "
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                            >导入
                        </el-upload>
                    </el-button>
                    <el-button @click="downloadmbs(60, 601, filters)"
                        >导出</el-button
                    >
                    <!-- <el-button @click="showQuestionsType()">试题类型</el-button> -->
                </el-button-group>

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
        >
            <el-table-column
                label="序号"
                align="center"
                header-align="center"
                type="index"
                width="60"
            >
            </el-table-column>
            <el-table-column
                label="题型"
                align="center"
                header-align="center"
                width="80"
                prop="TypeName"
            >
            </el-table-column>
            <el-table-column
                width="145"
                align="center"
                header-align="center"
                label="试题编号"
                prop="SerialNumber"
            >
            </el-table-column>
            <!-- <el-table-column
                width="145"
                align="center"
                header-align="center"
                label="试题类型"
                prop="ExamQuestionTypeName"
            >
            </el-table-column> -->
            <el-table-column label="试题题干">
                <template slot-scope="scope">
                    <div v-html="scope.row.Content"></div>
                </template>
            </el-table-column>
            <el-table-column
                label="创建日期"
                align="center"
                header-align="center"
                width="100"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="200"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button type="text" @click="eidt(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            text-plain
                            @click="delQ(scope.row.ExamQuestionId)"
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
            top="8vh"
            width="50%"
        >
            <el-scrollbar class="scrollbar">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>试题信息</span>
                    </div>
                    <div>
                        <el-form
                            :model="parms"
                            :rules="rules"
                            ref="ruleForm"
                        >
                            <div class="form-col">
                                <el-form-item label="题型" prop="TypeCode">
                                    <el-select
                                        class="el-input"
                                        placeholder="请选择题型"
                                        v-model="parms.TypeCode"
                                        clearable
                                        @change="selectTypeCode()"
                                    >
                                        <el-option
                                            v-for="(item, index) in TypeCom"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="试题编号"
                                    prop="SerialNumber"
                                >
                                    <el-input
                                        type="text"
                                        v-model="parms.SerialNumber"
                                        placeholder="请输入试题编号"
                                    ></el-input>
                                </el-form-item>
                            </div>
                            <!-- <el-row>
                                <el-col :span="12">
                                    <el-form-item
                                        label="试题类型"
                                        prop="ExamQuestionTypeId"
                                    >
                                        <el-select
                                            placeholder="请选择题型"
                                            v-model="parms.ExamQuestionTypeId"
                                            clearable
                                        >
                                            <el-option
                                                v-for="(
                                                    item, index
                                                ) in questionsTypeList"
                                                :key="index"
                                                :label="item.Name"
                                                :value="item.ExamQuestionTypeId"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row> -->
                            <el-form-item
                                label="题干内容"
                                prop="Content"
                            >
                                <customEditor
                                    class="el-input"
                                    placeholder="请在这里输入"
                                    v-model="parms.Content"
                                />
                            </el-form-item>
                            <el-form-item label="试题分析" prop="name">
                                <customEditor
                                    class="el-input"
                                    placeholder="请在这里输入"
                                    v-model="parms.Explain"
                                />
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>

                <el-card style="margin-top: 10px">
                    <div slot="header" class="clearfix">
                        <span>候选项</span>
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-plus"
                            style="float: right"
                            @click="adds()"
                            >添加选项</el-button
                        >
                    </div>
                    <div>
                        <el-table
                            :data="parms.ExamAnswers"
                            :header-cell-style="{ textAlign: 'center' }"
                            style="width: 100%"
                        >
                            <!--<el-table-column label="选项"
                                 align="center"
                                 width="50">
                  <template slot-scope="scope">
                    {{String.fromCharCode('A'.charCodeAt(0) + scope.$index)}}
                  </template>
                </el-table-column>-->
                            <el-table-column label="选项内容" width="680">
                                <template slot-scope="scope">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.Answer"
                                    ></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="正确选项" align="center">
                                <template slot-scope="scope">
                                    <el-checkbox
                                        v-model="scope.row.IsCorrect"
                                    ></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        text-plain
                                        @click="del(scope.$index)"
                                        >删除</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-scrollbar>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addShow = false">关闭</el-button>
                <el-button
                    @click="submit('ruleForm')"
                    type="primary"
                    :loading="btnloading"
                    >确定</el-button
                >
            </span>
        </el-dialog>
        <!--弹层结束-->
        <questions-type ref="questionsType"></questions-type>
    </page-layout>
</template>



<script>
import request_mixin from "@/mixins/request-mixin.js";
import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";
import RULECONFIG from "@/common/ruleConfig";
import QuestionsType from "./QuestionsType.vue";
import customEditor from '@/components/common/custom-editor.vue';
const IsPrivate = 0;

export default {
    name: "list",
    components: {
        QuestionsType,
        customEditor
    },
    mixins: [request_mixin, Download, Import_export],
    data() {
        return {
            parms: {
                TypeCode: "", //题目类型
                Content: "", //题干内容
                Explain: "", //题目解析
                SerialNumber: "", //编号
                ExamAnswers: [], //合集
                ExamQuestionTypeId: "",
            },
            TypeCom: [], //题型下拉数据
            //搜索时的过滤条件
            filters: {
                IsPrivate,
                TypeCode: "",
                ExamQuestionTypeId: "", // 试题类型
            },
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
            btnloading: false,
            rules: {
                TypeCode: RULECONFIG.Select("题目类型"),
                Content: RULECONFIG.Text("题干内容"),
                SerialNumber: RULECONFIG.Text("编号"),
            },
            questionsTypeList: [],
        };
    },
    methods: {
        adds() {
            this.parms.ExamAnswers.push({
                Answer: "",
                IsCorrect: false,
            });
            this.index++;
        },
        del(index) {
            this.parms.ExamAnswers.splice(index, 1);
        },
        selectTypeCode() {
            //选择题型做判断  1 单选题 2 多选题 3 判断题
            if (this.parms.TypeCode == 1) {
                this.parms.ExamAnswers = [
                    { Answer: "", IsCorrect: true },
                    { Answer: "", IsCorrect: false },
                    { Answer: "", IsCorrect: false },
                    { Answer: "", IsCorrect: false },
                ];
            } else if (this.parms.TypeCode == 2) {
                this.parms.ExamAnswers = [
                    { Answer: "", IsCorrect: true },
                    { Answer: "", IsCorrect: false },
                    { Answer: "", IsCorrect: false },
                    { Answer: "", IsCorrect: false },
                ];
            } else {
                this.parms.ExamAnswers = [
                    { Answer: "", IsCorrect: true },
                    { Answer: "", IsCorrect: false },
                ];
            }
        },

        addshow() {
            this.addShow = true;
            this.dialogTitle = "新增";
            (this.parms = {
                TypeCode: "", //题目类型
                Content: "", //题干内容
                Explain: "", //题目解析
                SerialNumber: "", //编号
                ExamAnswers: [], //合集
                ExamQuestionTypeId: "",
            }),
                this.Get("/GetQuestionTypeCom").then((res) => {
                    if (res.status == 2000) {
                        this.TypeCom = res.data;
                    }
                });
            this.Get("/GetExamSerialNumber").then((res) => {
                if (res.status == 2000) {
                    this.parms.SerialNumber = res.data;
                }
            });
        },
        delQ(id) {
            this.$confirm("此操作将永久删除该试题, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.Post(`DeleteExamQuestion?ExamQuestionId=${id}&IsPrivate=${IsPrivate}`).then(
                        (res) => {
                            if (res.status == 2000) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!",
                                });
                                this.GetList();
                            } else {
                                this.$message.error(res.message);
                            }
                        }
                    );
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        submit(formName) {
            let emptyAnswers = this.parms.ExamAnswers.filter(item => !item.Answer);
            if (emptyAnswers.length) {
                this.$message.error('请填写候选项选项内容');
                return ;
            }
            
            if (this.parms.TypeCode == 1 || this.parms.TypeCode == 3) {
                let arr = this.parms.ExamAnswers.filter((k) => {
                    return k.IsCorrect == true;
                });
                if (arr.length > 1) {
                    this.$message.error("判断题及单选题只能出现一个正确答案！");
                    return false;
                }
            }

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btnloading = true;
                    this.Post("/SaveExamQuestion", {...this.parms, IsPrivate}).then((res) => {
                        if (res.status == 2000) {
                            this.$message({
                                message: "保存成功",
                                type: "success",
                            });
                            this.GetList();
                            this.addShow = false;
                        } else {
                            this.$message.error(res.message);
                        }
                        this.btnloading = false;
                    });
                }
            });
        },
        //分页事件
        handleCurrentChange(val) {
            this.pages.page = val;
            this.GetList();
        },
        //搜索事件
        handleSearch() {
            this.pages.page = 1;
            this.GetList();
        },
        //获取列表数据
        GetList() {
            let that = this;
            let params = Object.assign(
                {
                    page: that.pages.page,
                    rows: that.pages.rows,
                    IsPrivate
                },
                that.filters
            );
            this.loading = true;
            this.Post("/GetExamQuestions", params)
                .then((res) => {
                    this.loading = false;
                    if (res.status == 2000) {
                        this.list = res.data.list;
                        this.pages.total = res.data.count;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        //弹层的取消
        dialogClear() {
            let than = this;
            than.addShow = false;
        },
        //检查执行
        eidt(row) {
            this.Get("/GetQuestionTypeCom").then((res) => {
                if (res.status == 2000) {
                    this.TypeCom = res.data;
                }
            });
            row.ExamAnswers.forEach((k) => {
                k.IsCorrect = k.IsCorrect ? true : false;
            });
            row.TypeCode = row.TypeCode.toString();
            this.parms = JSON.parse(JSON.stringify(row));
            this.parms.ExamQuestionTypeId =
                this.parms.ExamQuestionTypeId == 0
                    ? ""
                    : this.parms.ExamQuestionTypeId;
            this.dialogTitle = "编辑";
            this.addShow = true;
        },
        showQuestionsType() {
            this.$refs.questionsType.show((list) => {
                this.questionsTypeList = list;
            });
        },
    },
    mounted() {
        this.handleSearch();
        this.Get("/GetQuestionTypeCom").then((res) => {
            if (res.status == 2000) {
                this.TypeCom = res.data;
            }
        });
        // this.$nextTick(async () => {
        //     if (this.$refs.questionsType) {
        //         this.questionsTypeList =
        //             await this.$refs.questionsType.getList();
        //     }
        // });
    },
};
</script>

<style scoped>
.clearfix span {
    font-size: 15px;
    font-weight: 600;
}
/deep/ .ql-align{
    line-height: 24px;
}
</style>
