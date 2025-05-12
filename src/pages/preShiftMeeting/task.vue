<template>
  <page-layout
    :loading="loading"
    :pages="pages"
    @current-change="handlePageChange"
  >
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-form :model="filters" :inline="true">
          <el-form-item>
            <select-enterpirse
              clearable
              placeholder="企业"
              collapseTags
              v-model="filters.EnterpriseId"
            ></select-enterpirse>
          </el-form-item>
          <el-form-item>
            <cascader-department
              placeholder="部门"
              clearable
              v-model="filters.DepartmentId"
              :enterpriseId="filters.EnterpriseId"
              :disabled="!filters.EnterpriseId ? true : false"
            ></cascader-department>
            <!-- 	<cascader-fleet placeholder="所属车队" clearable
							v-model="filters.VehicleGroupSetId"></cascader-fleet> -->
          </el-form-item>
          <el-form-item>
            <select-position
              v-model="filters.PositionId"
              clearable
              :multiple="false"
              placeholder="岗位"
            ></select-position>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="任务名称"
              clearable
              v-model="filters.PlanName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="姓名"
              clearable
              v-model="filters.LeaderName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePageChange(1)"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="f--c">
        <el-button type="primary" @click="add()" v-if="$_has('BQHRWBtnAdd')"
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
        label="企业"
        align="center"
        prop="EnterpriseName"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="部门"
        align="center"
        prop="DepartmentName"
        width="180"
      >
      </el-table-column>
      <!-- <el-table-column label="车队" align="center" prop="VehicleGroupSetName">
			</el-table-column> -->
      <el-table-column label="岗位" align="center" prop="PositionName">
      </el-table-column>
      <el-table-column label="任务名称" align="center" prop="PlanName">
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="LeaderName">
      </el-table-column>
      <el-table-column label="生成方式" align="center" prop="LeaderName">
        <template slot-scope="{ row }">
          {{
            row.CreateType == 1
              ? "每日"
              : row.CreateType == 2
              ? "工作日"
              : row.CreateType == 3
              ? "加班日"
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column label="计划时间段" align="center">
        <template slot-scope="{ row }">
          {{ row.StartTime + "-" + row.EndTime }}
        </template>
      </el-table-column>
      <el-table-column label="安全等级" align="center" prop="SecurityLevelDesc">
      </el-table-column>
      <!-- <el-table-column label="本月召开情况" align="center" width="300">
				<template slot-scope="scope">
					<span>应召开{{scope.row.MeetingCount?scope.row.MeetingCount : 0}}场,</span>
					<span>已召开{{scope.row.PreMeetingSignMonthCount?scope.row.PreMeetingSignMonthCount : 0}}场,</span>
					<span>未召开{{scope.row.PreMeetingSignMonthNoCount?scope.row.PreMeetingSignMonthNoCount : 0}}场</span>
				</template>
			</el-table-column> -->
      <el-table-column label="创建人" align="center" prop="CreateByName">
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="CreateTimeDesc"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="{ row }">
          <div class="table-operation">
            <el-button
              type="text"
              @click="show(row, true)"
              v-if="$_has('BQHRWBtnZKXQ')"
              >召开详情</el-button
            >
            <el-button
              type="text"
              @click="add(row)"
              v-if="row.Status != 1 && $_has('BQHRWBtnEdit')"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="onCancel(row)"
              v-if="$_has('BQHRWBtnZF') && row.Status == 0"
              >中止</el-button
            >
            <el-button
              type="text"
              text-plain
              @click="remove(row)"
              v-if="$_has('BQHRWBtnDetele')"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-dialog-drag
      :title="title"
      :visible.sync="dislogShow"
      @close="close()"
      width="30%"
      top="8vh"
    >
      <el-scrollbar ref="scrollbar" class="scrollbar">
        <el-form ref="form" label-position="top" :model="form" :rules="rules">
          <el-form-item prop="PlanName" label="任务名称">
            <el-input
              v-model="form.PlanName"
              placeholder="任务名称"
              clearable
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <div style="display: flex">
            <el-form-item label="开始时段" style="width: 49%;" prop="StartTime">
              <el-time-select
                placeholder="开始时段"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:59'
                }"
                v-model="form.StartTime"
                style="width: 100%;"
                :disabled="isEdit"
              ></el-time-select>
            </el-form-item>
            <!-- <span style="white-space: pre;">-</span> -->
            <el-form-item
              label="结束时段"
              prop="EndTime"
              style="width: 49%;margin-left: 10px;"
            >
              <el-time-select
                placeholder="结束时段"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30',
                  minTime: form.StartTime
                }"
                v-model="form.EndTime"
                style="width: 100%;"
                :disabled="isEdit"
              ></el-time-select>
            </el-form-item>
          </div>
          <el-form-item prop="SecurityLevel" label="安全等级">
            <select-level
              v-model="form.SecurityLevel"
              :multiple="false"
              :value="form.SecurityLevel"
              :disabled="isEdit"
            ></select-level>
          </el-form-item>
          <el-form-item prop="dictId" label="班前会口号">
            <el-select v-model="form.dictId" filterable placeholder="请选择">
              <el-option
                v-for="item in dictList"
                :key="item.dictId"
                :label="item.name"
                :value="item.dictId"
              >
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item prop="WarehouseSetId" label="班组">
            <el-select v-model="form.WarehouseSetId" filterable placeholder="请选择班组">
              <el-option
                v-for="item in warehouseList"
                :key="item.WarehouseSetId"
                :label="item.WarehouseName"
                :value="item.WarehouseSetId"
              >
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="生成方式" prop="CreateType">
            <el-select
              placeholder="生成方式"
              clearable
              v-model="form.CreateType"
              style="width:100%"
            >
              <el-option label="每日" :value="1"></el-option>
              <el-option label="工作日" :value="2"></el-option>
              <el-option label="加班日" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="加班日"
            prop="OutWorkDay"
            v-if="form.CreateType == 3"
          >
            <el-date-picker
              style="width:100%"
              type="dates"
              v-model="form.OutWorkDay"
              placeholder="加班日"
              value-format="yyyy-MM-dd HH:mm"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="班组长" prop="Leaders" v-if="!isEdit">
            <el-input
              placeholder="请选择"
              readonly
              v-model="form.LeaderName"
              class="input-with-select"
            >
              <template v-if="!!form.LeaderName">
                <i
                  class="el-icon-error cursor-p f--c"
                  style="height: 100%;line-height: 40px;"
                  slot="suffix"
                  @click="removeItem(1)"
                ></i>
              </template>
              <el-button slot="append" @click="chooseUser(1)"
                >选择人员</el-button
              >
            </el-input>
          </el-form-item>
          <el-form-item label="班组长" prop="UserId" v-else>
            <el-input
              placeholder="请选择"
              readonly
              v-model="form.LeaderName"
              class="input-with-select"
            >
              <template v-if="!!form.LeaderName">
                <i
                  class="el-icon-error cursor-p f--c"
                  style="height: 100%;line-height: 40px;"
                  slot="suffix"
                  @click="removeItem(0)"
                ></i>
              </template>
              <el-button slot="append" @click="chooseUser(0)"
                >选择人员</el-button
              >
            </el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close()">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="save()"
          slot="reference"
          v-if="!isEdit"
          >提交</el-button
        >
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="updateSave()"
          slot="reference"
          v-else
          >保存</el-button
        >
      </div>
    </el-dialog>
    <info ref="info" v-if=""></info>
  </page-layout>
