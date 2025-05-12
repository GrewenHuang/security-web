<template>
    <el-dialog v-dialog-drag 
        class="funding-plan-detail"
        :title="title"
        :visible.sync="isShow"
        @close="close"
        width="1100px"
        top="50px"
        :append-to-body="true"
    >
        <div class="container" id="fundingPlan" v-if="isLoading">
            <div class="h1">
                <div class="date-picker">
                    <template v-if="!isExport && !filing">
                        <el-date-picker
                            v-model="info.Year"
                            type="year"
                            value-format="yyyy"
                            :clearable="false"
                            :disabled="!!isExport"
                            :editable="false"
                            @change="changeYear"
                            >
                        </el-date-picker>
                    </template>
                    <template v-else>
                        <span class="underline" style="min-height: 29px">{{info.Year}}</span>
                    </template>
                </div>
                <div>年度安全生产经费投入计划</div>
            </div>
            <div class="table-container">
                <div>单位名称：{{ info.EnterpriseName }}</div>
                <div class="f-b-c">
                    <div>编号：{{ info.Code }}</div>
                    <div class="t-r f-12">单位：万元</div>
                </div>
                <table
                    class="table-content"
                    border="1"
                    cellpadding="0"
                    cellspacing="0"
                >
                    <colgroup>
                        <col width="110" />
                        <col width="100" />
                        <col width="110" />
                        <col width="140" />
                        <col width="140" />
                    </colgroup>
                    <tbody>
                        <tr class="thead">
                            <td>上年度营收收入</td>
                            <td>提取标准(%)</td>
                            <td>本年度提取金额</td>
                            <td>上年度结余金额</td>
                            <td>本年度实际可使用金额</td>
                        </tr>
                        <tr>
                            <td>
                                <template v-if="!isExport && !filing">
                                    <el-input-number class="t-c" placeholder="请输入" :max="999999999" :controls="false"  :precision="2" type="number" v-model="info.PreviousYearIncome" :disabled="!!isExport"></el-input-number>
                                </template>
                                <template v-else>
                                    {{info.PreviousYearIncome}}
                                </template>
                            </td>
                            <td>
                                <template v-if="!isExport && !filing">
                                    <el-input-number class="t-c" placeholder="请输入" :max="1000" :controls="false" v-model="info.ExtractionStandard" :disabled="!!isExport"></el-input-number>
                                </template>
                                <template v-else>
                                    {{info.ExtractionStandard}}
                                </template>
                            </td>
                            <td>
                                {{CurrentYearExtraction}}
                            </td>
                            <td>
                                <template v-if="!isExport && !filing">
                                    <el-input-number class="t-c" placeholder="请输入" :max="999999999" :controls="false"  :precision="2" type="number" v-model="info.PreviousYearBalance" :disabled="!!isExport"></el-input-number>
                                </template>
                                <template v-else>
                                    {{info.PreviousYearBalance}}
                                </template>
                            </td>
                            <td>
                                {{CurrentYearActual}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-container">
                <div class="t-r f-12">单位：万元</div>
                <table
                    class="table-content"
                    border="1"
                    cellpadding="0"
                    cellspacing="0"
                >
                    <colgroup>
                        <col width="70" />
                        <col width="60" />
                        <col width="350" />
                        <col width="350" />
                        <col width="150" />
                        <col width="150" v-if="info.Status > 0"/>
                        <col width="330" />
                    </colgroup>
                    <tbody>
                        <tr class="thead">
                            <td>序号</td>
                            <td colspan="2">安全投入分类</td>
                            <td>安全投入费用内容</td>
                            <td>投入金额</td>
                            <td v-if="info.Status > 0">支付金额</td>
                            <td>备注</td>
                        </tr>
                        <template v-for="(project, cIndex) in info.Items">
                            <template v-for="(item, index) in project.Classifications">
                                <tr :key="cIndex +''+ index">
                                    <td v-if="index == 0" :rowspan="project.Classifications.length">{{cIndex+1}}</td>
                                    <td v-if="index == 0" :rowspan="project.Classifications.length">
                                        <customInput v-model="project.Title" :disabled="!(!isExport && !filing)"/>
                                        <!-- <template v-if="!isExport && !filing">
                                            <el-input type="textarea" placeholder="请输入" resize="none" autosize class="t-c" v-model="project.Title" :disabled="!!isExport"></el-input>
                                        </template>
                                        <template v-else>
                                            {{project.Title}}
                                        </template> -->
                                    </td>
                                    <td>
                                        <template v-if="!isExport && !filing">
                                            <el-input class="t-c" placeholder="请输入" v-model="item.Classification" :disabled="!!isExport"></el-input>
                                        </template>
                                        <template v-else>
                                            {{item.Classification}}
                                        </template>
                                    </td>
                                    <td>
                                        <template v-if="!isExport && !filing">
                                            <el-input class="t-c" placeholder="请输入" v-model="item.Content" :disabled="!!isExport"></el-input>
                                        </template>
                                        <template v-else>
                                            {{item.Content}}
                                        </template>
                                    </td>
                                    <td>
                                        <template v-if="!isExport && !filing">
                                            <el-input-number class="t-c" placeholder="请输入" :controls="false" v-model="item.InvestmentMoney" :disabled="!!isExport"></el-input-number>
                                        </template>
                                        <template v-else>
                                            {{item.InvestmentMoney}}
                                        </template>
                                    </td>
                                    <td v-if="info.Status > 0">
                                        {{item.ExpenditureMoney}}
                                    </td>
                                    <td>
                                        <div class="f-b" style="align-items: center;">
                                            <template v-if="!isExport">
                                                <el-input class="t-c" placeholder="请输入" v-model="item.Remark" :disabled="!!isExport"></el-input>
                                            </template>
                                            <template v-else>
                                                <div style="flex: 1;">{{item.Remark}}</div>
                                            </template>
                                           <tempalate v-if="info.Status == 0">
											   <div class="custom-icon" @click="removeProject(project.Classifications, index, cIndex)" v-if="(cIndex > 0 || project.Classifications.length > 1) && !isExport">-</div>
											   <div class="custom-icon add" @click="addProject(project.Classifications, index)" v-if="index == project.Classifications.length - 1 &&!isExport">+</div>
										   </tempalate>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </template>
                        <tr v-if="!isExport && !filing">
                            <td colspan="6" class="t-c" style="background: #E7E6E6;cursor: pointer;" @click="addProjectGroup">+新增投入项目</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-footer">
                    <div class="flex">
                        编制人：
                        <span class="underline" style="width: auto; min-width: 80px;">{{info.PreparedByName}}</span>
                        <el-button size="small" @click="chooseUser('PreparedBy', 'PreparedByName')" v-if="!isExport && !filing">选择</el-button>
                    </div>
                    <div class="flex">
                        负责人：
                        <span class="underline" style="width: auto; min-width: 80px;">{{info.PersonChargeByName}}</span>
                        <el-button size="small" @click="chooseUser('PersonChargeBy', 'PersonChargeByName')" v-if="!isExport && !filing">选择</el-button>
                    </div>
                    <div>
                        制表日期：
                        <template v-if="!isExport && !filing">
                            <el-date-picker
                                style="width: 150px !important;"
                                v-model="info.PreparedDate"
                                format="yyyy年MM月dd日"
                                value-format="yyyy-MM-dd"
                                :disabled="!!isExport"
                                type="date">
                            </el-date-picker>
                        </template>
                        <template v-else>
                            <span class="underline" style="width: auto; min-width: 120px;">{{info.PreparedDate}}</span>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button type="primary" @click.native="save()" v-if="info.Status == 0">保存</el-button>
            <el-button type="primary" @click.native="filingHandler()" v-if="filing">归档</el-button>
            <el-button type="primary" @click.native="exportPdf('fundingPlan')" v-if="info.Status > 0">导出PDF</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import formatter_mixin from "@/mixins/formatter-mixin.js";
import { Pdf } from "@/plugins/htmlToPdf.js";
import customInput from '@/components/common/custom-input.vue';
import Qs from 'qs';
const dateTimeFormate = formatter_mixin.methods.dateTimeFormate;
const classificationItem = {
    Classification: '', // 分类 ,
    Content: '', // 内容 ,
    InvestmentMoney: '', // 投入金额 ,
    ExpenditureMoney: '', // 支出金额 ,
    Remark: '', // 备注 ,
    Sort: 1, // 排序
};

const projectItem = {
    Sort: 1,
    Title: '',
    Classifications: [_extends(classificationItem)],
}
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    name: "fundingPlan",
    components: {
        customInput
    },
    mixins: [request_mixin, formatter_mixin],
    data() {
        return {
            isShow: false,
            info: {
                Year: '', // 年份
                EnterpriseName: '', // 企业 name
                Code: '', // 编号
                PreviousYearIncome: '', // 上年度营业收入
                ExtractionStandard: '', // 提取标准
                CurrentYearExtraction: '', // 本年度提取金额
                PreviousYearBalance: '', // 上年度结余金额
                CurrentYearActual: '', // 本年度实际可使用金额
                PreparedBy: '', // 编制人 
                PreparedByName: '', // 编制人 
                PersonChargeBy: '', // 负责人  
                PersonChargeByName: '', // 负责人  
                PreparedDate: '', // 制表日期
                Items: [_extends(projectItem)], // 
                Status: 0
            },
            isLoading: false,
            isExport: false,
            filing: false,
            preview: false,
			EnterpriseId: ''
        };
    },
    filters: {
        dateTimeFormate
    },
    created() {
        this.setInitData();
    },
    computed: {
        title() {
            return this.info.FundingPlanId ? '编辑' : '新增';
        },
        CurrentYearExtraction() {
            let {PreviousYearIncome=0, ExtractionStandard=0} = this.info;
            this.info.CurrentYearExtraction = PreviousYearIncome * ExtractionStandard / 100;
            return this.info.CurrentYearExtraction;
        },
        CurrentYearActual() {
            let {CurrentYearExtraction=0, PreviousYearBalance=0} = this.info;
            this.info.CurrentYearActual = (CurrentYearExtraction * 100 + PreviousYearBalance * 100) / 100;
            return this.info.CurrentYearActual;
        }
    },
    methods: {
        async show(item, {filing, preview, copy},id) {
            const loading = this.$loading({
                lock: true,
                text: '数据加载中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'transparent'
            });
            this.filing = !!filing;
            this.isExport = this.preview = !!preview;
			this.EnterpriseId = id
            if (item) {
                let res = await this.Get("/GetFundingPlan", { fundingPlanId : item.FundingPlanId,EnterpriseId: id  }).then(res => res.data);
                res.Year = res.Year + '';
                res.PreparedDate = dateTimeFormate(res.PreparedDate, 'yyyy-MM-dd');
                this.info = res;
                if (copy) {
                    this.getDefalutYearInfo();
                    this.info.Status = 0;
                    this.info.FundingPlanId = 0;
                    this.info.PreviousYearIncome = '';
                    this.info.ExtractionStandard = '';
                }
            } else {
                this.getDefalutYearInfo();
            }
            this.isShow = true;
            this.isLoading = true;
            loading.close();
        },
        close() {
            this.isShow = false;
            this.$nextTick(() => {
                this.reset();
            })
        },
        setInitData() {
            let userInfo = Qs.parse(localStorage.getItem('userinfo'));
            let date = new Date();
            this.info.Year = dateTimeFormate(date, 'yyyy');
            this.info.Code = '';
            this.info.EnterpriseName = '';
            this.info.PreviousYearIncome = '';
            this.info.ExtractionStandard = '';
            this.info.CurrentYearExtraction = '';
            this.info.PreviousYearBalance = '';
            this.info.CurrentYearActual = '';
            this.info.PreparedBy = userInfo.UserId;
            this.info.PreparedByName = userInfo.UserName;
            this.info.PersonChargeBy = userInfo.UserId;
            this.info.PersonChargeByName = userInfo.UserName;
            this.info.PreparedDate = dateTimeFormate(date, 'yyyy-MM-dd');;
            this.info.Items = [_extends(projectItem)];
            this.info.Status = 0;
            delete this.info.FundingPlanId;
        },
        reset() {
            this.isLoading = false;
            this.setInitData();
        },
        getParams() {
            let params = {
                ...this.info
            };
            return params;
        },
        async save() {
            if (!this.info.PreparedBy) {
                return this.$message.error('请选择编制人');
            }
            if (!this.info.PersonChargeBy) {
                return this.$message.error('请选择负责人')
            }
            let res = await this.Post('/SaveFundingPlan', this.getParams());
            if (res.status === 2000) {
                this.$message.success('保存成功');
                this.close();
                this.$emit('success');
            } else {
                this.$message.error(res.message);
            }
        },
        exportPdf(id){
            const loading = this.$loading({
                lock: true,
                text: '正在导出中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, .5)'
            });
            this.isExport = true;
            this.$nextTick(async () => {
                try {
                    await Pdf.downPdf(id, `${this.info.Year}年度安全生产经费投入计划.pdf`)
                } catch (error) {
                    console.error(error)
                }
                loading.close();
                this.isExport = this.preview;
            })
        },
        addProjectGroup() {
            let obj = _extends(projectItem);
            let lastItem = this.info.Items[this.info.Items.length - 1];
            if (lastItem) {
                obj.Sort += lastItem.Sort;
            }
            this.info.Items.push(obj);
        },
        addProject(list, index) {
            let obj = _extends(classificationItem);
            let lastItem = list[index];
            if (lastItem) {
                obj.Sort += lastItem.Sort;
            }
            list.splice(list.length, 0, obj);
        },
        removeProject(list, index, cIndex) {
            list.splice(index, 1);
        },
        
        changeYear() {
            this.getDefalutYearInfo(this.info.Year);
        },
        async getDefalutYearInfo(year = 0) {
            let res = await this.Get(`/GetFundingPlanDefault?Year=${year}&&EnterpriseId=${this.EnterpriseId}`);
            if (res.status == 2000) {
                res.data.Year = res.data.Year + '';
                Object.assign(this.info, res.data);
            }
        },
        async filingHandler() {
            let params = {
                FundingPlanId: this.info.FundingPlanId,
                List: this.info.Items.reduce((a,b) => {
                    a.push(...b.Classifications);
                    return a;
                }, [])
            };
            for (let i = 0; i < params.List.length; i++) {
                let item = params.List[i];
                if (+item.InvestmentMoney != +item.ExpenditureMoney && !item.Remark) {
                    this.$message.error(`${item.Classification}分类的投入金额与支出金额不一致，请添加备注！`);
                    return;
                }
            }
            let res = await this.Post('/FileFundingPlan', params);
            if (res.status === 2000) {
                this.$message.success('已归档');
                this.close();
                this.$emit('success');
            } else {
                this.$message.error(res.message);
            }
        },
        chooseUser(id, name) {
            this.$chooseUser({
                single: false,
            }).then(res => {
                this.info[id] = res.UserId;
                this.info[name] = res.UserName;
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.funding-plan-detail {
    .container {
        padding: 15px;
    }
    &.el-dialog__wrapper {
        display: block;
    }
    /deep/ .el-dialog__body {
        padding: 15px 16px !important;
        color: #000;
    }
    .h1{
        display: flex;
        justify-content: center;
        font-size: 26px;
        font-weight: 600;
        line-height: 28px;
        color: #000;
        .date-picker{
            width: 90px;
            .el-date-editor{
                width: 90px;
            }
            /deep/ .el-input__inner{
                border: 0;
                border-bottom: 1px solid #000;
                border-radius: 0;
                padding: 0;
                text-align: center;
                font-size: 26px;
                line-height: 28px;
                color: #000;
                font-weight: 600;
                height: auto;
            }
            /deep/ .el-input__prefix{
                display: none;
            }
        }
    }
    .flex{
        display: flex;
    }
    .f-b{
        display: flex;
        justify-content: space-between;
    }
    .t-r{
        text-align: right;
    }
    .t-c{
        text-align: center;
        /deep/ .el-input__inner, input{
            text-align: center;
        }
    }
    .f-12{
        font-size: 12px;
    }
    .table-container{
        margin-top: 20px;
    }
    .table-content {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        td {
            padding: 0 8px;
            height: 35px;
        }
        /deep/ .el-input__inner{
            border: 0;
            padding: 0;
            border-radius: 0;
            line-height: 35px;
            height: 35px;
        }
        /deep/ .el-textarea__inner{
            border: 0;
            padding: 0;
            height: 100%;
        }
        /deep/ .el-textarea{
            height: 100%;
        }
        .custom-icon{
            flex: .5 .5 15px;
            width: 14px;
            height: 14px;
            border-radius: 14px;
            color: #fff;
            line-height: 14px;
            text-align: center;;
            background: #C0C4CC;
            cursor: pointer;
            &.add{
                background: #409EFF;
            }
        }
    }
    .table-footer{
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        font-size: 18px;
        white-space: nowrap;
        line-height: 28px;
        /deep/ .el-input__inner{
            border: 0;
            border-bottom: 1px solid #000;
            border-radius: 0;
            color: #000;
            font-size: 18px;
            height: auto;
            padding: 0;
            line-height: 28px;
        }
        /deep/ .el-input__suffix{
            display: none;
        }
        /deep/ .el-date-editor{
            .el-input__inner{
                text-align: center;
            }
        }
        /deep/ .el-input__prefix{
            display: none;
        }
        .select-input-width{
            /deep/ .el-input__inner{
                width: 80px;
            }
        }
    }
    /deep/ .el-input.is-disabled .el-input__inner{
        background: #fff;
        color: #000;
    }
    /deep/ .el-input__inner::-webkit-outer-spin-button,
    /deep/ .el-input__inner::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    /deep/ .el-input__inner[type="number"] {
        -moz-appearance: textfield;
    }
    .underline{
        border-bottom: 1px solid #000;
        display: inline-block;
        width: 100%;
        min-height: 24px;
        text-align:center;
    }
}
</style>
<style>
.custom-width{
    width: 120px !important;
}
</style>
