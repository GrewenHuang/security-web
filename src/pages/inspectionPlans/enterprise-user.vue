<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1100px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
        append-to-body
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="content">
                <div style="flex: 1;">
                    <div class="label">被检查企业</div>
                    <el-table
                        :data="list"
                        :header-cell-style="$tableStyle"
                        @selection-change="handleSelectionChangeEnterprise"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            label="企业名称"
                            align="center"
                            prop="EnterpriseName"
                        ></el-table-column>
                    </el-table>
                </div>
                <div class="vertical-line"></div>
                <div style="flex: 1;">
                    <!-- 检查人 -->
                    <div class="label">检查人</div>
                    <el-table
                        :data="list1"
                        :header-cell-style="$tableStyle"
                        @selection-change="handleSelectionChangeUser"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            label="检查人企业名称"
                            align="center"
                            prop="EnterpriseName"
                        ></el-table-column>
                        <el-table-column
                            label="姓名"
                            align="center"
                            prop="UserName"
                        ></el-table-column>
                    </el-table>
                </div>
            </div>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                @click="submit()"
                slot="reference"
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
    data() {
        return {
            loading: false,
            dislogShow: false,
            resolve: null,
            enterprises: [],
            users: [],
            list: [],
            list1: []
        }
    },
    computed: {
        title() {
            return '选择被检查企业/检查人'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            await this.getList();
            await this.getList1();
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            });
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
            })
        },
        close() {
            this.dislogShow = false;
            this.resolve = null;
        },
        async getList() {
            let res = await this.Post('/GetSubEnterprisePageList', {page: 1, rows: 9999, IsAll: 1});
            this.list = res.data.list;
            return Promise.resolve();
        },
        async getList1() {
            let res = await this.Get('/GetAllUser', {name: ''});
            this.list1 = res.data;
            return Promise.resolve();
        },
        handleSelectionChangeEnterprise(val) {
            this.enterprises = val;
        },
        handleSelectionChangeUser(val) {
            this.users = val;
        },
        submit() {
            if (!this.enterprises.length) {
                return this.$message.error('请选择被检查企业');
            }
            if (!this.users.length) {
                return this.$message.error('请选择检查人');
            }
            this.resolve({
                enterprises: this.enterprises,
                users: this.users
            });
            this.close();
        }
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
            min-width: 1100px;
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
        .vertical-line{
            margin: 0 8px;
            width: 1px;
            height: 100%;
            background: #f8f8f8;
        }
        .content{
            display: flex;
            align-items: flex-start;
            padding: 15px;
        }
        .label{
            margin-bottom: 8px;
            font-size: 16px;
            font-weight: 600;
        }
    }
</style>