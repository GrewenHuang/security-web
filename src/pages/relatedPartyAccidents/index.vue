<template>
    <page-layout class="related-party-accidents" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
            <!-- 条件栏 开始 -->
            <div slot="operation" class="f-b-c">
                    <div class="input-content">
                        <el-input
                            v-model="filters.FileNo"
                            placeholder="档案编号"
                            clearable
                        ></el-input>
                        <el-date-picker v-model="filters.AccidentDate"
                            type="date"
                            placeholder="事故日期"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                        <el-button
                            type="primary"
                            @click="getFirstPage()"
                            >查询</el-button
                        >
                    </div>
                    <div class="f--c">
                        <el-dropdown @command="handleYearDoawload" style="margin-right: 20px;">
                            <el-button>
                                导出
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <template v-for="(year, index) in yearList">
                                    <el-dropdown-item :key="index" :command="year">{{year}}年</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
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
                    label="档案编号"
                    align="center"
                    header-align="center"
                    prop="FileNo"
                    width="150"
                >
                </el-table-column>
                <el-table-column
                    label="事故日期"
                    align="center"
                    header-align="center"
                    prop="AccidentDateDesc"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    label="事故当事人"
                    align="center"
                    header-align="center"
                    prop="AccidentParty"
                    width="130"
                >
                </el-table-column>
                <el-table-column
                    label="事故地点"
                    align="center"
                    header-align="center"
                    prop="AccidentLocation"
                ></el-table-column>
                <el-table-column
                    label="事故性质"
                    align="center"
                    header-align="center"
                    width="155"
                    prop="AccidentNature"
                >
                </el-table-column>
                <el-table-column
                    label="事故责任"
                    align="center"
                    header-align="center"
                    prop="AccidentLiability"
                    width="155"
                >
                </el-table-column>
                <el-table-column
                    label="事故类别"
                    align="center"
                    header-align="center"
                    prop="AccidentCategory"
                    width="150"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="280"
                >
                    <template slot-scope="scope">
                        <div class="table-operation">
                            <el-button
                                type="text"
                                @click="addRecord(scope.row, true)"
                                >查看</el-button
                            >
                            <el-button
                                type="text"
                                @click="addRecord(scope.row)"
                                >编辑</el-button
                            >
                            <el-button
                                type="text"
                                @click="downloadmbs(1210, 12104, scope.row.RelatedPartyAccidentId)">下载</el-button>
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
        <add ref="relatedPartyAccidentsAdd" @success="getFirstPage"/>
    </page-layout>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import add from './add';
let yearList = [];
let yearDate = new Date().getFullYear() - 2;
for(let i = 0; i < 5; i++) {
    yearList.push(yearDate++);
}
export default {
    name: "related-party-accidents",
    components: {
        add
    },
    mixins: [request_mixin, upload_mixin, Download, Import_export],
    data() {
        return {
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            filters: {
                FileNo: '', // 档案编号 
                AccidentDate: '', // 事故日期 
            } ,// 查询条件
            loading: false,
            list: [],
            yearList,
        };
    },

    methods: {
        addRecord(item, isPreview) {
            this.$refs.relatedPartyAccidentsAdd.show(item, isPreview);
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
            let res = await this.Post('/GetRelatedPartyAccidents', params);
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
            let res = await this.Get('/DeleteRelatedPartyAccident', {relatedPartyAccidentId: item.RelatedPartyAccidentId});
            if (res.status === 2000) {
                this.$message.success('删除成功');
                this.getList();
            }
        },
        handleYearDoawload(command) {
            this.downloadmbs(1210, 12102, {
                ...this.filters,
                Year: command
            })
        }
    },
    async created() {
        this.getFirstPage();
    },
};
</script>
<style lang="scss" scoped>
</style>
  
