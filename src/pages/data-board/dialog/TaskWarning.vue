<template>
	<div>
		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 1">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="企业/部门" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' +
							item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="岗位" width="100" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column> -->
			<el-table-column label="培训人" align="center" width="80" prop="UserName"></el-table-column>
			<el-table-column label="培训名称" align="center" prop="TrainTaskName"></el-table-column>
			<el-table-column label="培训周期" align="center" width="200">
				<template slot-scope="scope">
					<div v-if="
						scope.row.TrainStartDateDesc &&
						scope.row.TrainEndDateDesc.length
					">
						<div>始 {{ scope.row.TrainStartDateDesc }} </div>
						<div>至 {{ scope.row.TrainEndDateDesc }}</div>
					</div>
					<div v-else>不限</div>
				</template>
			</el-table-column>
			<el-table-column label="学习状态" align="center" width="80" prop="TrainTaskStatuDesc"></el-table-column>
			<!-- <el-table-column label="考试状态" align="center" width="100" prop="ExamStateDesc"></el-table-column> -->
			<el-table-column label="创建时间" align="center" width="120" :formatter="dateFormatter" prop="GenerateDateDesc">
			</el-table-column>
		</el-table>

		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 2">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column prop="DepartmentName" label="企业/部门" align="center" header-align="center"
				show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' +
							item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="参与人" align="center" header-align="center" prop="UserName"
				show-overflow-tooltip></el-table-column>
			<el-table-column prop="SafetyMeetingTypeDesc" label="会议方式" align="center" header-align="center">
			</el-table-column>
			<el-table-column prop="MeetingTypeName" label="会议类型" align="center" header-align="center">
			</el-table-column>
			<el-table-column prop="Topics" label="主要议题" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="会议时间" align="center" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<span v-if="row.SafetyMeetingType == 1">{{ row.SessionStartTime | format('yyyy-MM-dd') }}至{{
						row.SessionEndTime | format('yyyy-MM-dd') }}</span>
					<span v-else>{{ row.SessionStartTimeDesc }}至{{ row.SessionEndTimeDesc }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="IsRelease" label="完成情况" align="center" header-align="center" show-overflow-tooltip
				width="120">
				<template slot-scope="scope">
					<whether :yes="scope.row.IsRelease == 1" :text="scope.row.IsRelease ? '已完成' : '未完成'" />
				</template>
			</el-table-column>
		</el-table>

		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 3">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>

			<el-table-column label="检查编号" align="center" prop="Number" show-overflow-tooltip></el-table-column>
			<el-table-column label="部门" align="center" prop="DepartmentName" show-overflow-tooltip></el-table-column>
			<el-table-column label="检查计划名称" align="center" prop="InspectionPlanName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="检查表" align="center" prop="InspectionName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="检查类型" align="center" prop="InspectionNatureName" show-overflow-tooltip>
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
			<el-table-column label="检查时间" align="center" format="yyyy-MM-dd" prop="StartInspectionDateDesc" width="150"
				show-overflow-tooltip>
			</el-table-column>
			<!-- <el-table-column label="检查日期" align="center" prop="PlanInspectionDateDesc"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="检查项" align="center" prop="ItemContentCount" show-overflow-tooltip></el-table-column>
			<el-table-column label="完成项" align="center" prop="CompleteCount" show-overflow-tooltip></el-table-column>
			<el-table-column label="隐患数" align="center" prop="PotentialCount" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<span @click="onDanger(row)" style="cursor: pointer;">{{row.PotentialCount}}</span>
				</template>
			</el-table-column> -->
			<el-table-column label="检查状态" align="center" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<whether :yes="row.IsComplete == 1" :text="row.IsComplete == 1 ? '已完成' : '未完成'" />
				</template>
			</el-table-column>
			<!-- <el-table-column label="操作" align="center" width="190">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="SafeCheckInfo(row)" v-if="$_has('AQJCBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column> -->
		</el-table>

		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 4">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="隐患来源" align="center" header-align="center" show-overflow-tooltip
				prop="PotentialSourceDesc">
			</el-table-column>
			<el-table-column label="隐患项目" prop="Project" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column label="隐患内容" prop="Content" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.Content" v-html="scope.row.Content"></span>
				</template>
			</el-table-column>
			<el-table-column label="排查备注" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.RecordSubmit">{{ scope.row.RecordSubmit.Remark }}</span>
				</template>
			</el-table-column>
			<el-table-column label="检查时间" align="center" prop="CreateTimeDesc" :formatter="dateFormatter" width="120">
			</el-table-column>

			<!-- <el-table-column label="隐患级别" align="center" header-align="center" prop="PotentialLevelName"
				show-overflow-tooltip>
				<template slot-scope="scope">
					<el-tag size="small" effect="dark" :type="
			                scope.row.PotentialLevelCode == '058002'
			                    ? ''
			                    : 'danger'
			            ">
						{{ scope.row.PotentialLevelName }}
					</el-tag>
				</template>
			</el-table-column> -->
			<el-table-column label="责任部门" prop="DepartmentName" align="center"> </el-table-column>
			<!-- <el-table-column label="上报人" prop="SubmitUserName" align="center" show-overflow-tooltip> -->
			</el-table-column>
			<el-table-column label="整改人" prop="ResponsibleName" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.RecordRectification && scope.row.RecordRectification.length > 0">{{
						scope.row.RecordRectification.map(item => item.OperationUserName).join('、') }}</span>
					<span v-else>{{ scope.row.ResponsibleName }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="复查人" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span
						v-if="scope.row.RecordReexamine && scope.row.RecordReexamine.length > 0">{{ scope.row.RecordReexamine.map(item => item.OperationUserName).join('、') }}</span>
				</template>
			</el-table-column> -->
			<el-table-column label="状态" align="center" header-align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-tag :type="scope.row | filterscolor" effect="dark" size="small">
						{{ scope.row.StatusDesc }}
					</el-tag>
				</template>
			</el-table-column>
			<!-- <el-table-column label="下发时间" align="center" prop="CreateTimeDesc" width="100" show-overflow-tooltip>
			</el-table-column> -->

			<!-- <el-table-column label="操作" align="center" header-align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="showViewDialog(scope.row.PotentialId, scope.row)"
						v-if="$_has('YHZLBtnLook') || $_has('RWXQYHBTNLOOK')">查看</el-button>
				</template>
			</el-table-column> -->
		</el-table>

		<!-- <el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 5">
			<el-table-column label="序号" type="index" align="center" width='60'></el-table-column>
			<el-table-column label="企业/部门" align="center" prop="EnterpriseName" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' + item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="RiskUnitName" align="center" show-overflow-tooltip label="风险单元"></el-table-column>
			<el-table-column prop="RiskPointName" align="center" show-overflow-tooltip label="风险点"></el-table-column>
			<el-table-column prop="RiskTypeName" align="center" label="风险类型" show-overflow-tooltip></el-table-column>
			<el-table-column prop="RiskLevelName" align="center" show-overflow-tooltip label="风险级别"></el-table-column>
			<el-table-column prop="RiskControlDegreeName" align="center" show-overflow-tooltip
				label="管控层级"></el-table-column>
			<el-table-column prop="InspectorName" align="center" show-overflow-tooltip label="巡查人"></el-table-column>
			<el-table-column prop="PlanInspectionTimeDesc" align="center" show-overflow-tooltip
				label="计划巡查日期"></el-table-column>
			<el-table-column label="巡查状态" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<whether :yes="scope.row.Status == 1" :text="scope.row.Status ? '已完成' : '未完成'" />
				</template>
			</el-table-column>
			<el-table-column label="巡查结果" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.InspectionStatus==1?'success':(scope.row.InspectionStatus==2?'danger':'info')"
						effect="dark" size="small">{{scope.row.InspectionStatusDesc}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="RiskLook(scope.row)"
							v-if="scope.row.Status != 0 && $_has('FXXCXCJLBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table> -->

		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 5">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="企业" align="center" prop="EnterpriseName" width="180">
			</el-table-column>
			<el-table-column label="部门" align="center" prop="DepartmentName" width="180">
			</el-table-column>
			<!-- <el-table-column label="车队" align="center" prop="VehicleGroupSetName">
			</el-table-column> -->
			<!-- <el-table-column label="岗位" align="center" prop="PositionName">
			</el-table-column> -->
			<el-table-column label="任务名称" align="center" prop="PlanName">
			</el-table-column>
			<el-table-column label="姓名" align="center" prop="LeaderName">
			</el-table-column>
			<!-- <el-table-column label="生成方式" align="center" prop="LeaderName">
				<template slot-scope="{row}">
					{{ row.CreateType == 1 ? '每日' : row.CreateType == 2 ? '工作日' : row.CreateType == 3 ? '加班日' : '' }}
				</template>
			</el-table-column>
			<el-table-column label="计划时间段" align="center">
				<template slot-scope="{row}">
					{{ row.StartTime + '-' + row.EndTime }}
				</template>
			</el-table-column> -->
			<el-table-column label="安全等级" align="center" prop="SecurityLevelDesc">
			</el-table-column>
			<el-table-column label="任务日期" align="center" prop="CreateTimeDesc" width="100" show-overflow-tooltip>
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
			<el-table-column label="创建时间" align="center" prop="CreateTimeDesc" width="100" show-overflow-tooltip>
			</el-table-column>
			<!-- <el-table-column label="操作" align="center" width="240">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="text" @click="show(row, true)" v-if="$_has('BQHRWBtnZKXQ')">召开详情</el-button>
						<el-button type="text" @click="add(row)" v-if="row.Status != 1 && $_has('BQHRWBtnEdit')">编辑</el-button>
						<el-button type="text" @click="onCancel(row)"
							v-if="$_has('BQHRWBtnZF') && row.Status == 0">中止</el-button>
						<el-button type="text" text-plain @click="remove(row)"
							v-if="$_has('BQHRWBtnDetele')">删除</el-button>
					</div>
				</template>
			</el-table-column> -->
		</el-table>


		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 6">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column prop="DepartmentName" show-overflow-tooltip align="center" label="企业/部门">
				<template slot-scope="scope">
					{{ scope.row.EnterpriseName + '-' + scope.row.DepartmentName }}
				</template>
			</el-table-column>
			<el-table-column label="事件类型" align="center" header-align="center" prop="AccidentTypeCodeDesc" width="150">
				<template slot-scope="{row}">
					<span>{{ getTypeText(row.AccidentTypeCode) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="事件名称" align="center" header-align="center" prop="EventReportName" width="150"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="事故时间" align="center" header-align="center" prop="EventReportTimeDesc" width="100">
			</el-table-column>
			<el-table-column label="事故地点" align="center" header-align="center" prop="Place" width="130"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="涉事人员" align="center" header-align="center" prop="ResponsibleUserName" width="130">
			</el-table-column>
			<el-table-column label="涉事车辆/仓库" align="center" header-align="center" width="130">
				<template slot-scope="{row}">
					<span v-if="row.AccidentTypeCode == '009419'">{{ row.LicensePlateNumber }}</span>
					<span v-if="row.AccidentTypeCode == '009420'">{{ row.WarehouseSetName }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="受伤人数(人)" align="center" header-align="center" prop="GetHurtCount" width="155"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="直接经济损失(元)" align="center" header-align="center" width="155" prop="LossAmount"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="理赔金额" align="center" header-align="center" prop="LossAmount" width="100"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="事故等级" align="center" header-align="center" prop="SubjectiveReason" width="100"
				show-overflow-tooltip>
			</el-table-column> -->
			<el-table-column label="结案状态" align="center" header-align="center" width="90">
				<template slot-scope="{row}">
					<whether :yes="row.Status == 1" :text="row.Status == 1 ? '已结案' : '未结案'" />
				</template>
			</el-table-column>
			<el-table-column label="上报人" align="center" header-align="center" prop="CreateByName" width="100">
			</el-table-column>
			<!-- <el-table-column label="巡检人" align="center" prop="CheckUserName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="巡检车辆" align="center" prop="VehicleNo" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="车辆负责人" align="center" prop="VehicleUserName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="计划开始时间" align="center" prop="CheckStartTimeDesc" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<span v-if="row.CheckStartTimeDesc">{{row.CheckStartTimeDesc | format('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="计划结束时间" align="center" prop="CheckEndTimeDesc" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<span v-if="row.CheckEndTimeDesc">{{row.CheckEndTimeDesc | format('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="巡检时间" show-overflow-tooltip align="center" prop="CheckLongTimeDesc">
			</el-table-column>
			<el-table-column label="巡检周期" align="center" show-overflow-tooltip>
				<template slot-scope="{row}">
					<span v-if="row.CycleCode">{{statusObjTask[row.CycleCode]}}</span>
				</template>
			</el-table-column>
			<el-table-column label="巡检状态" align="center" prop="Status" show-overflow-tooltip>
				<template slot-scope="{row}">
					<whether :yes="row.Status == 1" :text="row.Status == 1? '已巡检' : '未巡检'" />
				</template>
			</el-table-column> -->
			<!-- <el-table-column label="操作" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="CarViewDialog(scope.$index, scope.row)">查看</el-button>
					</div>
				</template>
			</el-table-column> -->
		</el-table>

		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 7">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="企业/部门" align="center" header-align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' +
							item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center" show-overflow-tooltip width="110">
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="点检人" align="center" prop="UserName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="设备类型" align="center" show-overflow-tooltip prop="EquipmentTypeName">
			</el-table-column>
			<el-table-column label="设备名称" align="center" show-overflow-tooltip show-overflow-tooltip
				prop="EquipmentName">
			</el-table-column>
			<el-table-column label="自编号" align="center" show-overflow-tooltip prop="OwnCode"
				:formatter="formatterDefaultValue">
			</el-table-column>
			<el-table-column label="位置" align="center" show-overflow-tooltip prop="UseLocation"
				:formatter="formatterDefaultValue">
			</el-table-column>
			<el-table-column label="负责人" align="center" show-overflow-tooltip prop="ResponsibleUserName"
				:formatter="formatterDefaultValue">
			</el-table-column>
			<el-table-column label="点检周期" align="center" show-overflow-tooltip show-overflow-tooltip prop="PeriodDesc">
			</el-table-column>
			<el-table-column label="点检日期" align="center" show-overflow-tooltip prop="RecordDateDesc"
				:formatter="formatterDefaultValue">
			</el-table-column>
			<el-table-column label="点检结果" align="center" show-overflow-tooltip prop="Result"
				:formatter="formatterResult">
			</el-table-column>
			<el-table-column label="点检状态" align="center" show-overflow-tooltip>
				<template slot-scope="{ row }">
					<whether :yes="row.Status == 1" :class="{ warning: row.Status == 3, gray: row.Status == 4 }"
						:text="statusObj[row.Status]" />
				</template>
			</el-table-column>
		</el-table>

		<el-table :data="list" highlight-current-row v-loading="loading" :header-cell-style="tableStayle"
			style="min-height: 600px" v-if="isTypeSearch == 8">
			<el-table-column label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="企业/部门" align="center" header-align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' +
							item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="保养人" align="center" prop="UserName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="设备类型" align="center" prop="EquipmentTypeName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="设备名称" align="center" show-overflow-tooltip prop="EquipmentName">
			</el-table-column>
			<el-table-column label="自编号" align="center" prop="OwnCode" :formatter="formatterDefaultValue"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="位置" align="center" prop="UseLocation" :formatter="formatterDefaultValue"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="负责人" align="center" prop="ResponsibleUserName" :formatter="formatterDefaultValue"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="保养计划名称" align="center" show-overflow-tooltip prop="PlanName">
			</el-table-column>
			<el-table-column label="保养计划日期" align="center" prop="PlanDateDesc" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="保养日期" align="center" prop="RecordDateDesc" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="保养结果" align="center" prop="Result" :formatter="formatterResult"
				show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="保养状态" align="center">
				<template slot-scope="{ row }">
					<whether :yes="row.Status == 1"
						:class="{ warning: row.SupplyStatus == 3, gray: row.SupplyStatus == 4 }"
						:text="statusObj[row.Status]" />
				</template>
			</el-table-column>
		</el-table>

		<el-row>
			<el-col :span="24">
				<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange"
					:page-size="pages.rows" :total="pages.total" :current-page.sync="pages.page"></el-pagination>
			</el-col>
		</el-row>
		<!-- 安全检查 -->
		<SafeCheckInfo ref="safeInfo" />
		<!-- 隐患整改 -->
		<DangerInfo ref="dangerShow" />
		<!-- 风险巡查 -->
		<el-dialog v-dialog-drag title="查看" :visible.sync="RiskShow" :close-on-click-modal="false"
			@close="RiskShow = false" top="8vh" width="30%" append-to-body>
			<el-form label-position="left" class="demo-table-expand">
				<el-form-item label="巡查照片：">
					<el-image v-for="item in RiskForm.AttachmentFiles" :key="item.url" :preview-src-list="[item.url]"
						:src='item.url' style='width:100px;height:100px;margin-right:10px;'></el-image>
				</el-form-item>
				<el-form-item label="巡查备注：">
					<span>{{ RiskForm.Situation || "无" }}</span>
				</el-form-item>
				<el-form-item label="巡查时间：">
					<span>{{ RiskForm.InspectionTimeDesc || "无" }}</span>
				</el-form-item>
				<el-form-item label="巡查签名：" v-if="RiskForm.SignInUrl != null">
					<el-image :preview-src-list="[RiskForm.SignInUrl]" :src='RiskForm.SignInUrl'
						style='width:auto;height:45px;'></el-image>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 车辆巡查 -->
		<el-dialog v-dialog-drag title="查看详情" :visible.sync="CarShow" :close-on-click-modal="false"
			@close="CarShow = false" append-to-body width="50%" top="8vh">
			<el-scrollbar class="scrollbar">
				<CarCheckInfo ref="CarInfo" />
			</el-scrollbar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="CarShow = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import SafeCheckInfo from '@/pages/inspectionRecords/info';
import DangerInfo from '@/pages/Potential/info';
import CarCheckInfo from '@/pages/VehicleInspection/checkInfo'
export default {
	mixins: [request_mixin],
	components: {
		SafeCheckInfo,
		DangerInfo,
		CarCheckInfo
	},
	data() {
		return {
			tableStayle: {
				background: 'rgba(13, 64, 105, 0.3)',
				height: '60px',
				color: '#fff',
				borderBottom: '1px solid #0f2a4b',
			},
			RiskShow: false,
			RiskForm: {},
			CarShow: false,
			list: [],
			loading: false,
			isTypeSearch: 1,
			pages: {
				total: 0,
				page: 1,
				rows: 10
			},
			statusObjTask: {
				'0003901': '周',
				'0003902': '月',
				'0003903': '季',
				'0003904': '年',
			},
			statusObj: {
				0: '未点检',
				1: '已点检',
				2: '逾期未完成',
				3: '逾期已完成',
			},
			AccidentTypeList: []
		}
	},
	props: ['isWarning', 'EnterpriseId'],
	watch: {
		isWarning: {
			deep: true,
			handler(val) {
				this.isTypeSearch = val
				this.handleCurrentChange(1)
			}
		},
	},
	mounted() {
		this.isTypeSearch = this.isWarning
		this.handleCurrentChange(1)
		// 事故类型
		this.Get("/GetAccidentTypeCom").then(res => {
			if (res.status == 2000) {
				this.AccidentTypeList = res.data
			}
		})
	},
	methods: {
		// 时间
		getCurrentDate() {
			var date = new Date();
			return this.timeFormat(date)
		},
		// 时间
		getCurrentMonthFirstDay() {
			var date = new Date();
			date.setDate(1);
			return this.timeFormat(date)
		},
		// 转换时间
		timeFormat(date) {
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
		dateFormatter(row, column, cellValue, index) {
			if (cellValue) {
				const date = new Date(cellValue);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			}
			return '';
		},
		// 设备保养
		formatterDefaultValue(row, column, cellValue, index) {
			return cellValue || '-'
		},
		// 设备保养
		formatterResult(row, column, cellValue, index) {
			let obj = ['未点检', '正常', '异常', '异常当场解决'];
			return obj[cellValue];
		},
		handleCurrentChange(val) {
			this.pages.page = val;
			this.getList();
		},
		// 安全检查
		SafeCheckInfo(row) {
			this.$refs.safeInfo.show(row)
		},
		// 隐患整改
		showViewDialog(PotentialId, row) {
			this.$refs.dangerShow.show(row)
		},
		//风险巡查
		RiskLook(row) {
			this.RiskForm = row
			this.RiskShow = true
		},
		// 车辆巡查
		CarViewDialog(index, row) {
			let than = this
			than.CarShow = true;
			this.$nextTick(() => {
				than.$refs.CarInfo.getMonthSafelyCheck(row.VehicleSafelyCheckId);
			})
		},
		// 事件管理
		getTypeText(id) {
			let filteredNames = this.AccidentTypeList.filter(item => item.id == id)
			if (filteredNames && filteredNames.length > 0) {
				return filteredNames[0].text
			}
		},

		getDetail(params) {
			let url = ["", '/GetTrainTaskTaskDetailDaPingTwo', '/GetTaskSafetyMeetings', '/GetInspectionRecordsDaPing',
				'/GetEnterprisePotentialRecordsDaPing', '/GetPreMeetingSigns', '/GetEventReports',
				'/GetTaskMaintenanceRecords', '/GetTaskSpotCheckRecords'
			]
			this.loading = true

			if (url[this.isTypeSearch] == '/GetPreMeetingSigns') {
				params.Type = 1
				params.StartTime = null
				params.EndTime = null
			}
			this.Post(url[this.isTypeSearch], params).then(res => {
				if (res.status == 2000) {
					this.list = res.data.list
					this.pages.total = res.data.count
				}
			})

			this.loading = false;
		},
		getList() {
			let params = {
				page: this.pages.page,
				rows: this.pages.rows,
				EnterpriseId: this.EnterpriseId
			}
			switch (this.isTypeSearch) {
				case 1:
					params.IsPreTrain = 0
					this.getDetail(params)
					break;
				case 2:
					params.IsFinished = 0
					this.getDetail(params)
					break;
				case 3:
					params.IsComplete = 0
					this.getDetail(params)
					break;
				case 4:
					params.IsComplete = 0
					params.StartSubmitDate = this.getCurrentMonthFirstDay()
					params.EndSubmitDate = this.getCurrentMonthFirstDay()
					this.getDetail(params)
					break;
				case 5:
					params.StartTime = this.getCurrentMonthFirstDay()
					params.EndTime = this.getCurrentMonthFirstDay()
					params.InspectionStatus = 0
					this.getDetail(params)
					break;
				case 6:
					params.Status = 0
					this.getDetail(params)
					break;
				case 7:
					params.Status = 0
					this.getDetail(params)
					break;
				case 8:
					params.Status = 0
					this.getDetail(params)
					break;
			}
		},
	}
}
</script>

<style lang="less" scoped>
@import '../assets/table.less';

/deep/ .el-pagination {
	padding: 5px 5px !important;
	text-align: right;
	margin: 10px 0;
}

/deep/ .el-pagination__total {
	color: #fff;
}

/deep/ .el-table .cell.el-tooltip {
	display: block ruby !important;
}
</style>