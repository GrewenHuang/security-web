<template>
    <page-layout class="page">
        <!--  :loading="loading" :pages="pages" @current-change="handlePageChange" -->
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16117, filters)">导出</el-button>
        </div>
        <div class="f-b-c operation">
            <div class="input-content f--c">
                
                <el-select clearable placeholder="证件类型" v-model="filters.CertificateType">
                    <el-option v-for="(item, index) in certTypes" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select clearable placeholder="证件模板" v-model="filters.CertificateClassification">
                    <el-option v-for="(item, index) in certTemplates" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
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
                label="信息类型"
                align="center"
                prop="CertificateTypeDesc"
            >
            </el-table-column>
            <el-table-column
                label="证件模板"
                align="center"
                prop="CertificateClassificationDesc"
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
            <el-table-column
                label="操作"
                align="center"
                prop="UserName"
            >
                <template slot-scope="{ row }">
                    <el-button type="text" @click="preview(row)">查看</el-button>
                </template>
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
            
            certTypes: [
                {
                    id: 1,
                    name: '企业',
                },
                {
                    id: 2,
                    name: '人员',
                },
                {
                    id: 3,
                    name: '车辆',
                },
                {
                    id: 4,
                    name: '设备',
                },
            ],
            certTemplates: [
                {
                    id: 1,
                    name: '证件'
                },
                {
                    id: 2,
                    name: '保险'
                },
                {
                    id: 3,
                    name: '其他'
                }
            ]
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
                let res = await this.Post('/GetCertificateReportList', params);
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
        preview(item) {
            let urls = {
                1: {
                    name: '企业证件',
                    url: '/cert/enterprise'
                },
                2: {
                    name: '人员证件',
                    url: '/cert/personnel'
                },
                3: {
                    name: '车辆证件',
                    url: '/cert/vehicle'
                },
                4: {
                    name: '设备证件',
                    url: '/cert/equipment'
                }
            }
            let obj = urls[item.CertificateType];
            this.$router.push({
                name: obj.name,
                params: {
                    active: item.CertificateClassification - 1
                }
            });
            this.$parent.$parent.$parent.$parent.$parent.selectmenu(obj.url);
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