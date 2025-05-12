<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    placeholder="危大工程名称"
                    clearable
                    v-model="filters.Name"
                ></el-input>
                <el-select
                    placeholder="类别"
                    clearable
                    v-model="filters.DangerousEngineeringCategory"
                >
                    <el-option v-for="(item, index) in types" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
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
                label="危大工程名称"
                align="center"
                prop="Name"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="类别"
                align="center"
                width="220"
            >
                <template slot-scope="{ row }">
                    {{ getCategoryName(row.DangerousEngineeringCategory) }}
                </template>
            </el-table-column>
            <el-table-column
                label="工程类型"
                align="center"
                width="180"
            >
                <template slot-scope="{ row }">
                    {{ getTypeName(row.DangerousEngineeringType) }}
                </template>
            </el-table-column>
            <el-table-column
                label="计划开工日期"
                align="center"
                width="150"
                prop="PlanStartDateDesc"
            >
            </el-table-column>
            <el-table-column
                label="计划完工日期"
                align="center"
                width="150"
                prop="PlanEndDateDesc"
            >
            </el-table-column>
            <el-table-column
                label="签字状态"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.IsComplete == 1" :text="row.IsComplete == 1 ? '已完成' : '未完成'"/>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="240"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row)" v-if="row.IsRelease == 0">编辑</el-button>
                        <el-button type="text" @click="add(row, true)" v-else>查看</el-button>
                        <el-button type="text" @click="release(row)" v-if="row.IsRelease == 0">下发</el-button>
                        <el-button type="text" text-plain @click="remove(row)" v-if="row.IsRelease == 0">删除</el-button>
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
    components: {
        info
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

            },
            categorys: [{id: 1, text: '一般危大工程'}, {id: 2, text: '重大伟大工程'}],
            types: [{id: 1, text: '分部工程'}, {id: 2, text: '分项工程'}],
            status: [{id: 1, text: '已开工'}, {id: 0, text: '未开工'}]
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
                let res = await this.Post('/GetDangerousEngineerings', params);
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
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post('/DeleteDangerousEngineering', {
                    Ids: [row.DangerousEngineeringId],
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
        getCategoryName(id) {
            let item = this.categorys.find(item => item.id == id);
            return item ? item.text : ''
        },
        getTypeName(id) {
            let item = this.types.find(item => item.id == id);
            return item ? item.text : ''
        },
        getStatusName(id) {
            let item = this.status.find(item => item.id == id);
            return item ? item.text : ''
        },
        release(row) {
            this.$confirm(`是否下发《${row.Name}》工程？`, '提示').then(async () => {
                try {
                    let res = await this.Get(`/RelaseDangerousEngineering?dangerousEngineeringId=${row.DangerousEngineeringId}`);
                    if (res.status == 2000) {
                        this.$message.success('已发布');
                        this.getList();
                    } else {
                        this.$message.error(res.message);
                    }
                } catch (error) {
                    console.error(error);
                }
            }).catch(()=>{})
        },
    }
}
</script>

<style>

</style>
