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
                        placeholder="上报开始日期"
                        value-format="yyyy-MM-dd"
                        clearable
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
                        placeholder="上报结束日期"
                        value-format="yyyy-MM-dd"
                        clearable
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
                        <el-form-item label="排查照片：">
                            <mediaList :list="props.row.RecordSubmit.AttachmentFiles" v-if="props.row.RecordSubmit"/>
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
            <el-table-column label="隐患内容" prop="Content"> </el-table-column>

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
                label="整改负责人"
                align="center"
                header-align="center"
                width="150"
                prop="ResponsibleName"
            >
            </el-table-column>
            <el-table-column
                label="整改期限"
                align="center"
                header-align="center"
                width="150"
                prop="ReformDeadlineTimeDesc"
            >
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
                width="230"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            v-if="userInfo.UserId == scope.row.ResponsibleId"
                            @click="
                                showFormDialog(scope.row.PotentialId, scope.row)
                            "
                            >整改</el-button
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
            title="整改"
            :visible.sync="addShow"
            :close-on-click-modal="false"
            @close="close()"
            width="50%"
            top="8vh"
        >
            <el-scrollbar class="scrollbar">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="font-weight: 600; font-size: 15px"
                            >检查项目：{{ row.Project }}</span
                        >
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            >{{ row.PotentialLevelName }}</el-button
                        >
                    </div>
                    <div>
                        <el-form
                            :rules="rules"
                            :model="parms"
                            ref="form"
                        >
                            <el-form-item label="检查内容：">
                                <el-input
                                    type="textarea"
                                    :value="row.Content"
                                    disabled
                                    readonly
                                ></el-input>
                            </el-form-item>

                            <el-form-item label="隐患来源：">
                                <el-input
                                    type="text"
                                    disabled
                                    :value="row.PotentialSourceDesc"
                                    readonly
                                ></el-input>
                            </el-form-item>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="上报人：">
                                        <el-input
                                            type="text"
                                            disabled
                                            :value="row.SubmitUserName"
                                            readonly
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="上报时间：">
                                        <el-input
                                            type="text"
                                            disabled
                                            :value="row.SubmitDateDesc"
                                            readonly
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="整改负责人：">
                                        <el-input
                                            type="text"
                                            disabled
                                            :value="row.ResponsibleName"
                                            readonly
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="限整改时间：">
                                        <el-input
                                            type="text"
                                            disabled
                                            :value="row.ReformDeadlineTimeDesc"
                                            readonly
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-card>
                                <el-form-item label="排查照片：">
                                    <mediaList :list="row.RecordSubmit.AttachmentFiles" v-if="row.RecordSubmit"/>
                                </el-form-item>
                                <el-form-item label="排查备注：">
                                    <el-input
                                        type="textarea"
                                        disabled
                                        v-if="row.RecordSubmit"
                                        :value="row.RecordSubmit.Remark"
                                        readonly
                                    ></el-input>
                                </el-form-item>
                            </el-card>
                            <div v-if="OperationRecords.length > 0">
                                <el-card
                                    class="box-card"
                                    v-for="(item, index) in OperationRecords"
                                    :key="index"
                                >
                                    <el-row
                                        v-if="
                                            item.PotentialOperationDesc.includes(
                                                '整改'
                                            )
                                        "
                                    >
                                        <el-col :span="24">
                                            <el-form-item label="整改照片：">
                                                <mediaList :list="item.AttachmentFiles"/>
                                            </el-form-item>
                                            <el-form-item label="整改备注：">
                                                <div>{{ item.Remark }}</div>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <div v-else>
                                        <el-row>
                                            <el-col :span="12">
                                                <el-form-item label="复查人：">
                                                    <div>
                                                        {{
                                                            item.OperationUserName
                                                        }}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item
                                                    label="复查时间："
                                                >
                                                    <div>
                                                        {{
                                                            item.OperationDateDesc
                                                        }}
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="24">
                                                <el-form-item
                                                    label="不通过原因："
                                                >
                                                    <div>{{ item.Remark }}</div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-card>
                            </div>
                            <el-card class="box-card">
                                <el-form-item label="整改照片：" prop="Pics">
                                    <el-upload
                                        :action="url()"
                                        :accept="upload.image_suffix"
                                        list-type="picture-card"
                                        :before-upload="before"
                                        :on-change="
                                            (file, fileList) => {
                                                change(file, 1);
                                            }
                                        "
                                        :before-remove="
                                            (file, fileList) => {
                                                return before_remove(file, 1);
                                            }
                                        "
                                        :file-list="arrFilesFun(1)"
                                        :on-preview="preview"
                                    >
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item label="整改备注：" prop="Remark">
                                    <el-input
                                        type="textarea"
                                        placeholder="请输入整改备注..."
                                        maxlength="300"
                                        v-model="parms.Remark"
                                        show-word-limit
                                    ></el-input>
                                </el-form-item>
                            </el-card>
                        </el-form>
                    </div>
                </el-card>
            </el-scrollbar>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close()">取 消</el-button>
                <el-button type="primary" @click="sign()" :loading="Btnload"
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
    </page-layout>
