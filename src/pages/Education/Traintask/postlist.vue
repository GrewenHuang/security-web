<template>
  <el-row class="warp">
    <el-col :span="24"
            class="warp-main"
            v-loading="loading"
            element-loading-text="拼命加载中">
      <!--列表 开始-->
      <el-table :data="tableData"
                row-key="id"
                height='550'
                default-expand-all
                :tree-props="{children:'children'}">
        <el-table-column label="序号"
                         header-align="center"
                         align="center"
                         type='index'
                         width='120px'>
        </el-table-column>
        <el-table-column prop="DepartmentName"
                         min-width='200'
                         header-align="center"
                         align="center"
                         label="所属部门"></el-table-column>
        <el-table-column prop="Name"
                         min-width='200'
                         header-align="center"
                         align="center"
                         label="岗位名称"></el-table-column>

        <el-table-column width='100px'
                         header-align="center"
                         label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type='primary'
                       @click="SelectionChange(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表 结束 -->
    </el-col>
  </el-row>
</template>
<script>
import API_BASIC from "@/api/api_basic";
import API_ENTERPRISE from "@/api/api_enterprise";
import RULECONFIG from "@/common/ruleConfig";
import Qs from "qs";

export default {
  name: "organList",
  data () {
    return {
      loading: false, //页面加载遮罩层显示状态
      tableData: [],//表格数
    }
  },
  //自定义方法
  methods: {
    SelectionChange (item) {
      this.$emit("getValue", item)
    },
    //加载列表数据
    GetList () {
      let that = this;
      that.loading = true;
      API_ENTERPRISE.GetTreeEnterprisePositions()
        .then(
          function (result) {
            that.loading = false;
            if (result.status == 2000) {
              that.tableData = result.data
            }
          },
          function (err) {
            that.loading = false;
            that.message.error({
              showClose: true,
              message: err.toString(),
              duration: 2000,
            });
          }
        )
        .catch(function (error) {
          that.loading = false;
          that.message.error({
            showClose: true,
            message: "请求出现异常",
            duration: 2000,
          });
        });
    },
  },


  created () {
    this.GetList();
  },
};
</script>
<style scoped>
</style>
