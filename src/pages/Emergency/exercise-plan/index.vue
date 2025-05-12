<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select
                    placeholder="预案类型"
                    v-model="filters.ReservePlanTypeCode"
                    clearable
                >
                    <el-option
                        v-for="(item, i) in typeList"
                        :key="i"
                        :value="item.id"
                        :label="item.text"
                    ></el-option>
                </el-select>
                <el-input placeholder="计划名称" clearable v-model="filters.PlanName"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
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
                label="计划名称"
                align="center"
                min-width="200"
                show-overflow-tooltip
                prop="PlanName"
            >
            </el-table-column>
            <el-table-column
                label="参演对象"
                align="center"
                width="140"
                prop="Object"
            >
            </el-table-column>
            <el-table-column
                label="演练时间"
                align="center"
                width="120"
                prop="DrillDateDesc"
            >
            </el-table-column>
            <el-table-column
                label="预案类型"
                align="center"
                width="150"
                prop="ReservePlanTypeName"
            >
            </el-table-column>
            <el-table-column
                label="演练项目"
                align="center"
                width="150"
                prop="ItemName"
            >
            </el-table-column>
            <el-table-column
                label="演练方式"
                align="center"
                width="150"
                prop="Method"
            >
            </el-table-column>
            <el-table-column
                label="组织人员"
                align="center"
                width="150"
                prop="Personnel"
            >
            </el-table-column>
            <el-table-column
                label="负责人"
                align="center"
                width="150"
                prop="ResponsibleUserName"
            >
            </el-table-column>
            <el-table-column
                label="负责部门"
                align="center"
                width="150"
                prop="DepartmentName"
            >
            </el-table-column>
            <el-table-column
                label="完成情况"
                align="center"
                width="150"
                prop="Object"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.Status == 1" :text="row.Status == 1 ? '已演练' : '未演练'"/>
                </template>
            </el-table-column>
            <el-table-column
                label="附件"
                align="center"
                width="150"
                prop="Object"
            >
                <template slot-scope="{ row }">
                    <el-button v-if="row.EmergencyDrillPlanFiles.length" @click="$openFile(row.EmergencyDrillPlanFiles[0].url)">查看</el-button>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row, true)" v-if="row.Status == 1">查看</el-button>
                        <template v-else>
                            <el-button type="text" @click="add(row)">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)">删除</el-button>
                        </template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
export default {
    name: 'task-distribution',
    components: {
        info
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            list: [],
            typeList: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {

            }
        }
    },
    created() {
        this.getTypeList();
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
                let res = await this.Post('/GetEmergencyDrillPlans', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item, isPreview) {
            this.$refs.info.show(item, isPreview)
        },
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post('/DeleteEmergencyDrillPlan', {
                    Ids: [row.EmergencyDrillPlanId],
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
        async getTypeList() {
            let res = await this.Get("/GetReservePlanTypeCom");
            if (res.status == 2000) {
                this.typeList = res.data;
            }
        }
    }
}
</script>

<style>

</style>