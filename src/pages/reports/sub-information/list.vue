<template>
    <page-layout class="page" :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16118, filters)">导出</el-button>
        </div>
        <div class="f-b-c operation">
            <div class="input-content f--c">
                <select-enterpirse clearable placeholder="企业" multiple collapseTags v-model="filters.EnterpriseIds"></select-enterpirse>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
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
                label="到期提醒数"
                align="center"
                prop="ReminderCount"
            >
            </el-table-column>
            <el-table-column
                label="正常数"
                align="center"
                prop="NormalCount"
            >
            </el-table-column>
            <el-table-column
                label="预过期数"
                align="center"
                prop="PreExpirationCount"
            >
            </el-table-column>
            <el-table-column
                label="已过期数"
                align="center"
                prop="ExpiredCount"
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
        return {
            loading: false,
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
            },
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
                let res = await this.Post('/GetCertificateReportGroup', params);
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
        margin-right: 5px;
        width: 180px;
    }
}
.page{
    /deep/ .el-table__header-wrapper .el-table__cell{
        border-bottom: 1px solid #EBEEF5 !important;
    }
}
</style>