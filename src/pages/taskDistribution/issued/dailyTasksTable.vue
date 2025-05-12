<template>
    <el-dialog v-dialog-drag 
        title="完成情况"
        :visible.sync="dislogShow"
        @close="close()"
        class="daily-tasks-table"
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
                :tree-props="{children: 'Childrens', hasChildren: 'hasChildren'}"
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
                    label="回执附件"
                    width="320"
                >
                    <template slot-scope="{ row }">
                        <div class="file-list">
                                <div class="item" v-for="(item, index) in row.Attachments" :key="index" @click="openFile(item)">
                                    <i class="file-icon" :style="{backgroundImage: `url(${$fileIcons[item.Ext.toLocaleLowerCase()]})`}"></i>
                                    {{ item.Name }}
                                </div>
                            </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    width="110"
                >
                    <template slot-scope="{row}">
                        <whether :yes="row.IsFinished == 1" :text="row.IsFinished == 1 ? '完成' : '未完成'"/>
                    </template>
                </el-table-column>
                <el-table-column
                    label="完成日期"
                    align="center"
                    width="110"
                    prop="FinishedDate"
                ></el-table-column>
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
    name: 'daily-tasks-table',
    mixins: [request_mixins],
    data() {
        return {
            dislogShow: false,
            list: [],
            filters: {
                TaskAssignmentId : '',
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
                this.filters.TaskAssignmentId  = item.TaskAssignmentId;
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
        openFile(file) {
            let url = file.Url;
            if (url.indexOf('http') != -1) {
                window.open(url);
            } else {
                this.Get("/GetOssUrl?key="+url).then((result) => {
                    window.open(result.data.url);
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .daily-tasks-table{
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
        .file-list{
            .item{
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                color: $primary-color;
                cursor: pointer;
                .file-icon{
                    display: inline-block;
                    margin-right: 12px;
                    width: 23px;
                    height: 27px;
                    background: no-repeat center center;
                    background-size: contain;
                }
            }
        }
    }
</style>