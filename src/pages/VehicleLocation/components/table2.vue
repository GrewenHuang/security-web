<template>
  <el-table
    :data="tableData"
    style="width: 100%;"
    height="98%"
    :cell-style="{'text-align':'center'}"
    :header-cell-style="{'text-align':'center'}"
  >
    <el-table-column label="车牌号码" prop="VehicleNo" />
    <el-table-column label="停车点" prop="Address" />
    <el-table-column label="经纬度">
      <template slot-scope="scope">
        <span>{{scope.row.Lon.toFixed(4) +'-'+ scope.row.Lat.toFixed(4)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="停车时间">
      <template slot-scope="scope">
        <span>{{setTime(scope.row.StopVehicleTime)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="开车时间">
      <template slot-scope="scope">
        <span>{{setTime(scope.row.StartVehicleTime)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="停车时长" prop="StopTotalTime" />
    <el-table-column label="里程碑" prop="Mileage" />
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
      API_ADAS.GetVehicleStaticLocations({ vehicleId }).then(res => {
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