<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select
                    placeholder="作业类型"
                    clearable
                    v-model="filters.JobTemplateId"
                >
                    <el-option
                        v-for="(item, index) in jobTemplateList"
                        :key="index"
                        :label="item.Name"
                        :value="item.JobTemplateId"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="作业票名称"
                    clearable
                    v-model="filters.Name"
                ></el-input>
                <el-input
                    placeholder="作业票编号"
                    clearable
                    v-model="filters.Number"
                ></el-input>
                <el-input
                    placeholder="业务单号"
                    clearable
                    v-model="filters.BusinessNumber"
                ></el-input>
                <el-select
                    placeholder="状态"
                    clearable
                    collapse-tags
                    multiple
                    v-model="filters.Status"
                >
                    <el-option
                        v-for="(item, index) in statusList"
                        :key="index"
                        :label="item.text"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <!-- <el-button type="primary" @click="add()">新增</el-button> -->
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
                label="作业类型"
                align="center"
                width="200"
                prop="JobTemplateName"
            >
            </el-table-column>
            <el-table-column
                label="作业票名称"
                align="center"
                prop="Name"
            >
            </el-table-column>
            <el-table-column
                label="作业票编号"
                align="center"
                width="180"
                prop="Number"
            >
            </el-table-column>
            <el-table-column
                label="申请人"
                align="center"
                width="150"
                prop="ApplyUserName"
            >
            </el-table-column>
            <el-table-column
                label="申请时间"
                align="center"
                width="150"
                prop="ApplyTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="状态"
                align="center"
                width="150"
                prop="StatusDesc"
            ></el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
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
            jobTemplateList: [],
            statusList: [],
        }
    },
    created() {
        this.getJobTemplateList();
        this.getStatusList();
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
                let res = await this.Post('/GetJobTickets', params);
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
                this.Get('/DeleteEmergencyExpert', {
                    emergencyExpertId: row.ExpertId,
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
        async getJobTemplateList() {
            let res = await this.Get('/GetJobTemplateList?name=');
            if (res.status) {
                this.jobTemplateList = res.data;
            }
        },
        async getStatusList() {
            let res = await this.Get('/GetJobTicketStatusCom');
            if (res.status == 2000) {
                this.statusList = res.data;
            }
        }
    }
}
</script>

<style>

</style>
