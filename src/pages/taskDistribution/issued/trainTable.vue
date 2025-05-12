<template>
    <el-dialog v-dialog-drag 
        title="完成情况"
        :visible.sync="dislogShow"
        @close="close()"
        class="train-table"
        width="1200px"
        top="8vh"
    >
        <el-scrollbar class="scrollbar">
            <div class="operation">
                <!-- <el-select placeholder="所属行业" v-model="filters.IndustryCode" clearable>
                    <el-option v-for="(item, index) in industryCode" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select> -->
                <el-input placeholder="公司名称" v-model="filters.EnterpriseName" clearable></el-input>
                <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
            </div>
            <el-table
                class="data-table"
                :data="list"
                highlight-current-row
                :header-cell-style="$tableStyle"
                style="width: 100%"
                default-expand-all
                row-key="EnterpriseId"
                :tree-props="{children: 'Childrens'}"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="50"
                ></el-table-column>
                <!-- <el-table-column
                    type=""
                    label="所属行业"
                    align="center"
                    width="180"
                    prop="IndustryName"
                ></el-table-column> -->
                <el-table-column
                    label="公司名称"
                    prop="EnterpriseName"
                ></el-table-column>
                <el-table-column
                    label="计划培训人数"
                    align="center"
                    width="110"
                    prop="PlanUserCount"
                ></el-table-column>
                <el-table-column
                    label="培训完成人数"
                    align="center"
                    width="110"
                    prop="PlanUserCompleteCount"
                ></el-table-column>
                <el-table-column
                    label="完成率"
                    align="center"
                    width="110"
                >
                    <template slot-scope="{row}">
                        <span class="danger-color">{{ row.Rate }}%</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagation" ref="pagation">
                <slot name="pagation">
                    <el-pagination layout="total, prev, pager, next"
                        background
                        @current-change="handleCurrentChange"
                        :page-size="pages.rows"
                        :total="pages.total"
                        :current-page="pages.page"
                        class="customPagination">
                    </el-pagination>
                </slot>
            </div> -->
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import { mapState } from 'vuex';
function haveChildren(arr) {
    arr.forEach(item => {
        if (item.Childrens && !!item.Childrens.length) {
            haveChildren(item.Childrens);
        } else {
            item.Childrens = null
        }
    })
}
export default {
    name: 'train-table',
    mixins: [request_mixins],
    data() {
        return {
            dislogShow: false,
            list: [],
            filters: {
                TaskAssignmentId: '',
                TaskType: '',
                IndustryCode: '',
                EnterpriseName: ''
            },
            pages: {
                rows: 10,
                page: 1,
                total: 0
            }
        }
    },
    computed: {
        ...mapState(['industryCode']),
    },
    methods: {
        show(item) {
            this.dislogShow = true;
            if (item) {
                this.filters.TaskAssignmentId = item.TaskAssignmentId;
                this.filters.TaskType = item.TaskType + '';
                this.handleCurrentChange(1);
            }
        },
        close() {
            this.dislogShow = false;
            this.filters.IndustryCode = '';
            this.filters.EnterpriseName = '';
        },
        handleCurrentChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters
            }
            let res = await this.Post('/GetTaskAssignmentObject', params);
            // this.list = res.data.list;
            haveChildren(res.data);
            this.list = res.data;
            this.pages.total = res.data.count;
        },
    }
}
</script>

<style lang="scss" scoped>
    .train-table{
        .operation{
            display: flex;
            &>div{
                margin-right: 10px;
            }
            /deep/ .el-input{
                width: 180px;
            }
        }
        .data-table{
            margin: 20px 0 12px;
        }
        .danger-color{
            color: #FE3F51;
        }
    }
</style>