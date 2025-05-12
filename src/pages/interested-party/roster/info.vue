<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="600px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar class="scrollbar" ref="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="form-2-col">
                    <el-form-item label="相关方名称" prop="Name" ref="Name">
                        <el-input placeholder="请输入" v-model="info.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="单位性质" prop="UnitNature">
                        <el-input placeholder="请输入" v-model="info.UnitNature"></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="相关方类型" prop="RelatedPartyTypeId">
                        <el-select placeholder="请选择" v-model="info.RelatedPartyTypeId">
                            <el-option v-for="(item, index) in typeList" :key="index" :label="item.Name" :value="item.RelatedPartyTypeId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管控责任部门" prop="DepartmentId">
                        <select-department v-model="info.DepartmentId"></select-department>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="营业等级" prop="BusinessLevel">
                        <el-input placeholder="请输入" v-model="info.BusinessLevel"></el-input>
                    </el-form-item>
                    <el-form-item label="统一社会信用代码" prop="SocialCreditCode" ref="SocialCreditCode">
                        <el-input placeholder="请输入" v-model="info.SocialCreditCode"></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="特种设备安装许可证" prop="SpecialEquipment">
                        <el-input placeholder="请输入" v-model="info.SpecialEquipment"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="UserName" ref="UserName">
                        <el-input placeholder="请输入" v-model="info.UserName"></el-input>
                    </el-form-item>
                </div>
                
                <div class="form-2-col">
                    <el-form-item label="负责人电话" prop="Tel" ref="Tel">
                        <el-input placeholder="请输入" v-model="info.Tel"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人身份证" prop="IDCard">
                        <el-input placeholder="请输入" v-model="info.IDCard"></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="安全负责人" prop="SafetyUserName">
                        <el-input placeholder="请输入" v-model="info.SafetyUserName"></el-input>
                    </el-form-item>
                    <el-form-item label="安全负责人电话" prop="SafetyTel">
                        <el-input placeholder="请输入" v-model="info.SafetyTel"></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="安全负责人身份证" prop="SafetyIDCard">
                        <el-input placeholder="请输入" v-model="info.SafetyIDCard"></el-input>
                    </el-form-item>
                    <el-form-item label="服务内容" prop="Content">
                        <el-input type="textarea" placeholder="请输入" v-model="info.Content"></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="资质审核情况" prop="Remark" ref="Remark">
                        <el-input type="textarea" placeholder="请输入" v-model="info.Remark"></el-input>
                    </el-form-item>
                    <el-form-item label="特种作业证" prop="RelatedPartyFiles1">
                        <custom-upload :file-list.sync="info.RelatedPartyFiles1">
                            <el-button>点击上传</el-button>
                        </custom-upload>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="安全教育情况" prop="RelatedPartyFiles2">
                        <custom-upload :file-list.sync="info.RelatedPartyFiles2">
                            <el-button>点击上传</el-button>
                        </custom-upload>
                    </el-form-item>
                    <el-form-item label="资质证书" prop="RelatedPartyFiles3">
                        <custom-upload :file-list.sync="info.RelatedPartyFiles3">
                            <el-button>点击上传</el-button>
                        </custom-upload>
                    </el-form-item>
                </div>
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
    Name: '', // 相关方名称 ,
    UnitNature: '', // 单位性质 ,
    RelatedPartyTypeId: '', // 相关方类型ID ,
    DepartmentId: '', // 管控责任部门ID ,
    BusinessLevel: '', // 营业等级 ,
    SocialCreditCode: '', // 统一社会信用代码 ,
    SpecialEquipment: '', // 特种设备安装许可证 ,
    UserName: '', // 负责人 ,
    Tel: '', // 负责人电话 ,
    IDCard: '', // 负责人身份证 ,
    SafetyUserName: '', // 安全负责人 ,
    SafetyTel: '', // 安全负责人电话 ,
    SafetyIDCard: '', // 安全负责人身份证 ,
    Content: '', // 服务内容 ,
    Remark: '', // 资质审核情况 ,
    RelatedPartyTypeName: '', // 相关方类型名称 ,
    DepartmentName: '', // 管控责任部门名称 ,
    RelatedPartyFiles1: [], // 特种作业证 ,
    RelatedPartyFiles2: [], // 安全教育情况 ,
    RelatedPartyFiles3: [], // 资质证书
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
                Name: [{required: true, message: '请输入相关方名称', trigger: ['change', 'blur']}],
                RelatedPartyTypeId: [{required: true, message: '请选择相关方类型', trigger: ['change', 'blur']}],
                SocialCreditCode: [{required: true, message: '请输入统一社会信用代码', trigger: ['change', 'blur']}],
                UserName: [{required: true, message: '请输入负责人', trigger: ['change', 'blur']}],
                Tel: [{required: true, message: '请输入负责人电话', trigger: ['change', 'blur']}],
                Remark: [{required: true, message: '请输入资质审核情况', trigger: ['change', 'blur']}],
            },
            typeList: []
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
        async show(item) {
            this.dislogShow = true;
            await this.getTypeList();
            if (item) {
                this.loading = true;
                this.id = item.RelatedPartyId;
                try {
                   let res = await this.Get(`/GetRelatedParty?relatedPartyId=${item.RelatedPartyId}`)
                   if (res.status == 2000) {
                        res.data.DepartmentId = res.data.DepartmentId == 0 ? '' : res.data.DepartmentId;
                       this.info = Object.assign(_extends(defaultInfo), res.data);
                   } else {
                       this.$message.error('获取数据失败');
                       this.close();
                   }
                } catch (error) {
                   console.error(error);
                }
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
                      let res = await this.Post('/SaveRelatedParty', params)
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
            let res = await this.Post('GetRelatedPartyTypeList', {Name: ''});
            if (res.status == 2000) {
                this.typeList = res.data;
            }
            return Promise.resolve()
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