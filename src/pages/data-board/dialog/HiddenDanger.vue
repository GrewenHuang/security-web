<template>
  <div>
    <el-table
      :data="list"
      highlight-current-row
      :header-cell-style="tableStayle"
      style="min-height: 600px"
    >
      <el-table-column
        label="序号"
        align="center"
        header-align="center"
        type="index"
        width="60"
      >
      </el-table-column>
      <el-table-column
        label="隐患来源"
        align="center"
        header-align="center"
        show-overflow-tooltip
        prop="PotentialSourceDesc"
      >
      </el-table-column>
      <el-table-column
        label="隐患项目"
        prop="Project"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="隐患内容"
        prop="Content"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.Content" v-html="scope.row.Content"></span>
        </template>
      </el-table-column>
      <el-table-column label="排查备注" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.RecordSubmit">{{
            scope.row.RecordSubmit.Remark
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="隐患级别"
        align="center"
        header-align="center"
        prop="PotentialLevelName"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-tag
            size="small"
            effect="dark"
            :type="scope.row.PotentialLevelCode == '058002' ? '' : 'danger'"
          >
            {{ scope.row.PotentialLevelName }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        label="责任部门"
        prop="DepartmentName"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="上报人"
        prop="SubmitUserName"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="整改人"
        prop="ResponsibleName"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.RecordRectification &&
              scope.row.RecordRectification.length > 0
            "
            >{{
              scope.row.RecordRectification.map(
                (item) => item.OperationUserName
              ).join("、")
            }}</span
          >
          <span v-else>{{ scope.row.ResponsibleName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="复查人" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.RecordReexamine && scope.row.RecordReexamine.length > 0
            "
            >{{
              scope.row.RecordReexamine.map(
                (item) => item.OperationUserName
              ).join("、")
            }}</span
          >
        </template>
      </el-table-column> -->
      <el-table-column
        label="状态"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row | filterscolor" effect="dark" size="small">
            {{ scope.row.StatusDesc }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 	<el-table-column label="操作" align="center" header-align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="showViewDialog(scope.row.PotentialId, scope.row)"
							v-if="$_has('YHZLBtnLook') || $_has('RWXQYHBTNLOOK')">查看</el-button>
					</div>
				</template>
			</el-table-column> -->
    </el-table>

    <el-row>
      <el-col :span="24">
        <el-pagination
          layout="total, prev, pager, next"
          background
          @current-change="handleCurrentChange"
          :page-size="pages.rows"
          :total="pages.total"
          :current-page.sync="pages.page"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request_mixin from "@/mixins/request-mixin";
export default {
  mixins: [request_mixin],
  data() {
    return {
      tableStayle: {
        background: "rgba(13, 64, 105, 0.3)",
        height: "60px",
        color: "#fff",
        borderBottom: "1px solid #0f2a4b",
      },
      list: [],
      loading: false,
      pages: {
        total: 0,
        page: 1,
        rows: 10,
      },
      StartSubmitDate: "",
      EndSubmitDate: "",
      PotentialLevelCodes: "",
      Status: "",
      Month: "",
      Type: "",
    };
  },
  props: ["isData", "EnterpriseId"],
  watch: {
    isData: {
      deep: true,
      handler(val) {
        this.handleData(val);
        this.handleCurrentChange(1);
      },
    },
  },
  mounted() {
    // this.StartSubmitDate = this.getCurrentMonthFirstDay(this.isData)
    // this.EndSubmitDate = this.getCurrentDate(this.isData)
    this.handleData(this.isData);
    this.handleCurrentChange(1);
  },
  methods: {
    handleData(val) {
      console.log(val);
      let rowIndex = val.rowIndex + 1;
      this.Month = rowIndex > 9 ? rowIndex : "0" + rowIndex;
      this.Status =
        val.columnIndex == 0 || val.columnIndex == 1
          ? ""
          : val.columnIndex == 2
          ? [50,40]
          : val.columnIndex == 3
          ? [30]
          : [20, 30, 40];
      this.PotentialLevelCodes =
        val.columnIndex == 0 || val.columnIndex == 1
          ? ["058002", "058001"]
          : null;
      this.Type = val.columnIndex == 4 ? 1 : null;
    },
    // timeFormat(date) {
    // 	try {
    // 		let y = date.getFullYear();
    // 		let m = date.getMonth() + 1;
    // 		let d = date.getDate();
    // 		m = m < 10 ? "0" + m : m;
    // 		d = d < 10 ? "0" + d : d;
    // 		return y + "-" + m + "-" + d;
    // 	} catch (e) {
    // 		return
    // 	}

    // },
    // getCurrentDate(data) {
    // 	var year = new Date().getFullYear()
    // 	var month = new Date().getMonth() + 1
    // 	var date = new Date(year,data + 1,0)
    // 	return this.timeFormat(date)
    // },
    // getCurrentMonthFirstDay(data) {
    // 	var year = new Date().getFullYear()
    // 	var date = new Date(year,data);
    // 	date.setDate(1);
    // 	return this.timeFormat(date)
    // },
    handleCurrentChange(val) {
      this.pages.page = val;
      this.getList();
    },
    getList() {
      let params = {
        page: this.pages.page,
        rows: this.pages.rows,
        EnterpriseId: this.EnterpriseId,
        Month: this.Month,
        PotentialLevelCodes: this.PotentialLevelCodes,
        Status: this.Status,
        Type: this.Type,
      };
      this.loading = true;
      console.log(params);

      this.Post("/GetPotentialsInThisYearPageDaPing", params).then((res) => {
        if (res.status == 2000) {
          this.list = res.data.list;
          this.pages.total = res.data.count;
        }
      });
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/table.less";

/deep/ .el-pagination {
  padding: 5px 5px !important;
  text-align: right;
  margin: 10px 0;
}

/deep/ .el-pagination__total {
  color: #fff;
}

/deep/ .el-table .cell.el-tooltip {
  display: block ruby !important; 
}
</style>