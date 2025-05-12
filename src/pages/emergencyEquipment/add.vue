<template>
    <el-dialog v-dialog-drag  
        class="emergency-equipmentadd-add"
        :title="title"
        :visible.sync="isShow"
        @close="close"
        width="800px"
        top="50px"
        :append-to-body="true"
    >
        <el-form
            :rules="rules"
            class="container"
            ref="form"
            :model="info"
        >
            <el-form-item label="应急设备" prop="Name">
                <el-input type="text" placeholder="请输入" v-model="info.Name" :disabled="isPreview"></el-input>
            </el-form-item>
            <div class="form-col">
                <el-form-item label="负责人" prop="ManagementPersonId">
                    <el-input placeholder="请选择" v-model="info.ManagementPersonName" readonly :disabled="isPreview">
                        <el-button slot="append" @click="choosePersonel" v-if="!isPreview">请选择</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="检测周期" prop="Intervals">
                    <el-select
                        class="el-input"
                        placeholder="请选择"
                        v-model="info.Intervals"
                        :disabled="isPreview"
                    >
                        <el-option
                            v-for="(item, index) in dateRanges"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="效用试验内容及周期" prop="Content">
                        <el-input type="textarea" placeholder="请输入" v-model="info.Content" :disabled="isPreview"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="维护保养标准" prop="MaintenanceStandard">
                        <el-input type="textarea" v-model="info.MaintenanceStandard" placeholder="请输入" :disabled="isPreview"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="card" v-if="isPreview">
            <div class="card-header">
                检测记录
            </div>
            <div class="card-body">
                <template v-for="(item, index) in info.RecordList">
                    <div class="item" :key="index">
                        <div class="date">{{item.CheckDateDesc}}</div>
                        <div class="info">
                            <span>
                                检测效用：<span class="status" :class="{'is-ok': item.CheckResult == 1}"><i class="icon-status"></i>{{item.CheckResult == 1 ? '正常' : '不正常'}}</span>
                            </span>
                            <span style="margin-left: 22px;">
                                使用：<span class="status" :class="{'is-ok': item.UseResult == 1}"><i class="icon-status"></i>{{item.UseResult == 1 ? '正常' : '不正常'}}</span>
                            </span>
                        </div>
                    </div>
                </template>
                <template v-if="!info.RecordList.length">
                    <div style="text-align: center;margin-top: 10px;">暂无记录</div>
                </template>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button
                type="primary"
                @click="submit()"
                :loading="isSaveLoading"
                v-if="!isPreview"
            >保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import formatter_mixin from "@/mixins/formatter-mixin.js";
import RULECONFIG from "@/common/ruleConfig";
import upload_mixin from "@/mixins/upload-mixin.js";
const defaultInfo = {
    Name: '', // 设备名称 
    ManagementPersonId: '', // 负责人id
    ManagementPersonName: '', // 负责人
    Intervals: '', // 检查保养周期
    Content: '', // 效用试验内容及周期
    MaintenanceStandard: '', // 维护保养标准 
    RecordList: [], // 检测集合 
}
const dateRanges = [
    {
        label: '每周',
        value: 1,
    },
    {
        label: '每月',
        value: 2,
    },
    {
        label: '每季度',
        value: 3,
    },
]
export default {
    name: "emergency-equipmentadd-add",
    mixins: [request_mixin, formatter_mixin, upload_mixin],
    components: {
    },
    data() {
        return {
            isShow: false,
            info: JSON.parse(JSON.stringify(defaultInfo)),
            isSaveLoading: false,
            id: '',
            rules: {
                Intervals: RULECONFIG.Select('请选择检测周期'),
                Name: RULECONFIG.Text('请输入应急设备'),
                ManagementPersonId: RULECONFIG.Text('请选择负责人'),
            },
            isPreview: false,
            dateRanges, // 检查周期
        };
    },
    computed: {
        title() {
            return this.isPreview ? '查看' : this.id ? '编辑' : '新增'
        }
    },
    methods: {
        async show(item, isPreview) {
            const loading = this.$loading({
                lock: true,
                text: '数据加载中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'transparent'
            });
            this.isPreview = !!isPreview;
            if (item) {
                this.id = item.EmergencyEquipmentId;
                let res = await this.Get("/GetEmergencyEquipment", {emergencyEquipmentId : item.EmergencyEquipmentId });
                this.info = res.data;
            }
            this.isShow = true;
            loading.close();
        },
        close() {
            this.isShow = false;
            this.$nextTick(() => {
                this.reset();
            })
        },
        reset() {
            this.isSaveLoading = false;
            this.id = '';
            this.info = JSON.parse(JSON.stringify(defaultInfo));
        },
        getParams() {
            let params = JSON.parse(JSON.stringify(this.info));
            return params;
        },
        async submit() {
            this.$refs.form.validate(async valid => {
                if (!valid) return;
                const loading = this.$loading({
                    lock: true,
                    text: '保存中,请稍等...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let res = await this.Post('/SaveEmergencyEquipment', this.getParams());
                if (res.status === 2000) {
                    this.close();
                    this.$emit('success');
                    this.$message.success('保存成功');
                } else {
                    this.$message.error(res.message);
                }
                loading.close();
            })
        },
        choosePersonel() {
            this.$chooseUser({
                single: false
            }).then(data => {
                this.info.ManagementPersonId = data.UserId;
                this.info.ManagementPersonName = data.UserName;
            })
        },
    },
    async created() {
    },
    mounted() {
    },
};
</script>

<style lang="scss" scoped>
.emergency-equipmentadd-add {
    color: #000;
    .container {
        padding: 20px 35px 12px 0;
    }
    /deep/ textarea{
        height: 130px;
    }
    /deep/ .el-dialog__body{
        padding-left: 33px !important;
    }
    .card{
        border: 1px solid #DDDDDD;
        border-radius: 6px;
        margin: 0 37px 0 0;
        .card-header{
            border-bottom: 1px solid #ddd;
            padding: 13px 22px 12px;
            font-weight: 600;
            font-size: 16px;
            color: #2B2B2B;
        }
        .card-body{
            padding: 26px 31px;
            color: #302E37;
            .item{
                display: flex;
                .info{
                    position: relative;
                    padding-left: 47px;
                    &::before{
                        content: '';
                        position: absolute;
                        top: 5px;
                        left: 18px;
                        z-index: 3;
                        border-radius: 10px;
                        width: 10px;
                        height: 10px;
                        background: #415FFF;
                    }
                }
                &:not(:last-child){
                    .info{
                        padding-bottom: 28px;
                        &::after{
                            content: '';
                            position: absolute;
                            top: 10px;
                            bottom: -10px;
                            left: 23px;
                            z-index: 2;
                            transform: translateX(-.5px);
                            width: 1px;
                            background: #C0C4CC;
                        }
                    }
                }
                .status{
                    color: #F56C6C;
                    &.is-ok{
                        color: #67C23A;
                        .icon-status{
                            background: #67C23A;
                            &::before{
                                content: '✔';
                                display: inline-block;
                                transform: scale(.8);
                            }
                        }
                    }
                }
                .icon-status{
                    display: inline-block;
                    border-radius: 2px;
                    width: 13px;
                    height: 13px;
                    background: #F56C6C;
                    font-size: 14px;
                    color: #fff;
                    line-height: 13px;
                    text-align: center;
                    font-style: normal;
                    &::before{
                        content: '×';
                    }
                }
            }
        }
    }
}
</style>