<template>
  <page-layout
    :loading="loading"
    :pages="pages"
    @current-change="handleCurrentChange"
  >
    <!--工具条开始-->
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <select-enterpirse
              clearable
              placeholder="企业"
              collapseTags
              v-model="filters.EnterpriseId"
              @clear="filters.DepartmentId = ''"
            ></select-enterpirse>
          </el-form-item>
          <el-form-item>
            <cascader-department
              placeholder="部门"
              clearable
              v-model="filters.DepartmentId"
              :enterpriseId="filters.EnterpriseId"
              :disabled="!filters.EnterpriseId ? true : false"
            ></cascader-department>
          </el-form-item>
          <el-form-item>
            <select-position
              v-model="filters.PositionId"
              :multiple="false"
              clearable
              placeholder="岗位"
            ></select-position>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="培训人"
              clearable
              v-model="filters.UserName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="培训名称"
              clearable
              v-model="filters.TrainTaskName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCurrentChange(1)"
              >查询</el-button
            >
            <el-popover width="300" trigger="click">
              <div>
                <el-form-item>
                  <el-select
                    placeholder="学习状态"
                    v-model="filters.TrainTaskStatu"
                    style="width: 100%"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in trainList"
                      :key="index"
                      :label="item.text"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    placeholder="考试状态"
                    v-model="filters.ExamStatus"
                    style="width: 100%"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in examList"
                      :key="index"
                      :label="item.text"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-button slot="reference" type="text">更多筛选</el-button>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
      <!-- <el-button-group>
				<el-button>导出</el-button>
			</el-button-group> -->
    </div>
    <!--工具条结束-->

    <!--列表开始-->
    <el-table
      :data="list"
      highlight-current-row
      :header-cell-style="$tableStyle"
      :height="650"
      style="width: 100%"
      @selection-change="handleRightSelectionChange"
    >
      <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
      <el-table-column label="序号" align="center" type="index" width="60">
      </el-table-column>
      <el-table-column
        label="企业/部门"
        align="center"
        show-overflow-tooltip
        width="200"
      >
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.DepartmentListJustShow &&
                scope.row.DepartmentListJustShow.length > 0
            "
          >
            {{
              scope.row.DepartmentListJustShow.map(
                item => item.EnterpriseName + "-" + item.DepartmentName
              ).join("、")
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="岗位" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.PositionList && scope.row.PositionList.length > 0"
          >
            {{
              scope.row.PositionList.map(item => item.PositionName).join("、")
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="培训人"
        align="center"
        prop="UserName"
      ></el-table-column>
      <el-table-column
        label="培训名称"
        align="center"
        prop="TrainTaskName"
      ></el-table-column>
      <el-table-column label="培训周期" align="center" width="200">
        <template slot-scope="scope">
          <div
            v-if="scope.row.TrainStartDateDesc && scope.row.TrainEndDateDesc"
          >
            <div>开始时间：{{ scope.row.TrainStartDateDesc }}</div>
            <div>结束时间：{{ scope.row.TrainEndDateDesc }}</div>
          </div>
          <div v-else>不限</div>
        </template>
      </el-table-column>
      <el-table-column
        label="学习状态"
        align="center"
        prop="TrainTaskStatuDesc"
      ></el-table-column>
      <el-table-column
        label="考试状态"
        align="center"
        prop="ExamStateDesc"
      ></el-table-column>
      <el-table-column label="创建时间" align="center" prop="GenerateDateDesc">
      </el-table-column>
      <!-- <el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button v-if="$_has('GQPXBtnDown')" type="text" @click="
                                downloadmbs(60, 602, {
                                    TrainTaskId: scope.row.TrainTaskId,
                                })
                            ">档案下载</el-button>
					</div>
				</template>
			</el-table-column> -->
    </el-table>
    <!--列表结束-->
  </page-layout>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import Import_export from "@/mixins/Import_export.js";
export default {
  mixins: [request_mixin, Import_export],
  data() {
    return {
      filters: {
        IsPreTrain: 0
      },
      list: [],
      pages: {
        total: 0,
        page: 1,
        rows: 10
      },
      loading: false,
      positionList: [],
      ChooseList: [], // 选择下载的条目
      examList: [],
      trainList: []
    };
  },
  methods: {
    //分页事件
    handleCurrentChange(val) {
      this.pages.page = val;
      this.getList();
    },
    handleRightSelectionChange(val) {
      this.ChooseList = val;
    },
    //获取列表数据
    getList() {
      let that = this;
      let params = {
        ...this.pages,
        ...this.filters
      };
      that.loading = true;
      this.Post("/GetTrainTaskTaskDetail", params)
        .then(res => {
          if (res.status == 2000) {
            this.list = res.data.list;
            this.pages.total = res.data.count;
          }
          that.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  async mounted() {
    this.handleCurrentChange(1);
    await this.Get("/GetExamStateCom").then(res => {
      if (res.status == 2000) {
        this.examList = res.data;
      }
    });
    await this.Get("/GeTrainTaskStatuCom").then(res => {
      if (res.status == 2000) {
        this.trainList = res.data;
      }
    });
  }
};
</script>

<style scoped lang="less">
/deep/ .input-content .el-form-item {
  margin-bottom: 0 !important;
}
</style>
