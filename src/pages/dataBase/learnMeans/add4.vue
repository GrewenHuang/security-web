<!-- 培训课件 -->
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
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item label="名称" prop="Name">
                    <el-input placeholder="请输入" v-model="info.Name"></el-input>
                </el-form-item>
                <div class="f-b-c">
                    <el-form-item class="w50" label="课件类型" prop="CategoryCode">
                        <el-select placeholder="请选择" v-model="info.CategoryCode" @change="handleChange('CategoryName', 'CategoryCode', 'typeList')">
                            <el-option v-for="(item, index) in typeList" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="w50" label="适用人群" prop="ThrongCode">
                        <el-select placeholder="请选择" v-model="info.ThrongCode" @change="handleChange('ThrongName', 'ThrongCode', 'throngList')">
                            <el-option v-for="(item, index) in throngList" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="内容" prop="Content">
                    <el-input type="textarea" rows="8" placeholder="请输入" v-model="info.Content"></el-input>
                </el-form-item>
                <el-form-item
                    label="附件"
                >
                    <div class="f-b-c">
                        <customUploadDrag 
                            class="w50"
                            :Data.sync="info.LearningFiles"
                            :showFileList="false"
                            :acceptList="['png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'pdf']"
                        >
                            <div class="f-c-c">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将文件拖到此处或<em>点击上传</em>
                                </div>
                            </div>
                        </customUploadDrag>
                        <div class="f--c w50" style="color: #959595;margin-left: 15px;">
                            支持JPG、PNG、WORD、PDF等文件
                        </div>
                    </div>
                    <div class="file-list"
                        v-for="(item, index) in info.LearningFiles"
                        :key="index"
                    >
                        <div class="file-item">
                            <div class="file f-b-c">
                                <div class="f">
                                    <img style="width:30px;height:30px;margin-right: 13px;"
                                        :src="$fileIcons[item.name.substring(item.name.lastIndexOf('.') + 1)]" />
                                    <div class="text">
                                        <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.name}}</div>
                                        <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.size | formatSize}}</div>
                                    </div>
                                </div>
                                <div>
                                    <i class="el-icon-error cursor-p" @click="info.LearningFiles.splice(index, 1)"></i>
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
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
import { mapGetters } from 'vuex';
const defaultInfo = {
    Name: '',
    CategoryCode: '',
    CategoryName: '',
    ThrongCode: '',
    ThrongName: '',
    Content: '',
    LearningFiles: []
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
                Name: [{required: true, message: '请输入名称', trigger: ['change', 'blur']}],
                CategoryCode: [{required: true, message: '请选择课件类型', trigger: ['change', 'blur']}],
                ThrongCode: [{required: true, message: '请选择适用人群', trigger: ['change', 'blur']}],
            },
            typeList: [],
            throngList: [],
        }
    },
    computed: {
        ...mapGetters(['getDictionaryById']),
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
            this.typeList = await this.getDictionaryById('200005');
            this.throngList = await this.getDictionaryById('200002');
            if (item) {
                this.loading = true;
                this.id = item.LearningId;
                try {
                   let res = await this.Get(`/GetLearning?learningId=${item.LearningId}`)
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
            Object.assign(this.info, _extends(defaultInfo))
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
                        LearningType: 4,
                        IsPrivate: 0
                      }
                      let res = await this.Post('/SaveLearning', params)
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
        handleChange(key, valueKey, listKey) {
            this.info[key] = this[listKey].filter(item => item.id == this.info[valueKey])[0].text;
        }
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
            .el-select{
                width: 100%;
            }
        }
        .f-b-c{
            /deep/ .el-form-item{
                margin-bottom: 25px;
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
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
    }
    .file-list{
        margin-top: 20px;
        .file-item{
            display: flex;
            &:not(:first-child){
                margin-bottom: 15px;
            }
            >div{
                width: 50%;
            }
            .file{
                border-radius: 4px;
                margin-right: 15px;
                padding: 11px 15px 11px 10px;
                background: #F8FAFB;
            }
        }
    }
    .el-date-editor{
        width: 100%;
    }
</style>
