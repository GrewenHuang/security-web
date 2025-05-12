<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content f--c">
                <select-enterpirse clearable placeholder="企业" multiple collapseTags v-model="filters.EnterpriseIds"></select-enterpirse>
                <el-date-picker
                    type="year"
                    placeholder="选择年"
                    align="center"
                    prefix-icon=""
                    :clearable="false"
                    :editable="false"
                    value-format="yyyy"
                    v-model="filters.year"
                >
                </el-date-picker>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div>
                <el-button type="primary" @click="downloadmbs(1610, 16116, filters)">导出</el-button>
            </div>
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
                label="企业名称"
                align="center"
                prop="EnterpriseName"
            >
            </el-table-column>
            <el-table-column
                label="年度计划投入金额（万元）"
                align="center"
                width="200"
                prop="InvestmentMoney"
            >
            </el-table-column>
            <el-table-column
                label="年度提取金额（万元）"
                align="center"
                width="200"
                prop="ExpenditureMoney"
            >
            </el-table-column>
            <el-table-column
                label="年度结余金额（万元）"
                align="center"
                width="200"
                prop="BalanceMoney"
            >
            </el-table-column>
        </el-table>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import Import_export from "@/mixins/Import_export.js";
import util from '@/common/util';
export default {
    components: {
    },
    mixins: [request_mixins, Import_export],
    data() {
        return {
            loading: false,
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                year: util.formatDate.format(new Date(), 'yyyy')
            }
        }
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
            this.loading = true;
            try {
                let res = await this.Post('/GetFundingPlanReportGroup', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        }
    }
}
</script>

<style>

</style>