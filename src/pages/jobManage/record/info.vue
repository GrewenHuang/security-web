<template>
    <el-dialog
        v-dialog-drag
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="2vh"
        v-loading="loading"
        :fullscreen="fullscreen"
        :class="{fullscreen: fullscreen}"
        element-loading-text="数据加载中"
    >
        <div class="f-b-c header" slot="title">
            <div class="title">{{ title }}</div>
            <div class="fullscreen-icon" @click="fullscreen = !fullscreen">
                <i class="iconfont" :class="[fullscreen ? 'icon-quanpingsuoxiao' : 'icon-quanping']"></i>
            </div>
        </div>
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="popup-content">
                <div class="flow-chart">
                    <el-scrollbar> 
                        <div style="text-align: center;">
                            <div class="flow-list">
                                <div class="flow-item enabled" v-for="(item, index) in flowList" :key="index">
                                    <div class="text"><span class="number">{{ index + 1 }}</span>{{ item.JobFlowTypeDesc }}</div>
                                    <div class="status">
                                        <div class="circle"></div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                
                <el-collapse
                        v-model="collapseActive"
                    >
                    <el-collapse-item
                        v-for="(item, i) in flowList"
                        :key="i"
                        :name="item.JobFlowTypeDesc"
                    >
                        <div slot="title" class="f-b-c f1">
                            <span class="collapse-title"><span class="index-number">{{ i + 1 }}</span>{{ item.JobFlowTypeDesc }}</span>
                            <div class="f--c operation">
                                <div class="switch" :class="{open: collapseActive.includes(item.JobFlowTypeDesc)}">
                                    {{ collapseActive.includes(item.JobFlowTypeDesc) ? '收起' : '展开' }}
                                </div>
                            </div>
                        </div>
                        <!-- 申请 -->
                        <basic-info :info="info.BaseInfo" v-if="item.JobFlowType === 0"/>
                        <!-- 负责人审批 -->
                        <jobFlowInfo :info="info.UsersInfo" :jobTemplateId="info.BaseInfo.JobTemplateId" :sign-url="info.BaseInfo.ResponsibleUserSignInUrl" v-if="item.JobFlowType == 10"/>
                        <!-- 分析 -->
                        <analyseInfo :info="info.AnalyseInfo" :jobTemplateId="info.BaseInfo.JobTemplateId" v-if="item.JobFlowType == 20"/>
                        <!-- 落实 -->
                        <safetyMeasuresInfo :info="info.SafetyMeasuresInfo" v-if="item.JobFlowType == 30"/>
                        <!-- 交底 -->
                        <safetyDisclosureInfo :info="info.SafetyDisclosureInfo" v-if="item.JobFlowType == 40"/>
                        <!-- 接受交底 -->
                        <receiveSafetyDisclosureInfo :info="info.ReceiveSafetyDisclosureInfo" v-if="item.JobFlowType == 50"/>
                        <!-- 审批 -->
                        <approvalInfo :info="info.ApprovalInfo" v-if="item.JobFlowType == 60"/>
                        <!-- 验票 -->
                        <inspectTicketInfo :info="info.InspectTicketInfo" v-if="item.JobFlowType == 70"/>
                        <!-- 监督 -->
                        <superviseInfo :info="info.SuperviseInfo" v-if="item.JobFlowType == 80"/>
                        <!-- 验收 -->
                        <checkAcceptInfo :info="info.CheckAcceptInfo" v-if="item.JobFlowType == 90"/>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-scrollbar>
        <pdfVue :info="info" @close="exportPDFLoading = false" v-if="exportPDFLoading"/>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button type="primary" @click="showPDF">导出PDF</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import pdfVue from './pdf';
