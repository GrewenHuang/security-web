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
                        clearable
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
                align="center"
                header-align="center"
                type="index"
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
                fixed="right"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            @click="toFile(scope.row.PotentialId)"
                            >归档</el-button
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
import potentialView from "@/components/common/potential-view";
import mediaList from '@/components/common/media-list'
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
        };
    },
    created() {},
    methods: {
        seeView(PotentialId) {
            this.viewShow = true;
            this.$nextTick(() => {
                this.$refs.child.getData(PotentialId);
            });
        },
        toFile(PotentialId) {
            this.$confirm("您是否确定归档?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true,
            }).then(() => {
                this.Post("/SaveEnterprisePotentialFile", {
                    PotentialId,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.getList();
                        this.$message({
                            type: "success",
                            message: res.message,
                        });
                    } else {
                        this.$message.error(res.message);
                    }
                });
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
            this.Post("/GetEnterprisePotentialCancel", params)
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
</style>