</template>



<script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import RULECONFIG from "@/common/ruleConfig";
import potentialView from "@/components/common/potential-view";
import mediaList from '@/components/common/media-list'
import Qs from "qs";
import util from '@/common/util';
export default {
    name: "list",
    mixins: [request_mixin, upload_mixin],
    components: {
        potentialView,
        mediaList
    },
    data() {
        return {
            OperationRecords: [],
            row: "",
            PotentialId: "",
            viewShow: false,
            loading: false,
            SourceCom: [],
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
            Btnload: false,
            addShow: false,
            parms: {
                Pics: [],
                Remark: "",
                PotentialId: "",
            },
            rules: {
                Pics: RULECONFIG.Select("整改照片"),
                Remark: RULECONFIG.Text("整改备注"),
            },
            userInfo: Qs.parse(window.localStorage.getItem("userinfo")),
        };
    },
    created() {
        this.upload.arrFiles = [[], [], [], [], []];
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
        getList() {
            let params = Object.assign(
                {
                    page: this.pages.page,
                    rows: this.pages.rows,
                },
                this.filters
            );

            this.loading = true;
            this.Post("/GetEnterprisePotentialAssignmentByWeb", params)
                .then((res) => {
                    if (res.status == 2000) {
                        res.data.list.forEach((k) => {
                            if (k.RecordSubmit) {
                                k.Dimglist = k.RecordSubmit.AttachmentFiles.map(
                                    (res) => {
                                        return res.Url;
                                    }
                                );
                            }
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

        //检查执行
        showFormDialog(id, row) {
            this.addShow = true;
            this.parms.PotentialId = id;

            this.Post("/GetPotentialOperationRecords", {
                PotentialId: row.PotentialId,
                PotentialOperations: [40, 41, 50],
                Order: 1,
            }).then((res) => {
                if (res.status == 2000) {
                    res.data.forEach((k) => {
                        if (k.AttachmentFiles) {
                            k.Dimglist = k.AttachmentFiles.map((res) => {
                                return res.Url;
                            });
                        }
                    });

                    this.OperationRecords = res.data;
                }
            });
            this.row = row;
        },

        close() {
            this.parms = {
                Pics: "",
                Remark: "",
                PotentialId: "",
            };
            this.upload.arrFiles = [];
            this.addShow = false;
        },
        sign() {
            this.Btnload = true;
            this.parms.Pics = this.upload.arrFiles[1];
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$sign().then(signUrl => {
                        this.submit(signUrl.url);
                    });
                } else {
                    this.Btnload = false;
                }
            });
        },
        submit(SignInUrl) {
            this.parms.SignInUrl = SignInUrl;
            this.Post(
                "/SaveEnterprisePotentialRectification",
                this.parms
            ).then((res) => {
                if (res.status == 2000) {
                    this.getList();
                    this.Btnload = false;
                    this.addShow = false;
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

/deep/ .el-upload .el-upload--text {
    width: 100%;
    height: 50px;
    line-height: 0;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    margin: 0 8px 8px 0;
    display: inline-block;
}
.box-card {
    margin-top: 20px;
}
</style>
