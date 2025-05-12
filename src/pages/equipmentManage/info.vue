<template>
  <div class="full-screen-edit" v-if="dislogShow">
    <el-form ref="form" :model="info" :rules="rules" v-loading="loading">
      <el-scrollbar class="scrollbar" ref="scrollbar">
        <div class="card">
          <div class="content">
            <div class="form-3-col">
              <el-form-item label="企业" prop="EnterpriseId">
                <!-- <el-select
                  v-model="info.EnterpriseId"
                  ceholder="企业"

                >
                  <el-option
                    v-for="(item, index) in WarehouseList"
                    :key="index"
                    :label="item.WarehouseName"
                    :value="item.WarehouseSetId"
                  ></el-option>
                </el-select> -->
                <select-enterpirse
                  clearable
                  placeholder="企业"
                  collapseTags
                  v-model="info.EnterpriseId"
                  @change="getEnterpriseId"
                  @clear="info.DepartmentId = ''"
                ></select-enterpirse>
              </el-form-item>
              <el-form-item label="部门" prop="DepartmentId">
                <cascader-department
                  placeholder="部门"
                  clearable
                  v-model="info.DepartmentId"
                  :enterpriseId="info.EnterpriseId"
                  :disabled="!info.EnterpriseId ? true : false"
                  @change="getDepartmentId"
                ></cascader-department>
                <!-- <select-department placeholder="部门" clearable clearable v-model="info.DepartmentList" :enterpriseId="info.EnterpriseIds" :disabled="!info.EnterpriseIds ? true : false"></select-department> -->
              </el-form-item>
              <el-form-item label="安全等级" prop="SecurityLevel">
                <select-level
                  v-model="info.SecurityLevel"
                  :multiple="false"
                  :value="info.SecurityLevel"
                ></select-level>
              </el-form-item>
            </div>
            <div class="form-3-col">
              <el-form-item
                label="设备名称"
                prop="EquipmentId"
                ref="EquipmentId"
              >
                <!-- 设备名称+设备类型名称 -->
                <el-input
                  placeholder="请选择"
                  :value="
                    info.EquipmentName
                      ? info.EquipmentTypeName + '-' + info.EquipmentName
                      : ''
                  "
                  readonly
                >
                  <el-button
                    slot="append"
                    @click="selectEquipment"
                    v-if="!isEdit"
                    >选择</el-button
                  >
                </el-input>
              </el-form-item>
              <el-form-item
                label="规格型号"
                prop="Specification"
                ref="Specification"
              >
                <el-input
                  placeholder="请输入"
                  v-model="info.Specification"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="主要性能参数"
                prop="MainParameter"
                ref="MainParameter"
              >
                <el-input
                  placeholder="请输入"
                  v-model="info.MainParameter"
                ></el-input>
              </el-form-item>
            </div>
            <div class="form-3-col">
              <el-form-item
                label="出产厂家"
                prop="Manufacturer"
                ref="Manufacturer"
              >
                <el-input
                  placeholder="请输入"
                  v-model="info.Manufacturer"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="出厂日期"
                prop="FactoryDate"
                ref="FactoryDate"
              >
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请输入"
                  v-model="info.FactoryDate"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="出厂编码" prop="FactoryNo" ref="FactoryNo">
                <el-input
                  placeholder="请输入"
                  v-model="info.FactoryNo"
                ></el-input>
              </el-form-item>
            </div>
            <div class="form-3-col">
              <el-form-item label="自编码（唯一）" prop="OwnCode" ref="OwnCode">
                <el-input
                  placeholder="请输入"
                  v-model="info.OwnCode"
                ></el-input>
              </el-form-item>
              <el-form-item label="来源" prop="SupplySource" ref="SupplySource">
                <el-select v-model="info.SupplySource">
                  <el-option
                    v-for="(item, index) in sourceList"
                    :key="index"
                    :label="item.text"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="仓库"
                prop="WarehouseSetId"
                ref="WarehouseSetId"
              >
                <el-select
                  v-model="info.WarehouseSetId"
                  :disabled="!info.DepartmentId || info.DepartmentId.length < 1"
                >
                  <el-option
                    v-for="(item, index) in WarehouseList"
                    :key="index"
                    :label="item.WarehouseName"
                    :value="item.WarehouseSetId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-3-col">
              <el-form-item
                label="使用位置"
                prop="UseLocation"
                ref="UseLocation"
              >
                <el-input
                  placeholder="请输入"
                  v-model="info.UseLocation"
                ></el-input>
              </el-form-item>
              <el-form-item label="进场日期" prop="EntryDate" ref="EntryDate">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请输入"
                  v-model="info.EntryDate"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="撤场日期"
                prop="DepartureDate"
                ref="DepartureDate"
              >
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请输入"
                  v-model="info.DepartureDate"
                ></el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="使用部门" prop="DepartmentId" ref="DepartmentId">
								<cascader-department placeholder="使用部门" clearable v-model="info.DepartmentId" :enterpriseId="info.EnterpriseId" :disabled="!info.EnterpriseId ? true : false"></cascader-department>
                            </el-form-item> -->
            </div>
            <div class="form-3-col">
              <el-form-item
                label="负责人"
                prop="ResponsibleUserId"
                ref="ResponsibleUserId"
              >
                <choose-user
                  v-model="info"
                  idKey="ResponsibleUserId"
                  nameKey="ResponsibleUserName"
                ></choose-user>
              </el-form-item>
              <el-form-item label="状态" prop="SupplyStatus" ref="SupplyStatus">
                <div class="el-input">
                  <el-radio-group v-model="info.SupplyStatus">
                    <el-radio-button
                      v-for="(item, index) in statusList"
                      :key="index"
                      :label="item.id"
                      >{{ item.text }}</el-radio-button
                    >
                  </el-radio-group>
                </div>
              </el-form-item>
              <div></div>
            </div>
            <el-form-item label="设备照片">
              <div class="el-input">
                <custom-upload
                  list-type="picture-card"
                  :fileList.sync="info.EquipmentPhotos"
                >
                  <i class="el-icon-plus"></i>
                </custom-upload>
              </div>
            </el-form-item>
            <el-form-item label="上传附件">
              <div class="el-input f--c">
                <customUploadDrag
                  style="width: 510px;"
                  :Data.sync="info.EquipmentFiles"
                  :showFileList="false"
                  :acceptList="[
                    'mp4',
                    'mp3',
                    'png',
                    'jpg',
                    'jpeg',
                    'doc',
                    'docx',
                    'xls',
                    'xlsx',
                    'pdf'
                  ]"
                >
                  <div class="f-c-c">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处或<em>点击上传</em>
                    </div>
                  </div>
                </customUploadDrag>
                <div class="f--c w50" style="color: #959595;margin-left: 15px;">
                  <span>支持图片、mp4、EXCEL、pdf文件</span>
                </div>
              </div>
              <file-list
                v-model="info.EquipmentFiles"
                style="margin-top: 10px;"
              ></file-list>
            </el-form-item>
          </div>
        </div>
        <div class="card" v-for="(o, index) in certList" :key="index">
          <div class="card-header f-b-c">
            <div class="title">{{ o.label }}信息</div>
            <div>
              <el-button @click="collapseChange(o.label)">{{
                collapses.includes(o.label) ? "收起" : "展开"
              }}</el-button>
            </div>
          </div>
          <div class="card-body" v-show="collapses.includes(o.label)">
            <el-collapse v-model="childCollapseActive">
              <el-collapse-item
                v-for="item in o.list"
                :key="item.CertificateId"
                :name="item.CertificateId"
              >
                <div slot="title" class="f-b-c f1">
                  <span>{{ item.CertificateName }}</span>
                  <div class="f--c operation">
                    <div
                      class="switch"
                      :class="{
                        open: childCollapseActive.includes(item.CertificateId)
                      }"
                    >
                      {{
                        childCollapseActive.includes(item.CertificateId)
                          ? "收起"
                          : "展开"
                      }}
                    </div>
                  </div>
                </div>
                <template v-for="(filed, index) in item.CertificateFileds">
                  <div class="form-3-col" :key="index" v-if="index % 2 == 0">
                    <el-form-item :label="filed.FiledName">
                      <el-input
                        placeholder="请输入"
                        v-model="filed.FiledValue"
                        v-if="filed.TextType == 2"
                        @blur="getCardNo(filed, item)"
                      ></el-input>
                      <el-date-picker
                        placeholder="请选择日期"
                        value-format="yyyy-MM-dd"
                        v-model="filed.FiledValue"
                        v-if="filed.TextType == 3"
                      ></el-date-picker>
                      <custom-date-range
                        v-model="filed.FiledValue"
                        v-if="filed.TextType == 4"
                      />
                    </el-form-item>
                    <el-form-item
                      :label="
                        item.CertificateFileds[index + 1]
                          ? item.CertificateFileds[index + 1].FiledName
                          : ''
                      "
                      v-if="item.CertificateFileds[index + 1]"
                    >
                      <el-input
                        placeholder="请输入"
                        v-model="item.CertificateFileds[index + 1].FiledValue"
                        v-if="item.CertificateFileds[index + 1].TextType == 2"
                        @blur="getCardNo(filed, item)"
                      ></el-input>
                      <el-date-picker
                        placeholder="请选择日期"
                        value-format="yyyy-MM-dd"
                        v-model="item.CertificateFileds[index + 1].FiledValue"
                        v-if="item.CertificateFileds[index + 1].TextType == 3"
                      ></el-date-picker>
                      <custom-date-range
                        v-model="item.CertificateFileds[index + 1].FiledValue"
                        v-if="item.CertificateFileds[index + 1].TextType == 4"
                      />
                    </el-form-item>
                    <div v-else></div>
                  </div>
                </template>
                <el-form-item label="照片">
                  <custom-upload
                    :accept="'.jpeg,.png,.jpg,.gif'"
                    :fileList.sync="item.CertificateManagePhotos"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus"></i>
                  </custom-upload>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="card">
          <div class="card-header f-b-c" ref="maintenance">
            <div class="title">保养计划</div>
            <div>
              <el-button
                type="primary"
                @click="addMaintenanceItem({ levelIndex: 1 })"
                >新增</el-button
              >
              <el-button @click="collapseChange(1)">{{
                collapses.some(index => index == 1) ? "收起" : "展开"
              }}</el-button>
            </div>
          </div>
          <div class="card-body" v-show="collapses.some(index => index == 1)">
            <el-table
              border
              :data="info.MaintenancePlans"
              :header-cell-style="$tableStyle"
              :span-method="__handlerMergeSpan"
            >
              <el-table-column
                label="保养计划名称"
                min-width="180"
                align="center"
              >
                <template slot-scope="{ row }">
                  <div class="input-combination">
                    <el-input
                      placeholder="请输入"
                      v-model="row.Name"
                    ></el-input>
                    <div class="input-operation">
                      <div
                        class="add"
                        @click="
                          addMaintenanceItem({
                            levelIndex: 1,
                            item: row,
                            index: $index
                          })
                        "
                      ></div>
                      <div
                        class="remove"
                        @click="removeMaintenanceItem(row, $index, 1)"
                      ></div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="保养部位" min-width="180" align="center">
                <template slot-scope="{ row, $index }">
                  <div class="input-combination">
                    <el-input
                      placeholder="请输入"
                      v-model="row.Position"
                    ></el-input>
                    <div class="input-operation">
                      <div
                        class="add"
                        @click="
                          addMaintenanceItem({
                            levelIndex: 2,
                            item: row,
                            index: $index
                          })
                        "
                      ></div>
                      <div
                        class="remove"
                        @click="removeMaintenanceItem(row, $index, 2)"
                      ></div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="保养项目" min-width="200" align="center">
                <template slot-scope="{ row, $index }">
                  <div class="input-combination">
                    <el-input
                      placeholder="请输入"
                      v-model="row.Item"
                    ></el-input>
                    <div class="input-operation">
                      <div
                        class="add"
                        @click="
                          addMaintenanceItem({
                            levelIndex: 3,
                            item: row,
                            index: $index
                          })
                        "
                      ></div>
                      <div
                        class="remove"
                        @click="removeMaintenanceItem(row, $index, 3)"
                      ></div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="保养内容" min-width="200" align="center">
                <template slot-scope="{ row }">
                  <el-input
                    placeholder="请输入"
                    v-model="row.Content"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="保养项目周期"
                min-width="120"
                align="center"
              >
                <template slot-scope="{ row, $index }">
                  <el-select v-model="row.Period" :disabled="!!row.EquipmentId">
                    <el-option
                      v-for="(item, index) in serviceInterval"
                      :key="index"
                      :label="item.text"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="下次保养日期"
                min-width="160"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-date-picker
                    placeholder="请选择"
                    type="date"
                    value-format="yyyy-MM-dd"
                    v-model="row.NextMaintenanceDate"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column
                label="保养周期（天）"
                min-width="90"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-input-number
                    style="width: 100%;"
                    :controls="false"
                    placeholder="请输入"
                    controls-position="right"
                    v-model="row.MaintainPeriod"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="提前预警天数"
                min-width="90"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-input-number
                    style="width: 100%;"
                    :controls="false"
                    placeholder="请输入"
                    controls-position="right"
                    v-model="row.ReminderDay"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="保养负责人"
                min-width="180"
                align="center"
              >
                <template slot-scope="{ row }">
                  <choose-user v-model="row"></choose-user>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="80" align="center">
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="text"
                    text-plain
                    @click="removeMaintenanceItem(row, $index, 1)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="card">
          <div class="card-header f-b-c" ref="inspection">
            <div class="title">点检计划</div>
            <div>
              <el-button
                type="primary"
                @click="addInspectionItem({ levelIndex: 1 })"
                >新增</el-button
              >
              <el-button @click="collapseChange(2)">{{
                collapses.some(index => index == 2) ? "收起" : "展开"
              }}</el-button>
            </div>
          </div>
          <div class="card-body" v-show="collapses.some(index => index == 2)">
            <el-table
              border
              :data="info.SpotCheckPlans"
              :header-cell-style="$tableStyle"
              :span-method="__handlerMergeSpan"
            >
              <el-table-column label="点检部位" min-width="240" align="center">
                <template slot-scope="{ row }">
                  <div class="input-combination">
                    <el-input
                      placeholder="请输入"
                      v-model="row.Position"
                    ></el-input>
                    <div class="input-operation">
                      <div
                        class="add"
                        @click="
                          addInspectionItem({
                            levelIndex: 1,
                            item: row,
                            index: $index
                          })
                        "
                      ></div>
                      <div
                        class="remove"
                        @click="removeInspectionItem(row, $index, 1)"
                      ></div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="点检标准" min-width="350" align="center">
                <template slot-scope="{ row }">
                  <div class="input-combination">
                    <el-input
                      placeholder="请输入"
                      v-model="row.Standard"
                    ></el-input>
                    <div class="input-operation">
                      <div
                        class="add"
                        @click="
                          addInspectionItem({
                            levelIndex: 2,
                            item: row,
                            index: $index
                          })
                        "
                      ></div>
                      <div
                        class="remove"
                        @click="removeInspectionItem(row, $index, 2)"
                      ></div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="点检周期" min-width="180" align="center">
                <template slot-scope="{ row, $index }">
                  <div class="input-combination">
                    <el-select placeholder="请选择" v-model="row.Period">
                      <el-option
                        v-for="(item, index) in inspectionCycle"
                        :key="index"
                        :label="item.text"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <div class="input-operation">
                      <div
                        class="add"
                        @click="
                          addInspectionItem({
                            levelIndex: 3,
                            item: row,
                            index: $index
                          })
                        "
                      ></div>
                      <div
                        class="remove"
                        @click="removeInspectionItem(row, $index, 3)"
                      ></div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="点检人" min-width="180" align="center">
                <template slot-scope="{ row }">
                  <choose-user v-model="row"></choose-user>
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
      </el-scrollbar>
      <div class="edit-footer">
        <el-button cancel @click="close">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="save"
          >确认</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import request_mixin from "@/mixins/request-mixin";
