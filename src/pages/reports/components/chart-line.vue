<template>
    <div class="echart" ref="echartPie"></div>
</template>

<script>
import echarts from "@/plugins/echarts";
const color = [
    '#5292FF',
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
                    show: false,
                    top: '5%',
                    left: '3%',
                    icon: "rect",
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
                    top: '10%',
                    right: '5%',
                    bottom: '25%',
                    left: '5%'
                },
                dataZoom: [
                    {
                        type: 'inside'
                    },{
                        bottom: 10
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        data: [],
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
                series: []
            },
            chart: null
        }
    },
    methods: {
        setOption() {
            if (this.chart) {
                this.option.series = this.getSeries();
                this.option.xAxis[0].data = this.value ? this.value.map(item => item.name) : []
                this.chart.setOption(this.option);
            }
        },
        getSeries() {
            let obj = {
                type: 'line',
                data: this.value ? this.value.map(item => item.value) : [],
            }
            return obj;
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