<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16104, filters)">导出</el-button>
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
                label="全部车辆数"
                align="center"
                width="150"
                prop="VehicleCount"
            >
            </el-table-column>
            <el-table-column
                label="使用中车辆数"
                align="center"
                width="150"
                prop="Count1"
            >
            </el-table-column>
            <el-table-column
                label="已过户车辆数"
                align="center"
                width="150"
                prop="Count2"
            ></el-table-column>
            <el-table-column
                label="已报废车辆数"
                align="center"
                width="150"
                prop="Count3"
            ></el-table-column>
            <el-table-column
                label="已停运车辆数"
                align="center"
                width="150"
                prop="Count4"
            ></el-table-column>
            <el-table-column
                label="车辆证件预警数"
                align="center"
                width="150"
                prop="Count5"
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

            },
        }
    },
    async created() {
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
                let res = await this.Post('/GetVehicleReportGroup', params);
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
    /deep/ .el-select{
        margin-right: 5px;
        width: 180px;
    }
}
</style>