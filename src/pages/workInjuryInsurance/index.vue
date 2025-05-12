<!-- 工伤保险参保台账 -->
<template>
    <page-layout class="workInjury-insurance warp"
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
                        v-model="filters.Position"
                        placeholder="职位"
                        clearable
                    ></el-input>
                    <el-button
                        type="primary"
                        @click="getFirstPage()"
                        >查询</el-button
                    >
                </div>
                <div class="f-c-c">
                    <el-button-group style="margin-right: 20px;">
                        <el-button @click="downloadmbs(910,9104,filters)">导出</el-button>
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
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    label="职位"
                    align="center"
                    header-align="center"
                    prop="Position"
                    width="118"
                >
                </el-table-column>
                <el-table-column
                    label="身份证"
                    align="center"
                    header-align="center"
                    prop="CardNo"
                    width="200"
                >
                </el-table-column>
                <el-table-column
                    label="保单号"
                    align="center"
                    header-align="center"
                    prop="PolicyNo"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    label="购买时间"
                    align="center"
                    header-align="center"
                    prop="BuyDateDesc"
                    width="120"
                ></el-table-column>
                <el-table-column
                    label="投保额/保额"
                    align="center"
                    header-align="center"
                    prop="SumInsured"
                    width="180"
                ></el-table-column>
                <el-table-column
                    label="保险期限"
                    align="center"
                    header-align="center"
                    prop="InsurancePeriodDateDesc"
                    width="120"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="220"
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
        <add ref="workInjuryInsuranceAdd" @success="getFirstPage"/>
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
                UserName: '',
                Position: ''
            } ,// 查询条件
            loading: false,
            list: [],
        };
    },

    methods: {
        addRecord(item, isPreview) {
            this.$refs.workInjuryInsuranceAdd.show(item, isPreview);
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
            let res = await this.Post('/GetWorkInjuryInsurances', params);
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
            let res = await this.Get('/DeleteWorkInjuryInsurance', {workInjuryInsuranceId: item.WorkInjuryInsuranceId });
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
    .workinjury-insurance{
        /deep/ .el-input--small{
            width: 180px;
        }
    }
</style>
  
