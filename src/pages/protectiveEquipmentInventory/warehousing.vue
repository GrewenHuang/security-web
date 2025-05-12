<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="900px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="form" :rules="rules">
                <div class="form-2-col form-item">
                    <div class="f">
                        <div class="label">品名：</div>
                        <div>{{ info.Name }}</div>
                    </div>
                    <div class="f">
                        <div class="label">规格型号：</div>
                        <div>{{ info.Spec }}</div>
                    </div>
                </div>
                <div class="form-2-col form-item">
                    <div class="f">
                        <div class="label">数量：</div>
                        <div>{{ info.Quantity || 0}}</div>
                    </div>
                    <div class="f">
                        <div class="label">单位：</div>
                        <div>{{ info.Unit }}</div>
                    </div>
                </div>
                <div class="form-2-col" style="margin-top: 15px;">
                    <el-form-item label="入库数量" prop="Quantity">
                        <el-input placeholder="正数为入库，负数为出库" v-model="form.Quantity"></el-input>
                    </el-form-item>
                    <el-form-item label="入库人">
                        <el-input placeholder="请选择" v-model="form.OpUserName" readonly>
                            <el-button slot="append" @click="chooseUser">请选择</el-button>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.Remark"></el-input>
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
import RULECONFIG from "@/common/ruleConfig";
import Qs from 'qs';
const defaultInfo = {
    Quantity: '',
    OpUserName: '',
    OpUserId: '',
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
            info: {},
            form: _extends(defaultInfo),
            pages: {
                page: 1,
                rows: 10,
                total: 0
            },
            rules: {
                Quantity: [{
                    required: true,
                    message: '请输入入库数量',
                    trigger: ['change', 'blur'],
                    validator: (rule, value, callback) => {
                        if (!/^(\-?)\d+$/.test(value)) {
                            callback(new Error('请输入正确的数量'))
                        }
                        if (value == 0) {
                            callback(new Error(rule.message))
                        }
                        callback();
                    }
                }]
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '入库'
        }
    },
    methods: {
        async show(item) {
            let userInfo = Qs.parse(localStorage.getItem('userinfo'));
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.ProtectiveAppliancesId;
                try {
                    this.info = _extends(item);
                    this.form = Object.assign(_extends(defaultInfo), {
                        OpUserName: userInfo.UserName,
                        OpUserId: userInfo.UserId
                    });
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
            this.form = _extends(defaultInfo);
            this.info = {};
        },
        chooseUser() {
            this.$chooseUser({
                single: false,
            }).then(personnel => {
                this.form.OpUserId = personnel.UserId;
                this.form.OpUserName = personnel.UserName;
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
                        ...this.form,
                        ProtectiveAppliancesId: this.id
                      }
                      let res = await this.Post('/SaveProtectiveAppliancesStorage', params)
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
            min-width: 900px;
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
        .form-item{
            border-bottom: 1px solid #efefef;
            padding: 15px 0;
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