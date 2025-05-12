<template>
    <page-layout
        class="page"
        :loading="loading"
        :pages="pages"
        @current-change="handleCurrentChange"
    >
        <!-- <div slot="header" class="header f-c">
            <div class="header-tab f-c-c">
                <div class="item" :class="{active: QueryScope == 1}" @click="changeStore(1)">公库</div>
                <div class="item" :class="{active: QueryScope == 0}" @click="changeStore(0)">私库</div>
            </div>
        </div> -->
        <!--工具条开始-->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    v-model="filters.Name"
                    placeholder="技术交底名称"
                    clearable
                    @keyup.enter.native="handleSearch"
                ></el-input>
                <el-input
                    v-model="filters.CreateBy"
                    placeholder="更新人"
                    clearable
                    @keyup.enter.native="handleSearch"
                ></el-input>
                <custom-date-range
                    v-model="filters.date"
                    :hasIsLong="false"
                ></custom-date-range>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </div>
            <div class="f-c-c">
                <el-button-group style="margin-right: 20px" v-show="false">
                    <el-button v-if="btnShow" @click="upload()"
                        >下载模板</el-button
                    >
                    <el-button>
                        <el-upload
                            action="#"
                            :show-file-list="false"
                            :on-change="handleExcel"
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                            >导入
                        </el-upload>
                    </el-button>
                </el-button-group>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="showAdddialog()"
                    v-if="QueryScope == 0"
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
                width="60px"
            >
            </el-table-column>
            <el-table-column prop="EnterpriseName" label="所属公司" width="240"> </el-table-column>
            <el-table-column prop="Name" label="技术交底名称"> </el-table-column>
            <el-table-column
                prop="UpdateByName" align="center" label="更新人" width="150"
            >
            </el-table-column>
            <el-table-column
                prop="UpdateTimeDesc"
                label="更新时间"
                align="center"
                header-align="center"
                width="200"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="200"
            >
                <template slot-scope="{ row, $index}">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            @click="showAdddialog(row)"
                            v-if="row.IsOp == 1"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            text-plain
                            @click="remove($index, row)"
                            v-if="row.IsOp == 1"
                        >删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--列表结束-->
        <info ref="info" @load="handleSearch"/>
    </page-layout>
</template>



<script>
import axios from "axios";
import info from "./info";
import request_mixin from "@/mixins/request-mixin.js";
import Download from "@/mixins/Download.js";
const IsPrivate = 0;
/* 
IsPrivate = 1 只查私有 
IsPrivate = 0 查公库 && QueryScope= 0 本级公库，1 上级公库，2所有公库 
IsPrivate = null && QueryScope= 0 本级公库+私库，1 上级公库+私库，2所有公库+私库
*/
export default {
    components: {
        info,
    },
    mixins: [request_mixin, Download],
    data() {
        return {
            downloadFileUrl: "",
            btnShow: false,
            //列表行的ID，编辑和删除时需要使用
            id: "",
            //搜索时的过滤条件
            filters: {
                date: ''
            },
            //数据列表
            list: [],
            //分页相关数据
            pages: {
                total: 0,
                page: 1,
                rows: 10,
            },
            //列表页面是否加载变量
            loading: false,
            QueryScope: 0
        };
    },
    methods: {
        upload(fileName) {
            var elemIF = document.createElement("iframe");
            elemIF.src = this.downloadFileUrl;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        },
        async handleExcel(file, index) {
            const loading = this.$loading({
                lock: true,
                text: "导入中...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            if (file && file.status === "ready") {
                let formData = new FormData();
                formData.set("file", file.raw);
                try {
                    const res = await axios.post(
                        process.env.API_ROOT +
                            "ImportViewEnterprisePotentialCheck",
                        formData,
                        {
                            headers: {
                                "Content-type": "multipart/form-data",
                                ttoken: window.localStorage.getItem("ttoken"),
                            },
                        }
                    );

                    if (res.data.status === 2000) {
                        this.showAdddialog(res.data.data);
                    }
                } catch (ex) {
                    console.log(ex);
                }
                loading.close();
            }
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
        async GetList() {
            let that = this;
            let params = Object.assign(
                {
                    page: that.pages.page,
                    rows: that.pages.rows,
                    IsPrivate,
                    QueryScope: 2 || this.QueryScope
                },
                that.filters
            );
            let date = this.filters.date.split(',');
            if (date.length > 1) {
                params.StartDate = date[0];
                params.EndDate = date[1];
            }
            that.loading = true;
            try {
                let res = await this.Post('/GetTechnicalDatabases', params);
                if (res.status == 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                } else {
                    this.$message.error(res.message)
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        showAdddialog(item) {
            this.$refs.info.show(item);
        },
        //删除
        remove(index, row) {
            let than = this;
            than.$confirm("确认删除该记录吗?", "提示", { type: "warning" }).then(async () => {
                than.loading = true;
                let res = await this.Post(`/DeleteTechnicalDatabase`, {
                    Ids: [row.TechnicalDatabaseId]
                });
                if (res.status == 2000) {
                    this.$message.success('删除成功');
                    this.handleSearch();
                } else {
                    this.$message.error(res.message);
                }
                this.loading = false;
            });
        },
        changeStore(num) {
            if (this.QueryScope == num) return;
            this.QueryScope = num;
            this.handleSearch(1);
        }
    },
    mounted() {
        this.handleSearch();
    },
};
</script>

<style lang="scss" scoped>
.page{
    /deep/ .date-range{
        width: 380px;
    }
}
.header{
    position: relative;
    padding-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
    .header-tab{
        margin: 0 auto;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            border-radius: 74px;
            border: 1px solid #fff;
            width: 74px;
            height: 74px;
            background: #63B0FF url(../../../assets/images/data-base/learn.png) no-repeat center center;
            background-size: cover;
        }
    }
    .item{
        border-radius: 6px;
        padding: 15px 72px;
        background: #fff;
        color: $--color-primary;
        cursor: pointer;
        &.active{
            background: $--color-primary;
            color: #fff;
        }
    }
    .operation{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }
}
</style>
