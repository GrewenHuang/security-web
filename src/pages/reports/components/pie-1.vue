<template>
    <div class="echart" ref="echartPie"></div>
</template>

<script>
import echarts from "@/plugins/echarts";
const color = [
    '#004BFF',
    '#FFBF00',
    '#00BC87',
    '#655BFB',
    '#FE9500',
    '#BD58FE',
    '#1BA5FF',
    '#67D200',
    '#F74F8E',
    '#959595',
    '#FE9500',
    '#BD58FE',
    '#1BA5FF',
    '#FFBF00',
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
        inner: {
            type: [Number, String],
            default: 50
        },
        loading: {
            type: Boolean,
            default: false
        },
        legendGap: {
            type: Number,
            default: 12
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
                    trigger: 'item'
                },
                legend: {
                    show: true,
                    bottom: 10,
                    left: 'center',
                    icon: "rect",
                    type: 'scroll',
                    itemGap: this.legendGap,
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        fontSize: 14,
                        padding: [1, 1, 1, 7],
                    },
                    pageIconColor: '#ccc',
                    pageIconInactiveColor: '#ddd',
                    pageTextStyle: {
                        color: '#aaa'
                    }
                },
                series: [{
                    type: 'pie',
                    center: ['50%', '40%'],
                    radius: [this.inner, '60%'],
                    data: [],
                    label: {
                        formatter: (e) => {
                            return `${e.data.rate}%`
                        }
                    },
                }]
            },
            chart: null
        }
    },
    methods: {
        setOption() {
            if (this.chart) {
                this.option.series[0].data = this.value;
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
