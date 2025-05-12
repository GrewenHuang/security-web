<template>
    <div class="dailyTask-item">
        <el-form-item label="任务名称" :rules="rules.Title " prop="TaskWorkTask.Title" ref="TaskWorkTask.Title">
            <el-input placeholder="请输入" v-model="TaskWorkTask.Title" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="内容" :rules="rules.Content" prop="TaskWorkTask.Content">
            <el-input type="textarea" placeholder="请输入" v-model="TaskWorkTask.Content" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item
            :label="isView ? '任务附件' : '上传附件'"
            prop="TaskWorkTask.Attachments"
        >
            <div class="f-b-c" v-if="!isView">
                <customUploadDrag 
                    class="w50"
                    :Data="TaskWorkTask.Attachments"
                    :mimeType="['application/pdf', 'video/mp4', 'image']"
                    :showFileList="false"
                    accept="application/pdf,video/mp4,image/jpg,image/jpeg,image/png,application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                >
                    <div class="f-c-c">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处或<em>点击上传</em>
                        </div>
                    </div>
                </customUploadDrag>
                <div class="f--c w50" style="color: #959595;margin-left: 15px;">
                    支持图片、mp4、EXCEL、pdf文件
                </div>
            </div>
            <div class="file-list"
                v-for="(item, index) in TaskWorkTask.Attachments"
                :key="index"
            >
                <div class="file-item">
                    <div class="file f-b-c cursor-p" @click="$openFile(item.Url)">
                        <div class="f">
                            <img style="width:30px;height:30px;margin-right: 13px;"
                                :src="$fileIcons[(item.name || item.Name).substring((item.name || item.Name).lastIndexOf('.') + 1)]" />
                            <div class="text">
                                <div style="color:#44566C;font-size:12px;line-height: 1;;">{{(item.name || item.Name)}}</div>
                                <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ (item.size || item.Size) | formatSize}}</div>
                            </div>
                        </div>
                        <div>
                            <i class="el-icon-error cursor-p" @click="TaskWorkTask.Attachments.splice(index, 1)" v-if="!isView"></i>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </el-form-item>
        <div class="prominent">
            <div class="global-divider"></div>
            <div class="other-operation">
                <div class="f--c item">
                    <div class="label">是否需要回执</div>
                    <el-radio-group v-model="TaskWorkTask.IsNeedBackFile" :disabled="isView">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <template v-if="TaskWorkTask.IsNeedBackFile  == 1">
                        <div class="label">回执截止日期：</div>
                        <el-date-picker placeholder="请选择" type="date" value-format="yyyy-MM-dd" v-model="TaskWorkTask.BackFileLimitDate" :disabled="isView"></el-date-picker>
                    </template>
                    <el-form-item class="input-hidden" prop="TaskWorkTask.BackFileLimitDate" ref="BackFileLimitDate" :rules="rules.BackFileLimitDate"></el-form-item>
                </div>
                <!-- <div class="f--c item">
                    <div class="label">是否需要提醒</div>
                    <el-radio-group v-model="TaskWorkTask.IsNeedRemind" :disabled="isView">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <template v-if="TaskWorkTask.IsNeedRemind == 1">
                        <div class="label">提醒日期：</div>
                        <el-date-picker placeholder="请选择" type="date" value-format="yyyy-MM-dd" v-model="TaskWorkTask.RemindDate" :disabled="isView"></el-date-picker>
                        <el-checkbox v-model="TaskWorkTask.IsRemindNeedSMS" :disabled="isView">同时发送短信</el-checkbox>
                    </template>
                    <el-form-item class="input-hidden" prop="TaskWorkTask.RemindDate" :rules="rules.RemindDate"></el-form-item>
                </div>
                <div class="f--c item">
                    <div class="label">是否需要催办</div>
                    <el-radio-group v-model="TaskWorkTask.IsNeedUrge" :disabled="isView">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <template v-if="TaskWorkTask.IsNeedUrge == 1">
                        <div class="label">提醒日期：</div>
                        <el-date-picker placeholder="请选择" type="date" value-format="yyyy-MM-dd" v-model="TaskWorkTask.UrgeDate" :disabled="isView"></el-date-picker>
                        <el-checkbox v-model="TaskWorkTask.IsUrgeNeedSMS" :disabled="isView">同时发送短信</el-checkbox>
                    </template>
                    <el-form-item class="input-hidden" prop="TaskWorkTask.UrgeDate" :rules="rules.UrgeDate"></el-form-item>
                </div> -->
            </div>
            <template v-if="receiptFiles && !!receiptFiles.length">
                <div class="global-divider"></div>
                <div style="padding: 0 30px">
                    <div>回执的附件</div>
                    <div class="file-list"
                        v-for="(item, index) in receiptFiles"
                        :key="index"
                    >
                        <div class="file-item">
                            <div class="file f-b-c cursor-p" @click="$openFile(item.Url)">
                                <div class="f">
                                    <img style="width:30px;height:30px;margin-right: 13px;"
                                        :src="$fileIcons[(item.name || item.Name).substring((item.name || item.Name).lastIndexOf('.') + 1)]" />
                                    <div class="text">
                                        <div style="color:#44566C;font-size:12px;line-height: 1;;">{{(item.name || item.Name)}}</div>
                                        <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ (item.size || item.Size) | formatSize}}</div>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        
    </div>
