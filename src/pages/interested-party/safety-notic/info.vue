<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="800px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item class="w50 mr20" label="相关方" prop="RelatedPartyId" ref="RelatedPartyId">
                    <el-select v-model="info.RelatedPartyId" @change="changeSelect" :disabled="!!id">
                        <el-option v-for="(item, index) in list" :key="index" :label="item.Name" :value="item.RelatedPartyId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="技术交底文件" prop="RelatedPartyInformFiles1" ref="RelatedPartyInformFiles1">
                    <custom-upload :file-list.sync="info.RelatedPartyInformFiles1">
                        <el-button>点击上传</el-button>
                    </custom-upload>
                </el-form-item>
                <el-form-item label="安全协议" prop="RelatedPartyInformFiles2" ref="RelatedPartyInformFiles2">
                    <custom-upload :file-list.sync="info.RelatedPartyInformFiles2">
                        <el-button>点击上传</el-button>
                    </custom-upload>
                </el-form-item>
                <el-form-item label="安全告知书" prop="RelatedPartyInformFiles3" ref="RelatedPartyInformFiles3">
                    <custom-upload :file-list.sync="info.RelatedPartyInformFiles3">
                        <el-button>点击上传</el-button>
                    </custom-upload>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="info.Remark"></el-input>
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
const defaultInfo = {
    RelatedPartyId: '', // (integer, optional): 相关方ID ,
    Remark: '', // (string, optional): 备注 ,
    RelatedPartyName: '', // (string, optional): 相关方名称 ,
    RelatedPartyInformFiles1: [], // (Array[attachment], optional): 技术交底文件 ,
    RelatedPartyInformFiles2: [], // (Array[attachment], optional): 安全协议 ,
    RelatedPartyInformFiles3: [], // (Array[attachment], optional): 安全告知书
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
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
                RelatedPartyId: [{required: true, message: '请选择相关方', trigger: ['change', 'blur']}],
                RelatedPartyInformFiles1: [{type: 'array', required: true, message: '请选择技术交底文件', trigger: ['change', 'blur']}],
                RelatedPartyInformFiles2: [{type: 'array', required: true, message: '请选择安全协议', trigger: ['change', 'blur']}],
                RelatedPartyInformFiles3: [{type: 'array', required: true, message: '请选择安全告知书', trigger: ['change', 'blur']}],
            },
            list: [],
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
            await this.getRelatedPartys();
            if (item) {
                this.loading = true;
                this.id = item.RelatedPartyId;
                try {
                   let flag = await this.getDetail(this.id);
                   if (!flag) {
                       this.close();
                   }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
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
            this.info = _extends(defaultInfo);
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
                        ...this.info
                      }
                      let res = await this.Post('/SaveRelatedPartyInform', params)
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
        async getRelatedPartys() {
            let res = await this.Post('/GetRelatedPartys', {page: 1, rows: 999999});
            if (res.status == 2000) {
                this.list = res.data.list;
            }
            return Promise.resolve();
        },
        async getDetail(id) {
            let res = await this.Get(`/GetRelatedPartyInform?RelatedPartyId=${id}`)
            if (res.status == 2000) {
                if (res.data) {
                    this.info = Object.assign(_extends(defaultInfo), res.data);
                }
            } else {
                this.$message.error('获取数据失败');
                return Promise.resolve(false)
            }
            return Promise.resolve(true);
        },
        changeSelect() {
            this.getDetail(this.info.RelatedPartyId);
        },
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
    }
</style>
