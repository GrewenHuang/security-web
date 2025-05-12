<template>
    <page-layout
        :loading="loading"
        :pages="pages"
        @current-change="handleCurrentChange"
    >
        <!--工具条开始-->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select
                    v-model="filters.PotentialSource"
                    placeholder="请选择隐患来源"
                    clearable
                >
                    <el-option
                        v-for="item in SourceCom"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
                <el-input
                    v-model="filters.TextCondition"
                    clearable
                    placeholder="隐患项目/隐患内容/上报人"
                ></el-input>
                <div>
                    <el-date-picker
                        v-model="filters.StartSubmitDate"
                        type="date"
                        placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        clearable
                        @keyup.enter.native="handleSearch"
                    >
                    </el-date-picker>
                    <span
                        style="
                            line-height: 40px;
                            color: #ccc;
                            display: inline-block;
                            width: 13px;
                            white-space: pre;
                        "
                    > - </span>
                    <el-date-picker
                        v-model="filters.EndSubmitDate"
                        type="date"
                        placeholder="结束日期"
                        clearable
                        value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </div>
            <div class="f-c-c">
                <el-button-group>
                    <el-button @click="downloadmbs(1510, 15102, filters)"
                        >隐患排查台账</el-button
                    >
                    <el-button @click="downloadmbs(1510, 15103, filters)"
                        >隐患治理台账</el-button
                    >
                </el-button-group>
            </div>
        </div>
        <!--工具条结束-->

        <!--列表开始-->
        <el-table
            :data="list"
            highlight-current-row
            :header-cell-style="$tableStyle"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" class="demo-table-expand">
                        <el-form-item label="排查照片：">
                            <mediaList :list="props.row.RecordSubmit.AttachmentFiles" v-if="props.row.RecordSubmit"/>
                        </el-form-item>
                        <el-form-item label="排查备注：">
                            <span>{{ props.row.RecordSubmit.Remark }}</span>
                        </el-form-item>
                        <el-form-item label="上报人：">
                            <span>{{ props.row.SubmitUserName }}</span>
                        </el-form-item>
                        <el-form-item label="上报时间：">
                            <span>{{ props.row.SubmitDateDesc }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="序号"
                align="center"
                header-align="center"
                type="index"
                width="60"
            >
            </el-table-column>
            <el-table-column label="隐患项目" prop="Project"> </el-table-column>
            <el-table-column label="隐患内容" prop="Content"> </el-table-column>

            <el-table-column
                label="隐患来源"
                align="center"
                header-align="center"
                width="150"
                prop="PotentialSourceDesc"
            >
            </el-table-column>
            <el-table-column label="上报日期" align="center" width="100">
                <template slot-scope="scope">
                    {{ timeFormat(new Date(scope.row.SubmitDateDesc)) }}
                </template>
            </el-table-column>
            <el-table-column
                label="隐患级别"
                align="center"
                header-align="center"
                prop="PotentialLevelName"
                width="90"
            >
                <template slot-scope="scope">
                    <el-tag
                        size="small"
                        effect="dark"
                        :type="
                            scope.row.PotentialLevelCode == '058002'
                                ? ''
                                : 'danger'
                        "
                    >
                        {{ scope.row.PotentialLevelName }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="状态"
                align="center"
                header-align="center"
                width="80"
            >
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row | filterscolor"
                        effect="dark"
                        size="small"
                    >
                        {{ scope.row.StatusDesc }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="300"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-popover
                            placement="bottom"
                            width="250"
                            trigger="click"
                        >
                            <el-button
                                type="danger"
                                icon="el-icon-s-order"
                                size="mini"
                                plain
                                @click="
                                    downloadmbs(
                                        1510,15104,
                                        {
                                            PotentialId: scope.row.PotentialId,
                                            PotentialOperations: [40, 41, 50],
                                            DownloadType: 1,
                                        },
                                        scope.row.EnterpriseId
                                    )
                                "
                                >排查报告</el-button
                            >
                            <el-button
                                type="success"
                                icon="el-icon-s-order"
                                size="mini"
                                plain
                                v-if="
                                    scope.row.Status >= 50 &&
                                    scope.row.Status <= 70
                                "
                                @click="
                                    downloadmbs(
                                        1510,15105,
                                        {
                                            PotentialId: scope.row.PotentialId,
                                            PotentialOperations: [40, 41, 50],
                                            DownloadType: 1,
                                        },
                                        scope.row.EnterpriseId
                                    )
                                "
                                >复查报告</el-button
                            >
                            <el-button slot="reference" type="text">下载</el-button>
                        </el-popover>
                        <el-button
                            type="text"
                            @click="
                                showViewDialog(scope.row.PotentialId, scope.row)
                            "
                            >查看</el-button
                        >
                        <el-button
                            type="text"
                            @click="seeView(scope.row.PotentialId)"
                            >操作记录</el-button
                        >
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--列表结束-->

        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            :title="dialogTitle"
            :visible.sync="addShow"
            :close-on-click-modal="false"
            @close="dialogClear"
            width="60%"
            top="8vh"
        >
            <el-scrollbar class="scrollbar">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="font-weight: 600; font-size: 15px"
                            >检查项目：{{ row.Project }}</span
                        >
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            >{{ row.PotentialLevelName }}</el-button
                        >
                    </div>
                    <div>
                        <el-form ref="form">
                            <el-form-item label="检查内容：">
                                <el-input
                                    type="textarea"
                                    :value="row.Content"
                                    disabled
                                    readonly
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="隐患来源：">
                                <el-input
                                    type="text"
                                    disabled
                                    :value="row.PotentialSourceDesc"
                                    readonly
                                ></el-input>
                            </el-form-item>
                            <div class="form-col">
                                <el-form-item label="上报人：">
                                    <div class="el-input">{{ row.SubmitUserName }}</div>
                                </el-form-item>
                                <el-form-item label="上报时间：">
                                    <div class="el-input">{{ row.SubmitDateDesc }}</div>
                                </el-form-item>
                            </div>
                            <div class="form-col">
                                <el-form-item label="整改负责人：">
                                    <div class="el-input">{{ row.ResponsibleName }}</div>
                                </el-form-item>
                                <el-form-item label="限整改时间：">
                                    <div class="el-input">{{ row.ReformDeadlineTimeDesc }}</div>
                                </el-form-item>
                            </div>
                            <el-card class="box-card">
                                <el-form-item label="排查照片：">
                                    <div class="el-input">
                                        <mediaList :list="row.RecordSubmit.AttachmentFiles" v-if="row.RecordSubmit"/>
                                    </div>
                                </el-form-item>
                                <el-form-item label="排查备注：">
                                    <el-input
                                        type="textarea"
                                        disabled
                                        v-if="row.RecordSubmit"
                                        :value="row.RecordSubmit.Remark"
                                        readonly
                                    ></el-input>
                                </el-form-item>
                            </el-card>

                            <div
                                v-for="(item, index) in OperationRecords"
                                :key="index"
                            >
                                <el-row
                                    v-if="
                                        item.PotentialOperationDesc.includes(
                                            '整改'
                                        )
                                    "
                                >
                                    <el-card class="box-card">
                                        <el-col :span="24">
                                            <el-form-item label="整改照片：">
                                                <mediaList :list="item.AttachmentFiles" v-if="item.AttachmentFiles"/>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="整改备注：">
                                                <el-input
                                                    type="textarea"
                                                    disabled
                                                    :value="item.Remark"
                                                    readonly
                                                ></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-card>
                                </el-row>
                                <el-row v-else>
                                    <el-card class="box-card">
                                        <el-col :span="12">
                                            <el-form-item label="复查人：">
                                                <div>
                                                    {{ item.OperationUserName }}
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="复查时间：">
                                                <div>
                                                    {{ item.OperationDateDesc }}
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                        <el-row v-if="item.IsPass">
                                            <el-col :span="24">
                                                <el-form-item
                                                    label="复查照片："
                                                >
                                                    <mediaList :list="item.AttachmentFiles" v-if="item.AttachmentFiles"/>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="24">
                                                <el-form-item
                                                    :label="
                                                        item.IsPass
                                                            ? '复查备注：'
                                                            : '不通过原因'
                                                    "
                                                >
                                                    <el-input
                                                        type="textarea"
                                                        disabled
                                                        :value="item.Remark"
                                                        readonly
                                                    ></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </el-row>
                            </div>
                        </el-form>
                    </div>
                </el-card>
            </el-scrollbar>
        </el-dialog>
        <!--弹层结束-->
        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            title="操作记录"
            :visible.sync="viewShow"
            :close-on-click-modal="false"
            width="40%"
        >
            <potentialView ref="child" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewShow = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--弹层结束-->
    </page-layout>
</template>

<script>
import API_POTENTIAL from '@/api/api_potential'
import viewInfo from "./viewInfo";
import request_mixin from "@/mixins/request-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import potentialView from "@/components/common/potential-view";
import mediaList from '@/components/common/media-list'
import util from '@/common/util';
export default {
  name: "list",
  components: {
    viewInfo,
    potentialView,
    mediaList
  },

  mixins: [request_mixin, Import_export],
  data () {
    return {
      viewShow: false,
      OperationRecords: [],
      row: [],
      SourceCom: [],
      DateTime: [],
      NatureList: [],
      //列表行的ID，编辑和删除时需要使用
      id: '',
      userId: '',
      //状态选项
      checkTypeList: [],
      //搜索时的过滤条件
      filters: {
        StartSubmitDate:'',
        EndSubmitDate:'',
      },
      //数据列表
      list: [],
      //分页相关数据
      pages: {
        total: 0,
      page: 1,
      rows: 10,
      },
      //弹层数据
      addShow: false,
      dialogTitle: '',
      //列表页面是否加载变量
      loading: false,
      //表单页面是否加载变量
      formLoading: false,
      //新增/编辑页面弹窗隐藏显示控制变量
      formVisible: false,
    };
  },
  methods: {
    seeView (PotentialId) {
      this.viewShow = true
      this.$nextTick(() => {
        this.$refs.child.getData(PotentialId)
      })
    },
    //分页事件
    handleCurrentChange (val) {
      this.pages.page = val;
      this.getList();
    },
    //搜索事件
    handleSearch () {
      this.pages.page = 1;
      this.getList();
    },
    //获取列表数据
    getList: function () {
      let that = this;
      let params = Object.assign({
        page: that.pages.page,
        rows: that.pages.rows
      }, that.filters);

      that.loading = true;
      this.Post('/GetEnterprisePotentialRecords', params).then(res => {
        if (res.status == 2000) {
          that.list = res.data.list;
          that.pages.total = res.data.count;
        } else {
          that.$message.error(err.toString()
          );
        }
          that.loading = false;
      }).finally(() => {
        this.loading = false;
      })

    },
    //弹层的取消
    dialogClear () {
      let than = this
      than.addShow = false
    },
    //检查执行
    showViewDialog (PotentialId, row) {
      let than = this
      than.dialogTitle = '查看记录'
      than.addShow = true
      than.row = row
      this.Post('/GetPotentialOperationRecords', {
        PotentialId: row.PotentialId,
        PotentialOperations: [40, 41, 50],
        Order: 1
      }).then(res => {
        if (res.status == 2000) {
          res.data.forEach(k => {
            if (k.AttachmentFiles) {
              k.Dimglist = k.AttachmentFiles.map(res => {
                return res.Url
              })
            }
          })

          this.OperationRecords = res.data
        }
      })

    },
    timeFormat (date) {
      try {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
      } catch (e) {
        return
      }

    },
    getCurrentDate () {
      var date = new Date();
      return this.timeFormat(date)
    },
    getCurrentMonthFirstDay () {
      var date = new Date();
      date.setDate(1);
      return this.timeFormat(date)
    },

  },
  mounted () {
        let url = util.getLoginUrl() == '/rb-login' ? 'GetRoadPotentialSourceCom' : 'GetPotentialSourceCom'
        //获取隐患排查性质
            this.Get(url).then((res) => {
            if (res.status === 2000) {
                this.SourceCom = res.data
            }
        })

        this.filters.StartSubmitDate = this.getCurrentMonthFirstDay()
        this.filters.EndSubmitDate = this.getCurrentDate()
        this.DateTime = [this.getCurrentMonthFirstDay(), this.getCurrentDate()]
        this.handleSearch();
  }

}
</script>

<style scoped>
/deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
}
.box-card {
    margin-top: 20px;
}
/deep/ .el-button + .el-button {
    margin-left: 0px;
}
</style>
