<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags v-model="filters.EnterpriseId"
							@clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<el-form-item>
						<select-position v-model="filters.PositionId" :multiple="false" clearable
							placeholder="岗位"></select-position>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="点检人" clearable v-model="filters.UserName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-select placeholder="点检状态" clearable v-model="filters.Status">
							<el-option label="未完成" value="0"></el-option>
							<el-option label="已完成" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
						<el-popover width="400" trigger="click">
							<div>
								<el-form-item>
									<custom-date-range style="width: 360px;" startDatePlaceholder="点检开始日期"
										endDatePlaceholder="点检结束日期" :hasIsLong="false"
										v-model="filters.date"></custom-date-range>
								</el-form-item>
								<el-form-item>
									<el-select placeholder="设备类型" clearable v-model="filters.EquipmentTypeName"  style="width: 100%;">
										<el-option v-for="(item, index) in typeList" :key="index" :label="item"
											:value="item"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-input placeholder="设备名称/自编号/安装位置" clearable v-model="filters.Query"></el-input>
								</el-form-item>
								<el-form-item>
									<el-input placeholder="负责人" clearable v-model="filters.ResponsibleUserName"></el-input>
								</el-form-item>

							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
			</div>
			<!-- <div class="f--c">
				<el-button @click="downloadmbs(1310, 13103, filters)">导出</el-button>
			</div> -->
		</div>
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="设备名称" align="center" show-overflow-tooltip width="110" show-overflow-tooltip prop="EquipmentName">
			</el-table-column>
			<!-- <el-table-column label="企业/部门" align="center" show-overflow-tooltip width="110">
				<template slot-scope="scope">
					{{scope.row.EnterpriseName + '-' + scope.row.DepartmentName}}
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center" prop="" show-overflow-tooltip width="110">
			</el-table-column> -->
		
			
			<el-table-column label="设备类型" align="center" show-overflow-tooltip width="80" prop="EquipmentTypeName">
			</el-table-column>
			
			<el-table-column label="自编号" align="center" show-overflow-tooltip width="110" prop="OwnCode" :formatter="formatterDefaultValue">
			</el-table-column>
			<el-table-column label="位置" align="center" show-overflow-tooltip width="110" prop="UseLocation"
				:formatter="formatterDefaultValue">
			</el-table-column>
			<el-table-column label="点检人" align="center" prop="UserName" show-overflow-tooltip width="80">
			</el-table-column>
			<el-table-column label="岗位" align="center" show-overflow-tooltip width="110">
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column>
				<el-table-column label="企业/部门" align="center" header-align="center"
				show-overflow-tooltip width="110">
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' + item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			
			<!-- <el-table-column
                label="使用部门"
                align="center"
                width="140"
                prop="DepartmentName"
                :formatter="formatterDefaultValue"
            >
            </el-table-column> -->
			<el-table-column label="负责人" align="center" show-overflow-tooltip width="110" prop="ResponsibleUserName"
				:formatter="formatterDefaultValue">
			</el-table-column>
			<el-table-column label="点检周期" align="center" show-overflow-tooltip width="110" show-overflow-tooltip prop="PeriodDesc">
			</el-table-column>
			<el-table-column label="点检日期" align="center" show-overflow-tooltip width="110" prop="RecordDateDesc"
				:formatter="formatterDefaultValue">
			</el-table-column>
			 <el-table-column label="点检计划日期" align="center" show-overflow-tooltip width="110" prop="RecordDateDesc"
				:formatter="formatterDefaultValue">
				<template slot-scope="scope">
					 <div>{{getDataJh(scope)}}</div>
				</template>
			</el-table-column>
			<el-table-column label="点检结果" align="center" show-overflow-tooltip width="100" prop="Result" :formatter="formatterResult">
			</el-table-column>
			<el-table-column label="点检状态" align="center" width="110" fixed="right">
				<template slot-scope="{ row }">
					<whether :yes="row.Status == 1" :class="{warning: row.Status == 3, gray: row.Status == 4}"
						:text="statusObj[row.Status]" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="80" fixed="right">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<!-- 查看需要根据保养状态显示，已保养才有查看 -->
						<el-button type="text" @click="add(row, true)" v-if="row.Status == 1">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<info ref="info" @load="handlePageChange(1)" />
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import Download from "@/mixins/Download.js";
	import Import_export from "@/mixins/Import_export.js";
	import info from './info';
	export default {
		components: {
			info
		},
		mixins: [request_mixins, Download, Import_export],
		data() {
			return {
				loading: false,
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {
					date: '',
				},
				statusObj: {
					0: '未点检',
					1: '已点检',
					2: '逾期未完成',
					3: '逾期已完成',
				},
				typeList: []
			}
		},
		created() {
			this.getEquipmentTypeList();
			this.handlePageChange(1);
		},
		methods: {
			getDataJh(scope){
				console.log(scope,'时间1111')
				let data = scope.row.StartDate;
				console.log(this.getData(data),'转化时间')
				if(scope.row.PeriodDesc == '月'){
                     let month = this.getData(data).split('-')[1];
					 return `${Number(month)}月`
				}
				if(scope.row.PeriodDesc == '周'){
						const date2 = new Date(data);
						const weekNumber = getISOWeekNumber(date2)
						return `${date.getFullYear()} 年的第 ${weekNumber} 周`
				}
				if(scope.row.PeriodDesc == '天'){
					return `${this.getData(data)}`
				}


			},
			getData(dateStr){
					const date = new Date(dateStr);

					const year = date.getFullYear();
					const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以要加 1，并补零
					const day = String(date.getDate()).padStart(2, '0');

					const formattedDate = `${year}-${month}-${day}`;
   
					return formattedDate
					console.log(formattedDate);
			},
			getISOWeekNumber(date) {
					const target = new Date(date.valueOf());
					const dayNr = (target.getDay() + 6) % 7;
					target.setDate(target.getDate() - dayNr + 3);
					const firstThursday = target.valueOf();
					target.setMonth(0, 1);
					if (target.getDay() !== 4) {
						target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
					}
					return 1 + Math.ceil((firstThursday - target) / 604800000);
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
				let date = params.date.split(',');
				params.StartDate = date[0] || '';
				params.EndDate = date[1] || '';
				this.loading = true;
				try {
					// let res = await this.Post('/GetSpotCheckRecordList', params);
					let res = await this.Post('/GetTaskSpotCheckRecords', params);
					if (res.status === 2000) {
						this.list = res.data.list;
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			add(item) {
				this.$refs.info.show(item)
			},
			async getEquipmentTypeList() {
				let res = await this.Get('/GetEquipmentTypeList?equipmentTypeName=');
				if (res.status) {
					this.typeList = res.data;
				}
			},
			formatterDefaultValue(row, column, cellValue, index) {
				return cellValue || '-'
			},
			formatterResult(row, column, cellValue, index) {
				let obj = ['未点检', '正常', '异常', '异常当场解决'];
				return obj[cellValue];
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}

	.el-form-item {
		margin-bottom: 10px !important;
	}
</style>