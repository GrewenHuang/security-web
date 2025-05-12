<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16103, filters)" v-if="$_has('CLBBBtnExport')">导出</el-button>
        </div>
        <div class="f-b-c operation">
            <div class="input-content">
                <select-department clearable placeholder="部门" v-model="filters.department"></select-department>
                <el-select
                    placeholder="车辆类型"
                    v-model="filters.VehicleTypeId"
                    clearable
                >
                    <el-option v-for="(item, index) in vehicleTypes" :key="index" :value="item.VehicleTypeId" :label="item.VehicleTypeName"></el-option>
                </el-select>
                <ZYselect
                    url="GetCarStatus"
                    placeholder="车辆状态"
                    propid="id"
                    propname="text"
                    :val="filters.CarStatus"
                    v-model="filters.CarStatus"
                />
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
                label="车牌"
                align="center"
                width="140"
                prop="LicensePlateNumber"
            >
            </el-table-column>
            <el-table-column
                label="驾驶员"
                align="center"
                prop="DriverName"
            >
            </el-table-column>
            <el-table-column
                label="所属部门"
                align="center"
                width="180"
                prop="DepartmentName"
            >
            </el-table-column>
            <el-table-column
                label="车辆类型"
                align="center"
                width="140"
                prop="VehicleTypeName"
            ></el-table-column>
            <el-table-column
                label="车辆状态"
                align="center"
                width="120"
                prop="CarStatusDesc"
            ></el-table-column>
            <el-table-column
                label="证件数"
                align="center"
                width="100"
                prop="Count1"
            ></el-table-column>
            <el-table-column
                label="保险数"
                align="center"
                width="100"
                prop="Count2"
            ></el-table-column>
            <el-table-column
                label="证件预警数"
                align="center"
                width="110"
                prop="Count3"
            ></el-table-column>
            <el-table-column
                label="行车日志数"
                align="center"
                width="110"
                prop="Count4"
            ></el-table-column>
            <el-table-column
                label="车辆巡查数"
                align="center"
                width="110"
                prop="Count5"
            ></el-table-column>
            <el-table-column
                label="月度检查数"
                align="center"
                width="110"
                prop="Count6"
            ></el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="80"
                fixed="right"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="preview(row)"  v-if="$_has('CLBBBtnLook')">查看</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from '@/pages/Vehicle/vehicleInfo';
import ZYselect from "@/components/common/zy_select";
import Import_export from "@/mixins/Import_export.js";
export default {
    components: {
        info,
        ZYselect
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
            vehicleTypes: []
        }
    },
    async created() {
        
        let res = await this.Post('/GetVehicleTypes', {page: 1, rows: 999});
        if (res.status == 2000) {
            this.vehicleTypes = res.data.list;
        }
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
                let res = await this.Post('/GetVehicleReportList', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        async preview(item) {
            let res = await this.Get('/GetVehicle?id=' + item.VehicleId);
            this.$refs.info.show(res.data);
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
    display: flex;
    /deep/ .el-select{
        margin-right: 5px;
        width: 180px;
    }
}
</style>
