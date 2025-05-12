<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    placeholder="工程名称"
                    clearable
                    v-model="filters.ProjectName"
                ></el-input>
                <el-input
                    placeholder="编制人"
                    clearable
                    v-model="filters.TechnicalUserName"
                ></el-input>
                <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="编制时间"
                    clearable
                    v-model="filters.TechnicalDate"
                ></el-date-picker>
                <el-input
                    placeholder="下发人"
                    clearable
                    v-model="filters.CreateByName"
                ></el-input>
                <el-date-picker
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="下发时间"
                    clearable
                    v-model="filters.CreateTime"
                ></el-date-picker>
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
                label="工程名称"
                align="center"
                prop="ProjectName"
            >
            </el-table-column>
            <el-table-column
                label="编制人"
                align="center"
                width="140"
                prop="TechnicalUserName"
            >
            </el-table-column>
            <el-table-column
                label="编制时间"
                align="center"
                width="240"
                prop="TechnicalDateDesc"
            >
            </el-table-column>
            <el-table-column
                label="下发人"
                align="center"
                width="140"
                prop="CreateByName"
            >
            </el-table-column>
            <el-table-column
                label="下发时间"
                align="center"
                width="240"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="show(row, true)">查看</el-button>
                        <el-button type="text" text-plain @click="remove(row, true)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
        <preview ref="preview" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
import preview from './preview';
export default {
    components: {
        info,
        preview
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
                let res = await this.Post('/GetTechnicals', params);
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
        show(item) {
            this.$refs.preview.show(item)
        },
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post('/DeleteTechnical', {
                    Ids: [row.TechnicalId],
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
        }
    }
}
</script>

<style>

</style>
