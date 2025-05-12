<!-- 健康档案 -->
<template>
    <page-layout class="health-records warp"
        :loading="loading"
        :pages="pages"
        @current-change="handleCurrentChange"
    >
        <!-- 条件栏 开始 -->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    v-model="filters.UserName"
                    placeholder="姓名"
                    clearable
                ></el-input>
                <el-input
                    v-model="filters.Company"
                    placeholder="工作单位"
                    clearable
                ></el-input>
                <el-button
                    type="primary"
                    @click="getFirstPage()"
                    >查询</el-button
                >
            </div>
           <div>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addRecord()"
                    >新增</el-button
                >
           </div>
        </div>
        <!-- 条件栏 结束 -->

        <!--列表 开始-->
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
                width="50"
            >
            </el-table-column>
            <el-table-column
                label="姓名"
                align="center"
                header-align="center"
                prop="UserName"
                width="155"
            >
            </el-table-column>
            <el-table-column
                label="性别"
                align="center"
                header-align="center"
                prop="GenderDesc"
                width="100"
            >
            </el-table-column>
            <el-table-column
                label="出生日期"
                align="center"
                header-align="center"
                prop="BirthdayDesc"
                width="150"
            >
            </el-table-column>
            <el-table-column
                label="工作单位"
                align="center"
                header-align="center"
                prop="Company"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="建档日期"
                align="center"
                header-align="center"
                prop="CreatedDateDesc"
                width="150"
            ></el-table-column>
            <el-table-column
                label="编号"
                align="center"
                header-align="center"
                prop="Number"
                width="200"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="210"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            @click="viewInfo(scope.row)"
                            >查看</el-button
                        >
                        <el-button
                            type="text"
                            @click="addRecord(scope.row)"
                            >编辑</el-button
                        >
                        <el-popconfirm
                            title="确认删除吗？"
                            @confirm="removeVoyageLog(scope.row)"
                        >
                            <el-button
                                slot="reference"
                                type="text"
                                text-plain
                                >删除</el-button
                            >
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表 结束 -->
        <detail ref="healthRecordsDetail"/>
        <add ref="healthRecordsAdd" @success="getFirstPage"/>
    </page-layout>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import detail from './detail';
import add from './add';
export default {
    components: {
        detail,
        add
    },
    mixins: [request_mixin, upload_mixin, Download, Import_export],
    data() {
        return {
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            filters: {
                UserName: '',
                Company: '',
            } ,// 查询条件
            loading: false,
            list: [],
        };
    },

    methods: {
        addRecord(item) {
            this.$refs.healthRecordsAdd.show(item);
        },
        viewInfo(info) {
            this.$refs.healthRecordsDetail.show(info);
        },
        //分页事件
        handleCurrentChange (val) {
            this.pages.page = val;
            this.getList();
        },
        getParams() {
            let params = {
                ...this.pages,
                ...this.filters,
            };
            return params;
        },
        async getList() {
            let params = this.getParams();
            let res = await this.Post('/GetHealthRecords', params);
            if (res.status === 2000) {
                let {list, count: total, page, rows} = res.data;
                this.list = list;
                this.pages.total = total;
                this.pages.page = page;
                this.pages.rows = rows;
            }
        },
        getFirstPage() {
            this.pages.page = 1;
            this.getList();
        },
        async removeVoyageLog(item) {
            let res = await this.Get('/DeleteHealthRecord', {healthRecordId: item.HealthRecordId});
            if (res.status === 2000) {
                this.$message.success('删除成功');
                this.getList();
            }
        },
    },
    async mounted() {
        this.getFirstPage();
    },
};
</script>
<style lang="scss" scoped>
    .health-records{
        /deep/ .el-input--small{
            width: 180px;
        }
    }
</style>
  
