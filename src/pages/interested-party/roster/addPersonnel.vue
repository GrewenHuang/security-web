<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
        append-to-body
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="form-2-col">
                    <el-form-item label="姓名" prop="Name" ref="Name">
                        <el-input placeholder="请输入" v-model="info.Name" ></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="Gender" ref="Gender">
                        <el-select placeholder="请选择" v-model="info.Gender" >
                            <el-option v-for="(item, index) in GenderList" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="身份证号码" prop="IDCard" ref="IDCard">
                        <el-input placeholder="请输入" v-model="info.IDCard" ></el-input>
                    </el-form-item>
                    <el-form-item label="用工类型" prop="EmploymentType" ref="EmploymentType">
                        <el-input placeholder="请输入" v-model="info.EmploymentType" ></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="工种" prop="WorkType" ref="WorkType">
                        <el-input placeholder="请输入" v-model="info.WorkType" ></el-input>
                    </el-form-item>
                    <div></div>
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
    Name: '', // 姓名 ,
    Gender: '', // 性别 = ['1', '2', '3'],
    IDCard: '', // 身份证 ,
    EmploymentType: '', // 用工类型 ,
    WorkType: '', // 工种 ,
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
                Name: [{required: true, message: '请输入姓名', trigger: ['change', 'blur']}],
                Gender: [{required: true, message: '请选择性别', trigger: ['change', 'blur']}],
                IDCard: [{required: true, message: '请输入身份证', trigger: ['change', 'blur']}],
                EmploymentType: [{required: true, message: '请输入用工类型', trigger: ['change', 'blur']}],
                WorkType: [{required: true, message: '请输入工种', trigger: ['change', 'blur']}],
            },
            GenderList: []
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
        async show(item, id) {
            this.dislogShow = true;
            await this.getGenderCom();
            this.id = id;
            if (item) {
                this.loading = true;
                try {
                    this.info = _extends(item);
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
                        ...this.info,
                        RelatedPartyId: this.id
                      }
                      let res = await this.Post('/SaveRelatedPartyUser', params)
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
        async getGenderCom() {
            let res = await this.Get('GetGenderCom');
            if (res.status === 2000) {
                this.GenderList = res.data.map(item => {
                    item.id = +item.id;
                    return item;
                });
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
