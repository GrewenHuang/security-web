<template>
  <div class="echart-broken-line">
    <div ref="chart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import echarts from "@/plugins/echarts";
import { autoToolTip } from "./echarts_auto_tooltip.js";
export default {
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.setOption();
      },
    },
  },
  methods: {
    setOption() {
      let series = [];
      let json = this.value;
      let content = json.reduce((sum, item) => sum + item.value, 0) || 0;
      let option = {
        title: {
          // 圆环中央文字
          show: true, // 是否显示
          text: "" + content,
          subtext: "总数",
          textStyle: {
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
          },
          subtextStyle: {
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
          },
          textAlign: "center",
          left: "35%",
          top: "38%",
        },
        tooltip: {
          trigger: "item",
        },
        tooltip: {
          trigger: "item",
        },
        color: [
          "#68EBED",
          "#858DC8",
          "#0f2a4b",
          "#B5BCE7",
          "#c75458",
          "#F7FA70",
          "#2CC4E4",
          "#4a9acf",
          "#cfa458",
          "#4A80E5",
        ],
        legend: {
          show: true,
          type: "scroll",
          orient: "vertical",
          icon: "circle",
          // bottom: 'bottom',
          itemWidth: 7, // 图例标记的图形宽度。
          itemGap: 20, // 图例每项之间的间隔。
          itemHeight: 7, //  图例标记的图形高度。
          right: "4%",
          // top: "5%",
          bottom: "25%",
          pageIconSize: 10,
          pageIconColor: "#ccc",
          pageIconInactiveColor: "#ddd",
          pageTextStyle: {
            color: "#aaa",
          },
          // x: '70%',
          // y: '10%',
          textStyle: {
            color: "#fff",
            rich: {
              icon: {
                color: [
                  "#68EBED",
                  "#858DC8",
                  "#cfa458",
                  "#B5BCE7",
                  "#c75458",
                  "#F7FA70",
                  "#2CC4E4",
                  "#4a9acf",
                  "#cfa458",
                  "#4A80E5",
                ],
              },
            },
          }, // 文字的颜色。
          data: json,
          formatter: function (name) {
            const selectedItem = json.find((item) =>
              `${item.name}`.includes(`${name}`)
            );
            return `{icon|${selectedItem.name}}  ${selectedItem.value + "辆"}`;
          },
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "60%"],
            center: ["37%", "45%"],
            data: json,
            itemStyle: {
              normal: {
                color: (params) => {
                  var colorList = [
                    {
                      c1: "#68EBED",
                      c2: "#68EBED",
                    },
                    {
                      c1: "#858DC8",
                      c2: "#858DC8",
                    },
                    {
                      c1: "#B5BCE7",
                      c2: "#B5BCE7",
                    },
                    {
                      c1: "#2CC4E4",
                      c2: "#2CC4E4",
                    },
                    {
                      c1: "#cfa458",
                      c2: "#cfa458",
                    },
                    {
                      c1: "#c75458",
                      c2: "#c75458",
                    },
                    {
                      c1: "#F7FA70",
                      c2: "#F7FA70",
                    },
                    {
                      c1: "#2CC4E4",
                      c2: "#2CC4E4",
                    },
                    {
                      c1: "#4a9acf",
                      c2: "#4a9acf",
                    },
                    {
                      c1: "#cfa458",
                      c2: "#cfa458",
                    },
                    {
                      c1: "#4A80E5",
                      c2: "#4A80E5",
                    },
                    {
                      c1: "#4a9acf",
                      c2: "#4a9acf",
                    },
                    {
                      c1: "#2CC4E4",
                      c2: "#2CC4E4",
                    },
                    {
                      c1: "#4A80E5",
                      c2: "#4A80E5",
                    },
                    {
                      c1: "#c75458",
                      c2: "#c75458",
                    },
                    {
                      c1: "#4A80E5",
                      c2: "#4A80E5",
                    },
                    {
                      c1: "#68EBED",
                      c2: "#68EBED",
                    },
                    {
                      c1: "#858DC8",
                      c2: "#858DC8",
                    },
                    {
                      c1: "#B5BCE7",
                      c2: "#B5BCE7",
                    },
                    {
                      c1: "#2CC4E4",
                      c2: "#2CC4E4",
                    },
                    {
                      c1: "#cfa458",
                      c2: "#cfa458",
                    },
                    {
                      c1: "#c75458",
                      c2: "#c75458",
                    },
                    {
                      c1: "#F7FA70",
                      c2: "#F7FA70",
                    },
                    {
                      c1: "#68EBED",
                      c2: "#68EBED",
                    },
                    {
                      c1: "#858DC8",
                      c2: "#858DC8",
                    },
                    {
                      c1: "#B5BCE7",
                      c2: "#B5BCE7",
                    },
                    {
                      c1: "#2CC4E4",
                      c2: "#2CC4E4",
                    },
                    {
                      c1: "#cfa458",
                      c2: "#cfa458",
                    },
                    {
                      c1: "#c75458",
                      c2: "#c75458",
                    },
                    {
                      c1: "#F7FA70",
                      c2: "#F7FA70",
                    },
                  ];
                  return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                      offset: 0,
                      color: colorList[params.dataIndex].c1,
                    },
                    {
                      offset: 1,
                      color: colorList[params.dataIndex].c2,
                    },
                  ]);
                },
                label: {
                  show: true,
                  formatter: "{d}%",
                },
              },
            },
          },
        ],
      };
      this.$nextTick(() => {
        let chart = echarts.init(this.$refs.chart);
        chart.setOption(option);
        // autoToolTip(chart, option, 3000,);
        window.addEventListener("resize", function () {
          chart.resize();
        });
      });
    },
  },
  mounted() {
    this.setOption();
  },
};
</script>

<style lang="scss" scoped>
.echart-broken-line {
  width: 100%;
  height: 100%;
}
</style>