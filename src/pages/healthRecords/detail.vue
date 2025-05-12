<template>
    <el-dialog v-dialog-drag 
        class="health-records-detail"
        title="查看"
        :visible.sync="isShow"
        @close="close"
        width="1200px"
        top="50px"
        :append-to-body="true"
    >
        <div class="container" id="healthRecordsDetail" v-if="isLoading">
            <div class="table-item">
                <div class="title text-c">员工职业健康档案</div>
                <div class="main">
                    <table
                        class="table-content"
                        border="1"
                        cellpadding="0"
                        cellspacing="0"
                    >
                        <colgroup>
                            <col width="160px">
                            <col width="372px">
                            <col width="160px">
                            <col width="372px">
                        </colgroup>
                        <tbody>
                            <tr>
                                <td class="label">姓名</td>
                                <td>{{info.UserName}}</td>
                                <td class="label">性别</td>
                                <td>{{info.GenderDesc}}</td>
                            </tr>
                            <tr>
                                <td class="label">出生日期</td>
                                <td>{{info.BirthdayDesc}}</td>
                                <td class="label">工作单位</td>
                                <td>{{info.Company}}</td>
                            </tr>
                            <tr>
                                <td class="label">建档日期</td>
                                <td>{{info.CreatedDateDesc}}</td>
                                <td class="label">编号</td>
                                <td>{{info.Number}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="sub-title text-c">职业史、既往史和职业病危害接触史</div>
                    <table
                        class="table-content"
                        border="1"
                        cellpadding="0"
                        cellspacing="0"
                    >
                        <colgroup>
                            <col width="65px">
                            <col width="95px">
                            <col width="64px">
                            <col width="228px">
                            <col width="81px">
                            <col width="79px">
                            <col width="82px">
                            <col width="145px">
                            <col width="228px">
                        </colgroup>
                        <tbody>
                            <tr>
                                <td class="label" colspan="2">既往病史</td>
                                <td colspan="7">{{info.PastMedicalHistory}}</td>
                            </tr>
                            <tr>
                                <td class="label" colspan="2">病名</td>
                                <td colspan="3">{{info.DiseaseName}}</td>
                                <td class="label" colspan="2">诊断日期</td>
                                <td colspan="2">{{info.DiagnosisDateDesc}}</td>
                            </tr>
                            <tr>
                                <td class="label" colspan="2">诊断单位</td>
                                <td colspan="3">{{info.DiagnosisCompany}}</td>
                                <td class="label" colspan="2">是否治愈</td>
                                <td colspan="2">{{info.IsCuredDesc}}</td>
                            </tr>
                            <tr>
                                <td :rowspan="factorList.length + 1">
                                    <div class="label custom-td">职业史和职业病危害因素接触史</div>
                                </td>
                                <td class="label" colspan="2">起止时间</td>
                                <td class="label">工作单位</td>
                                <td class="label" colspan="2">工种</td>
                                <td class="label" colspan="2">有害因素</td>
                                <td class="label">防护措施</td>
                            </tr>
                            <template v-for="(item, index) in factorList">
                                <tr :key="index">
                                    
                                    <td colspan="2">
                                        <div v-if="!!item.startingAndEndTime.length">
                                            {{item.startingAndEndTime[0]}}
                                            <div>至</div>
                                            {{item.startingAndEndTime[1]}}
                                        </div>
                                    </td>
                                    <td>{{item.company}}</td>
                                    <td colspan="2">{{item.typeOfWork}}</td>
                                    <td colspan="2">{{item.harmfulFactor}}</td>
                                    <td>{{item.protectiveMeasures}}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <div class="sub-title text-c">职业健康检查结果及处理情况</div>
                    <table
                        class="table-content"
                        border="1"
                        cellpadding="0"
                        cellspacing="0"
                    >
                        <colgroup>
                            <col width="188px">
                            <col width="293px">
                            <col width="293px">
                            <col width="290px">
                        </colgroup>
                        <tbody>
                            <tr>
                                <td class="label">检查时间</td>
                                <td class="label">检查结果</td>
                                <td class="label">处理结果</td>
                                <td class="label">备注</td>
                            </tr>
                            <template v-for="(item, index) in resultList">
                                <tr :key="index">
                                    <td>{{item.inspectionTime}}</td>
                                    <td>{{item.inspectionResult}}</td>
                                    <td>{{item.processingResult}}</td>
                                    <td>{{item.remark}}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <div class="sub-title text-c">职业病诊疗等相关资料</div>
                    <div class="image-content">
                        <template v-for="(item, index) in info.OccupationalFiles">
                            <img :src="item.url" :key="index">
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button @click.native="exportPdf('healthRecordsDetail')">导出PDF</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import formatter_mixin from "@/mixins/formatter-mixin.js";
import { Pdf } from "@/plugins/htmlToPdf.js";
import { reject } from "q";
let dateTimeFormate = formatter_mixin.methods.dateTimeFormate;
const factorObj = {
    startingAndEndTime: '', // 起止时间
    company: '', // 工作单位
    typeOfWork: '', // 工种
    harmfulFactor: '', // 有害因素
    protectiveMeasures: '', // 防护措施
}
const resultObj = {
    inspectionTime: '', // 检查时间
    inspectionResult: '', // 检查结果
    processingResult: '', // 处理结果
    remark: '', // 备注
}
export default {
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
            factorList: [], // 因素
            resultList: [],
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
                this.id = item.HealthRecordId;
                let res = await this.Get("/GetHealthRecord", { healthRecordId : item.HealthRecordId  });
                this.info = res.data;
                this.factorList = JSON.parse(this.info.OccupationalHealthHistoryJson);
                this.resultList = JSON.parse(this.info.OccupationalHealthResultJson);
                this.isShow = true;
                this.setFillList(this.factorList, 4, factorObj)
                this.setFillList(this.resultList, 3, resultObj)
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
            Pdf.downPdf(id, `员工职业健康档案-${this.info.UserName}.pdf`);
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        },
        setFillList(list, length, info) {
            let len = list.length;
            if (len < length) {
                for (let i = 0; i < length - len; i++) {
                    list.push(Object.assign({}, info));
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.health-records-detail {
    color: #000;
    .container {
        padding: 37px 70px 30px;
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
        font-size: 32px;
        font-weight: 600;
    }
    .sub-title{
        margin: 24px 0 25px;
        font-size: 23px;
        font-weight: 600;
    }
    .main{
        margin-top: 26px;
    }
    .table-content {
        margin-top: 2px;
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        border-color: #000;
        td {
            padding: 0 8px;
            height: 60px;
        }
        .label{
            font-weight: 600;
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
        min-height: 210px;
        padding: 8px 0 ;
    }
    .image-content{
        border: 1px solid #000000;
        padding: 14px 17px;
        min-height: 418px;
        img{
            width: 100%;
            height: auto;
            &:not(:first-child){
                margin-top: 10px;
            }
        }
    }
}
</style>
