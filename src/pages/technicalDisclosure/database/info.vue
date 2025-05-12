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
        <el-form
            ref="form"
            :model="info"
            :rules="rules"
            element-loading-text="拼命加载中"
        >
            <el-form-item label="技术交底名称" prop="Name">
                <el-input
                    placeholder="请输入"
                    v-model="info.Name"
                ></el-input>
            </el-form-item>
            <div class="split-line"></div>
            <div class="f-b-c">
                <div class="title">
                    <el-tooltip class="item" effect="dark" content="附件和内容仅支持一种" placement="top-start">
                        <div>技术交底内容</div>
                    </el-tooltip>
                </div>
                <custom-upload
                    :show-file-list="false"
                    :single="true"
                    :titleCase="true"
                    :fileList.sync="info.TechnicalDatabaseTemplate"
                    accept=".doc"
                >
                    <el-button type="primary">上传本地文件</el-button>
                </custom-upload>
            </div>
            <file-list v-model="info.TechnicalDatabaseTemplate"></file-list>
            <el-form-item prop="Content">
                    <customEditor
                        style="margin-top: 10px;"
                        :disabled="editorDisabled"
                        :placeholder="editorDisabled ? `禁止编辑，编辑前先删除《${info.TechnicalDatabaseTemplate[0].Name}》文件` : '请输入'"
                        v-model="info.Content"
                    />
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">取消</el-button>
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
import customEditor from '@/components/common/custom-editor.vue';
import fileList from '@/components/common/file-list.vue';
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
const defaultInfo = {
    Name: '',
    Content: '',
    TechnicalDatabaseTemplate: []
};
export default {
    components: {
        customEditor,
        fileList
    },
    props: {
        IsPrivate: {
            type: [String, Number],
            default: 0
        }
    },
    mixins: [request_mixin],
    data() {
        const validatorContent = (rule, value, callback) => {
            if (!value && !this.info.TechnicalDatabaseTemplate.length) {
                callback(new Error('请输入技术交底内容'));
            } else {
                callback()
            }
        }
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            editorDisabled: false,
            info: _extends(defaultInfo),
            rules: {
                Name: [
                    {
                        required: true,
                        message: '请输入技术交底名称',
                        trigger: ['change', 'blur'],
                    },
                ],
                Content: [
                    {
                        validator: validatorContent,
                        trigger: ['change', 'blur']
                    }
                ],
            }
        };
    },
    computed: {
        isEdit() {
            return !!this.id;
        },
        title() {
            return this.isEdit ? '编辑' : '新增';
        },
    },
    watch: {
        'info.TechnicalDatabaseTemplate'(val) {
            let flag = !!val.length;
            if (flag) {
                this.info.Content = '';
            }
            this.editorDisabled = flag;
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.id = item.TechnicalDatabaseId;
                this.loading = true;
                try {
                    let res = await this.Get(`/GetTechnicalDatabase?technicalDatabaseId=${this.id}`);
                    res.data.TechnicalDatabaseTemplate = res.data.TechnicalDatabaseTemplate ? [res.data.TechnicalDatabaseTemplate] : [];
                    this.info = _extends(Object.assign(_extends(defaultInfo), res.data));
                } catch (error) {
                    console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                // this.$refs.scrollbar.wrap.scrollTop = 0;
                this.$refs.form.clearValidate();
            });
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.loading = false;
            this.info = _extends(defaultInfo);
            this.id = '';
            this.$forceUpdate();
        },
        save() {
            this.$refs.form.validate(async (valid, fields) => {
                if (valid) {
                    this.submitLoading = true;
                    try {
                        let params = {
                            IsPrivate: this.IsPrivate,
                            ..._extends(this.info),
                        };
                        params.TechnicalDatabaseTemplate = params.TechnicalDatabaseTemplate[0];
                        let res = await this.Post('/SaveTechnicalDatabase', params);
                        if (res.status == 2000) {
                            this.$message.success('保存成功');
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
            });
        },
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.info {
    /deep/ .el-dialog__body {
        padding: 0 !important;
        .el-scrollbar__wrap{
            height: 43vh;
            margin-bottom: 0 !important;
        }
    }
    /deep/ .el-dialog {
        min-width: 1000px;
    }
    /deep/ .el-form {
        padding: 25px 25px 20px;
        height: 65vh;
        .el-select {
            width: 100%;
        }
    }
    .split-line {
        margin: 30px -25px 10px;
        height: 10px;
        background: #f2f2f2;
    }
    /deep/ .el-form-item {
        margin-bottom: 25px;
        &:first-child {
            margin-right: 20px;
        }
        .el-form-item__label {
            padding-bottom: 9px;
            line-height: 20px;
        }
        .el-select {
            width: 100%;
        }
    }
    .title{
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        &::before{
            content: '';
            margin-right: 7px;
            width: 5px;
            height: 18px;
            background: $--color-primary;
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
    .quill-editor{
        margin-top: 10px;
        height: 200px;
    }
}
</style>


