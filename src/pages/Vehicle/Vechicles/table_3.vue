<template>
	<!-- <div> -->
	<!-- <el-button type="primary"
               plain
               icon="el-icon-plus"
               @click="add()"
               style='margin:10px 0'>新增</el-button>
    <el-table :data="tableData"
              border
              :header-cell-style='{"text-align":"center"}'
              :cell-style="{'text-align':'center'}"
              style="width: 100%">
      <el-table-column label="序号"
                       width="50"
                       type="index">
      </el-table-column>
      <el-table-column prop="MaintainDate"
                       label="维修日期"
                       width="180">
        <template slot-scope="scope">
          <el-date-picker type="date"
                          placeholder="维修日期"
                          value-format='yyyy-MM-dd'
                          v-model="scope.row.MaintainDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="累计行驶里程(KM)"
                       prop="AccumulatedMileage">
        <template slot-scope="scope">
          <el-input type="number"
                    v-model="scope.row.AccumulatedMileage"
                    placeholder="累计行驶里程"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="维修类别"
                       prop="date1">
        <template slot-scope="scope">
          <el-select v-model="scope.row.MaintainTypeCode"
                     clearable
                     placeholder="请选择">
            <el-option v-for='(item,i) in MaintainTypeCom'
                       :key='i'
                       :value="item.id"
                       :label="item.text"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="修理内容"
                       prop="MaintainContent">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="修理内容"
                    v-model="scope.row.MaintainContent"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="维修单位"
                       prop="MaintainCompany">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="维修单位"
                    v-model="scope.row.MaintainCompany"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="合格证编号"
                       prop="FactoryCertificateNo">
        <template slot-scope="scope">
          <el-input type="text"
                    placeholder="合格证编号"
                    v-model="scope.row.FactoryCertificateNo"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="登记人员"
                       width="80"
                       prop="RegistrantName">
      </el-table-column>
      <el-table-column label="操作"
                       width="80">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="danger"
                     @click='dele(scope.row,scope.$index)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
	<!-- </div> -->
	<page-layout :loading="loading" element-loading-text="拼命加载中" :pages="pages" @current-change="handleCurrentChange">
		<el-table :data="tableData" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%" border>
			<el-table-column label="序号" type="index" align="center" header-align="center" width="50">
			</el-table-column>
			<el-table-column label="状态" align="center" prop="Status" width="100" :show-overflow-tooltip="true">
				<template slot-scope="scope"  v-if="scope.row.Status">
					<span>{{getStatus(scope.row.Status)}}</span>
				</template>
			</el-table-column>
			<el-table-column label="订单号" align="center" prop="OrderNo" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="承运商" align="center" prop="Carrier" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="车牌号" align="center" prop="VehicleNo" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="司机/电话" align="center" prop="DiverName_Tel" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="报修电话" align="center" prop="RepairHotline" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="报修时间" align="center" prop="RepairDateDesc" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="维修类型" align="center" prop="Type" width="100" :show-overflow-tooltip="true">
				<template slot-scope="scope" v-if="scope.row.Type">
					<span>{{getType(scope.row.Type)}}</span>
				</template>
			</el-table-column>
			<el-table-column label="配件名称" align="center" prop="Goodsspec" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="配件单位" align="center" prop="Stkunit" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="配件数量" align="center" prop="Qty" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="配件单价" align="center" prop="GoodsPrice" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="工时" align="center" prop="HourTotal" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="维修厂商" align="center" prop="RepairFactory" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="维修费用" align="center" prop="RepairMoney" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="故障描述" align="center" prop="Desc" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="维修开始时间" align="center" prop="RepairStartDate" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="维修结束时间" align="center" prop="RepairEndDateDesc" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="备注" align="center" prop="Remark" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="审核人" align="center" prop="ApproveBy" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="审核时间" align="center" prop="ApproveTime" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="更新人" align="center" prop="CreateByName" width="100" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="更新时间" align="center" prop="CreateTimeDesc" width="100" :show-overflow-tooltip="true">
			</el-table-column>
		</el-table>
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import Qs from "qs";
	export default {
		mixins: [request_mixin],
		data() {
			return {
				loading: false,
				tableData: [],
				MaintainTypeCom: [], //下拉
				nickname: '',
				pages: {
					total: 0,
					page: 1,
					rows: 10
				},
			}
		},
		watch: {
			'VehicleNo': function(newVal, oldVal) {
				this.GetMaintains()
			},
			deep: true,
		},
		props: {
			VehicleNo: {
				type: String,
			},

		},
		created() {
			let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
			this.nickname = userInfo.UserName;
			this.GetMaintainTypeCom()
			this.GetMaintains()
		},
		methods: {
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetMaintains();
			},
			getStatus(item) {
				let statusObj = {
					1: '正常',
					2: '注销',
					3: '已审批',
					4: '维修完成'
				}
				return statusObj[item];
			},
			getType(item) {
				let typeObj = {
					1: '保养',
					2: '维修',
				}
				return typeObj[item];
			},
			GetMaintains() {
				this.Post('/GetHHMaintains', {
					VehicleNo: this.VehicleNo,
          ...this.pages,
				}).then(res => {
					if (res.status == 2000) {
						this.tableData = res.data.list
						this.pages.total= res.data.count
						console.log(res.data.list,'res.data.list维修单')
					}

				})
			},
			dele(item, index) {
				this.tableData.splice(index, 1);
			},
			add() {
				this.tableData.push({
					MaintainDate: '', //DateTime 检测/评定 时间
					AccumulatedMileage: '', //累计行驶里程
					MaintainTypeCode: '', // string 检测/评定 类别 编码
					MaintainContent: '', // string 维护和修理 内容
					MaintainCompany: '', // string 维护和修理 单位
					FactoryCertificateNo: '', // string 维护和修理 出厂合格证编号
					Remark: '', // string 备注
					RegistrantName: this.nickname
				})
			},
			GetMaintainTypeCom() {
				this.Get('/GetMaintainTypeCom').then(res => {
					if (res.status == 2000) {
						this.MaintainTypeCom = res.data
					}
				})
			},

			submits() {

				this.Post('/SaveMaintains', {
					Maintains: this.tableData,
					VehicleId: this.id,
					EnterpriseId: this.EnterpriseId
				}).then(res => {
					if (res.status == 2000) {
						this.$message({
							message: '保存成功！',
							type: 'success'
						});
						this.GetMaintains()
					}
				})
			}
		}
	}
</script>
<style scoped>
</style>
