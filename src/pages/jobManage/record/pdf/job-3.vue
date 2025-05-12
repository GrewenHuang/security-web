<template>
    <!-- 盲板抽堵作业 -->
    <table
        class="table-content"
    >
        <colgroup>
            <col width="70px"/>
            <col width="70px"/>
            <col width="130px"/>
            <col width="20px"/>
            <col width="100px"/>
            <col width="100px"/>
            <col width="50px"/>
            <col width="130px"/>
            <col width="10px"/>
            <col width="100px"/>
            <col width="90px"/>
            <col width="60px"/>
            <col width="20px"/>
            <col width="130px"/>
            <col width="35px"/>
            <col width="150px"/>
        </colgroup>
        <tr>
            <td colspan="2">作业申请单位</td>
            <td colspan="3">{{ baseInfo.ApplyCompany }}</td>
            <td colspan="2">作业单位</td>
            <td colspan="3">{{ baseInfo.Company }}</td>
            <td colspan="2">作业类别</td>
            <td colspan="4">
                <div style="display: flex;justify-content: center;">
                    <div style="margin-right:10px;"><span class="checkbox" :class="{checked: specialFields.level == 0}"></span>堵盲板</div>
                    <div style="margin-right:10px;"><span class="checkbox" :class="{checked: specialFields.level == 1}"></span>抽盲板</div>
                </div>
            </td>
        </tr>
        <!-- 
            specialFields
            * field1: 作业类别
            * field2: 设备/管道名称
            * field3: 介质
            * field4: 温度
            * field5: 压力
            * field6: 材质
            * field7: 规格
            * field8: 编号
            * field9: 盲板位置图及编号
            * field10: 位置图
            * field11: 编制人签字
            * field12: 编制人签字时间
        -->
        <tr>
            <td colspan="2" rowspan="2">设备、管道<br />名称</td>
            <td colspan="5">管道参数</td>
            <td colspan="5">盲板参数</td>
            <td colspan="4" rowspan="2">实际作业开始时间</td>
        </tr>
        <tr>
            <td>介质</td>
            <td colspan="2">温度</td>
            <td colspan="2">压力</td>
            <td>材质</td>
            <td colspan="2">规格</td>
            <td colspan="2">编号</td>
        </tr>
        <tr>
            <td colspan="2">{{ specialFields.field2 }}</td>
            <td>{{ specialFields.field3 }}</td>
            <td colspan="2">{{ specialFields.field4 }}</td>
            <td colspan="2">{{ specialFields.field5 }}</td>
            <td>{{ specialFields.field6 }}</td>
            <td colspan="2">{{ specialFields.field7 }}</td>
            <td colspan="2">{{ specialFields.field8 }}</td>
            <td colspan="4">{{ baseInfo.JobTicketStartTimeDesc | format(dateFormatStr) }}</td>
        </tr>

        <tr>
            <td colspan="16">
                <div style="text-align: left;">盲板位置图（可另附图）及编号：</div>
                <div style="text-align: left;">
                    {{ specialFields.field9 }}
                    <template v-for="(item, index) in specialFields.field10">
                        <img style="width: 50px;height: 50px" :src="item.url" :key="index">
                    </template>
                </div>
                <div style="text-align: right;">
                    签字：
                    <img style="width: 60px;height: 30px;" :src="specialFields.field11" />
                    {{ specialFields.field12 | format(dateFormatStr) }}
                </div>
            </td>
        </tr>

        <tr>
            <td colspan="4">作业负责人</td>
            <td colspan="2">{{ getValueByName('作业负责人') }}</td>
            <td colspan="3">作业人</td>
            <td colspan="2">{{ getValueByName('作业人') }}</td>
            <td colspan="3">监护人</td>
            <td colspan="2">{{ getValueByName('监护人') }}</td>
        </tr>
        <tr>
            <td colspan="4">关联的其它特殊作业及安全作业票编号</td>
            <td colspan="12">{{ joinJob }}</td>
        </tr>
        <tr>
            <td colspan="4">风险辨识结果</td>
            <td colspan="12">{{ riskResult }}</td>
        </tr>
        <tr>
            <td>序号</td>
            <td colspan="12">安全措施</td>
            <td colspan="2">是否涉及</td>
            <td>确认人</td>
        </tr>
        <!-- 安全措施 -->
        <template v-for="(item, index) in measureList">
            <tr :key="index">
                <td>{{ index + 1}}</td>
                <td colspan="12" style="text-align:left;">{{ item.Content }}</td>
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
                <td colspan="14" style="text-align:left;">
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
            <td colspan="3">安全交底人</td>
            <td colspan="5">
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
            <td colspan="16">
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
            <td colspan="16">
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
            <td colspan="16">
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
             * field1: 作业类别
             * field2: 设备/管道名称
             * field3: 介质
             * field4: 温度
             * field5: 压力
             * field6: 材质
             * field7: 规格
             * field8: 编号
             * field9: 盲板位置图及编号
             * field10: 位置图
             * field11: 编制人签字
             * field12: 编制人签字时间
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