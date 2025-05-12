<template>
    <page-layout class="occupational-hazards-desclaration warp"
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
                <el-date-picker v-model="filters.TestedDate"
                    type="date"
                    placeholder="检测时间"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <el-date-picker v-model="filters.DeclarationFilingDate"
                    type="date"
                    placeholder="申报时间"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <el-select v-model="filters.IsPass" placeholder="通过情况" clearable>
                    <el-option  label="通过" value="1"></el-option>
                    <el-option  label="未通过" value="0"></el-option>
                </el-select>
                <el-button
                    type="primary"
                    @click="getFirstPage()"
                    >查询</el-button
                >
            </div>
            <div class="f-c-c">
                <el-button-group style="margin-right: 20px;">
                    <el-button @click="downloadmbs(910,9101,filters)">导出</el-button>
                </el-button-group>
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
            v-loading="loading"
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
                width="200"
            >
            </el-table-column>
            <el-table-column
                label="检测时间"
                align="center"
                header-align="center"
                prop="TestedDateDesc"
                width="130"
            >
            </el-table-column>
            <el-table-column
                label="被检测岗位"
                align="center"
                header-align="center"
                prop="TestedPost"
                width="150"
            >
            </el-table-column>
            <el-table-column
                label="检测结果及危害程度"
                align="center"
                header-align="center"
                prop="TestResultHazardDegree"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="申报系统名称"
                align="center"
                header-align="center"
                prop="DeclarationFilingName"
                width="263"
            ></el-table-column>
            <el-table-column
                label="申报时间"
                align="center"
                header-align="center"
                prop="DeclarationFilingDateDesc"
                width="130"
            ></el-table-column>
            <el-table-column
                label="通过情况"
                align="center"
                header-align="center"
                width="130"
            >
                <template slot-scope="{row}">
                    <whether :yes="row.IsPass == '1'" :text="row.IsPass == '1' ? '通过' : '未通过'"/>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="210"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="addRecord(scope.row, true)"
                        >查看</el-button
                    >
                    <el-button
                        style="margin: 0 5px;"
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
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表 结束 -->
        <add ref="occupationalHazardsDesclarationAdd" @success="getFirstPage"/>
    </page-layout>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import add from './add';
export default {
    components: {
        add
    },
    mixins: [request_mixin, upload_mixin, Download, Import_export],
    data() {
        return {
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            filters: {
                OccupationalHazardName: '', // 职业病危害因素名称
                TestedDate: '', // 检测时间
                DeclarationFilingDate: '', // 申报时间、备案上报时间
                IsPass: '', // 是否通过
                OccupationalHazardRecordType: 1,
            } ,// 查询条件
            loading: false,
            list: [],
        };
    },

    methods: {
        addRecord(item, isPreview) {
            this.$refs.occupationalHazardsDesclarationAdd.show(item, isPreview);
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
            let res = await this.Post('/GetOccupationalHazardRecords', params);
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
            let res = await this.Get('/DeleteOccupationalHazardRecord', {occupationalHazardRecordId: item.OccupationalHazardRecordId});
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
    .occupational-hazards-desclaration{
        /deep/ .el-input--small{
            width: 180px;
        }
    }
</style>
  
