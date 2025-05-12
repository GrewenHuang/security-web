<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="900px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info">
                <div class="form-2-col form-item">
                    <div class="f">
                        <div class="label">品名：</div>
                        <div>{{ info.Name }}</div>
                    </div>
                    <div class="f">
                        <div class="label">规格型号：</div>
                        <div>{{ info.Spec }}</div>
                    </div>
                </div>
                <div class="form-2-col form-item">
                    <div class="f">
                        <div class="label">数量：</div>
                        <div>{{ info.Quantity || 0}}</div>
                    </div>
                    <div class="f">
                        <div class="label">单位：</div>
                        <div>{{ info.Unit }}</div>
                    </div>
                </div>
                <div class="f form-item">
                    <div class="label">备注：</div>
                    <div>{{ info.Remark }}</div>
                </div>
                <el-table
                    :data="list"
                    highlight-current-row
                    :header-cell-style="$tableStyle"
                    style="width: 100%;margin-top: 10px;"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="60"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="数量"
                        width="100"
                        align="center"
                        prop="Quantity"
                    ></el-table-column>
                    <el-table-column
                        label="操作人"
                        width="160"
                        align="center"
                        prop="OpUserName"
                    ></el-table-column>
                    <el-table-column
                        label="操作时间"
                        align="center"
                        width="180"
                        prop="CreateTimeDesc"
                    ></el-table-column>
                    <el-table-column
                        label="备注"
                        align="center"
                        prop="Remark"
                    ></el-table-column>
                </el-table>
                <div class="f-b-c">
                    <div></div>
                    <el-pagination layout="total, prev, pager, next"
                        background
                        @current-change="handleCurrentChange"
                        :page-size="pages.rows"
                        :total="pages.total"
                        :current-page="pages.page"
                        class="customPagination">
                    </el-pagination>
                </div>
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                >提交</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'page-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            list: [],
            pages: {
                page: 1,
                rows: 10,
                total: 0
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '查看'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.ProtectiveAppliancesId;
                try {
                    this.info = Object.assign(_extends(defaultInfo), item);
                   this.handleCurrentChange(1);
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        handleCurrentChange (val) {
            this.pages.page = val;
            this.getList();
        },
        getParams() {
            let params = {
                ...this.pages,
                ProtectiveAppliancesId: this.id
            };
            return params;
        },
        async getList() {
            let params = this.getParams();
            let res = await this.Post('/GetProtectiveAppliancesStorages', params);
            if (res.status === 2000) {
                let {list, count: total, page, rows} = res.data;
                this.list = list;
                this.pages.total = total;
                this.pages.page = page;
                this.pages.rows = rows;
            }
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
            min-width: 900px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
        }
        .el-date-editor,
        .el-select{
            width: 100%;
        }
        .form-2-col{
            display: flex;
            >div{
                width: 50%;
                &:first-child{
                    margin-right: 40px;
                }
            }
        }
        .form-item{
            border-bottom: 1px solid #efefef;
            padding: 15px 0;
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
    }
</style>