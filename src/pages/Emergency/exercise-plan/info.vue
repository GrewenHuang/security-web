<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="form-2-col">
                    <el-form-item label="计划名称" prop="PlanName" ref="PlanName">
                        <el-input placeholder="请输入" v-model="info.PlanName" :disabled="isPreview"></el-input>
                    </el-form-item>
                    <el-form-item label="参演对象" prop="Object" ref="Object">
                        <el-input placeholder="请输入" v-model="info.Object" :disabled="isPreview"></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="演练时间" prop="DrillDate" ref="DrillDate">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请输入" v-model="info.DrillDate" :disabled="isPreview"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="预案类型" prop="ReservePlanTypeCode" ref="ReservePlanTypeCode">
                        <el-select placeholder="请选择" v-model="info.ReservePlanTypeCode" :disabled="isPreview" @change="changeType">
                            <el-option
                                v-for="(item, i) in typeList"
                                :key="i"
                                :value="item.id"
                                :label="item.text"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="演练项目" prop="ItemName">
                        <el-input placeholder="请输入" v-model="info.ItemName" :disabled="isPreview"></el-input>
                    </el-form-item>
                    <el-form-item label="演练方式" prop="Method">
                        <el-input placeholder="请输入" v-model="info.Method" :disabled="isPreview"></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="组织人员" prop="Personnel">
                        <el-input placeholder="请输入" v-model="info.Personnel" :disabled="isPreview"></el-input>
                    </el-form-item>
                    <el-form-item label="负责部门" prop="DepartmentId" ref="DepartmentId">
                        <select-department placeholder="请选择" v-model="info.DepartmentId" :disabled="isPreview"></select-department>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="负责人" prop="ResponsibleUserId" ref="ResponsibleUserId">
                        <choose-user v-model="info" idKey="ResponsibleUserId" nameKey="ResponsibleUserName" :disabled="isPreview"></choose-user>
                    </el-form-item>
                    <div></div>
                </div>
                <el-form-item label="附件" prop="EmergencyDrillPlanFiles">
                    <custom-upload :fileList.sync="info.EmergencyDrillPlanFiles" :single="true" :disabled="isPreview">
                        <el-button v-if="!isPreview">点击上传</el-button>
                    </custom-upload>
                </el-form-item>
                <el-form-item label="备注" prop="Remark">
                    <el-input type="textarea" placeholder="请输入" v-model="info.Remark" :disabled="isPreview"></el-input>
                </el-form-item>
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >{{isPreview ? '关闭': '取消'}}</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                v-if="!isPreview"
                >提交</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
    PlanName: '',
    Object: '',
    DrillDate: '',
    ReservePlanTypeCode: '',
    ReservePlanTypeName: '',
    ItemName: '',
    Method: '',
    Personnel: '',
    DepartmentId: '',
    ResponsibleUserId: '',
    Remark: '',
    EmergencyDrillPlanFiles: [],
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'page-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            isPreview: false,
            info: _extends(defaultInfo),
            rules: {
                PlanName: [{required: true, message: '请输入计划名称', trigger: ['change', 'blur']}],
                Object: [{required: true, message: '请输入参演对象', trigger: ['change', 'blur']}],
                DrillDate: [{required: true, message: '请选择演练时间', trigger: ['change', 'blur']}],
                ReservePlanTypeCode: [{required: true, message: '请选择预案类型', trigger: ['change', 'blur']}],
                DepartmentId: [{required: true, message: '请选择负责部门', trigger: ['change', 'blur']}],
                ResponsibleUserId: [{required: true, message: '请选择负责人', trigger: ['change', 'blur']}],
            },
            typeList: [],
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : '新增'
        }
    },
    methods: {
        async show(item, isPreview) {
            this.isPreview = isPreview;
            this.dislogShow = true;
            await this.getTypeList();
            if (item) {
                this.loading = true;
                this.id = item.EmergencyDrillPlanId;
                this.info = _extends(item);
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        save() {
            this.$refs.form.validate(async (valid, fields) => {
                for (let key in fields) {
                   if (this.$refs[key]) {
                       this.$refs.scrollbar.wrap.scrollTop = this.$refs[key].$el.offsetTop;
                       break;
                   }
                }
                if (valid) {
                   this.submitLoading = true;
                   try {
                      let params = {
                        ...this.info
                      }
                      let res = await this.Post('/SaveEmergencyDrillPlan', params)
                      if (res.status == 2000) {
                          this.$message.success('保存成功')
                          this.$emit('load');
                          this.close();
                      } else {
                          this.$message.error(res.message);
                      }
                   } catch (error) {
                      console.error(error);
                   }
                   this.submitLoading = false;
                }
            })
        },
        async getTypeList() {
            let res = await this.Get("/GetReservePlanTypeCom");
            if (res.status == 2000) {
                this.typeList = res.data;
            }
            return Promise.resolve();
        },
        changeType() {
            let item = this.typeList.find(item => item.id == this.info.ReservePlanTypeCode);
            if (item) {
                this.info.ReservePlanTypeName = item.text;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
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
            margin-bottom: 25px;
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
        }
        .el-date-editor,
        .el-select{
            width: 100%;
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
