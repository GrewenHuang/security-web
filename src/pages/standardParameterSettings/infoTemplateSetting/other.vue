<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input clearable placeholder="名称" v-model="filters.CertificateName"></el-input>
                <el-select clearable placeholder="类型" v-model="filters.CertificateType">
                    <el-option v-for="(item, index) in certTypes" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" @click="add()" v-if="$_has('ZZMBSZQTTab')">新增</el-button>
            </div>
        </div>
        <div class="cert-list">
            <div class="cert-item" v-for="(item, index) in list" :key="index" :class="`cert-item-color-${item.CertificateType}`" @click="add(item)">
                <div class="cert-name">
                    {{ item.CertificateName }}
                </div>
            </div>
        </div>
        <no-data top="105" v-if="!list.length"/>
        <div class="info" slot="independentLayer" v-if="infoFlag">
            <div class="f info-main">
                <div class="left">
                    <el-scrollbar ref="scrollbar1" class="el-scrollbar">
                        <div class="cover-image " :class="`cert-image-${formData.CertificateType}`">
                            <div class="title">{{ formData.CertificateName || '请在右侧输入名称'}}</div>
                        </div>
                        <div class="form">
                            <div class="form-item" v-for="(item, index) in formData.CertificateFileds" :key="index">
                                <div class="label">
                                    <el-tooltip :content="item.FiledName">
                                        <span>{{ item.FiledName }}</span>
                                    </el-tooltip>
                                </div>
                                <div class="form-content">
                                    <el-input placeholder="请输入" v-if="item.TextType == 2"></el-input>
                                    <el-date-picker placeholder="请选择日期" v-if="item.TextType == 3"></el-date-picker>
                                    <custom-date-range  v-if="item.TextType == 4"/>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="right">
                    <el-scrollbar ref="scrollbar" class="el-scrollbar">
                        <el-form ref="formData" :model="formData" :rules="rules">
                            <div class="f-b-c">
                                <el-form-item class="f1 gutter" label="类型" ref="CertificateType" prop="CertificateType">
                                    <el-select :placeholder="typePlaceholder" :value="formData.CertificateType" disabled v-if="formData.IsDefault">
                                        <el-option v-for="(item, index) in certTypes" :key="index" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                    <el-select :placeholder="typePlaceholder" v-model="formData.CertificateType" v-else>
                                        <el-option v-for="(item, index) in certTypes" :key="index" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="f1" label="名称" ref="CertificateName" prop="CertificateName">
                                    <el-input :value="formData.CertificateName" disabled v-if="formData.IsDefault"></el-input>
                                    <el-input v-model="formData.CertificateName" v-else></el-input>
                                </el-form-item>
                            </div>
                            <el-table
                                :data="formData.CertificateFileds"
                                :header-cell-style="$tableStyle"
                                style="width: 100%"
                            >
                                <el-table-column
                                    label="字段名称"
                                >
                                    <template slot-scope="{ row }">
                                        <el-input placeholder="请输入" v-model="row.FiledName"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="文本类型"
                                    width="160"
                                >
                                    <template slot-scope="{ row }">
                                        <el-select :value="row.TextType" disabled v-if="row.IsDefault == 1">
                                            <el-option label="文本" :value="2"></el-option>
                                            <el-option label="日期" :value="4"></el-option>
                                        </el-select>
                                        <el-select placeholder="请选择" v-model="row.TextType" v-else>
                                            <el-option v-for="(item, index) in fieldTypes" :key="index"
                                                :label="item.name"
                                                :value="item.id"
                                            ></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="是否到期提醒"
                                    align="center"
                                    width="120"
                                >
                                    <template slot-scope="{ row }">
                                        <el-switch
                                            :value="row.IsReminder"
                                            active-text="否"
                                            :active-value="1"
                                            :inactive-value="0"
                                            v-if="!/3|4/.test(row.TextType)"
                                        ></el-switch>
                                        <el-switch
                                            v-model="row.IsReminder"
                                            :active-text="row.IsReminder == 1 ? '是' : '否'"
                                            :active-value="1"
                                            :inactive-value="0"
                                            v-else
                                        ></el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="预警提醒"
                                    align="center"
                                    width="180"
                                >
                                    <template slot-scope="{ row }">
                                        <div class="reming-date" :class="{disabled: row.IsDefault == 1 || row.IsReminder == 0}">
                                            提前 <el-input class="reming-num" :disabled="row.IsReminder == 0" v-model="row.ReminderDay"></el-input> 天
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="80"
                                >
                                    <template slot-scope="{ row, $index }">
                                        <el-tooltip content="系统内置不能删除" v-if="row.IsDefault">
                                            <el-button type="text" text-plain>删除</el-button>
                                        </el-tooltip>
                                        <el-button type="text" @click="formData.CertificateFileds.splice($index, 1)" v-else>删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button class="custom-add-btn" icon="el-icon-plus" @click="addField">添加</el-button>
                        </el-form>
                    </el-scrollbar>
                </div>
            </div>
            <div class="info-operation">
                <div class="remove-btn" @click="removeCert" v-if="!!this.formData.CertificateId">
                    <i class="el-icon-delete"></i>删除
                </div>
                <el-button class="simple" @click="infoFlag = false;">取消</el-button>
                <el-button type="primary" @click="saveCert" :loading="submitLoading">保存</el-button>
            </div>
        </div>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