import {
    basicInfo,
    jobFlowInfo,
    analyseInfo,
    safetyMeasuresInfo,
    safetyDisclosureInfo,
    receiveSafetyDisclosureInfo,
    approvalInfo,
    inspectTicketInfo,
    superviseInfo,
    checkAcceptInfo,
} from './components';
const defaultInfo = {
    BaseInfo: {},
    UsersInfo: [], // 人员信息 ,
    AnalyseInfo: [], // 分析信息 ,
    SafetyMeasuresInfo: [], // 落实信息 ,
    SafetyDisclosureInfo: [], // 技术交底信息 ,
    ReceiveSafetyDisclosureInfo: [], // 接受技术交底信息 ,
    ApprovalInfo: [], // 审批信息 ,
    InspectTicketInfo: [], // 验票信息 ,
    SuperviseInfo: [], // 监督信息 ,
    CheckAcceptInfo: [], // 验收信息
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    components: {
        basicInfo,
        jobFlowInfo,
        analyseInfo,
        safetyMeasuresInfo,
        safetyDisclosureInfo,
        receiveSafetyDisclosureInfo,
        approvalInfo,
        inspectTicketInfo,
        superviseInfo,
        checkAcceptInfo,
        pdfVue
    },
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            exportPDFLoading: false,
            info: _extends(defaultInfo),
            fullscreen: true,
            collapseActive: [],
            rules: {
            }
        }
    },
    computed: {
        title() {
            return '查看'
        },
        flowList() {
            let {BaseInfo: { JobTicketFlows = [] }} = this.info;
            return JobTicketFlows.filter(item => item.IsEnable == 1);
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.JobTicketId;
                try {
                    let res = await this.Get(`/GetJobTicketRecord?jobTicketId=${this.id}`)
                    if (res.status == 2000) {
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                        if (!this.info.BaseInfo.JobTicketFlows.length) {
                            this.$message.error('未设置作业流程');
                            this.close();
                        } else {
                            this.info.BaseInfo.JobTicketFlows.forEach(item => {
                                if (item.IsEnable == 1) {
                                    this.collapseActive.push(item.JobFlowTypeDesc)
                                }
                            });
                        }
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
            this.exportPDFLoading = false;
            this.id = '';
            this.collapseActive = [];
            this.info = _extends(defaultInfo);
            setTimeout(() => {
                this.fullscreen = true;
            }, 300);
        },
        showPDF() {
            this.exportPDFLoading = true;
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
        /deep/ .el-table__header-wrapper{
            border-radius: 0;
        }
        .form-col{
            display: flex;
            >div{
                flex: 1;
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
        .popup-content{
            padding: 30px;
        }
        &.fullscreen{
            /deep/ .el-scrollbar__wrap{
                height: 83vh;
            }
        }
        
        .header{
            padding-right: 20px;
            .title{
                font-size: 24px;
                font-weight: bold;
            }
        }
        .fullscreen-icon{
            margin-top: 2px;
            margin-bottom: auto;
            cursor: pointer;
            .iconfont{
                font-size: 14px;
                color: #909399;
                &:hover{
                    color: $__color-primary;
                }
            }
        }
        
        .flow-chart{
            border-radius: 10px 10px 10px 10px;
            margin: 0 0 15px;
            background: #F8FAFF;
            /deep/ .el-scrollbar__wrap{
                overflow-x: hidden;
                height: initial;
            }
            .flow-list{
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0 40px;
                height: 100px;
                text-align: left;
                .flow-item{
                    .text{
                        margin-bottom: 10px;
                        line-height: 16px;
                        white-space: nowrap;
                        color: #d5d5d5;
                        .number{
                            margin-right: 5px;
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
                    .status{
                        display: flex;
                        align-items: center;
                        .circle{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 100%;
                            border: 2px solid $__color-primary;
                            width: 23px;
                            height: 23px;
                            opacity: .3;
                        }
                    }
                    &:not(:last-child){
                        .status{
                            &::after{
                                content: '';
                                margin: 0 11px;
                                width: 100px;
                                height: 2px;
                                background: $__color-primary;
                                opacity: .3;
                            }
                        }
                    }
                    &.enabled{
                        .text{
                            color: #181B3B;
                        }
                        .status{
                            .circle{
                                opacity: 1;
                                background: $__color-primary;
                                &::before{
                                    content: '';
                                    border-bottom: 1px solid #fff;
                                    border-left: 1px solid #fff;
                                    transform: rotate(-45deg) translate(1px, -1px);
                                    width: 11px;
                                    height: 5px;
                                }
                            }
                            &::after{
                                opacity: 1;
                            }
                        }
                    }
                }
            }
        }
        /deep/ .el-collapse{
            margin-top: 28px;
            border: 0;
            .el-collapse-item{
                border: none;
                border-radius: 6px;
                margin-bottom: 20px;
                overflow: hidden;
                &.is-active{
                    .el-collapse-item__header{
                        border-bottom: none;
                    }
                }
                .el-input.is-disabled .el-input__inner,
                .el-textarea.is-disabled .el-textarea__inner{
                    color: #84888f;
                    background: #f7f8f9;
                }
                .el-collapse-item__header{
                    border: none;
                    padding: 14px 20px;
                    background: #F5F6FA;
                    line-height: inherit;
                    .operation{
                        color: $primary-color;
                        .switch{
                            display: flex;
                            align-items: center;
                            &::before{
                                content: '';
                                border: 8.25px solid $primary-color;
                                border-bottom: 0;
                                border-right: 6px solid transparent;
                                border-left: 6px solid transparent;
                                margin-right: 6px;
                                width: 0;
                                height: 0;
                                transform-origin: center;
                                transform: rotateX(0);
                                transition: all .2s linear;
                            }
                            &.open{
                                &::before{
                                    transform: rotateX(180deg);
                                }
                            }
                        }
                        >div:last-child{
                            margin-left: 22px;
                        }
                    }
                    .collapse-title{
                        font-size: 16px;
                        font-weight: 600;
                        .index-number{
                            display: inline-block;
                            border-radius: 100%;
                            margin-right: 10px;
                            width: 24px;
                            height: 24px;
                            background: $__color-primary;
                            font-size: 12px;
                            line-height: 24px;
                            text-align: center;
                            font-weight: 400;
                            color: #fff;
                        }
                    }
                }
                .el-collapse-item__arrow{
                    display: none;
                }
                .el-collapse-item__wrap{
                    border: none;
                }
                .el-collapse-item__content{
                    padding: 0;
                }
            }
        }
    }
</style>
