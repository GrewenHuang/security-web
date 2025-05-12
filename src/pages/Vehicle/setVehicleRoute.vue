<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="setVehicleRoute"
        width="1100px"
        top="8vh"
    >
        <el-scrollbar class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item label="车辆路线" prop="DrivingLineId">
                    <el-select placeholder="请选择" filterable v-model="info.DrivingLineId" @change="handleDrivingLineChange">
                        <el-option v-for="(item, index) in busRoutesList" :key="index" :label="item.DrivingLineName" :value="item.DrivingLineId"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="currentDrivingLine">
                    <template v-if="currentDrivingLine.DrivingLineType == 2">
                        <div class="split-line"></div>
                        <div>
                            <div class="site-title f-b-c">
                                <div class="label">上行路线</div>
                                <div class="site-date f--c">
                                    <div>夏季运营时间： <span style="white-space: pre">{{ currentDrivingLine.UplinkStation.SummerStartTime }} - {{ currentDrivingLine.UplinkStation.SummerEndTime }}</span></div>
                                    <div>冬季运营时间： <span style="white-space: pre">{{ currentDrivingLine.UplinkStation.WinterStartTime }} - {{ currentDrivingLine.UplinkStation.WinterEndTime }}</span></div>
                                </div>
                            </div>
                            <div class="site-desc">{{ getStartDrivingLine(currentDrivingLine.UplinkStation) }} <i class="el-icon-right"></i>（开往）<i class="el-icon-right"></i> {{ getEndDrivingLine(currentDrivingLine.UplinkStation) }}    共 <span class="site-count">{{ currentDrivingLine.UplinkStationCount }}</span> 站</div>
                            <div class="site-list">
                                <div class="site-item" v-for="(item, index) in currentDrivingLine.UplinkStation.list" :key="index">
                                    <div class="site-name">
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="split-line"></div>
                        <div>
                            <div class="site-title f-b-c">
                                <div class="label">下行路线</div>
                                <div class="site-date f--c">
                                    <div>夏季运营时间： <span style="white-space: pre">{{ currentDrivingLine.DownlinkStation.SummerStartTime }} - {{ currentDrivingLine.DownlinkStation.SummerEndTime }}</span></div>
                                    <div>冬季运营时间： <span style="white-space: pre">{{ currentDrivingLine.DownlinkStation.WinterStartTime }} - {{ currentDrivingLine.DownlinkStation.WinterEndTime }}</span></div>
                                </div>
                            </div>
                            <div class="site-desc">{{ getStartDrivingLine(currentDrivingLine.DownlinkStation) }} <i class="el-icon-right"></i>（开往）<i class="el-icon-right"></i> {{ getEndDrivingLine(currentDrivingLine.DownlinkStation) }}    共 <span class="site-count">{{ currentDrivingLine.DownlinkStationCount }}</span> 站</div>
                            <div class="site-list">
                                <div class="site-item" v-for="(item, index) in currentDrivingLine.DownlinkStation.list" :key="index">
                                    <div class="site-name">
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="currentDrivingLine.DrivingLineType == 1">
                        <div class="split-line"></div>
                        <div>
                            <div class="site-title f-b-c">
                                <div class="label">单循环路线</div>
                                <div class="site-date f--c">
                                    <div>夏季运营时间： <span style="white-space: pre">{{ currentDrivingLine.UplinkStation.SummerStartTime }} - {{ currentDrivingLine.UplinkStation.SummerEndTime }}</span></div>
                                    <div>冬季运营时间： <span style="white-space: pre">{{ currentDrivingLine.UplinkStation.WinterStartTime }} - {{ currentDrivingLine.UplinkStation.WinterEndTime }}</span></div>
                                </div>
                            </div>
                            <div class="site-desc">{{ getStartDrivingLine(currentDrivingLine.UplinkStation) }} <i class="el-icon-right"></i>（开往）<i class="el-icon-right"></i> {{ getEndDrivingLine(currentDrivingLine.UplinkStation) }}    共 <span class="site-count">{{ currentDrivingLine.UplinkStationCount }}</span> 站</div>
                            <div class="site-list">
                                <div class="site-item" v-for="(item, index) in currentDrivingLine.UplinkStation.list" :key="index">
                                    <div class="site-name">
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
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
import requestMixin from '@/mixins/request-mixin';

