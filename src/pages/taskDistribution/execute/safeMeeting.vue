<template>
    <el-form class="super-safe-meeting-info" ref="form" :rules="rules" label-position="top" :model="info">
        <el-form-item label="会议类型">
            <el-input v-model="info.MeetingTypeName" disabled></el-input>
        </el-form-item>
        <el-form-item label='主要议题'>
            <el-input v-model="info.Topics" disabled></el-input>
        </el-form-item>
        <el-form-item label='会议内容'>
            <el-input v-model="info.Content"
                type='textarea'
                rows="5"
                disabled></el-input>
        </el-form-item>
        <div class="f-b-c">
            <el-form-item class="w50 mr20" label="会议方式">
                <el-input v-model="info.SafetyMeetingTypeDesc" disabled></el-input>
            </el-form-item>
            <el-form-item class="w50" label="会议时间">
                <el-date-picker type="datetimerange"
                    value-format='yyyy-MM-dd HH:mm'
                    v-model="info.SessionTime"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled>
                </el-date-picker>
            </el-form-item>
        </div>
        <el-form-item label="会议附件">
            <div class="file-list"
                v-for="(item, index) in info.Attachments"
                :key="index"
            >
                <div class="file-item">
                    <div class="file f--c cursor-p" @click="$openFile(item.VideoUrl)">
                        <div class="f">
                            <img style="width:30px;height:30px;margin-right: 13px;"
                                :src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
                            <div class="text">
                                <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.Name}}</div>
                                <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.Size | formatSize}}</div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </el-form-item>
        <div class="f-b-c">
            <el-form-item
                class="w50 gutter" 
                label="会议时长"
                prop="MaxTime"
            >
                <div class="second-content disabled f--c">
                    <div>
                        <el-dropdown trigger="click" @command="changeSeconds($event, 'h')" placement="bottom-start" disabled>
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
                        <el-dropdown trigger="click" @command="changeSeconds($event, 'm')" placement="bottom-start" disabled>
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
                        <el-dropdown trigger="click" @command="changeSeconds($event, 's')" placement="bottom-start" disabled>
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
                </div>
            </el-form-item>
            <div class="w50"></div>
        </div>
        <div class="f-b-c" v-if="executeType == 1">
            <el-form-item class="w50 mr20" label="会议主持人">
                <el-input placeholder="请选择" readonly v-model="info.ModeratorName" class="input-with-select">
                    <template  v-if="!!info.ModeratorName">
                            <i class="el-icon-error cursor-p f--c" style="height: 100%;" slot="suffix" @click="removeItem(info, 'ModeratorId', 'ModeratorName')"></i>
                    </template>
                    <el-button slot="append" @click="chooseModerator">选择</el-button>
                </el-input>
            </el-form-item>
            <el-form-item class="w50" label="会议记录人">
                <el-input placeholder="请选择" readonly v-model="info.RecorderName" class="input-with-select">
                    <template  v-if="!!info.RecorderName">
                            <i class="el-icon-error cursor-p f--c" style="height: 100%;" slot="suffix" @click="removeItem(info, 'RecorderId', 'RecorderName')"></i>
                    </template>
                    <el-button slot="append" @click="chooseRecorder">选择</el-button>
                </el-input>
            </el-form-item>
        </div>
        <template v-if="!!$slots.default">
            <div class="global-divider"></div>
            <slot></slot>
        </template>
        <el-form-item ref="users" v-if="executeType == 1">
            <div class="global-divider"></div>
            <div class="f-b-c" style="margin-bottom: 10px;">
                <div>参与人</div>
                <el-button type="primary" @click="chooseUser">选择参与人员</el-button>
            </div>
            <el-table
                :data="PersonnelList"
                highlight-current-row
                :header-cell-style="$tableStyle"
                style="width: 100%"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="60"
                >
                </el-table-column>
                <el-table-column
                    label="部门"
                    align="center"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row.DepartmentList.map(item => item.DepartmentName).join('、') }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="岗位"
                    align="center"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="姓名"
                    align="center"
                    prop="UserName"
                >
                </el-table-column>
                <el-table-column
                    label="手机号"
                    align="center"
                    prop="Tel"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            text-plain
                            @click="
                                delPersonnel(
                                    scope.$index
                                )
                            "
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
    </el-form>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
    MeetingTypeName: '',
    Attachments: [],
    Topics: '',
    Content: '',
    SafetyMeetingTypeDesc: '',
    Users: [], // 参与人
    ModeratorName: '', // 主持人
    ModeratorId: '', // 主持人
    RecorderName: '', // 会议记录人
    RecorderId: '', // 会议记录人
    MaxTime: '', // 培训时长
}
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj))
}
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
    name: 'super-safe-meeting-info',
    mixins: [request_mixin],
    props: {
        loading: false,
        submitLoading: false,
        item: {
            type: Object,
            required: true
        },
        executeType: {
            type: [String, Number]
        }
    },
    data() {
        return {
            id: '',
            info: _extends(defaultInfo),
            rules: {
            },
            SessionTime:[],
            PersonnelList: [],
            hms: {
                h: 0,
                m: 0,
                s: 0
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '执行（安全例会任务）'
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            this.$emit('update:loading', true);
            if (this.item) {
                this.id = this.item.TaskAssignmentId;
                try {
                    let res = await this.Get(`/GetTaskSafetyMeeting?relationId=${this.item.RelationId}&taskAssignmentId=${this.item.TaskAssignmentId}`);
                    if (res.status == 2000) {
                        this.info = _extends(Object.assign(defaultInfo, res.data));
                        if (res.data.SafetyMeetingSessions && !!res.data.SafetyMeetingSessions.length) {
                            let item = res.data.SafetyMeetingSessions[0];
                            this.info.Attachments = item.AttachmentVideos;
                            this.info.SessionTime = [item.SessionEndTimeDesc,item.SessionStartTimeDesc];
                            this.hms = secondsToHms(this.info.MaxTime);
                            this.$emit('remark', res.data.RemarkObjects);
                        }
                    } else {
                        this.$message.error(res.message);
                        this.$emit('close')
                    }
                } catch (error) {
                    console.error(error)
                }
                this.$emit('update:loading', false);
            }
        },
        save(fn) {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    if (!this.info.Users.length && this.executeType == 1) {
                        this.$message.error('请选择参与人员');
                        this.$refs.users.$el.scrollIntoView({behavior: 'smooth'});
                        return
                    }
                    let params = {
                        TaskAssignmentId: this.id,
                    }
                    if (typeof fn === 'function' && this.executeType == 2) {
                        let otherParam = fn();
                        if (!otherParam) {
                            return 
                        } else {
                            Object.assign(params, otherParam);
                        }
                    } else {
                        Object.assign(params, {
                            Users: this.info.Users,
                            MaxTime: this.info.MaxTime,
                            ModeratorUserId: this.info.ModeratorId,
                            RecorderId: this.info.RecorderId
                        })
                    }
                    this.$emit('update:submitLoading', true)
                    try {
                        let res = {};
                        if (this.executeType == 2) {
                            res = await this.Post('/SaveTaskRelay', params);
                        } else {
                            res = await this.Post('/SaveEnterpriseSafetyMeeting', params);
                        }
                        if (res.status === 2000) {
                            this.$message.success('操作成功');
                            this.$emit('load');
                            this.$emit('close')
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        console.error(error)
                    }
                    this.$emit('update:submitLoading', false)
                }
            })
        },
        delPersonnel(index) {
            this.PersonnelList.splice(index, 1);
            this.info.Users.splice(index, 1);
        },
        chooseUser() {
            this.$chooseUser({
                choosed: this.PersonnelList
            }).then(data => {
                this.PersonnelList = data;
                this.info.Users = data.map(item => {
                    return {
                        UserId: item.UserId
                    }
                })
            })
        },
        chooseModerator(){
            this.$chooseUser({
                single: false,
            }).then(data => {
                this.info.ModeratorId = data.UserId;
                this.info.ModeratorName = data.UserName;
            });
        },
        chooseRecorder() {
            this.$chooseUser({
                single: false
            }).then(data => {
                this.info.RecorderId = data.UserId;
                this.info.RecorderName = data.UserName;
            })
        },
        changeSeconds(val, key) {
            this.hms[key] = val;
            this.info.MaxTime = hmsToSeconds(this.hms);
        },
        removeItem(item, nameKey, idKey) {
            item[nameKey] = '';
            item[idKey] = '';
        },
    }
}
</script>

<style lang="scss" scoped>
    .super-safe-meeting-info{
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .global-divider{
            margin-left:-29px;
            margin-right:-29px;
        }
        .el-date-editor{
            width: 100%;
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
    }
    /deep/ .el-scrollbar__wrap{
        overflow-x: hidden;
    }
</style>