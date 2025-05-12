<template>
    <page-layout class="page" :loading="loading" :pages="pages" @current-change="handlePageChange">
        
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16106, filters)">导出</el-button>
        </div>
        <div class="f-b-c operation">
            <div class="input-content f--c">
                <select-enterpirse clearable placeholder="企业" multiple collapseTags v-model="filters.EnterpriseIds"></select-enterpirse>
                <custom-date-range style="width: 360px;margin-right: 5px;" :hasIsLong="false" v-model="filters.date"/>
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
                label="班前会"
                align="center"
            >
                <el-table-column
                    label="召开数"
                    align="center"
                    width="120"
                    prop="ConveneCount1"
                ></el-table-column>
                <el-table-column
                    label="完成数"
                    align="center"
                    width="120"
                    prop="RealityCount1"
                ></el-table-column>
                <el-table-column
                    label="完成率"
                    align="center"
                    width="120"
                    prop="Rate1"
                    :formatter="rateFormat"
                ></el-table-column>
            </el-table-column>
            <el-table-column
                label="安全例会"
                align="center"
            >
                <el-table-column
                    label="召开数"
                    align="center"
                    width="120"
                    prop="ConveneCount2"
                ></el-table-column>
                <el-table-column
                    label="完成数"
                    align="center"
                    width="120"
                    prop="RealityCount2"
                ></el-table-column>
                <el-table-column
                    label="完成率"
                    align="center"
                    width="120"
                    prop="Rate2"
                    :formatter="rateFormat"
                ></el-table-column>
            </el-table-column>
            <el-table-column
                label="安全生产领导小组会议"
                align="center"
            >
                <el-table-column
                    label="召开数"
                    align="center"
                    width="120"
                    prop="ConveneCount3"
                ></el-table-column>
                <el-table-column
                    label="完成数"
                    align="center"
                    width="120"
                    prop="RealityCount3"
                ></el-table-column>
                <el-table-column
                    label="完成率"
                    align="center"
                    width="120"
                    prop="Rate3"
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
            let date = params.date.split(',');
            params.StartTime = date[0];
            params.EndTime = date[1];
            this.loading = true;
            try {
                let res = await this.Post('/GetMeetingReportGroup', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item) {
            this.$refs.info.show(item)
        },
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Get('/DeleteEmergencyExpert', {
                    emergencyExpertId: row.ExpertId,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.getList();
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                        });
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
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
