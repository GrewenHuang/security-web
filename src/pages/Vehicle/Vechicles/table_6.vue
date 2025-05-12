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
      <el-table-column prop="RegisterDate"
                       label="月初登记日期"
                       width="180">
        <template slot-scope="scope">
          <el-date-picker type="date"
						  style="width: 100%"
                          value-format='yyyy-MM-dd'
                          placeholder="选择日期"
                          v-model="scope.row.RegisterDate"></el-date-picker>
        </template>
      </el-table-column>

      <el-table-column label="月始里程(km)"
                       prop="CurMonthStartMileage">
        <template slot-scope="scope">
          <el-input type="number"
                    placeholder="月始里程"
                    v-model="scope.row.CurMonthStartMileage"></el-input>
        </template>
      </el-table-column>
			<el-table-column prop="RegisterEndDate"
			                 label="月底登记日期"
			                 width="180">
			  <template slot-scope="scope">
			    <el-date-picker type="date"
								style="width: 100%"
			                    value-format='yyyy-MM-dd'
			                    placeholder="选择日期"
			                    v-model="scope.row.RegisterEndDate"></el-date-picker>
			  </template>
			</el-table-column>
			<el-table-column label="月底里程(km)"
			                 prop="CurMonthEndMileage">
			  <template slot-scope="scope">
			    <el-input type="number"
			              placeholder="月底里程"
			              v-model="scope.row.CurMonthEndMileage"></el-input>
			  </template>
			</el-table-column>
      <el-table-column label="当月累计行程(km)"
                       prop="CurMonthMileage">
        <template slot-scope="scope">
			<span>
				{{scope.row.CurMonthEndMileage - scope.row.CurMonthStartMileage}}
			</span>
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
      nickname: ''
    }
  },
  watch: {
    'id': function (newVal, oldVal) {
      this.GetMileages()
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
    this.GetMileages()
  },
  methods: {
    dele (item, index) {
      this.tableData.splice(index, 1);
    },
    GetMileages () {
      this.Post('/GetMileages', {
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
        // RegisterDate: '', //DateTime 变更 时间
        // CurMonthMileage: '', //double 当月行驶里程
        // AllMileage: '', //double 所有行驶里程
        // Remark: '', //string 备注
		RegisterDate: "",
		CurMonthStartMileage: "",
		RegisterEndDate: "",
		CurMonthEndMileage: "",
		CurMonthMileage: "",
        RegistrantName: this.nickname
      })
    },

    submits () {
	  if(this.tableData && this.tableData.length > 0){
		  this.tableData.map(item => {
			  item.CurMonthMileage = item.CurMonthEndMileage - item.CurMonthStartMileage
		  })
	  }
      this.Post('/SaveMileages', { Mileages: this.tableData, VehicleId: this.id,EnterpriseId: this.EnterpriseId }).then(res => {
        if (res.status == 2000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.GetMileages()
        }
      })
    }
  }
}
</script>
<style scoped>
</style>