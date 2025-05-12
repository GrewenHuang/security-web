<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1100px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="form-2-col">
                    <el-form-item label="危大工程名称" prop="Name" ref="Name">
                        <el-input placeholder="请输入" v-model="info.Name" :disabled="info.IsRelease == 1"></el-input>
                    </el-form-item>
                    <el-form-item label="类别" prop="DangerousEngineeringCategory" ref="DangerousEngineeringCategory">
                        <el-select placeholder="请选择" v-model="info.DangerousEngineeringCategory" :disabled="info.IsRelease == 1">
                            <el-option v-for="(item, index) in categorys" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="工程类型" prop="DangerousEngineeringType">
                        <el-select placeholder="请选择" v-model="info.DangerousEngineeringType" :disabled="info.IsRelease == 1">
                            <el-option v-for="(item, index) in types" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工程范围" prop="Range">
                        <el-input placeholder="请输入" v-model="info.Range" :disabled="info.IsRelease == 1"></el-input>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="计划开工" prop="PlanStartDate" ref="PlanStartDate">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请输入" v-model="info.PlanStartDate" :disabled="info.IsRelease == 1"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="计划完工" prop="PlanEndDate" ref="PlanEndDate">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请输入" v-model="info.PlanEndDate" :disabled="info.IsRelease == 1"></el-date-picker>
                    </el-form-item>
                </div>
                <el-form-item label="状态">
                    <el-switch v-model="info.Status"
                        :active-value="1"
                        :inactive-value="0"
                        :disabled="info.IsRelease == 1"
                        :active-text=" info.Status == 1 ? '已开工' : '未开工'"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" placeholder="请输入" v-model="info.Remark" :disabled="info.IsRelease == 1"></el-input>
                </el-form-item>
                <div class="split-line"></div>
                <div class="title">附件上传</div>
                <div>
                    <template v-for="(item, index) in fileFieldList">
                        <div class="annex-list" :key="index" v-if="info.IsRelease == 0 || (!!item.files.length || (item.databaseFiles && !!item.databaseFiles.length))">
                            <el-form-item :label="item.label">
                                <div class="f-b-c" v-if="info.IsRelease == 0">
                                    <customUploadDrag 
                                        class="w50"
                                        :Data.sync="item.files"
                                        :showFileList="false"
                                        :acceptList="['png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'pdf']"
                                    >
                                        <div class="f-c-c">
                                            <i class="el-icon-upload" style="margin-right: 5px !important;color:#959595 !important;"></i>
                                            <div class="el-upload__text">
                                                将文件拖到此处或<em>点击上传</em>
                                            </div>
                                        </div>
                                    </customUploadDrag>
                                    <div class="f--c w50" style="color: #959595;margin-left: 15px;">
                                        <span>支持JPG、PNG、WORD、PDF等文件</span>
                                    </div>
                                </div>
                                <file-list style="margin-top: 10px;" v-model="item.files" :disabled="info.IsRelease == 1" @change="fileRemove(item)"/>
                                <template  v-if="item.selectBasedata">
                                    <div class="select-data-base f-c-c" @click="chooseDatabase(item)"
                                        v-if="info.IsRelease == 0"
                                    >
                                        <i class="data-base-icon" style="margin-right: 5px;"></i>
                                        <div class="el-upload__text">
                                            数据库中<em>选择</em>
                                        </div>
                                    </div>
                                    <file-list style="margin-top: 10px;" v-model="item.databaseFiles" :disabled="info.IsRelease == 1" @change="fileRemove(item)"/>
                                </template>
                            </el-form-item>
                        </div>
                    </template>
                </div>
                <div class="split-line"></div>
                <el-form-item label="审批流程（依次审批）" prop="Approves" ref="Approves" v-if="info.IsRelease == 0">
                    <div class="approval-process f--c">
                        <div class="user-content" v-for="(item, index) in info.Approves" :key="index">
                            <div class="user f-b-c">
                                <div class="f-c-c">
                                    <div class="avatar">{{ item.UserName.substr(0, 1) }}</div>
                                    <div>{{ item.UserName }}</div>
                                </div>
                                <div class="delete-btn" @click="info.Approves.splice(index, 1)"></div>
                            </div>
                        </div>
                        <div class="add-btn" @click="addUser"></div>
                    </div>
                </el-form-item>
                <el-form-item label="审批状态" v-else>
                    <div class="approval-status">
                        <div class="item" v-for="(item, index) in info.Approves" :key="index">
                            <div class="user-content" :class="{done: item.IsApprove == 1, waiting: item.IsApprove == 0 && (!info.Approves[index-1] || info.Approves[index-1].IsApprove == 1)}">
                                <div class="avatar">
                                    {{ item.UserName.substr(0, 1) }}
                                    <div class="status-icon"><i></i></div>
                                </div>
                                <div>
                                    <div class="name f--c">
                                        <div>{{ item.UserName }}</div>
                                        <div class="date" v-if="item.ApproveDate">{{ item.ApproveDate | format('yyyy-MM-dd HH:mm') }}</div>
                                    </div>
                                    <div class="status">{{ item.IsApprove == 1 ? '审批完成' : (!info.Approves[index-1] || info.Approves[index-1].IsApprove == 1) ? '审批中' : '待审批' }}</div>
                                </div>
                            </div>
                            <div class="approval-content" v-if="item.SignInUrl">
                                <div>{{ item.Remark }}</div>
                                <div class="sign-image">
                                    <el-image :src="item.SignInUrl" style="border-radius:4px;width: auto;height: 90px;"></el-image>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >{{info.IsRelease == 0 ? '取消' : '关闭'}}</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                v-if="info.IsRelease == 0"
                >提交</el-button
            >
        </div>
        <technicalDisclosure  ref="technicalDisclosure"/>
        <specialConstruction ref="specialConstruction"/>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import fileList from '../../components/common/file-list.vue';
