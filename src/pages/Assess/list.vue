<template>
  <page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
      <!--工具条开始-->
      <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input v-model="filters.LicensePlateNumber"
                        placeholder="车牌号/姓名" clearable></el-input>
                <ZYselect url='GetEvaluationConclusionLevelCom'
                        placeholder='表单类型'
                        propid='id'
                        propname='text'
                        :val='filters.ConclusionLevel'
                        v-model="filters.ConclusionLevel"
                        @returnData='getFormValue($event)' />
                <el-date-picker v-model="filters.StartSubmitDate"
                                type="date"
                                placeholder="评测开始日期"
                                value-format="yyyy-MM-dd"
                                style="width: 200px;">
                </el-date-picker>
                <el-date-picker v-model="filters.EndSubmitDate"
                                type="date"
                                placeholder="评测结束日期"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-button type="primary"
                        @click="handleSearch">查询</el-button>
            </div>
      </div>
      <!--工具条结束-->

      <!--列表开始-->
      <el-table :data="list"
                highlight-current-row
                :header-cell-style="$tableStyle">
        <el-table-column label="序号"
                         type="index"
                         align="center"
                         header-align="center"
                         width="60">
        </el-table-column>
        <el-table-column prop="SubmitDateDesc"
                         width="180"
                         align="center"
                         header-align="center"
                         label="评测日期">
        </el-table-column>
        <el-table-column prop="UserName"
                         label="测评人">
          <template slot-scope="scope">
            <span>{{scope.row.LicensePlateNumber}} {{scope.row.UserName}}</span>
          </template>

        </el-table-column>
        <el-table-column label="测评题数"
                         align="center"
                         header-align="center"
                         width="80">
          <template slot-scope="scope">
            {{scope.row.QuestionCount}}题
          </template>

        </el-table-column>
        <el-table-column label="测评结果"
                         align="center"
                         header-align="center"
                         width="80">
          <template slot-scope="scope">

            <el-tag :style='{background:scope.row.ColorCode,border:"none"}'
                    effect="dark">
              {{scope.row.ConclusionLevelDesc}}
            </el-tag>
          </template>

        </el-table-column>
        <el-table-column label="测评分数"
                         align="center"
                         header-align="center"
                         width="80">
          <template slot-scope="scope">
            {{scope.row.SelectScore}}分
          </template>

        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         header-align="center"
                         width="100">
          <template slot-scope="scope">
            <div class="table-operation">
                <el-button type="text"
                       @click="showViewDialog(scope.row)">查看</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--列表结束-->
      <!--弹层开始-->
      <el-dialog v-dialog-drag  title="心理测评详情"
                 :visible.sync="addShow"
                 :close-on-click-modal="false"
                 @close='dialogClear'
                 width="50%">
        <el-scrollbar class='scrollbar'>
          <el-form :inline="true">
            <el-row>
              <el-col :span='12'>
                <el-form-item label="测评人:">
                  {{info.UserName}}
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label="测评日期:">
                  {{info.SubmitDateDesc}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item label="测评题数:">
                  {{info.QuestionCount}}题
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label="测评分数:">
                  {{info.SelectScore}}分
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                <div v-for='(item,i) in info.AnswerSheetQuestions'
                     :key='i'
                     style='margin-bottom:20px'>
                  <div style='font-size:15px;font-weight:700'>{{item.Sort}} . {{item.Subject}}</div>
                  <div :style='{color:item.SelectOptionFlag == items.Flag?"#409EFF":""}'
                       v-for='(items,j) in item.AnswerOptions'
                       :key='j'>
                    {{items.Flag}} 、{{items.OptionContent}}-----({{items.Score}}分)
                  </div>
                </div>
              </el-col>
            </el-row>

          </el-form>
        </el-scrollbar>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="addShow = false">关闭</el-button>
        </span>
      </el-dialog>
      <!--弹层结束-->
  </page-layout>
</template>



<script>

import request_mixin from "@/mixins/request-mixin.js";
import ZYselect from '@/components/common/zy_select'

export default {
  name: "list",
  components: {
    ZYselect
  },
  mixins: [request_mixin],
  data () {
    return {
      filters: {},
      //数据列表
      list: [],
      //分页相关数据
      pages: {
        total: 0,
      page: 1,
      rows: 10,
      },
      //列表页面是否加载变量
      loading: false,
      addShow: false,
      info: {}
    };
  },
  methods: {
    showViewDialog (row) {
      this.addShow = true
      this.info = JSON.parse(JSON.stringify(row))
    },
    dialogClear () {
      this.addShow = false
    },
    getFormValue (e) {
      this.filters.ConclusionLevel = e
    },
    //分页事件
    handleCurrentChange (val) {
      this.pages.page = val;
      this.getList();
    },
    //搜索事件
    handleSearch () {
      this.pages.page = 1;
      this.getList();
    },
    //获取列表数据
    getList () {
      let that = this;
      let params = Object.assign({
        page: that.pages.page,
        rows: that.pages.rows
      }, that.filters);

      that.loading = true;
      this.Post('/GetAnswerSheets', params).then(res => {
        if (res.status == 2000) {
          that.list = res.data.list;
          that.pages.total = res.data.count;
          that.loading = false;
        }
      }).catch(function (error) {
        that.loading = false;
        that.$message.error({
          showClose: true,
          message: "请求出现异常",
          duration: 2000
        });
      });

    },


  },
  mounted () {
    this.getList()

  },
}
</script>

<style scoped>
</style>
