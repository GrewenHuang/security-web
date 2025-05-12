<template>
  <page-layout
    class="warp"
    :loading="loading"
    element-loading-text="拼命加载中"
    :pages="pages"
    @current-change="handleCurrentChange"
  >
    <!-- 条件栏 开始 -->
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <!-- <select-enterpirse clearable placeholder="企业" collapseTags
							v-model="filters.EnterpriseId"></select-enterpirse> -->
            <el-select
              v-model="filters.EnterpriseId"
              placeholder="企业"
              clearable
              collapseTags
              @change="handleChange"
              @clear="filters.DepartmentId = ''"
            >
              <el-option
                v-for="(item, index) in EnterpriseList"
                :key="index"
                :label="item.EnterpriseName"
                :value="item.EnterpriseId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <cascader-department
              placeholder="部门"
              clearable
              v-model="filters.DepartmentId"
              :enterpriseId="filters.EnterpriseId"
              :disabled="!filters.EnterpriseId ? true : false"
            ></cascader-department>
            <!-- 	<el-cascader v-model="filters.DepartmentId" clearable :options="DepartmentCom" placeholder="部门"
							:show-all-levels="false" :disabled="!filters.EnterpriseId ? true : false"
							:props="{ value: 'DepartmentId', label: 'Name', children: 'children',emitPath: false,checkStrictly: true  }">
						</el-cascader>-->
          </el-form-item>
          <el-form-item>
            <cascader-fleet
              placeholder="所属车队"
              clearable
              v-model="filters.VehicleGroupSetId"
            ></cascader-fleet>
          </el-form-item>
          <el-form-item>
            <select-position
              v-model="filters.PositionList"
              :multiple="false"
              placeholder="岗位"
              :clearable="true"
              @selected="selected"
            ></select-position>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="filters.Tel"
              placeholder="手机号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="filters.UserName"
              placeholder="姓名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearch()"
              >查询</el-button
            >
            <!-- <el-popover width="400" trigger="click">
							<div>

							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover> -->
          </el-form-item>
          <el-form-item>
            <el-popover trigger="click">
              <ZYselect
                url="GetWhether"
                placeholder="是否在职"
                propid="id"
                propname="text"
                @returnData="getFormValue($event)"
                style="width: 200px;margin-bottom: 5px"
              />
              <div style="display: flex;">
                <el-button-group style="margin-right: 20px;">
                  <el-button
                    type="primary"
                    @click="BatchSet(true, '批量设置部门', '55%')"
                    v-if="$_has('RYGLBtnPLDeteleDempartment')"
                    >批量设置部门</el-button
                  >
                  <el-button
                    type="primary"
                    @click="BatchSet(false, '批量设置车队', '100px')"
                    v-if="$_has('RYGLBtnPLDeteleCar')"
                    >批量设置车队</el-button
                  >
                  <el-button
                    type="danger"
                    @click="BatchDelete()"
                    v-if="$_has('RYGLBtnPLDetele')"
                    >批量删除</el-button
                  >
                  <el-button @click="showQrcode" v-if="$_has('RYGLBtnSm')">
                    扫码录入
                  </el-button>
                  <el-button
                    @click="downloadmb('GetTemplateFile?templateFileEnumNum=1')"
                    v-if="$_has('RYGLBtnDrmb')"
                    >导入模板下载</el-button
                  >
                  <el-button v-if="$_has('RYGLBtnDr')">
                    <el-upload
                      action="#"
                      :show-file-list="false"
                      :on-change="
                        file => {
                          handleExcel(file, 'ImportUsers');
                        }
                      "
                      accept=".xls,.xlsx"
                      :auto-upload="false"
                      >导入人员
                    </el-upload>
                  </el-button>
                  <el-button
                    @click="downloadFile(101)"
                    v-if="$_has('RYGLBtnDc')"
                    >导出台账</el-button
                  >
                  <el-button
                    @click="downloadFile(103)"
                    v-if="$_has('RYGLBtnDc')"
                    >导出档案</el-button
                  >
                  <el-button @click="DownCache()" v-if="$_has('RYGLBtnDc')"
                    >档案缓存下载</el-button
                  >
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="dialogEditOpen()"
                    style="margin-left: 20px;"
                    v-if="$_has('RYGLBtnAdd')"
                    >新增</el-button
                  >
                </el-button-group>
              </div>
              <el-button slot="reference" type="text">操作按钮</el-button>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 条件栏 结束 -->

    <!--列表 开始-->
    <el-table
      :data="pages.list"
      :header-cell-style="$tableStyle"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="listTable"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        align="center"
        header-align="center"
        width="50"
      >
      </el-table-column>
      <!-- <el-table-column
        label="照片"
        align="center"
        header-align="center"
        prop="Photo"
        width="130"
      >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.Photo"
            style="width:50px;height:50px;border-radius: 50%;"
            :preview-src-list="[scope.row.Photo]"
            :z-index="9999"
            :src="scope.row.Photo"
            fit="fit"
          >
          </el-image>
        </template>
      </el-table-column> -->
      <el-table-column
        label="姓名"
        align="center"
        prop="UserName"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="车队"
        align="center"
        prop="VehicleGroupSetName"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="手机号(登录账号)"
        align="center"
        header-align="center"
        prop="Tel"
        width="130"
      >
      </el-table-column>
      <!-- 	<el-table-column label="性别" align="center" header-align="center" prop="GenderDesc" width="60">
			</el-table-column>
			<el-table-column label="年龄" align="center" header-align="center" prop="BirthdayDESC" width="60">
			</el-table-column> -->
      <el-table-column
        label="公司"
        align="center"
        header-align="center"
        width="160"
      >
        <template slot-scope="scope">
          <span
            style="margin-right: 5px;"
            v-for="(item, index) in scope.row.DepartmentListJustShow"
            :key="index"
          >
            {{ item.EnterpriseName   }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="部门"
        align="center"
        header-align="center"
        width="160"
      >
        <template slot-scope="scope">
          <span
            style="margin-right: 5px;"
            v-for="(item, index) in scope.row.DepartmentListJustShow"
            :key="index"
          >
            {{   item.DepartmentName }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="安全等级" align="center" header-align="center" prop="SecurityLevelDesc">
			</el-table-column> -->
      <!-- <el-table-column label="部门" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.DepartmentList.map(item => item.DepartmentName).join('、') }}
                </template>
            </el-table-column> -->
      <el-table-column label="岗位" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.PositionList.map(item => item.PositionName).join("、") }}
        </template>
      </el-table-column>
      <el-table-column
        label="在职状态"
        align="center"
        header-align="center"
        width="80"
      >
        <template slot-scope="scope">
          <whether
            :yes="!!scope.row.OnTheJob"
            :text="scope.row.OnTheJob == 1 ? '在职' : '离职'"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="入职日期"
        align="center"
        header-align="center"
        prop="EntryDateDesc"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- <el-table-column
        label="离职日期"
        align="center"
        header-align="center"
        prop="DepartureDateDesc"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column> -->
      <el-table-column
        label="更新人"
        align="center"
        header-align="center"
        prop="UpdateByName"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        header-align="center"
        prop="UpdateTimeDesc"
        width="150"
        show-overflow-tooltip
        sortable
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
              @click="dialogEditOpen(scope.row.UserId, true)"
              v-if="$_has('RYGLBtnLook')"
              >查看</el-button
            >
            <el-button
              type="text"
              @click="dialogEditOpen(scope.row.UserId, false)"
              v-if="$_has('RYGLBtnEdit')"
              >编辑</el-button
            >
            <!-- <el-popover placement="bottom" width="180" trigger="click">
                            <el-button
                                type="warning"
                                size="mini"
                                plain
                                @click="downloadmbs(10, 104, scope.row.UserId)"
                                >下载</el-button
                            >
                            <el-button
                                type="warning"
                                plain
                                size="mini"
                                @click="
                                    seeTrain(scope.row.UserId, scope.row.UserName)
                                "
                                >培训记录</el-button
                            >
                            <el-button
                                slot="reference"
                                type="text"
                                >记录</el-button
                            >
                        </el-popover> -->
            <!-- 	<el-button slot="reference" type="text" @click="seeTrain(scope.row.UserId, scope.row.UserName)"
							v-if="$_has('RYGLBtnPXJL')">培训记录</el-button> -->
            <el-popover placement="bottom" width="265" trigger="click">
              <el-popconfirm
                title="是否重置密码？"
                icon="el-icon-warning"
                icon-color="red"
                @confirm="ResetPassword(scope.row.UserId)"
              >
                <el-button
                  type="primary"
                  slot="reference"
                  plain
                  size="mini"
                  v-if="$_has('RYGLBtnCZMM')"
                  >重置密码</el-button
                >
              </el-popconfirm>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="dialogUpdateTelOpen(scope.row.UserId)"
                v-if="$_has('RYGLBtnPhone')"
                >修改手机号</el-button
              >
              <el-popconfirm
                title="是否要删除此用户？"
                icon="el-icon-warning"
                icon-color="red"
                @confirm="DeleteUser(scope.row.UserId)"
              >
                <el-button
                  type="danger"
                  slot="reference"
                  plain
                  size="mini"
                  v-if="$_has('RYGLBtnDetele')"
                  >删除</el-button
                >
              </el-popconfirm>
              <el-button
                slot="reference"
                text-plain
                type="text"
                v-if="
                  $_has('RYGLBtnCZMM') ||
                    $_has('RYGLBtnPhone') ||
                    $_has('RYGLBtnDetele')
                "
                >更多</el-button
              >
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表 结束 -->

    <!--弹层开始-->
    <el-dialog
      v-dialog-drag
      title="培训记录"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="70%"
    >
      <el-table
        :data="list2"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }"
        style="width: 100%"
        height="550"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div>
              <div
                v-for="(item, index1) in props.row.TrainCoursewares"
                :key="index1"
                style="margin: 20px 0"
              >
                <div>
                  <span
                    style="
                                            font-size: 15px;
                                            font-weight: 600;
                                        "
                    >课件名称：</span
                  >{{ item.CoursewareName }}
                </div>
                <div
                  v-for="(items, index2) in item.TrainCoursewareAttachments"
                  :key="index2"
                  style="
                                        display: flex;
                                        width: 100%;
                                        height: 30px;
                                        line-height: 30px;
                                    "
                >
                  <span style="width: 50%"
                    >附件名称：{{ items.AttachmentName }}</span
                  >
                  <span style="width: 15%"
                    >时长：{{
                      items.VideoLengths
                        ? dateFormat(items.VideoLengths)
                        : "不限"
                    }}</span
                  >
                  <span style="width: 15%"
                    ><span v-if="items.AttachmentExt != 'pdf'"
                      >已学时长：{{ dateFormat(items.VideoPlayDuration) }}</span
                    ></span
                  >
                  <span style="width: 15%"
                    >状态：{{ items.IsCompleteDesc || "" }}</span
                  >
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="培训名称" prop="TrainTaskName">
        </el-table-column>
        <el-table-column label="课程名称" prop="CurriculumName">
        </el-table-column>
        <el-table-column label="培训时间">
          <template slot-scope="scope">
            <span>{{ scope.row.StartDateDesc || "无" }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="TrainTaskStatuDesc">
        </el-table-column>
        <el-table-column label="完成时间">
          <template slot-scope="scope">
            <span>{{ scope.row.TrainStartDateDesc || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.TrainTaskStatu == 100"
              type="warning"
              slot="reference"
              plain
              size="mini"
              icon="el-icon-download"
              @click="
                downloadmbs(10, 102, {
                  TrainTaskId: scope.row.TrainTaskId,
                  UserId: UserId,
                  UserName: UserName
                });
                addShow = false;
              "
              >下载培训档案</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" style="text-align: center">
        <el-pagination
          layout="total, prev, pager, next"
          background
          @current-change="handleCurrentChange2"
          :page-size="rows2"
          :total="total2"
          class="customPagination"
        >
        </el-pagination>
      </el-col>
    </el-dialog>
    <!--弹层结束-->
    <!--修改帐号弹层 开始-->
    <el-dialog
      v-dialog-drag
      title="重置账号(修改手机号)"
      :visible.sync="dialogUpdateTelShow"
      :close-on-click-modal="false"
      @close="dialogUpdateTelClose()"
      class="dialog"
      width="40%"
    >
      <!-- 表单开始 -->
      <el-form
        ref="telForm"
        :model="telForm"
        :rules="telRules"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-row>
          <el-col :span="24" class="warp-main">
            <el-form-item label="旧手机号">
              <el-input v-model="telForm.OldTel" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="warp-main">
            <el-form-item label="新手机号" prop="NewTel">
              <el-input
                v-model="telForm.NewTel"
                placeholder="请输入新手机号"
                maxlength="11"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="warp-main">
            <el-form-item label="重复新手机号" prop="ReNewTel">
              <el-input
                v-model="telForm.ReNewTel"
                placeholder="请再次输入新手机号"
                maxlength="11"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateTelClose()">取消</el-button>
        <el-button
          type="primary"
          @click="dialogUpdateTelSave()"
          :loading="dialogSaveLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改帐号弹层 结束 -->
    <!--编辑弹层 开始-->
    <el-dialog
      v-dialog-drag
      title="档案信息"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      @close="dialogEditClose()"
      class="dialog basic-info-dialog"
      width="60%"
      top="5vh"
      v-loading="dialogLoading"
    >
      <el-scrollbar class="scrollbar" ref="userInfoScrollbar">
        <userAdd
          ref="BaseDTO"
          :data="BaseInfo"
          :EnterpriseList="EnterpriseList"
          @getPower="getPower"
          style="margin-top: 10px"
          v-if="isAdd"
          :isType="isType"
        />
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogEditClose()">取消</el-button>
        <el-button
          type="primary"
          @click="dialogEditSave()"
          :loading="dialogSaveLoading"
          slot="reference"
          v-if="!isType"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :title="setTitle"
      :visible.sync="SetShow"
      :close-on-click-modal="false"
      @close="setClose()"
      :width="setWidth"
      top="5vh"
    >
      <el-form class="form" :rules="rules" :model="info" ref="form">
        <div class="card" v-if="isSet">
          <div style="display: flex;justify-content: flex-end;margin: 10px 0;">
            <div>
              <el-button
                type="primary"
                @click="addInspectionItem({ levelIndex: 1 })"
                >新增</el-button
              >
            </div>
          </div>
          <div class="card-body">
            <el-table
              border
              :data="DepartmentList"
              :header-cell-style="$tableStyle"
            >
              <el-table-column
                label="序号"
                type="index"
                align="center"
                header-align="center"
                width="50"
              >
              </el-table-column>
              <el-table-column label="企业" align="center">
                <template slot-scope="{ row, $index }">
                  <el-select
                    v-model="row.EnterpriseId"
                    placeholder="企业"
                    clearable
                    collapseTags
                    @change="handleChangeSelect(row.EnterpriseId, $index)"
                  >
                    <el-option
                      v-for="(item, index) in EnterpriseList"
                      :key="index"
                      :label="item.EnterpriseName"
                      :value="item.EnterpriseId"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="部门" align="center">
                <template slot-scope="{ row, $index }">
                  <div class="el-input">
                    <el-cascader
                      v-model="row.DepartmentId"
                      clearable
                      @change="handleCascaderChange($event, $index)"
                      :options="row.DepartmentCom"
                      placeholder="部门"
                      :show-all-levels="false"
                      :disabled="
                        !row.EnterpriseId || row.EntryDate ? true : false
                      "
                      :props="{
                        value: 'DepartmentId',
                        label: 'Name',
                        children: 'children',
                        checkStrictly: true
                      }"
                    >
                    </el-cascader>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="入职日期" align="center">
                <template slot-scope="{ row, $index }">
                  <el-date-picker
                    v-model="row.EntryDate"
                    type="date"
                    clearable
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    placeholder="入职日期"
                  >
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="离岗日期" align="center">
                <template slot-scope="{ row, $index }">
                  <el-date-picker
                    v-model="row.DepartureDate"
                    type="date"
                    clearable
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    placeholder="离岗日期"
                  >
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="80" align="center">
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="text"
                    text-plain
                    @click="removeInspectionItem(row, $index, 1)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <el-form-item
          label="车队"
          align="center"
          v-else
          prop="VehicleGroupSetId"
        >
          <cascader-fleet
            placeholder="所属车队"
            clearable
            v-model="info.VehicleGroupSetId"
          ></cascader-fleet>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="setClose()">取消</el-button>
        <el-button
          type="primary"
          :loading="setLoading"
          v-if="isSet"
          @click="onSetDepartment"
          >提交</el-button
        >
        <el-button type="primary" :loading="setLoading" v-else @click="onSetCar"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <!-- 编辑弹层 结束 -->
  </page-layout>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import RULECONFIG from "@/common/ruleConfig";
import ZYselect from "@/components/common/zy_select";
import userAdd from "./Users/userAdd.vue";
import Download from "@/mixins/Download.js";
import { mapState } from "vuex";
import Qs from "qs";
export default {
  name: "User",
  components: {
    userAdd,
    ZYselect
  },
  mixins: [request_mixin, upload_mixin, Download, Import_export],
  data() {
    var validateTel2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入手机号"));
      } else if (value !== this.telForm.NewTel) {
        callback(new Error("两次输入手机号不一致!"));
      } else {
        callback();
      }
    };
    return {
      isType: false,
      setLoading: false,
      isSet: true,
      setWidth: "60%",
      setTitle: "批量设置部门",
      SetShow: false,
      info: {},
      rules: {
        VehicleGroupSetId: RULECONFIG.Text("车队")
      },
      dialogLoading: false,
      isAdd: true,
      addShow: false,
      list2: [],
      page2: 1,
      rows2: 10,
      total2: 0,
      rows: {},
      data: {},
      UserId: 0,
      flag: false,
      loading: false, //页面加载遮罩层显示状态
      dialogSaveLoading: false, //弹窗保存状态
      dialogShow: false,
      dialogUpdateTelShow: false,
      DepartmentCom: [],
      UserInfo: {},
      DriverInfo: {},
      CarerInfo: {},
      StevedoreInfo: {},
      EscortInfo: {},
      MonitorPersonInfo: {},
      SpecialPersonnelInfo: {},
      PrincipalPersonInfo: {},
      SafetyPersonnelInfo: {},
      BaseInfo: {},
      EnterpriseList: [], // 企业
      //查询条件
      filters: {},
      IsPower: [],
      parms: {},
      telForm: {
        UserId: 0, //用户id
        OldTel: "", //旧手机号
        NewTel: "", //新手机号
        ReNewTel: "" //重复手机号
      },
      DepartmentPositionUser: [],
      telRules: {
        NewTel: [
          {
            required: true,
            message: "请输入新手机号",
            trigger: "blur"
          }
        ],
        ReNewTel: [
          {
            required: true,
            message: "请再次输入新手机号",
            trigger: "blur"
          },
          {
            required: true,
            validator: validateTel2,
            trigger: "blur"
          }
        ]
      },
      //分页
      pages: {
        list: [],
        total: 0,
        page: 1,
        rows: 10
      },
      scanQrCode: "",
      multipleSelection: [],
      DepartmentList: [],
      deIndex: ""
    };
  },

  computed: {
    ...mapState([])
  },

  methods: {
    getDownCache(data) {
      if (data) {
        const loading = this.$loading({
          lock: true,
          text: "数据加载中，请稍等...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, .5)"
        });
        this.Post("/DownUsersFiles", data, "blob")
          .then(res => {
            var blob = new Blob([res], {
              type: "application/vnd.ms-excel;charset=utf-8"
            });
            const URL = window.URL || window.webkitURL;
            const downloadElement = document.createElement("a");
            const href = URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = "人员档案.zip"; // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            URL.revokeObjectURL(href); // 释放掉blob对
            loading.close();
          })
          .catch(err => {
            loading.close();
          });
      }
    },
    DownCache() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let UserIds = this.multipleSelection.map(item => item.UserId);
        this.getDownCache(UserIds);
        this.$refs.listTable.clearSelection();
      } else {
        this.$message.error("请先选择需要下载的人员");
        return;
        // this.$confirm(`确定导出${this.pages.total}条数据吗?`, '提示', {
        // 	confirmButtonText: '确定',
        // 	cancelButtonText: '取消',
        // 	type: 'warning'
        // }).then((res) => {
        // 	if (res) {
        // 		this.downloadmbs(10, data, this.filters)
        // 	}
        // })
      }
    },
    BatchSet(type, Name, Width) {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.SetShow = true;
        this.isSet = type;
        this.setTitle = Name;
        this.setWidth = Width;
        if (type) {
          this.DepartmentList = [];
        } else {
          this.info = {
            VehicleGroupSetId: ""
          };
        }
      } else {
        this.$message.warning("请先选择人员!");
      }
    },
    setClose() {
      this.SetShow = false;
      this.setLoading = false;
    },
    onSetDepartment() {
      if (this.DepartmentList && this.DepartmentList.length > 0) {
        for (let j = 0; j < this.DepartmentList.length; j++) {
          let obj = this.DepartmentList[j];
          if (obj.EnterpriseId == "" || obj.EnterpriseId == null) {
            this.$message.error(`请选择企业信息第${j + 1}行的企业`);
            return false;
          }
          if (obj.DepartmentId == "" || obj.DepartmentId == null) {
            this.$message.error(`请选择企业信息第${j + 1}行的部门`);
            return false;
          }
          if (obj.EntryDate == "" || obj.EntryDate == null) {
            this.$message.error(`请选择企业信息第${j + 1}行的入职日期`);
            return false;
          }
        }
        let arr = [];
        this.DepartmentList.map(item => {
          let objData = {
            EnterpriseId: item.EnterpriseId,
            DepartmentId: item.DepartmentId,
            EntryDate: item.EntryDate,
            DepartureDate: item.DepartureDate
          };
          arr.push(objData);
        });
        this.setLoading = true;
        this.$confirm("确定执行此操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let params = {
              DepartmentList: arr,
              Ids: this.multipleSelection.map(item => item.UserId)
            };
            this.Post("/SaveBatchSetUserDepartment", params).then(res => {
              if (res.status == 2000) {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.setClose();
                this.$refs.listTable.clearSelection();
                this.GetList();
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
                this.setLoading = false;
              }
            });
          })
          .catch(() => {
            this.setLoading = false;
          });
      } else {
        this.$message.error("请先添加部门!");
      }
    },
    onSetCar() {
      this.$refs.form.validate((valid, fields) => {
        if (valid) {
          this.setLoading = true;
          this.$confirm("确定执行此操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              let params = {
                LongTypeId: this.info.VehicleGroupSetId,
                Ids: this.multipleSelection.map(item => item.UserId)
              };
              this.Post("/SaveBatchSetVehicleGroupSet", params).then(res => {
                if (res.status == 2000) {
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                  this.setClose();
                  this.$refs.listTable.clearSelection();
                  this.GetList();
                } else {
                  this.$message({
                    message: res.message,
                    type: "error"
                  });
                  this.setLoading = false;
                }
              });
            })
            .catch(() => {
              this.setLoading = false;
            });
        }
      });
    },
    addInspectionItem() {
      this.DepartmentList.push({
        EnterpriseId: "",
        DepartmentId: "",
        EntryDate: "",
        DepartureDate: "",
        DepartmentCom: []
      });
    },
    removeInspectionItem(item, index) {
      this.DepartmentList.splice(index, 1);
    },
    handleCascaderChange(value, i) {
      if (value.length > 0) {
        const lastId = value[value.length - 1];
        this.DepartmentList[i].DepartmentId = lastId;
        // 在这里可以对最后一级的 ID 进行你需要的操作
      }
    },
    handleChangeSelect(value, index) {
      this.deIndex = index;
      this.GetDepartmentsList(value);
    },
    removeEmptyChildrenDepartment(data) {
      data.forEach(item => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        } else if (item.children && item.children.length > 0) {
          this.removeEmptyChildrenDepartment(item.children);
        }
      });
    },
    GetDepartmentsList(id) {
      this.Get("/GetTreeEnterpriseDepartments?enterpriseId=" + id).then(res => {
        if (res.status == 2000) {
          this.DepartmentList[this.deIndex].DepartmentCom = res.data;
          // this.DepartmentCom = res.data;
          if (
            this.DepartmentList[this.deIndex].DepartmentCom &&
            this.DepartmentList[this.deIndex].DepartmentCom.length > 0
          ) {
            this.removeEmptyChildrenDepartment(
              this.DepartmentList[this.deIndex].DepartmentCom
            );
          }
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadFile(data) {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let params = {
          ...this.filters,
          UserIds: this.multipleSelection.map(item => item.UserId)
        };

        this.downloadmbs(10, data, params);
        this.$refs.listTable.clearSelection();
      } else {
        this.$confirm(`确定导出${this.pages.total}条数据吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          if (res) {
            this.downloadmbs(10, data, this.filters);
          }
        });
      }
    },
    selected(e) {
      let arr = [e];
      this.filters.PositionIds = arr;
    },
    getPower(e) {
      this.IsPower = e;
    },
    seeTrain(id, UserName) {
      this.UserName = UserName;
      this.UserId = id;
      this.addShow = true;
      this.Post("/GetTrainCurriculums2", {
        page: this.page2,
        rows: this.rows2,
        UserId: id
      }).then(res => {
        if (res.status == 2000) {
          this.list2 = res.data.list;
          this.total2 = res.data.count;
        }
      });
    },

    dateFormat(examSecond) {
      let result = parseInt(examSecond);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);
      let res = "";
      if (h !== "00") res += `${h}时`;
      if (m !== "00") res += `${m}分`;
      res += `${s}秒`;
      return res;
    },
    handleCurrentChange2(val) {
      this.page2 = val;
      this.seeTrain(this.UserId);
    },
    getFormValue(e) {
      this.filters.OnTheJob = e;
    },
    download(url, filename) {
      const loading = this.$loading({
        lock: true,
        text: "下载中,请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      this.Post("/" + url, this.filters, "blob").then(res => {
        loading.close();
        this.readFileDownload(res, filename);
      });
    },
    //打开弹窗
    dialogEditOpen(id, type) {
      this.isAdd = true;
      this.dialogShow = true;
      if (id) {
        this.isType = type;
        this.dialogLoading = true;
        this.Get("/GetEnterpriseUserV3", {
          UserId: id
        }).then(res => {
          console.log(res);
          if (res.status == 2000) {
            this.BaseInfo = res.data.BaseDTO;
            this.DriverInfo = res.data.DriverDTO;
            this.CarerInfo = res.data.CarerDTO;
            this.StevedoreInfo = res.data.StevedoreDTO;
            this.EscortInfo = res.data.EscortDTO;
            this.MonitorPersonInfo = res.data.MonitorPersonDTO;
            this.SpecialPersonnelInfo = res.data.SpecialPersonnelDTO;
            this.PrincipalPersonInfo = res.data.PrincipalPersonDTO;
            this.SafetyPersonnelInfo = res.data.SafetyPersonnelDTO;
          }
          this.dialogLoading = false;
        });
      } else {
        this.BaseInfo = {
          OnTheJob: "1" //是否在职 int
        };
        this.isType = false;
        this.DriverInfo = {};
        this.CarerInfo = {};
        this.StevedoreInfo = {};
        this.EscortInfo = {};
        this.MonitorPersonInfo = {};
        this.SpecialPersonnelInfo = {};
        this.PrincipalPersonInfo = {};
        this.SafetyPersonnelInfo = {};
      }

      this.$nextTick(() => {
        if (this.$refs.userInfoScrollbar) {
          this.$refs.userInfoScrollbar.wrap.scrollTop = 0;
        }
      });
    },
    //关闭弹窗
    dialogEditClose() {
      this.dialogShow = false;
    },
    findOtherValue(arr, objId) {
      for (let item of arr) {
        if (item.value == objId) {
          return item.otherValue;
        }
        if (item.children) {
          let res = this.findOtherValue(item.children, objId);
          if (res) return res;
        }
      }
    },
    dialogEditSave() {
      let arr = ["BaseDTO"];

      arr.forEach(res => {
        if (this.parms[res]) {
          delete this.parms[res];
        }
        if (this.$refs[res] != undefined) {
          this.$refs[res].getData(e => {
            this.parms[res] = e;
          });
        }
      });
      if (JSON.stringify(this.parms.BaseDTO) == "{}") {
        return;
      }
      // if(this.parms.BaseDTO.DepartmentList.length == 0){
      // 	this.$message.error(`请添加数据权限!`);
      // 	return false;
      // }
      if (this.parms.BaseDTO.DepartmentListJustShow) {
        for (
          let j = 0;
          j < this.parms.BaseDTO.DepartmentListJustShow.length;
          j++
        ) {
          let obj = this.parms.BaseDTO.DepartmentListJustShow[j];
          if (obj.EnterpriseId == "" || obj.EnterpriseId == null) {
            this.$message.error(`请选择企业信息第${j + 1}行的企业`);
            return false;
          }
          if (obj.DepartmentId == "" || obj.DepartmentId == null) {
            this.$message.error(`请选择企业信息第${j + 1}行的部门`);
            return false;
          }
          if (obj.EntryDate == "" || obj.EntryDate == null) {
            this.$message.error(`请选择企业信息第${j + 1}行的入职日期`);
            return false;
          }
        }
      }
      if (
        this.parms.BaseDTO.Certificates &&
        this.parms.BaseDTO.Certificates.length > 0
      ) {
        for (let k = 0; k < this.parms.BaseDTO.Certificates.length; k++) {
          let kfc = this.parms.BaseDTO.Certificates[k];
          if (kfc.CertificateName == "身份证") {
            if (
              kfc.CertificateManagePhotos &&
              kfc.CertificateManagePhotos.length < 2
            ) {
              this.$message.error(`${kfc.CertificateName}的照片不能少于2张`);
              return false;
            }
          }
          if (kfc.CertificateName == "驾驶证") {
            if (
              kfc.CertificateManagePhotos &&
              kfc.CertificateManagePhotos.length < 2
            ) {
              this.$message.error(`${kfc.CertificateName}的照片不能少于2张`);
              return false;
            }
            if (
              kfc.CertificateManagePhotos &&
              kfc.CertificateManagePhotos.length > 2
            ) {
              this.$message.error(`${kfc.CertificateName}的照片不能大于2张`);
              return false;
            }
          }
        }
      }
      this.parms.BaseDTO.SecurityLevel = parseInt(
        this.parms.BaseDTO.SecurityLevel
      );
      let result = [];
      this.parms.BaseDTO.DepartmentList.forEach(item => {
        let otherValue = this.findOtherValue(
          this.DepartmentPositionUser,
          item.DepartmentId
        );
        if (otherValue) {
          result.push({
            DepartmentId: item.DepartmentId,
            EnterpriseId: otherValue
          });
        }
      });
      this.parms.BaseDTO.DepartmentList = result;
      let arrRow = [
        {
          PositionId: this.parms.BaseDTO.PositionList
        }
      ];
      this.parms.BaseDTO.PositionList = arrRow;
      // this.parms.BaseDTO.DepartmentListJustShow = result
      this.dialogSaveLoading = true;
      this.Post("/SaveEnterpriseUserV3", this.parms)
        .then(res => {
          // this.Post("/RegisterEnterpriseUser", this.parms).then((res) => {
          if (res.status != 2000) {
            this.$message({
              message: res.message,
              type: "error"
            });
            this.dialogSaveLoading = false;
          } else {
            this.$message({
              message: "保存成功",
              type: "success"
            });

            this.dialogShow = false;
            this.dialogSaveLoading = false;
            this.GetList();
          }
        })
        .finally(() => {
          this.dialogSaveLoading = false;
        });
    },
    BatchDelete() {
      if (!this.multipleSelection.length > 0) {
        this.$message.warning("请先选择人员!");
        return;
      }
      this.loading = true;
      this.$confirm("确定执行此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.Post("/DeleteEnterpriseUsers", {
            Ids: this.multipleSelection.map(item => item.UserId)
          }).then(res => {
            if (res.status == 2000) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.$refs.listTable.clearSelection();
              this.GetList();
              this.loading = false;
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
              this.loading = false;
            }
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //删除信息
    DeleteUser(Id) {
      let that = this;
      that.loading = true;
      that
        .Get("/DeleteEnterpriseUser", {
          Id: Id
        })
        .then(
          function(result) {
            that.loading = false;
            if (result && result.status == 2000) {
              that.$message.success({
                showClose: true,
                message: "删除成功",
                duration: 1500
              });
              that.GetList();
            } else {
              that.$message.error({
                showClose: true,
                message: result.message,
                duration: 2000
              });
            }
          },
          function(err) {
            that.loading = false;
            that.$message.error({
              showClose: true,
              message: err.toString(),
              duration: 2000
            });
          }
        )
        .catch(function(error) {
          that.loading = false;
          that.$message.error({
            showClose: true,
            message: "请求出现异常",
            duration: 2000
          });
        });
    },
    //重置密码
    ResetPassword(UserId) {
      let that = this;
      that.loading = true;
      that
        .Post("/ResetEnterpriseUserPassword", {
          UserId: UserId
        })
        .then(function(result) {
          that.loading = false;

          if (result && result.status == 2000) {
            that.$message({
              message: result.message,
              type: "success"
            });

            that.edits.saveLoading = false;
            that.edits.dialogEditShow = false;
          } else {
            that.edits.saveLoading = false;
            that.edits.dialogEditShow = false;
            that.$message({
              message: result.message,
              type: "error"
            });
          }
        });
    },
    //修改手机号弹窗
    dialogUpdateTelOpen(id) {
      let that = this;
      that.dialogUpdateTelShow = true;
      if (id) {
        that
          .Get("/GetEnterpriseUserV3", {
            UserId: id
          })
          .then(res => {
            if (res.status == 2000) {
              that.telForm.OldTel = res.data.BaseDTO.LoginName;
            }
          });
      }
      that.telForm.NewTel = "";
      that.telForm.ReNewTel = "";
      that.telForm.UserId = id;
    },
    //关闭手机号弹窗
    dialogUpdateTelClose() {
      this.dialogUpdateTelShow = false;
    },
    //保存修改手机号
    dialogUpdateTelSave() {
      var that = this;
      that.$refs.telForm.validate(valid => {
        if (valid) {
          that.loading = true;
          that.Post("/UpdateTel", that.telForm).then(result => {
            if (result && result.status == 2000) {
              that.$message({
                message: "更新成功",
                type: "success"
              });
              this.GetList();
              that.dialogUpdateTelShow = false;
            } else {
              that.$message({
                message: result.message,
                type: "error"
              });
            }
            that.loading = false;
          });
        }
      });
    },
    //分页事件
    handleCurrentChange(val) {
      this.pages.page = val;
      this.GetList();
    },
    //搜索事件
    handleSearch() {
      let that = this;
      that.pages.page = 1;
      that.GetList();
    },

    //加载列表
    GetList() {
      let that = this;
      let params = Object.assign(
        {
          page: that.pages.page,
          rows: that.pages.rows
        },
        that.filters
      );
      that.loading = true;
      that.Post("/GetEnterpriseAllUsers", params).then(
        function(result) {
          that.loading = false;
          if (result && result.status == 2000) {
            that.pages.list = result.data.list;
            that.pages.total = result.data.count;
          }
        },
        function(err) {
          that.loading = false;
          that.$message.error({
            showClose: true,
            message: err.toString(),
            duration: 2000
          });
        }
      );

      that.loading = true;
    },
    removeEmptyChildrenDepartment(data) {
      data.forEach(item => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        } else if (item.children && item.children.length > 0) {
          this.removeEmptyChildrenDepartment(item.children);
        }
      });
    },
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
    handleChange() {
      this.GetDepartments();
    },
    GetDepartments() {
      if (this.filters.EnterpriseId) {
        this.Get(
          "/GetTreeEnterpriseDepartments?enterpriseId=" +
            this.filters.EnterpriseId
        ).then(res => {
          if (res.status == 2000) {
            this.DepartmentCom = res.data;
            if (this.DepartmentCom && this.DepartmentCom.length > 0) {
              this.removeEmptyChildrenDepartment(this.DepartmentCom);
            }
          }
        });
      } else {
        return;
      }
    },
    Navtourl(url) {
      this.$router.push(url);
      this.$parent.$parent.$parent.$parent.selectmenu(url);
    },
    async getScanQrCode() {
      let res = await this.Get("/GetEnterpriseQrCode");
      if (res.status == 2000) {
        this.scanQrCode = res.message;
      }
    },
    showQrcode() {
      this.$qrcode({
        url: this.scanQrCode,
        tips: "微信扫描二维码，注册账号"
      });
    }
  },
  mounted() {
    this.GetList();
    this.getScanQrCode();
    // 企业
    this.GetEnterpriseList();
    this.Get("/GetDepartmentTree").then(res => {
      //部门
      if (res.status == 2000) {
        this.DepartmentPositionUser = res.data;
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.input-search {
  width: 100%;
}

/deep/ .el-cascader {
  width: 100%;
}

/deep/ .el-button + .el-button {
  margin-left: 0px;
}

.card_title {
  font-size: 15px;
  font-weight: 700;
}

.basic-info-dialog {
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }

  /deep/ .el-dialog {
    min-width: 900px;
  }

  /deep/ .el-scrollbar__wrap {
    margin-bottom: 0 !important;
  }
}

/deep/ .input-content .el-form-item {
  margin-bottom: 0 !important;
}
</style>
