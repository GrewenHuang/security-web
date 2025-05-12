<template>
    <div class="meeting-item">
        <!-- prop 是父组件下的 -->
        <div class="f-b-c">
            <el-form-item class="w50 gutter" label="会议类型" :rules="rulesObj.MeetingTypeCode" prop="TaskSafetyMeeting.MeetingTypeCode" ref="TaskSafetyMeeting.MeetingTypeCode">
                <ZYselect
                    url="GetSafeMeetingTypeCom"
                    placeholder="请选择"
                    propid="id"
                    propname="text"
                    v-model="TaskSafetyMeeting.MeetingTypeCode"
                    :disabled="isView"
                />
            </el-form-item>
            <el-form-item class="w50" label="会议时间" :rules="rulesObj.SessionTime" prop="TaskSafetyMeeting.SessionTime" ref="TaskSafetyMeeting.SessionTime">
                <el-date-picker
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm"
                    v-model="TaskSafetyMeeting.SessionTime"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%;"
                    :disabled="isView"
                >
                </el-date-picker>
            </el-form-item>
        </div>
        <div class="f-b-c">
            <el-form-item class="w50 gutter" label="任务名称" :rules="rulesObj.Topics" prop="TaskSafetyMeeting.Topics" ref="TaskSafetyMeeting.Topics">
                <el-input placeholder="请输入" v-model="TaskSafetyMeeting.Topics" :disabled="isView"></el-input>
            </el-form-item>
            <el-form-item
                class="w50" 
                label="会议时长"
                :rules="rulesObj.MaxTime"
                prop="TaskSafetyMeeting.MaxTime"
                ref="TaskSafetyMeeting.MaxTime"
            >
                <div class="second-content f--c" :class="{disabled: isView}">
                    <div>
                        <el-dropdown trigger="click" @command="changeSeconds($event, 'h')" placement="bottom-start" :disabled="isView">
                            <div class="second-item">
                                <span>
                                    <span>{{ hms.h }}</span>
                                </span>
                                <span>小时</span>
                            </div>
                            <el-dropdown-menu slot="dropdown" style="height: 40vh;">
                                <el-scrollbar style="height: 100%;">
                                    <el-dropdown-item v-for="(item, index) in 25" :key="index" :command="index">{{ index < 10 ? '0' +index  : index }}</el-dropdown-item>
                                </el-scrollbar>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div>
                        <el-dropdown trigger="click" @command="changeSeconds($event, 'm')" placement="bottom-start" :disabled="isView">
                            <div class="second-item">
                                <span>
                                    <span>{{ hms.m }}</span>
                                </span>
                                <span>分钟</span>
                            </div>
                            <el-dropdown-menu slot="dropdown" style="height: 40vh;">
                                <el-scrollbar style="height: 100%;">
                                    <el-dropdown-item v-for="(item, index) in 60" :key="index" :command="index">{{ index < 10 ? '0' +index : index }}</el-dropdown-item>
                                </el-scrollbar>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div>
                        <el-dropdown trigger="click" @command="changeSeconds($event, 's')" placement="bottom-start" :disabled="isView">
                            <div class="second-item">
                                <span>
                                    <span>{{ hms.s }}</span>
                                </span>
                                <span>秒</span>
                            </div>
                            <el-dropdown-menu slot="dropdown" style="height: 40vh;">
                                <el-scrollbar style="height: 100%;">
                                    <el-dropdown-item v-for="(item, index) in 60" :key="index" :command="index">{{ index < 10 ? '0' +index : index }}</el-dropdown-item>
                                </el-scrollbar>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <el-input v-model="TaskSafetyMeeting.MaxTime" style="width:0;height:0;opacity:0;overflow:hidden;"></el-input>
                </div>
            </el-form-item>
        </div>
        <el-form-item label="会议内容" :rules="rulesObj.Content" prop="TaskSafetyMeeting.Content" ref="TaskSafetyMeeting.Content">
            <el-input type="textarea" placeholder="请输入" v-model="TaskSafetyMeeting.Content" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item
            label="上传附件"
            prop="TaskSafetyMeeting.Attachments"
            ref="TaskSafetyMeeting.Attachments"
        >
            <div class="f-b-c" v-if="!isView">
                <customUploadDrag 
                    class="w50"
                    @onUpload="handleUpload"
                    :Data="TaskSafetyMeeting.Attachments"
                    :acceptList="['mp4', 'mp3', 'png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'xls', 'xlsx', 'pdf']"
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
            </div>
            <div class="file-list"
                v-for="(item, index) in TaskSafetyMeeting.Attachments"
                :key="index"
            >
                <div class="file-item">
                    <div class="file f-b-c cursor-p" @click="$openFile(item.VideoUrl)">
                        <div class="f">
                            <img style="width:30px;height:30px;margin-right: 13px;"
                                :src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
                            <div class="text">
                                <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.Name}}</div>
                                <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.Size | formatSize}}</div>
                            </div>
                        </div>
                        <div>
                            <i class="el-icon-error cursor-p" @click="TaskSafetyMeeting.Attachments.splice(index, 1)" v-if="!isView"></i>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </el-form-item>
    </div>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import ZYselect from "@/components/common/zy_select";
