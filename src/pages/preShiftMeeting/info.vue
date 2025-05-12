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
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label="会议日期" prop="MeetingDateList" ref="MeetingDateList">
                        <div class="f-b-c">
                            <el-date-picker
                                type="date"
                                placeholder="开始时间"
                                value-format="yyyy-MM-dd"
                                v-model="info.StartDate"
                            ></el-date-picker>
                            <span style="white-space: pre;">-</span>
                            <el-date-picker
                                type="date"
                                placeholder="结束时间"
                                value-format="yyyy-MM-dd"
                                v-model="info.EndDate"
                            ></el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item class="w50" label="签字时间">
                        <el-time-select
                            placeholder="开始时间"
                            :picker-options="{
                                start: '00:00',
                                step: '00:30',
                                end: '23:59'
                            }"
                            v-model="info.SignStartTime"
                        ></el-time-select>
                        <span style="white-space: pre;">-</span>
                        <el-time-select
                            placeholder="结束时间"
                            :picker-options="{
                                start: '00:00',
                                step: '00:30',
                                end: '23:30',
                                minTime: info.SignStartTime
                            }"
                            v-model="info.SignEndTime"
                        ></el-time-select>
                    </el-form-item>
                </div>
                <el-form-item label="参与人" prop="Users" ref="Users">
                    <choose-user v-model="info.Users" :single="false"/>
                </el-form-item>
                <div class="gutter"></div>
                <el-form-item>
                    <div class="f-b-c" slot="label">
                        <span>会议内容</span>
                        <el-button type="primary" @click="$alert('功能开发中...')" v-if="$project_type === 'xtraod'">从数据库选择</el-button>
                    </div>
                    <el-input type="textarea" rows="5" v-model="info.Content"></el-input>
                </el-form-item>
                <el-form-item label="附件">
                    <div class="f-b-c">
                        <customUploadDrag 
                            class="w50"
                            :Data.sync="info.PreMeetingSignFiles"
                            :showFileList="false"
                            :acceptList="['mp4', 'mp3', 'png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'xls', 'xlsx', 'pdf']"
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
                        v-for="(item, index) in info.PreMeetingSignFiles"
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
                                    <i class="el-icon-error cursor-p" @click="info.PreMeetingSignFiles.splice(index, 1)"></i>
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </el-form-item>
                <div class="gutter"></div>
                <el-form-item label="签名" prop="SignInUrl" ref="SignInUrl">
                    <div class="f--c">
                        <div class="sign-btn" @click="sign"></div>
                        <el-image style="height: 45px;width: auto;" :src="info.SignInUrl" :preview-src-list="[info.SignInUrl]" v-if="info.SignInUrl"></el-image>
                    </div>
                    <el-input type="hidden" v-model="info.SignInUrl" style="width: 0;height: 0;visibilty:hidden;"></el-input>
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
import util from '@/common/util'
const defaultInfo = {
    MeetingDateList: '',
    StartDate: '',
    EndDate: '',
    SignStartTime: '',
    SignEndTime: '',
    Users: [],
    Content: '',
    PreMeetingSignFiles: [],
    SignInUrl: null,
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'page-info',
    components: {
        customUploadDrag
    },
    mixins: [request_mixin],
    props: {
        addTitle: {
            type: String,
            default: '新增'
        }
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
                MeetingDateList: [{required: true, trigger: ['change'], validator:(rlue, val, callback) => {
                    if (!this.info.StartDate && !this.info.EndDate) {
                        callback(new Error('请选择会议日期'));
                    } else if (!this.info.StartDate) {
                        callback(new Error('请选择会议开始日期'));
                    } else if (!this.info.EndDate) {
                        callback(new Error('请选择会议结束日期'));
                    } else {
                        callback();
                    }
                }}],
                Users: [{type: 'array', required: true, message: '请选择参与人', trigger: ['change', 'blur']}],
                SignInUrl: [{required: true, message: '请签名', trigger: ['change', 'blur']}],
            }
        }
    },
    filters: {
        formatSize: util.change_size
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : this.addTitle
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.id;
                try {
                   let res = await this.Get(`/GetEmergencyExpert?emergencyExpertId=${item.ExpertId}`)
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
            } else {
                let res = await this.Get('/GetLastPreMeetingSign');
                if (res.status == 2000 && res.data) {
                    res.data.SignStartTime = util.formatDate.format(res.data.SignStartTime, 'hh:mm');
                    res.data.SignEndTime = util.formatDate.format(res.data.SignEndTime, 'hh:mm');
                    res.data.PreMeetingSignFiles.forEach(item => {
                        item.url = item.Url;
                        item.size = item.Size;
                        item.name = item.Name;
                    });
                    this.info = Object.assign(_extends(defaultInfo), res.data);
                    this.info.StartDate = '';
                    this.info.EndDate = '';
                    this.info.SignInUrl = '';
                }
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
                    this.$confirm('请确认会议信息无误，提交后将无法修改！', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '检查信息',
                        type: 'warning'
                    }).then(async res => {
                        this.submitLoading = true;
                        try {
                            let params = {
                                ...this.info
                            }
                            params.MeetingDateList = [this.info.StartDate, this.info.EndDate];
                            // let res = await this.Post('/SavePreMeetingSign', params)
                            // if (res.status == 2000) {
                            //     this.$message.success('保存成功')
                            //     this.$emit('load');
                            //     this.close();
                            // } else {
                            //     this.$message.error(res.message);
                            // }
                        } catch (error) {
                            console.error(error);
                        }
                        this.submitLoading = false;
                    })
                }
            })
        },
        sign() {
            this.$sign().then(signUrl => {
                this.info.SignInUrl = signUrl.url;
            });
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
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;;
            &:first-child{
                margin-right: 20px;
            }
            .el-form-item__label{
                width: 100%;
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
        .sign-btn{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            border: 1px dashed #ddd;
            width: 95px;
            height: 95px;
            background: #f8f8f8;
            color: #959595;
            cursor: pointer;
            &::before{
                content: '';
                display: block;
                margin-bottom: 7px;
                width: 24px;
                height: 27px;
                background: url('../../assets/images/main/sign.png') no-repeat center center;
                background-size: cover;
            }
            &::after{
                content: '点我签名';
                line-height: 1;
            }
        }
    }
</style>