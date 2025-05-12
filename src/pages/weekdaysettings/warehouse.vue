<template>
  <page-layout
    :loading="loading"
    :pages="pages"
    @current-change="handlePageChange"
  >
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-input
          placeholder="仓库名称"
          v-model="filters.WarehouseSetName"
          clearable
        ></el-input>
        <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
      </div>
      <div class="f--c">
        <el-button type="primary" @click="add()" v-if="$_has('CKSZBtnAdd')"
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
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column label="部门" align="center" prop="DepartmentName">
      </el-table-column>
      <el-table-column label="仓库名称" align="center" prop="WarehouseName">
      </el-table-column>
      <el-table-column label="仓库描述" align="center" prop="WarehouseDesc">
      </el-table-column>
      <el-table-column label="仓库负责人" align="center" prop="UserName">
      </el-table-column>
      <el-table-column
        label="创建人"
        align="center"
        prop="CreateByName"
      ></el-table-column>
      <el-table-column label="创建时间" align="center" prop="CreateTimeDesc">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="{ row }">
          <div class="table-operation">
            <el-button
              type="text"
              @click="add(row, true)"
              v-if="$_has('CKSZBtnEdit')"
              >编辑</el-button
            >
            <el-button
              type="text"
              text-plain
              @click="remove(row)"
              v-if="$_has('CKSZBtnDelete')"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-dialog-drag
      :title="title"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      @close="close"
      top="8vh"
      width="40%"
    >
      <el-form ref="form" label-position="top" :model="info" :rules="rules">
        <!-- matianci 20240923 -->
        <!-- 企业 -->
        <el-form-item label="企业" prop="EnterpriseId">
          <el-select
            v-model="info.EnterpriseId"
            filterable
            placeholder="请选择企业"
            @change="getDepartment"
          >
            <el-option
              v-for="(item, index) in enterpriseList"
              :key="index"
              :label="item.EnterpriseName"
              :value="item.EnterpriseId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="DepartmentIds">
          <el-cascader
            v-model="info.DepartmentIds"
            placeholder="选择部门"
            :options="departmentList"
            :disabled="!departmentList || departmentList.length < 1"
            @change="getChange"

            filterable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="仓库名称" prop="WarehouseName">
          <el-input
            v-model="info.WarehouseName"
            placeholder="仓库名称"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="仓库负责人" prop="UserName">
          <el-input
            placeholder="请选择"
            readonly
            v-model="info.UserName"
            class="input-with-select"
          >
            <template v-if="!!info.UserName">
              <i
                class="el-icon-error cursor-p f--c"
                style="height: 100%;line-height: 40px;"
                slot="suffix"
                @click="removeItem()"
              ></i>
            </template>
            <el-button slot="append" @click="chooseUser()">选择人员</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="仓库描述">
          <el-input
            type="textarea"
            placeholder="仓库描述"
            clearable
            maxlength="200"
            show-word-limit
            v-model="info.WarehouseDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close()">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submit()"
          slot="reference"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </page-layout>
</template>

<script>
import request_mixins from "@/mixins/request-mixin";
import RULECONFIG from "@/common/ruleConfig";

