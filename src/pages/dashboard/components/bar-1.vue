<!-- 饼状图 -->
<template>
    <div class="echart" ref="echartPie"></div>
</template>

<script>
import echarts from "@/plugins/echarts";
const color = [
    '#0065FF',
    '#FAD800',
    '#FE912E',
    '#FE3F51'
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
        },
        barWidth: {
            type: Number,
            default: 35
        },
        xAxisData: {
            type: Array,
            default() {
                return []
            }
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
                    trigger: 'axis',
                    formatter: (arr) => {
                        let obj = arr[0];
                        let rate = this.value[obj.dataIndex].rate;
                        let str = `${obj.marker} ${obj.axisValueLabel} ${rate}%`
                        return str;
                    }
                },
                grid: {
                    top: '5%',
                    right: '10%',
                    bottom: '15%',
                    left: '5%'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.xAxisData,
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        show: false,
                        type: 'value',
                        axisLabel: {
                            color: '#C1C1C1',
                            fontSize: 12,
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#F5F5F5'
                            }
                        }
                    }
                ],
                series: [{
                    type: 'bar',
                    colorBy: 'data',
                    data: [],
                    barWidth: this.barWidth,
                    itemStyle: {
                        borderRadius: 6
                    },
                    barGap: 0
                }]
            },
            chart: null
        }
    },
    methods: {
        setOption() {
            if (this.chart) {
                this.option.series[0].data = this.value.map(item => item.value);
                this.chart.setOption(this.option);
            }
        },
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