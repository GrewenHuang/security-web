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
            <div class="content" v-if="!!info">
                <div class="h2">会议记录</div>
				<div class="info-item f--c">
				    <div class="f--c f1">
				        <div class="label">企业：</div>
				        <div>
				            {{ info.EnterpriseName }}
				        </div>
				    </div>
				    <div class="f--c f1">
				        <div class="label">部门：</div>
				        <div>
				            {{ info.DepartmentName }}
				        </div>
				    </div>
				</div>
				<div class="info-item f--c">
				    <div class="f--c f1">
				        <div class="label">主要议题：</div>
				        <div>
				            {{ info.Topics }}
				        </div>
				    </div>
				    <div class="f--c f1">
				        <div class="label">安全等级：</div>
				        <div>
				            {{ info.SecurityLevelDesc }}
				        </div>
				    </div>
				</div>
                <div class="info-item f--c">
                    <div class="f--c f1">
                        <div class="label">会议时间：</div>
                        <div>
                           <span v-if="info.SafetyMeetingSessions[0].SafetyMeetingType == 1">
							    {{ info.SafetyMeetingSessions[0].SessionStartTimeDesc| format('yyyy-MM-dd') }} 至 {{ info.SafetyMeetingSessions[0].SessionEndTimeDesc | format('yyyy-MM-dd') }}
						   </span>
						   <span v-else>
							   {{ info.SafetyMeetingSessions[0].SessionStartTimeDesc }}至{{ info.SafetyMeetingSessions[0].SessionEndTimeDesc }}
						   </span>
                        </div>
                    </div>
                    <div class="f--c f1" v-if="info.SafetyMeetingType == 1">
                        <div class="label">会议时长：</div>
                        <div>
                            {{ secondsToHms(info.MaxTime) }}
                        </div>
                    </div>
                </div>
                <div class="info-item f--c">
                    <div class="f--c f1">
                        <div class="label">会议方式：</div>
                        <div>
                            {{ info.SafetyMeetingTypeDesc }}
                        </div>
                    </div>
                    <div class="f--c f1">
                        <div class="label">会议类型：</div>
                        <div>
                            {{ info.MeetingTypeName }}
                        </div>
                    </div>
                </div>
                <div class="info-item f--c" v-if="info.SafetyMeetingType == 2">
                    <div class="f--c f1">
                        <div class="label">会议记录人：</div>
                        <div>
                            {{ info.RecorderUserName }}
                        </div>
                    </div>
                    <div class="f--c f1">
                        <div class="label">会议主持人：</div>
                        <div>
                            {{ info.ModeratorUserName }}
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">会议内容：</div>
                    <div>
                        <audio controls style="width: 35%;">
                            <source :src="info.ContentWavUrl"/>
                        </audio>
                        <div class="meeting-content">
                            <vue-ellipsis-text
                                :content="info.Content"
                                :line="3"
                                :hasMore="true"
                                :revealWidth="80"
                                revealText="查看更多"
                                foldText="收起"
                            />
                        </div>
                        <div class="files">
                            <div class="file-item f" v-for="(item, index) in info.fileList" :key="index" @click="$openFile(item.VideoUrl)">
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
                <template v-if="info.SafetyMeetingType == 1 || info.SafetyMeetingType == 2">
                    <div class="title f-b-c" style="margin-top: 27px;">
                        <span>签名详情（{{ singedNum }}/{{ totalNum }}）</span>
                    </div>
                    <el-table
                        style="margin-top: 20px;"
                        :data="userList"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            width="80"
                        ></el-table-column>
                        <el-table-column
                            label="参与人"
                            prop="UserName"
                        ></el-table-column>
                        <el-table-column
                            label="状态"
                            width="160"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <whether :yes="row.Status == 1 || row.Status == 2" :text="statusObj[row.Status]"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="照片"
                            width="160"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <el-image
                                    style="width:80px;height:80px;"
                                    :src="row.UploadPhotos[0].Url"
                                    :preview-src-list="row.UploadPhotos.map(u=>u.Url)"
                                    v-if="row.UploadPhotos.length"
                                ></el-image>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="签名"
                            width="130"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <el-image
                                    style="width:auto;height:45px;"
                                    :src="row.SignInUrl"
                                    :preview-src-list="[row.SignInUrl]"
                                    v-if="row.SignInUrl"
                                ></el-image>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="签名时间"
                            width="180"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <div v-if="row.SignInDate">
                                    {{ row.SignInDate | format('yyyy-MM-dd') }}
                                </div>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
				<template v-else>
					<div class="info-item f--c" v-if="userList && userList.length > 0">
					    <div class="f--c f1">
					        <div class="label">参与人：</div>
					        <div>
					            {{ userList.map(item => item.UserName).join(',') }}
					        </div>
					    </div>
					</div>
				</template>
            </div>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import util from '@/common/util'
import VueEllipsisText from 'vue-ellipsis-text'
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'page-info',
    mixins: [request_mixin],
    components: {
        VueEllipsisText
    },
    data() {
        return {
            statusObj: {
                0: '未开始',
                1: '进行中',
                2: '已签名',
                3: '已补签',
                4: '已结束',
            },
            id: '',
            loading: false,
            dislogShow: false,
            userList: [],
            info: null,
            singedNum: 0,
            totalNum: 0
        }
    },
    computed: {
        title() {
            return '查看'
        }
    },
    filters: {
        formatSize: util.change_size
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.SafetyMeetingId;
                item.fileList = item.SafetyMeetingSessions[0].AttachmentVideos;
                this.userList = item.SafetyMeetingSessions[0].SafetyMeetingPersonnels;
                this.totalNum = this.userList.length;
                this.singedNum = this.userList.filter(item=>!!item.SignInUrl).length;
                this.info = {...item, ...item.SafetyMeetingSessions[0]};
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = null;
        },
        secondsToHms(s) {
            let {hh, mm, ss} = {
                hh: parseInt(s / 60 / 60 % 24),
                mm: parseInt(s / 60 % 60),
                ss: parseInt(s % 60),
            }
            return (hh ? hh+'时' : '') + (mm ? mm+'分' : '') + (ss ? ss+'秒' : '')
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        color: #181B3B;
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        .h2{
            margin-bottom: 7px;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
        }
        .content{
            padding: 22px 25px;
            .title{
                padding: 0 15px;
                height: 50px;
                background: #F5F6FA;
                >span{
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    font-weight: bold;
                    &::before{
                        content: '';
                        display: inline-block;
                        margin-right: 8px;
                        width: 5px;
                        height: 16px;
                        background: $--color-primary;
                    }
                }
                .el-button{
                    padding: 5px 10px;
                    height: 30px;
                }
            }
            .info-item{
                border-bottom: 1px solid #efefef;
                padding: 20px 15px;
                .label{
                    font-weight: bold;
                }
                .sign{
                    margin: -12px 0 -13px 26px;
                    width: auto;
                    height: 45px;
                }
            }
            /deep/ .ellipsis-more{
                color: $--color-primary;
                background: linear-gradient(90deg, transparent 0% , #fff 30%);
            }
            /deep/ .ellipsis-fold-text{
                text-align: center;
                color: $--color-primary;
            }
            audio{
                margin-top: 20px;
            }
            .meeting-content{
                margin-top: 20px;
            }
            .files{
                margin-top: 20px;
                .file-item{
                    border: 1px dashed #ccc;
                    border-radius: 4px;
                    padding: 11px 10px;
                    cursor: pointer;
                    &:not(:first-child) {
                        margin-top: 10px;
                    }
                }
            }
        }
    }
</style>
