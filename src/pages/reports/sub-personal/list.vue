<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16102, filters)">导出</el-button>
        </div>
        <div class="f-b-c operation">
            <div class="input-content">
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
                label="人数"
                align="center"
                prop="Count"
                width="100"
            >
            </el-table-column>
            <el-table-column
                label="未签订劳动合同人数"
                align="center"
                width="160"
                prop="NoLaborContract"
            ></el-table-column>
            <el-table-column
                label="未签订承诺书人数"
                align="center"
                width="140"
                prop="NoSafetyCommitment"
            ></el-table-column>
            <el-table-column
                label="未签订责任书人数"
                align="center"
                width="140"
                prop="NoLetter"
            ></el-table-column>
            <el-table-column
                label="未上传体检证明人数"
                align="center"
                width="160"
                prop="NoMedicalCertificate"
            ></el-table-column>
            <el-table-column
                label="未完成岗前培训人数"
                align="center"
                width="160"
                prop="NoPreTrain"
            ></el-table-column>
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
                let res = await this.Post('/GetUserReportGroup', params);
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
        width: 180px;
    }
}
</style>
