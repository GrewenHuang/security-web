<!-- 防护用品库存 -->
<template>
  <page-layout
    class="protective-equipment warp"
    :loading="loading"
    :pages="pages"
    @current-change="handleCurrentChange"
  >
    <!-- 条件栏 开始 -->
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-input
          v-model="filters.CertificateTitle"
          placeholder="资质名称名称"
          clearable
        ></el-input>
        <el-button type="primary" @click="getFirstPage()">查询</el-button>
      </div>
      <div>
        <el-button-group>
          <el-button type="primary" @click="add()">新增</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="imageBox">
      <el-card v-for="(item, index) in list" :key="item.id">
        <!--       fit="fill"   CertificateTitle    fit="fill" -->
        <el-image
        style="width:100%;height: 232px;"

          :src="item.CertificateImage"
          :preview-src-list="[item.CertificateImage]"
        >
        </el-image>
        <div>{{ item.CertificateTitle }}</div>
      </el-card>

    </div>
    <!--列表 开始-->
    <add v-if="addShow" @closeClick="closeClick"></add>
  </page-layout>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import add from "./addList.vue";

export default {
  components: {
    add
  },
  mixins: [request_mixin, upload_mixin, Download, Import_export],
  data() {
    return {
      //分页
      pages: { total: 0, page: 1, rows: 10 },
      filters: {
        CertificateTitle: "" // 品名
      }, // 查询条件
      loading: false,
      list: [],
      addShow: false
    };
  },

  methods: {
    closeClick(e) {
      this.addShow = false;
      if (e) {
        // 跟新数据
        this.getList()
      }
    },

    view(item) {
      this.$refs.detail.show(item);
    },
    //分页事件
    handleCurrentChange(val) {
      this.pages.page = val;
      this.getList();
    },
    getParams() {
      let params = {
        ...this.pages,
        ...this.filters
      };
      return params;
    },
    async getList() {
      let params = this.getParams();
      let res = await this.Post("/GetCertificatePage", params);
      if (res.status === 2000) {
        let { list, count: total, page, rows } = res.data;
        this.list = list;
        this.pages.total = total;
        this.pages.page = page;
        this.pages.rows = rows;
      }
    },
    getFirstPage() {
      this.pages.page = 1;

      this.getList();
    },
    async remove(item) {
      let res = await this.Get("/DeleteProtectiveAppliances", {
        ProtectiveAppliancesId: item.ProtectiveAppliancesId
      });
      if (res.status === 2000) {
        this.$message.success("删除成功");
        this.getList();
      }
    },
    add() {
      console.log("新增");
      // this.$refs.add.show();
      this.addShow = true;
    },
    inStorage(item) {
      this.$refs.warehousing.show(item);
    }
  },
  async mounted() {
    this.getFirstPage();
  }
};
</script>
<style lang="scss" scoped>
.protective-equipment {
  /deep/ .el-input--small {
    width: 180px;
  }
}
.imageBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

}
.imageBox::after{
  content: "";
    width: 30%;
}
.imageBox div:nth-child(n+3){
   margin-top: 15px;
}
.el-card {
  width: 30%;

  text-align: center;
  font-size: 16px;
  font-weight: 500;
}
</style>
