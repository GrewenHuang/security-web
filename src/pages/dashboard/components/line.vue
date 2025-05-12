<!-- 饼状图 -->
<template>
    <div class="echart" ref="echartPie"></div>
</template>

<script>
import echarts from "@/plugins/echarts";
const color = [
    '#004BFF',
    '#FE3F51',
    '#13CE66',
    '#FAD800',
    '#FE912E',
];
export default {
    props: {
        value: Array,
        prop: {
            type: Object,
            default() {
                return {
                    name: 'name',
                    value: 'value'
                }
            }
        },
        color: {
            type: Array,
            default() {
                return color;
            }
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value: {
            deep: true,
            handler() {
                this.setOption();
            }
        },
        loading(val) {
            if (this.chart) {
                if (val) {
                    this.chart.showLoading({
                        text: '数据加载中'
                    });
                } else {
                    this.chart.hideLoading();
                }
            }
        }
    },
    data() {
        return {
            option: {
                color: this.color,
                tooltip: {
                    axisPointer: {
                        type: 'shadow'
                    },
                    trigger: 'axis'
                },
                legend: {
                    show: true,
                    top: '5%',
                    left: '3%',
                    icon: "circle",
                    itemGap: 18,
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        fontSize: 14,
                        color: '#181B3B',
                        padding: [1, 1, 1, 7],
                    }
                },
                grid: {
                    top: '20%',
                    right: '5%',
                    bottom: '10%',
                    left: '8%'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: (() => {
                            let list = new Array(12).fill('').map((item, index) => {
                                return index + 1 + '月'
                            });
                            return list;
                        })(),
                        show: true,
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            color: '#C1C1C1',
                            fontSize: 12,
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#F5F5F5'
                            }
                        },
                    }
                ],
                series: [
                    {
                        name: '一般隐患',
                        data: [],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            color: this.color[0],
                            opacity: 0.3,
                            origin:"start"
                        }
                    },
                    {
                        name: '重大隐患',
                        data: [],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            color: this.color[1],
                            opacity: 0.3,
                            origin:"start"
                        }
                    },
                    {
                        name: '已整改',
                        data: [],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            color: this.color[2],
                            opacity: 0.3,
                            origin:"start"
                        }
                    },
                    {
                        name: '整改中',
                        data: [],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            color: this.color[3],
                            opacity: 0.3,
                            origin:"start"
                        }
                    },
                    {
                        name: '超期未整改',
                        data: [],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            color: this.color[4],
                            opacity: 0.3,
                            origin:"start"
                        }
                    },
                ],
            },
            chart: null
        }
    },
    methods: {
        setOption() {
            if (this.chart) {
                this.setSeries();
                this.chart.setOption(this.option);
            }
        },
        setSeries() {
            this.value.forEach((item, index) => {
                this.option.series[index].data = item.value;
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                if (this.$refs.echartPie) {
                    this.chart = echarts.init(this.$refs.echartPie);
                    this.setOption();
                }
            }, 100);
        })
        window.addEventListener('resize', () => {
            if (this.chart) {
                this.chart.resize();
            }
        })
    }
}
</script>

<style scoped>
    .echart{
        width: 100%;
        height: 100%;
    }
</style>