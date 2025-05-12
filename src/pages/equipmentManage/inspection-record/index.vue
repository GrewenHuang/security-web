<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    placeholder="设备名称"
                    clearable
                    v-model="filters.EquipmentName"
                ></el-input>
                <el-select placeholder="检验状态" clearable v-model="filters.Result">
                    <el-option value="0" label="不合格"></el-option>
                    <el-option value="1" label="合格"></el-option>
                </el-select>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
                <el-popover
                    width="400"
                    trigger="click">
                        <div>
                            <el-input
                                placeholder="出厂编号"
                                clearable
                                v-model="filters.FactoryNo"
                            ></el-input>
                            <el-input
                                placeholder="自编号"
                                clearable
                                v-model="filters.OwnCode"
                            ></el-input>
                            <el-input
                                placeholder="负责人"
                                clearable
                                v-model="filters.ResponsibleUserName"
                            ></el-input>
                        </div>
                    <el-button slot="reference" type="text">更多筛选</el-button>
                </el-popover>
            </div>
            <div class="f--c">
                <el-button @click="downloadmbs(1310, 13104, filters)">导出</el-button>
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
                label="设备名称"
                align="center"
                min-width="200"
                show-overflow-tooltip
                prop="EquipmentName"
            >
            </el-table-column>
            <el-table-column
                label="规格型号"
                align="center"
                width="140"
                prop="Specification"
                :formatter="formatterDefaultValue"
            >
            </el-table-column>
            <el-table-column
                label="出厂编号"
                align="center"
                width="140"
                prop="FactoryNo"
                :formatter="formatterDefaultValue"
            >
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
                label="使用位置"
                align="center"
                width="100"
                prop="UseLocation"
                :formatter="formatterDefaultValue"
            >
            </el-table-column>
            <!-- <el-table-column
                label="使用部门"
                align="center"
                width="140"
                prop="DepartmentName"
                :formatter="formatterDefaultValue"
            >
            </el-table-column> -->
            <el-table-column
                label="负责人"
                align="center"
                width="130"
                prop="ResponsibleUserName"
                :formatter="formatterDefaultValue"
            >
            </el-table-column>
            <el-table-column
                label="最近检验日期"
                align="center"
                width="120"
                prop="InspectDateDesc"
                :formatter="formatterDefaultValue"
            >
            </el-table-column>
            <el-table-column
                label="最近检验结论"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.Result == 1" :text="row.Result == 1 ? '合格' : '不合格'"/>
                </template>
            </el-table-column>
            <el-table-column
                label="下次检验日期"
                align="center"
                width="120"
                prop="NextInspectDateDesc"
                :formatter="formatterDefaultValue"
            >
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
                        <el-button type="text" @click="add(row, true)">查看</el-button>
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
            statusObj: {
                0: '未完成',
                1: '已完成',
                2: '逾期未完成',
                3: '逾期已完成',
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
            let date = params.date.split(',');
            params.StartDate = date[0] || '';
            params.EndDate = date[1] || '';
            this.loading = true;
            try {
                let res = await this.Post('/GetInspectRecordList', params);
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