<template>
    <div class="echart" ref="echartPie"></div>
</template>

<script>
import echarts from "@/plugins/echarts";
const color = [
    '#33D0BD',
    '#5292FF',
    '#7585E5',
    '#84B7F9',
    '#FE706E',
    '#FFC372',
    '#7585E5',
    '#FFC372',
    '#33D0BD',
    '#5292FF',
    '#88CA8C',
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
        size: {
            type: [Array, String],
            default() {
                return [0, '75%']
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        labelFormat: {
            type: Function,
            default: (e) => {
                return `${e.data.rate}%`
            },
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
    data() {
        return {
            option: {
                color: this.color,
                tooltip: {
                    trigger: 'item'
                },
                legend: [],
                series: [{
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: this.size,
                    radius: [50, 80],
                    data: [],
                    label: {
                        formatter: this.labelFormat,
                    },
                }],
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
        legend() {
            let list = [];
            let data = [];
            let showNum = 5;
            let i = Math.ceil(this.value.length / showNum) - 1;
            this.value.forEach((item, index) => {
                data.push(item[this.prop.name]);
                if ((index + 1) % showNum === 0 || index === this.value.length - 1) {
                    let obj = {
                        show: true,
                        top: 62,
                        right: 120 * i + 58,
                        icon: "rect",
                        orient: 'vertical',
                        itemGap: 18,
                        itemWidth: 8,
                        itemHeight: 8,
                        textStyle: {
                            fontSize: 14,
                            padding: [1, 1, 1, 7],
                        },
                        data: data
                    };
                    list.push(obj);
                    data = [];
                    i--;
                }
            });
            return list;
        },
        setOption() {
            if (this.chart) {
                if (this.value && this.value.length) {
                    this.option.series[0].data = this.value;
                    this.option.legend = this.legend();
                }
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