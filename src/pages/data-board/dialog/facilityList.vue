<template>
  <div>
    <el-table
      :data="facilityList"
      highlight-current-row
      :header-cell-style="tableStayle"
      @row-click="onClickDetail"
      style="min-height: 600px"
    >
      <el-table-column label="序号" type="index" align="center" width="50">
      </el-table-column>
      <el-table-column
        label="仓库"
        align="center"
        show-overflow-tooltip
        prop="WarehouseName"
      >
      </el-table-column>
      <el-table-column
        label="设备名称"
        align="center"
        show-overflow-tooltip
        prop="EquipmentName"
      >
      </el-table-column>
      <el-table-column
        label="自编号"
        align="center"
        show-overflow-tooltip
        prop="EquipmentTypeName"
      >
      </el-table-column>
      <el-table-column
        label="设备类型"
        align="center"
        show-overflow-tooltip
        prop="EquipmentTypeName"
      >
      </el-table-column>

      <el-table-column
        label="使用位置"
        align="center"
        show-overflow-tooltip
        prop="UseLocation"
      >
      </el-table-column>
      <el-table-column
        label="负责人"
        align="center"
        show-overflow-tooltip
        prop="ResponsibleUserName"
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
      facilityList: [],
      ImgHH,
      pages: {
        total: 0,
        page: 1,
        rows: 10,
      },
    };
  },
  props: ["EnterpriseId", "WarehouseSetId"],
  watch: {},
  created() {},
  mounted() {
    this.handleCurrentChange(1);
  },
  activated: function () {
    console.log(88888);

    //生命周期函数里面
    this.handleCurrentChange(1);
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val);

      this.pages.page = val;
      this.getfacilityList();
    },
    onClickDetail(event) {
      console.log(event);
      this.$emit("success", event);
    },
    getfacilityList() {
      console.log("getfacilityList");
      const dCarloading = this.$loading({
        lock: true,
        text: "设备设施数据加载中，请稍等...",
        spinner: "el-icon-loading",
        color: "#fff",
        background: "rgba(0, 0, 0, .3)",
      });

      this.Post("/GetEquipmentManages", {
        page: this.pages.page,
        rows: this.pages.rows,
        WarehouseSetId: this.WarehouseSetId,
        EnterpriseId: this.EnterpriseId,
      }).then((res) => {
        if (res.status == 2000) {
          // res.data.list = res.data.list.filter(
          //   (item) => !item.LicensePlateNumber.includes("挂")
          // );
          this.facilityList = res.data.list;
          this.pages.total = res.data.count;
          dCarloading.close();
        } else {
          dCarloading.close();
        }
      });
    },
    // getList(EnterpriseId, data, dep) {
    //   console.log(EnterpriseId, data, dep);
    //   const dPerloading = this.$loading({
    //     lock: true,
    //     text: "人员数据加载中，请稍等...",
    //     spinner: "el-icon-loading",
    //     color: "#fff",
    //     background: "rgba(0, 0, 0, .3)",
    //   });
    //   this.Post("/GetEnterpriseAllUsers", {
    //     page: this.pages.page,
    //     rows: this.pages.rows,
    //     Type: data,
    //     EnterpriseId: EnterpriseId,
    //     // IsEntryThisYear: data,
    //     DepartmentId: dep,
    //   }).then((res) => {
    //     if (res.status == 2000) {
    //       this.facilityList = res.data.list;
    //       this.pages.total = res.data.count;
    //       dPerloading.close();
    //     } else {
    //       dPerloading.close();
    //     }
    //   });
    // },
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