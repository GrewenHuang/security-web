<!-- 公交首页面板 -->
<template>
    <div class="dashboard grid">
        <div class="bg num" @click="navTo('/User')">
            <div class="icon">
                <i class="el-icon-user-solid"></i>
            </div>
            <div class="text">
                <div class="label">全部人员（人）</div>
                <div>{{ info.UserCount }}</div>
            </div>
            <div class="arrow"></div>
        </div>
        <div class="bg num" @click="navTo('/Vehicle')">
            <div class="icon icon-2">
                <i class="el-icon-truck"></i>
            </div>
            <div class="text">
                <div class="label">全部车辆（辆）</div>
                <div>{{ info.VehicleCount }}</div>
            </div>
            <div class="arrow"></div>
        </div>
        <div class="bg item-3">
            <div class="header f-b-c" @click="navTo('/Logbook')">
                <div class="title">行车日志（本月）</div>
                <div class="arrow"></div>
            </div>
            <div class="ranking">
                <div class="ranking-header item">
                    <div>序号</div>
                    <div>车牌</div>
                    <div>行车日志</div>
                    <div>车辆巡查</div>
                </div>
                <el-scrollbar>
                    <div class="item" v-for="(item, index) in logbookList" :key="index">
                        <div>{{ index + 1 }}</div>
                        <div>{{ item.Name }}</div>
                        <div>{{ item.InspectionCount }}</div>
                        <div>{{ item.VehicleSafelyCheckCount }}</div>
                    </div>
                    <div class="no-data" v-if="!logbookList || !logbookList.length"></div>
                </el-scrollbar>
            </div>
        </div>
        <div class="bg item-4">
            <div class="header f-b-c" @click="navTo('/Integralist')">
                <div class="title">积分排名（本月）</div>
                <div class="arrow"></div>
            </div>
            <div class="ranking integral">
                <div class="ranking-header item">
                    <div>排名</div>
                    <div>成员</div>
                    <div>积分</div>
                </div>
                <el-scrollbar>
                    <div class="item" v-for="(item, index) in integralList" :key="index">
                        <div>{{ index + 1 }}</div>
                        <div>{{ item.Name }}</div>
                        <div>{{ item.Score }}</div>
                    </div>
                    <div class="no-data" v-if="!integralList || !integralList.length"></div>
                </el-scrollbar>
            </div>
        </div>
        <div class="tabs">
            <div class="tab">
                <div class="tabbar" :class="{active: train.tabActive == 0, tabbar1: train.tabActive == 1}" @click="train.tabActive = 0">岗前培训</div>
                <div class="tabbar" :class="{active: train.tabActive == 1, tabbar2: train.tabActive == 0}" @click="train.tabActive = 1">再教育培训</div>
            </div>
            <div class="tab-content">
                <pie :value="train.data[train.tabActive]"/>
            </div>
        </div>
        <div class="tabs">
            <div class="tab">
                <div class="tabbar" :class="{active: meeting.tabActive == 0, tabbar1: meeting.tabActive == 1}" @click="meeting.tabActive = 0">安全例会</div>
                <div class="tabbar" :class="{active: meeting.tabActive == 1, tabbar2: meeting.tabActive == 0}" @click="meeting.tabActive = 1">安全工作小组例会</div>
            </div>
            <div class="tab-content">
                <el-dropdown class="echarts-filter" trigger="click" @command="setMeetingData($event)">
                    <span class="cursor-p">{{ meeting.month }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="(item, index) in meeting.list" :key="index" :command="index">{{ item.Month }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <pie :value="meeting.data[meeting.tabActive]"/>
            </div>
        </div>
        <div class="bg item-7">
            <div class="pitfall">
                <div class="header f-b-c">
                    <div class="title">隐患情况</div>
                    <div>
                        <el-dropdown class="echarts-filter" trigger="click" @command="setPitfallData($event)">
                            <span class="cursor-p">{{ pitfall.year }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in pitfall.list" :key="index" :command="index">{{ item.Year }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="content">
                    <chartLine :value="pitfall.data"/>
                </div>
            </div>
            <div class="risk">
                <div class="header f-b-c">
                    <div class="title">风险统计</div>
                </div>
                <div class="content">
                    <pie1 :value="risk" />
                </div>
            </div>
        </div>
        <div class="bg">
            <div class="header f-b-c">
                <div class="title">证件预警</div>
            </div>
            <div class="content">
                <bar :value="expoiration" :xAxisData="['正常', '逾过期', '已过期']"/>
            </div>
        </div>
    </div>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import AnimatedNumber from 'animated-number-vue';
import pie from './components/pie-1';
import pie1 from './components/pie';
import chartLine from './components/line';
import bar from './components/bar'
export default {
    name: "Dashboard",
    components: {
        AnimatedNumber,
        pie,
        pie1,
        chartLine,
        bar
    },
    mixins: [request_mixin],

    data() {
        return {
            info: {},
            train: {
                tabActive: 0,
                data: {
                    0: [],
                    1: []
                },
            },
            meeting: {
                tabActive: 0,
                list: [],
                month: '',
                data: {
                    0: [],
                    1: []
                }
            },
            logbookList: [],
            integralList: [],
            risk: [],
            expoiration: [],
            pitfall: {
                list: [],
                data: [],
                year: ''
            }
        };
    },
    computed: {
        
    },
    created() {
        this.getData();
    },
    methods: {
        async getData() {
            let res = await this.Get('/GetBusHomeInfo');
            if (res.status == 2000) {
                let {BaseInfo, ExpirationInfo, IntegralTopInfos, LogbookTopInfos, PotentialInfos, RiskInfos, SafetyMeetingInfos, TrainInfos} = res.data;
                this.info = BaseInfo;
                this.logbookList = LogbookTopInfos;
                this.integralList = IntegralTopInfos;

                this.train.data[0] = TrainInfos.PreProportions;
                this.train.data[1] = TrainInfos.ReeducationProportions;

                this.meeting.list = SafetyMeetingInfos;
                this.setMeetingData(this.meeting.list.length - 1);
                this.setRiskData(RiskInfos);
                this.pitfall.list = PotentialInfos;
                this.setPitfallData(this.pitfall.list.length - 1);
                this.expoiration = ExpirationInfo.length ? ExpirationInfo.map(item => ({
                    name: item.Name,
                    value: item.Count
                })) : [{name: '证件', value: []}, {name: '保险', value: []}, {name: '其他', value: []}];
            }
        },
        navTo(url) {
            this.$router.push(url)
            this.$parent.selectmenu(url)
        },
        setMeetingData(index) {
            let data = this.meeting.list[index];
            if (!data) return;
            let obj = {
                name: '已参与人次',
                value: '',
                rate: ''
            }
            let obj1= {
                name: '未参与人次',
                value: '',
                rate: ''
            }
            let {SafetyMeetingDTO, SafetyMeetingGroupDTO} = data;
            this.meeting.data[0] = [
                Object.assign(obj, {value: SafetyMeetingDTO.FinishedCount, rate: SafetyMeetingDTO.FinishedRate}),
                Object.assign(obj1, {value: SafetyMeetingDTO.UnFinishedCount, rate: SafetyMeetingDTO.UnFinishedRate})
            ];
            this.meeting.data[1] = [
                Object.assign(obj, {value: SafetyMeetingGroupDTO.FinishedCount, rate: SafetyMeetingGroupDTO.FinishedRate}),
                Object.assign(obj1, {value: SafetyMeetingGroupDTO.UnFinishedCount, rate: SafetyMeetingGroupDTO.UnFinishedRate})
            ];
            this.meeting.month = data.Month;
        },
        setPitfallData(index) {
            let data = this.pitfall.list[index];
            if (!data) return;
            let list = [
                {
                    name: '一般隐患',
                    value: []
                },
                {
                    name: '重大隐患',
                    value: []
                },
                {
                    name: '已整改',
                    value: []
                },
                {
                    name: '整改中',
                    value: []
                },
                {
                    name: '超期未整改',
                    value: []
                },
            ];
            data.MonthPotentials.forEach(item => {
                list[0].value.push(item.GeneralPotentialCount);
                list[1].value.push(item.MajorPotentialCount);
                list[2].value.push(item.RectifiedCount);
                list[3].value.push(item.UnRectifiedCount);
                list[4].value.push(item.OverdueRectifiedCount);
            });
            this.pitfall.data = list;
            this.pitfall.year = data.Year;
        },
        setRiskData(data) {
            let {
                LowRiskCount, LowRiskRate,
                GeneralRiskCount, GeneralRiskRate,
                GreaterRiskCount, GreaterRiskRate,
                WeightyRiskCount, WeightyRiskRate,
            } = data;
            this.risk = [
                {
                    name: '低风险',
                    value: LowRiskCount,
                    rate: LowRiskRate,
                },
                {
                    name: '一般风险',
                    value: GeneralRiskCount,
                    rate: GeneralRiskRate,
                },
                {
                    name: '较大风险',
                    value: GreaterRiskCount,
                    rate: GreaterRiskRate,
                },
                {
                    name: '重大风险',
                    value: WeightyRiskCount,
                    rate: WeightyRiskRate,
                },
            ]
        }
    }
};
</script>

<style lang="scss" scoped>
.dashboard{
    height: 100%;
    min-height: 650px;
    color: #212844;
}
.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 10.869565217391304% 42.478260869565216% 41.304347826086957%;
    grid-gap: 15px;
    .item-3{
        grid-column-start: 3;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .item-4{
        grid-column-start: 4;
        grid-column-end: 5;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .item-7{
        display: flex;
        grid-column-start: 1;
        grid-column-end: 4;
        .pitfall{
            flex: 1;
            height: 100%;
        }
        .risk{
            border-left: 1px solid #ECEFF1;
            width: 32.95%;
            height: 100%;
        }
    }
}
.bg{
    border-radius: 10px;
    background: #fff;
}
.arrow{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    border: 1px solid #BBC3CB;
    width: 20px;
    height: 20px;
    &::before{
        content: '';
        display: block;
        border-top: 1px solid #BBC3CB;
        border-right: 1px solid #BBC3CB;
        transform: rotate(45deg);
        position: relative;
        left: -2px;
        width: 7px;
        height: 7px;
    }
}
.num{
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .icon{
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        margin-left: 30px;
        margin-right: 25px;
        width: 50px;
        height: 50px;
        background: #13CE66;
        font-size: 28px;
        color: #fff;
        &.icon-2{
            background: #004BFF;
        }
    }
    .text{
        font-size: 28px;
        font-weight: 600;
        line-height: 37px;
        .label{
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            color: #56607D;
            white-space: nowrap;
        }
    }
    .arrow{
        margin-left: auto;
        margin-right: 30px;
    }
}
.tabs{
    .tab{
        display: flex;
        align-items: flex-end;
        height: 50px;
        background: linear-gradient(to bottom, transparent 18%, #fff 100%);
        cursor: pointer;
        .tabbar{
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            height:82%;
            background: #F5F8FC;
            font-size: 14px;
            font-weight: 600;
            transition: all .09s linear;
            &.active{
                border-radius: 10px 10px 0 0;
                height: 100%;
                background: #fff;
                font-size: 16px;
            }
            &.tabbar1{
                border-radius: 10px 0 15px 0;
            }
            &.tabbar2{
                border-radius: 0 10px 0 15px;
            }
        }
    }
    .tab-content{
        position: relative;
        border-radius: 0 0 10px 10px;
        background: #fff;
        height: calc(100% - 50px);
        .echarts-filter{
            position: absolute;
            z-index: 20;
            top: 15px;
            right: 15px;
        }
    }
}
.header{
    padding: 0 18px;
    height: 50px;
    cursor: pointer;
    .title{
        font-size: 16px;
        font-weight: 600;
    }
}
.content{
    height: calc(100% - 50px);
}
.ranking{
    $rinkingOpacity: (
        1: 0.55,
        2: 0.3,
        3: 0.15,
        4: 0.08,
        5: 0.03,
    );
    margin: 0 18px;
    height: calc(100% - 50px);
    &.integral{
        .item{
            grid-template-columns: 60px (70px, 1fr) 80px;
            @for $i from 1 through 5 {
                &:not(.ranking-header):nth-child(#{$i}) {
                    background: rgba(0, 101, 255, map-get($rinkingOpacity, $i));
                }
            }
        }
    }
    .item{
        display: grid;
        grid-template-columns: 60px minmax(90px, 1fr) 70px 70px;
        border-radius: 10px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        @for $i from 1 through 5 {
            &:not(.ranking-header):nth-child(#{$i}) {
                background: rgba(19, 206, 102, map-get($rinkingOpacity, $i));
            }
        }
        &:not(:last-child):not(.ranking-header){
            margin-bottom: 4px;
        }
        &.ranking-header{
            margin-bottom: 0;
            height: 30px;
            color: #959595;
            line-height: 28px;
        }
    }
    .el-scrollbar{
        height: calc(100% - 30px);
        /deep/ .el-scrollbar__wrap{
            overflow-x: hidden;
        }
    }
}
.no-data{
    padding-top: 100px;
    text-align: center;
    color: #999;
    &::before{
        content: '暂无数据'
    }
}
</style>

