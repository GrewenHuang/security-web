<!-- 安全生产法律法规 -->
<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="700px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item label="名称" prop="Name">
                    <el-input placeholder="请输入" v-model="info.Name" ></el-input>
                </el-form-item>
                <el-form-item
                    label="上传视频"
                    prop="LearningFiles"
                >
                    <customUploadDrag 
                        :Data.sync="info.LearningFiles"
                        :showFileList="false"
                        single
                        :acceptList="['mp4']"
                    >
                        <div class="f-c-c">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                将文件拖到此处或<em>点击上传</em>MP4
                            </div>
                        </div>
                    </customUploadDrag>
                </el-form-item>
                <video :src="videoUrl" class="video" controls v-if="info.LearningFiles[0]"></video>
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
                LearningFiles: [{type: 'array', required: true, message: '请选择视频', trigger: ['change', 'blur']}],
            },
            videoUrl: ''
        }
    },
    watch: {
        async 'info.LearningFiles'(val) {
            if (val[0]) {
                this.videoUrl = await this.getFileUrl(val[0].url)
            }
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
                        LearningType: 6,
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
        getFileUrl(url) {
            return new Promise((resolve, reject) => {
                if(url.indexOf('http')==-1){
                    this.Get("/GetOssUrl", {key:url}).then((result) => {
                        resolve(result.data.url);
                    });
                }else{
                    resolve(url);
                }
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
            min-width: 700px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            margin-right: 0;
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
    .video{
        width: 100%;
        height: 290px;
    }
</style>
