<template>
  <page-layout
    :loading="loading"
    :pages="pages"
    @current-change="handlePageChange"
  >
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-select
          v-model="filters.EnterpriseId"
          placeholder="企业"
          clearable
          collapseTags
        >
          <el-option
            v-for="(item, index) in EnterpriseList"
            :key="index"
            :label="item.EnterpriseName"
            :value="item.EnterpriseId"
          >
          </el-option>
        </el-select>
        <el-select
          clearable
          placeholder="证件类型"
          v-model="filters.CertificateType"
        >
          <el-option
            v-for="(item, index) in certTypes"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          clearable
          placeholder="证件名称"
          v-model="filters.CertificateName"
        ></el-input>
        <el-input
          clearable
          placeholder="过期内容"
          v-model="filters.FiledName"
        ></el-input>
        <el-input
          clearable
          placeholder="证件归属"
          v-model="filters.AscriptionName"
        ></el-input>
        <cascader-fleet
          placeholder="所属车队"
          clearable
          v-model="filters.VehicleGroupSetId"
          style="width: 200px;"
        ></cascader-fleet>
        <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
      </div>
      <div class="f--c">
        <el-button @click="onNotify" v-if="$_has('ZJDQTXBtnNotice')"
          >通知</el-button
        >
        <el-button
          @click="downloadmbs(130, 1301, filters)"
          v-if="$_has('ZJDQTXBtnExport')"
          >导出</el-button
        >
      </div>
    </div>
    <el-table
      :data="list"
      highlight-current-row
      :header-cell-style="$tableStyle"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="listTable"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="50">
      </el-table-column>
      <el-table-column
        label="企业"
        align="center"
        width="150"
        prop="EnterpriseName"
      >
      </el-table-column>
      <el-table-column label="车队" align="center" prop="VehicleGroupSetName">
      </el-table-column>
      <el-table-column label="证件类型" align="center" width="110">
        <template slot-scope="{ row }">
          {{ certTypes.filter(item => row.CertificateType == item.id)[0].name }}
        </template>
      </el-table-column>
      <el-table-column label="车牌" align="center">
        <template slot-scope="{ row }">
          {{
            row.CertificateType == 1
              ? row.EnterpriseName
              : row.CertificateType == 2
              ? row.UserName
              : row.CertificateType == 3
              ? row.VehicleLicensePlateNumber
              : row.CertificateType == 4
              ? row.EquipmentName
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="证件名称"
        align="center"
        prop="CertificateName"
        width="210"
      >
      </el-table-column>

      <el-table-column label="过期内容" align="center" prop="FiledName">
      </el-table-column>
      <!-- <el-table-column
        label="有效期（截止）"
        align="center"
        width="150"
        prop="ExpirationTimeDesc"
      >
      </el-table-column> -->
      <el-table-column
        label="有效期（截止）"
        align="center"
        width="150"
        prop="FiledValue"
      >
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{ row }">
          <whether :yes="row.Type == 10" :text="row.TypeDesc" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="{ row }">
          <div class="table-operation">
            <el-button
              type="text"
              @click="show(row)"
              v-if="$_has('ZJDQTXBtnLook')"
              >查看</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div slot="NumSelection">
      <div class="Num-box">
        共<span>{{ list.length }}</span
        >条
      </div>
    </div>
    <info ref="info1" edit-title="编辑企业证件" @load="handlePageChange(1)" />
    <info1 ref="info2" edit-title="编辑车辆证件" @load="handlePageChange(1)" />
    <info2 ref="info3" edit-title="编辑人员证件" @load="handlePageChange(1)" />
    <info3 ref="info4" edit-title="编辑设备证件" @load="handlePageChange(1)" />
  </page-layout>
</template>

<script>
import request_mixins from "@/mixins/request-mixin";
import info from "../enterprise/info.vue";
import info1 from "../vehicle/info.vue";
import info2 from "../personnel/info.vue";
import info3 from "../equipment/info.vue";
import Import_export from "@/mixins/Import_export.js";
export default {
  components: {
    info,
    info1,
    info2,
    info3
  },
  mixins: [request_mixins, Import_export],
  data() {
    return {
      loading: false,
      list: [],
      EnterpriseList: [],
      pages: {
        rows: 10,
        page: 1,
        total: 0
      },
      certTypes: [
        {
          id: 1,
          name: "企业"
        },
        {
          id: 2,
          name: "人员"
        },
        {
          id: 3,
          name: "车辆"
        },
        {
          id: 4,
          name: "设备"
        }
      ],
      filters: {},
      multipleSelection: []
    };
  },
  computed: {
    // isRAB() {
    //     // 是否为路桥
    //     let enterpriseInfo = JSON.parse(localStorage.getItem('enterpriseInfo'))
    //     return 1 || enterpriseInfo.IndustryCode == '500542001'
    // },
  },
  created() {
    // if (this.isRAB) {
    //     this.certTypes = this.certTypes.filter(item => item.name != '车辆');
    // }
    this.handlePageChange(1);
    this.GetEnterpriseList();
  },
  methods: {
    GetEnterpriseList() {
      this.Post("/GetSubEnterpriseList", {
        page: 1,
        rows: 9999
      }).then(res => {
        if (res.status == 2000) {
          this.EnterpriseList = res.data;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePageChange(val) {
      this.pages.page = val;
      this.getList();
    },
    onNotify() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let params = {
          Members: this.multipleSelection,
          TypeFor: 1
        };
        this.Post("/SaveBatchNotify", params).then(res => {
          if (res.status == 2000) {
            this.$message.success("下发成功");
            this.$refs.listTable.clearSelection();
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        this.$message.error("请选择证件");
      }
    },
    async getList() {
      let params = {
        ...this.pages,
        ...this.filters
      };
      this.loading = true;
      try {
        let res = await this.Post("/GetCertificateExpirationList", params);
        if (res.status === 2000) {
          this.list = res.data.list;
          this.pages.total = res.data.count;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    show(item) {
      let el = this.$refs["info" + item.CertificateType];
      if (el) {
        el.show(item, item.CertificateType, item.CertificateClassification);
      }
    }
  }
};
</script>

<style scoped lang="less">
.Num-box {
  width: 100%;
  text-align: right;
  span {
    margin: 0 10px;
  }
}
</style>
