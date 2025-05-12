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
      <el-table-column prop="MaintainDate"
                       label="维修日期"
                       width="180">
        <template slot-scope="scope">
          <el-date-picker type="date"
                          placeholder="维修日期"
                          value-format='yyyy-MM-dd'
                          v-model="scope.row.MaintainDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="累计行驶里程(KM)"
                       prop="AccumulatedMileage">
        <template slot-scope="scope">
          <el-input type="number"
                    v-model="scope.row.AccumulatedMileage"
                    placeholder="累计行驶里程"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="维修类别"
                       prop="date1">
        <template slot-scope="scope">
          <el-select v-model="scope.row.MaintainTypeCode"
                     clearable
                     placeholder="请选择">
            <el-option v-for='(item,i) in MaintainTypeCom'
                       :key='i'
                       :value="item.id"
                       :label="item.text"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="修理内容"
                       prop="MaintainContent">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="修理内容"
                    v-model="scope.row.MaintainContent"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="维修单位"
                       prop="MaintainCompany">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="维修单位"
                    v-model="scope.row.MaintainCompany"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="合格证编号"
                       prop="FactoryCertificateNo">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="合格证编号"
                    v-model="scope.row.FactoryCertificateNo"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="登记人员"
                       width="80"
                       prop="RegistrantName">
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
      MaintainTypeCom: [],//下拉
      nickname: ''
    }
  },
  watch: {
    'id': function (newVal, oldVal) {
      this.GetMaintains()
    },
    deep: true,
  },
  props: {
    id: {
      type: Number,
    }
  },
  created () {
    let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
    this.nickname = userInfo.UserName;
    this.GetMaintainTypeCom()
    this.GetMaintains()
  },
  methods: {
    GetMaintains () {
      this.Post('/GetMaintains', {
        VehicleId: this.id,
        page: 1,
        rows: 10000
      }).then(res => {
        if (res.status == 2000) {

          this.tableData = res.data.list
        }

      })
    },
    dele (item, index) {
      this.tableData.splice(index, 1);
    },
    add () {

      this.tableData.push({
        MaintainDate: '', //DateTime 检测/评定 时间
        AccumulatedMileage:'',//累计行驶里程
        MaintainTypeCode: '',// string 检测/评定 类别 编码
        MaintainContent: '',// string 维护和修理 内容
        MaintainCompany: '',// string 维护和修理 单位
        FactoryCertificateNo: '',// string 维护和修理 出厂合格证编号
        Remark: '',// string 备注
        RegistrantName: this.nickname
      })
    },
    GetMaintainTypeCom () {
      this.Get('/GetMaintainTypeCom').then(res => {
        if (res.status == 2000) {
          this.MaintainTypeCom = res.data
        }
      })
    },

    submits () {

      this.Post('/SaveMaintains', { Maintains: this.tableData, VehicleId: this.id }).then(res => {
        if (res.status == 2000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.GetMaintains()
        }
      })
    }
  }
}
</script>
<style scoped>
</style>