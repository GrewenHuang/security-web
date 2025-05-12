<template>
  <page-layout
    :loading="loading"
    :pages="pages"
    @current-change="handlePageChange"
  >
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <!-- <el-select
          placeholder="设备类型"
          clearable
          v-model="filters.EquipmentTypeName"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select> -->
        <el-cascader
        v-model="mselectVal"
          :options="options"
          :props="{ multiple: true }"
          placeholder="请选择设备类型"
          collapse-tags
          clearable
        ></el-cascader>
        <el-input
          placeholder="设备名称/自编号/安装位置"
          clearable
          v-model="filters.Query"
        ></el-input>
        <!-- 添加部门和仓库搜索 -->
        <el-select
          v-model="DepartmentId"
          clearable
          filterable
          placeholder="部门"
        >
          <el-option
            v-for="item in departementlist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="WarehouseSetId"
          clearable
          filterable
          placeholder="仓库"
        >
          <el-option
            v-for="(item, index) in WarehouseList"
            :key="index"
            :label="item.WarehouseName"
            :value="item.WarehouseSetId"
          ></el-option>
        </el-select>
        <!-- <el-input
                    placeholder="部门"
                    clearable
                    v-model="filters.ResponsibleUserName"
                ></el-input> -->
        <el-input
          placeholder="负责人"
          clearable
          v-model="filters.ResponsibleUserName"
        ></el-input>
        <el-select placeholder="状态" clearable v-model="filters.SupplyStatus">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
      </div>
      <div class="f--c">
        <el-button-group
          style="margin-right: 10px;"
          v-if="$_has('SBSSBtnDown')"
        >
          <el-button
            @click="downloadmb('GetTemplateFile?templateFileEnumNum=3')"
            >下载导入模板</el-button
          >
          <el-button v-if="$_has('SBSSBtnImport')">
            <el-upload
              action="#"
              :show-file-list="false"
              :on-change="
                file => {
                  handleExcel(file, 'ImportEquipmentManage', { IsPrivate: 0 });
                }
              "
              accept=".xls,.xlsx"
              :auto-upload="false"
              >导入
            </el-upload>
          </el-button>
          <el-button
            @click="downloadmbs(1310, 13101, filters)"
            v-if="$_has('SBSSBtnExport')"
            >导出</el-button
          >
        </el-button-group>
        <el-button type="primary"  @click="showQrCode2()"
				>打印</el-button>
        <el-button type="primary" @click="add()" v-if="$_has('SBSSBtnAdd')"
          >新增</el-button
        >
      </div>
    </div>
    	<!--列表 开始-->
    <el-table
      :data="list"
      highlight-current-row
      :header-cell-style="$tableStyle"
      style="width: 100%"
      @selection-change="handleSelectionChange" 
      border
    >
      	<el-table-column type="selection" width="55" align="center">
			</el-table-column>
         <el-table-column
        label="设备名称"
        align="center"
      width="100"
        prop="EquipmentName"
      >
      </el-table-column>

        <!-- <el-table-column
        label="设备ID"
        align="center"
        width="100"
        prop="EquipmentManageId"
      >
      </el-table-column> -->
      <el-table-column
        label="设备类型"
        align="center"
        width="100"
        prop="EquipmentTypeName"
      >
      </el-table-column>
           <el-table-column label="设备编码" align="center" width="100" prop="OwnCode">
      </el-table-column>

     
         <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{ row }">
          <whether
            :yes="row.SupplyStatus == 1"
            :class="{
              warning: row.SupplyStatus == 3,
              gray: row.SupplyStatus == 4
            }"
            :text="row.SupplyStatusDesc"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="部门"
        align="center"
        width="100"
        prop="DepartmentName"
      >
      </el-table-column>

      <el-table-column
        label="仓库"
        align="center"
       
        prop="WarehouseName"
      >
      </el-table-column>
      <el-table-column
        label="使用位置"
        align="center"
        width="150"
        prop="UseLocation"
      >
      </el-table-column>
      <el-table-column
        label="负责人"
        align="center"
        width="120"
        prop="ResponsibleUserName"
      >
      </el-table-column>
         <el-table-column
        label="更新人"
        align="center"
        width="120"
        prop="UpdateByName"
      >
      </el-table-column>
         <el-table-column
        label="更新时间"
        align="center"
        width="120"
        prop="UpdateByTime"
  
      >
      <template  slot-scope="scope">
        {{getDateY(scope.row.UpdateByTime)}}
      </template>
      </el-table-column>
      <!-- <el-table-column
        label="来源"
        align="center"
        width="100"
        prop="SupplySourceDesc"
      >
      </el-table-column>
      <el-table-column
        label="进场日期"
        align="center"
        width="120"
        prop="EntryDateDesc"
      >
      </el-table-column> -->
    
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="{ row }">
          <div class="table-operation">
            <el-button
              type="text"
              @click="preview(row, true)"
              v-if="$_has('SBSSBtnLook')"
              >查看</el-button
            >
            <el-button type="text" @click="add(row)" v-if="$_has('SBSSBtnEdit')"
              >编辑</el-button
            >
            <el-button type="text" @click="showQrCode(row)"  v-if="$_has('SBSSBtnSM')">二维码</el-button>
            <el-button
              type="text"
              text-plain
              @click="remove(row)"
              v-if="$_has('SBSSBtnDelete')"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <info slot="full" ref="info" @load="handlePageChange(1)" />
    <qr-code ref="qrCode"></qr-code>
    <qr-code-2 ref="qrCode2"></qr-code-2>

    <preview slot="full" ref="preview"></preview>
  </page-layout>
