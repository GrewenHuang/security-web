<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
       <!-- <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16114, filters)"  v-if="$_has('SBSSBBBtnExport')">导出</el-button>
        </div> -->
        <div class="f-b-c operation">
            <div class="input-content f--c">
                <el-select placeholder="设备类型" clearable v-model="filters.EquipmentTypeName">
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item" :value="item"></el-option>
                </el-select>
                <el-input placeholder="设备名称" clearable v-model="filters.EquipmentName"></el-input>
                <el-input placeholder="自编号" clearable v-model="filters.OwnCode"></el-input>
                <el-select placeholder="状态" clearable v-model="filters.SupplyStatus">
                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
			 <el-button type="primary" @click="downloadmbs(1610, 16114, filters)"  v-if="$_has('SBSSBBBtnExport')">导出</el-button>
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
                label="设备类型"
                align="center"
                prop="EquipmentTypeName"
                width="120"
            >
            </el-table-column>
            <el-table-column
                label="设备名称"
                align="center"
                prop="EquipmentName"
            >
            </el-table-column>
            <el-table-column
                label="自编号"
                align="center"
                width="140"
                prop="OwnCode"
            >
            </el-table-column>
            <el-table-column
                label="保养计划数"
                align="center"
                width="150"
                prop="MaintenancePlanCount"
            >
            </el-table-column>
            <el-table-column
                label="点检计划数"
                align="center"
                width="100"
                prop="SpotCheckPlanCount"
            >
            </el-table-column>
            <el-table-column
                label="保养记录数"
                align="center"
                width="140"
                prop="MaintenanceRecordCount"
            >
            </el-table-column>
            <el-table-column
                label="点检记录数"
                align="center"
                width="100"
                prop="SpotCheckRecordCount"
            >
            </el-table-column>
            <!-- <el-table-column
                label="检验记录数"
                align="center"
                width="100"
                prop="InspectRecordCount"
            >
            </el-table-column> -->
            <el-table-column
                label="维修记录数"
                align="center"
                width="100"
                prop="RepairRecordCount"
            >
            </el-table-column>
            <el-table-column
                label="状态"
                align="center"
                width="100"
                prop="SupplyStatusDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="100"
            >
                <template slot-scope="{ row }">
                    <el-button type="text" @click="preview(row)" v-if="$_has('SBSSBBBtnLook')">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <preview ref="preview"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import preview from './preview';
import Import_export from "@/mixins/Import_export.js";
export default {
    components: {
        preview
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
            typeList: [],
            statusList: [],
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
        this.getEquipmentTypeList();
        this.getStatusList();
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
                let res = await this.Post('/GetEquipmentManageReportList', params);
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
        },
        preview(item) {
            this.$refs.preview.show(item);
        },
        async getEquipmentTypeList() {
            let res = await this.Get('/GetEquipmentTypeList?equipmentTypeName=');
            if (res.status) {
                this.typeList = res.data;
            }
        },
        async getStatusList() {
            let res = await this.Get('/GetSupplyStatusCom');
            if (res.status) {
                this.statusList = res.data;
            }
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