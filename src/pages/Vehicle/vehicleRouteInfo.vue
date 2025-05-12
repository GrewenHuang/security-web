<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="vehicleRouteInfo"
        width="1100px"
        top="8vh"
    >
        <el-scrollbar class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="f-b-c">
                    <el-form-item class="w50" label="车辆路线" prop="DrivingLineName">
                        <el-input placeholder="请输入" v-model="info.DrivingLineName" ></el-input>
                    </el-form-item>
                    <el-form-item class="w50" label="类别" prop="DrivingLineType">
                        <el-select placeholder="请选择" v-model="info.DrivingLineType" @change="handleTypeChange">
                            <el-option v-for="(item, index) in drivingLineTypes" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="f-b-c">
                    <el-form-item class="w50" label="夏季运营时间" prop="SummerStartTime">
                        <el-time-picker
                            :editable="false"
                            v-model="info.SummerStartTime"
                            placeholder="请选择"
                            value-format="HH:mm"
                            :picker-options="{
                                format: 'HH:mm'
                            }"
                        ></el-time-picker>
                        <span style="white-space: pre;">  -  </span>
                        <el-time-picker
                            :editable="false"
                            v-model="info.SummerEndTime"
                            placeholder="请选择"
                            value-format="HH:mm"
                            :picker-options="{
                                format: 'HH:mm'
                            }"
                        ></el-time-picker>
                    </el-form-item>
                    <el-form-item class="w50" label="冬季运营时间" prop="WinterStartTime">
                        <el-time-picker
                            :editable="false"
                            v-model="info.WinterStartTime"
                            placeholder="请选择"
                            value-format="HH:mm"
                            :picker-options="{
                                format: 'HH:mm'
                            }"
                        ></el-time-picker>
                        <span style="white-space: pre;">  -  </span>
                        <el-time-picker
                            :editable="false"
                            v-model="info.WinterEndTime"
                            placeholder="请选择"
                            value-format="HH:mm"
                            :picker-options="{
                                format: 'HH:mm'
                            }"
                        ></el-time-picker>
                    </el-form-item>
                </div>
                <template v-if="info.DrivingLineType == 2">
                    <div class="split-line"></div>
                    <el-form-item label="上行路线站点" prop="UplinkStation">
                        <div class="site-list">
                            <div class="site-item" v-for="(item, index) in info.UplinkStation" :key="index">
                                <div class="site-operation">
                                    <el-input placeholder="请输入站点名" v-model="item.name"></el-input>
                                    <div class="operation-content">
                                        <i class="operation-icon el-icon-delete" @click="removeSiteItem('UplinkStation', index)"></i>
                                        <i class="operation-icon el-icon-circle-plus-outline" @click="addSiteItem('UplinkStation', index)"></i>
                                    </div>
                                </div>
                                <i class="site-icon el-icon-right"></i>
                            </div>
                            <div class="add-site" @click="addSite('UplinkStation')">
                                <i class="el-icon-plus"></i>
                                添加站点
                            </div>
                        </div>
                    </el-form-item>
                    <div class="split-line"></div>
                    <el-form-item label="下行路线站点" prop="DownlinkStation">
                        <div class="site-list">
                            <div class="site-item" v-for="(item, index) in info.DownlinkStation" :key="index">
                                <div class="site-operation">
                                    <el-input placeholder="请输入站点名" v-model="item.name"></el-input>
                                    <div class="operation-content">
                                        <i class="operation-icon el-icon-delete" @click="removeSiteItem('DownlinkStation', index)"></i>
                                        <i class="operation-icon el-icon-circle-plus-outline" @click="addSiteItem('DownlinkStation', index)"></i>
                                    </div>
                                </div>
                                <i class="site-icon el-icon-right"></i>
                            </div>
                            <div class="add-site" @click="addSite('DownlinkStation')">
                                <i class="el-icon-plus"></i>
                                添加站点
                            </div>
                        </div>
                    </el-form-item>
                </template>
                <template v-else-if="info.DrivingLineType == 1">
                    <div class="split-line"></div>
                    <el-form-item label="单循环路线站点" prop="UplinkStation">
                        <div class="site-list">
                            <div class="site-item" v-for="(item, index) in info.UplinkStation" :key="index">
                                <div class="site-operation">
                                    <el-input placeholder="请输入站点名" v-model="item.name"></el-input>
                                    <div class="operation-content">
                                        <i class="operation-icon el-icon-delete" @click="removeSiteItem('UplinkStation', index)"></i>
                                        <i class="operation-icon el-icon-circle-plus-outline" @click="addSiteItem('UplinkStation', index)"></i>
                                    </div>
                                </div>
                                <i class="site-icon el-icon-right"></i>
                            </div>
                            <div class="add-site" @click="addSite('UplinkStation')">
                                <i class="el-icon-plus"></i>
                                添加站点
                            </div>
                        </div>
                    </el-form-item>
                </template>
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
import { mapState } from 'vuex';
import requestMixin from '@/mixins/request-mixin';
const  defaultInfo = {
    DrivingLineName: '',
    DrivingLineType: '',
    SummerStartTime: '',
    SummerEndTime:  '',
    WinterStartTime: '', // new Date(1678744800000)
    WinterEndTime: '', // new Date(1678806000000)
    UplinkStation: [], // 上行站点
    DownlinkStation: [], // 下行站点
}
export default {
    name: 'vehicle-route-info',
    mixins: [requestMixin],
    data() {
        function siteValidator(rule, value, callback) {
            let haveEmpty = value.filter(item => !item.name);
            if (haveEmpty.length) {
                callback(new Error('请输入站点名'))
            } else {
                callback();
            }
        }
        return {
            id: '',
            dislogShow: false,
            submitLoading: false,
            info: JSON.parse(JSON.stringify(defaultInfo)),
            rules: {
                DrivingLineName: [{trigger: 'blur', required: true, message: '请输入公交路线'}],
                DrivingLineType: [{trigger: 'blur', required: true, message: '请选择类别'}],
                SummerStartTime: [
                    {trigger: 'blur', required: true, message: '请选择夏季运营开始时间'},
                    {
                        validator: (rule, value, callback) => {
                            if (!this.info.SummerEndTime) {
                                callback(new Error('请选择夏季运营结束时间'))
                            } else{
                                callback();
                            }
                        }
                    }
                ],
                SummerEndTime: [{trigger: 'blur', required: true, message: ''}],
                WinterStartTime: [
                    {trigger: 'blur', required: true, message: '请选择冬季运营开始时间'},
                    {
                        validator: (rule, value, callback) => {
                            if (!this.info.WinterEndTime) {
                                callback(new Error('请选择冬季运营结束时间'))
                            } else{
                                callback();
                            }
                        }
                    }
                ],
                WinterEndTime: [{trigger: 'blur', required: true, message: ''}],
                UplinkStation: [
                    {trigger: ['blur', 'change'], required: true, message: '请创建路线站点'},
                    {
                        validator: siteValidator
                    }
                ], // 上行站点
                DownlinkStation: [
                    {trigger: ['blur', 'change'], required: true, message: '请创建路线站点'},
                    {
                        validator: siteValidator
                    }
                ], // 下行站点
            }
        }
    },
    computed: {
        ...mapState(['drivingLineTypes']),
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
                this.id = item.DrivingLineId;
                let res = await this.Get(`/GetDrivingLine?id=${this.id}`);
                if (res.status == 2000){
                    let fieldArr = ['UplinkStation', 'DownlinkStation'];
                    fieldArr.forEach(key => {
                        let json = JSON.parse(res.data[key]);
                        res.data[key] = json.list;
                    });
                    this.info = JSON.parse(JSON.stringify(res.data));
                    this.info.DrivingLineType = this.info.DrivingLineType + '';
                } else {
                    this.$message.error('获取数据失败');
                    this.close();
                }
            }
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.reset();
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            })
        },
        reset() {
            this.info = JSON.parse(JSON.stringify(defaultInfo));
            this.id = '';
        },
        addSite(key) {
            this.info[key].push({
                name: ''
            });
        },
        addSiteItem(key, index) {
            this.info[key].splice(index + 1, 0, {
                name: ''
            });
        },
        removeSiteItem(key, index) {
            this.$confirm('确认删除该节点吗?', '提示').then(() => {
                this.info[key].splice(index, 1);
            });
        },
        save() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.info));
                    params.UplinkStationCount = params.UplinkStation.length;
                    let uplinkStation = {
                        SummerStartTime: params.SummerStartTime,
                        SummerEndTime: params.SummerEndTime,
                        WinterStartTime: params.WinterStartTime,
                        WinterEndTime: params.WinterEndTime,
                        list: params.UplinkStation
                    }
                    params.UplinkStation = JSON.stringify(uplinkStation);
                    let downlinkStation = {
                        SummerStartTime: params.SummerStartTime,
                        SummerEndTime: params.SummerEndTime,
                        WinterStartTime: params.WinterStartTime,
                        WinterEndTime: params.WinterEndTime,
                        list: params.DownlinkStation
                    }
                    params.DownlinkStationCount = params.DownlinkStation.length;
                    params.DownlinkStation = JSON.stringify(downlinkStation);
                    this.submitLoading = true;
                    try {
                        let res = await this.Post('/SaveDrivingLine', params);
                        if (res.status == 2000) {
                            if (this.id) {
                                this.$message.success('修改成功');
                            } else {
                                this.$message.success('新增成功')
                            }
                            this.$emit('success');
                            this.close();
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        
                    }
                    this.submitLoading = false
                }
            })
        },
        handleTypeChange() {
            this.info.UplinkStation.splice(0, this.info.UplinkStation.length);
        }
    }
}
</script>

