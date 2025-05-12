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
      <el-table-column prop="AccidentDate"
                       label="事故时间"
                       width="180">
        <template slot-scope="scope">
          <el-date-picker type="date"
                          value-format='yyyy-MM-dd'
                          placeholder="选择日期"
                          v-model="scope.row.AccidentDate"></el-date-picker>
        </template>
      </el-table-column>

      <el-table-column label="事故地点"
                       prop="AccidentLocation">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="事故地点"
                    v-model="scope.row.AccidentLocation"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="事故性质">
        <template slot-scope="scope">
          <el-select v-model="scope.row.AccidentNatureCode"
                     clearable
                     placeholder="请选择">
            <el-option v-for='(item,i) in AccidentlevelCom'
                       :key='i'
                       :value="item.id"
                       :label="item.text"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="事故责任">
        <template slot-scope="scope">
          <el-select v-model="scope.row.AccidentDutyCode"
                     clearable
                     placeholder="请选择">
            <el-option v-for='(item,i) in AccidentNatureCom'
                       :key='i'
                       :value="item.id"
                       :label="item.text"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="车辆损坏情况"
                       prop="Damage">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="车辆损坏情况"
                    v-model="scope.row.Damage"></el-input>
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
      nickname: '',
      AccidentlevelCom: [],//事故性质下拉
      AccidentNatureCom: [],//事故责任下拉
    }
  },
  watch: {
    'id': function (newVal, oldVal) {
      this.GetDamageAccidents()
    },
    deep: true,
  },
  props: {
    id: {
      type: Number,
    },
		EnterpriseId: {
			 type: Number,
		}
  },
  created () {
    let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
    this.nickname = userInfo.UserName;
    this.GetDamageAccidents()
    this.GetAccidentlevelCom()
    this.GetAccidentNatureCom()
  },
  methods: {
    dele (item, index) {
      this.tableData.splice(index, 1);
    },
    GetAccidentNatureCom () {
      this.Get('/GetAccidentNatureCom').then(res => {
        if (res.status == 2000) {
          this.AccidentNatureCom = res.data
        }
      })
    },
    GetAccidentlevelCom () {
      this.Get('/GetAccidentlevelCom').then(res => {
        if (res.status == 2000) {
          this.AccidentlevelCom = res.data
        }
      })
    },
    GetDamageAccidents () {
      this.Post('/GetDamageAccidents', {
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
        AccidentDate: '',// DateTime 事故 时间
        AccidentLocation: '',// string 事故地点
        AccidentNatureCode: '',// string 事故性质
        AccidentDutyCode: '',// string 事故责任
        Damage: '',// string 车辆损坏情况
        Remark: '',// string 备注
        RegistrantName: this.nickname
      })
    },

    submits () {
      this.Post('/SaveDamageAccidents', { DamageAccidents: this.tableData, VehicleId: this.id,EnterpriseId: this.EnterpriseId }).then(res => {
        if (res.status == 2000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.GetDamageAccidents()
        }
      })
    }
  }
}
</script>
<style scoped>
</style>