<template>
  <div>

    <!-- <vue-stroll :el="el" :collection="collection" :effect="effect">
      <div class="table-container"> -->
    <el-table :data="list" highlight-current-row :header-cell-style="tableStayle" style="min-height: 600px">
      <el-table-column label="序号" type="index" align="center" width="50">
      </el-table-column>
      <el-table-column label="企业" align="center" show-overflow-tooltip prop="EnterpriseName">
      </el-table-column>
      <el-table-column label="部门" align="center" show-overflow-tooltip prop="Name">
      </el-table-column>
      <el-table-column label="人数" align="center" prop="userCount" width="240">
        <template slot-scope="{ row }">
          <div class="table-operation">
            <el-button type="text" @click="onSelectPer(row.DepartmentId)">{{ row.userCount }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- </div>
    </vue-stroll> -->

    <el-dialog v-dialog-drag title="人员" :visible.sync="addShow" :close-on-click-modal="false" width="78%" append-to-body
      top="2vh" @close="close">
      <div class="dialog-box" style="padding-bottom: 30px">
        <perList @success="onPerSuccess" ref="perList"></perList>
        <!-- <per @success="onPerSuccess" ref="per"></per> -->
      </div>
    </el-dialog>
    <el-dialog v-dialog-drag title="查看" :visible.sync="contentShow" :close-on-click-modal="false" width="75%"
      height="80%" append-to-body top="2vh">
      <div class="dialog-box">
        <Vuepdf2 :url="UrlPdf"></Vuepdf2>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request_mixin from "@/mixins/request-mixin";
import VueStroll from 'vue-stroll'
import 'vue-stroll/lib/stroll.min.css'
import Vuepdf2 from "./Vuepdf";
import per from "./per";
import perList from "./perList";
export default {
  mixins: [request_mixin],
  components: {
    per,
    perList,
    Vuepdf2,
    VueStroll
  },
  data() {
    return {
      tableStayle: {
        background: "rgba(13, 64, 105, 0.3)",
        height: "60px",
        color: "#fff",
        borderBottom: "1px solid #0f2a4b",
      },
      tableStayle2: {
        background: "rgba(13, 64, 105, 0.3)",
        height: "60px",
        color: "#fff",
        borderBottom: "1px solid #0f2a4b",
      },
      contentShow: false,
      addShow: false,
      list: [],
      perList: [],
      loading: false,
      pages: {
        total: 0,
        page: 1,
        rows: 10,
      },
      UrlPdf: "",
      // vue-stroll 滚动配置
      el: '.table-container',
      collection: ['.el-table-column'], // 表格列
      effect: 'cards', // 滚动效果
    };
  },
  props: ["EnterpriseId", "IsEntryThisYear"],
  watch: {
    isWarehouseSetId: {
      deep: true,
      handler(val) {
        this.handleCurrentChange(1);
      },
    },
  },
  mounted() {
    this.handleCurrentChange(1);
  },
  methods: {
    onPerSuccess(val) {
      const PDFloading = this.$loading({
        lock: true,
        text: "数据生成中，请稍等...",
        spinner: "el-icon-loading",
        color: "#fff",
        background: "rgba(0, 0, 0, .3)",
      });
      this.Get("/GetHHUserPDFDashBord?userId=" + val.UserId).then((res) => {
        if (res.status == 2000) {
          this.UrlPdf = res.data.key;
          this.$nextTick(() => {
            this.contentShow = true;
          });
        } else {
          this.$message.error("获取PDF失败，请稍后再试");
        }
        PDFloading.close();
      });
    },
    handleCurrentChange(val) {
      this.pages.page = val;
      this.getList();
    },
    close() {
      this.$refs.per.isShowFlase();
      this.$nextTick(() => {
        this.addShow = false;
      });
    },
    onSelectPer(row) {
      this.addShow = true;
      this.$nextTick(() => {
        this.$refs.perList.show(this.EnterpriseId, this.IsEntryThisYear, row);
      });
    },
    getList() {
      let params = {
        page: this.pages.page,
        rows: 9999,
        EnterpriseId: this.EnterpriseId,
        Type: this.IsEntryThisYear
      };
      this.loading = true;
      this.Post("/GetHHFirstLevelDepartments ", params).then((res) => {
        if (res.status == 2000) {
          console.log(res.data, "res.data");

          let list = []
          res.data.forEach(item => {
            if (item.userCount !== 0) {
              list.push(item)
            }
          })
          this.list = list;
        }
      });
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
// @import '../assets/table.less';
/deep/ .el-dialog__body .scrollbar .el-scrollbar__wrap {
  height: 100%;
}

/deep/ .el-pagination {
  padding: 5px 5px !important;
  text-align: right;
  margin: 10px 0;
}

/deep/ .el-pagination__total {
  color: #fff;
}

/deep/.el-dialog__header {
  background: rgba(13, 64, 105, 0.5) !important;
  border-radius: 0 !important;
}

/deep/.el-dialog__title {
  color: #fff !important;
}

/deep/.el-dialog__close {
  color: #fff !important;
}

/deep/.el-dialog__body {
  padding: 0 !important;
  height: calc(100vh - 150px) !important;
}

/deep/.el-dialog {
  background: none !important;
}

.dialog-box {
  padding: 10px;
  background: rgba(13, 64, 105, 0.5) !important;
  // height: 80vh;
}
</style>
<style scoped>
/* 添加样式来设置表格容器的高度，激活滚动条 */
.table-container {
  width: 100%;
  height: 100px;
  /* 设置表格容器的高度 */
  overflow-y: auto;
}
</style>