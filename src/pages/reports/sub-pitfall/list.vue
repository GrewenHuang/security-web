<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16111, filters)">导出</el-button>
        </div>
        <div class="f-b-c operation">
            <div class="input-content f--c">
                <select-enterpirse clearable placeholder="企业" multiple collapseTags v-model="filters.EnterpriseIds"></select-enterpirse>
                <el-select
                    v-model="filters.Source"
                    placeholder="请选择隐患来源"
                    clearable
                >
                    <el-option
                        v-for="item in SourceCom"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
                <custom-date-range style="width:360px;margin-right: 5px;" :hasIsLong="false" v-model="filters.date"/>
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
                label="隐患数"
                align="center"
                width="140"
                prop="PotentialCount"
            >
            </el-table-column>
            <el-table-column
                label="一般隐患数"
                align="center"
                width="140"
                prop="GeneralPotentialCount"
            >
            </el-table-column>
            <el-table-column
                label="重大隐患数"
                align="center"
                width="150"
                prop="MajorPotentialCount"
            >
            </el-table-column>
            <el-table-column
                label="已整改"
                align="center"
                width="100"
                prop="RectifiedCount"
            >
            </el-table-column>
            <el-table-column
                label="超期未整改"
                align="center"
                width="140"
                prop="OverdueRectifiedCount"
            >
            </el-table-column>
            <el-table-column
                label="整改中"
                align="center"
                width="100"
                prop="UnRectifiedCount"
            >
            </el-table-column>
            <el-table-column
                label="整改率"
                align="center"
                width="100"
                prop="RectifiedRate"
                :formatter="rateFormat"
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
            },
            SourceCom: []
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
        let url = util.getLoginUrl() == '/rb-login' ? 'GetRoadPotentialSourceCom' : 'GetPotentialSourceCom'
        //获取隐患排查性质
        this.Get(url).then((res) => {
            if (res.status === 2000) {
                this.SourceCom = res.data;
            }
        });
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
                let res = await this.Post('/GetPotentialReportGroup', params);
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
        width: 180px;
        margin-right: 5px;
    }
}
</style>