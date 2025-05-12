<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select placeholder="检查周期" clearable v-model="filters.InspectionNatureCode">
                    <el-option v-for="(item, index) in inspectionCycles" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-input placeholder="检查计划名称" clearable v-model="filters.InspectionPlanName"></el-input>
                <el-input placeholder="检查表" clearable v-model="filters.InspectionName"></el-input>
                <el-input placeholder="创建人" clearable v-model="filters.CreateByName"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button-group style="margin-right: 10px;">
                    <el-button @click="downloadmbs(1510, 15107, filters)">导出</el-button>
                </el-button-group>
                <el-button type="primary" @click="add()">新增</el-button>
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
                label="检查计划名称"
                align="center"
                min-width="200"
                prop="InspectionPlanName"
            >
            </el-table-column>
            <el-table-column
                label="检查表"
                align="center"
                prop="InspectionName"
                min-width="200"
            >
            </el-table-column>
            <el-table-column
                label="检查类型"
                align="center"
                width="180"
                prop="InspectionNatureName"
            >
            </el-table-column>
            <el-table-column
                label="检查人"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="{ row }">
                    <template v-if="row.Enterprises.length">
                        <span v-for="(item, i) in row.Enterprises" :key="i">
                            <template v-if="item.EnterpriseUsers.length">
                                {{ item.EnterpriseUsers.map(user=>user.UserName ).join('、') }}
                            </template>
                        </span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                label="创建人"
                align="center"
                width="150"
                prop="CreateByName"
            >
            </el-table-column>
            <el-table-column
                label="创建日期"
                align="center"
                width="150"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="190"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="preview(row, true)">查看</el-button>
                        <el-button type="text" @click="record(row)">检查记录</el-button>
                        <el-button type="text" text-plain @click="cancel(row)">作废</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)" />
        <preview ref="preview" />
        <records ref="records" :isEnterprise="true" />
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './sub-info';
import preview from './sub-preview';
import records from '@/pages/inspectionRecords/plan-records'
import Import_export from "@/mixins/Import_export.js";
export default {
    components: {
        info,
        preview,
        records
    },
    mixins: [request_mixins, Import_export],
    data() {
        return {
            loading: false,
            inspectionCycles:[], 
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                IsSub: 1,
            }
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
                let res = await this.Post('/GetInspectionPlans', params);
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
        cancel(row) {
            this.$confirm('确认作废该条数据吗？').then((_) => {
                this.Get('/CancelInspectionPlan', {
                    inspectionPlanId: row.InspectionPlanId,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.getList();
                        this.$message({
                            message: '已作废！',
                            type: 'success',
                        });
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        async getInspectionNatureCom() {
            let res = await this.Get('/GetInspectionNatureCom');
            if (res.status == 2000) {
                this.inspectionCycles = res.data;
            };
        },
        record(row) {
            this.$refs.records.show(row);
        },
        preview(row) {
            this.$refs.preview.show(row);
        }
    }
}
</script>

<style>

</style>