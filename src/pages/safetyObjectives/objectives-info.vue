<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="vehicleRouteInfo"
        width="750px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
        append-to-body
    >
        <el-scrollbar class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label="责任部门" prop="DepartmentId">
                        <select-department
                            placeholder="请选择"
                            v-model="info.DepartmentId"
                            @selected="handleDepartmentSelected"
                        ></select-department>
                    </el-form-item>
                    <el-form-item class="w50" label="责任人" prop="UserId">
                        <choose-user
                            v-model="info"
                            idKey="UserId"
                            nameKey="UserName"
                        ></choose-user>
                    </el-form-item>
                </div>
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label="开始日期" prop="StartDate">
                        <el-date-picker type="date" placeholder="请输入" value-format="yyyy-MM-dd" v-model="info.StartDate" ></el-date-picker>
                    </el-form-item>
                    <el-form-item class="w50" label="结束日期" prop="EndDate">
                        <el-date-picker type="date" placeholder="请输入" value-format="yyyy-MM-dd" v-model="info.EndDate" ></el-date-picker>
                    </el-form-item>
                </div>
                <el-form-item label="目标内容" prop="ItemContent">
                    <el-input type="textarea" rows="4" placeholder="请输入" v-model="info.ItemContent"></el-input>
                </el-form-item>
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                @click="save()"
                slot="reference"
                >提交</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
function randomKey () {
    return Math.random().toString().substr(2) + '-' + Math.random().toString().substr(2);
}
const defaultInfo = {
    ItemId: randomKey(),
    DepartmentId: '',
    DepartmentName: '',
    UserId: '',
    UserName: '',
    StartDate: '',
    EndDate: '',
    ItemContent: '',
    ChildrenItemList: []
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'objectives-info',
    mixins: [request_mixin],
    data() {
        return {
            loading: false,
            dislogShow: false,
            DepartmentPositionUser: [],
            departmentList: [],
            info: _extends(defaultInfo),
            rules: {
                DepartmentId: [
                    {required: true, message: '请选择负责部门', trigger: 'change'}
                ],
                UserId: [
                    {required: true, message: '请选择负责人', trigger: 'change'}
                ],
                StartDate: [
                    {required: true, message: '请选择开始日期', trigger: 'change'}
                ],
                EndDate: [
                    {required: true, message: '请选择结束日期', trigger: 'change'}
                ],
                ItemContent: [
                    {required: true, message: '请输入目标内容', trigger: ['blur', 'change']}
                ],
            },
            title: '',
        }
    },
    computed: {
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.info = Object.assign(_extends(defaultInfo), item);
                this.loading = false;
            }
            this.title = item ? '编辑目标' : '新增目标';
        },
        close() {
            this.dislogShow = false;
            Object.assign(this.info, _extends(defaultInfo), {ItemId: randomKey()});
            this.$emit('close');
        },
        save() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (new Date(this.info.EndDate) < new Date(this.info.StartDate)) {
                        this.$message.warning('结束日期不能小于开始日期！')
                        return;
                    }
                    this.$emit('success', _extends(this.info));
                    this.close();
                }
            })
        },
        handleDepartmentSelected(id, obj) {
            this.info.DepartmentName = obj.Name;
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>
    .vehicleRouteInfo{
        .el-date-editor{
            width: 100%;
        }
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 750px;
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