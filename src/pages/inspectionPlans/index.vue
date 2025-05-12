<template>
  <page-layout
    :loading="loading"
    :pages="pages"
    @current-change="handlePageChange"
  >
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-input
          placeholder="检查人"
          clearable
          v-model="filters.InspectionUserName"
        ></el-input>
        <el-select
          placeholder="检查类型"
          clearable
          v-model="filters.InspectionNatureCode"
        >
          <el-option
            v-for="(item, index) in inspectionCycles"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          placeholder="检查计划名称"
          clearable
          v-model="filters.InspectionPlanName"
        ></el-input>
        <el-input
          placeholder="检查表"
          clearable
          v-model="filters.InspectionName"
        ></el-input>
        <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
      </div>
      <div class="f--c">
        <el-button-group style="margin-right: 10px;">
          <el-button
            @click="downloadmbs(1510, 15107, filters)"
            v-if="$_has('AQJCBtnExport')"
            >导出</el-button
          >
        </el-button-group>
        <el-button
          type="primary"
          @click="add()"
          v-if="$_has('AQJCBtnAdd') && !isRouter"
          >新增</el-button
        >
      </div>
    </div>
    <el-table
      :data="list"
      highlight-current-row
      :header-cell-style="$tableStyle"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" align="center" width="50">
      </el-table-column>
      <el-table-column
        label="部门"
        align="center"
        prop="DepartmentName"
      ></el-table-column>
      <el-table-column
        label="检查计划名称"
        align="center"
        prop="InspectionPlanName"
        show-overflow-tooltip
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="检查表"
        align="center"
        prop="InspectionName"
        show-overflow-tooltip
        width="150"
      >
      </el-table-column>

      <el-table-column
        label="检查类型"
        align="center"
        prop="InspectionNatureName"
      >
      </el-table-column>
      <el-table-column
        label="检查人"
        align="center"
        show-overflow-tooltip
        width="120"
      >
        <template slot-scope="{ row }">
          <template v-if="row.Enterprises.length">
            <span v-for="(item, i) in row.Enterprises" :key="i">
              <template v-if="item.EnterpriseUsers.length">
                {{ item.EnterpriseUsers.map(user => user.UserName).join("、") }}
              </template>
            </span>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="安全等级"
        align="center"
        width="80"
        prop="SecurityLevelDesc"
      ></el-table-column>
      <el-table-column label="创建人" align="center" prop="CreateByName">
      </el-table-column>
      <el-table-column label="创建日期" align="center" prop="CreateTimeDesc">
      </el-table-column>
      <el-table-column label="操作" align="center" width="360">
        <template slot-scope="{ row }">
          <div class="table-operation">
            <el-button
              type="text"
              @click="edit(row, false)"
              v-if="$_has('AQJCBtnEdit') && row.Status != 0"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="preview(row)"
              v-if="$_has('AQJCBtnLook') && row.Status != 0"
              >查看</el-button
            >
            <el-button
              type="text"
              @click="record(row)"
              v-if="$_has('AQJCBtnJCJL')"
              >检查记录</el-button
            >
            <el-button
              type="text"
              text-plain
              @click="cancel(row)"
              v-if="$_has('AQJCBtnZF') && !isRouter && row.Status != 0"
              >中止</el-button
            >
            <el-button
              type="text"
              @click="add(row, true)"
              v-if="$_has('AQJCBtnCOPY')"
              >复制</el-button
            >
            <el-button
              type="text"
              @click="detail(row)"
              v-if="$_has('AQJCBtnDelete') && row.Status == 0"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <info ref="info" @load="handlePageChange(1)" :isEditBtn="isEditBtn" />
    <preview ref="preview" />
    <records ref="records" />
  </page-layout>
</template>

<script>
import request_mixins from "@/mixins/request-mixin";
import info from "./info";
import preview from "./preview";
import records from "@/pages/inspectionRecords/plan-records";
import Import_export from "@/mixins/Import_export.js";
export default {
  components: {
    info,
    preview,
    records
  },
  mixins: [request_mixins, Import_export],
  props: {
    isRouter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEditBtn: false,
      loading: false,
      inspectionCycles: [],
      list: [],
      pages: {
        rows: 10,
        page: 1,
        total: 0
      },
      filters: {}
    };
  },
  created() {
    this.handlePageChange(1);
    this.getInspectionNatureCom();
  },
  methods: {
    handlePageChange(val) {
      this.pages.page = val;
      this.getList();
    },
    async getList() {
      let params = {
        ...this.pages,
        ...this.filters
      };
      this.loading = true;
      try {
        let res = await this.Post("/GetInspectionPlans", params);
        if (res.status === 2000) {
          this.list = res.data.list;
          this.pages.total = res.data.count;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    edit(row, copy) {
      this.isEditBtn = true;
      this.$refs.info.show(row, copy);
    },
    add(row, copy) {
      this.isEditBtn = false;
      this.$refs.info.show(row, copy);
    },
    detail(row) {
      this.$confirm("确认删除当前任务吗？", "提示", { type: "warning" }).then(
        _ => {
          this.Get("/DeleteInspectionPlan", {
            inspectionPlanId: row.InspectionPlanId
          }).then(res => {
            if (res.status == 2000) {
              this.getList();
              this.$message({
                message: "任务已删除！",
                type: "success"
              });
            } else {
              this.$message.error(res.message);
            }
          });
        }
      );
    },
    cancel(row) {
      this.$confirm("确认中止当前任务吗？", "提示", { type: "warning" }).then(
        _ => {
          this.Get("/CancelInspectionPlan", {
            inspectionPlanId: row.InspectionPlanId
          }).then(res => {
            if (res.status == 2000) {
              this.getList();
              this.$message({
                message: "任务已中止！",
                type: "success"
              });
            } else {
              this.$message.error(res.message);
            }
          });
        }
      );
    },
    async getInspectionNatureCom() {
      let res = await this.Get("/GetInspectionNatureCom");
      if (res.status == 2000) {
        this.inspectionCycles = res.data.filter(item => item.id != "0030408");
      }
    },
    record(row) {
      this.$refs.records.show(row);
    },
    preview(row) {
      // this.$refs.preview.show(row);
      this.$refs.info.show(row);
    }
  }
};
</script>

<style></style>
