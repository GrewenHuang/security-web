<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="下发公司" v-model="filters.EnterpriseName" clearable></el-input>
                <el-input placeholder="下发人" v-model="filters.CreateName" clearable></el-input>
                <el-input placeholder="任务名称" v-model="filters.TaskName" clearable></el-input>
                <el-select placeholder="任务类型" v-model="filters.TaskType" clearable>
                    <el-option v-for="(item, index) in taskTypes" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-date-picker placeholder="下发日期" v-model="filters.CreateTime" value-format="yyyy-MM-dd"></el-date-picker>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" v-has="'task-issued'" @click="add()">下发任务</el-button>
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
                label="下发公司"
                align="center"
                width="180"
                prop="EnterpriseName"
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
                label="下发日期"
                align="center"
                width="150"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="300"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row)">查看</el-button>
                        <el-button type="text" @click="execute(row, 1)" v-if="row.IsExecuted != 1">执行</el-button>
                        <el-button type="text" @click="execute(row, 2)" v-has="'task-forward'" v-if="row.IsRelay != 1">转发</el-button>
                        <el-button type="text" @click="showTable(row)">完成情况</el-button>
                        <el-popconfirm
                            title="确认删除该任务吗？"
                            @confirm="remove(row)"
                        >
                            <el-button type="text" slot="reference" plain-text >删除</el-button>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
        <safeMeetingTable ref="safeMeetingTable" />
        <trainTable ref="trainTable" />
        <dailyTasksTable ref="dailyTasksTable" />
        <pitfallTable ref="pitfallTable" />
        <execute ref="execute"  @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
import execute from './execute.vue';
import {
    dailyTasksTable,
    pitfallTable,
    safeMeetingTable,
    trainTable
} from './issued';
import { mapState } from 'vuex';
export default {
    name: 'task-distribution',
    components: {
        info,
        safeMeetingTable,
        trainTable,
        dailyTasksTable,
        pitfallTable,
        execute,
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
                let res = await this.Post('/GetTaskAssignments', params);
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
        showTable(item) {
            let tableList = ['', 'trainTable', 'safeMeetingTable', 'pitfallTable', 'dailyTasksTable'];
            if (this.$refs[tableList[item.TaskType]]) {
                this.$refs[tableList[item.TaskType]].show(item);
            }
        },
        execute(item, executeType) {
            // executeType 1 执行，2 转发
            this.$refs.execute.show(item, executeType);
        },
        async remove(item) {
            try {
                let res = await this.Post('/DeleteTaskAssignment', {Ids: [item.TaskAssignmentId]});
                if (res.status == 2000) {
                    this.$message.success('删除成功');
                    this.handlePageChange(1)
                } else {
                    this.$message.error(res.message)
                }
            } catch (error) {
                this.$message('删除失败，请稍后重试');
                console.error(error);
            }
        }
    }
}
</script>

<style>

</style>