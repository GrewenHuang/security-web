<template>
  <page-layout
    :loading="loading"
    :pages="pages"
    @current-change="handlePageChange"
  >
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-select
          placeholder="操作类型"
          clearable
          v-model="filters.ControllerDescription"
          style="min-width: 180px"
        >
          <el-option
            v-for="(item, index) in TypeCom"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-input
          placeholder="内容"
          clearable
          v-model="filters.ActionDescription"
        ></el-input>
        <el-input
          placeholder="操作人"
          clearable
          v-model="filters.UserName"
        ></el-input>

        <el-select
          v-model="filters.DepartmentName"
          filterable
          clearable
          placeholder="请选择部门"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-date-picker
          v-model="timeData"
          type="daterange"
          @change="onChangeDate"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>

        <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
        <el-button @click="downloadmbs(30101, 30102, filters)">导出</el-button>
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
        label="操作类型"
        align="center"
        prop="ControllerDescriptionName"
      >
      </el-table-column>
      <el-table-column
        label="操作内容"
        align="center"
        prop="ActionDescriptionName"
      >
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="UserName">
      </el-table-column>
      <el-table-column label="部门" align="center" prop="DepartmentName">
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="CreateTimeDesc">
      </el-table-column>
    </el-table>
  </page-layout>
</template>

<script>
import request_mixins from "@/mixins/request-mixin";
import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";
import page_mixin from "@/mixins/page-minxin.js";

export default {
  mixins: [request_mixins, Download, Import_export, page_mixin],
  data() {
    return {
      loading: false,
      list: [],
      options: [],
      pages: {
        rows: 10,
        page: 1,
        total: 0
      },
      timeData: [],
      TypeCom: [],
      filters: {}
    };
  },
  mounted() {
    this.Get("/GetLogActionDropDownList").then(res => {
      if (res.status == 2000) {
        this.TypeCom = res.data;
      }
    });
    this.handlePageChange(1);
    this.getDepartmentNames();
  },
  methods: {
    getDepartmentNames(id = 4785056618100065) {
      // 获取部门
      let that = this;
      this.Get("/GetTreeEnterpriseDepartments?enterpriseId=" + id).then(res => {
        let newList = [];
        console.log("所有部门", res);
        if (res.status == 2000) {
          if (res.data && res.data.length > 0) {
            let list = JSON.parse(JSON.stringify(res.data));
            that.getNewList(list, newList);
            that.options = newList;
          }
        }
      });
    },
    getNewList(list, newList) {
      let that = this;
      list.forEach(item => {
        let obj = {
          label: "",
          value: ""
        };
        if (item.Name) {
          obj.label = item.Name;
          obj.value = item.Name;
          if (item.children && item.children.length > 0) {
            newList.push(obj);
            that.getNewList(item.children, newList);
          } else {
            newList.push(obj);
          }
        }
      });
    },
    onChangeDate(e) {
      // 选择时间
      if (e) {
        this.filters.LoginDate = e[0];
        this.filters.LoginEndDate = e[1];
      } else {
        this.filters.LoginDate = "";
        this.filters.LoginEndDate = "";
      }
    },
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
        let res = await this.Post("/GetEnterpriseLogActionList", params);
        if (res.status === 2000) {
          this.list = res.data.list;
          this.pages.total = res.data.count;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
