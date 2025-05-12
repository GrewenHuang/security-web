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
      <el-table-column prop="EvaluateDate"
                       label="检测/评定日期"
                       width="180">
        <template slot-scope="scope">
          <el-date-picker type="date"
                          value-format='yyyy-MM-dd'
                          v-model="scope.row.EvaluateDate"
                          placeholder="选择日期"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="检测/评定类别"
                       prop="EvaluateTypeCode">
        <template slot-scope="scope">
          <el-select v-model="scope.row.EvaluateTypeCode"
                     clearable
                     placeholder="请选择">
            <el-option v-for='(item,i) in EvaluateTypeCom'
                       :key='i'
                       :value="item.id"
                       :label="item.text"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="检测/评定单位"
                       prop="EvaluateDepartment">
        <template slot-scope="scope">
          <el-input type="text"
                    v-model="scope.row.EvaluateDepartment"
                    placeholder="检测/评定单位"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="行驶里程"
                       prop="Mileage">
        <template slot-scope="scope">
          <el-input type="number"
                    v-model="scope.row.Mileage"
                    placeholder="行驶里程"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="报告编号"
                       prop="ReportNo">
        <template slot-scope="scope">
          <el-input type="text"
                    v-model="scope.row.ReportNo"
                    placeholder="报告编号"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="备注"
                       prop="Remark">
        <template slot-scope="scope">
          <el-input type="text"
                    v-model="scope.row.Remark"
                    placeholder="备注"></el-input>
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
  props: {
    id: {
      type: Number,
    },
		EnterpriseId: {
			 type: Number,
		}
  },
  data () {
    return {
      tableData: [],
      EvaluateTypeCom: [],//类型的下拉
      nickname: ''
    }
  },
  watch: {
    'id': function (newVal, oldVal) {
      this.GetEvaluates()
    },
    deep: true,
  },
  mounted () {
    let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
    this.nickname = userInfo.UserName;
    this.GetEvaluateTypeCom()
    this.GetEvaluates()
  },
  methods: {
    GetEvaluates () {
      this.Post('/GetEvaluates', {
        VehicleId: this.id,
        page: 1,
        rows: 10000
      }).then(res => {
        if (res.status == 2000) {

          this.tableData = res.data.list
        }

      })
    },
    GetEvaluateTypeCom () {
      this.Get('/GetEvaluateTypeCom').then(res => {
        if (res.status == 2000) {
          this.EvaluateTypeCom = res.data
        }
      })
    },
    dele (item, index) {
      this.tableData.splice(index, 1);
    },
    add () {
      this.tableData.push({
        EvaluateDate: '',
        EvaluateTypeCode: '',
        EvaluateDepartment: '',
        Mileage: '',
        ReportNo: '',
        Remark: '',
        RegistrantName: this.nickname
      })
    },

    submits () {
      this.Post('/SaveEvaluates', { Evaluates: this.tableData, VehicleId: this.id,EnterpriseId: this.EnterpriseId }).then(res => {
        if (res.status == 2000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.GetEvaluates()
        }
      })
    }
  }
}
</script>
<style scoped>
</style>