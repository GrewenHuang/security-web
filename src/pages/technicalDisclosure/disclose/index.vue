<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="交底名称" clearable v-model="filters.name"></el-input>
                <el-select placeholder="交底类型" clearable v-model="filters.type">
                    <el-option v-for="(item, index) in 3" :key="index" :label="index" :value="index"></el-option>
                </el-select>
                <el-input placeholder="交底人" clearable v-model="filters.user"></el-input>
                <el-date-picker
                    type="date"
                    placeholder="交底日期"
                    v-model="filters.date"
                ></el-date-picker>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" @click="add()">新增</el-button>
                <el-button type="primary" @click="$refs.completion.show()">完成情况</el-button>
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
                label="交底类型"
                align="center"
                width="200"
            >
            </el-table-column>
            <el-table-column
                label="交底名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="交底人"
                align="center"
                width="180"
            >
            </el-table-column>
            <el-table-column
                label="交底日期"
                align="center"
                width="150"
            >
            </el-table-column>
            <el-table-column
                label="交底人数/完成人数"
                align="center"
                width="300"
            >
                <template slot-scope="{ row }">
                    12/5
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <div class="table-operation">
                    <el-button type="text">查看</el-button>
                    <el-button type="text">编辑</el-button>
                </div>
            </el-table-column>
        </el-table>
        <info ref="info" @success="handlePageChange(1)"/>
        <completion ref="completion" @success="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
import completion from './completion';
export default {
    name: 'disclose-list',
    components: {
        info,
        completion
    },
    mixins: [request_mixins],
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
                let res = await this.Post('/api', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item) {
            this.$refs.info.show(item)
        }
    }
}
</script>

<style>

</style>