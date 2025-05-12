<template>
    <page-layout class="page" :loading="loading" :pages="pages" @current-change="handlePageChange">
        
      <!--  <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16112, filters)"  v-if="$_has('PXBBBtnExport')">导出</el-button>
        </div> -->
        <div class="f-b-c operation">
            <div class="input-content f--c">
                <el-input placeholder="姓名" clearable v-model="filters.UserName"></el-input>
                <select-department clearable placeholder="部门" multiple v-model="filters.DepartmentIds"></select-department>
                <select-position clearable placeholder="岗位" multiple v-model="filters.PositionIds"></select-position>
                <custom-date-range style="width:360px;margin-right: 5px;" :hasIsLong="false" v-model="filters.date"/>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
			<el-button type="primary" @click="downloadmbs(1610, 16112, filters)"  v-if="$_has('PXBBBtnExport')">导出</el-button>
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
                label="姓名"
                align="center"
                width="180"
                prop="UserName"
            >
            </el-table-column>
            <el-table-column label="部门" align="center" show-overflow-tooltip>
                <template slot-scope="{ row }">
                    {{ row.DepartmentList.map(item => item.DepartmentName).join('、') }}
                </template>
            </el-table-column>
            <el-table-column label="岗位" align="center" show-overflow-tooltip>
                <template slot-scope="{ row }">
                    {{ row.PositionList.map(item => item.PositionName).join('、') }}
                </template>
            </el-table-column>
            <el-table-column
                label="岗前培训"
                align="center"
            >
                <el-table-column
                    label="培训数"
                    align="center"
                    width="120"
                    prop="PreCount"
                ></el-table-column>
                <el-table-column
                    label="完成数"
                    align="center"
                    width="120"
                    prop="PreCompleteCount"
                ></el-table-column>
                <el-table-column
                    label="完成率"
                    align="center"
                    width="120"
                    prop="PreRate"
                    :formatter="rateFormat"
                ></el-table-column>
            </el-table-column>
            <el-table-column
                label="再教育培训"
                align="center"
            >
                <el-table-column
                    label="培训数"
                    align="center"
                    width="120"
                    prop="ReeducationCount"
                ></el-table-column>
                <el-table-column
                    label="完成数"
                    align="center"
                    width="120"
                    prop="ReeducationCompleteCount"
                ></el-table-column>
                <el-table-column
                    label="完成率"
                    align="center"
                    width="120"
                    prop="ReeducationRate"
                    :formatter="rateFormat"
                ></el-table-column>
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
            this.loading = true;
            try {
                let res = await this.Post('/GetTrainTaskReportList', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
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