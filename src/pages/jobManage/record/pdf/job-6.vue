<template>
    <!-- 临时用电作业 -->
    <table
        class="table-content"
    >
        <colgroup>
            <col width="70px"/>
            <col width="180px"/>
            <col width="220px"/>
            <col width="10px"/>
            <col width="180px"/>
            <col width="30px"/>
            <col width="170px"/>
            <col width="20px"/>
            <col width="100px"/>
            <col width="20px"/>
            <col width="5px"/>
            <col width="100px"/>
            <col width="100px"/>
        </colgroup>
        <tr>
            <td colspan="2">作业申请单位</td>
            <td colspan="3">{{ baseInfo.ApplyCompany }}</td>
            <td colspan="2">作业申请时间</td>
            <td colspan="6">{{ baseInfo.ApplyTimeDesc | format(dateFormatStr) }}</td>
        </tr>
        <!-- 
            specialFields
            * field1: 作业地点
            * field2: 作业内容
            * field3: 电源接入点及许可用电功率
            * field4: 工作电压
            * field5: 用电设备名称及额定功率
         -->
        <tr>
            <td colspan="2">作业地点</td>
            <td colspan="3">{{ specialFields.field1 }}</td>
            <td colspan="2">作业内容</td>
            <td colspan="6">{{ specialFields.field2 }}</td>
        </tr>
        <tr>
            <td colspan="2">电源接入点及许可用<br/>电功率</td>
            <td colspan="3">{{ specialFields.field3 }}</td>
            <td colspan="2">工作电压</td>
            <td colspan="6">{{ specialFields.field4 }}</td>
        </tr>
        <tr>
            <td colspan="2">用电设备名称及额定<br/>功率</td>
            <td colspan="2">{{specialFields.field5 }}</td>
            <td>监护人</td>
            <td colspan="2">{{  getValueByName('监护人')  }}</td>
            <td colspan="4">用电人</td>
            <td colspan="2">{{  getValueByName('用电人')  }}</td>
        </tr>
        <tr>
            <td colspan="2">作业人</td>
            <td colspan="3">{{ getValueByName('作业人') }}</td>
            <td colspan="2">电工证</td>
            <td colspan="6">{{ getCertNoByName('作业人') }}</td>
        </tr>
        <tr>
            <td colspan="2">作业负责人</td>
            <td colspan="3">{{ getValueByName('作业负责人') }}</td>
            <td colspan="2">电工证</td>
            <td colspan="6">{{ getCertNoByName('作业负责人') }}</td>
        </tr>
        <tr>
            <td colspan="2">关联的其它特殊作业<br/>及安全作业票编号</td>
            <td colspan="11">{{ joinJob }}</td>
        </tr>
        <tr>
            <td colspan="2">风险辨识结果</td>
            <td colspan="11">{{ riskResult }}</td>
        </tr>
        <tr>
            <td colspan="13">可燃气体分析（运行的生产装置、罐区和具有火灾爆炸危险场所）</td>
        </tr>
        <tr>
            <td colspan="2">分析时间</td>
            <td>{{ getAnalyseByIndex(0).field3 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(1).field3 }}</td>
            <td colspan="2">分析点</td>
            <td colspan="5">{{ getAnalyseByIndex(0).field1 }}</td>
        </tr>
        <tr>
            <td colspan="2">可燃气体检测结果</td>
            <td>{{ getAnalyseByIndex(0).field4 }}</td>
            <td colspan="3">{{ getAnalyseByIndex(1).field4 }}</td>
            <td colspan="2">分析人</td>
            <td colspan="5">{{ getAnalyseByIndex(0).field2 }}</td>
        </tr>
        <tr>
            <td colspan="2">作业实施时间</td>
            <td colspan="11">自 {{ baseInfo.JobTicketStartTimeDesc | format(dateFormatStr) }} 至 {{ baseInfo.JobTicketEndTimeDesc | format(dateFormatStr) }} 止</td>
        </tr>
        <tr>
            <td>序号</td>
            <td colspan="9">安全措施</td>
            <td colspan="2">是否涉及</td>
            <td>确认人</td>
        </tr>
        <!-- 安全措施 -->
        <template v-for="(item, index) in measureList">
            <tr :key="index">
                <td>{{ index + 1}}</td>
                <td colspan="9" style="text-align:left;">{{ item.Content }}</td>
                <td colspan="2"><span v-if="item.IsRelate > -1">{{ item.IsRelate == 1 ? '√' : '×' }}</span></td>
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
                <td colspan="11" style="text-align:left;">
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
            </tr>
        </template>
        <tr>
            <td colspan="2">安全交底人</td>
            <td colspan="3">
                <template v-for="(sign, i) in disclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
            <td colspan="4">接受交底人</td>
            <td colspan="4">
                <template v-for="(sign, i) in acceptDisclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="13">
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
            <td colspan="13">
                <div>用电单位意见</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in getApprovalUserInfoByName('用电单位')">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.ApprovalTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in getApprovalUserInfoByName('用电单位')">
                            <span :key="index">{{ item.ApprovalOpinion }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="13">
                <div>配送电单位意见</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in getApprovalUserInfoByName('配送电单位')">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.ApprovalTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in getApprovalUserInfoByName('配送电单位')">
                            <span :key="index">{{ item.ApprovalOpinion }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="13">
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
        // 分析
        analyseList() {
            let { AnalyseInfo } = this.info;
            let list = [];
            AnalyseInfo.forEach(item => {
                let itemJSON = JSON.parse(item.ItemJson);
                let arr = [];
                itemJSON.list.forEach(fields => {
                    let obj = {};
                    fields.forEach(field => {
                        if (field.key == 'field2') {
                            obj[field.key] = field.value.UserName;
                        } else if (field.key == 'field3') {
                            obj[field.key] = util.formatDate.format(field.value, 'hh时mm分'); // MM月dd日
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
        specialFields() {
            let { Content: content } = this.baseInfo;
            content = JSON.parse(content);
            /**
             * field1: 作业地点
             * field2: 作业内容
             * field3: 电源接入点及许可用电功率
             * field4: 工作电压
             * field5: 用电设备名称及额定功率
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
                return item.Users.map(user => user.UserName).join('、');
            }
            return '';
        },
        getCertNoByName(name) {
            let item = this.users.find(item => item.Name == name);
            if (item) {
                return item.Users.map(user => user.CertificateNo).join('、');
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
                field1: '', // 分析点
                field2: '', // 分析人
                field3: '月 日 时 分', // 分析时间
                field4: '', // 可燃气体检测结果
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
}
</style>