<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="600px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-form ref="form" label-position="top" :model="info" :rules="rules">
            <el-form-item label="父级">
                <el-cascader
                    v-model="info.ParentId"
                    filterable
                    clearable
                    :options="options"
                    :props="{ checkStrictly: true, value: 'ClassificationLibraryId', label: 'ClassificationName', children: 'Childs' }"
                    :disabled="isEdit"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="名称" prop="ClassificationName">
                <el-input placeholder="请输入" v-model="info.ClassificationName"></el-input>
            </el-form-item>
        </el-form>
    
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
    ClassificationName: '',
    ParentId: '',
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}

function setHasChildren(list) {
    list.forEach(item => {
        item.hasChildren = !!item.Childs.length;
        setHasChildren(item.Childs);
        if (!item.hasChildren) {
            item.Childs = null;
        }
    });
}
export default {
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
                ClassificationName: [{required: true, message: '请输入名称', trigger: ['change', 'blur']}],
            },
            options: []
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
            await this.getOptions(item);
            if (item) {
                this.loading = true;
                this.id = item.ClassificationLibraryId;
                try {
                    this.info = Object.assign(_extends(defaultInfo), item);
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        save() {
            this.$refs.form.validate(async (valid, fields) => {
                if (valid) {
                   this.submitLoading = true;
                   try {
                      let params = {
                        ...this.info
                      }
                      params.ParentId = this.id ? params.ParentId : (params.ParentId[params.ParentId.length - 1] || '');
                      let res = await this.Post('/SaveClassificationLibrary', params)
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
        },
        async getOptions() {
            let res = await this.Post('/GetClassificationLibraryList');
            if (res.status == 2000) {
                setHasChildren(res.data);
                this.options = res.data;
            }
            return Promise.resolve();
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .el-dialog{
            min-width: 600px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
        }
        .el-date-editor,
        .el-select,
        .el-cascader{
            width: 100%;
        }
        .form-2-col{
            display: flex;
            >div{
                width: 50%;
                &:first-child{
                    margin-right: 40px;
                }
            }
        }
        .split-line{
            &::before{
                content: '';
                display: block;
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
    }
</style>