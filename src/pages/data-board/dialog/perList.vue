<template>
  <div>
    <el-table
      :data="perList"
      highlight-current-row
      :header-cell-style="tableStayle"
      @row-click="onClickDetail"
      style="min-height: 600px"
    >
      <el-table-column label="序号" type="index" align="center" width="50">
      </el-table-column>
      <!-- <el-table-column
        label="头像"
        align="center"
        show-overflow-tooltip
        prop="EnterpriseName"
      >
        <template slot-scope="scope">
          <el-avatar
            :src="scope.row.Photo ? scope.row.Photo : ImgHH"
          ></el-avatar>
          {{ scope.row.Photo }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="企业"
        align="center"
        show-overflow-tooltip
        prop="EnterpriseName"
      >
      </el-table-column>
      <el-table-column
        label="姓名"
        align="center"
        show-overflow-tooltip
        prop="UserName"
      >
      </el-table-column>
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
import ImgHH from "../imges/hh.jpg";

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
      perList: [],
      ImgHH,
      pages: {
        total: 0,
        page: 1,
        rows: 10,
      },
      params: {
        EnterpriseId: "",
        data: "",
        dep: "",
      },
    };
  },
  props: ["isCheck", "EnterpriseId"],
  watch: {},
  created() {},
  mounted() {
    this.handleCurrentChange(1);
  },
  methods: {
    show(EnterpriseId, data, dep) {
      this.params.EnterpriseId = EnterpriseId;
      this.params.data = data;
      this.params.dep = dep;

      this.$nextTick(() => {
        this.handleCurrentChange(1);
      });
    },
    handleCurrentChange(val) {
      this.pages.page = val;
      if (this.params.dep) {
        console.log(this.params);

        this.getList(
          this.params.EnterpriseId,
          this.params.data,
          this.params.dep
        );
      }
    },
    onClickDetail(event) {
      console.log(event);
      this.$emit("success", event);
    },
    getList(EnterpriseId, data, dep) {
      console.log(EnterpriseId, data, dep);
      const dPerloading = this.$loading({
        lock: true,
        text: "人员数据加载中，请稍等...",
        spinner: "el-icon-loading",
        color: "#fff",
        background: "rgba(0, 0, 0, .3)",
      });
      this.Post("/GetEnterpriseAllUsers", {
        page: this.pages.page,
        rows: this.pages.rows,
        Type: data,
        EnterpriseId: EnterpriseId,
        // IsEntryThisYear: data,
        DepartmentId: dep,
      }).then((res) => {
        if (res.status == 2000) {
          this.perList = res.data.list;
          this.pages.total = res.data.count;
          dPerloading.close();
        } else {
          dPerloading.close();
        }
      });
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
</style>