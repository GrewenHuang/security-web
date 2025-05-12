<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="700px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
        append-to-body
    >
        <div class="operation f">
            <!-- <el-input placeholder="检查表类型" v-model="filters.ClassificationName"></el-input> -->
            <el-input placeholder="检查表名称" v-model="filters.InspectionName"></el-input>
            <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
        </div>
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="content">
                <!--  -->
                <el-table
                    :data="list"
                    :header-cell-style="$tableStyle"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    v-if="single"
                >
                   <!-- <el-table-column
                        label="检查表类型"
                        align="center"
                        width="140"
                        prop="ClassificationName"
                    ></el-table-column> -->
                    <el-table-column
                        label="检查表名称"
                        align="center"
                        prop="InspectionName"
                    ></el-table-column>
                    <el-table-column
                        label="检查内容（项）"
                        align="center"
                        width="140"
                        prop="ItemContentCount"
                    ></el-table-column>
                </el-table>
                <el-table
                    :data="list"
                    :header-cell-style="$tableStyle"
                    @selection-change="handleSelectionChange"
                    v-else
                >
                    <el-table-column
                        type="selection"
                        width="55"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        label="检查表类型"
                        align="center"
                        width="140"
                        prop="ClassificationName"
                    ></el-table-column>
                    <el-table-column
                        label="检查表名称"
                        align="center"
                        prop="InspectionName"
                    ></el-table-column>
                    <el-table-column
                        label="检查内容（项）"
                        align="center"
                        width="140"
                        prop="ItemContentCount"
                    ></el-table-column>
                </el-table>
            </div>
        </el-scrollbar>
        <el-pagination style="text-align: right;" layout="total, prev, pager, next"
            background
            @current-change="handlePageChange"
            :page-size="pages.rows"
            :total="pages.total"
            :current-page="pages.page"
            class="customPagination">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                :disabled="!choosed.length"
                @click="submit()"
                >确定</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    props: {
        single: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            list: [],
            choosed: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {

            },
            resolve: null,
        }
    },
    computed: {
        title() {
            return '检查表库'
        }
    },
    methods: {
        async show(item) {
            this.handlePageChange(1);
            this.dislogShow = true;
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
            });
        },
        close() {
            this.dislogShow = false;
            this.choosed = [];
            this.resolve = null;
        },
        submit() {
            let val = this.single ? _extends(this.choosed[0]) : _extends(this.choosed);
            this.$emit('submit', val);
            this.resolve(val);
            this.close();
        },
        handleSelectionChange(val) {
            this.choosed = val;
        },
        handleCurrentChange(val) {
            this.choosed = [val];
        },
        handlePageChange(val) {
            this.pages.page = val;
            this.GetList();
        },
        async GetList() {
            let params = {
                QueryScope: 2,
                ...this.pages,
                ...this.filters,
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetInspections', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
    }
}
</script>

<style lang="scss" scoped>
.info{
    /deep/ .el-dialog__body{
        padding: 0 !important;
       .el-scrollbar__wrap{
           margin-bottom: 0 !important;
       }
    }
    /deep/ .el-dialog{
        min-width: 700px;
    }
    .operation{
        padding: 20px 20px 10px;
        [class^=el]:not(.el-button){
            margin-right: 5px;
            width: 180px;
        }
    }
    .split-line{
        &::before{
            content: '';
            display: block;
            margin: 0 -25px 25px;
            height: 10px;
            background: #f2f2f2;
        }
    }
    .content{
        padding: 10px 20px;
    }
}
</style>