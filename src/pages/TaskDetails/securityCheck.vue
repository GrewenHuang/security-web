<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input placeholder="检查编号" clearable v-model="filters.DepartmentName"></el-input>
				<el-input placeholder="检查人" clearable v-model="filters.InspectionUserName"></el-input>
				<el-input placeholder="检查计划名称" clearable v-model="filters.InspectionPlanName"></el-input>
				<!-- <el-input placeholder="检查编号" clearable v-model="filters.Number"></el-input> -->
				<el-cascader v-model="filters.DepartmentId" filterable clearable :options="DepartmentPositionUser"
					@change="handleCascaderChange" placeholder="责任部门" :show-all-levels="false" style="width: 180px"
					:props="{ value: 'value', label: 'label', children: 'children',checkStrictly: true  }">
				</el-cascader>
				<el-date-picker v-model="timeData" type="daterange" @change="onChangeDate"
					value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
				<el-popover width="300" trigger="click">
					<div>
						<el-input placeholder="检查表" clearable v-model="filters.InspectionName"></el-input>
						<el-select placeholder="检查类型" clearable v-model="filters.InspectionNatureCode" style="margin-top: 10px;width: 100%">
							<el-option v-for="(item, index) in inspectionCycles" :key="index" :label="item.text"
								:value="item.id"></el-option>
						</el-select>
						<el-select placeholder="检查状态" clearable v-model="filters.IsComplete" style="margin-top: 10px;width: 100%">
								<el-option label="已完成" :value="1"></el-option>
								<el-option label="未完成" :value="0"></el-option>
						</el-select>
					</div>
					<el-button slot="reference" type="text">更多筛选</el-button>
				</el-popover>
			</div>
			<!-- <div class="f--c">
				<el-button-group style="margin-right: 10px;">
					<el-button>下载报告</el-button>
					<el-button>导出台账</el-button>
				</el-button-group>

			</div> -->
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column
			    label="检查编号"
			    align="center"
			    prop="Number"
				width="150"
			></el-table-column>
			<el-table-column
			    label="部门"
			    align="center"
			    prop="DepartmentName"
			></el-table-column>
			<el-table-column label="检查计划名称" align="center" prop="InspectionPlanName">
			</el-table-column>
			<el-table-column label="检查表" align="center" prop="InspectionName">
			</el-table-column>

			<el-table-column label="检查类型" align="center" prop="InspectionNatureName">
			</el-table-column>
			<el-table-column label="检查人" align="center" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<template v-if="row.InspectionRecordUsers && row.InspectionRecordUsers.length">
						<span v-for="(item, i) in row.InspectionRecordUsers" :key="i">
							<template>
								{{ item.UserName }}
							</template>
						</span>
					</template>
				</template>
			</el-table-column>
			<el-table-column label="检查日期" align="center" prop="PlanInspectionDateDesc"></el-table-column>
			<el-table-column label="检查项" align="center" prop="ItemContentCount"></el-table-column>
			<el-table-column label="完成项" align="center" prop="CompleteCount"></el-table-column>
			<el-table-column label="隐患数" align="center" prop="PotentialCount">
				<template slot-scope="{ row }">
					<span @click="onDanger(row)" style="cursor: pointer;">{{row.PotentialCount}}</span>
				</template>
			</el-table-column>
			<el-table-column label="检查状态" align="center">
				<template slot-scope="{ row }">
				    <whether :yes="row.IsComplete == 1" :text="row.IsComplete == 1 ? '已完成' : '未完成'"/>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="190">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="preview(row)" v-if="$_has('AQJCBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<info ref="info" @load="handlePageChange(1)"/>
		<el-dialog v-dialog-drag title="隐患详情" :visible.sync="dangerShow" @close="dangerShow = false" class="info" width="80%"
			top="3vh" v-loading="loading" element-loading-text="数据加载中" :append-to-body="true">
			<dangerInfo ref="dinfo"></dangerInfo>
		</el-dialog>
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import info from '@/pages/inspectionRecords/info';
	import dangerInfo from '@/pages/inspectionRecords/dangerInfo';
	import Import_export from "@/mixins/Import_export.js";
	export default {
		components: {
			info,
			dangerInfo
		},
		mixins: [request_mixins, Import_export],
		props: {
			isRouter: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dangerShow: false,
				timeData: [],
				loading: false,
				inspectionCycles: [],
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0,
				},
				filters: {},
				DepartmentPositionUser: []
			}
		},
		created() {
			this.handlePageChange(1);
			this.getInspectionNatureCom()
		},
		mounted(){
			this.Get('/GetDepartmentTree').then((res) => {
				//部门
				if (res.status == 2000) {
					this.DepartmentPositionUser = res.data
					if (this.DepartmentPositionUser && this.DepartmentPositionUser.length > 0) {
						this.removeEmptyChildrenDepartment(this.DepartmentPositionUser)
					}
			
				}
			})
		},
		methods: {
			handleCascaderChange(value) {
				if (value.length > 0) {
					const lastId = value[value.length - 1];
					this.filters.DepartmentId = lastId
					// 在这里可以对最后一级的 ID 进行你需要的操作
				}
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
			onDanger(row) {
				if (row.PotentialCount > 0) {
					this.dangerShow = true;
					this.$nextTick(()=>{
						this.$refs.dinfo.show(row.InspectionRecordId)
					})
				}
			},
			onChangeDate(e) {
				// 选择时间
				if(e){
					this.filters.InspectionStartDate = e[0]
					this.filters.InspectionEndDate = e[1]
				}else {
					this.filters.InspectionStartDate = ''
					this.filters.InspectionEndDate = ''
				}
				
			},
			handlePageChange(val) {
				this.pages.page = val;
				this.getList();
			},
			async getList() {
				let params = {
					...this.pages,
					...this.filters,
				}
				this.loading = true;
				try {
					let res = await this.Post('/GetInspectionRecords', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			async getInspectionNatureCom() {
				let res = await this.Get('/GetInspectionNatureCom');
				if (res.status == 2000) {
					this.inspectionCycles = res.data.filter(item => item.id != '0030408');
				};
			},
			preview(row) {
				this.$refs.info.show(row)
			},
		}
	}
</script>

<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>