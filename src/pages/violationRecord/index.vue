<template>
    <el-row class="violation-record warp">
        <el-col
            :span="24"
            v-loading="loading"
            element-loading-text="拼命加载中"
        >
            <!-- 条件栏 开始 -->
            <el-card shadow="hover" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <div>
                        <el-form-item>
                            <el-input
                                v-model="filters.ShipName"
                                placeholder="船名"
                                clearable
                                size="small"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input
                                v-model="filters.ShipOwner"
                                placeholder="所有人"
                                clearable
                                size="small"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                size="small"
                                plain
                                icon="el-icon-search"
                                @click="getFirstPage()"
                                >查询</el-button
                            >
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                size="small"
                                plain
                                icon="el-icon-plus"
                                @click="addRecord()"
                                >新增</el-button
                            >
                        </el-form-item>
                    </div>
                </el-form>
            </el-card>
            <!-- 条件栏 结束 -->

            <!--列表 开始-->
            <el-table
                :data="list"
                highlight-current-row
                v-loading="loading"
                :header-cell-style="$tableStyle"
                border
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
                    label="船名"
                    align="center"
                    header-align="center"
                    prop="ShipName"
                    width="155"
                >
                </el-table-column>
                <el-table-column
                    label="所有人"
                    align="center"
                    header-align="center"
                    prop="ShipOwner"
                    width="155"
                >
                </el-table-column>
                <el-table-column
                    label="运营证号"
                    align="center"
                    header-align="center"
                    prop="OperationCertificateNo"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    label="载重吨"
                    align="center"
                    header-align="center"
                    prop="Load"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    label="违法违章情况"
                    align="center"
                    header-align="center"
                    prop="Content"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    label="记录人"
                    align="center"
                    header-align="center"
                    prop="CreateByName"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="210"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="small"
                            plain
                            @click="viewInfo(scope.row)"
                            >查看</el-button
                        >
                        <el-button
                            style="margin: 0 5px;"
                            type="primary"
                            size="small"
                            plain
                            @click="addRecord(scope.row)"
                            >编辑</el-button
                        >
                        <el-popconfirm
                            title="确认删除吗？"
                            @confirm="removeVoyageLog(scope.row)"
                        >
                            <el-button
                                slot="reference"
                                type="danger"
                                size="small"
                                plain
                                >删除</el-button
                            >
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 列表 结束 -->

            <!--分页 开始-->
            <el-col
                :span="24"
                class="toolbar bottompagation"
                style="text-align: center"
            >
                <el-pagination
                    layout="total, prev, pager, next"
                    background
                    @current-change="handleCurrentChange"
                    :page-size="pages.rows"
                    :total="pages.total"
                    class="customPagination"
                >
                </el-pagination>

            </el-col>
            <!-- 分页 结束 -->
        </el-col>
        <detail ref="violationRecordDetail"/>
        <add ref="violationRecordAdd" @success="getFirstPage"/>
    </el-row>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import detail from './detail';
import add from './add';
export default {
    name: "violation-record",
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
                ShipName: '',
                ShipOwner: '',
            } ,// 查询条件
            loading: false,
            list: [],
        };
    },

    methods: {
        addRecord(item) {
            this.$refs.violationRecordAdd.show(item);
        },
        viewInfo(info) {
            this.$refs.violationRecordDetail.show(info);
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
            let res = await this.Post('/GetViolationRecords', params);
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
            let res = await this.Get('/DeleteViolationRecord', {violationRecordId: item.ViolationRecordId});
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
    .violation-record{
        /deep/ .el-input--small{
            width: 180px;
        }
    }
</style>
  