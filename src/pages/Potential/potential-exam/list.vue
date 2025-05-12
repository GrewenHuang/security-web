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
                    v-model="filters.PotentialSource"
                    placeholder="请选择隐患来源"
                    clearable
                >
                    <el-option
                        v-for="item in SourceCom"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
                <el-input
                    v-model="filters.TextCondition"
                    clearable
                    placeholder="隐患项目/隐患内容/上报人"
                ></el-input>
                <div>
                    <el-date-picker
                        v-model="filters.StartSubmitDate"
                        type="date"
                        clearable
                        placeholder="上报开始日期"
                        value-format="yyyy-MM-dd"
                        @keyup.enter.native="handleSearch"
                    >
                    </el-date-picker>
                    <span
                        style="
                            line-height: 40px;
                            color: #ccc;
                            display: inline-block;
                            width: 13px;
                            white-space: pre;
                        "
                    > - </span>
                    <el-date-picker
                        v-model="filters.EndSubmitDate"
                        type="date"
                        clearable
                        placeholder="上报结束日期"
                        value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </div>
        </div>
        <!--工具条结束-->

        <!--列表开始-->
        <el-table
            :data="list"
            highlight-current-row
            :header-cell-style="$tableStyle"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" class="demo-table-expand">
                        <el-form-item label="排查照片：" v-if="props.row.RecordSubmit">
                            <mediaList :list="props.row.RecordSubmit.AttachmentFiles"/>
                        </el-form-item>
                        <el-form-item label="排查备注：">
                            <span>{{ props.row.RecordSubmit.Remark }}</span>
                        </el-form-item>
                        <el-form-item label="上报人：">
                            <span>{{ props.row.SubmitUserName }}</span>
                        </el-form-item>
                        <el-form-item label="上报时间：">
                            <span>{{ props.row.SubmitDateDesc }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="序号"
                type="index"
                align="center"
                header-align="center"
                width="60"
            >
            </el-table-column>

            <el-table-column label="隐患项目" prop="Project"> </el-table-column>
            <el-table-column label="隐患内容">
                <template slot-scope="scope">
                    <Unfold :data="scope.row.Content" :maxLen="20" />
                </template>
            </el-table-column>

            <el-table-column
                label="隐患来源"
                align="center"
                header-align="center"
                width="150"
                prop="PotentialSourceDesc"
            >
            </el-table-column>
            <el-table-column
                label="隐患级别"
                align="center"
                header-align="center"
                prop="PotentialLevelName"
                width="90"
            >
                <template slot-scope="scope">
                    <el-tag
                        size="small"
                        effect="dark"
                        :type="
                            scope.row.PotentialLevelCode == '058002'
                                ? ''
                                : 'danger'
                        "
                    >
                        {{ scope.row.PotentialLevelName }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                align="center"
                header-align="center"
                label="状态"
                width="100"
            >
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row | filterscolor"
                        effect="dark"
                        size="small"
                    >
                        {{ scope.row.StatusDesc }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="380"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            v-if="scope.row.SHowBtn[0]"
                            @click="confirmhandle(scope.row.PotentialId, 1)"
                            >确认</el-button
                        >
                        <el-button
                            type="text"
                            v-if="scope.row.SHowBtn[1]"
                            @click="rejecthandle(scope.row.PotentialId, 0)"
                            >驳回</el-button
                        >
                        <el-button
                            type="text"
                            v-if="scope.row.SHowBtn[2]"
                            @click="
                                Issuehandle(
                                    scope.row.PotentialId,
                                    'SaveEnterprisePotentialAssignment',
                                    '下发'
                                )
                            "
                            >下发</el-button
                        >
                        <el-button
                            type="text"
                            v-if="scope.row.SHowBtn[3]"
                            @click="
                                Issuehandle(
                                    scope.row.PotentialId,
                                    'SaveEnterprisePotentialExaminationAssignment',
                                    '审核下发'
                                )
                            "
                            >审核下发</el-button
                        >
                        <el-button
                            type="text"
                            v-if="scope.row.SHowBtn[4]"
                            @click="
                                Issuehandle(
                                    scope.row.PotentialId,
                                    'SaveEnterprisePotentialReAssignment',
                                    '重新下发'
                                )
                            "
                            >重新下发</el-button
                        >
                        <el-button
                            type="text"
                            @click="seeView(scope.row.PotentialId)"
                            >操作记录</el-button
                        >
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--列表结束-->

        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            title="隐患驳回"
            :visible.sync="rejectShow"
            :close-on-click-modal="false"
            width="30%"
        >
            <el-form
                ref="rejectForm"
                :model="rejectJson"
                :rules="rules"
            >
                <el-form-item label="驳回原因：" prop="Remark">
                    <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="rejectJson.Remark"
                        maxlength="300"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rejectShow = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="rejectsubmit('rejectForm')"
                    :loading="Btnload"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!--弹层结束-->
        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            title="操作记录"
            :visible.sync="viewShow"
            :close-on-click-modal="false"
            width="40%"
        >
            <potentialView ref="child" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewShow = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--弹层结束-->

        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            :title="title"
            :visible.sync="IssueShow"
            :close-on-click-modal="false"
            width="30%"
        >
            <el-form>
                <el-form-item label="整改负责人：">
                    <!-- <el-select
                        v-model="IssueJson.ReformUserId"
                        clearable
                        filterable
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in UsersCom"
                            :key="item.UserId"
                            :label="item.UserName"
                            :value="item.UserId"
                        >
                        </el-option>
                    </el-select> -->
                    <choose-user class="el-input" v-model="IssueJson" idKey="ReformUserId" nameKey="ReformUserName"></choose-user>
                </el-form-item>
                <el-form-item label="整改期限：">
                    <div class="el-input">
                        <el-date-picker
                            style="width: 100%;"
                            v-model="IssueJson.ReformDeadlineTime"
                            type="date"
                            :picker-options="pickerBeginDateBefore"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <p style="font-size: 12px; color: red">
                        注：此操作确认隐患存在并进行隐患任务下发
                    </p>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="IssueShow = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="Issuesubmit()"
                    :loading="Btnload"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!--弹层结束-->
    </page-layout>
</template>



<script>
import request_mixin from "@/mixins/request-mixin.js";
import potentialView from "@/components/common/potential-view";
import RULECONFIG from "@/common/ruleConfig";
import mediaList from '@/components/common/media-list'
import util from '@/common/util';

export default {
    name: "list",
    components: {
        potentialView,
        mediaList
    },
    mixins: [request_mixin],
    data() {
        return {
            rules: {
                Remark: RULECONFIG.Text("驳回原因"),
            },
            title: "",
            PotentialId: "",
            viewShow: false,
            url: "",
            rejectJson: {
                Remark: "", //驳回内容
                ExaminationStatus: null,
                PotentialId: null,
            },
            IssueShow: false,
            IssueJson: {
                PotentialId: null, // long 隐患Id
                ReformUserId: null, // long 整改负责人Id
                ReformDeadlineTime: null, // datetime 限期整改时间
                Remark: null, // string 备注
            },
            Btnload: false,

            UsersCom: [], //整改负责人
            SourceCom: [],
            //列表行的ID，编辑和删除时需要使用
            id: "",
            //状态选项
            checkTypeList: [],
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
            rejectShow: false, //驳回弹框状态
            dialogTitle: "",
            //列表页面是否加载变量
            loading: false,
            //表单页面是否加载变量
            formLoading: false,
            //新增/编辑页面弹窗隐藏显示控制变量
            formVisible: false,
            pickerBeginDateBefore: {
                disabledDate(time) {
                    return (
                        time.getTime() <
                        new Date().getTime() - 1 * 24 * 60 * 60 * 1000
                    );
                },
            },
        };
    },

    methods: {
        seeView(PotentialId) {
            this.viewShow = true;
            this.$nextTick(() => {
                this.$refs.child.getData(PotentialId);
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
        getList: function () {
            let params = Object.assign(
                {
                    page: this.pages.page,
                    rows: this.pages.rows,
                },
                this.filters
            );

            this.loading = true;
            this.Post("/GetEnterprisePotentialSubmit", params)
                .then((res) => {
                    if (res.status == 2000) {
                        res.data.list.forEach((k) => {
                            k.SHowBtn = [0, 0, 0, 0, 0];
                            if (k.Status == 10) {
                                k.SHowBtn = [1, 1, 0, 1, 0];
                            } else if (k.Status == 20) {
                                k.SHowBtn = [0, 0, 1, 0, 0];
                            } else if (k.Status == 30) {
                                k.SHowBtn = [0, 0, 0, 0, 1];
                            }
                            if (k.RecordSubmit)
                                k.Dimglist = k.RecordSubmit.AttachmentFiles.map(
                                    (res) => {
                                        return res.Url;
                                    }
                                );
                        });
                        this.list = res.data.list;
                        this.pages.total = res.data.count;
                    }
                    this.loading = false;
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        confirmhandle(PotentialId, ExaminationStatus) {
            //确认
            this.$confirm("您确认此上报问题是隐患吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true,
            }).then(() => {
                this.handle(PotentialId, ExaminationStatus);
            });
        },
        Issuehandle(PotentialId, url, title) {
            this.title = title;
            this.IssueJson = {
                PotentialId: null, // long 隐患Id
                ReformUserId: null, // long 整改负责人Id
                ReformDeadlineTime: null, // datetime 限期整改时间
                Remark: null, // string 备注
            };
            this.url = url;
            this.IssueShow = true;
            this.IssueJson.PotentialId = PotentialId;
            this.Get("/GetEnterpriseUsers").then((res) => {
                if (res.status == 2000) {
                    this.UsersCom = res.data;
                }
            });
            if (title == "重新下发") {
                this.Post("/GetPotentialOperationRecords", {
                    PotentialId,
                    PotentialOperations: [30, 31],
                }).then((res) => {
                    if (res.status == 2000) {
                        this.IssueJson.ReformUserId =
                            res.data[0].OperatedUserId;
                        this.IssueJson.ReformDeadlineTime =
                            res.data[0].ReformDeadlineTimeDesc;
                    }
                });
            }
        },
        Issuesubmit() {
            //下发
            this.Btnload = true;
            this.Post("/" + this.url, this.IssueJson).then((res) => {
                if (res.status === 2000) {
                    this.getList();
                    this.Btnload = false;
                    this.IssueShow = false;
                    this.$message({
                        type: "success",
                        message: res.message,
                    });
                } else {
                    this.$message.error(res.message);
                    this.Btnload = false;
                }
            });
        },

        rejecthandle(PotentialId, ExaminationStatus) {
            //驳回
            this.rejectShow = true;
            this.rejectJson.ExaminationStatus = ExaminationStatus;
            this.rejectJson.PotentialId = PotentialId;
        },
        rejectsubmit(formName) {
            this.Btnload = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Post(
                        "/SaveEnterprisePotentialExamination",
                        this.rejectJson
                    ).then((res) => {
                        if (res.status == 2000) {
                            this.getList();
                            this.Btnload = false;
                            this.rejectShow = false;
                            this.$message({
                                type: "success",
                                message: res.message,
                            });
                        } else {
                            this.$message.error(res.message);
                            this.Btnload = false;
                        }
                    });
                } else {
                    this.Btnload = false;
                }
            });
        },

        handle(PotentialId, ExaminationStatus) {
            this.Post("/SaveEnterprisePotentialExamination", {
                PotentialId, //隐患Id
                ExaminationStatus, //int 审核状态 [0驳回，1确认]
                Remark: "", //string 备注
            }).then((res) => {
                if (res.status == 2000) {
                    this.getList();
                } else {
                    this.$message.error(res.message);
                }
            });
        },
    },
    mounted() {
        let url = util.getLoginUrl() == '/rb-login' ? 'GetRoadPotentialSourceCom' : 'GetPotentialSourceCom'
        //获取隐患排查性质
        this.Get(url).then((res) => {
            if (res.status === 2000) {
                this.SourceCom = res.data;
            }
        });
        this.handleSearch();
    },
};
</script>

<style scoped>
/deep/ .el-button + .el-button {
    margin-left: 0;
}
</style>
