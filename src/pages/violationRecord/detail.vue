<template>
    <el-dialog
        class="violation-record-detail"
        title="查看"
        :visible.sync="isShow"
        @close="close"
        width="1200px"
        top="50px"
        :append-to-body="true"
    >
        <div class="container" id="violationRecordDetail" v-if="isLoading">
            <div class="table-item">
                <div class="title text-c">船舶违法、违章记录</div>
                <div class="main">
                    <table
                        class="table-content"
                        border="1"
                        cellpadding="0"
                        cellspacing="0"
                    >
                        <colgroup>
                            <col width="55" />
                            <col width="75" />
                            <col width="300" />
                            <col width="130" />
                            <col width="300" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td colspan="2">船名名称</td>
                                <td>{{info.ShipName}}</td>
                                <td>所有人</td>
                                <td>{{info.ShipOwner}}</td>
                            </tr>
                            <tr>
                                <td colspan="2">运营证号</td>
                                <td>{{info.OperationCertificateNo}}</td>
                                <td>载重吨</td>
                                <td>{{info.Load}}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="custom-td">违法违章情况</div>
                                </td>
                                <td class="text-l" colspan="4">{{info.Content}}</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="custom-td">处理结果</div>
                                </td>
                                <td class="text-l" colspan="4">{{info.Result}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="f-b" style="margin-top: 16px;">
                        <div>记录人：<span class="underline">{{info.CreateByName}}</span></div>
                        <div>记录时间：<span class="underline">{{info.CreateTimeDesc | dateTimeFormate('yyyy年MM月dd日')}}</span></div>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button @click.native="exportPdf('violationRecordDetail')">导出PDF</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import formatter_mixin from "@/mixins/formatter-mixin.js";
import { Pdf } from "@/plugins/htmlToPdf.js";
import { reject } from "q";
let dateTimeFormate = formatter_mixin.methods.dateTimeFormate;
export default {
    name: "violation-record-detail",
    mixins: [request_mixin, formatter_mixin],
    data() {
        return {
            isShow: false,
            info: {
                ShipName: '',
                ShipOwner: '', // 所有人
                OperationCertificateNo: '' , // 营运资格编号
                Load: '', // 载重
                CreateByName: '', 
                CreateTimeDesc: '', 
                Content: '', 
                Result: '',
            },
            isLoading: false,
            checkList: [], // 检查项
        };
    },
    filters: {
        dateTimeFormate
    },
    created() {
    },
    computed: {
    },
    methods: {
        async show(item) {
            const loading = this.$loading({
                lock: true,
                text: '数据加载中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'transparent'
            });
            if (item) {
                this.id = item.ViolationRecordId;
                let res = await this.Get("/GetViolationRecord", { violationRecordId : item.ViolationRecordId  });
                this.info = res.data;
                this.isShow = true;
            }
            this.isLoading = true;
            loading.close();
        },
        close() {
            this.isShow = false;
            this.$nextTick(() => {
                this.reset();
            })
        },
        reset() {
            this.isLoading = false;
            this.id = '';
            this.info = {};
        },
        exportPdf(id){
            this.loading = true;
            Pdf.downPdf(id, `船舶违法、违章记录.pdf`);
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        }
    },
};
</script>

<style lang="scss" scoped>
.violation-record-detail {
    color: #000;
    .container {
        padding: 32px 70px 53px;
    }
    &.el-dialog__wrapper {
        display: block;
    }
    /deep/ .el-dialog__body {
        padding: 0 !important;
        color: #000;
    }
    .f-b{
        display: flex;
        justify-content: space-between;
    }
    .text-c{
        text-align: center;
    }
    .text-l{
        text-align: left;
    }
    .title{
        font-size: 28px;
    }
    .main{
        margin-top: 27px;
    }
    .table-content {
        margin-top: 2px;
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        border-color: #000;
        td {
            padding: 0 8px;
            height: 35px;
        }
    }
    .t-w{
        font-weight: 600;
    }
    .custom-td{
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 16px;
        height: 210px;
    }
}
</style>