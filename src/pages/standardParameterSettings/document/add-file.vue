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
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="form-2-col">
                    <el-form-item label="子文件名" prop="FolderName">
                        <el-input placeholder="请输入" v-model="info.FolderName" :disabled="isPreview"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="Sort">
                        <el-input-number
                            controls-position="right"
                            :min="1"
                            :disabled="isPreview"
                            v-model="info.Sort"
                        ></el-input-number>
                    </el-form-item>
                </div>
                <div class="split-line"></div>
                <div class="table-content">
                    <div class="title f-b-c">
                        体系文件模板
                        <custom-upload
                            :accept="'.txt,.doc,.xls,.ppt,.pdf,.jpg,.png,.gif,.bmp,.docx,.xlsx,.pptx,.mp4,.avi,.mov'"
                            :fileList.sync="info.TemplateFiles"
                            :list-type="'text'"
                            :show-file-list="false"
                            @change="uploadFile"
                            v-if="info.TemplateFiles.length && !isPreview"
                        >
                            <el-button type="warning">上传体系文件模板</el-button>
                        </custom-upload>
                    </div>
                    <template v-if="info.TemplateFiles.length">
                        <el-table
                            :data="info.TemplateFiles"
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                label="序号"
                                type="index"
                                align="center"
                                width="80"
                            ></el-table-column>
                            <el-table-column
                                label="体系文件模板"
                                prop="FileName"
                                show-overflow-tooltip
                            ></el-table-column>
                            <el-table-column
                                label="文件大小"
                                align="center"
                                width="100"
                            >
                                <template slot-scope="{ row }"> 
                                    {{ row.FileSize | formatSize }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="120"
                            >
                                <template slot-scope="{ row, $index }">
                                    <el-button type="text" @click="$openFile(row.FileUrl)">下载</el-button>
                                    <el-button type="text" text-plain @click="info.TemplateFiles.splice($index, 1)" v-if="!isPreview">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <template v-else>
                        <no-data top="14"/>
                        <div class="f-c-c" v-if="!isPreview">
                            <custom-upload
                                :accept="'.txt,.doc,.xls,.ppt,.pdf,.jpg,.png,.gif,.bmp,.docx,.xlsx,.pptx,.mp4,.avi,.mov'"
                                :fileList.sync="info.TemplateFiles"
                                :list-type="'text'"
                                :show-file-list="false"
                                @change="uploadFile"
                            >
                                <el-button type="warning" style="margin-top: 23px;">上传体系文件模板</el-button>
                            </custom-upload>
                        </div>
                    </template>
                </div>
                <div class="split-line"></div>
                <div class="form-2-col">
                    <el-form-item
                        label="更新规则"
                        prop="UpdateFrequency"
                    >
                        <el-select placeholder="请选择" v-model="info.UpdateFrequency" :disabled="isPreview">
                            <el-option v-for="(item, index) in UpdateFrequencyCom" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="系统自动生成"
                        prop="AssociatedForm"
                        ref="AssociatedForm"
                        v-if="info.UpdateFrequency != actualTimeId"
                    >
                        <el-select placeholder="请选择" v-model="info.AssociatedForm" :disabled="isPreview">
                            <el-option v-for="(item, index) in AssociatedFormCom" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">{{isPreview ? '关闭' : '取消'}}</el-button>
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                v-if="!isPreview"
            >提交</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
    FolderName: '', // 文件名称
    Sort: 1, // 排序
    UpdateFrequency: '', // 更新规则
    AssociatedForm: '',  // 关联表单
    TemplateFiles: [], // 模板文件
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            parentId: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            UpdateFrequencyCom: [], // 更新规则
            AssociatedFormCom: [], // 关联表单
            actualTimeId: '', // 实时更新的id值
            info: _extends(defaultInfo),
            isPreview: false, // 是否为预览
            fileSort: 1,
            rules: {
                FolderName: [{required: true, message: '请输入子文件名', trigger: ['change', 'blur']}],
                AssociatedForm: [
                    {
                        validator: (rule, value, callback) => {
                            if (this.info.UpdateFrequency != this.actualTimeId && value == '') {
                                callback(new Error('请选择系统自动生成'))
                            } else {
                                callback()
                            }
                        }
                    }
                ]
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
        async show(item, parentItem, isPreview) {
            this.dislogShow = true;
            this.isPreview = isPreview;
            if (item) {
                this.loading = true;
                this.id = item.Id;
                this.parentId = item.ParentId;
                let info = Object.assign(_extends(defaultInfo), item);
                info.FolderName = info.Name;
                info.UpdateFrequency = info.UpdateFrequency+'';
                info.AssociatedForm = info.AssociatedForm+'';
                this.info = info;
                this.info.FolderId = item.Id;
                try {
                   let res = await this.Get(`/GetTemplateFiles?folderId=${this.id}`)
                   if (res.status == 2000) {
                       this.info.TemplateFiles = res.data;
                       if (res.data.length) {
                           this.fileSort = res.data[res.data.length - 1].Sort;
                       }

                   } else {
                       this.$message.error('获取数据失败');
                       this.close();
                   }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            } else {
                if (parentItem) {
                    let list = parentItem.Childrens;
                    this.parentId = parentItem.Id;
                    // 新增时，给文件 Sort 赋最后一个文件的 Sort + 1
                    if (list[list.length - 1]) {
                        this.info.Sort = list[list.length - 1].Sort + 1;
                    }
                }
                this.info.UpdateFrequency = (this.UpdateFrequencyCom[0]||{}).id || '';
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
            this.parentId = '';
            this.fileSort = 1;
            this.info = _extends(defaultInfo);
        },
        uploadFile() {
            this.info.TemplateFiles.forEach(item => {
                this.$set(item, 'FileName', item.name);
                this.$set(item, 'FileUrl', item.url);
                this.$set(item, 'FileSize', item.size);
                this.$set(item, 'Classify', item.classify);
                this.$set(item, 'Ext', item.ext);
                this.$set(item, 'Sort', this.fileSort++);
            })
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
                        DirectoryId: this.parentId
                      }
                      let res = await this.Post('/SaveTemplateFolder', params)
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
        }
    },
    created() {
        this.Get('GetUpdateFrequencyCom').then(res => { //获取更新规则
            if (res.status == 2000) {
                this.UpdateFrequencyCom = res.data;
                res.data.forEach(item => {
                    if (item.text == '实时更新') {
                        this.actualTimeId = item.id;
                    }
                })
            }
        })
        this.Get('GetAssociatedFormCom').then(res => { // 关联表单
            if (res.status == 2000) {
                this.AssociatedFormCom = res.data
            }
        })
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
        .form-2-col{
            display: flex;
            >div{
                margin-bottom: 0;
                flex: 1;
                &:not(:first-child){
                    margin-left: 40px;
                }
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            &:first-child{
                margin-right: 0;
            }
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
                font-weight: 600;
            }
            .el-select,
            .el-input-number{
                width: 100%;
            }
        }
        .split-line{
            margin: 25px -25px;
            height: 10px;
            background: #F2F2F2;
        }
        .table-content{
            padding: 0 0 25px 0;
            .title{
                font-weight: 600;
            }
            .el-table{
                margin-top: 16px;
            }
        }
        /deep/ .el-scrollbar__wrap{
            margin-bottom: 0 !important;
        }
    }
</style>
