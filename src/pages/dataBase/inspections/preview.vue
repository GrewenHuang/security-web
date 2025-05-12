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
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="pdf" ref="pdf">
                <div class="h2">{{ info.InspectionName }}</div>
                <div class="f-b-c">
                    <div>企业：</div>
                    <div>编号：</div>
                </div>
                <table class="table-content">
                    <colgroup>
                        <col width="230px"/>
                        <col width="74px"/>
                        <col width="305px"/>
                        <col width="119px"/>
                        <col width="305px"/>
                        <col width="220px"/>
                    </colgroup>
                    <tr>
                        <td>检查表类型</td>
                        <td colspan="5">{{ info.GroupPath }}</td>
                    </tr>
                    <template v-for="(item, index) in info.InspectionFields">
                        <tr :key="index">
                            <td>{{ item.FieldName }}</td>
                            <td colspan="5"></td>
                        </tr>
                    </template>
                    <tr>
                        <td>检查地址</td>
                        <td colspan="5"></td>
                    </tr>
                    <tr>
                        <td>检查时间</td>
                        <td colspan="5"></td>
                    </tr>
                    <tr>
                        <td>检查人</td>
                        <td colspan="5"></td>
                    </tr>
                    <template v-for="(item, index) in info.InspectionItems">
                        <tr>
                            <td class="bg" colspan="6">{{ item.ItemName }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="header">检查内容</td>
                            <td class="header">检查依据</td>
                            <td class="header">检查结果</td>
                            <td class="header">不合格说明</td>
                            <td class="header">检查附件</td>
                        </tr>
                        <template v-for="(o, i) in item.ItemContentList">
                            <tr :key="i">
                                <td colspan="2"><span style="text-align: left;" v-html="o.Describe"></span></td>
                                <td><span v-html="o.Basis" style="text-align: left;"></span></td>
                                <td>{{  }}</td>
                                <td>{{  }}</td>
                                <td>{{  }}</td>
                            </tr>
                        </template>
                    </template>
                    <tr>
                        <td>总评</td>
                        <td colspan="5" style="height: 100px;"></td>
                    </tr>
                </table>
                <div class="f-b-c">
                    <div>检查人签字：</div>
                    <div>被检查人签字：<span style="display:inline-block;width: 100px;"></span></div>
                </div>
            </div>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                @click="exportPDF()"
                slot="reference"
                >导出PDF</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import { Pdf } from '@/plugins/htmlToPdf';
const defaultInfo = {
    InspectionName: '', // 检查表名称
    ClassificationLibraryId: [], // 检查类型 id
    ClassificationName: '', // 检查类型 name
    InspectionItems: [], // 检查项目集合
    /**
     * InspectionItemId (integer, optional): ID ,
     * InspectionId (integer, optional): 检查表ID ,
     * ItemName (string, optional): 检查项目名称 ,
     * ItemContent (string, optional): 检查项目内容 ,
     * Sort (integer, optional): 排序 ,
     * ItemContentList (Array[InspectionItemContent], optional): 检查项目内容集合
     */
    /**
     * ItemContentList
     * PotentialLevelCode (string, optional): 隐患级别 ,
     * PotentialLevelName (string, optional): 隐患级别名称 ,
     * Describe (string, optional): 隐患描述（检查内容） ,
     * Basis (string, optional): 检查依据 ,
     * Suggestion (string, optional): 整改建议 ,
     * JudgmentCriteria (string, optional): 重大隐患判断标准
     */
    InspectionFields: [], // 检查自定义字段
    /**
     * FieldName (string, optional): 字段名称 ,
     * FieldType (integer, optional): 字段类型 1人员 2车辆 3设备 4文本 5日期
     */
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: _extends(defaultInfo),
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
                this.id = item.InspectionId;
                try {
                    let res = await this.Get(`/GetInspection?inspectionId=${this.id}`)
                    if (res.status == 2000) {
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                    } else {
                        this.$message.error('获取数据失败');
                        this.close();
                    }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        exportPDF () {
            const loading = this.$loading({
                lock: true,
                text: '正在导出中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, .3)'
            });
            this.$nextTick(() => {
                Pdf.downPdf(this.$refs.pdf, this.info.InspectionName).then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
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
            min-width: 1000px;
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
        .split-line{
            &::before{
                content: '';
                display: block;
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
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
            .bg{
                background: #EEEEEE;
                box-shadow: 0 0 0 100px inset #EEEEEE;
            }
            .header{
                font-weight: 600;
            }
        }
        .pdf{
            padding: 40px 25px;
            .h2{
                padding-bottom: 10px;
                text-align: center;
                font-size: 23px;
                font-weight: 600;
            }
        }
    }
</style>