<template>
    <page-layout :loading="loading">
        <!--  :pages="pages" @current-change="handlePageChange" -->
        <!-- <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16107, filters)"  v-if="$_has('FXBBBtnExport')">导出</el-button>
        </div> -->
        <div class="f-b-c operation">
            <div class="input-content f--c">
                <custom-date-range style="width:360px;margin-right: 5px;" :hasIsLong="false" v-model="filters.date"/>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
			 <el-button type="primary" @click="downloadmbs(1610, 16107, filters)"  v-if="$_has('FXBBBtnExport')">导出</el-button>
        </div>
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
                width="50"
            >
            </el-table-column>
            <el-table-column
                label="风险类型"
                align="center"
                prop="TypeName"
            >
            </el-table-column>
            <el-table-column
                label="风险总数"
                align="center"
                width="120"
                prop="RiskCount"
            >
            </el-table-column>
            <el-table-column
                label="低风险数"
                align="center"
                width="120"
                prop="LowRiskCount"
            >
            </el-table-column>
            <el-table-column
                label="一般风险数"
                align="center"
                width="120"
                prop="GeneralRiskCount"
            >
            </el-table-column>
            <el-table-column
                label="较大风险数"
                align="center"
                width="120"
                prop="GreaterRiskCount"
            >
            </el-table-column>
            <el-table-column
                label="重大风险数"
                align="center"
                width="120"
                prop="WeightyRiskCount"
            >
            </el-table-column>
            <el-table-column
                label="巡查数"
                align="center"
                width="120"
                prop="InspectionCount"
            >
            </el-table-column>
            <el-table-column
                label="未巡查数"
                align="center"
                width="120"
                prop="NoInspectionCount"
            >
            </el-table-column>
            <el-table-column
                label="巡查完成率"
                align="center"
                width="120"
                prop="InspectionRate"
                :formatter="rateFormat"
            >
            </el-table-column>
            <el-table-column
                label="异常数"
                align="center"
                width="120"
                prop="AbnormalCount"
            >
            </el-table-column>
            <el-table-column
                label="异常率"
                align="center"
                width="120"
                prop="AbnormalRate"
                :formatter="rateFormat"
            >
            </el-table-column>
        </el-table>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import Import_export from "@/mixins/Import_export.js";
export default {
    components: {
    },
    mixins: [request_mixins, Import_export],
    data() {
        let currentYear = new Date().getFullYear() + '/01/01';
        return {
            loading: false,
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                date: currentYear + ',,',
            }
        }
    },
    watch: {
        'filters.date': {
            immediate: true,
            handler() {
                let params = this.filters;
                let date = params.date.split(',');
                params.StartTime = date[0];
                params.EndTime = date[1];
            }
        },
    },
    created() {
        this.handlePageChange(1);
    },
    methods: {
        handlePageChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters,
            }
            let date = params.date.split(',');
            params.StartTime = date[0];
            params.EndTime = date[1];
            this.loading = true;
            try {
                let res = await this.Post('/GetRiskReportList', params);
                if (res.status === 2000) {
                    // this.list = res.data.list;
                    this.list = res.data;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        rateFormat(row, column, cellValue, index) {
            return cellValue + '%';
        }
    }
}
</script>

<style lang="scss" scoped>

.custom-operation{
    position: absolute;
    top: -6.25%;
    right: 0;
}
.operation{
    padding: 0 0 20px;;
}
.input-content{
    [class^=el]:not(.el-button){
        width: 180px;
        margin-right: 5px;
    }
}
</style>
