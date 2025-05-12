
<template>
  <div class="box">
    <div style="flex:1">
      <el-amap
        :center="center"
        :amap-manager="amapManager"
        :zoom="zoom"
        :resize-enable="true"
        class="map">
      <el-amap-marker
        :position="marker.position"
        :content="marker.markerImg"></el-amap-marker>
      </el-amap>
    </div>
    <div style="height:350px;background:#F2F4F6;padding:10px 10px 0 10px;box-sizing:border-box">
      <div class="nav">
        <div style="display:flex">
          <div
            v-for="(item,index) in navList"
            :key="index"
            :class="['navItem',comb==item.comName?'active':'']"
            @click="navCheck(item.comName)"
          >{{item.name}}</div>

          <el-row
            v-if="comb == 'Table3'"
            :gutter="10"
            style="margin-left:20px;width:600px;display:flex;height:45px;align-items:center"
          >
            <el-col :span="10">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="startTime"
                size="medium"
                type="datetime"
                placeholder="开始时间"
              ></el-date-picker>
            </el-col>
            <el-col :span="10">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="endTime"
                size="medium"
                type="datetime"
                placeholder="结束时间"
              ></el-date-picker>
            </el-col>
            <el-col :span="4" class="btn1">
              <el-button type="primary" size="medium" @click="getData()">搜索</el-button>
            </el-col>
          </el-row>
        </div>

        <el-popover placement="top" width="100" trigger="click" v-if="comb == 'Table3'">
          <div @click="a()" class="btnlist">开始动画</div>
          <div @click="c()" class="btnlist">继续动画</div>
          <div @click="b()" class="btnlist">暂停动画</div>
          <el-button slot="reference">轨迹回放控制</el-button>
        </el-popover>
      </div>

      <div style="height:290px;">
        <component :is="comb" :id="id" ref="component"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { AMapManager,Marker, lazyAMapApiLoaderInstance } from "vue-amap";

const amapManager = new AMapManager();
import Table1 from "./components/table1";
import Table2 from "./components/table2";
import Table3 from "./components/table3";
import API_ADAS from "@/api/api_adas";
import Vue from "vue";

export default {
  components: { Table1, Table2, Table3 },
  props: ["id"],
  watch: {
    id() {
      this.$nextTick(() => {
        this.comb = "Table1";
        this.startTime = "";
        this.endTime = "";
        //this.clearMap();
        this.getVehicleLocation();
      });
    }
  },
  data() {
    return {
      navList: [
        {
          name: "定位数据",
          comName: "Table1"
        },
        {
          name: "停车数据",
          comName: "Table2"
        },
        {
          name: "历史轨迹",
          comName: "Table3"
        }
      ],
      comb: "Table1",
      zoom: 12,
      center: process.env.BASE_CENTER,
      marker:{
        position: [0, 0],
        markerImg:'',
      },
      map: null,
      amapManager,
      startTime: "",
      endTime: "",
      lineArr: []
    };
  },
  created() {
  },
  mounted() {
    this.getVehicleLocation();
  },
  methods: {
    getVehicleLocation(){
      API_ADAS.GetThirdInterfaceVehicle({ vehicleId:this.id }).then(res => {
        if (res.status == 2000) {
          if(res.data!=null){
            if (res.data.Status == 1) {
              this.marker.markerImg = `<img style='width:50px;height:50px' src="${require("@/assets/images/adas/car1.png")}" ></img>`;
            } else {
              this.marker.markerImg = `<img style='width:50px;height:50px' src="${require("@/assets/images/adas/car2.png")}" ></img>`;
            }
            this.marker.position = [res.data.Lon,res.data.Lat];
            this.center=[res.data.Lon,res.data.Lat];
          }
        }
      });
    },
    getData() {
      this.clearMap();
      if (!this.startTime) {
        this.$message.error("请选择开始时间");
        return false;
      }
      if (!this.endTime) {
        this.$message.error("请选择结束时间");
        return false;
      }
      let json = {
        vehicleId: this.id,
        startTime: this.startTime,
        endTime: this.endTime
      };
      this.$refs["component"].getData(json, res => {
        let lineArr = [];
        res.forEach(item => {
          lineArr.push([item.Lon, item.Lat]);
        });
        this.lineArr = lineArr;
        this.checkLoad(this.lineArr);
      });
    },
    clearMap() {
      let map = amapManager.getMap();
      map.clearMap();
    },
    navCheck(name) {
      this.comb = name;
    },
    a() {
      this.marker.moveAlong(this.lineArr, 1000);
    },
    b() {
      this.marker.pauseMove();
    },
    c() {
      this.marker.resumeMove();
    },
    checkLoad(lineArr) {
      lazyAMapApiLoaderInstance.load().then(() => {
        this.startTrack(lineArr);
      });
    },
    startTrack(lineArr) {
      let map = amapManager.getMap();
      // 创建主体
      this.marker = new AMap.Marker({
        map,
        position: this.lineArr[0],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      });

      // 绘制轨迹

      let polyline = new AMap.Polyline({
        map,
        path: lineArr,
        showDir: true,
        strokeColor: "#3385FF", //线颜色
        strokeWeight: 6, //线宽
        strokeOpacity: 1, //线透明度
        strokeStyle: "solid" //线样式
      });

      // 回执经过的轨迹
      let passedPolyline = new AMap.Polyline({
        map,
        strokeColor: "#09B66D", //线颜色
        strokeWeight: 6 //线宽
      });

      //经过轨迹的更新
      this.marker.on("moving", function(e) {
        passedPolyline.setPath(e.passedPath);
      });
      map.setFitView();
    }
  }
};
</script>

<style scoped >
/deep/.btn1 .el-button {
  border-color: #3385ff;
  background-color: #3385ff;
  color: #fff;
  height: 34px;
  font-size: 14px;
}
.map {
  height: 100%;
  width: 100%;
}
.box {
  display: flex;
  flex-direction: column;
}
.nav {
  display: flex;
  height: 45px;
  width: 100%;
  justify-content: space-between;
}
.navItem {
  margin-right: 5px;
  width: 100px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #44566c;
  font-size: 14px;
  background: #f9fafb;
  cursor: pointer;
}
.active {
  background: #fff !important;
  color: #3385ff !important;
}
.btnlist {
  height: 35px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.btnlist:hover {
  background: #3385ff !important;
  color: #fff !important;
}
</style>