export default {
    name: 'set-vehicle-route',
    mixins: [requestMixin],
    data() {
        return {
            id: '',
            dislogShow: false,
            submitLoading: false,
            info: {
                DrivingLineId: ''
            },
            busRoutesList: [],
            rules: {
                DrivingLineId: [{required: true, message: '请选择车辆路线', trigger: 'change'}]
            },
            currentDrivingLine: null, // 当前线路
            VehicleDrivingLineId: '', // 车辆线线路 id
        }
    },
    computed: {
        title() {
            return '线路'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.id = item.VehicleId;
                await this.getAllDrivingLines();
                this.getDrivingLineById();
            }
        },
        async getDrivingLineById() {
            let res = await this.Get(`/GetVehicleDrivingLineByVehicleId?vehicleId=${this.id}`);
            if (res.status == 2000) {
                if (res.data) {
                    this.info.DrivingLineId = res.data.DrivingLineId;
                    this.VehicleDrivingLineId = res.data.VehicleDrivingLineId;
                    this.handleDrivingLineChange();
                }
            } else {
                this.$message.error(res.message);
            }
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.reset();
        },
        reset() {
            this.id = '';
            this.info.DrivingLineId = '';
            this.currentDrivingLine = null;
        },
        save() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    this.submitLoading = true;
                    let params = {
                        VehicleId: this.id,
                        VehicleDrivingLineId: this.VehicleDrivingLineId,
                        ...this.info
                    }
                    try {
                        let res = await this.Post('/SaveVehicleDrivingLine', params);
                        if (res.status === 2000) {
                            this.$message.success(this.VehicleDrivingLineId ? '公交线路修改成功' : '公交线路添加成功');
                            this.$emit('success');
                            this.close();
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        console.error(error)
                    }
                    this.submitLoading = false;
                }
            })
        },
        getAllDrivingLines() {
            return new Promise(async (resolve, reject) => {
                let res = await this.Post('/GetDrivingLines', {rows: 99999});
                if (res.status == 2000) {
                    
                    let fieldArr = ['UplinkStation', 'DownlinkStation'];
                    fieldArr.forEach(key => {
                        res.data.list.forEach(item => {
                            item[key] = JSON.parse(item[key]);
                        })
                        
                    });
                    this.busRoutesList = res.data.list;
                } else {
                    this.$message.error(res.message);
                }
                resolve(true)
            })
        },
        handleDrivingLineChange() {
            let drivingLine = this.busRoutesList.filter(item => item.DrivingLineId == this.info.DrivingLineId)[0]
            this.currentDrivingLine = drivingLine;
        },
        getStartDrivingLine(item) {
            return item.list[0].name;
        },
        getEndDrivingLine(item) {
            return item.list[item.list.length - 1].name;
        }
    }
}
</script>

<style lang="scss" scoped>
    .setVehicleRoute{
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 1100px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
        }
        /deep/ .el-form-item{
            margin-bottom: 34px;;
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
        .split-line{
            margin: 0 -25px 34px;
            height: 10px;
            background: #F2F2F2;
        }
        .site-title{
            border-radius: 4px;
            padding: 14px 19px 13px 15px;
            background: #f8f8f8;
            .label{
                display: flex;
                align-items: center;
                font-size: 16px;
                font-weight: 500;
                &::before{
                    content: '';
                    border-radius: 2px;
                    margin-right: 8px;
                    width: 5px;
                    height: 16px;
                    background: $primary-color;
                }
            }
            .site-date{
                color: #1C1D2F;
                >div:first-child{
                    margin-right: 30px;
                }
            }
        }
        .site-desc{
            margin: 19px 0 25px;
            white-space: pre;
            .site-count{
                color: $primary-color;
            }
        }
        .site-list{
            display: flex;
            flex-wrap: wrap;
            .site-item{
                position: relative;
                margin-right: 15px;
                margin-bottom: 35px;
                padding-top: 22px;
                &:not(:last-child)::after{
                    content: '';
                    position: absolute;
                    z-index: 8;
                    top: 6px;
                    left: 20px;
                    right: -29px;
                    background: #F2F2F2;
                    height: 1px;
                }
                &:nth-child(19n)::after {
                    display: none;
                }
                &:hover{
                    .site-name{
                        border-color: $primary-color;
                        background: $primary-color;
                        color: #fff;
                        &::before{
                            border-color: $primary-color;
                            background: $primary-color;
                        }
                    }
                }
            }
            .site-name{
                position: relative;
                z-index: 9;
                border-radius: 4px;
                border: 1px solid #E7E8F2;
                padding: 13px 12px 20px;
                width: 40px;
                min-height: 153px;
                cursor: pointer;
                &::before{
                    content: '';
                    position: absolute;
                    top: -22px;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 1px solid #d5d5d5;
                    border-radius: 12px;
                    background: #fff;
                    width: 12px;
                    height: 12px;
                }
            }
        }
    }
</style>