<!-- 饼状图 -->
<template>
    <div class="echart" ref="echartPie"></div>
</template>

<script>
import echarts from "@/plugins/echarts";
const color = [
    '#0065FF',
    '#1EBFA0',
];
export default {
    props: {
        value: Array,
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
    computed: {
        formatValue() {
            if (!this.value || !this.value.length) return [];
            return this.value.map(item => ({
                name: item.Name || item.name,
                value: item.Value || item.Count || item.value || 0,
                rate: item.Rate || item.rate || 0
            }))
        },
        completeRate() {
            let completeRate = (this.formatValue.filter(item => {
                    return item.name.indexOf('已') >= -1
                })[0] || {}).rate || 0;
            return completeRate;
        }
    },
    data() {
        return {
            option: {
                color: this.color,
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: true,
                    left: 'center',
                    bottom: '10%',
                    icon: "circle",
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        fontSize: 14,
                        padding: [1, 1, 1, 7],
                    },
                },
                title: {
                    text: "30%",
                    left: "center",
                    top: "32%",
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
                    top: "46%",
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
                        type: "pie",
                        center: ['50%', '40%'],
                        radius: ["50%", "80%"],
                        top: 0,
                        left: 'center',
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: "center",
                        },
                        itemStyle: {
                            borderWidth: 0, //设置border的宽度有多大
                            borderColor: "#fff",
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [],
                    },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            chart: null
        }
    },
    methods: {
        setOption() {
            if (this.chart) {
                this.option.series[0].data = this.formatValue;
                this.option.title.text = `${this.completeRate}%`;
                this.chart.clear();
                this.chart.setOption(this.option);
            }
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