</template>

<script>
import request_mixins from "@/mixins/request-mixin";
import info from "./info";
import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import QrCode from "./qrCode.vue";
import QrCode2 from './qrCode2.vue';
import preview from "./preview.vue";
import { indexOf } from "lodash";

export default {
  components: {
    info,
    preview,
    QrCode,
    QrCode2
  },
  mixins: [request_mixins, Download, Import_export, upload_mixin],
  data() {
    return {
      multipleSelection:[],
      mselectVal:[],
      selectValue: "",
      loading: false,
      list: [],
      WarehouseSetId: "",
      DepartmentId: "",
      WarehouseList: [],
      departementlist: [],
      pages: {
        rows: 10,
        page: 1,
        total: 0
      },
      filters: {},
      typeList: [],
      statusList: [],
      options: []
    };
  },
  created() {
    this.getEquipmentTypeList();
    this.getStatusList();
    this.handlePageChange(1);
    this.getDepartment();
    this.getWarehouseSetList();
    this.getEquipmentAllList()
  },
  methods: {
    // 选中的数据
    		handleSelectionChange(val) {
				this.multipleSelection = val
			},
    getDateY(row){
      console.log(row,'....')
      const isoDate = row;
        const date = new Date(isoDate);

        // 获取年、月、日
        const year = date.getFullYear();
        // 月份从 0 开始计数，所以要加 1
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // 拼接成目标格式
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    },
    getEquipmentAllList(){
      this.Get('/GetEquipmentAllList').then(res=>{
        let list = res.data.list;
        let obj = {}
        let newList = [
        {
            value: "特种设备",
            label: "特种设备"
          },
          {
            value: "常规设备",
            label: "常规设备"
          }
        ]
        list.forEach(item=>{
          let key = `${item.EquipmentTypeName}-${item.EquipmentName}`
          if(!obj[key]){
            obj[key] = item
          }
        })
         Object.keys(obj).forEach(key=>{
            if(key.indexOf('特种设备') !=-1){
              let objItem = {
                value: "",
                label: ""
              };
              if(!newList[0].children){
                newList[0].children = []
              }
              objItem.value = obj[key].EquipmentName;
              objItem.label = obj[key].EquipmentName;
              newList[0].children.push(objItem)
            }else{
              let objItem = {
                value: "",
                label: ""
              };
              if(!newList[1].children){
                newList[1].children = []
              }
              objItem.value = obj[key].EquipmentName;
              objItem.label = obj[key].EquipmentName;
              newList[1].children.push(objItem)
            }
         })
         this.options = newList;
   
        })

    },
    cascaderClick(e) {
      // console.log(e, "555555555");
      this.selectValue = e.label;
      console.log(this.selectValue, "this.selectValue");
    },
    handleActiveItemChange(nodeData) {
      // console.log(nodeData,'nodeData')
      // console.log(this.selectValue,'5555555555555')
      // if(nodeData)
      // this.selectValue = e.label
      // if (!nodeData.children) {
      //   this.selectValue = [nodeData.value];
      // }
    },
    getDepartment() {
      let that = this;
      this.Get(
        "/GetDepartmentListByAuthority?enterpriseId=4785056618100065"
      ).then(res => {
        if (res.status == 2000) {
          let data = res.data;
          let newList = [];
          that.setDepartment(data, newList);
          that.departementlist = newList;
          console.log(that.departementlist, "8888888888888");
        }
      });
    },
    getWarehouseSetList() {
      this.Post("/GetWarehouseSetList", {
        page: 1,
        rows: 9999
      }).then(res => {
        if (res.status == 2000) {
          this.WarehouseList = res.data.list;
        }
      });
    },
    setDepartment(data, newList) {
      let that = this;
      if (data && data.length > 0) {
        data.forEach(item => {
          let obj = {
            value: item.DepartmentId,
            label: item.Name
          };
          if (!newList) {
            newList = [];
          }
          newList.push(obj);

          if (item.children && item.children.length > 0) {
            that.setDepartment(item.children, newList);
          }
        });
      }
    },
    handlePageChange(val) {
      this.pages.page = val;
      this.GetList();
    },
    async GetList() {
      let strList = [];

      this.mselectVal.forEach(item=>{
        strList.push(item[1])
      })
      
      let EquipmentName = strList.join(',')
      console.log(EquipmentName,'EquipmentNameEquipmentName')
      console.log(strList,'mselectValmselectValmselectValmselectVal')
      let params = {
        ...this.pages,
        ...this.filters,
        DepartmentId: this.DepartmentId,
        WarehouseSetId: this.WarehouseSetId,
       
      };
      if(strList&& strList.length>0){
        params.EquipmentName = EquipmentName
      }
      this.loading = true;
      try {
        let res = await this.Post("/GetEquipmentManages", params);
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
      this.$refs.info.show(item);
    },
    remove(row) {
      this.$confirm("确认删除该条数据吗？").then(_ => {
        this.Post("/DeleteEquipmentManage", {
          ids: [row.EquipmentManageId]
        }).then(res => {
          if (res.status == 2000) {
            this.GetList();
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
    showQrCode(row) {
      console.log(row,'设备细腻些')
      this.$refs.qrCode.show(row);
    },
    showQrCode2(){

				this.$refs.qrCode2.show(this.multipleSelection);
			},
    preview(row) {
      this.$refs.preview.show(row);
    },
    async getEquipmentTypeList() {

      let res = await this.Get("/GetEquipmentTypeList?equipmentTypeName=");
      if (res.status) {
        // 设施类型
        console.log(res, "设施类型");
        // let list = [
        //   {
        //     value: "特种设备",
        //     label: "特种设备"
        //   },
        //   {
        //     value: "常规设备",
        //     label: "常规设备"
        //   }
        // ];
        // if (res.data && res.data.length > 0) {
        //   res.data.forEach(item => {
        //     if (
        //       item.includes("特种") ||
        //       item.includes("电梯") ||
        //       item.includes("叉车")
        //     ) {
        //       let obj = {
        //         value: "",
        //         label: ""
        //       };
        //       if (!list[0].children) {
        //         list[0].children = [];
        //       }
        //       obj.value = item;
        //       obj.label = item;
        //       if (obj.value) {
        //         list[0].children.push(obj);
        //       }
        //     } else {
        //       let obj = {
        //         value: "",
        //         label: ""
        //       };
        //       if (!list[1].children) {
        //         list[1].children = [];
        //       }
        //       obj.value = item;
        //       obj.label = item;
        //       if (obj.value) {
        //         list[1].children.push(obj);
        //       }
        //     }
        //   });
        // }
        // this.options = list;

        this.typeList = res.data;
      }
    },
    async getStatusList() {
      let res = await this.Get("/GetSupplyStatusCom");
      if (res.status) {
        this.statusList = res.data;
      }
    }
  }
};
</script>

<style></style>
