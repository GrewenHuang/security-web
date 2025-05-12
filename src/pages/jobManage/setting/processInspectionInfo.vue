<template>
    <el-dialog
        v-dialog-drag
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        :fullscreen="fullscreen"
        element-loading-text="数据加载中"
    >
        <div class="f-b-c header" slot="title">
            <div class="title">{{ title }}</div>
            <div class="fullscreen" @click="fullscreen = !fullscreen">
                <i class="iconfont" :class="[fullscreen ? 'icon-quanpingsuoxiao' : 'icon-quanping']"></i>
            </div>
        </div>
        <el-form style="margin-top: 10px;" ref="form" label-position="top" :model="info" :rules="rules">
            <el-form-item label="监督表名称" prop="Name">
                <el-input placeholder="请输入" v-model="info.Name" ></el-input>
            </el-form-item>
            <el-table
                :data="info.Contents"
                :header-cell-style="$tableStyle"
                style="width: 100%"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="50"
                >
                </el-table-column>
                <el-table-column
                    label="监督内容"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        <el-input v-model="row.Content" placeholder="请输入"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="150"
                >
                    <template slot-scope="{ row , $index}">
                        <div class="table-operation">
                            <el-button type="text" text-plain @click="info.Contents.splice($index, 1)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
                <div slot="append" style="padding: 10px 0;">
                    <el-button type="primary" plain @click="add()">新增</el-button>
                </div>
            </el-table>
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
                >确定</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
    Name: '',
    Contents: [],
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    props: {
        jobTemplateId: [String, Number]
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            fullscreen: false,
            rules: {
                Name: [{required: true, message: '请输入监督表名称', trigger: ['change', 'blur']}],
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
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.JobProcessCheckId;
                this.info = _extends(item);
                this.info.Contents = this.info.Contents.map(item => {
                    return {
                        Content: item
                    }
                })
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
                        ...this.info,
                        jobTemplateId: this.jobTemplateId
                      }
                      params.Contents = params.Contents.map(item => item.Content).filter(item => !!item);
                      let res = await this.Post('/SaveJobProcessCheck', params)
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
        add() {
            this.info.Contents.push({
                Content: ''
            })
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
            min-width: 1000px;
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
        .el-select{
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
        .header{
            padding-right: 20px;
            .title{
                font-size: 24px;
                font-weight: bold;
            }
        }
        .fullscreen{
            margin-top: 2px;
            margin-bottom: auto;
            cursor: pointer;
            .iconfont{
                font-size: 14px;
                color: #909399;
                &:hover{
                    color: $__color-primary;
                }
            }
        }
        .el-button.is-plain{
            border-style: dashed;
            width: 100%;
        }
    }
</style>
