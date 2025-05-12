<template>
    <el-dialog
        v-dialog-drag
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="2vh"
        v-loading="loading"
        :fullscreen="fullscreen"
        :class="{fullscreen: fullscreen}"
        element-loading-text="数据加载中"
    >
        <div class="f-b-c header" slot="title">
            <div class="title">{{ title }}</div>
            <div class="fullscreen-icon" @click="fullscreen = !fullscreen">
                <i class="iconfont" :class="[fullscreen ? 'icon-quanpingsuoxiao' : 'icon-quanping']"></i>
            </div>
        </div>
        <el-form style="margin-top: 10px;" ref="form" label-position="top" :model="info" :rules="rules">
            <div class="card">
                <el-form-item label="作业流程名称" prop="Name" ref="Name">
                    <el-input placeholder="请输入" v-model="info.Name" ></el-input>
                </el-form-item>
            </div>
            <div class="flow-content">
                <el-scrollbar class="content-scrollbar" ref="scrollbar">
                    <div class="flow-chart">
                        <el-scrollbar> 
                            <div style="text-align: center;">
                                <div class="flow-list">
                                    <div class="flow-item" v-for="(item, index) in flowList" :key="index" :class="{enabled: item.IsEnable}">
                                        <div class="text"><span class="number">{{ item.number }}</span>{{ item.label }}</div>
                                        <div class="status">
                                            <div class="circle"></div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="flow-item-record" v-for="(item, index) in flowList" :key="index" :class="{enabled: item.IsEnable == 1}" :ref="item.label">
                        <div class="f-b-c">
                            <div class="title">
                                <span class="number">{{ item.number }}</span>{{ item.label }}
                            </div>
                            <el-switch
                                v-if="item.canEnable"
                                v-model="item.IsEnable"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="开启"
                                inactive-text="关闭">
                            </el-switch>
                        </div>
                        <div class="signature-method" v-if="item.setSigningMethod && item.IsEnable == 1">
                            <el-tooltip effect="dark">
                                <div slot="content">
                                    负责人设置签字人员<br/>
                                    会签：设置的所有人员必须签字<br/>
                                    或签：设置的人员有一人签字即可
                                </div>
                                <span class="label">签字方式<i class="el-icon-question" style="color: #D5D5D5;"></i>：</span>
                            </el-tooltip>
                            <el-radio v-model="item.SignMethod" :label="1">会签</el-radio>
                            <el-radio v-model="item.SignMethod" :label="2">或签</el-radio>
                        </div>
                        <div class="table-content" v-if="item.Approvals && item.IsEnable == 1">
                            <el-table
                                style="width: 100%"
                                border
                                :data="item.Approvals"
                                :header-cell-style="$tableStyle"
                            >
                                <el-table-column
                                    type="index"
                                    label="序号"
                                    width="60"
                                    align="center"
                                ></el-table-column>
                                <el-table-column
                                    label="审批节点"
                                    align="center"
                                >
                                    <template slot-scope="{ row }">
                                        <el-autocomplete
                                            class="inline-input"
                                            v-model="row.ApprovalNode"
                                            :fetch-suggestions="querySearch"
                                            placeholder="请输入内容"
                                            value-key="Name"
                                            @select="handleSelect(row, $event)"
                                        ></el-autocomplete>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="签字方式"
                                    align="center"
                                    width="230"
                                >
                                    <template slot-scope="{ row }">
                                        <el-radio v-model="row.SignMethod" :label="1">会签</el-radio>
                                        <el-radio v-model="row.SignMethod" :label="2">或签</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="排序"
                                    align="center"
                                    width="230"
                                >
                                    <template slot-scope="{ row, $index }">
                                        <el-button type="text" text-plain icon="el-icon-top" @click="move(row, -1, $index, item.Approvals)">上移</el-button>
                                        <el-button type="text" text-plain icon="el-icon-bottom" @click="move(row, 1, $index, item.Approvals)">下移</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="160"
                                >
                                    <template slot-scope="{ $index }">
                                        <el-button type="text" text-plain @click="item.Approvals.splice($index, 1)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="table-operation">
                                <el-button class="add-btn" type="primary" plain icon="el-icon-plus" @click="addApproval(item.Approvals)">添加</el-button>
                            </div>
                        </div>
                        <div class="signature-method f" v-if="item.isSelect && !!item.list.length && item.IsEnable == 1">
                            <span class="label">过程监督表：</span>
                            <el-select v-model="item.JobProcessCheckId" @change="changeCheck(item, $event)">
                                <el-option v-for="(o, i) in item.list" :key="i" :label="o.Name" :value="o.JobProcessCheckId"></el-option>
                            </el-select>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
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
        jobTemplateId: [String, Number],
        approvals: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            fullscreen: true,
            flowList: [],
            rules: {
                Name: [{required: true, message: '请输入作业流程名称', trigger: ['change', 'blur']}],
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
                this.id = item.JobFlowId;
                this.info = _extends(item);
                this.loading = false;
            }
            await this.getFlowList(!!item);
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.$nextTick(() => {
                this.submitLoading = false;
                this.id = '';
                this.info = _extends(defaultInfo);
                this.fullscreen = true;
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
                    let list = this.flowList;
                    for(let i = 0; i < list.length; i++) {
                        let item = list[i];
                        if (item.id == 60) {
                            if (!item.Approvals.length && item.IsEnable == 1) {
                                this.$message.error('请设置审批');
                                this.$refs.scrollbar.wrap.scrollTop = this.$refs[item.label][0].offsetTop;
                                return;
                            }
                            let emptyList = item.Approvals.filter(o => !o.ApprovalNode);
                            if (emptyList.length) {
                                this.$message.error('请设置审批节点');
                                this.$refs.scrollbar.wrap.scrollTop = this.$refs[item.label][0].offsetTop;
                                return;
                            }
                        }
                        if (item.id == 80) {
                            if (!item.JobProcessCheckId && item.IsEnable == 1) {
                                this.$message.error('请选择监督表');
                                this.$refs.scrollbar.wrap.scrollTop = this.$refs[item.label][0].offsetTop;
                                return;
                            }
                        }
                    }
                    this.submitLoading = true;
                    try {
                        let params = {
                        ...this.info,
                        jobTemplateId: this.jobTemplateId,
                        Contents: list
                        }
                        let res = await this.Post('/SaveJobFlow', params)
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
        },
        async getFlowList(isEdit) {
            let res = await this.Get('/GetJobFlowTypeCom');
            // 获取过程检查表
            let checkRes = await this.Get('/GetJobProcessCheckList', {jobTemplateId: this.jobTemplateId})
            let checkList = [];
            if (checkRes.status == 2000) {
                checkList = checkRes.data;
            }
            if (res.status == 2000) {
                let approvals = this.approvals.filter(item => item.IsDefault == 1).map((item, index) => {
                    return {
                        Sort: index + 1,
                        ApprovalNode: item.Name,
                        SignMethod: 1
                    }
                });
                this.flowList = res.data.map((item, index) => {
                    let editItem = {};
                    if (isEdit) {
                        editItem = this.info.Contents.find(o => o.JobFlowType == item.id)
                    }
                    return {
                        ...item,
                        label: item.text,
                        number: index + 1 > 9 ? index + 1 : '0' + (index + 1),
                        canEnable: !/^0|10|90$/.test(item.id), // 是否能操作开启
                        setSigningMethod: !/^0|10|30|60|80$/.test(item.id), // 需要设置签名方式
                        isSelect: item.id == 80, // 是否为下拉选择
                        list: item.id == 80 ? checkList : null, // 下拉选择集合数据
                        
                        Approvals: item.id == 60 ? approvals : null, // 审批节点
                        SignMethod: 1, // 签名方式
                        Sort: index, // 排序
                        IsEnable: 1, // 是否开启
                        ApprovalNode: item.id == 60 ? 2 : item.id == 80 ? 3 : 1, // 审批节点类型 1 正常节点 2 审批节点 3 检查节点
                        JobFlowType: item.id, // 节点类型
                        JobProcessCheckId: '', // 过程监督表
                        JobProcessCheckName: '',
                        ...editItem
                    }
                })
            }
            return Promise.resolve(true);
        },
        addApproval(list) {
            let sort = list.length ? list[list.length - 1].Sort : 0;
            list.push({
                Sort: ++sort, // (integer, optional): 排序 ,
                ApprovalNode: '', // (string, optional): 审批节点（输入） ,
                SignMethod: 1, // (integer, optional): 签字方式 1会签 （多人全部同意才能一下步） 2或签（有一人同意即可下一步）
            })
        },
        querySearch(queryString, cb) {
            var approvals = this.approvals;
            var results = queryString ? approvals.filter(this.createFilter(queryString)) : approvals;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.Name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        handleSelect(item, event) {
            item.ApprovalNode = event.Name;
        },
        move(item, num, index, list) {
            let siblingItem = list[index + num];
            item.Sort += num;
            siblingItem.Sort -=num;
            list = list.sort((a,b) => a.Sort - b.Sort);
        },
        changeCheck(item, event) {
            item.list.forEach(o => {
                if (o.JobProcessCheckId == event) {
                    item.JobProcessCheckName = o.Name;
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog{
            display: flex;
            flex-direction: column;
        }
        /deep/ .el-dialog__body{
            flex: 1;
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        /deep/ .el-form{
            padding: 0;
            height: 100%;
            .el-select,
            .el-autocomplete{
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
        &.fullscreen{
            .flow-content{
                height: 69.8vh;
            }
        }
        .card{
            padding: 20px 25px 0;
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
        .fullscreen-icon{
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
        .flow-content{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 25px 25px 20px;
            height: 62vh;
            background: #f8f8f8;
        }
        .flow-chart{
            border-radius: 10px 10px 10px 10px;
            margin: 0 0 15px;
            background: #fff;
            /deep/ .el-scrollbar__wrap{
                overflow-x: hidden;
            }
            .flow-list{
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0 40px;
                height: 100px;
                text-align: left;
                .flow-item{
                    .text{
                        margin-bottom: 10px;
                        line-height: 16px;
                        white-space: nowrap;
                        color: #d5d5d5;
                        .number{
                            margin-right: 5px;
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
                    .status{
                        display: flex;
                        align-items: center;
                        .circle{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 100%;
                            border: 2px solid $__color-primary;
                            width: 23px;
                            height: 23px;
                            opacity: .3;
                        }
                    }
                    &:not(:last-child){
                        .status{
                            &::after{
                                content: '';
                                margin: 0 11px;
                                width: 100px;
                                height: 2px;
                                background: $__color-primary;
                                opacity: .3;
                            }
                        }
                    }
                    &.enabled{
                        .text{
                            color: #181B3B;
                        }
                        .status{
                            .circle{
                                opacity: 1;
                                background: $__color-primary;
                                &::before{
                                    content: '';
                                    border-bottom: 1px solid #fff;
                                    border-left: 1px solid #fff;
                                    transform: rotate(-45deg) translate(1px, -1px);
                                    width: 11px;
                                    height: 5px;
                                }
                            }
                            &::after{
                                opacity: 1;
                            }
                        }
                    }
                }
            }
        }
        .content-scrollbar{
            flex: 1;
            /deep/ .el-scrollbar__wrap{
                overflow-x: hidden;
            }
            .flow-item-record{
                border-radius: 10px;
                margin-bottom: 10px;
                padding: 20px;
                background: #fff;
                &.enabled{
                    .title{
                        color: #181B3B;
                        .number{
                            background: $__color-primary;
                        }
                    }
                }
                .title{
                    font-size: 16px;
                    line-height: 28px;
                    color: #959595;
                    .number{
                        display: inline-block;
                        border-radius: 100%;
                        margin-right: 15px;
                        width: 28px;
                        height: 28px;
                        background: #D5D5D5;
                        font-size: 14px;
                        color: #fff;
                        text-align: center;
                    }
                }
                .signature-method{
                    border-radius: 6px;
                    margin-top: 10px;
                    padding: 15px 45px;
                    background: #f8f8f8;
                    .label{
                        white-space: nowrap;
                    }
                }
                .table-content{
                    margin-top: 20px;
                    padding-left: 40px;
                    [text-plain]{
                        color: #181B3B;
                    }
                    .table-operation{
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 10px;
                        .add-btn{
                            border-style: dashed;
                            width: 160px;
                        }
                    }
                }
            }
        }
    }
</style>
