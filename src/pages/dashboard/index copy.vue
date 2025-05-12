<!-- 公交首页面板 -->
<template>
    <div style="height: 100%;" v-loading="loading">
        <div class="box grid" v-if="info">
            <div class="item small-data cursor-p" @click="navTo('/StatisticalReport?index=1')">
                <div class="icon-content primary">
                    <i class="el-icon-user-solid" style="font-size: 28px"></i>
                </div>
                <div class="f1 f-b-c">
                    <div class="f--b">
                        <div style="font-size: 13px; color: #56607d">
                            全部人员（人）
                        </div>
                        <div
                            style="
                                margin-top: 5px;
                                font-size: 28px;
                                font-weight: bold;
                            "
                        >   
                            <animated-number :value="info.BaseInfo.UserCount" :formatValue="formatValue"></animated-number>
                        </div>
                    </div>
                    <div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
            <div class="item small-data cursor-p" @click="navTo('/StatisticalReport?index=2')">
                <div class="icon-content success">
                    <i class="el-icon-truck" style="font-size: 28px"></i>
                </div>
                <div class="f1 f-b-c">
                    <div class="f--b">
                        <div style="font-size: 13px; color: #56607d">
                            全部车辆（辆）
                        </div>
                        <div
                            style="
                                margin-top: 5px;
                                font-size: 28px;
                                font-weight: bold;
                            "
                        >
                            <animated-number :value="info.BaseInfo.VehicleCount" :formatValue="formatValue"></animated-number>
                        </div>
                    </div>
                    <div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
            <!-- <div class="item small-data">
                <div class="icon-content warning">今日</div>
                <div class="f1 f-a-c">
                    <div>
                        <div style="font-size: 13px; color: #56607d">已出车</div>
                        <div
                            style="
                                margin-top: 12px;
                                font-size: 20px;
                                font-weight: bold;
                            "
                        >
                            <animated-number :value="info.LogbookBaseInfo.FinishedCount" :formatValue="formatValue"></animated-number>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 13px; color: #56607d">未出车</div>
                        <div
                            style="
                                margin-top: 12px;
                                font-size: 20px;
                                font-weight: bold;
                            "
                        >
                            <animated-number :value="info.LogbookBaseInfo.UnFinishedCount" :formatValue="formatValue"></animated-number>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 13px; color: #56607d">异常数</div>
                        <div
                            style="
                                margin-top: 12px;
                                font-size: 20px;
                                font-weight: bold;
                            "
                        >
                            <animated-number :value="info.LogbookBaseInfo.AbnormalCount" :formatValue="formatValue"></animated-number>
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="item item-4 ringking-content">
                <div class="title f-b-c cursor-p" @click="navTo('/Integralist')">
                    <div>积分排名（本月）</div>
                    <div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
                <ul class="ranking">
                    <li class="ranking-header">
                        <div>排名</div>
                        <div>成员</div>
                        <div>积分</div>
                    </li>
                    <el-scrollbar style="height: calc(100% - 63px)">
                        <li v-for="(item, index) in info.IntegralTopInfos" :key="index">
                            <div>{{ index + 1 }}</div>
                            <div>{{ item.Name }}</div>
                            <div>
                                <animated-number :value="item.Score" :formatValue="formatValue"></animated-number>
                            </div>
                        </li>
                    </el-scrollbar>
                </ul>
                <div style="margin-top: 20px;text-align: center;color: #999;" v-if="!info.IntegralTopInfos.length">暂无数据</div>
            </div>
            <div class="item tabar-content mid-data">
                <ul class="tabbar">
                    <li
                        class="tab"
                        :class="{ active: trainTabIndex == 1 }"
                        @click="changeTrainTab(1)"
                    >
                        <span>岗前培训</span>
                    </li>
                    <li
                        class="tab right"
                        :class="{ active: trainTabIndex == 2 }"
                        @click="changeTrainTab(2)"
                    >
                        <span>再教育培训</span>
                    </li>
                </ul>
                <div class="f1 tabbar-content" v-show="trainTabIndex == 1">
                    <!-- 岗前培训 -->
                    <div class="echarts-content f1">
                        <el-dropdown class="echarts-filter" trigger="click" @command="trainFiletr($event, 1)">
                            <span class="cursor-p">{{ currentTrain.Year }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in info.TrainInfos" :key="index" :command="item">{{ item.Year }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <div id="trainData1" style="width: 100%; height: 100%;"></div>
                    </div>
                    <div class="f--c cus-legend">
                        <div>
                            <div>已培训人次</div>
                            <div>
                                <animated-number :value="currentTrain.PreJobTrainDTO.FinishedCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </div>
                        <div>
                            <div>未培训人次</div>
                            <div>
                                <animated-number :value="currentTrain.PreJobTrainDTO.UnFinishedCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="f1 tabbar-content" v-show="trainTabIndex == 2">
                    <!-- 再教育培训 -->
                    <div class="echarts-content f1">
                        <el-dropdown class="echarts-filter" trigger="click" @command="trainFiletr($event, 2)">
                            <span class="cursor-p">{{ currentTrain.Year }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in info.TrainInfos" :key="index" :command="item">{{ item.Year }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <div id="trainData2" style="width: 100%; height: 100%;"></div>
                    </div>
                    <div class="f--c cus-legend">
                        <div>
                            <div>已培训人次</div>
                            <div>
                                <animated-number :value="currentTrain.ReEducationTrainDTO.FinishedCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </div>
                        <div>
                            <div>未培训人次</div>
                            <div>
                                <animated-number :value="currentTrain.ReEducationTrainDTO.UnFinishedCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item tabar-content mid-data">
                <ul class="tabbar">
                    <li
                        class="tab"
                        :class="{ active: safeTabIndex == 1 }"
                        @click="changeSafeTab(1)"
                    >
                        <span>安全例会</span>
                    </li>
                    <li
                        class="tab right"
                        :class="{ active: safeTabIndex == 2 }"
                        @click="changeSafeTab(2)"
                    >
                        <span>安全工作小组例会</span>
                    </li>
                </ul>
                <div class="f1 tabbar-content" v-show="safeTabIndex == 1">
                    <!-- 安全例会 -->
                    <div class="echarts-content f1">
                        <el-dropdown class="echarts-filter" trigger="click" @command="safeFilter($event, 1)">
                            <span class="cursor-p">{{ currentSafety.Year }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in info.SafetyMeetingInfos" :key="index" :command="item">{{ item.Year }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <div id="safeData1" style="width: 100%; height: 100%;"></div>
                    </div>
                    <div class="f--c cus-legend">
                        <div>
                            <div>已培训人次</div>
                            <div>
                                <animated-number :value="currentSafety.SafetyMeetingDTO.FinishedCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </div>
                        <div>
                            <div>未培训人次</div>
                            <div>
                                <animated-number :value="currentSafety.SafetyMeetingDTO.UnFinishedCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="f1 tabbar-content" v-show="safeTabIndex == 2">
                    <!-- 安全工作小组例会 -->
                    <div class="echarts-content f1">
                        <el-dropdown class="echarts-filter" trigger="click" @command="safeFilter($event, 2)">
                            <span class="cursor-p">{{ currentSafety.Year }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in info.SafetyMeetingInfos" :key="index" :command="item">{{ item.Year }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <div id="safeData2" style="width: 100%; height: 100%;"></div>
                    </div>
                    <div class="f--c cus-legend">
                        <div>
                            <div>已培训人次</div>
                            <div>
                                <animated-number :value="currentSafety.SafetyMeetingGroupDTO.FinishedCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </div>
                        <div>
                            <div>未培训人次</div>
                            <div>
                                <animated-number :value="currentSafety.SafetyMeetingGroupDTO.UnFinishedCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item item-6 mid-data ringking-content">
                <div class="title f-b-c cursor-p" @click="navTo('/Logbook')">
                    <div>行车日志（本月）</div>
                    <div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
                <ul class="ranking">
                    <li class="ranking-header">
                        <div>排名</div>
                        <div>车牌</div>
                        <div>检查数</div>
                        <!-- <div>完成率</div> -->
                    </li>
                    <el-scrollbar style="height: calc(100% - 63px)">
                        <li v-for="(item, index) in info.LogbookTopInfos" :key="index">
                            <div>{{ index + 1 }}</div>
                            <div>{{ item.Name }}</div>
                            <div>
                                <animated-number :value="item.InspectionCount" :formatValue="formatValue"></animated-number>
                            </div>
                            <!-- <div>
                                <animated-number :value="item.FinishedRate" :formatValue="formatValue"></animated-number>%
                            </div> -->
                        </li>
                    </el-scrollbar>
                </ul>
                <div style="margin-top: 20px;text-align: center;color: #999;" v-if="!info.LogbookTopInfos.length">暂无数据</div>
            </div>
            <div class="item item-8 bottom-left-data f">
                <div class="left f">
                    <div class="f1" style="padding: 19px 0 0 18px">
                        <div id="pitfallData" style="height: 100%;width: 100%;"></div>
                    </div>
                    <div style="white-space:nowrap;padding: 20px 30px 0 0;">
                        <div style="margin-bottom: 57px;">
                            <el-dropdown trigger="click" @command="pirfallFilter">
                                <span class="cursor-p">{{ currentPitfall.Year }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="(item, index) in info.PotentialInfos" :key="index" :command="item">{{ item.Year }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <ul class="pitfall-list">
                            <li>
                                <div>重大隐患</div>
                                <div>
                                    <animated-number :value="currentPitfall.MajorPotentialCount" :formatValue="formatValue"></animated-number>
                                </div>
                            </li>
                            <li>
                                <div>一般隐患</div>
                                <div>
                                    <animated-number :value="currentPitfall.GeneralPotentialCount" :formatValue="formatValue"></animated-number>
                                </div>
                            </li>
                            <li>
                                <div>已整改</div>
                                <div>
                                    <animated-number :value="currentPitfall.RectifiedCount" :formatValue="formatValue"></animated-number>
                                </div>
                            </li>
                            <li>
                                <div>未整改</div>
                                <div>
                                    <animated-number :value="currentPitfall.UnRectifiedCount" :formatValue="formatValue"></animated-number>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="right">
                    <div class="f-b-c">
                        <div class="title">风险统计</div>
                        <!-- <el-dropdown trigger="click" @command="riskFiletr">
                            <span class="cursor-p">{{ currentRisk.Month }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in info.RiskInfos" :key="index" :command="item">{{ item.Month }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                    </div>
                    <ul class="f risk-content">
                        <li>
                            <div>低风险</div>
                            <div>
                                <animated-number :value="currentRisk.LowRiskCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </li>
                        <li>
                            <div>一般风险</div>
                            <div>
                                <animated-number :value="currentRisk.GeneralRiskCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </li>
                        <li>
                            <div>较大风险</div>
                            <div>
                                <animated-number :value="currentRisk.GreaterRiskCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </li>
                        <li>
                            <div>重大风险</div>
                            <div>
                                <animated-number :value="currentRisk.WeightyRiskCount" :formatValue="formatValue"></animated-number>
                            </div>
                        </li>
                    </ul>
                    <div class="f1">
                        <div id="riskData" style="width: 100%;height: 100%;"></div>
                    </div>
                </div>
            </div>
            <div class="item bottom-right-data">
                <div class="title f-b-c cursor-p">
                    <div>证件预警</div>
                    <!-- <div>
                        <i class="el-icon-arrow-right"></i>
                    </div> -->
                </div>
                <div class="f1">
                    <div id="certData" style="width: 100%;height: 100%;"></div>
                </div>
                <ul class="cert-content">
                    <li>
                        <div>车辆证件过期</div>
                        <div>
                            <animated-number :value="info.ExpirationInfo.VehicleExpirationCount" :formatValue="formatValue"></animated-number>
                        </div>
                    </li>
                    <li>
                        <div>企业资质过期</div>
                        <div>
                            <animated-number :value="info.ExpirationInfo.EnterpriseExpirationCount" :formatValue="formatValue"></animated-number>
                        </div>
                    </li>
                    <li>
                        <div>人员证件过期</div>
                        <div>
                            <animated-number :value="info.ExpirationInfo.UserExpirationCount" :formatValue="formatValue"></animated-number>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import echarts from "@/plugins/echarts";
import AnimatedNumber from 'animated-number-vue';
import * as theme from '@/assets/styles/theme.scss';
function drawPie(dom, name) {
    let chart = echarts.init(dom);
    let option = {
        tooltip: {
            trigger: "item",
        },
        legend: {
            show: true,
            left: 5,
            icon: "rect",
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                fontSize: 14,
                padding: [1, 1, 1, 7],
            },
        },
        color: [theme.colorPrimary, theme.colorInfo],
        title: {
            text: "30%",
            left: "center",
            top: "43%",
            textStyle: {
                color: "#212844",
                fontSize: 24,
                fontWeight: "600",
            },
        },
        //饼图中间显示文字
        graphic: {
            type: "text",
            left: "center",
            top: "57%",
            zlevel: 100,
            style: {
                text: "完成率", //文字内容
                fontSize: 12, //文字字号
                fontWeight: "800",
                fill: "#56607D",
            },
        },
        series: [
            {
                name: name,
                type: "pie",
                radius: ["45%", "70%"],
                y: 10,
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: "center",
                },
                itemStyle: {
                    borderWidth: 3, //设置border的宽度有多大
                    borderColor: "#fff",
                },
                emphasis: {
                    scaleSize: 10,
                },
                labelLine: {
                    show: false,
                },
                data: [
                    { value: 69.3, name: "已完成" },
                    { value: 30.7, name: "未完成" },
                ],
            },
        ],
    };

    chart.setOption(option);
    return {
        chart,
        option
    }
}
function drawLine(dom) {
    let chart = echarts.init(dom);
    let option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: (new Array(12)).fill().map((item, index) => index + 1 + '月'),
            axisLabel: {
                show: true,
            },
            nameTextStyle: {
                color: '#C1C1C1'
            },
        },
        yAxis: {
            type: 'value'
        },
        grid: {
            bottom: 40,
        },
        tooltip: {
            trigger: 'item'
        },
        title: {
            text: "隐患情况",
            left: 0,
            top: 0,
            textStyle: {
                color: "#212844",
                fontSize: 16,
                fontWeight: "600",
            },
        },
        legend: {
            show: true,
            left: 99,
            icon: "circle",
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                fontSize: 14,
                padding: [1, 1, 1, 7],
            },
        },
        color: [theme.colorDanger, theme.colorWarning, theme.colorInfo, theme.colorPrimary],
        series: [
            {
                name: '重大隐患',
                data: [3,3,56,41,46,213,523,14,34,1,25,87],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color:'#FE3F51',
                    opacity: 0.3,
                    origin:"start"
                }
            },
            {
                name: '一般隐患',
                data: [2,34,5,321,4,21,5,444,3,32,23,5],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color:'#FFA500',
                    opacity: 0.3,
                    origin:"start"
                }
            },
            {
                name: '已整改',
                data: [21,134,35,31,48,1,58,44,3,372,203,15],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color:'#0065FF',
                    opacity: 0.3,
                    origin:"start"
                }
            },
            {
                name: '未整改',
                data: [24,34,54,1,45,21,5,14,23,62,13,52],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color:'#13CE66',
                    opacity: 0.3,
                    origin:"start"
                }
            },
        ]
    };
    chart.setOption(option);
    return {
        chart,
        option
    }
}
function drawBar(dom) {
    let chart = echarts.init(dom);
    let option = {
        xAxis: {
            type: 'category',
            data: ['低风险', '一般风险', '较大风险', '重大风险'],
            show: true,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    fontSize: 10
                }
            },

        },
        yAxis: {
            type: 'value',
            show: false
        },
        grid: {
            bottom: 20,
        },
        tooltip: {
            trigger: 'item'
        },
        color: ['#004BFF'],
        series: [
            {
                data: [10, 2, 5, 10],
                type: 'bar',
                itemStyle: {
                    normal: {
                        barBorderRadius: [10, 10, 10, 10]
                    },
                }
            }
        ]
    };
    chart.setOption(option);
    return {
        chart,
        option
    }
}
function drawPieMore(dom) {
    let chart = echarts.init(dom);
    let colors = [theme.colorPrimary, theme.colorInfo, theme.colorWarning];
    let option = {
        color: colors,
        tooltip: {
            trigger: 'item'
        },
        legend: {
            show: true,
            orient: 'vertical',
            right: 0,
            top: 'middle',
            data: ['车辆证件', '企业资质', '人员证件'],
            itemWidth: 12,
            itemHeight: 6,
            itemGap: 22,
            borderRadius: 8,
            textStyle: {
                fontSize: 13,
                color: '#56607D'
            }
        },
        grid: {
            left: 0
        },
        series: [
            {
                name: '车辆证件',
                type: 'pie',
                clockWise: true, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [100, 113],
                center: ['38%', '50%'],
                label: {
                    show: false
                },
                data: [
                    {
                        name: '已过期',
                        value: 4,
                        itemStyle: {
                            color: colors[0],
                            borderWidth: 13,
                            borderRadius: 20
                        }
                    },
                    {
                        name: '未过期',
                        value: 5,
                        itemStyle: {
                            color: '#F2F2F2',
                        }
                    }
                ]
            },
            {
                name: '企业资质',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                startAngle: 90,
                radius: [80, 94],
                center: ['38%', '50%'],
                label: {
                    show: false
                },
                data: [
                    {
                        name: '已过期',
                        value: 3,
                        itemStyle: {
                            color: colors[1],
                            borderRadius: 20
                        }
                    },
                    {
                        name: '未过期',
                        value: 4,
                        itemStyle: {
                            color: '#F2F2F2',
                        }
                    }
                ]
            },
            {
                name: '人员证件',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                startAngle: 90,
                radius: [60, 74],
                center: ['38%', '50%'],
                label: {
                    show: false
                },
                data: [
                    {
                        name: '已过期',
                        value: 4,
                        itemStyle: {
                            color: colors[2],
                            borderRadius: 20
                        }
                    },
                    {
                        name: '未过期',
                        value: 7,
                        itemStyle: {
                            color: '#F2F2F2',
                        }
                    }
                ]
            }
        ]
    };
    chart.setOption(option);
    return {
        chart,
        option
    }
}
let chartResizeFlag = false;
export default {
    name: "Dashboard",
    components: {
        AnimatedNumber
    },
    mixins: [request_mixin],

    data() {
        return {
            trainTabIndex: 1, // 培训 tab
            safeTabIndex: 1, // 安全 tab
            midChartsList: [],
            chartsList: [],
            info: null,
            loading: false,
            currentTrain: null, // 选中年份的培训
            currentSafety: null, // 选中月份的安全例会
            currentRisk: null, // 选中月份的风险
            currentPitfall: null, // 选中年份的隐患
            trainEcharts: null, // 岗前培训 echarts
            reEduTrainEcharts: null, // 再教育培训 echars
            safeMeetEcharts: null, // 安全例会 echarts
            safeGroupMeetEcharts: null, // 安全工作小组例会 echarts
            pitfallEcharts: null, // 隐患 echarts
            riskEcharts: null, // 风险 echarts
            certEcharts: null, // 证件预警 echarts
        };
    },
    computed: {},
    methods: {
        formatValue(num) {
            return parseInt(num)
        },
        changeTrainTab(index) {
            this.trainTabIndex = index;
            this.$nextTick(() => {
                this.midChartsList.forEach(item => {
                    item.chart.resize();
                })
            })
        },
        changeSafeTab(index) {
            this.safeTabIndex = index;
            this.$nextTick(() => {
                this.midChartsList.forEach(item => {
                    item.chart.resize();
                })
            })
        },
        navTo(url) {
            this.$router.push(url)
            this.$parent.selectmenu(url)
        },
        // 培训筛选
        trainFiletr(val, flag) {
            this.currentTrain = val;
            if (flag == 1) {
                this.setTrainEchartData();
            } else {
                this.setReEduTrainEchartsData();
            }
        },
        // 例会
        safeFilter(val, flag) {
            this.currentSafety = val;
            if (flag == 1) {
                this.setSafeMeetEcharts();
            } else {
                this.setSafeGroupMeetEchartsData();
            }
        },
        // 风险
        riskFiletr(val) {
            this.currentRisk = val;
            this.setRiskEchartsData();
        },
        // 隐患
        pirfallFilter(val) {
            this.currentPitfall = val;
            this.setPitfallEchartsData();
        },
        setTrainEchartData() {
            this.trainEcharts.option.title.text = this.currentTrain.PreJobTrainDTO.FinishedRate + '%';
            this.trainEcharts.option.series[0].data = [
                { value: this.currentTrain.PreJobTrainDTO.FinishedCount, name: "已完成" },
                { value: this.currentTrain.PreJobTrainDTO.UnFinishedCount, name: "未完成" },
            ]
            this.trainEcharts.chart.setOption(this.trainEcharts.option)
        },
        setReEduTrainEchartsData() {
            this.reEduTrainEcharts.option.title.text = this.currentTrain.ReEducationTrainDTO.FinishedRate + '%';
            this.reEduTrainEcharts.option.series[0].data = [
                { value: this.currentTrain.ReEducationTrainDTO.FinishedCount, name: "已完成" },
                { value: this.currentTrain.ReEducationTrainDTO.UnFinishedCount, name: "未完成" },
            ]
            this.reEduTrainEcharts.chart.setOption(this.reEduTrainEcharts.option)
        },
        setSafeMeetEcharts(){
            this.safeMeetEcharts.option.title.text = this.currentSafety.SafetyMeetingDTO.FinishedRate + '%';
            this.safeMeetEcharts.option.series[0].data = [
                { value: this.currentSafety.SafetyMeetingDTO.FinishedCount, name: "已完成" },
                { value: this.currentSafety.SafetyMeetingDTO.UnFinishedCount, name: "未完成" },
            ]
            this.safeMeetEcharts.chart.setOption(this.safeMeetEcharts.option)
        },
        setSafeGroupMeetEchartsData(){
            this.safeGroupMeetEcharts.option.title.text = this.currentSafety.SafetyMeetingGroupDTO.FinishedRate + '%';
            this.safeGroupMeetEcharts.option.series[0].data = [
                { value: this.currentSafety.SafetyMeetingGroupDTO.FinishedCount, name: "已完成" },
                { value: this.currentSafety.SafetyMeetingGroupDTO.UnFinishedCount, name: "未完成" },
            ]
            this.safeGroupMeetEcharts.chart.setOption(this.safeGroupMeetEcharts.option)
        },
        setPitfallEchartsData(){
            let obj = {};
            this.currentPitfall.MonthPotentials.forEach(item => {
                for (let key in item) {
                    if (key != 'Month') {
                        if (obj[key]) {
                            obj[key].push(item[key])
                        } else {
                            obj[key] = [item[key]];
                        }
                    }
                }
            })
            let arr = ['MajorPotentialCount', 'GeneralPotentialCount', 'RectifiedCount', 'UnRectifiedCount'];
            arr.forEach((item, index) => {
                this.pitfallEcharts.option.series[index].data = obj[item];
            });
            this.pitfallEcharts.chart.setOption(this.pitfallEcharts.option)
        },
        setRiskEchartsData(){
            let { LowRiskCount, GeneralRiskCount, GreaterRiskCount, WeightyRiskCount } = this.currentRisk;
            this.riskEcharts.option.series[0].data = [LowRiskCount, GeneralRiskCount, GreaterRiskCount, WeightyRiskCount];
            this.riskEcharts.chart.setOption(this.riskEcharts.option);
        },
        setCertEchartsData(){
            /* 
                key1 总数
                key2 过期数
                key3 过期比例
            */
            let arr = [{
                // 车辆
                key1: 'VehicleExpirationTotalCount',
                key2: 'VehicleExpirationCount',
                key3: 'VehicleExpirationRate'
            }, {
                // 企业
                key1: 'EnterpriseExpirationTotalCount',
                key2: 'EnterpriseExpirationCount',
                key3: 'EnterpriseExpirationRate'
            }, {
                // 人员
                key1: 'UserExpirationTotalCount',
                key2: 'UserExpirationCount',
                key3: 'UserExpirationRate'
            }];
            arr.forEach((item, index) => {
                let val1 = this.info.ExpirationInfo[item.key1];
                let val2 = this.info.ExpirationInfo[item.key2];
                let val3 = this.info.ExpirationInfo[item.key3];
                this.certEcharts.option.series[index].data[0].value = val2; // 过期数
                this.certEcharts.option.series[index].data[1].value = val1 - val2; // 未过期数
            });
            this.certEcharts.chart.setOption(this.certEcharts.option);
        },
    },
    async created() {
        this.loading = true;
        this.info = await this.Get('/GetEnterprisesHomeInfo').then(res => res.data);
        this.loading = false;
        this.currentTrain = this.info.TrainInfos[0] || {
            PreJobTrainDTO: {UnFinishedCount: '', FinishedCount: ''},
            ReEducationTrainDTO: {UnFinishedCount: '', FinishedCount: ''},
        };
        this.currentSafety = this.info.SafetyMeetingInfos[0] || {};
        this.currentRisk = this.info.RiskInfos || {};
        this.currentPitfall = this.info.PotentialInfos[0] || {};
        this.$nextTick(() => {
            setTimeout(() => {
                if (this.$el.nodeName != '#comment') {
                    this.midChartsList.push(...[
                        this.trainEcharts = drawPie(document.getElementById("trainData1"), "岗前培训"),
                        this.safeMeetEcharts = drawPie(document.getElementById("safeData1"), "安全例会"),
                        this.reEduTrainEcharts = drawPie(document.getElementById("trainData2"), '再教育培训'),
                        this.safeGroupMeetEcharts = drawPie(document.getElementById("safeData2"), '安全工作小组例会')
                    ]);
                    this.chartsList.push(...[
                        this.pitfallEcharts = drawLine(document.getElementById('pitfallData')),
                        this.riskEcharts = drawBar(document.getElementById('riskData')),
                        this.certEcharts = drawPieMore(document.getElementById('certData'))
                    ]);
                    this.setTrainEchartData();
                    this.setReEduTrainEchartsData();
                    this.setSafeMeetEcharts();
                    this.setSafeGroupMeetEchartsData();
                    this.setPitfallEchartsData();
                    this.setRiskEchartsData();
                    this.setCertEchartsData();
                    if (!chartResizeFlag) {
                        chartResizeFlag = true;
                        window.onresize = () => {
                            if (this.$route.path === '/dashboard') {
                                this.midChartsList.forEach(item => {
                                    item.chart.resize();
                                });
                                this.chartsList.forEach(item => {
                                    item.chart.resize();
                                })
                            }
                        }
                    }
                }
            }, 300);
        })
    }
};
</script>

