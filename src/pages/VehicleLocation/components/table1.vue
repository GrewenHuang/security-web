<template>
  <el-table
    :data="tableData"
    style="width: 100%;"
    height="95%"
    :cell-style="{'text-align':'center'}"
    :header-cell-style="{'text-align':'center'}"
  >
    <el-table-column label="车牌号码" prop="VehicleNo" />
    <el-table-column label="定位时间">
      <template slot-scope="scope">
        <span>{{setTime(scope.row.DateTime)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="经纬度">
      <template slot-scope="scope">
        <span>{{scope.row.Lon.toFixed(4) +'-'+ scope.row.Lat.toFixed(4)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="地理位置" prop="Address" />
    <el-table-column label="速度" prop="Speed" width="120" />
    <el-table-column label="方向" prop="Direction" width="120" />
    <el-table-column label="里程碑" prop="Mileage" width="120" />
    <el-table-column label="海拔" prop="Altitude" width="120" />
    <el-table-column label="状态" prop="State" />
  </el-table>
</template>

<script>
import API_ADAS from "@/api/api_adas";
export default {
  props: ["id"],
  watch: {
    id(val) {
      this.getData(val);
    }
  },
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.getData(this.id);
  },
  mounted() {},
  methods: {
    setTime(date) {
      if (date) {
        let arr = date.split("T");
        return arr[0] + " " + arr[1];
      } else {
        return "无";
      }
    },
    getData(vehicleId) {
      API_ADAS.GetVehicleDynamicLocations({ vehicleId }).then(res => {
        if (res.status == 2000) {
          this.tableData = res.data;
        }
      });
    }
  }
};
</script>

<style scoped >
</style>