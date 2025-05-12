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
        append-to-body
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div id="export-paper" class="content">
                <div class="h1">
                    {{ info.Title }}
                    <el-button class="export" @click="exportData" v-if="!exportLoading">导出</el-button>
                </div>
                <div class="desc f-b-c">
                    <div>
                        <span>姓名：{{ info.UserName }}</span>
                        <span>部门：{{ (info.DepartmentList||[]).map(item=>item.DepartmentName).join('、')||'未设置'}}</span>
                        <span>岗位：{{ (info.PositionList||[]).map(item=>item.PositionName).join('、')||'未设置'}}</span>
                    </div>
                    <div>
                        <span>得分：<i>{{ info.Score }}分</i></span>
                        <span>答题用时：<i>{{ info.UseTime | formatUseTime }}</i></span>
                        <span>共{{ info.Questions.length }}题</span>
                    </div>
                </div>
                <div v-for="(question, n) in questions" :key="n">
                    <div class="split-line" v-if="n > 0"></div>
                    <div class="title">{{ question.TypeName}}（{{ question.list.length}}）</div>
                    <div class="subject" v-for="(subject, i) in question.list" :key="i" :class="{'border-top-1px': i > 0}">
                        <div class="topic">
                            {{i + 1}}、{{ subject.Content }}<span class="score" :class="{success: subject.isSuccess == 1}">（+{{+subject.isSuccess}}）</span>
                        </div>
                        <div class="item" v-for="(item, index) in subject.Answers" :key="index">
                            <div class="success" v-if="item.IsCorrect == 1 && item.IsCheck == 1"></div>
                            <div class="fail" v-if="item.IsCheck == 1 && item.IsCorrect == 0"></div>
                            {{index | formatLetter}}. {{ item.Answer }}
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import { Pdf } from '@/plugins/htmlToPdf';
const defaultInfo = {
    UserName: '',
    DepartmentList: [],
    PositionList: [],
    Questions: []
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
function zero(n) {
    return n > 0 ? n : '0' + n;
}
export default {
    name: 'page-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: _extends(defaultInfo),
            questions: [],
            exportLoading: false,
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : '新增'
        }
    },
    filters: {
        formatUseTime(duration) {
            let m = parseInt(duration / 60);
            let s = parseInt(duration % 60);
            let str = `${zero(s)}秒`
            if (m > 0) {
                str = `${zero(m)}分` + str
            }
            return str;
        },
        formatLetter(num) {
            let code = 'A'.charCodeAt(0);
            return String.fromCharCode(code + num);
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.KnowledgeContestPaperId;
                try {
                    let res = await this.Get(`/GetKnowledgeContestPaper?KnowledgeContestPaperId=${item.KnowledgeContestPaperId}`)
                    if (res.status == 2000) {
                        this.info = Object.assign(_extends(defaultInfo), item, {
                            Questions: res.data.Questions
                        });
                        let arr = [];
                        this.info.Questions.forEach((item, index) => {
                            item.isSuccess = item.Answers.every(obj => {
                                return (obj.IsCheck == 1 && obj.IsCorrect == 1) || (obj.IsCheck == 0 && obj.IsCorrect == 0)
                            });
                           
                            let flag = false;
                            arr.forEach(obj => {
                                if (obj.TypeCode == item.TypeCode) {
                                    obj.list.push(item);
                                    flag = true;
                                }
                            });
                            if (!flag) {
                                let obj = {};
                                obj.TypeCode = item.TypeCode;
                                obj.TypeName = item.TypeName;
                                obj.list = [item];
                                arr.push(obj);
                            }
                        });
                        this.questions = arr;
                    } else {
                        this.$message.error('获取数据失败');
                    //    this.close();
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
        exportData() {
            let loading = this.$loading({
                lock: true,
                text: '正在导出,请勿关闭当前页面',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.exportLoading = true;
            this.$nextTick(() => {
                Pdf.downPdf('export-paper', this.info.Title).then(res => {
                    this.exportLoading  = false;
                    loading.close();
                })
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
        .content{
            padding: 25px 25px 20px;
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
                margin: 25px -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        .h1{
            position: relative;
            margin-bottom: 30px;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            .export{
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
            }
        }
        .desc{
            border-radius: 10px;
            margin-bottom: 20px;
            padding: 15px 20px;
            background: #f8f8f8;
            span{
                &:not(:first-child){
                    margin-left: 20px;
                }
                i{
                    font-style: normal;
                    color: #FE912E;
                }
            }
        }
        .title{
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 600;
            &::before{
                content: '';
                border-radius: 2px;
                margin-right: 8px;
                width: 5px;
                height: 16px;
                background: $--color-primary;
            }
        }
        .border-top-1px{
            border-top: 1px solid #F2F2F2;
        }
        .subject{
            padding: 30px 12px 20px;
            .topic{
                font-weight: 600;
            }
            .score{
                color: #FE912E;
                &.success{
                    color: #1DBFAC;
                }
            }
            .item{
                position: relative;
                padding: 10px 0 10px 24px;
                .success,
                .fail{
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    top: 10px;
                    left: 0;
                    border-radius: 8px;
                    width: 20px;
                    height: 20px;
                    &::after,
                    &::before{
                        content: '';
                    }
                }
                .success{
                    background: #1DBFAC;
                    &::before{
                        border-left: 2px solid #fff;
                        border-bottom: 2px solid #fff;
                        transform: rotate(-45deg) translate(-2px, -2px);
                        transform-origin: top center;
                        width: 9px;
                        height: 5px;
                    }
                }
                .fail{
                    background: #FA7F30;
                    &::before,
                    &::after{
                        position: absolute;
                        transform: rotate(45deg);
                        transform-origin: center;
                        width: 13px;
                        height: 2px;
                        background: #fff;
                    }
                    &::after{
                        transform: rotate(-45deg);
                    }
                }
            }
        }
    }
</style>