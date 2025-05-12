<!-- 饼状图 -->
<template>
    <div class="echart" ref="echartPie"></div>
</template>

<script>
import echarts from "@/plugins/echarts";
const color = [
    '#0065FF',
    '#1EBFA0',
    '#FFC372',
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
            default: 20
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
                    trigger: 'axis'
                },
                legend: {
                    show: true,
                    top: '5%',
                    left: 'center',
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
                    right: '10%',
                    bottom: '20%',
                    left: '10%'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.xAxisData,
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
                        }
                    }
                ],
                series: []
            },
            chart: null
        }
    },
    methods: {
        setOption() {
            if (this.chart) {
                this.option.series = this.getSeries();
                this.chart.setOption(this.option);
            }
        },
        getSeries() {
            let list = [];
            this.value.forEach((item, index) => {
                let obj = {
                    name: item.name,
                    type: 'bar',
                    data: item.value,
                    barWidth: this.barWidth,
                    barGap: 0
                }
                list.push(obj);
            });
            return list;
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