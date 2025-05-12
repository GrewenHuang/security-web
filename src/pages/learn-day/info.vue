<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <div class="filter f-b-c">
            <div>
                <el-input placeholder="姓名" clearable v-model="filters.UserName"></el-input>
                <el-select placeholder="完成状态" clearable v-model="filters.Status">
                    <el-option label="已完成" :value="1"></el-option>
                    <el-option label="未完成" :value="0"></el-option>
                </el-select>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div>
                <el-button @click="downloadmbs(30, 301, downloadFilters)">导出</el-button>
            </div>
        </div>
        <div class="title f-b-c" v-if="info.LearningInfo">
            <div>学习标题：{{ info.LearningInfo.Name }}</div>
            <div>完成率：<span>{{ info.CompleteRate }}%</span></div>
        </div>
        <el-scrollbar ref="scrollbar" class="scrollbar">
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
                    label="姓名"
                    align="center"
                    prop="UserName"
                ></el-table-column>
                <el-table-column
                    label="完成状态"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        <whether :yes="row.Status == 1" :text="row.Status == 1 ? '已完成' : '未完成'"></whether>
                    </template>
                </el-table-column>
                <el-table-column
                    label="打卡时间"
                    align="center"
                    prop="LearningTimeDesc"
                ></el-table-column>
               <!-- <el-table-column
                    label="操作"
                    width="150"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        <el-button type="text" @click="remind(row)" v-if="row.Status != 1">打卡提醒</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </el-scrollbar>
        <div class="f-e-c">
            <el-pagination layout="total, prev, pager, next"
                background
                @current-change="handlePageChange"
                :page-size="pages.rows"
                :total="pages.total"
                :current-page="pages.page"
                class="customPagination">
            </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import Import_export from "@/mixins/Import_export.js";
const defaultInfo = {
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'page-info',
    mixins: [request_mixin, Import_export],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: _extends(defaultInfo),
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                UserName: '',
                Status: '',
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '查看'
        },
        downloadFilters() {
            return {
                ...this.pages,
                ...this.filters,
                LearningRecordId: this.id
            }
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.id = item.LearningRecordId;
                this.info = Object.assign(_extends(defaultInfo), item);
                this.handlePageChange(1);
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        handlePageChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters,
                LearningRecordId: this.id
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetLearningUsers', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.list = [];
            Object.assign(this.info, _extends(defaultInfo))
        },
        async remind(item) {
            this.$confirm('确认发送提醒吗？','提示',{

            }).then(async _ => {
                let res = await this.Get(`/PunchClockReminder?UserId=${item.UserId}&learningRecordId=${this.id}`);
                if (res.status == 2000) {
                    this.$message.success('已提醒');
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 16px 25px !important;
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        .filter{
            display: flex;
            align-items: center;
            margin-bottom: 38px;
            .el-input,
            .el-select{
                margin-right: 10px;
                width: 180px;
            }
        }
        .title{
            margin-bottom: 21px;
            font-size: 16px;
            span{
                color: #FE3F51;
            }
        }
        /deep/ .el-dialog__body .scrollbar .el-scrollbar__wrap{
            height: 55vh;
        }
    }
</style>