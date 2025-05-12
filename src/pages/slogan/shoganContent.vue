<template>
  <div class="contentBox">
    <el-row>
      <el-button type="primary" @click="addList">新增行</el-button>
      <!-- <el-button type="success">保存</el-button> -->
      <div class="radioBox">
        <el-radio v-model="radio" label="">全部</el-radio>
        <el-radio v-model="radio" label="0">激活</el-radio>
        <el-radio v-model="radio" label="1">注销</el-radio>
      </div>
    </el-row>
    <div class="tableBox">
      <el-table
        ref="singleTable"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column property="name" label="字典名称" width="120">
          <template slot-scope="scope">
            <div v-if="!scope.row.flag" @click="setDict(scope)">
              {{ scope.row.name }}
            </div>
            <el-input
              v-else
              v-model="scope.row.name"
              @blur="saveDict(scope)"
            ></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column property="remark" label="字典备注">

        </el-table-column> -->
        <el-table-column property="status" label="字典状态">
          <template slot-scope="scope">
            <div>
              <el-button type="success" v-if="scope.row.status == '0'"
                >激活</el-button
              >
              <el-button type="danger" v-else>注销</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="address" label="操作">
          <template slot-scope="scope">
            <div>
              <el-link
                type="success"
                :underline="false"
                style="border-right:1px solid #EBEEF5;padding-right: 5px;"
                @click="updata(scope, '0')"
                >激活</el-link
              >

              <el-link
                type="danger"
                :underline="false"
                @click="updata(scope, '1')"
                >注销</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import shoganContent from "./shoganContent.vue";
export default {
  mixins: [request_mixin],
  data() {
    return {
      radio: "0",
      tableData: [],
      preObj: {}
    };
  },
  props: {
    dictsObj: {
      typeof: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    dictsObj: {
      handler(newVal) {
        if (newVal.dictId) {
          this.preObj = JSON.parse(JSON.stringify(this.dictsObj));
          this.getDicts();
        }
      },
      deep: true,
      immediate: true
    },
    radio: {
      handler(newVal) {
        this.getDicts();
      }
    }
  },
  mounted() {},
  methods: {
    getDicts() {
      let that = this;
      let obj = {
        status: this.radio,
        dictId: this.preObj.dictId
      };
      if(!this.radio){
        delete obj.status
      }
      this.Post("/GetDictsBakById", obj).then(res => {
        if (res.status == "2000") {
          let list = res.data;
          list.forEach(item => {
            item.flag = false;
          });
          that.tableData = list;
        }
        console.log(res, "字典数据");
      });
    },
    setDict(scope) {
      let index = scope.$index;
      this.tableData[index].flag = true;
    },
    // 保存
    saveDict(scope) {
      let index = scope.$index;
      let row = scope.row;
      this.tableData[index].flag = false;
      if (!scope.row.name) {
        return;
      }
      console.log(scope.row.dictId, "scope.row.dictId");
      let obj = {
        name: scope.row.name,
        dictId: scope.row.dictId ? scope.row.dictId : "",
        parentId: scope.row.parentId,
        status: scope.row.status ? scope.row.status : "0"
      };
      console.log(obj, "保存值");
      this.saveDicts(obj);
    },
    saveDicts(data) {
      this.Post("/SaveDictsBak", data).then(res => {
        if (res.status == "2000") {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getDicts()
        }
      });
    },
    //新增行
    addList() {
      //  获取父元素id
      let parentId = this.preObj.dictId;
      let obj = {
        name: "",
        parentId: parentId,
        status: "0",
        flag: true
      };
      this.tableData.push(obj);
    },
    // 更新状态
    updata(scope, status) {
      let obj = {
        name: scope.row.name,
        parentId: scope.row.parentId,
        dictId: scope.row.dictId,
        status: status
      };
      this.saveDicts(obj)
    }
  }
};
</script>

<style scoped lang="scss">
.contentBox {
  padding: 15x;
}
.radioBox {
  float: right;
}
.tableBox {
  margin-top: 20px;
}
</style>