</template>

<script>
import request_mixins from "@/mixins/request-mixin";
import info from "./components/info.vue";
import RULECONFIG from "@/common/ruleConfig";
const defaultInfo = {
  StartTime: "",
  EndTime: "",
  SecurityLevel: "1",
  CreateType: "",
  OutWorkDay: "",
  Leaders: [],
  UserName: "",
  PlanName: "",
  LeaderName: "",
  UserId: "",
  dictId:"",
  WarehouseSetId:""
};

function _extends(obj) {
  return JSON.parse(JSON.stringify(obj));
}
export default {
  name: "task",
  components: {
    info
  },
  mixins: [request_mixins],
  data() {
    return {
      submitLoading: false,
      form: _extends(defaultInfo),
      title: "新增",
      dislogShow: false,
      loading: false,
      meetingStatus: {
        0: "未开始",
        1: "进行中",
        2: "已结束"
      },
      list: [],
      pages: {
        rows: 10,
        page: 1,
        total: 0
      },
      filters: {
        EnterpriseId: "",
        DepartmentId: "",
        PositionId: "",
        LeaderName: "",
        PlanName: ""
      },
      rules: {
        PlanName: RULECONFIG.Text("任务名称"),
        StartTime: RULECONFIG.Select("开始时段"),
        EndTime: RULECONFIG.Select("结束时段"),
        SecurityLevel: RULECONFIG.Select("安全等级"),
        dictId: RULECONFIG.Select("班前会"),
        WarehouseSetId: RULECONFIG.Select("班组"),
        CreateType: RULECONFIG.Select("生成方式"),
        OutWorkDay: RULECONFIG.Select("加班日"),
        Leaders: [
          {
            required: true,
            type: "array",
            message: "请选择班组长"
          }
        ],
        UserId: RULECONFIG.Select("班组长")
      },
      isEdit: false,
      dictList: [],
      warehouseList:[]
    };
  },
  mounted() {
    this.getDitySloagan();
    this.getWarehouseList()
  },
  created() {
    this.handlePageChange(1);
  },
  methods: {
    getWarehouseList(){
        let that = this;
        this.Post('/GetWarehouseSetList',{
          page:1,
          rows:999,

        }).then(res=>{
          console.log(res,'66666666666666666')
           if(res.status == 2000){
            that.warehouseList = res.data.list
           }
        })
    },
    getDitySloagan() {
      // 获取所有激活的口号
      this.Post("/GetDictsBakById", {
        dictId: "2",
        status: "0"
      }).then(res => {
        this.dictList = res.data;
      });
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
        let res = await this.Post("/GetPreMeetingSignLeaders", params);
        if (res.status === 2000) {
          this.list = res.data.list;
          this.pages.total = res.data.count;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    chooseUser(e) {
      if (e) {
        this.$chooseTask({
          single: true,
          choosed: this.form.Leaders
        }).then(personnel => {
          this.form.Leaders = personnel;
          this.form.LeaderName = personnel.map(item => item.UserName).join(",");
        });
      } else {
        this.$chooseTask({
          single: false
        }).then(personnel => {
          this.form.UserId = personnel.UserId;
          this.form.LeaderName = personnel.UserName;
        });
      }
    },
    removeItem(e) {
      // 删除所选人员
      if (e) {
        this.form.LeaderName = "";
        this.form.Leaders = [];
      } else {
        this.form.LeaderName = "";
        this.form.UserId = "";
      }
    },
    add(row) {
      this.submitLoading = false;
      this.dislogShow = true;
      if (row) {
        this.title = "编辑";
        this.isEdit = true;
        row.SecurityLevel = row.SecurityLevel.toString();
        if (row.OutWorkDay) {
          row.OutWorkDay = row.OutWorkDay.split(",");
        }
        this.form = _extends(row);
      } else {
        this.title = "新增";
        this.isEdit = false;
        this.form = _extends(defaultInfo);
      }
    },
    updateSave() {
      this.$refs.form.validate(async (valid, fields) => {
        for (let key in fields) {
          if (this.$refs[key]) {
            this.$refs.scrollbar.wrap.scrollTop = this.$refs[key].$el.offsetTop;
            break;
          }
        }
        if (valid) {
          this.submitLoading = true;
          this.loading = true;
          let params = {
            ...this.form
          };
          params.SecurityLevel = parseInt(params.SecurityLevel);
          if (params.OutWorkDay && params.OutWorkDay.length > 0) {
            params.OutWorkDay = params.OutWorkDay.join(",");
          }
          this.Post("/UpdatePreMeetingSignLeader", params).then(res => {
            if (res.status == 2000) {
              this.dislogShow = false;
              this.$message.success("保存成功");
              this.submitLoading = false;
              this.getList();
            } else {
              this.$message.error(res.message);
            }
          });
        }
        this.loading = false;
      });
    },
    save() {
      this.$refs.form.validate(async (valid, fields) => {
        for (let key in fields) {
          if (this.$refs[key]) {
            this.$refs.scrollbar.wrap.scrollTop = this.$refs[key].$el.offsetTop;
            break;
          }
        }
        if (valid) {
          this.submitLoading = true;
          this.loading = true;
          let params = {
            ...this.form
          };
          params.SecurityLevel = parseInt(params.SecurityLevel);
          if (params.OutWorkDay && params.OutWorkDay.length > 0) {
            params.OutWorkDay = params.OutWorkDay.join(",");
          }
          this.Post("/SavePreMeetingSignLeader", params).then(res => {
            if (res.status == 2000) {
              this.dislogShow = false;
              this.$message.success("保存成功");
              this.submitLoading = false;
              this.getList();
            } else {
              this.$message.error(res.message);
            }
          });
        }
        this.loading = false;
      });
    },
    close() {
      this.dislogShow = false;
    },
    show(row) {
      this.$refs.info.show(row);
    },
    onCancel(row) {
      this.$confirm("确认中止当前任务吗？").then(_ => {
        this.Post("/CancelPreMeetingSignLeader", {
          Ids: [row.PreMeetingSignLeaderId]
        }).then(res => {
          if (res.status == 2000) {
            this.getList();
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    remove(row) {
      this.$confirm("确认删除该条数据吗？").then(_ => {
        this.Post("/DeletePreMeetingSignLeader", {
          Ids: [row.PreMeetingSignLeaderId]
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
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .input-content .el-form-item {
  margin-bottom: 0 !important;
}
</style>
