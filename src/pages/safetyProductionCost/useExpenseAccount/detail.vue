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
		:append-to-body="true"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item v-if="!id">
                    <el-radio-group v-model="info.type" @change="changeHandler">
                        <el-radio-button label="1">计划内项目</el-radio-button>
                        <el-radio-button label="2">计划外项目</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <template v-if="info.type == 1">
                    <div class="form-2-col">
                        <el-form-item label="使用项目" prop="Classification" ref="Classification">
                            <el-input placeholder="请输入" v-model="info.Classification" readonly>
                                <el-button slot="append" @click="chooseClassification" v-if="!id">选择</el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="经手人" prop="HandledBy" ref="HandledBy">
                            <el-input placeholder="请输入" v-model="info.HandledByName" readonly>
                                <el-button slot="append" @click="chooseUser" v-if="!id">选择</el-button>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-2-col">
                        <el-form-item label="金额（万）" prop="Money" ref="Money">
                            <el-input placeholder="请输入" v-model="info.Money" ></el-input>
                        </el-form-item>
                        <el-form-item label="日期" prop="RecordDate" ref="RecordDate">
                            <el-date-picker placeholder="请输入" value-format="yyyy-MM-dd" v-model="info.RecordDate" ></el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="form-2-col">
                        <el-form-item label="用途" prop="Use">
                            <el-input placeholder="请输入" v-model="info.Use" ></el-input>
                        </el-form-item>
                        <el-form-item label="凭证号" prop="VoucherNo">
                            <el-input placeholder="请输入" v-model="info.VoucherNo" ></el-input>
                        </el-form-item>
                    </div>
                </template>
                <template v-else>
                    <div class="form-2-col">
                        <el-form-item label="安全投入分类" prop="Classification" ref="Classification">
                            <el-input placeholder="请输入" v-model="info.Classification" ></el-input>
                        </el-form-item>
                        <el-form-item label="安全投入费用内容" prop="ClassificationContent" ref="ClassificationContent">
                            <el-input placeholder="请输入" v-model="info.ClassificationContent" ></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="备注" prop="ClassificationRemark" ref="ClassificationRemark">
                        <el-input placeholder="请输入" type="textarea" v-model="info.ClassificationRemark"></el-input>
                    </el-form-item>
                    <div class="split-line"></div>
                    <div class="form-2-col">
                        <el-form-item label="经手人" prop="HandledBy" ref="HandledBy">
                            <el-input placeholder="请输入" v-model="info.HandledByName" readonly>
                                <el-button slot="append" @click="chooseUser" v-if="!id">选择</el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="金额（万）" prop="Money" ref="Money">
                            <el-input placeholder="请输入" v-model="info.Money" ></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-2-col">
                        <el-form-item label="日期" prop="RecordDate" ref="RecordDate">
                            <el-date-picker placeholder="请输入" value-format="yyyy-MM-dd" v-model="info.RecordDate" ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="用途" prop="Use">
                            <el-input placeholder="请输入" v-model="info.Use" ></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="凭证号" prop="VoucherNo">
                        <el-input placeholder="请输入" v-model="info.VoucherNo" ></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="备注" prop="Remark">
                    <el-input placeholder="请输入" type="textarea" v-model="info.Remark"></el-input>
                </el-form-item>
				<el-form-item label="凭证照片" prop="Remark">
				   <custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
				   	:fileList.sync="info.Files" list-type="picture-card">
				   	<i class="el-icon-plus"></i>
				   </custom-upload>
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
        <chooseClassification ref="chooseClassification" :EnterpriseId="EnterpriseId" @success="successHandler"/>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import chooseClassification from './chooseClassification.vue';
import Qs from 'qs';
const defaultInfo = {
    FundingPlanClassificationId: '', //  (integer, optional): 安全投入分类ID ,
    Classification: '', //  (string, optional): 安全投入分类 ,
    ClassificationContent: '', //  (string, optional): 安全投入内容 ,
    ClassificationRemark: '', //  (string, optional): 安全投入备注 ,
    HandledBy: '', //  (integer, optional): 经手人ID ,
    HandledByName: '',
    Money: '', //  (number, optional): 金额（万） ,
    RecordDate: '', //  (string, optional): 日期 ,
    Use: '', //  (string, optional): 用途 ,
    VoucherNo: '', //  (string, optional): 凭
    type: 1,
    Remark: '',
	Files: []
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'page-info',
    components: {
        chooseClassification
    },
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
                FundingPlanClassificationId: [{required: true, message: '请选择使用项目', trigger: ['change', 'blur']}],
                HandledBy: [{required: true, message: '请选择经手人', trigger: ['change', 'blur']}],
                Money: [
                    {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, required: true, message: '请输入金额', trigger: ['change', 'blur']}
            
                ],
                RecordDate: [{required: true, message: '请选择日期', trigger: ['change', 'blur']}],
                Classification: [{required: true, message: '请输入安全投入分类', trigger: ['change', 'blur']}],
                ClassificationContent: [{required: true, message: '请输入安全投入费用内容', trigger: ['change', 'blur']}],
                ClassificationRemark: [{required: true, message: '请输入安全投入备注', trigger: ['change', 'blur']}],
            },
			EnterpriseId:""
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
        async show(item,id) {
            this.dislogShow = true;
			this.EnterpriseId = id
            if (item) {
                this.loading = true;
                this.id = item.FundingRecordId;
                this.info = Object.assign(_extends(defaultInfo), item);
                this.loading = false;
            } else {
                const userInfo = Qs.parse(localStorage.getItem('userinfo'));
                this.info.HandledBy = userInfo.UserId;
                this.info.HandledByName = userInfo.UserName;
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
                        ...this.info,
						EnterpriseId:this.EnterpriseId
                      }
                      let res = await this.Post('/SaveFundingRecord', params)
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
        chooseClassification() {
            this.$refs.chooseClassification.show();
        },
        successHandler(item) {
            this.info.FundingPlanClassificationId = item.FundingPlanClassificationId;
            this.info.Classification = item.Classification;
            this.info.ClassificationContent = item.Content;
            this.info.ClassificationRemark = item.Remark;
        },
        chooseUser() {
            this.$chooseUser({
                single: false
            }).then(res => {
                this.info.HandledBy = res.UserId;
                this.info.HandledByName = res.UserName;
            })
        },
        changeHandler() {
            this.info.FundingPlanClassificationId = '';
            this.info.Classification = '';
            this.info.ClassificationContent = '';
            this.info.ClassificationRemark = '';
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