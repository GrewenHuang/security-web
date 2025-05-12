<template>
    <el-form
        class="super-daily-tasks"
        ref="form"
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
        <template v-if="$slots.default">
            <div class="global-divider"></div>
            <slot></slot>
        </template>
        <template v-if="executeType == 1">
            <div class="global-divider"></div>
            <el-form-item label="回执附件上传" ref="receiptAttachments" prop="receiptAttachments" :required="this.info.IsNeedBackFile==1" v-show="info.IsNeedBackFile==1">
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
                        <div class="file f-b-c cursor-p" @click="$openFile(item.Url)">
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
        </template>
    </el-form>
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
            enterpriseRelationId: '',
            taskType: '',
            RelationId: '',
            info: _extends(defaultInfo),
            rules: {
                receiptAttachments: [
                    {
                        validator: (rule, value, callback) => {
                            if (!value.length && this.info.IsNeedBackFile == 1 && this.executeType == 1) {
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
            return '执行（日常工作任务）'
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            if (this.item) {
                this.$emit('update:loading', true)
                this.id = this.item.TaskAssignmentId;
                this.enterpriseRelationId = this.item.EnterpriseRelationId;
                this.taskType = this.item.TaskType;
                this.relationId = this.item.RelationId;
                try {
                    let url = url = `/GetTaskWorkTask?relationId=${this.item.RelationId}&taskAssignmentId=${this.item.TaskAssignmentId}`;
                    let res = await this.Get(url);
                    if (res.status == 2000) {
                        this.$emit('remark', res.data.RemarkObjects);
                        this.info = _extends(Object.assign(defaultInfo, res.data));
                    } else {
                        this.$message.error(res.message);
                        this.$emit('close')
                    }
                } catch (error) {
                    this.$message.error('获取数据失败，请稍后重试');
                    this.$emit('close')
                }
                this.$emit('update:loading', false)
            }
        },
        save(fn) {
            this.$refs.form.validate(async valid => {
                if (valid) {
                let params = {
                    TaskAssignmentId: this.id,
                }
                if (typeof fn === 'function' && this.executeType == 2) {
                    let otherParam = fn();
                    if (!otherParam) {
                        return 
                    } else {
                        Object.assign(params, otherParam, {
                            TaskType: this.taskType,
                            RelationId: this.relationId
                        });
                    }
                } else {
                    Object.assign(params, {
                        Attachments: this.info.receiptAttachments,
                        WorkTaskId: this.enterpriseRelationId
                    })
                }
                this.$emit('update:submitLoading', true)
                    try {
                        let res = {};
                        if (this.executeType == 2) {
                            res = await this.Post('/SaveTaskRelay', params);
                        } else {
                            res = await this.Post('/SaveEnterpriseWorkTask', params);
                        }
                        if (res.status == 2000) {
                            this.$message.success('操作成功')
                            this.$emit('load');
                            this.$emit('close')
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                    this.$emit('update:submitLoading', false)
                } else {
                    if (this.$refs.receiptAttachments) {
                        this.$refs.receiptAttachments.$el.scrollIntoView({behavior: 'smooth'})
                    }
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
        /deep/ .global-divider{
            margin-left:-29px;
            margin-right:-29px;
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