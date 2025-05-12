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
      <el-table-column prop="OwnerChangeDate"
                       label="变更日期"
                       width="180">
        <template slot-scope="scope">
          <el-date-picker type="date"
                          value-format='yyyy-MM-dd'
                          placeholder="选择日期"
                          v-model="scope.row.OwnerChangeDate"></el-date-picker>
        </template>
      </el-table-column>

      <el-table-column label="变更原因"
                       prop="OwnerChangeReason">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="变更原因"
                    v-model="scope.row.OwnerChangeReason"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="变更事项"
                       prop="OwnerChangeContent">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="变更事项"
                    v-model="scope.row.OwnerChangeContent"></el-input>
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
      this.GetOwnerChanges()
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
    this.GetOwnerChanges()
  },
  methods: {
    dele (item, index) {
      this.tableData.splice(index, 1);
    },
    GetOwnerChanges () {
      this.Post('/GetOwnerChanges', {
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

        OwnerChangeDate: '', //DateTime 变更 时间
        OwnerChangeReason: '', //string 变更原因
        Remark: '',// string 备注
        RegistrantName: this.nickname
      })
    },

    submits () {
      this.Post('/SaveOwnerChanges', { OwnerChanges: this.tableData, VehicleId: this.id,EnterpriseId: this.EnterpriseId }).then(res => {
        if (res.status == 2000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.GetOwnerChanges()
        }
      })
    }
  }
}
</script>
<style scoped>
</style>