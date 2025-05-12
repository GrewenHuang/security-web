<template>
    <div class="echart-broken-line">
        <div ref="chart" style="width: 100%;height: 100%;"></div>
    </div>
</template>

<script>
import echarts from "@/plugins/echarts";
let monthList =[];
for (let i = 1; i < 13; i++) {
    monthList.push(i + '月');
}

let series = [];
function random(x = 1000) {
    return Math.round(Math.random()*x);
}
function mockData() {
    let list = [];
    for (let i = 0; i < 13; i++) {
        list.push(random());
    }
    return list
}
let dataList = [
    {
        name: '低风险区',
        data: mockData(),
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
            [
                {
                    offset: 0,
                    color: 'rgba(55, 100, 255, .8)',
                },
                {
                    offset: 1,
                    color: 'rgba(55, 100, 255,0)',
                },
            ],
            false
        )
    },
    {
        name: '一般风险',
        data: mockData(),
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
            [
                {
                    offset: 0,
                    color: 'rgba(250, 230, 0, .8)',
                },
                {
                    offset: 1,
                    color: 'rgba(250, 230, 0, 0)',
                },
            ],
            false
        )
    },
    {
        name: '较大风险',
        data: mockData(),
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
            [
                {
                    offset: 0,
                    color: 'rgba(240, 150, 20, .8)',
                },
                {
                    offset: 1,
                    color: 'rgba(240, 150, 20, 0)',
                },
            ],
            false
        )
    },
    {
        name: '重大风险',
        data: mockData(),
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
            [
                {
                    offset: 0,
                    color: 'rgba(220, 40, 40, .8)',
                },
                {
                    offset: 1,
                    color: 'rgba(220, 40, 40, 0)',
                },
            ],
            false
        )
    },
];
dataList.forEach((item, index) => {
    series.push({
        type: 'line',
        name: item.name,
        showSymbol: false,
        data: item.data,
        lineStyle: {
            color: 'transparent'
        },
        areaStyle: {
            normal: {
                color: item.color,
            },
        },
    })
})
let option = {
    tooltip: {
        trigger: 'axis',
    },
    color:['#3764FF','#FAE600', '#F09614', '#DC2828'],
    legend: {
        x: 'left',
        top: '8%',
        left:'4%',
        icon: "roundRect",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
            color: '#68a9ff',
            fontSize: 14,
            padding:[0,8,0,8]
        }
    },
    grid: {
        top: '30%',
        left: '12%',
        right: '3%',
        bottom: '13%',
    },
    xAxis: [
        {
            type: 'category',
            axisLabel: {
                color: '#6292C8',
                margin: 25
            },
            axisTick:{
                show:false // 不显示坐标轴刻度线
            },
            axisLine: {
                show: false, // 不显示坐标轴线
            },
            splitLine:{
                show:false // 不显示网格线
            },
            boundaryGap: false,
            data: monthList,
        },
    ],

    yAxis: [
        {
            type: 'value',
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: true,
                margin: 26,
                textStyle: {
                    color: '#6292C8',
                },
            },
        },
    ],
    series: series,
};

export default {
    props: {

    },
    data() {
        return {}
    },
    methods: {
        createEchart() {

        }
    },
    mounted() {
        this.$nextTick(() => {
            let chart = echarts.init(this.$refs.chart);
            chart.setOption(option);
			window.addEventListener("resize", function () {
			    chart.resize();
			});
        });
    },
}
</script>

<style lang="scss" scoped>
    .echart-broken-line{
        width: 100%;
        height: 100%;
    }
</style>