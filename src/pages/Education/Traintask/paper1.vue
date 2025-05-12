<template>
  <el-row class="warp">
    <el-col :span="24"
            class="warp-main"
            v-loading="loading"
            element-loading-text="拼命加载中">

      <!--列表开始-->
      <el-table :data="list"
                highlight-current-row
                v-loading="loading"
                :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{textAlign: 'center'}"
                style="width: 100%;">
        <el-table-column label="序号"
                         type="index"
                         width="60">
        </el-table-column>
        <el-table-column label="所属公司"
            prop="EnterpriseName">
        </el-table-column>
        <el-table-column label="试卷编号"
                         prop="ExaminationPaperNumber">
        </el-table-column>
        <el-table-column label="试卷名称"
                         prop="ExaminationPaperName">
        </el-table-column>
        <el-table-column label="考试时长(分)"
                         prop="TestTime">
        </el-table-column>
        <el-table-column label="试题数"
                         prop="QuestionNumber">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type='primary'
                       @click="SelectionChange(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--列表结束-->

      <!--分页开始-->
      <el-row>
        <el-col :span="24"
                style="text-align: center;">
          <el-pagination layout="total, prev, pager, next"
                         background
                         @current-change="handleCurrentChange"
                         :page-size="rows"
                         :total="total"
                         class="customPagination">
          </el-pagination>
        </el-col>
        <!--分页结束-->
      </el-row>
    </el-col>
  </el-row>
</template>



<script>

import request_mixin from "@/mixins/request-mixin.js";

export default {


  mixins: [request_mixin],
  data () {
    return {
      //数据列表
      list: [],
      total: 0,
      page: 1,
      rows: 10,
    };
  },
  created () {
    this.getList()
  },
  methods: {
    SelectionChange (item) {
      this.$emit("getValue", item)
    },
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    getList () {
      let that = this;
      let params = Object.assign({
        page: that.page,
        rows: that.rows,
        QueryScope: 2,
      }, that.filters);

      that.loading = true;
      this.Post('/GetExaminationPapers', params).then(res => {
        if (res.status == 2000) {
          res.data.list.forEach(key => {
            key.ExamCount = 1
          })
          this.list = res.data.list
          this.total = res.data.count
        }
        that.loading = false
      })
    },
  },

}
</script>

<style scoped>
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
  height: 600px;
}

/deep/ .el-upload-list__item {
  transition: none !important;
}

/deep/ .ql-editor {
  min-height: 200px;
}
</style>