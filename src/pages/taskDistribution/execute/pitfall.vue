<template>
    <el-form class="super-piftall-task" ref="form" label-position="top" :model="info" :rules="rules">
        <div class="form-2-col">
            <el-form-item
                label="检查计划"
                prop="InspectionPlanName"
            >
                <el-input placeholder="请输入" v-model.trim="info.InspectionPlanName" :disabled="isPreview"></el-input>
            </el-form-item>
            <el-form-item
                label="检查表"
                prop="InspectionId"
            >
                <el-input placeholder="请输入" v-model="info.InspectionName" readonly :disabled="isPreview">
                    <el-button slot="append" @click="chooseTable" v-if="!isPreview">请选择</el-button>
                </el-input>
            </el-form-item>
        </div>
        <el-form-item
            label="检查周期"
            prop="InspectionNatureCode"
        >
            <el-select placeholder="请选择" v-model="info.InspectionNatureCode" :disabled="isPreview">
                <el-option v-for="(item, index) in list" :key="index" :label="item.text" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <!-- 综合检查需要选择检查日期 -->
        <el-form-item
            label="检查日期"
            prop="InspectionPlanDate"
            v-if="info.InspectionNatureCode == '0030401'"
        >
            <el-date-picker
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                :disabled="isPreview"
                v-model="info.InspectionPlanDate"
            ></el-date-picker>
        </el-form-item>
        <template v-if="$slots.default">
            <div class="global-divider"></div>
            <slot></slot>
        </template>
        <template v-if="executeType == 1">
            <div class="global-divider"></div>
            <div class="table-content" style="padding-bottom: 0;margin: 0 -29px;">
                <div class="title-content f-b-c">
                    <div class="label">抽查企业</div>
                    <div class="f--c" v-if="enterpriseLevel < 3">
                        <el-button type="primary" @click="chooseEnterprise">添加抽查企业</el-button>
                    </div>
                </div>
                <el-table
                    :data="info.Enterprises"
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
                    >
                        <template slot-scope="{ row, $index }">
                            <el-button type="text" @click="appoint(row)">指定检查人</el-button>
                            <el-button type="text" text-plain @click="info.Enterprises.splice($index, 1)" v-if="enterpriseLevel < 3">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </el-form>
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
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'super-piftall-task',
    mixins: [request_mixin],
    props: {
        loading: false,
        submitLoading: false,
        item: {
            type: Object,
            required: true
        },
        executeType: {
            type: [String, Number]
        }
    },
    data() {
        let enterpriseInfo = JSON.parse(localStorage.getItem('enterpriseInfo'));
        return {
            id: '',
            info: Object.assign(defaultInfo),
            rules: {
            },
            isPreview: true,
            list: [], // 检查周期
            inspection: {}, // 检查表
            enterpriseInfo,
            enterpriseLevel: enterpriseInfo.Enterpriselevel,
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '执行（隐患排查任务）'
        }
    },
    mounted() {
        this.getInspectionNatureCom();
        this.load();
    },
    methods: {
        async load() {
            if (this.item) {
                this.$emit('update:loading', true)
                this.id = this.item.TaskAssignmentId;
                try {
                    let res = await this.Get(`/GetTaskInspectionPlan?relationId=${this.item.RelationId}&taskAssignmentId=${this.item.TaskAssignmentId}`);
                    if (res.status == 2000) {
                        this.info = _extends(Object.assign(defaultInfo, res.data, {Users: []}));
                        if (this.enterpriseLevel >= 3) {
                            this.info.Enterprises = [{
                                EnterpriseName: this.enterpriseInfo.EnterpriseName,
                                EnterpriseId: this.enterpriseInfo.EnterpriseId,
                                EnterpriseUsers: [],
                            }];
                        }
                        this.$emit('remark', res.data.RemarkObjects);
                    } else {
                        this.$message.error(res.message);
                        this.$emit('close');
                    }
                } catch (error) {
                    console.error(error)
                }
                this.$emit('update:loading', false)
            }
        },
        save(fn) {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    if (!!this.info.Enterprises.length) {
                        let error = [];
                        this.info.Enterprises.forEach(item => {
                            if (!item.EnterpriseUsers.length) {
                                error.push(item.EnterpriseName)
                            }
                        });
                        if (error.length) {
                            this.$message.error(`请给【${error.join('、')}】企业指定检查人!`);
                            return;
                        }
                    }
                    let params = {
                        TaskAssignmentId: this.id,
                    }
                    if (typeof fn === 'function' && this.executeType == 2) {
                        let otherParam = fn();
                        if (!otherParam) {
                            return 
                        } else {
                            Object.assign(params, otherParam);
                        }
                    } else {
                        Object.assign(params, {
                            Enterprises: this.info.Enterprises,
                        })
                    }
                    this.$emit('update:submitLoading', true)
                    try {
                        let res = {};
                        if (this.executeType == 2) {
                            res = await this.Post('/SaveTaskRelay', params);
                        } else {
                            res = await this.Post('/SaveEnterpriseInspectionInfo', params);
                        }
                        if (res.status === 2000) {
                            this.$message.success('操作成功');
                            this.$emit('load');
                            this.$emit('close');
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        console.error(error)
                    }
                    this.$emit('update:submitLoading', false)
                }
            })
        },
        async getInspectionNatureCom() {
            let res = await this.Get('/GetInspectionNatureCom');
            if (res.status == 2000) {
                this.list = res.data;
            };
        },
        chooseEnterprise() {
            this.$chooseEnterprise({
                choosed: this.info.Enterprises,
                isAll: 1
            }).then(res => {
                this.info.Enterprises = res.map(item => {
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
    }
}
</script>

<style lang="scss" scoped>
    .super-piftall-task{
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 34px;;
            &:first-child{
                margin-right: 20px;
            }
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
            .el-select{
                width: 100%;
            }
        }
        /deep/ .global-divider{
            margin-left:-29px;
            margin-right:-29px;
        }
        .w50{
            width: 50%;
        }
        .mr20{
            margin-right: 20px;
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
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
    }
</style>