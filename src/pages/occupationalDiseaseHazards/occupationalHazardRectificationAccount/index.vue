<template>
    <page-layout class="occupational-hazard-rectification-account warp"
        :loading="loading"
        :pages="pages"
        @current-change="handleCurrentChange"
    >
        <!-- 条件栏 开始 -->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    v-model="filters.OccupationalHazardName"
                    placeholder="职业病危害因素名称"
                    clearable
                ></el-input>
                <el-date-picker v-model="filters.RectifyDate"
                    type="date"
                    placeholder="整改时间"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <el-button
                    type="primary"
                    @click="getFirstPage()"
                    >查询</el-button
                >
            </div>
            <div class="f-c-c">
                <el-button-group>
                    <el-button @click="downloadmbs(910,9103,filters)">导出</el-button>
                </el-button-group>
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
                label="职业病危害因素名称"
                align="center"
                header-align="center"
                prop="OccupationalHazardName"
                width="280"
            >
            </el-table-column>
            <el-table-column
                label="危害程度"
                align="center"
                header-align="center"
                prop="HazardLevelDesc"
                width="160"
            >
            </el-table-column>
            <el-table-column
                label="整改措施"
                align="center"
                header-align="center"
                prop="RectifyMeasure"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="整改效果"
                align="center"
                header-align="center"
                prop="RectifyResult"
                width="300"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="整改时间"
                align="center"
                header-align="center"
                prop="RectifyDateDesc"
                width="130"
            ></el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="140"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="view(scope.row)"
                        >查看</el-button
                    >
                    <el-popconfirm
                        title="确认删除吗？"
                        @confirm="removeVoyageLog(scope.row)"
                    >
                        <el-button
                            slot="reference"
                            type="test"
                            text-plain
                            >删除</el-button
                        >
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表 结束 -->
        <detail ref="occupationalHazardRectificationAccountDetail"/>
    </page-layout>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import detail from './detail';
export default {
    components: {
        detail
    },
    mixins: [request_mixin, upload_mixin, Download, Import_export],
    data() {
        return {
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            filters: {
                OccupationalHazardName: '', // 职业病危害因素名称
                RectifyDate: '', // 整改日期
            } ,// 查询条件
            loading: false,
            list: [],
        };
    },

    methods: {
        view(item) {
            this.$refs.occupationalHazardRectificationAccountDetail.show(item);
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
            let res = await this.Post('/GetOccupationalHazardAccounts', params);
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
            let res = await this.Get('/DeleteOccupationalHazardAccount', {occupationalHazardAccountId: item.OccupationalHazardAccountId});
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
    .occupational-hazard-rectification-account{
        /deep/ .el-input--small{
            width: 180px;
        }
    }
</style>
  