function _extends(obj) {
  return JSON.parse(JSON.stringify(obj));
}
const defaultInfo = {
  EnterpriseId: "",
  WarehouseName: "",
  WarehouseDesc: "",
  UserName: "",
  UserId: "",
  DepartmentId: "",
  DepartmentIds: [],
  WarehousesetId:''
};
export default {
  components: {},
  mixins: [request_mixins],
  data() {
    return {
      selected: "", //选择部门
      enterprise: "",
      enterpriseList: [], //企业
      departmentList: [], //部门


      submitLoading: false,
      title: "新增",
      isShow: false,
      loading: false,
      list: [],
      info: _extends(defaultInfo),
      pages: {
        rows: 10,
        page: 1,
        total: 0
      },
      filters: {},
      rules: {
        WarehouseName: RULECONFIG.Text("仓库名称"),
        UserName: RULECONFIG.Text("仓库负责人"),
        EnterpriseId: RULECONFIG.Text("企业"),
        DepartmentIds: RULECONFIG.Text("部门"),

      }
    };
  },
  created() {
    this.handlePageChange(1);
    this.geTenterpriseList();
  },
  watch: {
    enterprise: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getDepartment(newVal);
        } else {
          this.departmentList = [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getChange(e) {
      console.log("options", this.departmentList);
      console.log("model", this.info.DepartmentIds);
    },
    geTenterpriseList(itemVla) {


      if(itemVla && itemVla.WarehouseSetId){
        this.info.WarehousesetId = itemVla.WarehouseSetId
      }
      console.log(itemVla, this.info.WarehousesetId,'555555555555')
      //  matiani获取企业
      let that = this;
      this.Get("/GetSubEnterpriseListByAuthority").then(res => {
        if (res.status == 2000) {
          res.data.forEach(item => {
            item.EnterpriseId = `${item.EnterpriseId}`;
          });
          this.enterpriseList = res.data;
          if (itemVla && itemVla.EnterpriseId) {
            that.info.EnterpriseId = `${itemVla.EnterpriseId}`;
            that.getDepartment(that.info.EnterpriseId, itemVla);
          }else{
            this.info.WarehouseName =itemVla.WarehouseName
            this.info.WarehouseDesc =itemVla.WarehouseDesc
            this.info.UserName =itemVla.UserName
            this.info.UserId =itemVla.UserId
          }
        }
      });
    },

    getDepartment(enterpriseId, item) {
      let that = this;
      this.Get(
        "/GetDepartmentListByAuthority?enterpriseId=" + enterpriseId
      ).then(res => {
        if (res.status == 2000) {
          let list = JSON.parse(JSON.stringify(res.data));
          let newList = [];
          that.setDepartment(list, newList);
          that.departmentList = newList;
          console.log(that.departmentList,'departmentList')
          if (item) {
            that.$nextTick(() => {
              this.info.DepartmentIds = [];
              this.info.DepartmentIds = item.DepartmentIds.split(",").map(
                Number
              );
              that.info.WarehouseName =item.WarehouseName
              that.info.WarehouseDesc =item.WarehouseDesc
              that.info.UserName =item.UserName
              that.info.UserId =item.UserId

            });
          }
        }
      });
    },
    setDepartment(data, newData) {
      let that = this;
      if (data && data.length > 0) {
        data.forEach((item, index) => {
          // item.label = `${item.Name}`;
          let obj = {
            value: item.DepartmentId,
            label: item.Name
          };

          if (item.children && item.children.length < 1) {
            delete item.children;
          }
          if (item.children && item.children.length > 0) {
            obj.children = [];

            that.setDepartment(item.children, obj.children);
          }
          newData.push(obj);
        });
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
        let res = await this.Post("/GetWarehouseSetList", params);
        if (res.status === 2000) {
          this.list = res.data.list;
          this.pages.total = res.data.count;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    add(item) {
      this.isShow = true;
      if (item) {
        this.title = "编辑";
        // this.info = _extends(item);
        this.geTenterpriseList(item);
      } else {
        this.title = "新增";
        this.info = _extends(defaultInfo);
      }
    },
    remove(row) {
      this.$confirm("确认删除该条数据吗？").then(_ => {
        this.Get("/DeleteWarehouseSet", {
          warehouseSetId: row.WarehouseSetId
        }).then(res => {
          if (res.status == 2000) {
            this.getList();
            this.$message({
              message: "删除成功！",
              type: "success"
            });
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    removeInfo(index) {
      this.info.Users.splice(index, 1);
    },
    chooseUser() {
      this.$chooseUser({
        single: false
      }).then(res => {
        this.info.UserName = res.UserName;
        this.info.UserId = res.UserId;
      });
    },
    removeItem() {
      this.info.UserName = "";
      this.info.UserId = "";
    },
    async submit() {
      this.info.DepartmentId = this.info.DepartmentIds[
        this.info.DepartmentIds.length - 1
      ];
      this.info.DepartmentIds = this.info.DepartmentIds.join(",");
      this.$refs.form.validate(async valid => {
        if (!valid) return;

        let params = {
          ...this.info
        };
        params.GroupMembersJson = JSON.stringify(params.GroupMembersJson);
        this.submitLoading = true;
        let res = await this.Post("/SaveWarehouseSet", params);

        if (res.status === 2000) {
          this.close();
          this.handlePageChange(1);
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.message);
        }
        this.submitLoading = false;
      });
    },
    close() {
      this.isShow = false;
      this.submitLoading = false;
      this.enterprise = "";
      this.$nextTick(() => {
        this.info = _extends(defaultInfo);
      });
    }
  }
};
</script>

<style scoped lang="less"></style>
