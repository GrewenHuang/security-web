<template>
    <!-- 受限空间作业 -->
    <table
        class="table-content"
    >
        <colgroup>
            <col width="70px"/>
            <col width="110px"/>
            <col width="90px"/>
            <col width="50px"/>
            <col width="100px"/>
            <col width="90px"/>
            <col width="60px"/>
            <col width="40px"/>
            <col width="100px"/>
            <col width="180px"/>
            <col width="70px"/>
            <col width="40px"/>
            <col width="80px"/>
            <col width="20px"/>
            <col width="100px"/>
        </colgroup>
        <tr>
            <td colspan="3">作业申请单位</td>
            <td colspan="4">{{ baseInfo.ApplyCompany }}</td>
            <td colspan="3">作业申请时间</td>
            <td colspan="5">{{ baseInfo.ApplyTimeDesc | format(dateFormatStr) }}</td>
        </tr>
        <!-- 
            specialFields
            * field1: 受限空间名称
            * field2: 受限空间内原有介质名称
            * field3: 作业内容
         -->
        <tr>
            <td colspan="3">受限空间名称</td>
            <td colspan="4">{{ specialFields.field1 }}</td>
            <td colspan="3">受限空间内原有介质名称</td>
            <td colspan="5">{{ specialFields.field2 }}</td>
        </tr>
        <tr>
            <td colspan="3">作业内容</td>
            <td colspan="12">{{ specialFields.field3 }}</td>
        </tr>
        <tr>
            <td colspan="3">作业单位</td>
            <td colspan="4">{{ baseInfo.Company }}</td>
            <td colspan="3">作业负责人</td>
            <td colspan="5">{{ getValueByName('作业负责人') }}</td>
        </tr>
        <tr>
            <td colspan="3">作业人</td>
            <td colspan="4">{{ getValueByName('作业人') }}</td>
            <td colspan="3">监护人</td>
            <td colspan="5">{{ getValueByName('监护人') }}</td>
        </tr>
        <tr>
            <td colspan="3">关联的其它特殊作业<br/>及安全作业票编号</td>
            <td colspan="12">{{ joinJob }}</td>
        </tr>
        <tr>
            <td colspan="3">风险辨识结果</td>
            <td colspan="12">{{ riskResult }}</td>
        </tr>
        <!-- 分析 -->
        <tr>
            <td colspan="2" rowspan="5">气体分析</td>
            <td colspan="2" rowspan="2">分析项目</td>
            <td colspan="2">有毒有害气体名称</td>
            <td colspan="3">可燃气体名称</td>
            <td rowspan="2">氧气含量<br/>（体积分数）</td>
            <td colspan="2" rowspan="3">取样分析<br/>时间</td>
            <td colspan="2" rowspan="3">分析部位</td>
            <td rowspan="3">分析人</td>
        </tr>
        <tr>
            <td>{{ getAnalyseByIndex(0).toxicName1 }}</td>
            <td>{{ getAnalyseByIndex(0).toxicName2 }}</td>
            <td colspan="2">{{ getAnalyseByIndex(0).combustibleName1 }}</td>
            <td>{{ getAnalyseByIndex(0).combustibleName2 }}</td>
        </tr>
        <tr>
            <td colspan="2">合格标准</td>
            <td>{{ getAnalyseByIndex(0).toxicStandard1 }}</td>
            <td>{{ getAnalyseByIndex(0).toxicStandard2 }}</td>
            <td colspan="2">{{ getAnalyseByIndex(0).combustibleStandard1 }}</td>
            <td>{{ getAnalyseByIndex(0).combustibleStandard2 }}</td>
            <td>19.5% ~ 21%</td>
        </tr>
        <!-- 
            getAnalyseByIndex
            field1: '', // 氧气含量（19.5%~21%）
            field2: '月 日 时 分', // 取样分析时间
            field3: '', // 分析部位
            field4: '', // 分析人
        -->
        <tr>
            <td colspan="2" rowspan="2">分析数据</td>
            <td>{{ getAnalyseByIndex(0).toxic1 }}</td>
            <td>{{ getAnalyseByIndex(0).toxic2 }}</td>
            <td colspan="2">{{ getAnalyseByIndex(0).combustible1 }}</td>
            <td>{{ getAnalyseByIndex(0).combustible2 }}</td>
            <td>{{ getAnalyseByIndex(0).field1 }}</td>
            <td colspan="2">{{ getAnalyseByIndex(0).field2 }}</td>
            <td colspan="2">{{ getAnalyseByIndex(0).field3 }}</td>
            <td>{{ getAnalyseByIndex(0).field4 }}</td>
        </tr>
        <tr>
            <td>{{ getAnalyseByIndex(1).toxic1 }}</td>
            <td>{{ getAnalyseByIndex(1).toxic2 }}</td>
            <td colspan="2">{{ getAnalyseByIndex(1).combustible1 }}</td>
            <td>{{ getAnalyseByIndex(1).combustible2 }}</td>
            <td>{{ getAnalyseByIndex(1).field1 }}</td>
            <td colspan="2">{{ getAnalyseByIndex(1).field2 }}</td>
            <td colspan="2">{{ getAnalyseByIndex(1).field3 }}</td>
            <td>{{ getAnalyseByIndex(1).field4 }}</td>
        </tr>
        <tr>
            <td colspan="2">作业实施时间</td>
            <td colspan="13">自 {{ baseInfo.JobTicketStartTimeDesc | format(dateFormatStr) }} 至 {{ baseInfo.JobTicketEndTimeDesc | format(dateFormatStr) }} 止</td>
        </tr>
        <tr>
            <td>序号</td>
            <td colspan="10">安全措施</td>
            <td colspan="2">是否涉及</td>
            <td colspan="2">确认人</td>
        </tr>
        <!-- 安全措施 -->
        <template v-for="(item, index) in measureList">
            <tr :key="index">
                <td>{{ index + 1}}</td>
                <td colspan="10" style="text-align:left;">{{ item.Content }}</td>
                <td colspan="2"><span v-if="item.IsRelate > -1">{{ item.IsRelate == 1 ? '√' : '×' }}</span></td>
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
                <td colspan="12" style="text-align:left;">
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
            <td colspan="6">
                <template v-for="(sign, i) in disclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
            <td colspan="2">接受交底人</td>
            <td colspan="5">
                <template v-for="(sign, i) in acceptDisclosure">
                    <img style="width: 60px;height: 30px;" :key="i" :src="sign.SignInUrl" />
                </template>
            </td>
        </tr>
        <tr style="text-align:left;">
            <td colspan="15">
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
            <td colspan="15">
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
            <td colspan="15">
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
            let itemList = [];
            AnalyseInfo.forEach(item => {
                let itemJSON = JSON.parse(item.ItemJson);
                let arr = [];
                itemJSON.list.forEach((fields, i) => {
                    let obj = {};
                    fields.forEach(field => {
                        if (field.key == 'field4') {
                            obj[field.key] = field.value.UserName;
                        } else if (field.key == 'field2') {
                            obj[field.key] = util.formatDate.format(field.value, 'MM月dd日 hh:mm');
                        } else {
                            obj[field.key] = field.value;
                        }
                    });
                    arr.push(obj)
                });
                list.push(...arr);
                itemList.push(...itemJSON.itemList);
            });
            list.sort((a, b) => {
                return new Date(a.field1) - new Date(b.field1)
            });
            let toxicIndex = 1;
            let combustibleIndex = 1;
            list.forEach(item => {
                for (let key in item) {
                    let joinItemFields = itemList.find(fields => fields[0].joinField == key);
                    if (joinItemFields) {
                        let [field, field1, field2] = joinItemFields; // field: 类型， field1: 类型名称， field2: 类型合格标准
                        if (field.value.id == 1) {
                            // 有毒有害气体
                            // toxic1 有毒有害气体 值
                            // toxicName1 有毒有害气体 名称
                            // toxicStandard1 有毒有害气体 标准
                            item['toxic' + toxicIndex] = item[key];
                            item['toxicName' + toxicIndex] = field1.value;
                            item['toxicStandard' + toxicIndex] = field2.value;
                            toxicIndex++;
                        } else if (field.value.id == 2){
                            // 可燃气体
                            // combustible1 可燃气体 值
                            // combustibleName1 可燃气体 名称
                            // combustibleStandard1 可燃气体标准
                            item['combustible' + combustibleIndex] = item[key];
                            item['combustibleName' + combustibleIndex] = field1.value;
                            item['combustibleStandard' + combustibleIndex] = field2.value;
                            combustibleIndex++;
                        }
                    }
                }
                toxicIndex = 1;
                combustibleIndex = 1;
            })
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
             * field1: 受限空间名称
             * field2: 受限空间内原有介质名称
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
                return item.Users.map(user => user.UserName).join('、');
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
                field1: '', // 氧气含量（19.5%~21%）
                field2: '月 日 时 分', // 取样分析时间
                field3: '', // 分析部位
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
}
</style>