<style lang="scss" scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 10.33% 41.31% 1fr;
    grid-gap: 20px;
    .item-4 {
        grid-column-start: 4;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .item-6{
        grid-column-start: 3;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .item-8 {
        grid-column-start: 1;
        grid-column-end: 4;
    }
}
.box {
    height: calc(100vh - 195px);
    min-height: 888px;
    width: 100%;
    color: #212844;
    .item {
        border-radius: 10px;
        background: #fff;
        &.small-data {
            display: flex;
            align-items: center;
            padding: 0 30px;
            .icon-content {
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 15px;
                margin-right: 25px;
                width: 50px;
                height: 50px;
                color: #fff;
                font-size: 18px;
                &.primary {
                    background: #004bff;
                }
                &.success {
                    background: #13ce66;
                }
                &.warning {
                    background: #fe912e;
                    font-weight: bold;
                }
            }
        }
        
        $rinkingOpacity: (
            1: 0.55,
            2: 0.3,
            3: 0.15,
            4: 0.08,
            5: 0.03,
        );
        &.ringking-content {
            padding: 19px 18px 12px;
            .title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 6px;
                i {
                    font-size: 14px;
                }
            }
            .ranking {
                li {
                    display: grid;
                    grid-template-columns: 96px 178px 76px;
                    border-radius: 10px;
                    overflow: hidden;
                    padding: 8px 0;
                    &:first-child {
                        >div:first-child{
                            padding-left: 16px;
                        }
                    }
                    &.ranking-header {
                        color: #81899e;
                        >div:first-child{
                            padding-left: 16px;
                        }
                    }
                    &:not(.ranking-header):nth-child(1) {
                        color: #fff;
                    }
                    &:not(.ranking-header) {
                        position: relative;
                        z-index: 9;
                        margin-top: 4px;
                        & > div {
                            position: relative;
                            z-index: 2;
                            &:first-child {
                                padding-left: 25px;
                                font-weight: bold;
                            }
                        }
                        &::before {
                            content: "";
                            position: absolute;
                            z-index: 1;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            left: 0;
                        }
                    }
                    &:not(:first-child):not(:nth-child(2)) {
                        color: #212844;
                    }
                    @for $i from 1 through 5 {
                        &:nth-child(#{$i}) {
                            &::before {
                                background: #0065ff;
                                opacity: map-get($rinkingOpacity, $i);
                            }
                        }
                    }
                }
            }
        }
        &.mid-data {
            .ranking{
                li{
                    grid-template-columns: 58px 112px 89px 63px;
                    @for $i from 1 through 5 {
                        &:nth-child(#{$i}) {
                            &::before {
                                background: #13CE66;
                                opacity: map-get($rinkingOpacity, $i);
                            }
                        }
                    }
                }
            }
            &.tabar-content {
                display: flex;
                flex-direction: column;
                background: transparent;
                .tabbar {
                    display: flex;
                    align-items: flex-end;
                    height: 50px;
                    li {
                        $background: #f5f8fc;
                        $activeBackground: #fff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        border-radius: 10px 10px 0 0;
                        width: 50%;
                        height: 41px;
                        background: $background;
                        transition: all 0.03s linear;
                        cursor: pointer;
                        &::before {
                            display: none;
                            width: 15px;
                            height: 15px;
                            background: $activeBackground;
                        }
                        &::after{
                            display: none;
                            border-radius: 30px;
                            width: 30px;
                            height: 30px;
                            background: $background;
                        }
                        &.active {
                            height: 50px;
                            background: $activeBackground;
                            ~ li::before {
                                display: block;
                                left: 0;
                            }
                            ~ li::after {
                                display: block;
                                left: 0;
                            }
                        }
                        &:first-child:not(.active) {
                            &::before {
                                display: block;
                                right: 0;
                            }
                            &::after {
                                display: block;
                                right: 0;
                            }
                        }
                        &::before,
                        &::after {
                            content: "";
                            position: absolute;
                            z-index: 10;
                            bottom: 0;
                        }
                        *:not(&::before):not(&::after){
                            position: relative;
                            z-index: 15;
                        }
                    }
                }
                .tabbar-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    border-radius: 0 0 10px 10px;
                    padding: 21px 30px 24px;
                    background: #fff;
                    .cus-legend{
                        justify-content: center;
                        >div{
                            position: relative;
                            padding-left: 24px;
                            font-size: 13px;
                            color: #56607D;
                            &::before{
                                content: '';
                                position: absolute;
                                top: 6px;
                                left: 0;
                                border-radius: 6px;
                                width: 12px;
                                height: 6px;
                                background: #1EBFA0;
                            }
                            &:last-child::before{
                                background: #3766F4;
                            }
                            &:last-child{
                                margin-left: 10%;
                            }
                            div:last-child{
                                margin-top: 5px;
                                font-size: 21px;
                                font-weight: 600;
                                line-height: 28px;
                            }
                        }
                    }
                }
            }
        }
        &.bottom-left-data{
            .left, .right{
                height: 100%;
            }
            .left{
                flex: 1;
                >div{
                    height: 100%;
                }
                .pitfall-list{
                    li{
                        font-size: 12px;
                        color: #56607D;
                        &:not(:last-child){
                            margin-bottom: 20px;
                        }
                        div:last-child{
                            margin-top: 1px;
                            font-size: 18px;
                            color: #212844;
                            line-height: 24px;
                        }
                    }
                }
            }
            .right{
                display: flex;
                flex-direction: column;
                border-left: 1px solid #ECEFF1;
                padding: 20px 30px 20px 18px;
                width: 32.94%;
                min-width: 350px;
                .title{
                    padding-left: 12px;
                    font-size: 16px;
                    font-weight: 600;
                }
                .risk-content{
                    margin-top: 37px;;
                    padding: 20px 22px;
                    border-radius: 10px;
                    background: #F5F8FC;
                    white-space: nowrap;
                    li{
                        width: 25%;
                        font-size: 12px; 
                        div:last-child{
                            margin-top: 2px;
                            font-size: 16px;
                            color: #212844;
                            font-weight: 600;
                            line-height: 22px;
                        }
                    }
                }
            }
        }
        &.bottom-right-data{
            display: flex;
            flex-direction: column;
            padding: 18px 18px 36px;
            .title{
                font-size: 16px;
                font-weight: 600;
            }
            .cert-content{
                display: flex;
                padding-left: 12px;
                li{
                    width: 33.33%;
                    color: #56607D;
                    font-size: 13px;
                    div:last-child{
                        margin-top: 5px;
                        font-size: 21px;
                        line-height: 28px;
                        font-weight: 600;
                        color: #212844;
                    }
                }
            }
        }
        .echarts-content{
            position: relative;
            .echarts-filter{
                position: absolute;
                top: 2px;
                right: -15px;
                z-index: 20;
            }   
        }
    }
}
</style>