<style lang="scss" scoped>
    .vehicleRouteInfo{
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 1100px;
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
            .el-form-item__content{
                display: flex;
                .el-date-editor{
                    flex: 1;
                }
            }
        }
        .w50{
            width: 50%;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
        }
        .split-line{
            margin: 0 -25px 34px;
            height: 10px;
            background: #F2F2F2;
        }
        .site-list{
            display: flex;
            flex-wrap: wrap;
            .site-item{
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                /deep/ .el-input{
                    width: 180px;
                    input{
                        height: 45px;
                        line-height: 45px;
                    }
                }
                .site-icon{
                    margin: 0 8px;
                }
                .site-operation{
                    position: relative;
                    &:hover{
                        .operation-content{
                            display: block;
                        }
                    }
                    /deep/ input{
                        padding-right: 45px;
                    }
                    .operation-content{
                        position: absolute;
                        top: 50%;
                        right: 5px;
                        transform: translateY(-50%);
                        display: none;
                        color: #C0C4CC;
                        .operation-icon{
                            cursor: pointer;
                            &:not(:last-child) {
                                margin-right: 5px;
                            }
                            &:hover{
                                color: $primary-color;
                            }
                        }
                    }
                }
            }
            .add-site{
                border: 1px dashed #E7E8F2;
                border-radius: 4px;
                padding: 0 15px;
                width: 180px;
                height: 45px;
                line-height: 45px;
                color: #959595;
                background: #FBFDFF;
                text-align: center;
                cursor: pointer;
            }
        }
    }
</style>
<style lang="scss">
    .el-time-panel{
        text-align: center;
        .el-time-spinner__wrapper{
            .el-scrollbar__wrap{
                margin-bottom: 0 !important;
                overflow-x: hidden;
            }
            .el-scrollbar__bar.is-horizontal{
                display: none !important;
            }
        }
    }
</style>