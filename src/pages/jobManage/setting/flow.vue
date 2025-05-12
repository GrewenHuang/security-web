<template>
    <div class="page-content">
        <div class="filter-content">
            <div class="f-b-c">
                <div class="operation">
                    <!-- <el-input placeholder="检查表名称" v-model="filters.Name"></el-input>
                    <el-button type="primary" @click="handlePageChange(1)">查询</el-button> -->
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
                </div>
            </div>
        </div>
        <div class="table-content" ref="tableContent">
            <el-table
                :data="list"
                highlight-current-row
                :header-cell-style="$tableStyle"
                style="width: 100%"
                :height="tableHeight"
                v-if="tableHeight > 0"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="50"
                >
                </el-table-column>
                <el-table-column
                    label="作业流程名称"
                    align="center"
                    prop="Name"
                >
                </el-table-column>
                <el-table-column
                    label="作业流程"
                    align="center"
                    min-width="300"
                >
                    <template slot-scope="{ row }">
                        {{ row.Contents.filter(item => item.IsEnable == 1).map((item, index) => `${index+1}${item.JobFlowTypeDesc}`).join(' - ') }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="150"
                >
                    <template slot-scope="{ row }">
                        <div class="table-operation">
                            <el-button type="text" @click="add(row)">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <info ref="info" :jobTemplateId="jobTemplateId" :approvals="approvals" @load="handlePageChange" />
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './flowInfo';
export default {
    components: {
        info
    },
    mixins: [request_mixins],
    props: {
        jobTemplateId: [String, Number],
        approvals: {
            type: Array,
            default() {
                return []
            }
        },
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

            },
            tableHeight: 0,
        }
    },
    mounted() {
        this.tableHeight = this.$refs.tableContent.offsetHeight - 40;
    },
    watch: {
        jobTemplateId: {
            immediate: true,
            handler() {
                this.handlePageChange(1);
            }
        }
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
                jobTemplateId: this.jobTemplateId
            }
            this.loading = true;
            try {
                let res = await this.Get('/GetJobFlowList', params);
                if (res.status === 2000) {
                    this.list = res.data;
                    // this.list = res.data.list;
                    // this.pages.total = res.data.count;
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
                this.Get('/DeleteJobFlow', {
                    jobFlowId: row.JobFlowId,
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

<style lang="scss" scoped>
.page-content{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background: #fff;
    .filter-content{
        padding: 17px 15px 10px;
        .operation{
            display: flex;
            > div:not(:last-child) {
                margin-right: 10px;
            }
        }
    }
    .table-content{
        flex: 1;
        padding: 10px 15px;
        overflow: hidden;
    }
    .footer-operation{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 25px;
        height: 90px;
    }
}
</style>