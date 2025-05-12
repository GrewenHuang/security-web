<template>
    <!-- 动火作业 -->
    <table
        class="table-content"
    >
        <colgroup>
            <col width="70px"/>
            <col width="80px"/>
            <col width="40px"/>
            <col width="200px"/>
            <col width="20px"/>
            <col width="30px"/>
            <col width="150px"/>
            <col width="40px"/>
            <col width="120px"/>
            <col width="70px"/>
            <col width="100px"/>
        </colgroup>
        <tr>
            <td colspan="3">作业申请单位</td>
            <td colspan="3">{{ baseInfo.ApplyCompany }}</td>
            <td>作业申请时间</td>
            <td colspan="4">{{ baseInfo.ApplyTimeDesc | format(dateFormatStr) }}</td>
        </tr>
        <!-- 
             * level: 动火作业级别
             * field1: 动火地点及动火部位
             * field2: 动火方式
             * field3: 作业内容
         -->
        <tr>
            <td colspan="3">作业内容</td>
            <td colspan="3">{{ specialFields.field3 }}</td>
            <td>动火地点<br/>及动火部位</td>
            <td colspan="4">{{ specialFields.field1 }}</td>
        </tr>
        <tr>
            <td colspan="3">动火级别</td>
            <td colspan="3">
                <div style="display: flex;justify-content: center;">
                    <div style="margin-right:10px;">特级<span class="checkbox" :class="{checked: specialFields.level == 0}"></span></div>
                    <div style="margin-right:10px;">一级<span class="checkbox" :class="{checked: specialFields.level == 1}"></span></div>
                    <div>二级<span class="checkbox" :class="{checked: specialFields.level == 2}"></span></div>
                </div>
            </td>
            <td>动火方式</td>
            <td colspan="4">{{ specialFields.field2 }}</td>
        </tr>
        <tr>
            <td colspan="3">动火人及证书编号</td>
            <td colspan="8">{{ getValueByName('动火人') }}</td>
        </tr>
        <tr>
            <td colspan="3">作业单位</td>
            <td colspan="3">{{ baseInfo.Company }}</td>
            <td>作业负责人</td>
            <td colspan="4">{{ getValueByName('作业负责人') }}</td>
        </tr>
        <!-- 分析 -->
        <tr>
            <td colspan="3">气体取样分析时间</td>
            <td colspan="2">{{ getAnalyseByIndex(0).field1 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(1).field1 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(2).field1 }}</td>
        </tr>
        <tr>
            <td colspan="3">代表性气体</td>
            <td colspan="2">{{ getAnalyseByIndex(0).field2 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(1).field2 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(2).field2 }}</td>
        </tr>
        <tr>
            <td colspan="3">分析结果/%</td>
            <td colspan="2">{{ getAnalyseByIndex(0).field3 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(1).field3 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(2).field3 }}</td>
        </tr>
        <tr>
            <td colspan="3">分析人</td>
            <td colspan="2">{{ getAnalyseByIndex(0).field4 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(1).field4 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(2).field4 }}</td>
        </tr>
        <tr>
            <td colspan="3">关联的其他特殊作业<br/>及安全作业票编号</td>
            <td colspan="8">{{ joinJob }}</td>
        </tr>
        <tr>
            <td colspan="3">风险辨识结果</td>
            <td colspan="8">{{ riskResult }}</td>
        </tr>
        <tr>
            <td colspan="3">动火作业实施时间</td>
            <td colspan="8">自 {{ baseInfo.JobTicketStartTimeDesc | format(dateFormatStr) }} 至 {{ baseInfo.JobTicketEndTimeDesc | format(dateFormatStr) }} 止</td>
        </tr>
        <tr>
            <td>序号</td>
            <td colspan="8">安全措施</td>
            <td>是否<br/>涉及</td>
            <td>确认人</td>
        </tr>
        <!-- 安全措施 -->
        <template v-for="(item, index) in measureList">
            <tr :key="index">
                <td>{{ index + 1}}</td>
                <td colspan="8" style="text-align:left;">{{ item.Content }}</td>
                <td><span v-if="item.IsRelate > -1">{{ item.IsRelate == 1 ? '√' : '×' }}</span></td>
                <td>
                    <template v-for="(sign, i) in item.SignList">
                        <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl">
                    </template>
                </td>
            </tr>
        </template>
        <!-- 自定义安全措施 -->
        <template v-if="!!otherMeasure.signList.length">
            <tr>
                <td>{{ measureList.length + 1}}</td>
                <td colspan="8" style="text-align:left;">
                    <div>
                        其他安全措施：
                    </div>
                    <div class="clearbox">
                        <div style="float: right;">
                            编制人：
                            <template v-for="(sign, i) in otherMeasure.signList">
                                <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                            </template>
                        </div>
                        <div style="padding-top: 17px;">
                            <template  v-for="(item, index) in otherMeasure.measures">
                                <span :key="index">{{ item }}</span>
                            </template>
                        </div>
                    </div>
                </td>
                <td></td>
                <td></td>
            </tr>
        </template>
        <tr>
            <td colspan="2">安全交底人</td>
            <td colspan="2">
                <template v-for="(sign, i) in disclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
            <td colspan="3">接受交底人</td>
            <td colspan="4">
                <template v-for="(sign, i) in acceptDisclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="11">
                <div>作业负责人意见</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in getApprovalUserInfoByName('作业负责人')">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.ApprovalTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in getApprovalUserInfoByName('作业负责人')">
                            <span :key="index">{{ item.ApprovalOpinion }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="11">
                <div>所在单位意见</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in getApprovalUserInfoByName('部门领导')">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.ApprovalTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in getApprovalUserInfoByName('部门领导')">
                            <span :key="index">{{ item.ApprovalOpinion }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="11">
                <div>安全管理部门意见</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in getApprovalUserInfoByName('安全员')">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.ApprovalTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in getApprovalUserInfoByName('安全员')">
                            <span :key="index">{{ item.ApprovalOpinion }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="11">
                <div>动火审批人意见</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in getApprovalUserInfoByName('分管安全领导')">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.ApprovalTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in getApprovalUserInfoByName('分管安全领导')">
                            <span :key="index">{{ item.ApprovalOpinion }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="11">
                <div>动火前，岗位当班班长验票情况</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in inspectTicket">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.RecordTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in inspectTicket">
                            <span :key="index">{{ item.Remark }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="11">
                <div>完工验收</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in checkAccept">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.RecordTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in checkAccept">
                            <span :key="index">{{ item.Remark }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</template>

<script>
import util from '@/common/util';
export default {
    props: {
        info: {
            type: [Object, Array],
            default() {
                return {}
            }
        }
    },
    computed: {
        baseInfo() {
            return this.info.BaseInfo
        },
        users() {
            return this.info.UsersInfo
        },
        joinJob() {
            let { AssociatedJobs } = this.baseInfo;
            return (AssociatedJobs || []).map(item => `${item.AssociatedJobTemplateName} ${item.AssociatedJobNumber}`).join('、')
        },
        analyseList() {
            let { AnalyseInfo } = this.info;
            let list = [];
            AnalyseInfo.forEach(item => {
                let itemJSON = JSON.parse(item.ItemJson);
                let arr = [];
                itemJSON.list.forEach(fields => {
                    let obj = {};
                    fields.forEach(field => {
                        if (field.key == 'field4') {
                            obj[field.key] = field.value.UserName;
                        } else if (field.key == 'field1') {
                            obj[field.key] = util.formatDate.format(field.value, 'MM月dd日 hh时mm分');
                        } else {
                            obj[field.key] = field.value;
                        }
                    });
                    arr.push(obj)
                });
                list.push(...arr);
            });
            list.sort((a, b) => {
                return new Date(a.field1) - new Date(b.field1)
            });
            return list;
        },
        riskResult() {
            let { AnalyseInfo } = this.info;
            let results = [];
            AnalyseInfo.forEach(item => {
               let itemJSON = JSON.parse(item.ItemJson);
               results.push(...itemJSON.riskIndentification.map(o=>o.Name));
            });
            return Array.from(new Set(results)).join('、');
        },
        measureList() {
            let { SafetyMeasuresInfo } = this.info;
            return (SafetyMeasuresInfo || []).filter(item => item.IsOther == 0);
        },
        otherMeasure() {
            let { SafetyMeasuresInfo } = this.info;
            let measureList = (SafetyMeasuresInfo || []).filter(item => item.IsOther == 1);
            let signList = measureList.reduce((a,b)=>{
                a.push(...b.SignList);
                return a
            }, []);
            let measures = measureList.map(item=>item.Content);

            return {
                signList,
                measures
            };
        },
        // 交底字段
        disclosure() {
            let { SafetyDisclosureInfo } = this.info;
            let signList = (SafetyDisclosureInfo || []).reduce((a,b) => {
                a.push(...b.SignList);
                return a;
            }, []);
            return signList;
        },
        // 接受交底
        acceptDisclosure() {
            let { ReceiveSafetyDisclosureInfo } = this.info;
            let signList = (ReceiveSafetyDisclosureInfo || []).reduce((a,b) => {
                a.push(...b.SignList);
                return a;
            }, []);
            return signList;
        },
        // 验收
        checkAccept() {
            let { CheckAcceptInfo } = this.info;
            return CheckAcceptInfo.map(item => {
                return {
                    ...item,
                    SignInUrl: item.SignList.map(o=>o.SignInUrl)[0]
                }
            })
        },
        // 验票
        inspectTicket() {
            let { InspectTicketInfo } = this.info;
            return InspectTicketInfo.map(item => {
                return {
                    ...item,
                    SignInUrl: item.SignList.map(o=>o.SignInUrl)[0]
                }
            })
        },
        specialFields() {
            let { Content: content } = this.baseInfo;
            content = JSON.parse(content);
            /**
             * level: 动火作业级别
             * field1: 动火地点及动火部位
             * field2: 动火方式
             * field3: 作业内容
            */
            return content;
        }
    },
    data() {
        return {
            dateFormatStr: 'yyyy年MM月dd日HH时mm分'
        }
    },
    methods: {
        getValueByName(name) {
            let item = this.users.find(item => item.Name == name);
            if (item) {
                return item.Users.map(user => {
                    let userName = user.UserName;
                    if (name == '动火人' && user.CertificateNo) {
                        userName += ' '+ user.CertificateNo;
                    }
                    return userName;
                }).join('、');
            }
            return '';
        },
        getApprovalUserInfoByName(name) {
            let { ApprovalInfo: list } = this.info;
            let item = list.find( item => item.ApprovalNode == name);
            
            return ((item||{}).Users||[]).filter(user => !!user.SignInUrl);
        },
        getAnalyseByIndex(index) {
            return this.analyseList[index] || {
                field1: '月 日 时 分', // 气体取样分析时间
                field2: '', // 代表性气体
                field3: '', // 分析结果/%
                field4: '', // 分析人
            }
        },
    },
}
</script>

<style lang="scss" scoped>
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
    .checkbox{
        position: relative;
        display:inline-block;
        border:1px solid #000;
        width:13px;
        height:13px;
        vertical-align: text-bottom;
        &.checked{
            &::before{
                content: '√';
                position: absolute;
                top: -10px;
                left: -6px;
                z-index: 2;
                font-size: 23px;
            }
        }
    }
}
</style>