import technicalDisclosure from './technicalDisclosure'; // 技术交底
import specialConstruction from './specialConstruction'; // 技术交底
const defaultInfo = {
    Name: '', 
    DangerousEngineeringCategory: 1,
    DangerousEngineeringType: 1,
    Range: '',
    PlanStartDate: '',
    PlanEndDate: '',
    Status: 0, // 
    Remark: '',
    SpecialItemIds: '', // 专项施工方案数据库选择的id
    TechnicalIds: '', // 技术交底数据库选择的id
    SpecialItemTemplates: [],
    TechnicalTemplates: [],
    Approves: [], // 审批流程
    IsRelease: 0, // 是否发布
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    components: {
        fileList,
        technicalDisclosure,
        specialConstruction
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            fileFieldList: [
                {
                    label: '专项施工方案',
                    files: [],
                    databaseFiles: [],
                    key: 'File1',
                    fileKey: 'SpecialItemTemplates',
                    apiIdKey: 'SpecialItemIds',
                    templateKey: 'SpecialItemTemplate',
                    idKey: 'SpecialItemId',
                    selectBasedata: true,
                    ref: 'specialConstruction'
                },
                {
                    label: '专家论证文件',
                    files: [],
                    key: 'File2',
                },
                {
                    label: '技术交底',
                    files: [],
                    databaseFiles: [],
                    key: 'File3',
                    fileKey: 'TechnicalTemplates',
                    apiIdKey: 'TechnicalIds',
                    templateKey: 'TechnicalTemplate',
                    idKey: 'TechnicalId',
                    selectBasedata: true,
                    ref: 'technicalDisclosure'
                },
                {
                    label: '验收文件',
                    files: [],
                    key: 'File4',
                },
                {
                    label: '其它附件',
                    files: [],
                    key: 'File5',
                },
            ],
            categorys: [{id: 1, text: '一般危大工程'}, {id: 2, text: '重大伟大工程'}],
            types: [{id: 1, text: '分部工程'}, {id: 2, text: '分项工程'}],
            rules: {
                Name: [{required: true, message: '请输入危大工程名称', trigger: ['change', 'blur']}],
                DangerousEngineeringCategory: [{required: true, message: '请选择类别', trigger: ['change', 'blur']}],
                PlanStartDate: [{required: true, message: '请选择计划开工日期', trigger: ['change', 'blur']}],
                PlanEndDate: [{required: true, message: '请选择计划完工日期', trigger: ['change', 'blur']}],
                Approves: [{type: 'array', required: true, message: '请选择审批流程', trigger: ['change', 'blur']}],
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return !this.isEdit ? '新增' : this.info.IsRelease == 1? '查看' : '编辑' 
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.DangerousEngineeringId;
                try {
                   let res = await this.Get(`/GetDangerousEngineering?dangerousEngineeringId=${this.id}`)
                   if (res.status == 2000) {
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                        
                        this.fileFieldList.forEach(item => {
                            item.files = this.info[item.key];
                            if (item.selectBasedata) {
                                item.databaseFiles = this.info[item.fileKey] || [];
                                item.databaseFiles.forEach(item => {
                                    item.id = item.RelationId;
                                })
                            }
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
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
            this.fileFieldList.forEach(item => {
                item.files = [];
                if (item.selectBasedata) {
                    item.databaseFiles = [];
                }
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
                        ...this.info
                        }
                        this.fileFieldList.forEach(item => {
                            params[item.key] = item.files;
                            if (item.selectBasedata) {
                                params[item.fileKey] = item.databaseFiles;
                                params[item.apiIdKey] = item.databaseFiles.map(cItem => cItem.id).join(',');
                            }
                        });
                        let res = await this.Post('/SaveDangerousEngineering', params)
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
        addUser() {
            this.$chooseUser({
                single: false
            }).then(res => {
                this.info.Approves.push(res);
            });
        },
        fileRemove(item) {
        },
        chooseDatabase(item) {
            let ref = this.$refs[item.ref];
            if (ref) {
                ref.show({
                    single: false,
                }, (flag, res) => {
                    if (flag) {
                        item.databaseFiles = res.map(cItem => {
                            return {
                                ...cItem[item.templateKey],
                                id: cItem[item.idKey]
                            }
                        });
                    }
                })
            }
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
            min-width: 1100px;
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
            margin-bottom: 30px;
            font-size: 16px;
            font-weight: 600;
            &::before{
                content: '';
                margin-right: 8px;
                width: 5px;
                height: 18px;
                background: $--color-primary;
            }
        }
        .ml20{
            margin-left: 20px;
        }
        .w50{
            width: 50%;
        }
        .approval-process{
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
            .user-content{
                position: relative;
                margin-bottom: 15px;
                padding-right: 55px;
                &::before{
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 20px;
                    transform: translateY(-50%);
                    width: 15px;
                    height: 2px;
                    background: #959595;
                }
                &::after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 20px;
                    transform: translateY(-50%) rotate(45deg);
                    border-top: 1px solid #959595;
                    border-right: 2px solid #959595;
                    width: 10px;
                    height: 10px;
                }
                .user{
                    border-radius: 4px;
                    padding: 8px 10px 7px;
                    background: #F8F8F8;
                    width: 155px;
                    .avatar{
                        border-radius: 30px;
                        margin-right: 10px;
                        width: 30px;
                        height: 30px;
                        background: $--color-primary;
                        text-align: center;
                        line-height: 30px;
                        color: #fff;
                        font-weight: 600;
                    }
                }
                .delete-btn{
                    position: relative;
                    border-radius: 18px;
                    border: 1px solid #959595;
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    &::before,
                    &::after{
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        width: 8px;
                        height: 1px;
                        background: #858585;
                    }
                    &::after{
                        transform: translate(-50%, -50%) rotate(45deg);
                    }
                }
            }
            .add-btn{
                position: relative;
                border-radius: 4px;
                margin-bottom: 15px;
                width: 45px;
                height: 45px;
                background: #EEF3FF;
                cursor: pointer;
                &::before,
                &::after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 18px;
                    height: 2px;
                    background: $--color-primary;
                }
                &::after{
                    transform: translate(-50%, -50%) rotate(90deg);
                }
            }
        }
        .approval-status{
            padding-left: 22px;
            line-height: 20px;
            color: #1C1D2F;
            .item{
                position: relative;
                padding-left: 28px;
                padding-bottom: 37px;
                &:not(:last-child)::before{
                    content: '';
                    position: absolute;
                    top: 20px;
                    bottom: 0;
                    left: 0;
                    border: 1px solid #E1E1E1;
                }
                .user-content{
                    position: relative;
                    &.done{
                        .status{
                            color: #09B66D;
                        }
                        .avatar .status-icon{
                            background: #09B66D;
                            i,
                            &::after{
                                display: none;
                            }
                            &::before{
                                content: '';
                                border-left: 1px solid #fff;
                                border-bottom: 1px solid #fff;
                                transform: rotate(-45deg);
                                width: 7px;
                                height: 3px;
                                background: transparent;
                            }
                        }
                    }
                    &.waiting{
                        .avatar .status-icon{
                            background: $--color-primary;
                        }
                        .status{
                            color: $--color-primary;
                        }
                    }
                    .avatar{
                        position: absolute;
                        top: 0;
                        left: -48px;
                        border-radius: 40px;
                        width: 40px;
                        height: 40px;
                        background: $--color-primary;
                        font-size: 22px;
                        line-height: 40px;
                        text-align: center;
                        color: #fff;
                        font-weight: 600;
                        .status-icon{
                            position: absolute;
                            right: -5px;
                            bottom: -5px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border: 2px solid #fff;
                            border-radius: 100%;
                            width: 20px;
                            height: 20px;
                            background: #959595;
                            i,
                            &::before,
                            &::after{
                                content: '';
                                margin-right: 1px;
                                width: 2px;
                                height: 2px;
                                background: #fff;
                            }
                            &::after{
                                margin-right: 0;
                            }
                        }
                    }
                    .name{
                        .date{
                            margin-left: 34px;
                            color: #959595;
                        }
                    }
                    .status{
                        margin-top: 3px;
                        color: #959595;
                    }
                }
                .approval-content{
                    border-radius: 4px;
                    margin-top: 11px;
                    padding: 13px 15px 12px;
                    background: #F8F8F8;
                    line-height: 25px;
                    .sign-image{
                        border-radius: 4px;
                        margin-top: 7px;
                        .el-image{
                            background: #fff;
                        }
                    }
                }
            }
        }
        .annex-list{
            &:not(:last-child) {
                border-bottom: 1px solid #F2F2F2;
                margin-bottom: 10px;
                padding-bottom: 10px;
            }
            .el-form-item{
                margin-bottom: 0
            }
        }
    }
    .select-data-base{
        background-color: #f8fafb !important;
        border: 1px dashed #ecedef !important;
        border-radius: 6px;
        box-sizing: border-box;
        margin-top: 10px;
        width: calc(50% - 5px);
        height: 75px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        em{
            color: #005DFF;
            font-style: normal;
        }
    }
    .data-base-icon{
        width: 24px;
        height: 17px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAjCAMAAADlnnmAAAAAAXNSR0IArs4c6QAAAFdQTFRFAAAAj4+Pl5eXlZWVlpaWk5OTlJSUlpaWlJSUlZWVlZWVlJSUlZWVlZWVlJSUlZWVlZWVlJSUlZWVlZWVlJSUlZWVlZWVlJSUlZWVlJSUlJSUlZWVlZWVodr6xgAAABx0Uk5TABAgMD9AT1BfYG9wf4CPkJ+gr7C/wM/Q3+Dv8EKrufQAAAGUSURBVBgZjcELYqIwAEXRm6QpRoKIJsjn7X+dQ7DVOkrrOdzYz3hIadJVSsf46dhi9ye9lKLj2a7XL4a94YHr9Yeh4gc36W+Bu15vmLgb9Q7DTaM3tPzQ6k8dD9xZv8qe/9k6a8OltTwaAoXxTZf14HJuKsMTKXlurP/i2KJFv7e8TVfDcf9heWA+9seaJ/ppSCmdYjyllAYtAsVnPKXD3nKlXwTAxElXJ0sxa1MHuF53gcVZW2YDdlJx7mYVATAXbaiBXkUNdlbhWdSzXpmBRisWWUWiMOGiZ2dg0soCWauKg2NhqjbPelCD15UFglYdmiJfjPfNTWWg0SpDhE5FRtJwsLzUaFURFDAXFWg1HHaOJ62KEZLkMGGWhO76FGPcfSx2MUYLjYqAk8YaaKQL2hKgkjQGgw+WopI6tKUFJDmuLJCkwEUbBqCRWLj9cdBwGKQR3KwNHswsD2bStwqwWa/1gNN0iIO+taz8WS/VgJ911/LNVN2oZw6wnb6MFY98aNq8mDXmnM9N7Q2Fq3Mec1ex+gfvp2+UvyG/WwAAAABJRU5ErkJggg==) no-repeat center center;
        background-size: 100%;
    }
</style>
