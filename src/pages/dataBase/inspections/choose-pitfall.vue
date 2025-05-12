<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
        append-to-body
    >
        <div class="operation f">
            <el-input placeholder="隐患类型"></el-input>
            <el-select v-model="filters.PotentialLevelCode">
                <el-option v-for="(item, index) in pitfallLevel" :key="index" :value="item.id" :label="item.text"></el-option>
            </el-select>
            <el-input placeholder="描述/依据/建议" v-model="filters.Query"></el-input>
            <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
        </div>
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="content">
                <el-table
                    ref="table"
                    :data="list"
                    :header-cell-style="$tableStyle"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="55"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        label="隐患类型"
                        align="center"
                        width="140"
                        prop="ClassificationName"
                    ></el-table-column>
                    <el-table-column
                        label="隐患描述"
                        align="center"
                        width="240"
                        prop="Describe"
                    ></el-table-column>
                    <el-table-column
                        label="隐患依据"
                        align="center"
                        prop="Basis"
                    ></el-table-column>
                    <el-table-column
                        label="整改建议"
                        align="center"
                        width="140"
                        prop="Suggestion"
                    ></el-table-column>
                    <el-table-column
                        label="隐患级别"
                        align="center"
                        width="140"
                        prop="PotentialLevelName"
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
            pitfallLevel: [],
            list: [],
            choosed: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {

            },
        }
    },
    computed: {
        title() {
            return '隐患库'
        }
    },
    methods: {
        async show(item) {
            await this.getPitfallLevel();
            this.handlePageChange(1);
            this.dislogShow = true;
        },
        close() {
            this.dislogShow = false;
            this.$refs.table.clearSelection();
            this.choosed = [];
        },
        submit() {
            this.$emit('submit', this.single ? _extends(this.choosed[0]) : _extends(this.choosed));
            this.close();
        },
        handleSelectionChange(val) {
            this.choosed = val;
        },
        handlePageChange(val) {
            this.pages.page = val;
            this.GetList();
        },
        async GetList() {
            let params = {
                ...this.pages,
                ...this.filters,
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetPotentialLibrarys', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        async getPitfallLevel() {
            let res = await this.Get('/GetPotentialLevelCom');
            if (res.status == 2000) {
                this.pitfallLevel = res.data;
            }
            return Promise.resolve();
        },
    },
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
            min-width: 1000px;
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