<template>
    <!-- 断路作业 -->
    <table
        class="table-content"
    >
        <colgroup>
            <col width="70px"/>
            <col width="180px"/>
            <col width="30px"/>
            <col width="240px"/>
            <col width="240px"/>
            <col width="240px"/>
            <col width="150px"/>
            <col width="20px"/>
            <col width="130px"/>
        </colgroup>
        <tr>
            <td colspan="3">作业申请单位</td>
            <td>{{ baseInfo.ApplyCompany }}</td>
            <td>作业单位</td>
            <td>{{ baseInfo.Company }}</td>
            <td colspan="2">作业负责人</td>
            <td>{{ getValueByName('作业负责人') }}</td>
        </tr>
        <tr>
            <td colspan="3">涉及相关单位（部门）</td>
            <td colspan="3">{{ specialFields.field1 }}</td>
            <td colspan="2">监护人</td>
            <td>{{ getValueByName('监护人') }}</td>
        </tr>
        <tr>
            <td colspan="3">断路原因</td>
            <td colspan="6">{{ specialFields.field2 }}</td>
        </tr>
        <tr>
            <td colspan="3">关联的其它特殊作业及<br/>安全作业票编号</td>
            <td colspan="6">{{ joinJob }}</td>
        </tr>
        <!-- 
            * field1: 涉及相关单位（部门）
            * field2: 断路原因
            * field3: 断路地段示意图（可另附图）及相关说明
            * field4: 附图
            * field5: 编制人签字
            * field6: 编制人签字时间
        -->
        <tr>
            <td colspan="9">
                <div style="text-align: left;">断路地段示意图（可另附图）及相关说明：</div>
                <div style="text-align: left;">
                    {{ specialFields.field3 }}
                    <template v-for="(item, index) in specialFields.field4">
                        <img style="width: 50px;height: 50px" :src="item.url" :key="index">
                    </template>
                </div>
                <div style="text-align: right;">
                    签字：
                    <img style="width: 60px;height: 30px;" :src="specialFields.field5" />
                    {{ specialFields.field6 | format(dateFormatStr) }}
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="3">风险辨识结果</td>
            <td colspan="6">{{ riskResult }}</td>
        </tr>
        <tr>
            <td colspan="3">作业实施时间</td>
            <td colspan="6">自 {{ baseInfo.JobTicketStartTimeDesc | format(dateFormatStr) }} 至 {{ baseInfo.JobTicketEndTimeDesc | format(dateFormatStr) }} 止</td>
        </tr>
        <tr>
            <td>序号</td>
            <td colspan="5">安全措施</td>
            <td>是否涉及</td>
            <td colspan="2">确认人</td>
        </tr>
        <!-- 安全措施 -->
        <template v-for="(item, index) in measureList">
            <tr :key="index">
                <td>{{ index + 1}}</td>
                <td colspan="5" style="text-align:left;">{{ item.Content }}</td>
                <td><span v-if="item.IsRelate > -1">{{ item.IsRelate == 1 ? '√' : '×' }}</span></td>
                <td colspan="2">
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
                <td colspan="6" style="text-align:left;">
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
                <td colspan="2"></td>
            </tr>
        </template>
        <tr>
            <td colspan="2">安全交底人</td>
            <td colspan="3">
                <template v-for="(sign, i) in disclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
            <td>接受交底人</td>
            <td colspan="3">
                <template v-for="(sign, i) in acceptDisclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="9">
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
            <td colspan="9">
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
            <td colspan="9">
                <div>消防、安全管理部门意见</div>
                <div class="clearbox">
                    <div style="float: right;display: flex;align-items:flex-end;min-width: 200px;">
                        <div>签字：</div>
                        <div>
                            <template v-for="(sign, i) in getApprovalUserInfoByName('消防、安全管理部门')">
                                <span :key="i">
                                    <img style="width: 60px;height: 30px;" :src="sign.SignInUrl" />
                                    <span style="margin-left: 10px;">{{ sign.ApprovalTimeDesc | format(dateFormatStr) }}</span>
                                    <br />
                                </span>
                            </template>
                        </div>
                    </div>
                    <div style="padding-top: 17px;">
                        <template  v-for="(item, index) in getApprovalUserInfoByName('消防、安全管理部门')">
                            <span :key="index">{{ item.ApprovalOpinion }}</span>
                        </template>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="9">
                <div>审批部门意见</div>
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
            <td colspan="9">
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
             * field1: 涉及相关单位（部门）
             * field2: 断路原因
             * field3: 断路地段示意图（可另附图）及相关说明
             * field4: 附图
             * field5: 编制人签字
             * field6: 编制人签字时间
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