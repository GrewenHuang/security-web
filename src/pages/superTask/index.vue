<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="任务名称" v-model="filters.TaskName" clearable style="width: 360px;"></el-input>
                <el-select placeholder="任务类型" v-model="filters.TaskType" clearable>
                    <el-option v-for="(item, index) in taskTypes" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-date-picker placeholder="下发日期" v-model="filters.CreateTime" value-format="yyyy-MM-dd"></el-date-picker>
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
                label="任务类型"
                align="center"
                width="200"
                prop="TaskTypeDesc"
            >
            </el-table-column>
            <el-table-column
                label="任务名称"
                align="center"
                prop="TaskName"
            >
            </el-table-column>
            <el-table-column
                label="下发人"
                align="center"
                width="180"
                prop="CreateName"
            >
            </el-table-column>
            <el-table-column
                label="下发日期"
                align="center"
                width="150"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="状态"
                align="center"
                width="120"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.IsExecuted == 1" :text="row.IsExecuted == 1 ? '已执行' : '未执行'"/>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200"
            >
                <template slot-scope="{ row }">
                    <!-- 日常任务可以执行多次 -->
                    <div class="table-operation" v-if="row.IsExecuted == 0 || row.TaskType == 4">
                        <el-button type="text" @click="execute(row)">执行</el-button>
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
import { mapState } from 'vuex';
export default {
    name: 'super-task-distribution',
    components: {
        info,
    },
    mixins: [request_mixins],
    computed: {
        ...mapState(['taskTypes'])
    },
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
                TaskName: '', // 任务名称
                TaskType: '', // 任务类型
                CreateTime: '', // 下发日期
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
            this.loading = true;
            try {
                let res = await this.Post('/GetTaskAssignmentsByEnterprise', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        execute(item) {
            this.$refs.info.show(item)
        },
    }
}
</script>

<style>

</style>