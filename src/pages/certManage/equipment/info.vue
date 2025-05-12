<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
		append-to-body
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="field-list">
                    <el-form-item label="选择设备" prop="ItemId">
                        <el-input placeholder="请选择" v-model="info.ItemName" readonly :disabled="isEdit">
                            <el-button slot="append" @click="chooseEquipment" :disabled="isEdit">请选择</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="`选择${showText}`" prop="CertificateId">
                        <el-select placeholder="请选择" v-model="info.CertificateId" @change="changeCert" :disabled="isEdit">
                            <el-option v-for="(item, index) in certList" :key="index" :label="item.CertificateName" :value="item.CertificateId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <template v-if="info.CertificateId">
                    <div class="gutter"></div>
                    <div class="field-list">
                        <el-form-item
                            v-for="(item, index) in info.CertificateFileds"
                            :key="index"
                            :label="item.FiledName"
                        >
                            <el-input placeholder="请输入" v-model="item.FiledValue" v-if="item.TextType == 2"></el-input>
                            <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="item.FiledValue" v-if="item.TextType == 3"></el-date-picker>
                            <custom-date-range v-model="item.FiledValue" v-if="item.TextType == 4"/>
                        </el-form-item>
                    </div>
                    <div class="gutter"></div>
                    <el-form-item :label="`${showText}照片`">
                        <custom-upload 
                            :accept="'.jpeg,.png,.jpg,.gif'"
                            :fileList.sync="info.CertificateManagePhotos"
                            list-type="picture-card"
                        >
                            <i class="el-icon-plus"></i>
                        </custom-upload>
                    </el-form-item>
                </template>
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
    CertificateType: 1,
    ItemId: '',
    ItemName: '',
    CertificateId: '', // 证件id
    CertificateFileds: [], // 证件对应的字段
    CertificateManagePhotos: [], // 证件附件
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    props: {
        editTitle: {
            type: String,
            default: '编辑'
        }
    },
    data() {
        return {
            id: '',
            type: 1,
            certificateClassification: 1,
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
                ItemId: [{required: true, message: '请选择设备', trigger: ['change','blur']}],
                CertificateId: [{required: true, message: '请选择', trigger: ['change','blur']}]
            },
            certList: [], // 证件集合
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? this.editTitle : '新增'
        },
        showText() {
            const strs = [
                '',
                '证件',
                '保险',
                ''
            ]
            return strs[this.certificateClassification];
        }
    },
    methods: {
        async show(item, type, classification) {
            this.dislogShow = true;
            this.info.CertificateType = type;
            this.certificateClassification = classification;
            await this.getTemplateCert();
            if (item) {
                this.loading = true;
                this.id = item.CertificateManageId;
                try {
                   let res = await this.Get(`/GetCertificateManage?certificateManageId=${this.id}&certificateType=${this.info.CertificateType}&certificateClassification=${this.certificateClassification}`)
                   if (res.status == 2000) {
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
                        ...this.info,
                        certificateClassification: this.certificateClassification
                      }
                      let res = await this.Post('/SaveCertificateManage', params)
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
        async getTemplateCert() {
            let res = await this.Get(`/GetCertificateList?certificateType=${this.info.CertificateType}&certificateClassification=${this.certificateClassification}`);
            if (res.status == 2000) {
                this.certList = res.data;
                if (!this.certList.length) {
                    this.$message.error(`未获取到${this.showText}模板，请确认是否添加了${this.showText}模板`);
                }
            } else {
                this.$message.error(`未获取到${this.showText}模板，请确认是否添加了${this.showText}模板`);
            }
            return Promise.resolve();
        },
        changeCert() {
            let item = this.certList.filter(item => item.CertificateId == this.info.CertificateId)[0];
            this.info.CertificateFileds = _extends(item.CertificateFileds).map(item=>{
                item.FiledValue = '';
                return item;
            });
        },
        chooseEquipment() {
            this.$chooseEquipment({

            }).then(res => {
                this.info.ItemId = res.EquipmentManageId;
                this.info.ItemName = res.EquipmentName;
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select,
            .el-date-editor{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
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
        .gutter{
            &::before{
                content: '';
                display: block;
                margin: 0 -10px 25px -25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        .field-list{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 20px;
        }
    }
</style>
