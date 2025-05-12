<template>
    <el-dialog v-dialog-drag 
        class="workinjury-insurance-add"
        :title="title"
        :visible.sync="isShow"
        @close="close"
        width="210mm"
        top="50px"
        :append-to-body="true"
    >
        <el-scrollbar class='scrollbar'>
            <el-form
                :rules="rules"
                class="container"
                ref="form"
                :model="info"
            >
                <div class="form-col">
                    <el-form-item label="姓名" prop="UserId">
                        <el-input placeholder="请选择" v-model="info.UserName" readonly :disabled="isPreview">
                            <el-button slot="append" @click="choosePersonel" v-if="!isPreview">请选择</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="职位" prop="Position">
                        <el-input v-model.trim="info.Position" placeholder="请输入"  :disabled="isPreview"></el-input>
                    </el-form-item>
                </div>
                <div class="form-col">
                    <el-form-item label="身份证号" prop="CardNo">
                        <el-input v-model.trim="info.CardNo" placeholder="选择人员自动带入" readonly :disabled="isPreview"></el-input>
                    </el-form-item>
                    <el-form-item label="保单号" prop="PolicyNo">
                        <el-input v-model.trim="info.PolicyNo" placeholder="请输入" :disabled="isPreview"></el-input>
                    </el-form-item>
                </div>
                <div class="form-col">
                    <el-form-item label="购买时间" prop="BuyDate">
                        <div class="el-input">
                            <el-date-picker v-model="info.BuyDate"
                                style="width: 100%;"
                                type="date"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd"
                                :disabled="isPreview"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="投保额/保额" prop="SumInsured">
                        <el-input v-model.trim="info.SumInsured" placeholder="请输入" :disabled="isPreview"></el-input>
                    </el-form-item>
                </div>
                <div class="form-col">
                    <el-form-item label="投保期限" prop="InsurancePeriodDate">
                        <div class="el-input">
                            <el-date-picker v-model="info.InsurancePeriodDate"
                                style="width: 100%;"
                                type="date"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd"
                                :disabled="isPreview"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="记录人" prop="NoteTaker">
                        <el-input v-model.trim="info.NoteTaker" placeholder="请输入" :disabled="isPreview"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="备注" prop="Remark">
                    <el-input type="textarea" resize="none" v-model.trim="info.Remark" placeholder="请输入" :disabled="isPreview"></el-input>
                </el-form-item>
                <el-form-item label="工伤保险单复印件" prop="TelephoneContent" :disabled="isPreview">
                    <div class="el-input">
                        <el-upload :action="url()"
                            :accept="upload.image_suffix"
                            list-type="picture-card"
                            class='el_upload'
                            :before-upload="before"
                            :disabled="isPreview"
                            :on-change="
                                (file, fileList) => {
                                change(file, 0);
                                }
                            "
                            :before-remove="
                                (file, fileList) => {
                                return before_remove(file, 0);
                                }
                            "
                            :file-list="arrFilesFun(0)"
                            :on-preview="preview"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-form>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button
                type="primary"
                @click="submit()"
                :loading="isSaveLoading"
                v-if="!isPreview"
            >保存</el-button>
        </div>
        
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import formatter_mixin from "@/mixins/formatter-mixin.js";
import RULECONFIG from "@/common/ruleConfig";
import upload_mixin from "@/mixins/upload-mixin.js";
const defaultInfo = {
    UserId: '', // 用户ID 
    UserName: '', // 用户姓名 
    Position: '', // 职位  
    PolicyNo: '', // 保单号  
    BuyDate: '', // 购买时间  
    SumInsured: '', // 投保额 
    InsurancePeriodDate: '', // 投保期限 
    NoteTaker: '', // 记录人 
    Remark: '', // 备注 
    CardNo: '', // 身份证 
    WorkInjuryInsuranceFiles: '', // 工伤保险附件 
}

export default {
    mixins: [request_mixin, formatter_mixin, upload_mixin],
    components: {
    },
    data() {
        return {
            isShow: false,
            info: Object.assign({}, defaultInfo),
            isSaveLoading: false,
            id: '',
            rules: {
                TelephoneDate: RULECONFIG.Select('来(去)电时间'),
                TelephoneCompany: RULECONFIG.Text('来(去)电单位'),
                TelephonePeople: RULECONFIG.Text('来(去)电人'),
                Receiver: RULECONFIG.Text('接电人'),
                SuperiorLeadersId: RULECONFIG.Select('上级领导'),
            },
            isPreview: false,
        };
    },
    created() {
    },
    computed: {
        title() {
            return this.isPreview ? '查看' : this.id ? '编辑' : '新增'
        }
    },
    methods: {
        async show(item, isPreview) {
            const loading = this.$loading({
                lock: true,
                text: '数据加载中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'transparent'
            });
            this.isPreview = isPreview;
            if (item) {
                this.id = item.WorkInjuryInsuranceId;
                let res = await this.Get("/GetWorkInjuryInsurance", { workInjuryInsuranceId : item.WorkInjuryInsuranceId  });
                this.info = res.data;
                this.setFeils();
            }
            this.isShow = true;
            loading.close();
        },
        close() {
            this.isShow = false;
            this.$nextTick(() => {
                this.reset();
            })
        },
        reset() {
            this.isSaveLoading = false;
            this.id = '';
            this.info = Object.assign({}, defaultInfo);
            this.upload.arrFiles = [[],[],[],[]];
        },
        getParams() {
            this.setFeils(true);
            let params = Object.assign({}, this.info);
            return params;
        },
        async submit() {
            this.$refs.form.validate(async valid => {
                if (!valid) return;
                const loading = this.$loading({
                    lock: true,
                    text: '保存中,请稍等...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let res = await this.Post('/SaveWorkInjuryInsurance', this.getParams());
                if (res.status === 2000) {
                    this.close();
                    this.$emit('success');
                    this.$message.success('保存成功');
                } else {
                    this.$message.error(res.message);
                }
                loading.close();
            })
        },
        choosePersonel() {
            this.$chooseUser({
                single: false,
            }).then(personnel => {
                this.info.UserId = personnel.UserId;
                this.info.UserName = personnel.UserName;
                this.info.CardNo = personnel.CardNo;
            })
        },
        setFeils(isSend) {
            let list1 = [
                'WorkInjuryInsuranceFiles',
            ];
            let list2 = this.upload.arrFiles;
            if (isSend) {
                list1.forEach((key, index) => {
                    this.info[key] = list2[index];
                });
            } else {
                list2.forEach((item, index) => {
                    this.upload.arrFiles[index] = this.info[list1[index]];
                })
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.workinjury-insurance-add {
    color: #000;
    .container {
        padding: 29px 35px 30px 0;
    }
    /deep/ textarea{
        height: 130px;
    }
    [disabled="disabled"] /deep/ .el-upload--picture-card{
        display: none;
    }
}
</style>
