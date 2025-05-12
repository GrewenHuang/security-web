<template>
    <el-dialog v-dialog-drag 
        title="查看"
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
                <div class="h2">培训记录</div>
				<div class="info-item f--c">
				    <div class="f--c f1">
				        <div class="label">企业：</div>
				        <div>
				            {{ info.EnterpriseName}}
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
                        <div class="label">培训周期：</div>
                        <div v-if="info.TrainDateRange && info.TrainDateRange.length > 0">
                            {{ info.TrainDateRange[0] }} 至 {{ info.TrainDateRange[1] }}
                        </div>
						<div v-else>不限</div>
                    </div>
                    <div class="f--c f1">
                        <div class="label">会议类型：</div>
                        <div>
                              {{ info.TrainTaskName }}
                        </div>
                    </div>
                </div>
               <!-- <div class="info-item f--c">
                    <div class="f--c f1">
                        <div class="label">会议类型：</div>
                        <div>
                            {{ info.TrainTaskName }}
                        </div>
                    </div>
                </div> -->
                <div class="info-item">
                    <div class="label">会议内容：</div>
                    <div>
                       <!-- <audio controls style="width: 35%;">
                            <source :src="info.TrainContent"/>
                        </audio> -->
                        <div class="meeting-content">
                            <vue-ellipsis-text
                                :content="info.TrainContent"
                                :line="3"
                                :hasMore="true"
                                :revealWidth="80"
                                revealText="查看更多"
                                foldText="收起"
                            />
                        </div>
                    </div>
                </div>
				<div class="info-item">
					<div class="label">附件：</div>
					<div class="files" v-if="info.TrainFiles && info.TrainFiles.length > 0">
					    <div class="file-item f" v-for="(item, index) in info.TrainFiles" :key="index" @click="$openFile(item.url)">
					        <img style="width:30px;height:30px;margin-right: 13px;"
					            :src="$fileIcons[item.name.substring(item.name.lastIndexOf('.') + 1)]" />
					        <div class="text">
					            <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.name}}</div>
					            <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.size | formatSize}}</div>
					        </div>
					    </div>
					</div>
				</div>
				<template >
					<div class="info-item f--c" v-if="info.Users && info.Users.length > 0">
					    <div class="f--c f1">
					        <div class="label">参与人：</div>
					        <div>
					            {{ info.Users.map(item => item.UserName).join(',') }}
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
            dislogShow: false,
            info: null,
			loading: false
        }
    },
    filters: {
        formatSize: util.change_size
    },
    methods: {
        show(item) {
            this.dislogShow = true;
			this.info = _extends(item)
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.info = null;
        },
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
