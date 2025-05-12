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
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item label="工程名称" prop="ProjectName" ref="ProjectName">
                    <el-input placeholder="请输入" v-model="info.ProjectName"></el-input>
                </el-form-item>
                <div class="form-2-col">
                    <el-form-item label="编制人" prop="TechnicalUserId" ref="TechnicalUserId">
                        <el-input placeholder="请选择" v-model="info.TechnicalUserName" readonly>
                            <el-button slot="append" @click="choosePersonel">请选择</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="编制时间" prop="TechnicalDate" ref="TechnicalDate">
                        <el-date-picker
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="请选择"
                            clearable
                            v-model="info.TechnicalDate"
                        ></el-date-picker>
                    </el-form-item>
                </div>
                <div class="split-line"></div>
                <div class="f-b-c" style="margin-bottom: 10px;">
                    <div class="title">技术交底</div>
                    <div>
                        <el-button type="primary" @click="chooseDataBase">从数据库选择</el-button>
                        <el-button type="success" @click="saveDatabase">导入数据库</el-button>
                    </div>
                </div>
                <el-form-item label="技术交底名称" prop="TechnicalDatabaseName" ref="TechnicalDatabaseName">
                    <el-input
                        placeholder="请输入"
                        v-model="info.TechnicalDatabaseName"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="TechnicalDatabaseContent" ref="TechnicalDatabaseContent">
                    <div style="display: inline-flex;align-items: center;justify-content: space-between;width: 99%;" slot="label">
                        <el-tooltip class="item" effect="dark" content="附件和内容仅支持一种" placement="top-start">
                            <div>技术交底内容</div>
                        </el-tooltip>
                        <custom-upload
                            :show-file-list="false"
                            :single="true"
                            :titleCase="true"
                            :fileList.sync="info.TechnicalTemplate"
                            accept=".doc"
                        >
                            <el-button type="primary">上传本地文件</el-button>
                        </custom-upload>
                    </div>
                    <file-list v-model="info.TechnicalTemplate"></file-list>
                    <customEditor
                        style="margin-top: 10px;"
                        :disabled="editorDisabled"
                        :placeholder="editorDisabled ? `禁止编辑，编辑前先删除《${info.TechnicalTemplate[0].name}》文件` : '请输入'"
                        v-model="info.TechnicalDatabaseContent"
                    />
                </el-form-item>
                <div class="split-line"></div>
                <div class="title">落实人签字</div>
                <div style="padding-top: 10px" ref="signObj">
                    <el-table
                        :data="info.Users"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                            width="80"
                        ></el-table-column>
                        <el-table-column
                            label="签字项"
                            header-align="center"
                            min-width="300"
                        >
                            <template slot-scope="{ row }">
                                <el-input placeholder="请输入" v-model="row.Name"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="负责人"
                            header-align="center"
                            min-width="300"
                        >
                            <template slot-scope="{ row }">
                                <choose-user v-model="row.Users" :single="false" collapseTags/>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="排序"
                            header-align="center"
                            width="180"
                        >
                            <template slot-scope="{ row, $index }">
                                <div class="f-c">
                                    <div class="cursor-p" v-if="$index > 0" @click="move(row, $index, -1)">
                                        <i class="el-icon-top"></i>
                                        上移
                                    </div>
                                    <div class="cursor-p" v-if="$index != info.Users.length - 1" @click="move(row, $index, 1)">
                                        <i class="el-icon-bottom"></i>
                                        下移
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="80"
                        >
                            <template slot-scope="{ $index }">
                                <el-button type="text" @click="info.Users.splice($index, 1)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" plain @click="addUser">添加签字项</el-button>
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
import fileList from '@/components/common/file-list.vue';
import customEditor from '@/components/common/custom-editor.vue';
import util from '@/common/util';
import qs from 'qs';
const userInfo = qs.parse(localStorage.getItem('userinfo'));
const defaultInfo = {
    ProjectName: '',
    TechnicalUserName: userInfo.UserName,
    TechnicalUserId: userInfo.UserId,
    TechnicalDate: util.formatDate.format(new Date(), 'yyyy-MM-dd'),
    TechnicalDatabaseName: '',
    TechnicalDatabaseContent: '',
    TechnicalTemplate: [],
    Users: [], // {Name: '', Users: [], Sort: 1}
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    components: {
        fileList,
        customEditor
    },
    data() {
        const validatorContent = (rule, val, callback) => {
            if (!val && !this.info.TechnicalTemplate.length) {
                callback(new Error('请输入技术交底内容'))
            } else {
                callback();
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
                ProjectName: [{required: true, message: '请输入工程名称', trigger: ['change', 'blur']}],
                TechnicalDatabaseName: [{required: true, message: '请输入技术交底名称', trigger: ['change', 'blur']}],
                TechnicalUserId: [{required: true, message: '请选择编制人', trigger: ['change', 'blur']}],
                TechnicalDate: [{required: true, message: '请选择编制时间', trigger: ['change', 'blur']}],
                TechnicalDatabaseContent: [
                    {
                        validator: validatorContent,
                        trigger: ['change', 'blur']
                    }
                ],
            },
        }
    },
    watch: {
        'info.TechnicalTemplate'(val) {
            let flag = !!val.length;
            if (flag) {
                this.info.TechnicalDatabaseContent = '';
            }
            this.editorDisabled = flag;
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
                this.id = item.TechnicalId;
                try {
                   let res = await this.Get(`/GetTechnical?technicalId=${item.TechnicalId}`)
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
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo, {TechnicalDate: util.formatDate.format(new Date(), 'yyyy-MM-dd')});
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
                    if (!this.info.Users.length) {
                        this.$refs.scrollbar.wrap.scrollTop = this.$refs.signObj.offsetTop;
                        return this.$message.error('请添加落实人');
                    } else {
                        for (let i = 0; i < this.info.Users.length; i++) {
                            let item = this.info.Users[i];
                            if (!item.Name) {
                                this.$refs.scrollbar.wrap.scrollTop = this.$refs.signObj.offsetTop;
                                return this.$message.error(`第${i+1}项未设置签名项`);
                            }
                            if (!item.Users.length) {
                                this.$refs.scrollbar.wrap.scrollTop = this.$refs.signObj.offsetTop;
                                return this.$message.error(`第${i+1}项未设置负责人`);
                            }
                        }
                    }
                   this.submitLoading = true;
                   try {
                      let params = {
                        ...this.info
                      }
                      params.TechnicalTemplate = params.TechnicalTemplate[0];
                      let res = await this.Post('/SaveTechnical', params)
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
        choosePersonel() {
            this.$chooseUser({
                single: false,
            }).then(personnel => {
                this.info.TechnicalUserId = personnel.UserId;
                this.info.TechnicalUserName = personnel.UserName;
            })
        },
        chooseDataBase() {
            this.$chooseTechnicalDisclosure().then(res => {
                this.info.TechnicalTemplate = res.TechnicalDatabaseTemplate ? [res.TechnicalDatabaseTemplate] : [];
                this.info.TechnicalDatabaseContent = res.Content;
                this.info.TechnicalDatabaseName = res.Name;
            })
        },
        addUser() {
            let lastUser = this.info.Users[this.info.Users.length - 1] || {Sort: 0};
            this.info.Users.push({
                Name: '',
                Users: [],
                Sort: ++lastUser.Sort
            });
        },
        move(item, index, num) {
            let siblingItem = this.info.Users[index + num];
            item.Sort += num;
            siblingItem.Sort -=num;
            this.info.Users = this.info.Users.sort((a,b) => a.Sort - b.Sort);
        },
        async saveDatabase() {
            this.$refs.form.validateField(['TechnicalDatabaseName', 'TechnicalDatabaseContent'], errorMessage => {
                if (!errorMessage) {
                    this.$confirm('确认将当前编辑技术交底导入到数据吗？', '提示').then(async _ => {
                        let params = {
                            IsPrivate: 0,
                            Name: this.info.TechnicalDatabaseName,
                            Content: this.info.TechnicalDatabaseContent,
                            TechnicalDatabaseTemplate: this.info.TechnicalTemplate.length ? this.info.TechnicalTemplate[0] : null
                        }
                        let res = await this.Post('/SaveTechnicalDatabase', params);
                        if (res.status == 2000) {
                            this.$message.success('技术交底已保存到数据库');
                        } else {
                            this.$message.error(res.message);
                        }
                    }).catch(()=>{})
                }
            })
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
        .el-button.is-plain{
            width: 100%;
            border-style: dashed;
        }
        /deep/ label[for="TechnicalDatabaseContent"]{
            width: 100%;
        }
    }
</style>
