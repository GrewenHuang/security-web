<template>
  <page-layout
    class="production-accident"
    :loading="loading"
    :pages="pages"
    @current-change="handleCurrentChange"
  >
    <!-- 条件栏 开始 -->
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-select
          placeholder="事件类型"
          clearable
          v-model="filters.AccidentTypeCode"
          style="min-width: 180px"
        >
          <el-option
            v-for="(item, index) in AccidentTypeList"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-input
          v-model="filters.EventReportName"
          placeholder="事件名称"
          clearable
        ></el-input>
        <el-input
          v-model="filters.UserNameOrVehicleNo"
          placeholder="责任人车牌"
          clearable
        ></el-input>
        <el-select
          placeholder="责任归属"
          clearable
          v-model="filters.AccidentNatureCode"
          style="min-width: 180px"
        >
          <el-option
            v-for="(item, index) in AccidentList"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select v-model="filters.Status" placeholder="是否结案" clearable>
          <el-option label="未结案" :value="0"></el-option>
          <el-option label="已结案" :value="1"></el-option>
        </el-select>
        <el-button type="primary" @click="getFirstPage()">查询</el-button>
        <el-popover width="400" trigger="click">
          <div>
            <el-date-picker
              v-model="timeData"
              type="daterange"
              @change="onChangeDate"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
          <el-button slot="reference" type="text">更多筛选</el-button>
        </el-popover>
      </div>
      <div class="f--c">
        <el-button-group style="margin-right: 20px;">
          <el-button
            @click="downloadmbs(1210, 12105, filters)"
            v-if="$_has('SJGLBtnExport')"
            >导出台账</el-button
          >
          <el-button
            @click="downloadmbs(1210, 12106, filters)"
            v-if="$_has('SJGLBtnDA')"
            >导出档案</el-button
          >
        </el-button-group>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addRecord()"
          v-if="$_has('SJGLBtnAdd')"
          >新增快报</el-button
        >
      </div>
    </div>
    <!-- 条件栏 结束 -->

    <!--列表 开始-->
    <el-table
      :data="list"
      highlight-current-row
      :header-cell-style="$tableStyle"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
			    type="selection"
			    width="55"
			    align="center"
			> -->
      <!-- </el-table-column> -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
        header-align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        label="事件类型"
        align="center"
        header-align="center"
        prop="AccidentTypeCodeDesc"
        width="150"
      >
        <template slot-scope="{ row }">
          <span>{{ getTypeText(row.AccidentTypeCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="事件名称"
        align="center"
        header-align="center"
        prop="EventReportName"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="事故时间"
        align="center"
        header-align="center"
        prop="EventReportTimeDesc"
        width="130"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="事故地点"
        align="center"
        header-align="center"
        prop="Place"
        width="130"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="涉事人员"
        align="center"
        header-align="center"
        prop="ResponsibleUserName"
        width="130"
      >
      </el-table-column>
      <el-table-column
        label="涉事车辆/仓库"
        align="center"
        header-align="center"
        width="130"
      >
        <template slot-scope="{ row }">
          <span v-if="row.AccidentTypeCode == '009419'">{{
            row.LicensePlateNumber
          }}</span>
          <span v-if="row.AccidentTypeCode == '009420'">{{
            row.WarehouseSetName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="受伤人数(人)"
        align="center"
        header-align="center"
        prop="GetHurtCount"
        width="155"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="直接经济损失(元)"
        align="center"
        header-align="center"
        width="155"
        prop="LossAmount"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="理赔金额"
        align="center"
        header-align="center"
        prop="LossAmount"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="事故等级"
        align="center"
        header-align="center"
        prop="SubjectiveReason"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- <el-table-column label="调查报告" align="center" header-align="center" prop="SubjectiveReason" width="100"
				show-overflow-tooltip>
				<template slot-scope="{row}">
					<whether :yes="row.EventReportInvestigateId > 0"
						:text="row.EventReportInvestigateId > 0 ? '完成' : '未完成'" />
				</template>
			</el-table-column> -->
      <!-- <el-table-column label="约谈" align="center" header-align="center" prop="SubjectiveReason" width="100"
				show-overflow-tooltip>
				<template slot-scope="{row}">
					<whether :yes="row.InterviewId > 0" :text="row.InterviewId > 0 ? '完成' : '未完成'" />
				</template>
			</el-table-column> -->
      <el-table-column
        label="培训"
        align="center"
        header-align="center"
        prop="SubjectiveReason"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <whether
            :yes="row.TrainTaskId > 0"
            :text="row.TrainTaskId > 0 ? '完成' : '未完成'"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="结案状态"
        align="center"
        header-align="center"
        width="90"
      >
        <template slot-scope="{ row }">
          <whether
            :yes="row.Status == 1"
            :text="row.Status == 1 ? '已结案' : '未结案'"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="上报人"
        align="center"
        header-align="center"
        prop="CreateByName"
        width="100"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        header-align="center"
        width="240"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="table-operation">
            <el-button
              type="text"
              @click="addRecord(scope.row, true)"
              v-if="$_has('SJGLBtnLook') && scope.row.Status == 1"
              >查看</el-button
            >
            <el-button
              type="text"
              @click="examineRecord(scope.row, false)"
              v-if="$_has('SJGLBtnSJTD')"
              >事件调查</el-button
            >

            <!-- <el-button
                                type="text"
                                @click="downloadmbs(1210, 12103, scope.row.ProductionAccidentId)">下载</el-button> -->
            <el-popconfirm
              v-if="$_has('SJGLBtnDelete')"
              title="确认删除吗？"
              @confirm="scope.row;"
            >
              <el-button slot="reference" type="text" text-plain
                >删除</el-button
              >
            </el-popconfirm>
            <el-popover trigger="click">
              <div class="btn-box">
                <el-button-group style="margin-right: 20px;">
                  <el-button
                    type="text"
                    @click="addRecord(scope.row, false)"
                    v-if="$_has('SJGLBtnEdit') && scope.row.Status == 0"
                    >编辑</el-button
                  >

                  <!-- <el-button type="text" @click="getInterview(scope.row,1)"
										v-if="$_has('SJGLBtnYT')">约谈</el-button> -->
                  <el-button
                    type="text"
                    @click="getTrain(scope.row)"
                    v-if="$_has('SJGLBtnPX')"
                    >培训</el-button
                  >
                  <el-button
                    type="text"
                    @click="closeCase(scope.row, false)"
                    v-if="scope.row.Status == 0"
                    >结案</el-button
                  >
                  <el-button
                    type="text"
                    @click="onPdf(scope.row)"
                    v-if="$_has('SJGLBtnSCKCKJ') && scope.row.Status == 1"
                    >生成课程课件</el-button
                  >
                </el-button-group>
              </div>
              <el-button slot="reference" type="text" v-if="$_has('SJGLBtnCZ')"
                >更多</el-button
              >
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-dialog-drag
      title="选择人员"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      @close="close"
      top="8vh"
      width="30%"
    >
      <el-form :rules="rules" class="container" ref="form" :model="info">
        <el-form-item label="事故结案推送人员" prop="EventReportUsers">
          <el-input
            placeholder="请选择"
            readonly
            v-model="info.EventReportUsersName"
            class="input-with-select"
          >
            <template v-if="!!info.EventReportUsersName">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取消</el-button>
        <el-button type="primary" @click="submit()" :loading="isSaveLoading"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!-- 列表 结束 -->
    <interview ref="interview" @success="getFirstPage"></interview>
    <add
      ref="productionAccidentAdd"
      @success="getFirstPage"
      :AccidentList="AccidentList"
      :AccidentLevelList="AccidentLevelList"
      :AccidentTypeList="AccidentTypeList"
      :warehouseList="warehouseList"
    />
    <examine ref="productionAccidentExamine" @success="getFirstPage" />
    <train ref="train" @success="getFirstPage"></train>
    <addPdf
      ref="addPdf"
      :AccidentList="AccidentList"
      @success="getFirstPage"
      :AccidentLevelList="AccidentLevelList"
      :AccidentTypeList="AccidentTypeList"
    ></addPdf>
  </page-layout>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import add from "./add";
import train from "./train";
import interview from "../appointmentmanagement/info";
import addPdf from "./addPdf";
import examine from "./examine";
export default {
  name: "production-accident",
  components: {
    add,
    train,
    interview,
    addPdf,
    examine
  },
  mixins: [request_mixin, upload_mixin, Download, Import_export],
  data() {
    return {
      //分页
      pages: {
        total: 0,
        page: 1,
        rows: 10
      },
      timeData: [],
      filters: {
        AccidentTypeCode: "",
        EventReportName: "",
        UserNameOrVehicleNo: "",
        EventReportStartTime: "",
        EventReportEndTime: "",
        AccidentNatureCode: "",
        Status: ""
      }, // 查询条件
      loading: false,
      list: [],
      AccidentList: [],
      AccidentLevelList: [],
      AccidentTypeList: [],
      warehouseList: [],
      isShow: false,
      EventRepotId: "",
      isSaveLoading: false,
      info: {
        EventReportUsersName: "",
        EventReportUsers: []
      },
      rules: {
        EventReportUsers: [
          {
            required: true,
            type: "array",
            message: "请选择事故结案推送人员"
          }
        ]
      }
    };
  },

  methods: {
    handleSelectionChange(val) {
      //选择下载对象
      // this.multipleSelection = val;
    },
    getTypeText(id) {
      let filteredNames = this.AccidentTypeList.filter(item => item.id == id);
      if (filteredNames && filteredNames.length > 0) {
        return filteredNames[0].text;
      }
    },
    onChangeDate(e) {
      if (e) {
        this.filters.EventReportStartTime = e[0];
        this.filters.EventReportEndTime = e[1];
      } else {
        this.filters.EventReportStartTime = "";
        this.filters.EventReportEndTime = "";
      }

      // 选择时间
    },
    getInterview(item, type) {
      //约谈
      this.$refs.interview.show(item, type);
    },
    addRecord(item, isPreview) {
      //新增
      this.$refs.productionAccidentAdd.show(item, isPreview);
    },
    examineRecord(item, isPreview) {
      //事件调查
      this.$refs.productionAccidentExamine.show(item, isPreview);
    },
    getTrain(item) {
      // 培训
      this.$refs.train.show(item);
    },
    onPdf(item) {
      this.$refs.addPdf.show(item);
    },
    close() {
      this.isShow = false;
      this.removeItem();
    },
    chooseUser() {
      this.$chooseUser({
        single: true,
        choosed: this.info.EventReportUsers
      }).then(res => {
        this.info.EventReportUsers = res.map(item => item.UserId);
        this.info.EventReportUsersName = res
          .map(item => item.UserName)
          .join(",");
      });
    },
    removeItem() {
      this.info = {
        EventReportUsersName: "",
        EventReportUsers: []
      };
    },
    closeCase(row) {
      this.EventRepotId = row.EventReportId;
      this.$confirm("确定结案?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isShow = true;
        })
        .catch(() => {});
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        this.isSaveLoading = true;
        let res = await this.Post("/SaveEventReportUsers", {
          EventReportId: this.EventRepotId,
          EventReportUsers: this.info.EventReportUsers
        });
        if (res.status === 2000) {
          this.close();
          this.getFirstPage();
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.message);
        }
        this.isSaveLoading = false;
      });
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
      this.loading = true;
      let res = await this.Post("/GetEventReports", params);
      if (res.status === 2000) {
        let { list, count: total, page, rows } = res.data;
        this.list = list;
        this.pages.total = total;
        this.pages.page = page;
        this.pages.rows = rows;
      }
      this.loading = false;
    },
    getFirstPage() {
      this.pages.page = 1;
      this.getList();
    },
    async removeVoyageLog(item) {
      let res = await this.Post("/DeleteEventReport", {
        EventReportId: item.EventReportId
      });
      if (res.status === 2000) {
        this.$message.success("删除成功");
        this.getList();
      }
    }
  },
  async created() {},
  mounted() {
    // 责任归属
    this.Get("/GetAccidentNatureCom").then(res => {
      if (res.status == 2000) {
        this.AccidentList = res.data;
      }
    });
    // 事故等级
    this.Get("/GetAccidentlevelCom").then(res => {
      if (res.status == 2000) {
        this.AccidentLevelList = res.data;
      }
    });
    // 事故类型
    this.Get("/GetAccidentTypeCom").then(res => {
      if (res.status == 2000) {
        this.AccidentTypeList = res.data;
      }
    });
    // 仓库
    this.Post("/GetWarehouseSetList", {
      page: 1,
      rows: 9999
    }).then(res => {
      if (res.status == 2000) {
        this.warehouseList = res.data.list;
      }
    });
    this.getFirstPage();
  }
};
</script>
<style lang="scss" scoped>
.production-accident {
  .status {
    color: #f56c6c;

    &.complete {
      color: #67c23a;
    }
  }
}

.btn-box {
  display: flex;

  /deep/ .el-button {
    margin-right: 10px;
  }
}
</style>