import fileList from "@/components/common/file-list.vue";
import mergeSpan from "@/mixins/merge-span-mixin";
const defaultInfo = {
  EquipmentId: "",
  EquipmentTypeName: "",
  EquipmentName: "",
  Specification: "",
  MainParameter: "",
  Manufacturer: "",
  Manufacturer: "",
  FactoryDate: "",
  FactoryNo: "",
  OwnCode: "",
  SupplySource: "",
  UseLocation: "",
  WarehouseSetId: "",
  EntryDate: "",
  DepartureDate: "",
  DepartmentId: "",
  ResponsibleUserId: "",
  SupplyStatus: 1, // 状态
  EquipmentPhotos: [],
  EquipmentFiles: [],
  Certificates: [],
  Insures: [],
  Others: [],
  MaintenancePlans: [],
  SpotCheckPlans: [],
  SecurityLevel: "1",
  DepartmentId: [],
  EnterpriseId: ""
};
const defaultMaintainItem = {
  EquipmentId: 0,
  Name: "",
  Position: "",
  Item: "",
  Content: "",
  Period: "",
  NextMaintenanceDate: "",
  MaintainPeriod: "",
  ReminderDay: "",
  UserId: ""
};
const defaultInspectionItem = {
  EquipmentId: 0,
  Position: "",
  Standard: "",
  Period: "",
  UserId: ""
};
const certKeysName = { Certificates: "证件", Insures: "保险", Others: "其他" };
function _extends(obj) {
  return JSON.parse(JSON.stringify(obj));
}
let Sort1 = 1;
let Sort2 = 1;
export default {
  components: {
    fileList
  },
  mixins: [request_mixin, mergeSpan],
  data() {
    return {
      id: "",
      loading: false,
      dislogShow: false,
      submitLoading: false,
      info: _extends(defaultInfo),
      collapses: [1, 2, 3, "证件", "保险", "其他"],
      rules: {
        SecurityLevel: [
          { required: true, message: "请选择等级", trigger: ["change", "blur"] }
        ],
        EnterpriseId: [
          { required: true, message: "请选择企业", trigger: ["change", "blur"] }
        ],
        DepartmentId: [
          { required: true, message: "请选择部门", trigger: ["change", "blur"] }
        ],
        EquipmentId: [
          { required: true, message: "请选择设备", trigger: ["change", "blur"] }
        ],
        SupplyStatus: [
          { required: true, message: "请选择状态", trigger: ["change", "blur"] }
        ],
        WarehouseSetId: [
          { required: true, message: "请选择仓库", trigger: ["change", "blur"] }
        ],
          OwnCode: [
          { required: true, message: "自编码不能为空", trigger: ["change", "blur"] }
        ]
      },
      sourceList: [],
      inspectionCycle: [],
      serviceInterval: [],
      statusList: [],
      childCollapseActive: [],
      WarehouseList: []
    };
  },

  computed: {
    isEdit() {
      return !!this.id;
    },
    title() {
      return this.isEdit ? "编辑" : "新增";
    },
    certList() {
      let list = Object.keys(certKeysName)
        .map(key => {
          return {
            label: certKeysName[key],
            list: this.info[key] || []
          };
        })
        .filter(item => !!item.list.length);
      return list;
    }
  },
  watch:{
    'info.DepartmentId':{
        handler(newVal,oldVal){
            console.log(newVal,'newVal')
            if(newVal){
              // this.info.WarehouseSetId = `${this.info.WarehouseSetId}`.toString()
              console.log(this.info)
              this.getWarehouseCom(newVal)
            }
        },
        immediate:true,
        deep:true
    }
  },
  methods: {
    getEnterpriseId(e){
      console.log(e,'企业')
      if(!e){}
    },
    // 部门
    getDepartmentId(e) {
      console.log(e, "ee");
      if(e){
        this.getWarehouseCom(e);
      }else{
        this.WarehouseList=[]
        this.info.WarehouseSetId=[]
      }

    },
    async show(item) {
      this.dislogShow = true;
      await this.getServiceInterval();
      await this.getInspectionCycle();
      await this.getSupplySourceCom();
      await this.getSupplyStatusCom();

      if (item) {
        this.loading = true;
        this.id = item.EquipmentManageId;
        try {
          let res = await this.Get(
            `/GetEquipmentManage?equipmentManageId=${item.EquipmentManageId}`
          );
          if (res.status == 2000) {
            this.__generateSpanData({
              levelKeys: { 1: "Name", 2: "Position" },
              rowspanByColIndexs: { 1: "0|5|6|7|8|9", 2: "1" },
              levelLength: 3,
              list: res.data.MaintenancePlans
            });
            this.__generateSpanData({
              levelKeys: { 1: "Position", 2: "Standard" },
              rowspanByColIndexs: { 1: "0|4", 2: "1" },
              levelLength: 3,
              list: res.data.SpotCheckPlans
            });
              res.data.SupplySource == 0 ? "" : res.data.SupplySource;

              res.data.WarehouseSetId == 0 ? "" : res.data.WarehouseSetId;
            this.info = Object.assign(_extends(defaultInfo), res.data);
            this.info.SecurityLevel = this.info.SecurityLevel.toString();
            [
              ...(this.info.Certificates || []),
              ...(this.info.Insures || []),
              ...(this.info.Others || [])
            ].forEach(item => {
              this.childCollapseActive.push(item.CertificateId);
            });
            this.setCerts(res.data.CertificateList || [], this.info);
          } else {
            this.$message.error("获取数据失败");
            this.close();
          }
        } catch (error) {
          console.error(error);
        }
        this.loading = false;
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.$refs.scrollbar.wrap.scrollTop = 0;
      });
    },

    close() {
      this.dislogShow = false;
      this.submitLoading = false;
      this.id = "";
      this.childCollapseActive = [];
      (this.collapses = [1, 2, 3, "证件", "保险", "其他"]),
        (this.info = _extends(defaultInfo));
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
          this.__syncField(
            {
              1: [
                "Name",
                "NextMaintenanceDate",
                "MaintainPeriod",
                "ReminderDay",
                "UserId"
              ],
              2: ["Position"]
            },
            this.info.MaintenancePlans
          );
          this.__syncField(
            { 1: ["Position"], 2: ["Standard"] },
            this.info.SpotCheckPlans
          );
          if (
            this.info.MaintenancePlans.some(item => {
              let flag =
                !item.Name ||
                !item.NextMaintenanceDate ||
                !item.MaintainPeriod ||
                !item.ReminderDay ||
                !item.UserId ||
                !item.Position ||
                !item.Item ||
                !item.Content ||
                !item.Period;
              return flag;
            })
          ) {
            this.$refs.scrollbar.wrap.scrollTop = this.$refs[
              "maintenance"
            ].offsetTop;
            this.$message.error("请完善保养计划信息");
            return;
          } else if (
            this.info.SpotCheckPlans.some(item => {
              let flag =
                !item.Position ||
                !item.Standard ||
                !item.Period ||
                !item.UserId;
              return flag;
            })
          ) {
            this.$refs.scrollbar.wrap.scrollTop = this.$refs[
              "inspection"
            ].offsetTop;
            this.$message.error("请完善点检计划信息");
            return;
          }
          if(!this.info.SpotCheckPlans ||  this.info.SpotCheckPlans.length<1){
              this.$message.error("点检计划不能为空");
              return
          }
          // 相同名字的保养计划名称判断
          let MaintenancePlans = {};
          this.info.MaintenancePlans.forEach(item => {
            let id = item.id.split("-");
            if (!MaintenancePlans[id[0]]) {
              MaintenancePlans[id[0]] = item;
            }
          });
          let planNames = [];
          for (let key in MaintenancePlans) {
            let item = MaintenancePlans[key];
            if (planNames.indexOf(item.Name) == -1) {
              planNames.push(item.Name);
            } else {
              this.$refs.scrollbar.wrap.scrollTop = this.$refs[
                "maintenance"
              ].offsetTop;
              this.$message.error(`【${item.Name}】保养计划不能重复！`);
              return;
            }
          }
          // 相同名字的点检部位名称判断
          let SpotCheckPlans = {};
          this.info.SpotCheckPlans.forEach(item => {
            let id = item.id.split("-");
            if (!SpotCheckPlans[id[0]]) {
              SpotCheckPlans[id[0]] = item;
            }
          });
          let positionNames = [];
          for (let key in SpotCheckPlans) {
            let item = SpotCheckPlans[key];
            if (positionNames.indexOf(item.Position) == -1) {
              positionNames.push(item.Position);
            } else {
              this.$refs.scrollbar.wrap.scrollTop = this.$refs[
                "inspection"
              ].offsetTop;
              this.$message.error(`【${item.Position}】点检部位不能重复！`);
              return;
            }
          }
          this.submitLoading = true;
          try {
            let params = {
              ...this.info
            };
            let res = await this.Post("/SaveEquipmentManage", params);
            if (res.status == 2000) {
              this.$message.success("保存成功");
              this.$emit("load");
              this.close();
            } else {
              this.$message.error(res.message);
            }
          } catch (error) {
            console.error(error);
          }
          this.submitLoading = false;
        }
      });
    },
    collapseChange(n) {
      let index = this.collapses.indexOf(n);
      if (index == -1) {
        this.collapses.push(n);
      } else {
        this.collapses.splice(index, 1);
      }
    },
    addMaintenanceItem({ item, levelIndex, index }) {
      // 合并的列 1 2 对应级别
      let rowspanByColIndexs = {
        1: "0|5|6|7|8|9",
        2: "1"
      };
      this.__addTableItem({
        item: item, // 当前列
        index: index, // 当前下标
        defaultItem: { ..._extends(defaultMaintainItem), Sort: Sort1++ }, // 默认字段
        list: this.info.MaintenancePlans, // 表数据
        rowspanByColIndexs, // 需要合并的列
        levelIndex: levelIndex, // 第几级
        levelLength: 3 // 合并列共几级
      });
    },
    removeMaintenanceItem(item, index, levelIndex) {
      this.__removeTableItem({
        item,
        index,
        list: this.info.MaintenancePlans,
        levelIndex
      });
    },
    addInspectionItem({ item, levelIndex, index }) {
      // 合并的列 1 2 对应级别
      let rowspanByColIndexs = {
        1: "0|4",
        2: "1"
      };
      this.__addTableItem({
        item: item, // 当前列
        index: index, // 当前下标
        defaultItem: { ..._extends(defaultInspectionItem), Sort: Sort2++ }, // 默认字段
        list: this.info.SpotCheckPlans, // 表数据
        rowspanByColIndexs, // 需要合并的列
        levelIndex: levelIndex, // 第几级
        levelLength: 3 // 合并列共几级
      });
    },
    removeInspectionItem(item, index, levelIndex) {
      this.__removeTableItem({
        item,
        index,
        list: this.info.SpotCheckPlans,
        levelIndex
      });
    },
    selectEquipment() {
      this.$chooseEquipmentBaseData({}).then(async res => {
        this.info.EquipmentTypeName = res.EquipmentTypeName;
        this.info.EquipmentName = res.EquipmentName;
        this.info.EquipmentId = res.EquipmentId;
        let res1 = await this.Get(
          `/GetEquipment?EquipmentId=${res.EquipmentId}`
        );
        if (res1.status == 2000) {
          res1.data.MaintainItemList = res1.data.MaintainItemList.map(item => {
            item = {
              ...defaultInspectionItem,
              ...item,
              EquipmentId: res.EquipmentId,
              Sort: Sort1++
            };
            return item;
          });
          res1.data.SpotCheckItemList = res1.data.SpotCheckItemList.map(
            item => {
              item = {
                ...defaultInspectionItem,
                ...item,
                EquipmentId: res.EquipmentId,
                Sort: Sort2++
              };
              return item;
            }
          );
          this.__generateSpanData({
            levelKeys: { 1: "Position" },
            rowspanByColIndexs: { 1: "0|5|6|7|8|9", 2: "1" },
            levelLength: 3,
            list: res1.data.MaintainItemList
          });
          this.__generateSpanData({
            levelKeys: { 1: "Position", 2: "Standard" },
            rowspanByColIndexs: { 1: "0|4", 2: "1" },
            levelLength: 3,
            list: res1.data.SpotCheckItemList
          });
          this.info.MaintenancePlans = res1.data.MaintainItemList;
          this.info.SpotCheckPlans = res1.data.SpotCheckItemList;
          // todo: 设备证件相关信息，需要额外调用接口获取
          // CertificateClassification: 1证书 2保险 3其他
          let certRes = await this.Get(
            `/GetCertificateListById?certificateIds=${res1.data.CertificateIds}`
          );
          if (certRes.status == 2000) {
            this.setCerts(certRes.data || [], this.info);
          }
        }
      });
    },
    setCerts(list, info) {
      list.forEach(item => {
        this.childCollapseActive.push(item.CertificateId);
        Object.keys(certKeysName).forEach((key, index) => {
          if (!info[key]) {
            this.$set(info, key, []);
          }
          if (item.CertificateClassification == index + 1) {
            let o = info[key].find(o => o.CertificateId == item.CertificateId);
            if (!o) {
              info[key].push(item);
            }
          }
        });
      });
    },
    async getServiceInterval() {
      let res = await this.Get("/GetMaintainPeriodCom");
      if (res.status == 2000) {
        this.serviceInterval = res.data.map(item => {
          item.id = +item.id;
          return item;
        });
      }
      return Promise.resolve();
    },
    async getInspectionCycle() {
      let res = await this.Get("/GetSpotCheckPeriodCom");
      if (res.status == 2000) {
        this.inspectionCycle = res.data.map(item => {
          item.id = +item.id;
          return item;
        });
      }
      return Promise.resolve();
    },
    async getSupplySourceCom() {
      let res = await this.Get("/GetSupplySourceCom");
      if (res.status == 2000) {
        this.sourceList = res.data;
      }
      return Promise.resolve();
    },
    async getWarehouseCom(e) {
      let res = await this.Post("/GetWarehouseSetList", {
        page: 1,
        rows: 9999,
        SearchDepartmentId:e,
      });
      if (res.status == 2000) {
        this.WarehouseList = res.data.list;
      }
      return Promise.resolve();
    },
    async getSupplyStatusCom() {
      let res = await this.Get("/GetSupplyStatusCom");
      if (res.status == 2000) {
        this.statusList = res.data;
      }
      return Promise.resolve();
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.full-screen-edit {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: #f4f5f7;
  .el-form {
    height: 100%;
  }
  /deep/ .el-form-item {
    margin-bottom: 25px;
    .el-form-item__label {
      padding-bottom: 9px;
      line-height: 20px;
    }
  }
  .el-date-editor,
  .el-select {
    width: 100%;
  }
  .form-3-col {
    display: flex;
    > div {
      flex: 1;
      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .split-line {
    &::before {
      content: "";
      display: block;
      margin: 0 -25px 25px;
      height: 10px;
      background: #f2f2f2;
    }
  }
  .card {
    border-radius: 10px;
    padding: 0 32px;
    background: #fff;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .card-header {
      padding: 14px 0;
    }
    .card-body {
      padding: 3px 0 10px;
    }
    .content {
      padding: 20px 0;
    }
    .title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      &::before {
        content: "";
        border-radius: 2px;
        margin-right: 8px;
        width: 5px;
        height: 16px;
        background: $--color-primary;
      }
    }
    /deep/ .el-table--border {
      border-radius: 10px;
      .el-table__header-wrapper {
        border-radius: 10px 10px 0 0;
      }
    }
  }
  .scrollbar {
    height: calc(100% - 90px);
    /deep/ .el-scrollbar__wrap {
      height: 100%;
    }
  }
  .edit-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-radius: 10px;
    margin-top: 10px;
    padding: 0 32px;
    height: 80px;
    background: #fff;
    .el-button {
      width: 110px;
    }
    [cancel] {
      border-color: #f5f6fa;
      background: #f5f6fa;
    }
  }
  .input-combination {
    display: flex;
    width: 100%;
    .el-input {
      flex: 1;
      width: calc(100% - 20px);
    }
    .input-operation {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 5px;
      padding: 2px 0 3px;
      .add,
      .remove {
        border-radius: 100%;
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
      .add {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $--color-primary;
        &::before,
        &::after {
          content: "";
          position: absolute;
          width: 60%;
          height: 1px;
          background: #fff;
        }
        &::after {
          transform: rotate(90deg);
        }
      }
      .remove {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #d5d5d5;
        &::before {
          content: "";
          width: 60%;
          height: 1px;
          background: #fff;
        }
      }
    }
  }
  /deep/ .el-collapse {
    margin-top: 28px;
    border: 0;
    .el-collapse-item {
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      margin-bottom: 20px;
      overflow: hidden;
      &.is-active {
        .el-collapse-item__header {
          border-bottom: 1px solid #dcdfe6;
        }
      }
      .el-input.is-disabled .el-input__inner,
      .el-textarea.is-disabled .el-textarea__inner {
        color: #84888f;
        background: #f7f8f9;
      }
      .el-collapse-item__header {
        border: 1px solid transparent;
        padding: 14px 20px;
        background: #f5f6fa;
        line-height: inherit;
        .operation {
          color: $primary-color;
          .switch {
            display: flex;
            align-items: center;
            &::before {
              content: "";
              border: 8.25px solid $primary-color;
              border-bottom: 0;
              border-right: 6px solid transparent;
              border-left: 6px solid transparent;
              margin-right: 6px;
              width: 0;
              height: 0;
              transform-origin: center;
              transform: rotateX(0);
              transition: all 0.2s linear;
            }
            &.open {
              &::before {
                transform: rotateX(180deg);
              }
            }
          }
          > div:last-child {
            margin-left: 22px;
          }
        }
      }
      .el-collapse-item__arrow {
        display: none;
      }
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item__content {
        padding: 20px;
      }
    }
  }
}
</style>
