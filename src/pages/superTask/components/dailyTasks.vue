<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="super-daily-tasks"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar class='scrollbar' ref="scrollbar">
            <el-form
                ref="form"
                element-loading-text="拼命加载中"
                v-loading="loading"
                :model="info"
                :rules="rules"
            >
                <el-form-item label='标题'>
                    <el-input maxlength="200"
                        v-model="info.Title"
                        disabled></el-input>
                </el-form-item>
                <el-form-item label='下发日期'>
                    <el-input maxlength="200"
                        v-model="info.CreateTimeDesc"
                        disabled></el-input>
                </el-form-item>
                <el-form-item label='内容'>
                    <el-input maxlength="200"
                        v-model="info.Content" 
                            type="textarea" rows="10"
                        disabled></el-input>
                </el-form-item>
                <el-form-item label='任务附件'>
                    <div class="el-input file-list" style="margin-top: 0;"
                        v-for="(item, index) in info.SenderAttachments"
                        :key="index"
                    >
                        <div class="file-item">
                            <div class="file cursor-p" @click="$openFile(item.Url)">
                                <div class="f">
                                    <img style="width:30px;height:30px;margin-right: 13px;"
                                        :src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
                                    <div class="text">
                                        <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.Name}}</div>
                                        <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.Size | formatSize}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="回执附件上传" prop="receiptAttachments" :required="this.info.IsNeedBackFile==1" v-show="info.IsNeedBackFile==1">
                    <div class="el-input f-b-c">
                        <customUploadDrag 
                            class="w50"
                            @onUpload="handleUpload"
                            :Data="info.receiptAttachments"
                            :acceptList="['mp4', 'mp3', 'png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'xls', 'xlsx', 'pdf', 'gif', 'pptx', 'ppt']"
                            :showFileList="false"
                        >
                            <div class="f-c-c">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将文件拖到此处或<em>点击上传</em>
                                </div>
                            </div>
                        </customUploadDrag>
                        <div class="f--c w50" style="color: #959595;margin-left: 15px;">
                            支持mp4、pdf、doc、jpeg、jpg、png文件
                        </div>
                        <!-- 为了解决不触发 el-form 的 change 方法 -->
                        <el-checkbox-group v-model="info.receiptAttachments" class="input-hidden"></el-checkbox-group>
                    </div>
                    <div class="file-list"
                        v-for="(item, index) in info.receiptAttachments"
                        :key="index"
                    >
                        <div class="file-item">
                            <div class="file f-b-c">
                                <div class="f">
                                    <img style="width:30px;height:30px;margin-right: 13px;"
                                        :src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
                                    <div class="text">
                                        <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.Name}}</div>
                                        <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.Size | formatSize}}</div>
                                    </div>
                                </div>
                                <div>
                                    <i class="el-icon-error cursor-p" @click="info.receiptAttachments.splice(index, 1)"></i>
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
import customUploadDrag from "@/components/common/custom-upload-drag.vue";
const defaultInfo = {
    Title: '',
    CreateTimeDesc: '',
    Content: '',
    SenderAttachments: [],
    IsNeedBackFile: 1, // 是否需要回执
    receiptAttachments: [], // 回执附件
}
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'super-daily-tasks',
    components: {
        customUploadDrag
    },
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            dislogShow: false,
            loading: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
                receiptAttachments: [
                    {
                        validator: (rule, value, callback) => {
                            if (!value.length && this.info.IsNeedBackFile == 1) {
                                callback(new Error('请选择回执附件'));
                            } else {
                                callback();
                            }
                        }
                    }
                ]
            },
        }
    },
    computed: {
        title() {
            return '日常工作任务'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.EnterpriseRelationId;
                try {
                    let res = await this.Get(`/GetEnterpriseTaskWorkTask?id=${item.RelationId}`);
                    if (res.status == 2000) {
                        this.info = _extends(Object.assign(defaultInfo, res.data));
                    } else {
                        this.$message.error(res.message);
                        this.close();
                    }
                } catch (error) {
                    this.$message.error('获取数据失败，请稍后重试');
                    this.close();
                }
                this.loading = false;
            }
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
        },
        save() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    this.submitLoading = true;
                    try {
                        let res = await this.Post('/SaveEnterpriseWorkTask', {
                            WorkTaskId: this.id,
                            Attachments: this.info.receiptAttachments,
                        });
                        if (res.status == 2000) {
                            this.$message.success('操作成功')
                            this.$emit('load');
                            this.close();
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                    this.submitLoading = false;
                } else {
                    this.$refs.scrollbar.wrap.scrollTop = this.$refs.scrollbar.wrap.scrollHeight;
                }
            })
        },
        handleUpload() {
            this.info.receiptAttachments.forEach(item => {
                this.$set(item, 'Name', item.name);
                this.$set(item, 'VideoUrl', item.url);
                this.$set(item, 'Size', item.size);
                this.$set(item, 'Ext', item.ext);
                this.$set(item, 'CoverUrl', item.coverUrl);
                this.$set(item, 'Lengths', item.lengths);
                this.$set(item, 'TotalSeconds', item.lengths);
            });
        },
    }
}
</script>

<style lang="scss" scoped>
    .super-daily-tasks{
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
        .el-form-item.is-error /deep/ .el-upload-dragger{
            border-color: #FE3F51 !important;
        }
        
        .input-hidden{
            position: absolute;
            margin: 0;
            padding: 0;
            width: 0;
            height: 0;
            overflow: hidden;
            opacity: 0;
        }
    }
</style>