<template>
  <div>
    <el-amap-search-box class="search-box"
                          :search-option="searchOption"
                          :on-search-result="onSearchResult"></el-amap-search-box>
    <el-amap class="amap-box"
             :amap-manager="amapManager"
             :vid="'amap-vue'"
             :zoom="zoom"
             :center="center"
             :events="events"
             :plugin="plugins">
      <el-amap-marker :position="center"> </el-amap-marker>
    </el-amap>
    <el-row style='margin-top:10px'
            :gutter='10'>
      <el-col :span='4'>
        <el-input :value='form.Longitude'>
          <template slot="prepend">经度：</template>
        </el-input>
      </el-col>
      <el-col :span='4'>
        <el-input :value='form.Latitude'>
          <template slot="prepend">纬度</template>
        </el-input>
      </el-col>
      <el-col :span='12'>
        <el-input :value='form.Address'>
          <template slot="prepend">地址：</template>
        </el-input>
      </el-col>
      <el-col :span='4'>
        <el-button type="primary"
                   @click="setMap()">确定</el-button>
        <el-button type="info"
                   @click='hide()'>取消</el-button>
      </el-col>
    </el-row>
  </div>

</template>
<script>
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
import Qs from "qs";
let amapManager = new AMapManager()
export default {
  props: {
    fatherMethod: {
      type: Function,
      default: null
    }
  },
  data () {
    let self = this;
    return {
      input: '',
      amapManager,
      center: [0, 0],
      zoom: 15,
      loaded: false,
      searchOption: {
        city: "全国",
        citylimit: true,
      },
      form: {
        Longitude: '',
        Latitude: '',
        Address: '',
      },
      events: {
        click (e) {
          let { lng, lat } = e.lnglat
          self.form.Longitude = lng
          self.form.Latitude = lat
          self.center = [lng, lat]
          AMap.service('AMap.Geocoder', function () {//回调函数
            //实例化Geocoder
            let geocoder = new AMap.Geocoder({
              city: "010"//城市，默认：“全国”
            });
            //TODO: 使用geocoder 对象完成相关功能
            geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
              self.form.Address = result.regeocode.formattedAddress
              document.querySelector(".search-box-wrapper input").value = self.input;
              document.querySelector(".search-box-wrapper input").value = result.regeocode.formattedAddress;
              self.$nextTick();
            })
          })
        }
      },

      plugins: [
        {
          pName: "Geocoder", //使用AMap.Geocoder插件
          events: {
            init (o) {
              o.getAddress(self.center, (status, result) => {
                if (status === "complete" && result.info === "OK") {
                  setTimeout(() => {
                    self.input = result.regeocode.formattedAddress;
                    document.querySelector(".search-box-wrapper input").value = self.input;
                  }, 50)

                  self.$nextTick();
                }
              });
            },
          },
        },
        {
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 100, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: "all",
          //地图定位按钮
          pName: "Geolocation",
          init (o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                self.lng = result.position.lng;
                self.lat = result.position.lat;
                self.center = [self.lng, self.lat];
                self.loaded = true;
                self.$nextTick();
              }
            });
          },
        },
        {
          //地图工具条
          pName: "ToolBar",
          init (o) { },
        },
        {
          //左下角缩略图插件 比例尺
          pName: "Scale",
          init (o) { },
        },
      ],
    }
  },
  methods: {
    onSearchResult (pois) {
      this.center = [pois[0].lng, pois[0].lat];
      this.form.Longitude = pois[0].lng;
      this.form.Latitude = pois[0].lat;
      this.form.Address = pois[0].address;
    },
    setMap () {
      this.$emit('Map', this.form)
    },
    hide () {
      this.fatherMethod();
    }
  },
  async onShow(){
    let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
    // this.center=[userInfo.Enterprise.Longitude,userInfo.Enterprise.Latitude];
	this.center = [113.457405,23.016454]
  },
  created () { 
    let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
    // this.center=[userInfo.Enterprise.Longitude,userInfo.Enterprise.Latitude];
	this.center = [113.457405,23.016454]
  }
}
</script>
<style scoped>
.amap-box {
  width: 100%;
  height: 600px;
}
/deep/ .el-vue-search-box-container {
  position: absolute;
  right: 25px;
  top: 79px;
}
</style>