</template>

<script>
import ZYselect from "@/components/common/zy_select";
import customUploadDrag from "@/components/common/custom-upload-drag.vue";
import util from "@/common/util.js";
export default {
    name: 'dailyTask-item',
    components: {
        ZYselect,
        customUploadDrag
    },
    props: {
        value: {
            type: Object,
            default() {
                return {}
            }
        },
        isView: {
            type: Boolean,
            default: false
        }
    },
    model: {
        event: 'change'
    },
    filters: {
        formatSize: util.change_size,
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                this.TaskWorkTask = val;
                if (val.TaskActions && !!val.TaskActions.length) {
                    val.TaskActions.forEach(item => {
                        if (item.TaskType == 2) {
                            // 提醒
                            this.TaskWorkTask.IsNeedRemind = item.IsNeed;
                            this.TaskWorkTask.RemindDate = item.ActionTime;
                            this.TaskWorkTask.IsRemindNeedSMS = item.IsSendSMS;
                        } else if (item.TaskType == 3) {
                            // 催办
                            this.TaskWorkTask.IsNeedUrge = item.IsNeed;
                            this.TaskWorkTask.UrgeDate = item.ActionTime;
                            this.TaskWorkTask.IsUrgeNeedSMS = item.IsSendSMS;
                        }
                    })
                }
                if (val.SenderAttachments) {
                    this.receiptFiles = JSON.parse(JSON.stringify(val.Attachments));
                    this.TaskWorkTask.Attachments = val.SenderAttachments;
                    val.SenderAttachments = null;
                }
            }
        },
        TaskWorkTask: {
            deep: true,
            handler() {
                this.$emit('change', this.TaskWorkTask);
            },
        }
    },
    data() {
        function endDateValidator(message, relationKey) {
            return (rule, value, callback) => {
                if (this.TaskWorkTask[relationKey] == 1 && !value) {
                    setTimeout(() => {
                        this.$message.error(message);
                    }, 20);
                    callback(new Error(message))
                } else {
                    callback();
                }
            }
        }
        return {
            TaskWorkTask: {
                Title: '',
                Attachments: [],
                Content: '',
                IsNeedBackFile: 0,
                BackFileLimitDate: '',
                IsNeedRemind: 0,
                RemindDate: '',
                IsRemindNeedSMS: 0,
                IsNeedUrge: 0,
                UrgeDate: '',
                IsUrgeNeedSMS: ''
            },
            rules: {
                Title: [{required: true, message: '请输入任务名称', trigger: ['change', 'blur']}],
                BackFileLimitDate: [
                    {
                        validator: endDateValidator.call(this, '请选择回执截止日期', 'IsNeedBackFile')
                    }
                ],
                RemindDate: [
                    {
                        validator: endDateValidator.call(this, '请选择提醒日期', 'IsNeedRemind')
                    }
                ],
                UrgeDate: [
                    {
                        validator: endDateValidator.call(this, '请选择提醒日期', 'IsNeedUrge')
                    }
                ],
            },
            receiptFiles: []
        }
    },
}
</script>

<style lang="scss" scoped>
    
.input-hidden{
    margin: 0;
    padding: 0;
    width: 0;
    height: 0;
    overflow: hidden;
    opacity: 0;
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
.other-operation{
    padding: 0 30px;
    .item{
        &:not(:last-child) {
            padding-bottom: 36px;
        }
        &:not(:first-child){
            padding-top: 36px;
            border-top: 1px solid #F2F2F2;
        }
        .label{
            width: 99px;
            text-align: right;
        }
        .el-radio-group{
            margin: 0 73px 0 35px;
        }
        .el-checkbox{
            margin-left: 33px;
        }
    }
}
</style>
