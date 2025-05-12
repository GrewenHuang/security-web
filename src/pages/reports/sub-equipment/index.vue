<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content f--c">
                <select-enterpirse clearable placeholder="企业" multiple collapseTags v-model="filters.EnterpriseIds"></select-enterpirse>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div>
                <el-button  @click="downloadmbs(1610, 16115, filters)">导出</el-button>
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
                label="设备数"
                align="center"
                width="140"
                prop="EquipmentCount"
            >
            </el-table-column>
            <el-table-column
                label="特种设备数"
                align="center"
                width="150"
                prop="SpecialEquipmentCount"
            >
            </el-table-column>
            <el-table-column
                label="保养逾期未完成数"
                align="center"
                width="150"
                prop="OverdueMaintenanceCount"
            >
            </el-table-column>
            <el-table-column
                label="点检未按时完成数"
                align="center"
                width="150"
                prop="OverdueSpotCheckCount"
            >
            </el-table-column>
            <el-table-column
                label="检验不合格数"
                align="center"
                width="150"
                prop="InspectNoPassCount"
            >
            </el-table-column>
            <el-table-column
                label="异常数"
                align="center"
                width="150"
                prop="AbnormalCount"
            >
            </el-table-column>
            <el-table-column
                label="异常未处理数"
                align="center"
                width="150"
                prop="AbnormalNoHandleCount"
            >
            </el-table-column>
        </el-table>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import Import_export from "@/mixins/Import_export.js";
export default {
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
                let res = await this.Post('/GetEquipmentManageReportGroup', params);
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