<template>
    <el-dialog v-dialog-drag 
        class="protective-equipment-add"
        title="查看"
        :visible.sync="isShow"
        @close="close"
        width="210mm"
        top="50px"
        :append-to-body="true"
    >
        <el-scrollbar class="scrollbar">
            <div id="grant-record" class="pdf-content">
                <div class="h1">防护用品发放记录</div>
                <div class="f-b" style="align-items: flex-end;">
                    <div>发放人：<img :src="info.GrantSignInUrl" style="vertical-align: text-bottom;width: 80px;height:40px;"></div>
                    <div>发放时间：{{ info.GrantDateDesc }}</div>
                </div>
                <table class="table-content">
                    <colgroup>
                        <col width="60"/>
                        <col width="120"/>
                        <col width="180"/>
                        <col width="120"/>
                        <col width="120"/>
                        <!-- <col width="180"/> -->
                    </colgroup>
                    <thead>
                        <tr>
                            <td>序号</td>
                            <td>领取人姓名</td>
                            <td>防护用品</td>
                            <td>领取人签名</td>
                            <td>领取时间</td>
                            <!-- <td>备注</td> -->
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in list">
                            <tr :key="index">
                                <td>{{ index + 1  }}</td>
                                <td>{{ item.ReceiverName }}</td>
                                <!-- <td>{{ item.ProtectiveAppliances.map(o => `${o.Name}×${o.Quantity}`).join('、') }}</td> -->
								<td v-if="item.ProtectiveAppliancesReceiverId">{{ info.ProtectiveAppliancesJson }}</td>
								<td v-else></td>
                                <td><img style="width: 80px;height: 40px;" :src="item.ReceiverSignInUrl" v-if="item.ReceiverSignInUrl"></td>
                                <td>{{ item.ReceiverDateDesc }}</td>
                                <!-- <td></td> -->
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button type="primary" @click="exportPDF('grant-record')">导出PDF</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import { Pdf } from '@/plugins/htmlToPdf';

export default {
    mixins: [request_mixin],
    data() {
        return {
            isShow: false,
            info: {},
            id: '',
            list: []
        };
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
                this.id = item.ProtectiveAppliancesRecordId;
                let res = await this.Get("/GetProtectiveAppliancesRecord", { protectiveAppliancesRecordId: item.ProtectiveAppliancesRecordId });
                this.info = res.data;
                let minLength = 18;
                // let list = res.data.Receivers.map(item => {
                //     item.ProtectiveAppliances = res.data.ProtectiveAppliances;
                //     return {
                //         ...item
                //     }
                // });
				let list = res.data.Receivers
                for (let i = list.length; i < minLength; i++) {
                    list.push({
                        ProtectiveAppliances: [],
                        ReceiverName: ''
                    })
                }
                this.list = list;
            }
            this.isShow = true;
            loading.close();
        },
        close() {
            this.isShow = false;
            this.$nextTick(() => {
                this.reset();
            })
        },
        reset() {
            this.id = '';
            this.info = {};
        },
        exportPDF (id) {
            const loading = this.$loading({
                lock: true,
                text: '正在导出中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, .3)'
            });
            this.$nextTick(() => {
                Pdf.downPdf(id, '防护用品发放记录').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
    },
};
</script>

<style lang="scss" scoped>
.protective-equipment-add {
    
    /deep/ .el-dialog__body{
        color: #302E37;
        padding: 0 !important;
    }
    .label{
        margin:0 20px 8px 0;
        font-weight: 600;
    }
    /deep/ .el-divider--horizontal{
        margin: 15px 0 14px;
    }
    .pdf-content{
        padding: 20px 18px;
        .h1{
            margin-bottom: 8px;
            text-align: center;
            font-weight: 600;
            font-size: 18px;;
        }
    }
    .table-content {
        border-top: 1px solid #000;
        border-left: 1px solid #000;
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        td {
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 5px;
            height: 35px;
            background: #fff;
        }
        .label{
            font-weight: 600;
        }
        .clearbox{
            &::after{
                content: '';
                display: block;
                clear: both;
            }
        }
    }
}
</style>