import customUploadDrag from "@/components/common/custom-upload-drag.vue";
import util from "@/common/util.js";

function hmsToSeconds(hms) {
    let h = hms.h;
    let m = hms.m;
    let s = hms.s;
    return (h * 60 * 60) + (m * 60) + s;
}
function secondsToHms(s) {
    return {
        h: parseInt(s / 60 / 60 % 24),
        m: parseInt(s / 60 % 60),
        s: parseInt(s % 60),
    }
}
export default {
    name: 'meeting-item',
    components: {
        ZYselect,
        customUploadDrag
    },
    mixins: [request_mixin],
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
        },
    },
    filters: {
        formatSize: util.change_size,
    },
    data() {
        return {
            TaskSafetyMeeting: {
                MeetingTypeCode: '',
                SessionTime: [],
                Topics: '',
                Content: '',
                Attachments: [],
                MaxTime: 0
            },
            rulesObj: {
                MeetingTypeCode: [
                    {required: true, message: '请选择会议类型', trigger: 'change'}
                ],
                SessionTime: [
                    {required: true, message: '请选择会议时间', trigger: ['blur', 'change']},
                ],
                Topics:  [
                    {required: true, message: '请输入任务名称', trigger: ['blur', 'change']},
                ],
                Content:  [
                    {required: true, message: '请输入会议内容', trigger: ['blur', 'change']},
                ],
                MaxTime:  [
                    {required: true, message: '请选择会议时长', trigger: ['blur', 'change']},
                    {
                        validator(rule, value, callback) {
                            if (value == 0) {
                                callback(new Error('请选择会议时长'));
                            } else {
                                callback();
                            }
                        }, trigger: ['change']
                    }
                ],
            },
            hms: {
                h: 0,
                m: 0,
                s: 0
            }
        }
    },
    model: {
        event: 'change'
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                if (val.SafetyMeetingSessions && !!val.SafetyMeetingSessions.length) {
                    this.TaskSafetyMeeting = Object.assign(val, val.SafetyMeetingSessions[0]);
                    if (this.TaskSafetyMeeting.SessionStartTimeDesc) {
                        this.TaskSafetyMeeting.SessionTime = [this.TaskSafetyMeeting.SessionStartTimeDesc, this.TaskSafetyMeeting.SessionEndTimeDesc];
                    }
                    this.TaskSafetyMeeting.Attachments = this.TaskSafetyMeeting.AttachmentVideos;
                    this.hms = secondsToHms(val.MaxTime)
                } else {
                    this.TaskSafetyMeeting = val;
                }
            }
        },
        TaskSafetyMeeting: {
            deep: true,
            handler() {
                this.$emit('change', this.TaskSafetyMeeting);
            },
        }
    },
    methods: {
        handleUpload() {
            this.TaskSafetyMeeting.Attachments.forEach(item => {
                this.$set(item, 'Name', item.name);
                this.$set(item, 'VideoUrl', item.url);
                this.$set(item, 'Size', item.size);
                this.$set(item, 'Ext', item.ext);
                this.$set(item, 'CoverUrl', item.coverUrl);
                this.$set(item, 'Lengths', item.lengths);
                this.$set(item, 'TotalSeconds', item.lengths);
            });
        },
        changeSeconds(val, key) {
            this.hms[key] = val;
            this.TaskSafetyMeeting.MaxTime = hmsToSeconds(this.hms);
        },
    },
}
</script>

<style lang="scss" scoped>
.el-dropdown-menu{
    /deep/ .el-scrollbar__wrap{
        margin-bottom: 0 !important;
        overflow-x: hidden;
    }
    /deep/ .el-scrollbar__bar.is-horizontal{
        display: none;
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

.el-form-item.is-error .second-content{
    border-color: #F56C6C;
}
.second-content{
    border-radius: 4px;
    border: 1px solid #DDDDDD;
    width: 100%;
    height: 40px;
    &.disabled{
        background: #F5F7FA;
        border-color: #E4E7ED;
    }
    >div{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 33.33%;
        height: 100%;
        /deep/ .el-dropdown{
            width: 100%;
            .second-item{
                display: flex;
                >span{
                    width: 50%;
                    cursor: pointer;
                    color: #181B3B;
                    &:first-child{
                        padding-right: 8px;
                        text-align: right;
                        color: $primary-color;
                    }
                }
            }
        }
    }
}
</style>
