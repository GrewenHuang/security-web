<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="super-piftall-task"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar class="scrollbar" ref="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label="任务名称">
                        <el-input maxlength="200"
                                v-model="info.Name"
                                disabled></el-input>
                    </el-form-item>
                    <el-form-item class="w50" label="检查表名称">
                      <el-input maxlength="200"
                                v-model="info.CheckTableName"
                                disabled></el-input>
                    </el-form-item>
                </div>
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label='排查类型'>
                      <el-input maxlength="200"
                                v-model="info.PotentialCheckNatureName"
                                disabled></el-input>
                    </el-form-item>
                    <el-form-item class="w50" label='截止完成日期'>
                      <el-input maxlength="200"
                                v-model="info.PlanCheckDateDesc"
                                disabled></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="检查人">
                    <el-table
                        border
                        :data="PersonnelList"
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
                        </el-table-column>
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
                        >
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    text-plain
                                    @click="
                                        delPersonnel(
                                            scope.$index
                                        )
                                    "
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" style="width: 100%;" @click="chooseUser">选择人员</el-button>
                </el-form-item>
                <el-form-item label="检查项">
                    <el-table border
                        :data='potentialCheck.ItemList'
                        :cell-style="{ textAlign: 'center' }"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column type='index'
                                        label="序号"
                                        align="center"
                                        width="60">
                        </el-table-column>
                        <el-table-column label="检查项目"
                                        align="center" width="200"
                                        prop="Project">
                        </el-table-column>
                        <el-table-column label="检查内容"
                                        align="center"
                                        prop="CheckContent">
                        </el-table-column>
                        <el-table-column label="隐患级别"
                                        align="center"
                                        width="120"
                                        prop="PotentialLevelName">
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                >提交</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
    Name: '',
    PotentialCheckNatureName: '',
    PlanCheckDateDesc: '',
    CheckTableName: '',
    Users: [],
}
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'super-piftall-task',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: Object.assign(defaultInfo),
            rules: {
            },
            PersonnelList: [],
            potentialCheck: {},
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '隐患排查任务'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.TaskAssignmentId;
                try {
                    let res = await this.Get(`/GetEnterprisePotentialCheckPlanInfo?id=${item.RelationId}`);
                    if (res.status == 2000) {
                        this.info = _extends(Object.assign(defaultInfo, res.data, {Users: []}));
                        let res1 = await this.Get('/GetEnterprisePotentialCheck',{Id: res.data.PotentialCheckId})
                        if (res1.status == 2000) {
                            this.potentialCheck = res1.data;
                        }
                    } else {
                        this.$message.error(res.message);
                        this.close();
                    }
                } catch (error) {
                    console.error(error)
                }
                this.loading = false;
            }
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.PersonnelList = [];
            this.potentialCheck = {};
        },
        save() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    if (!this.info.Users.length) {
                        this.$message.error('请选择检查人员');
                        this.$refs.scrollbar.wrap.scrollTop = 0;
                        return
                    }
                    this.submitLoading = true;
                    try {
                        let params = {
                            TaskAssignmentId: this.id,
                            Users: this.info.Users,
                        }
                        let res = await this.Post('/SaveEnterprisePotentialCheckPlanInfo', params);
                        if (res.status === 2000) {
                            this.$message.success('执行成功');
                            this.$emit('load');
                            this.close();
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
        chooseUser() {
            this.$chooseUser({
                choosed: this.PersonnelList
            }).then(data => {
                this.PersonnelList = data;
                this.info.Users = data.map(item => {
                    return {
                        UserId: item.UserId
                    }
                })
            })
        },
        delPersonnel(index) {
            this.PersonnelList.splice(index, 1);
            this.Users.splice(index, 1);
        }
    }
}
</script>

<style lang="scss" scoped>
    .super-piftall-task{
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
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
        .w50{
            width: 50%;
        }
        .mr20{
            margin-right: 20px;
        }
    }
</style>