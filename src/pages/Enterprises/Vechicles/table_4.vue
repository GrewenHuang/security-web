<template>
  <div>
    <el-button type="primary"
               plain
               icon="el-icon-plus"
               @click="add()"
               style='margin:10px 0'>新增</el-button>
    <el-table :data="tableData"
              border
              :header-cell-style='{"text-align":"center"}'
              :cell-style="{'text-align':'center'}"
              style="width: 100%">
      <el-table-column label="序号"
                       width="50"
                       type="index">
      </el-table-column>
      <el-table-column prop="ComponentReplaceDate"
                       label="更换日期"
                       width="180">
        <template slot-scope="scope">
          <el-date-picker type="date"
                          placeholder="更换日期"
                          value-format='yyyy-MM-dd'
                          v-model="scope.row.ComponentReplaceDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="部件名称"
                       prop="ComponentName">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="部件名称"
                    v-model="scope.row.ComponentName"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="型号规格"
                       prop="ModelSpecification">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="型号规格"
                    v-model="scope.row.ModelSpecification"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="生产厂名称"
                       prop="Manufacturer">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="生产厂名称"
                    v-model="scope.row.Manufacturer"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="部件编码"
                       prop="ComponentNo">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="部件编码"
                    v-model="scope.row.ComponentNo"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="维修单位"
                       prop="MaintenanceUnit">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="维修单位"
                    v-model="scope.row.MaintenanceUnit"></el-input>
        </template>

      </el-table-column>
      <el-table-column label="登记人员"
                       prop="RegistrantName"
                       width="80">
      </el-table-column>
      <el-table-column label="操作"
                       width="80">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="danger"
                     @click='dele(scope.row,scope.$index)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import Qs from "qs";
export default {
  mixins: [request_mixin],
  data () {
    return {
      tableData: [],
      nickname: ''
    }
  },
  created () {
    let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
    this.nickname = userInfo.UserName;
    this.GetComponentReplaces()
  },
  watch: {
    'id': function (newVal, oldVal) {
      this.GetComponentReplaces()
    },
    deep: true,
  },
  props: {
    id: {
      type: Number,
    }
  },
  methods: {
    dele (item, index) {
      this.tableData.splice(index, 1);
    },
    GetComponentReplaces () {
      this.Post('/GetComponentReplaces', {
        VehicleId: this.id,
        page: 1,
        rows: 10000
      }).then(res => {
        if (res.status == 2000) {

          this.tableData = res.data.list
        }
      })
    },
    add () {
      this.tableData.push({
        ComponentReplaceDate: '',// DateTime 更换 时间
        ComponentName: '',// string 部件名称
        ComponentNo: '', //string 部件编号
        ModelSpecification: '',// string 型号规格
        Manufacturer: '',// string 生产厂名称
        MaintenanceUnit: '',// string 维护单位
        Remark: '', //string 备注
        RegistrantName: this.nickname
      })
    },

    submits () {
      this.Post('/SaveComponentReplaces', { ComponentReplaces: this.tableData, VehicleId: this.id }).then(res => {
        if (res.status == 2000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.GetComponentReplaces()
        }
      })
    }
  }
}
</script>
<style scoped>
</style>