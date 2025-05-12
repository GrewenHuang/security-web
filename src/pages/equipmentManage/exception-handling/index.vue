<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select placeholder="来源" clearable v-model="filters.Source">
                    <el-option label="保养异常" value="1"></el-option>
                    <el-option label="点检异常" value="2"></el-option>
                </el-select>
                <el-input
                    placeholder="维修负责人"
                    clearable
                    v-model="filters.MaintenanceUserName"
                ></el-input>
                <el-select placeholder="处理状态" clearable v-model="filters.Status">
                    <el-option label="未处理" value="0"></el-option>
                    <el-option label="已处理" value="1"></el-option>
                </el-select>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
                <el-popover
                    width="400"
                    trigger="hover">
                        <div>
                            <custom-date-range
                                style="width: 360px;"
                                startDatePlaceholder="完成开始日期"
                                endDatePlaceholder="完成结束日期"
                                :hasIsLong="false"
                                v-model="filters.date"
                            ></custom-date-range>
                            <el-select placeholder="设备类型" clearable v-model="filters.EquipmentTypeName">
                                <el-option v-for="(item, index) in typeList" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                            <el-input
                                placeholder="设备名称/自编号/安装位置"
                                clearable
                                v-model="filters.Query"
                            ></el-input>
                        </div>
                    <el-button slot="reference" type="text">更多筛选</el-button>
                </el-popover>
            </div>
            <div class="f--c">
                <el-button @click="downloadmbs(1310, 13106, filters)">导出</el-button>
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
                label="来源"
                align="center"
                width="140"
            >
                <template slot-scope="{ row }">
                    {{ row.Source == 1 ? '异常' : '点检' }}异常
                </template>
            </el-table-column>
            <el-table-column
                label="自编号"
                align="center"
                width="140"
                prop="OwnCode"
                :formatter="formatterDefaultValue"
            >
            </el-table-column>
            <el-table-column
                label="设备类型"
                align="center"
                width="140"
                prop="EquipmentTypeName"
            >
            </el-table-column>
            <el-table-column
                label="设备名称"
                align="center"
                min-width="200"
                show-overflow-tooltip
                prop="EquipmentName"
            >
            </el-table-column>
            <el-table-column
                label="设备型号"
                align="center"
                width="140"
                prop="Specification"
                :formatter="formatterDefaultValue"
            >
            </el-table-column>
            <el-table-column
                label="异常情况描述"
                align="center"
                min-width="240"
                prop="Abnormal"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="维修内容及处理结果"
                align="center"
                width="140"
                prop="Remark"
                :formatter="formatterDefaultValue"
            >
            </el-table-column>
            <el-table-column
                label="维修完成日期"
                align="center"
                min-width="200"
                show-overflow-tooltip
                prop="RepairDateDesc"
                :formatter="formatterDefaultValue"
            >
            </el-table-column>
            <el-table-column
                label="处理状态"
                align="center"
                width="100"
                fixed="right"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.Status == 1" :text="statusObj[row.Status]"/>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="80"
                fixed="right"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <!-- 查看需要根据保养状态显示，已保养才有查看 -->
                        <el-button type="text" @click="add(row, true)" v-if="row.Status == 1">查看</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";
import info from './info';
export default {
    components: {
        info
    },
    mixins: [request_mixins, Download, Import_export],
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
                date: '',
            },
            typeList: [],
            statusObj: {
                0: '未处理',
                1: '已处理',
            }
        }
    },
    created() {
        this.getEquipmentTypeList();
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
            params.StartDate = date[0] || '';
            params.EndDate = date[1] || '';
            this.loading = true;
            try {
                let res = await this.Post('/GetAbnormalRecordList', params);
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
        async getEquipmentTypeList() {
            let res = await this.Get('/GetEquipmentTypeList?equipmentTypeName=');
            if (res.status) {
                this.typeList = res.data;
            }
        },
        formatterDefaultValue(row, column, cellValue, index) {
            return cellValue || '-'
        },
    }
}
</script>

<style lang="scss">
.el-popover{
    .el-input,
    .el-select{
        margin-bottom: 10px;
        width: 180px;
    }
}
</style>