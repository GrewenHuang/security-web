<template>
    <div class="pitfall-item">
        <div class="form-2-col">
            <el-form-item
                label="任务名称"
                prop="TaskInspectionPlan.InspectionPlanName"
                ref="TaskInspectionPlan.InspectionPlanName"
                :rules="rules.InspectionPlanName"
            >
                <el-input placeholder="请输入" v-model.trim="TaskInspectionPlan.InspectionPlanName" :disabled="isView"></el-input>
            </el-form-item>
            <el-form-item
                label="检查表"
                prop="TaskInspectionPlan.InspectionId"
                ref="TaskInspectionPlan.InspectionPlanName"
                :rules="rules.InspectionId"
            >
                <el-input placeholder="请输入" v-model="inspection.InspectionName" readonly :disabled="isView">
                    <el-button slot="append" @click="chooseTable" v-if="!isView">请选择</el-button>
                </el-input>
            </el-form-item>
        </div>
        <el-form-item
            label="检查周期"
            prop="TaskInspectionPlan.InspectionNatureCode"
            ref="TaskInspectionPlan.InspectionNatureCode"
            :rules="rules.InspectionNatureCode"
        >
            <el-select placeholder="请选择" v-model="TaskInspectionPlan.InspectionNatureCode" @change="natureChange" :disabled="isView">
                <el-option v-for="(item, index) in list" :key="index" :label="item.text" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <!-- 综合检查需要选择检查日期 -->
        <el-form-item
            label="检查日期"
            prop="TaskInspectionPlan.InspectionPlanDate"
            ref="TaskInspectionPlan.InspectionPlanDate"
            :rules="rules.InspectionPlanDate"
            v-if="TaskInspectionPlan.InspectionNatureCode == '0030401'"
        >
            <el-date-picker
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                :disabled="isView"
                v-model="TaskInspectionPlan.InspectionPlanDate"
            ></el-date-picker>
        </el-form-item>
        <div style="margin: 0 -30px 0 -29px" v-if="!isView || TaskInspectionPlan.Enterprises && !!TaskInspectionPlan.Enterprises.length">
            <div class="global-divider"></div>
            <div class="table-content" style="padding-bottom: 0;">
                <div class="title-content f-b-c">
                    <div class="label">下发本公司人员</div>
                    <div class="f--c" v-if="!isView && enterpriseLevel < 3">
                        <el-button type="primary" @click="chooseEnterprise">添加抽查企业</el-button>
                    </div>
                </div>
                <el-table
                    v-if="TaskInspectionPlan.Enterprises.length"
                    :data="TaskInspectionPlan.Enterprises"
                    :header-cell-style="$tableStyle"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="80"
                    ></el-table-column>
                    <el-table-column
                        label="抽查企业"
                        prop="EnterpriseName"
                    ></el-table-column>
                    <el-table-column
                        label="检查人姓名"
                        align="center"
                        width="400"
                        prop="UserName"
                        show-overflow-tooltip
                    >
                        <template slot-scope="{ row }">
                            {{ row.EnterpriseUsers .map(item => item.UserName).join('、') }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="180"
                        v-if="!isView"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-button type="text" @click="appoint(row)">指定检查人</el-button>
                            <el-button type="text" text-plain @click="TaskInspectionPlan.Enterprises.splice($index, 1)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
    InspectionPlanName: '',
    InspectionId: '',
    InspectionNatureCode: '',
    InspectionNatureName: '',
    InspectionPlanDate: '',
    Enterprises: [],
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'pitfall-item',
    mixins: [request_mixin],
    components: {
    },
    props: {
        value: {
            type: Object,
            default() {
                return {}
            }
        },
        isView: {
            type: Boolean,
            default: false,
        }
    },
    model: {
        event: 'change'
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                if (!this.watchUpdate) {
                    this.TaskInspectionPlan = _extends(val);
                    this.inspection = {
                        InspectionId: val.InspectionId,
                        InspectionName: val.InspectionName
                    };
                }
            }
        },
        TaskInspectionPlan: {
            deep: true,
            handler() {
                this.watchUpdate = true;
                this.$emit('change', _extends(this.TaskInspectionPlan));
                this.$nextTick(() => {
                    this.watchUpdate = false;
                })
            },
        },
    },
    mounted() {
        this.getInspectionNatureCom();
    },
    data() {
        let enterpriseInfo = JSON.parse(localStorage.getItem('enterpriseInfo'));
        return {
            watchUpdate: false,
            TaskInspectionPlan: _extends(defaultInfo),
            enterpriseInfo,
            enterpriseLevel: enterpriseInfo.Enterpriselevel,
            rules: {
                InspectionPlanName: [
                    {required:true, message: '请输入检查计划', trigger: ['change', 'blur']},
                ],
                InspectionId: [
                    {required: true, message: '请选择检查表', trigger: ['change', 'blur']},
                ],
                InspectionNatureCode: [
                    {required: true, message: '请选择检查周期', trigger: ['change', 'blur']},
                ],
                InspectionPlanDate: [
                    {required: true, message: '请选择检查日期', trigger: ['change', 'blur']},
                ]
            },
            list: [], // 检查周期
            inspection: {}, // 检查表
        }
    },
    methods: {
        async getInspectionNatureCom() {
            let res = await this.Get('/GetInspectionNatureCom');
            if (res.status == 2000) {
                this.list = res.data;
            };
        },
        chooseTable() {
            this.$choosePotentialTable({
                single: 1,
            }).then((res) => {
                this.inspection = res;
                this.TaskInspectionPlan.InspectionId = res.InspectionId;
            });
        },
        chooseEnterprise() {
            this.$chooseEnterprise({
                choosed: this.TaskInspectionPlan.Enterprises,
                isAll: 1
            }).then(res => {
                this.TaskInspectionPlan.Enterprises = res.map(item => {
                    item.EnterpriseUsers  = [];
                    return item
                });
            })
        },
        appoint(item) {
            this.$chooseUser({
                choosed: item.EnterpriseUsers 
            }).then(res => {
                item.EnterpriseUsers  = res;
            })
        },
        natureChange() {
            let item = this.list.find(item => item.id == this.TaskInspectionPlan.InspectionNatureCode);
            this.TaskInspectionPlan.InspectionNatureName = item.text;
        }
    }
}
</script>

<style lang="scss">

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
</style>