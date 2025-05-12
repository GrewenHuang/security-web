<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="vehicleRouteInfo"
        width="1200px"
        top="8vh"
    >
        <el-scrollbar class="scrollbar" ref="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item label="任务类型" prop="TaskType" ref="TaskType">
                    <el-select v-model="info.TaskType" :disabled="isView">
                        <el-option v-for="(item, index) in taskTypes" :key="index" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="info.TaskType == 2">
                    <safeMeeting ref="TaskSafetyMeeting" v-model="info.TaskSafetyMeeting" :isView="isView"/>
                </template>
                <template v-else-if="info.TaskType == 1">
                    <train ref="TaskTrainTask" v-model="info.TaskTrainTask" :isView="isView"/>
                </template>
                <template v-else-if="info.TaskType == 4">
                    <dailyTasks ref="TaskWorkTask" v-model="info.TaskWorkTask" :isView="isView"/>
                </template>
                <template v-else-if="info.TaskType == 3">
                    <pitfall ref="TaskInspectionPlan" v-model="info.TaskInspectionPlan" :isView="isView"/>
                </template>
            </el-form>
            <template v-if="info.TaskType < 3 && info.TaskTrainTask.TrainTypeCode != '0004502'">
                <div class="global-divider"></div>
                <div class="table-content">
                    <div class="title-content f-b-c">
                        <div class="label">下发本公司人员</div>
                        <div class="f--c" v-if="!isView">
                            <el-button type="primary" @click="chooseUser">选择下发人员</el-button>
                        </div>
                    </div>
                    <el-table
                        :data="Personnellist"
                        :cell-style="{ textAlign: 'center' }"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                            width="60"
                        >
                        </el-table-column>
                        <!-- <el-table-column
                            label="部门"
                            align="center"
                            show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                {{ scope.row.DepartmentList.map(item => item.DepartmentName).join('、') }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="岗位"
                            align="center"
                            show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                {{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
                            </template>
                        </el-table-column> -->
                        <el-table-column
                            label="姓名"
                            align="center"
                            prop="UserName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="手机号"
                            align="center"
                            prop="Tel"
                        >
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="100"
                            v-if="!isView"
                        >
                            <template 
                                slot-scope="scope"
                            >
                                <el-button
                                    type="text"
                                    text-plain
                                    @click="
                                        deleValuePersonnellist(
                                            scope.$index
                                        )
                                    "
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-if="info.TaskTrainTask.TrainTypeCode == '0004502'">
                <div class="global-divider"></div>
                <div class="table-content">
                    <div class="title-content f-b-c">
                        <div class="label">下发本公司岗位</div>
                        <div class="f--c" v-if="!isView">
                            <el-button type="primary" @click="choosePosition">选择岗位</el-button>
                        </div>
                    </div>
                    <el-table
                        :data="positionList"
                        :cell-style="{ textAlign: 'center' }"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                            width="60"
                        >
                        </el-table-column>
                        <el-table-column
                            label="岗位名称"
                            align="center"
                            prop="Name"
                        ></el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="100"
                            v-if="!isView"
                        >
                            <template
                                slot-scope="{ $index }"
                            >
                                <el-button
                                    type="text"
                                    text-plain
                                    @click="delPosition($index)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <!-- 下发下级公司 -->
            <template v-if="enterpriseLevel < 3">
                <div class="global-divider"></div>
                <div class="table-content" ref="EnterpriseIds">
                    <div class="title-content f-b-c">
                        <div class="label">下发下级公司</div>
                        <div class="f--c" v-if="!isView">
                            <el-button type="primary" @click="chooseEnterprise">选择下级公司</el-button>
                        </div>
                    </div>
                    <el-table
                        :data="enterpriseList"
                        highlight-current-row
                        :header-cell-style="$tableStyle"
                        style="width: 100%"
                    >
                        <el-table-column
                            label="序号"
                            type="index"
                            align="center"
                            width="50"
                        ></el-table-column>
                        <!-- <el-table-column
                            label="所属行业"
                            align="center"
                            width="230"
                            prop="IndustryName"
                        ></el-table-column> -->
                        <el-table-column
                            label="公司名称"
                            align="center"
                            prop="EnterpriseName"
                        ></el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="80"
                            v-if="!isView"
                        >
                            <template slot-scope="{ row, index }">
                                <el-button type="text" @click="removeDistributionObject(index, row)">删除</el-button>
                            </template>                
                        </el-table-column>
                    </el-table>
                </div>
            </template>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >{{ isView ? '关闭' : '取消'}}</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                v-if="!isView"
                >提交</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import {
    dailyTasks,
    pitfall,
    safeMeeting,
    train
} from './issued'
import request_mixin from '@/mixins/request-mixin'
const defaultInfo = {
    TaskType: '',
    TaskTypeName: '', // 任务类型名称
    TaskSafetyMeeting: {}, // 安全例会
    TaskTrainTask: {}, // 教育培训
    TaskInspectionPlan: {}, // 隐患
    TaskWorkTask: {}, // 日常
    EnterpriseIds: [], // 下发下级公司 id
    TaskName: '', // 任务名称
    Users: [], // 人员
    Positions: [], // 岗位
}
function _extend(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'vehicle-route-info',
    components: {
        dailyTasks,
        pitfall,
        safeMeeting,
        train,
    },
    mixins: [request_mixin],
    data() {
        let enterpriseInfo = JSON.parse(localStorage.getItem('enterpriseInfo'));
        return {
            id: '',
            dislogShow: false,
            submitLoading: false,
            info: _extend(defaultInfo),
            rules: {
                TaskType: [
                    {required: true, message: '请选择任务类型', trigger: 'change'}
                ],
            },
            enterpriseList: [], // 下发下级公司
            Personnellist: [],
            positionList: [], // 岗位
            enterpriseInfo,
            enterpriseLevel: enterpriseInfo.Enterpriselevel,
        }
    },
    computed: {
        ...mapState(['taskTypes']),
        isView() {
            return !!this.id
        },
        title() {
            return this.isView ? '查看任务' : '下发任务'
        }
    },
    watch: {
        'info.TaskTrainTask.TrainTypeCode'(val) {
            if (val != '0004502') {
                this.info.Positions = [];
                this.positionList = [];
            }
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.id = item.TaskAssignmentId;
                this.info = Object.assign(_extend(defaultInfo), item);
                let typeKeys = {
                    1: 'TaskTrainTask',
                    2: 'TaskSafetyMeeting',
                    3: 'TaskInspectionPlan',
                    4: 'TaskWorkTask'
                }
                let urlObj = {
                    TaskTrainTask: '/GetTaskTrainTask',
                    TaskSafetyMeeting: '/GetTaskSafetyMeeting',
                    TaskInspectionPlan: '/GetTaskInspectionPlan',
                    TaskWorkTask: '/GetTaskWorkTask',
                }
                this.info.TaskType = this.info.TaskType + '';
                let currentType = typeKeys[this.info.TaskType];
                let url = urlObj[currentType];
                let relationId = item.RelationId;
                let params = `?relationId=${relationId}&taskAssignmentId=${item.TaskAssignmentId}`;
                let res = await this.Get(url + params);
                if (res.status == 2000) {
                    this.info[currentType] = res.data;
                    this.enterpriseList = res.data.EnterpriseObjects;
                    this.Personnellist = res.data.UserObjects;
                    this.positionList = res.data.PositionObjects;
                } else {
                    this.$message.error(res.message);
                    this.close();
                }
            }
        },
        close() {
            this.$refs.scrollbar.wrap.scrollTop = 0;
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extend(defaultInfo);
            this.enterpriseList = [];
        },
        save() {
            this.$refs.form.validate(async (valid, rules) => {
                if (JSON.stringify(rules) != '{}') {
                    for (let key in rules) {
                        let ref = this.$refs[key];
                        if (!ref) {
                            let arr = ['', 'TaskTrainTask', 'TaskSafetyMeeting', 'TaskInspectionPlan', 'TaskWorkTask'];
                            let refName = arr[this.info.TaskType]
                            let subRef = this.$refs[refName]
                            ref = subRef.$refs[key]
                        }
                        if (ref) {
                            if (ref.$el) {
                                ref.$el.scrollIntoView({behavior: 'smooth'});
                                break;
                            } else if (ref instanceof Element){
                                ref.scrollIntoView({behavior: 'smooth'});
                                break;
                            }
                        }
                    }
                }
                if (valid) {
                    if (!this.info.EnterpriseIds.length) {
                        this.$refs.EnterpriseIds.scrollIntoView({behavior: 'smooth'});
                        return this.$message.error('请选择下发下级公司');
                    }
                    if (this.info.TaskType == 3) {
                        if (!!this.info.TaskInspectionPlan.Enterprises.length) {
                            let error = [];
                            this.info.TaskInspectionPlan.Enterprises.forEach(item => {
                                if (!item.EnterpriseUsers.length) {
                                    error.push(item.EnterpriseName)
                                }
                            });
                            if (error.length) {
                                this.$message.error(`请给【${error.join('、')}】企业指定检查人!`);
                                return;
                            }
                        }
                    }
                    this.submitLoading = true;
                    let params = _extend(this.info);
                    try {
                        let res = await this.Post('/SaveTaskAssignment', params);
                        if (res.status == 2000) {
                            this.$message.success('新增成功');
                            this.close();
                            this.$emit('load');
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        console.error(error)
                    }
                    this.submitLoading = false;
                }
            })
        },
        removeDistributionObject(index, item) {
            this.enterpriseList.splice(index, 1);
            this.info.EnterpriseIds.splice(index, 1);
        },
        chooseEnterprise() {
            this.$chooseEnterprise({
                choosed: this.enterpriseList
            }).then(data => {
                this.enterpriseList = data;
                this.info.EnterpriseIds = data.map(item => item.EnterpriseId);
            })
        },
        chooseUser(data) {
            this.$chooseUser({
                choosed: this.Personnellist
            }).then(data => {
                this.Personnellist = data;
                this.info.Users = data.map(item => {
                    return {
                        UserId: item.UserId
                    }
                })
            })
        },
        deleValuePersonnellist(index) {
            this.Personnellist.splice(index, 1);
            this.info.Users.splice(index, 1);
        },
        delPosition(index) {
            this.positionList.splice(index, 1);
            this.info.Positions.splice(index, 1);
        },
        choosePosition() {
            this.$choosePosition({
                choosed: this.positionList
            }).then(res => {
                this.positionList = res;
                this.info.Positions = res.map(item => {
                    return {
                        PositionId: item.PositionId
                    }
                })
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .vehicleRouteInfo{
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 1200px;
        }
        /deep/ .el-form{
            padding: 25px 30px 0 29px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 29px;;
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
            .el-select{
                width: 100%;
            }
            .el-date-editor{
                width: 100%;
            }
        }
        /deep/ .w50{
            width: 50%;
        }
        /deep/ .gutter{
            margin-right: 36px;
        }
        /deep/ .table-content{
            padding: 0 29px 41px;
            .title-content{
                margin-bottom: 20px;
                .label{
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 18px;
                    &::before{
                        content: '';
                        margin-right: 7px;
                        width: 5px;
                        height: 18px;
                        background: #1A43A9;
                    }
                }
            }
        }
        /deep/ .prominent{
            margin: 0 -30px;
        }
        /deep/ .global-divider{
            margin: 36px 0;
            height: 10px;
            background: #F2F2F2;
        }
        /deep/ .el-range-separator{
            width: auto;
        }
    }
</style>