<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content"> 
                <el-input placeholder="检查计划名称" clearable v-model="filters.InspectionPlanName"></el-input>
                <el-input placeholder="检查表" clearable v-model="filters.InspectionName"></el-input>
                <el-select placeholder="检查类型" clearable v-model="filters.InspectionNatureCode">
                    <el-option v-for="(item, index) in inspectionCycles" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-select placeholder="隐患状态" clearable v-model="filters.PotentialStatus">
                    <el-option value="0" label="无隐患"></el-option>
                    <el-option value="1" label="有隐患"></el-option>
                </el-select>
                <el-select placeholder="完成状态" clearable v-model="filters.IsComplete">
                    <el-option value="0" label="未完成"></el-option>
                    <el-option value="1" label="已完成"></el-option>
                </el-select>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button-group>
                    <el-button @click="downloadmbs(1510,15108, filters)">导出</el-button>
                </el-button-group>
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
                label="检查计划"
                align="center"
                min-width="180"
                prop="InspectionPlanName"
            >
            </el-table-column>
            <el-table-column
                label="检查表"
                align="center"
                prop="InspectionName"
                min-width="180"
            >
            </el-table-column>
            <el-table-column
                label="检查周期"
                align="center"
                width="180"
                prop="InspectionNatureName"
            >
            </el-table-column>
            <el-table-column
                label="检查人"
                align="center"
                width="140"
            >
                <template slot-scope="{ row }">
                    {{ row.InspectionRecordUsers.map(item => item.UserName).join('、') }}
                </template>
            </el-table-column>
            <el-table-column
                label="检查时间"
                align="center"
                width="150"
                prop="PlanInspectionDateDesc"
            >
            </el-table-column>
            <el-table-column
                label="检查项"
                align="center"
                width="100"
                prop="ItemContentCount"
            >
            </el-table-column>
            <el-table-column
                label="完成项"
                align="center"
                width="100"
                prop="CompleteCount"
            >
            </el-table-column>
            <el-table-column
                label="隐患数"
                align="center"
                width="100"
                prop="PotentialCount"
            >
            </el-table-column>
            <el-table-column
                label="状态"
                align="center"
                width="120"
            >
                <template slot-scope="{ row }">
                    <whether :yes="true" :text="row.IsComplete == 1 ? '已完成' : '未完成'"/>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="100"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="preview(row, true)">查看</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import Import_export from "@/mixins/Import_export.js";
import info from './info';
export default {
    components: {
        info
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
                IsSub: 1,
            },
            inspectionCycles: [],
        }
    },
    created() {
        this.getInspectionNatureCom();
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
                let res = await this.Post('/GetInspectionRecords', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        preview(item) {
            this.$refs.info.show(item)
        },
        async getInspectionNatureCom() {
            let res = await this.Get('/GetInspectionNatureCom');
            if (res.status == 2000) {
                this.inspectionCycles = res.data;
            };
        },
    }
}
</script>

<style>

</style>