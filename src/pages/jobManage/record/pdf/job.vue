<template>
    <!-- 常规作业 -->
    <table
        class="table-content"
    >
        <colgroup>
            <col width="70px"/>
            <col width="210px"/>
            <col width="280px"/>
            <col width="280px"/>
            <col width="140px"/>
            <col width="140px"/>
        </colgroup>
        <tr>
            <td colspan="2">作业申请单位</td>
            <td>{{ baseInfo.ApplyCompany }}</td>
            <td>作业申请时间</td>
            <td colspan="2">{{ baseInfo.ApplyTimeDesc | format(dateFormatStr) }}</td>
        </tr>
        <tr>
            <td colspan="2">作业单位</td>
            <td>{{ baseInfo.Company }}</td>
            <td>监护人</td>
            <td colspan="2">{{ getValueByName('监护人') }}</td>
        </tr>
        <tr>
            <td colspan="2">作业人</td>
            <td>{{ getValueByName('作业人') }}</td>
            <td>作业负责人</td>
            <td colspan="2">{{ getValueByName('作业负责人') }}</td>
        </tr>
        <tr>
            <td colspan="2">作业内容</td>
            <td colspan="4">{{ specialFields.Content }}</td>
        </tr>
        <tr>
            <td colspan="2">关联的其它特殊作业及安全作业票编号</td>
            <td colspan="4">{{ joinJob }}</td>
        </tr>
        <tr>
            <td colspan="2">风险辨识结果</td>
            <td colspan="4">{{ riskResult }}</td>
        </tr>
        <tr>
            <td colspan="2">作业实施时间</td>
            <td colspan="4">自 {{ baseInfo.JobTicketStartTimeDesc | format(dateFormatStr) }} 至 {{ baseInfo.JobTicketEndTimeDesc | format(dateFormatStr) }} 止</td>
        </tr>
        <tr>
            <td>序号</td>
            <td colspan="3">安全措施</td>
            <td>是否涉及</td>
            <td>确认人</td>
        </tr>
        <!-- 安全措施 -->
        <template v-for="(item, index) in measureList">
            <tr :key="index">
                <td>{{ index + 1}}</td>
                <td colspan="3" style="text-align:left;">{{ item.Content }}</td>
                <td>{{ item.IsRelate == 1 ? '是' : '否' }}</td>
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
                <td colspan="4" style="text-align:left;">
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
            <td>
                <template v-for="(sign, i) in disclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
            <td>接受交底人</td>
            <td colspan="2">
                <template v-for="(sign, i) in acceptDisclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="6">
                <div>作业负责人意见</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;">
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
            <td colspan="6">
                <div>完成验收</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;">
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
             * Content: 作业内容
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
        getApprovalUserInfoByName(name) {
            let { ApprovalInfo: list } = this.info;
            let item = list.find( item => item.ApprovalNode == name);
            return ((item||{}).Users||[]).filter(user => !!user.SignInUrl);
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