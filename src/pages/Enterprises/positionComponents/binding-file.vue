<template>
    <el-dialog
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
            <div class="content">
                <el-collapse
                    v-model="collapseActive"
                >
                    <el-collapse-item
                        v-for="(item, i) in fileList"
                        :key="i"
                        :name="i"
                    >
                        <div slot="title" class="f-b-c f1">
                            <span>{{ item.FileName || '请输入文件名称' }}</span>
                            <div class="f--c operation">
                                <div class="switch" :class="{open: collapseActive.includes(i)}">
                                    {{ collapseActive.includes(i) ? '收起' : '展开' }}
                                </div>
                                <div @click.stop="fileList.splice(i, 1)">删除</div> 
                            </div>
                        </div>
                        <el-form :ref="'form'+i" label-position="top" :model="item" :rules="rules">
                            <el-form-item
                                label="文件名称"
                                prop="FileName"
                            >
                                <el-input placeholder="请输入" v-model="item.FileName"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="文件内容"
                                prop="FileContent"
                            >
                                <el-input type="textarea" placeholder="请输入" v-model="item.FileContent"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="模板文件"
                                prop="FileSignTempUrlJson"
                            >
                                <div class="f-b-c">
                                    <customUploadDrag 
                                        class="w50"
                                        @onUpload="handleUpload(item, 'form'+i, $event)"
                                        :Data.sync="item.FileSignTempUrlJson"
                                        :showFileList="false"
                                        :single="true"
                                        :acceptList="['doc']"
                                    >
                                        <div class="f-c-c">
                                            <i class="el-icon-upload"></i>
                                            <div class="el-upload__text">
                                                将文件拖到此处或<em>点击上传</em>
                                            </div>
                                        </div>
                                    </customUploadDrag>
                                    <div class="f--c w50" style="color: #959595;margin-left: 15px;">
                                        <span style="line-height: 1.3;">
                                            仅支持.doc文件。以下变量用于展示签名和签名时间，变量字符后面不能有其他字符
                                            <br />
                                            签名变量：{{'\{\{SignUrl\}\}'}}，签名日期变量：{{'\{\{SignDate\}\}'}}
                                        </span>
                                    </div>
                                </div>
                                <div class="file-list"
                                    v-for="(file, index) in item.FileSignTempUrlJson"
                                    :key="index"
                                >
                                    <div class="file-item">
                                        <div class="file f-b-c">
                                            <div class="f">
                                                <img style="width:30px;height:30px;margin-right: 13px;"
                                                    :src="$fileIcons[file.name.substring(file.name.lastIndexOf('.') + 1)]" />
                                                <div class="text">
                                                    <div style="color:#44566C;font-size:12px;line-height: 1;;">{{file.name}}</div>
                                                    <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ file.size | formatSize}}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <i class="el-icon-error cursor-p" @click="item.FileSignTempUrlJson.splice(index, 1)"></i>
                                            </div>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
                <div class="split-line" v-if="!!fileList.length"></div>
                <no-data style="margin-bottom: 20px;" v-if="!fileList.length"></no-data>
                <el-button type="primary" plain @click="add" style="width: 100%;">新增</el-button>
            </div>
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
    FileName: '', // 文件名称
    FileContent: '', // 文件内容 
    FileSignTempUrl: '', // 文件模板URL
    FileSignTempUrlJson: [], // 上传的模板文件
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'page-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            fileList: [],
            rules: {
                FileName: [{required: true, message: '请输入文件名称', trigger: ['change', 'blur']}],
                FileContent: [{required: true, message: '请输入文件内容', trigger: ['change', 'blur']}],
                FileSignTempUrlJson: [
                    { type: 'array', required: true, message: '请上传模板文件', trigger: ['change', 'blur'] }
                ]
            },
            collapseActive: [],
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
                this.id = item.PositionId;
                try {
                   let res = await this.Get(`/GetPositionFileSigns?positionId=${this.id}`)
                   if (res.status == 2000) {
                        this.fileList = res.data.map(item => {
                            item.FileSignTempUrlJson = JSON.parse(item.FileSignTempUrlJson);
                            return item;
                        });
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
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.fileList = [];
        },
        async save() {
            let errorList = [];
            let offsetTop = -1;
            for (let i = 0; i < this.fileList.length; i++) {
                let form = this.$refs['form'+i][0];
                if (form) {
                    form.validate((valid, fields) => {
                        if (!valid) {
                            errorList.push(fields)
                            let index = this.collapseActive.indexOf(i);
                            if (index == -1) {
                                this.collapseActive.push(i);
                            }
                        }
                    });
                    if (offsetTop < 0) {
                        offsetTop = form.$el.offsetTop;
                    }
                }
            }
            if (!this.fileList.length) {
                return this.$message.warning('请添加文件');
            }
            if (!errorList.length) {
                this.submitLoading = true;
                try {
                    let params = {
                    PositionId: this.id,
                    PositionFileSigns: this.fileList.map(item=>{
                        item.FileSignTempUrlJson = JSON.stringify(item.FileSignTempUrlJson);
                        return item;
                    })
                    }
                    let res = await this.Post('/SavePositionFileSign', params)
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
            } else {
                this.$refs.scrollbar.wrap.scrollTop = offsetTop;
            }
        },
        add() {
            this.fileList.push(_extends(defaultInfo));
            this.collapseActive.push(this.fileList.length - 1);
        },
        handleUpload(item, formRef) {
            this.$nextTick(() => {
                item.FileSignTempUrl = item.FileSignTempUrlJson[0].url;
                this.$refs[formRef][0].validateField('FileSignTempUrlJson');
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
            min-width: 1000px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-scrollbar__wrap{
            margin-bottom: 0 !important;
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            &:first-child{
                margin-right: 0;
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
        .gutter{
            &::before{
                content: '';
                display: block;
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        /deep/ .el-collapse{
            border: 0;
            &:not(:last-child) {
                margin-bottom: 28px;
            }
            .el-collapse-item{
                border: 1px solid #DCDFE6;
                border-radius: 6px;
                margin-bottom: 20px;
                overflow: hidden;
                &.is-active{
                    .el-collapse-item__header{
                        border-bottom: 1px solid #DCDFE6;
                    }
                }
                .el-input.is-disabled .el-input__inner,
                .el-textarea.is-disabled .el-textarea__inner{
                    color: #84888f;
                    background: #f7f8f9;
                }
                .el-collapse-item__header{
                    border: 1px solid transparent;
                    padding: 14px 20px;
                    background: #F5F6FA;
                    line-height: inherit;
                    .title{
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        line-height: 22px;
                        color: #302E37;
                        font-weight: 600;
                    }
                    .operation{
                        color: $primary-color;
                        .switch{
                            display: flex;
                            align-items: center;
                            &::before{
                                content: '';
                                border: 8.25px solid $primary-color;
                                border-bottom: 0;
                                border-right: 6px solid transparent;
                                border-left: 6px solid transparent;
                                margin-right: 6px;
                                width: 0;
                                height: 0;
                                transform-origin: center;
                                transform: rotateX(0);
                                transition: all .2s linear;
                            }
                            &.open{
                                &::before{
                                    transform: rotateX(180deg);
                                }
                            }
                        }
                        >div:last-child{
                            margin-left: 22px;
                        }
                    }
                }
                .el-collapse-item__arrow{
                    display: none;
                }
                .el-collapse-item__wrap{
                    border: none;
                }
                .el-collapse-item__content{
                    padding: 0;
                }
            }
        }
        /deep/ .el-button--primary.is-plain{
            border-style: dashed;
        }
        .content{
            padding: 25px 30px;
        }
        .split-line{
            margin: 30px -30px;
            height: 10px;
            background: #F2F2F2;
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
    }
</style>