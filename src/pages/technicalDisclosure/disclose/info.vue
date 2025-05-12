<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="disclose-info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item
                    label="工程名称"
                >
                    <el-input placeholder="请输入" v-model="info.name"></el-input>
                </el-form-item>
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label="交底类型" prop="name">
                        <el-select v-model="info.type">
                            <el-option v-for="(item, index) in 3" :key="index" :label="index" :value="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="w50" label="交底名称" prop="routeType">
                        <el-input placeholder="请输入" v-model="info.name"></el-input>
                    </el-form-item>
                </div>
                <div class="f-b-c">
                    <el-form-item class="w50 mr20" label="交底人" prop="name">
                        <choose-user
                            v-model="info"
                            idKey="userId"
                            nameKey="userName"
                        ></choose-user>
                    </el-form-item>
                    <el-form-item class="w50" label="交底时间" prop="routeType">
                        <el-date-picker
                            type="date"
                            placeholder="请选择"
                            v-model="info.date"
                        ></el-date-picker>
                    </el-form-item>
                </div>
                <div class="divider"></div>
                <div>
                    <div class="item-title">工程概括</div>
                    <div>
                        <el-input
                            type="textarea"
                            v-model="info.overview"
                            :rows="5"
                        ></el-input>
                    </div>
                </div>
                <div class="divider"></div>
                <div>
                    <div class="item-title">施工准备</div>
                    
                    <el-collapse
                        
                    >
                        <el-collapse-item
                            v-for="(item, i) in 5"
                            :key="i"
                            :name="i"
                        >
                            <div slot="title" class="f-b-c f1">
                                <span>工作名称</span>
                                <div class="f--c operation">
                                    <!-- <div class="switch" :class="{open: collapseActive.includes(i)}">
                                        {{ collapseActive.includes(i) ? '收起' : '展开' }}
                                    </div> -->
                                    <div @click="del(i)" v-if="i > 0">删除</div> 
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                
                </div>
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
    name: '',
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'disclose-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
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
                this.id = item.id;
                try {
                   let res = await this.Get('')
                   if (res.status == 2000) {
                       this.info = Object.assign(_extends(defaultInfo), res.data);
                   } else {
                       this.$message.error('获取数据失败');
                       this.close();
                   }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            Object.assign(this.info, _extends(defaultInfo))
        },
        save() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                   this.submitLoading = true;
                   try {
                      let params = {
                          
                      }
                      let res = await this.Post('', params)
                      if (res.status == 2000) {
                          this.$message.success('保存成功')
                          this.$emit('load');
                      } else {
                          this.$message.error(res.message);
                          this.close();
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
    .disclose-info{
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
        .divider{
            margin: 18px -25px;
            height: 10px;
            background: #F2F2F2;
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
        .w50{
            width: 50%;
        }
        .mr20{
            margin-right: 20px;
        }
        /deep/ .el-collapse{
            margin-top: 28px;
            border: 0;
            .el-collapse-item{
                border: 1px solid #DCDFE6;
                border-radius: 6px;
                margin-bottom: 20px;
                overflow: hidden;
                &.is-active{
                    .el-collapse-item__header{
                        border-bottom: 1px solid #E7E8F2;
                    }
                }
                .el-input.is-disabled .el-input__inner,
                .el-textarea.is-disabled .el-textarea__inner{
                    color: #84888f;
                    background: #f7f8f9;
                }
                .el-collapse-item__header{
                    border: 1px solid transparent;
                    padding: 13px 20px 12px 15px;
                    background: #F6F6F6;
                    line-height: inherit;
                    height: 45px;
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
                    padding: 20px;
                }
            }
        }
        .item-title{
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            font-size: 16px;
            font-weight: 600;
            &::before{
                content: '';
                display: inline-block;
                margin-right: 10px;
                width: 5px;
                height: 18px;
                background: $primary-color;
            }
        }
        .el-date-editor{
            width: 100%;
        }
    }
</style>