const defaultFieldList = [
    /* {
        FiledName: '名称', // 字段名称 
        TextType: 2, // 文本类型 1 数字，2 文本，3 日期，4 日期范围
        IsReminder: 0, // 是否到期提醒 0 不提醒， 1 提醒
        ReminderDay: 0, // 提醒天数
        IsDefault: 1, // 是否是系统内置 0 否， 1 是
        Sort: 1
    }, */
    /* {
        FiledName: '有效期', // 字段名称 
        TextType: 4, // 文本类型 1 数字，2 文本，3 日期，4 日期范围
        IsReminder: 0, // 是否到期提醒 0 不提醒， 1 提醒
        ReminderDay: 0, // 提醒天数
        IsDefault: 1, // 是否是系统内置 0 否， 1 是
        Sort: 2
    }, */
];
const defaultFormData ={
    CertificateType: '', // 
    CertificateName: '', // 名称
    CertificateFileds: _extends(defaultFieldList),
    IsDefault: 0,
}
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const formVue = {
    data() {
        return {
            submitLoading: false,
            infoFlag: false,
            fieldTypes: [
                {
                    name: '文本',
                    id: 2,
                },
                {
                    name: '日期',
                    id: 3,
                },
            ],
            formData: _extends(defaultFormData),
            rules: {
                CertificateType: [{required: true, message: '请选择类型', trigger: ['change', 'blur']}],
                CertificateName: [{required: true, message: '请输入名称', trigger: ['change', 'blur']}],
            },
        }
    },
    watch: {
        infoFlag() {
            this.formData = _extends(defaultFormData);
        }
    },
    methods: {
        async getInfo(item) {
            if (item) {
                let res = await this.Get(`/GetCertificate?certificateId=${item.CertificateId}`);
                this.formData = res.data;
                this.$nextTick(() => {
                    this.$refs.formData.clearValidate();
                    this.$refs.scrollbar.wrap.scrollTop = 0;
                    this.$refs.scrollbar1.wrap.scrollTop = 0;
                });
            }
        },
        addField() {
            this.formData.CertificateFileds.push({
                FiledName: '字段名称' + (this.formData.CertificateFileds.length + 1), // 字段名称 
                TextType: 2, // 文本类型 1 数字，2 文本，3 日期，4 日期范围
                IsReminder: 0, // 是否到期提醒 0 不提醒， 1 提醒
                ReminderDay: 0, // 提醒天数
                IsDefault: 0, // 是否是系统内置 0 否， 1 是
                Sort: this.formData.CertificateFileds.length + 1
            })
        },
        removeCert() {
            this.$confirm('确认删除吗？', '提示', {}).then((_) => {
                this.Get('/DeleteCertificate', {
                    certificateId: this.formData.CertificateId,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.getList();
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                        });
                        this.infoFlag = false;
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        saveCert() {
            this.$refs.formData.validate(async (valid, fields) => {
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
                            ...this.formData,
                            CertificateClassification: 3,
                        }
                        let res = await this.Post('/SaveCertificate', params)
                        if (res.status == 2000) {
                            this.$message.success('保存成功')
                            this.handlePageChange(1);
                            this.infoFlag = false;
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

export default {
    components: {
    },
    mixins: [request_mixins, formVue],
    data() {
        return {
            loading: false,
            list: [],
            certTypes: [
                {
                    id: 1,
                    name: '企业',
                },
                {
                    id: 2,
                    name: '人员',
                },
                {
                    id: 3,
                    name: '车辆',
                },
                {
                    id: 4,
                    name: '设备',
                },
            ],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                CertificateType: '',
                CertificateName: '',
            },
        }
    },
    computed: {
        // isRAB() {
        //     // 是否为路桥
        //     let enterpriseInfo = JSON.parse(localStorage.getItem('enterpriseInfo'))
        //     return 1 || enterpriseInfo.IndustryCode == '500542001'
        // },
        typePlaceholder() {
            return '企业/人员/车辆/设备';
        }
    },
    created() {
        // if (this.isRAB) {
        //     this.certTypes = this.certTypes.filter(item => item.name != '车辆');
        // }
        this.handlePageChange(1);
    },
    methods: {
        handlePageChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters,
                CertificateClassification: 3,
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetCertificates', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item) {
            this.infoFlag = true;
            this.getInfo(item);
        },
    }
}
</script>

<style lang="scss" scoped>
.cert-list{
    display: grid;
    grid-template-columns: repeat(auto-fit, 17.3%);
    grid-gap: 25px 49px;
    padding: 0 40px 0 30px;
    .cert-item{
        position: relative;
        display: flex;
        flex-direction: column;
        height: 290px;
        background: url(../../../assets/images/cert/other.png) no-repeat center center;
        background-size: cover;
        cursor: pointer;
        overflow: hidden;
        .cert-name{
            padding: 35px 16px 0;
            font-size: 16px;
            text-align: center;
        }
    }
}
.info{
    display: flex;
    flex-direction: column;
    padding: 17px 15px 0;
    height: 100%;
    color: #181B3B;
    .el-scrollbar{
        height: 100%;
        /deep/ .el-scrollbar__wrap{
            overflow-x: hidden;
        }
    }
    .el-select,
    .el-date-editor{
        width: 100%;
    }
    .el-switch{
        /deep/ .el-switch__label.is-active{
            color: initial;
        }
    }
    .gutter{
        margin-right: 30px;
    }
    .info-main{
        height: calc(100% - 108px);
    }
    .left, .right{ 
        border: 1px solid #DDDDDD;
        border-radius: 10px;
        height: 100%;
    }
    .left{
        margin-right: 15px;
        padding: 10px;
        width: 32.4%;
        .title{
            padding: 35px 15px;
            font-size: 18px;
            text-align: center;
            font-weight: 600;
        }
        .cover-image{
            margin: 0 auto;
            width: 270px;
            height: 290px;
            background: url(../../../assets/images/cert/other.png) no-repeat center center;
            background-size: cover;
        }
        .form{
            margin-top: 29px;
            .form-item{
                display: flex;
                align-items: center;
                margin-bottom: 14px;
                .label{
                    margin-right: 10px;
                    width: 115px;
                    text-align: right;
                    span{
                        display: block;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
                .form-content{
                    width: calc(100% - 165px);
                }
            }
        }
    }
    .right{
        padding: 29px 28px 20px 23px;
        flex: 1;
        word-break: break-all;
    }
    .info-operation{
        margin-top: auto;
        height: 90px;
        line-height: 90px;
        text-align: right;
        .el-button{
            width: 110px;
            height: 45px;
            &.simple{
                border-color: #f5f6fa;
                background: #f5f6fa;
                &:hover{
                    color: initial;
                }
            }
        }
        .remove-btn{
            float: left;
            margin-top: 45px;
            color: #FE3F51;
            cursor: pointer;
            opacity: .8;
            line-height: 1;
            &:hover{
                opacity: 1;
            }
            i{
                margin-right: 5px;
            }
        }
    }
    
    .reming-date{
        &.disabled{
            color: #d5d5d5;
        }
        .reming-num{
            margin: 0 10px;
            width: 60px;
            /deep/ input{
                text-align: center;
            }
        }
    }
    .custom-add-btn{
        margin-top: 15px;
        border-style: dashed;
        width: 100%;
    }
}
</style>
