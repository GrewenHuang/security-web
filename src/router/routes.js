const Home = () => import("@/pages/Home")

let routes = [
    {
        path: '/login',
        name: '集团登录',
        component: resolve => require(['@/pages/login/Login'], resolve)
    },
    {
        path: '/bus-login',
        name: '公交登录',
        component: resolve => require(['@/pages/login/BusLogin'], resolve)
    },
    {
        path: '/rb-login',
        name: '路桥登录',
        component: resolve => require(['@/pages/login/RaodAndBridegLogin'], resolve)
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import("@/pages/error-page/404"),
    },
    {
        path: '/401',
        name: 'notPermission',
        component: () => import("@/pages/error-page/401"),
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        redirect: '/dashboard',
        leaf: true, // 只有一个节点
        menuShow: true,
        iconCls: 'el-icon-s-home', // 图标样式class
        children: [
            { path: '/dashboard', component: () => import("@/pages/Dashboard/indexinfo"), name: '首页', menuShow: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '隐患管理',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/PotentialRectificationPre', component: () => import("@/pages/Potential/potential-reform/list"), name: ' 隐患整改', menuShow: true },
            { path: '/PotentialReexaminePre', component: () => import("@/pages/potential/potential-review/list"), name: '隐患复查', menuShow: true },
            { path: '/potential-record', component: () => import("@/pages/Potential/potential-record/list"), name: '隐患记录', menuShow: true },
            { path: '/PotentialExaminationPre', component: () => import("@/pages/Potential/potential-exam/list"), name: '隐患审核', menuShow: true },
            { path: '/PotentialApplyCancelPre', component: () => import("@/pages/Potential/potential-cancel/list"), name: '隐患销号', menuShow: true },
            { path: '/PotentialFilePre', component: () => import("@/pages/Potential/potential-file/list"), name: '隐患归档', menuShow: true },
            { path: '/potential/government', component: () => import("@/pages/Potential/government"), name: '隐患治理', menuShow: true },
			{ path: '/potential/index', component: () => import("@/pages/Potential/index"), name: '隐患管理路由', menuShow: true },
            { path: '/RiskControl', component: () => import("@/pages/RiskManagement/RiskControl"), name: '风险分级管控', menuShow: true },
            { path: '/Inspection', component: () => import("@/pages/RiskManagement/Inspection"), name: '风险单元巡查', menuShow: true },
			{ path: '/RiskIndex', component: () => import("@/pages/RiskManagement/index"), name: '风险管理', menuShow: true }
        ]
    },
	{
	    path: '/',
	    component: Home,
	    name: '积分管理',
	    menuShow: true,
	    leaf: true,
	    children: [
	        { path: '/Integralset', component: () => import("@/pages/Integral/Integralset"), name: '积分设置', menuShow: true },
	        { path: '/Integralist', component: () => import("@/pages/Integral/Integralist"), name: '积分列表', menuShow: true },
			{ path: '/examine', component: () => import("@/pages/Integral/examine"), name: '客户考核', menuShow: true },
	    ]
	},
    {
        path: '/',
        component: Home,
        name: '车辆',
        menuShow: true,
        leaf: true,
        children: [
			{ path: '/Vehicle/Management', component: () => import("@/pages/Vehicle/Management"), name: '车辆管理', menuShow: true },
            { path: '/Vehicle/Vehicle', component: () => import("@/pages/Vehicle/Vehicle"), name: '车辆列表', menuShow: true },
            { path: '/vehicle-type', component: () => import('@/pages/Vehicle/vehicleType'), name: '车辆类型管理', menuShow: true },
            { path: '/vehicleRoute', component: () => import("@/pages/Vehicle/vehicleRouteManage"), name: '线路管理', menuShow: true },
            { path: '/Logbook', component: () => import("@/pages/Logbook/list"), name: '行车日志', menuShow: true },
			{ path: '/Vehicle/inspection', component: () => import("@/pages/VehicleInspection/index"), name: '车辆巡检任务', menuShow: true },
            { path: '/MonthSafelyCheck/safeCheck', component: () => import("@/pages/MonthSafelyCheck/safeCheck"), name: '车辆巡检记录', menuShow: true },
			{ path: '/VehicleLocation',component: () => import("@/pages/VehicleLocation/VehicleLocation"), name: '车辆定位信息', menuShow: true },
			{ path: '/VehicleWarn', component: () => import("@/pages/VehicleWarn/index"), name: '车辆报警信息', menuShow: true },
			{ path: '/violationList', component: () => import("@/pages/Violations/violationList"), name: '车辆违章记录', menuShow: true },
			{ path: '/VehicleVideo', component: () => import("@/pages/Vehicle/VehicleVideo"), name: '车辆视频', menuShow: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '应急管理',
        menuShow: true,
        leaf: true,
        children: [
			{ path: '/emergency', component: () => import("@/pages/Emergency/emergency"), name: '应急管理路由', menuShow: true },
            { path: '/reservePlan', component: () => import("@/pages/Emergency/reservePlan"), name: '应急预案', menuShow: true },
            { path: '/troops', component: () => import("@/pages/Emergency/troops"), name: '应急队伍', menuShow: true },
            { path: '/material', component: () => import("@/pages/Emergency/material"), name: '应急物资', menuShow: true },
            { path: '/drill', component: () => import("@/pages/Emergency/drill"), name: '应急演练', menuShow: true },
            { path: '/emergencyEquipment', component: () => import('@/pages/emergencyEquipment'), name: '应急设备', menuShow: true },
            { path: '/specialist', component: () => import("@/pages/Emergency/specialist"), name: '应急专家', menuShow: true },
            { path: '/exercise-plan', component: () => import("@/pages/Emergency/exercise-plan"), name: '应急演练计划', menuShow: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '企业管理',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/EnterpriseInfo', component: () => import("@/pages/Enterprises/EnterpriseInfo"), name: '企业信息', menuShow: true },
            { path: '/qualifications', component: () => import("@/pages/qualifications"), name: '营业资质', menuShow: true },
			{ path: '/staffing', component: () => import("@/pages/staffing/index"), name: '人员管理', menuShow: true },
            { path: '/User', component: () => import("@/pages/Enterprises/User"), name: '用户管理', menuShow: true },
            { path: '/userExamine', component: () => import("@/pages/Enterprises/userExamine"), name: '用户审核管理', menuShow: true },
			{ path: '/departmentExamine', component: () => import("@/pages/Enterprises/departmentExamine"), name: '部门审核管理', menuShow: true },
            { path: '/car/organList', component: () => import("@/pages/Enterprises/organList"), name: '车队设置', menuShow: true },
            { path: '/postList', component: () => import("@/pages/Enterprises/postList"), name: '岗位管理', menuShow: true },
            { path: '/Mail', component: () => import("@/pages/System/Mail"), name: '待办事项', menuShow: true },
            { path: '/constituentCompany', component: () => import('@/pages/constituentCompany'), name: '分子公司', menuShow: true },

            // 会议
			{ path: '/teamleadersettings', component: () => import("@/pages/teamleadersettings"), name: '班前会班组长设置', menuShow: true },
            { path: '/MeetTable', component: () => import("@/pages/Meeting/MeetTable"), name: '安全例会', menuShow: true },
            { path: '/preShiftMeeting/index', component: () => import("@/pages/preShiftMeeting/index"), name: '班前会', menuShow: true },
			{ path: '/preShiftMeeting/task', component: () => import("@/pages/preShiftMeeting/task"), name: '班前会任务', menuShow: true },
            // 安全
            { path: '/safetyProductionCost', component: () => import('@/pages/safetyProductionCost'), name: '安全生产费用', menuShow: true },
            { path: '/safetyObjectives', component: () => import('@/pages/safetyObjectives/index'), name: '安全目标' },

            { path: '/taskDistribution', component: () => import('@/pages/taskDistribution'), name: '任务下发', menuShow: true },
            { path: '/superTask', component: () => import('@/pages/superTask'), name: '上级任务', menuShow: true },
			{ path: '/TaskDetails/index', component: () => import('@/pages/TaskDetails/index'), name: '任务详情', menuShow: true },
			{ path: '/TaskDetails/training', component: () => import('@/pages/TaskDetails/training'), name: '任务详情岗前培训', menuShow: true },
			{ path: '/TaskDetails/retrain', component: () => import('@/pages/TaskDetails/retrain'), name: '任务详情再教育培训', menuShow: true },
			{ path: '/TaskDetails/meeting', component: () => import('@/pages/TaskDetails/meeting'), name: '任务详情班前会', menuShow: true },
			{ path: '/TaskDetails/safetyMeeting', component: () => import('@/pages//TaskDetails/safetyMeeting'), name: '任务详情安全例会', menuShow: true },
			{ path: '/TaskDetails/danger', component: () => import('@/pages/TaskDetails/danger'), name: '任务详情隐患整改', menuShow: true },
			{ path: '/TaskDetails/car', component: () => import('@/pages/TaskDetails/car'), name: '任务详情车辆巡查', menuShow: true },
			{ path: '/TaskDetails/equipmentMaintenance', component: () => import('@/pages/TaskDetails/equipmentMaintenance'), name: '任务详情设备保养', menuShow: true },
			{ path: '/TaskDetails/equipmentInspection', component: () => import('@/pages/TaskDetails/equipmentInspection'), name: '任务详情设备点检', menuShow: true },
			{ path: '/TaskDetails/sign', component: () => import('@/pages/TaskDetails/sign'), name: '任务详情在线签字', menuShow: true },
			{ path: '/TaskDetails/study', component: () => import('@/pages/TaskDetails/study'), name: '任务详情每日一学', menuShow: true },
			{ path: '/TaskDetails/message', component: () => import('@/pages/TaskDetails/message'), name: '任务详情消息通知', menuShow: true },
			{ path: '/TaskDetails/securityCheck', component: () => import('@/pages/TaskDetails/securityCheck'), name: '任务详情安全检查', menuShow: true },
			{ path: '/TaskDetails/risk', component: () => import('@/pages/TaskDetails/risk'), name: '任务详情风险巡查', menuShow: true },

        ]
    },

    {
        path: '/',
        component: Home,
        name: '教育培训',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/Questions', component: () => import("@/pages/Education/Questions"), name: '试题管理', menuShow: true },
            { path: '/Paper', component: () => import("@/pages/Education/Paper"), name: '试卷管理', menuShow: true },
            { path: '/Courseware', component: () => import("@/pages/Education/Courseware"), name: '课件管理', menuShow: true },
            { path: '/Course', component: () => import("@/pages/Education/Course"), name: '课程管理', menuShow: true },
            { path: '/Train', component: () => import("@/pages/Education/Train"), name: '培训计划', menuShow: true },
            { path: '/Traintask', component: () => import("@/pages/Education/Traintask"), name: '再教育培训', menuShow: true },
			{ path: '/PreTrain', component: () => import("@/pages/Education/PreTrain"), name: '岗前培训', menuShow: true },
            { path: '/learn-day', component: () => import('@/pages/learn-day/index'), name: '每日一学', menuShow: true },
            { path: '/learn-data', component: () => import('@/pages/learn-data/index'), name: '教育培训学习资料', menuShow: true },
            { path: '/competition-questions', component: () => import('@/pages/competition/questions'), name: '知识竞赛题私库', menuShow: true },
            { path: '/competition', component: () => import('@/pages/competition'), name: '知识竞赛', menuShow: true },
        ]
    },
    // 404 page must be placed at the end !!!
    {
        path: "*",
        redirect: "/404"
    },
    {
        path: '/data-board',
        redirect: '/transit-board',
        name: '集团数据看板',
        component: () => import('@/pages/data-board/index'),
        children: [
            {
                path: '/transit-board',
                component: () => import('@/pages/data-board/transit'),
                name: '公交数据看板'
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '相关方',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/interested-roster', component: () => import('@/pages/interested-party/roster/index'), name: '相关方名单', menuShow: true },
            { path: '/interested-notic', component: () => import('@/pages/interested-party/safety-notic/index'), name: '相关方告知', menuShow: true },
            { path: '/interested-type', component: () => import('@/pages/interested-party/type/index'), name: '相关方类型', menuShow: true },
            { path: '/relatedPartyAccidents', component: () => import('@/pages/relatedPartyAccidents'), name: '相关方事故', menuShow: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '工程管理',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/dangerous-engineering', component: () => import('@/pages/dangerousEngineering/index'), name: '危大工程', menuShow: true },
            { path: '/special-construction', component: () => import('@/pages/specialConstruction'), name: '专项施工方案', menuShow: true },
            { path: '/special-construction-data', component: () => import('@/pages/specialConstruction/database'), name: '专项施工方案私库', menuShow: true },
            { path: '/technicalDisclosure', component: () => import('@/pages/technicalDisclosure'), name: '技术交底', menuShow: true },
            { path: '/job-setting', component: () => import('@/pages/jobManage/setting'), name: '作业模块设置', menuShow: true },
            { path: '/job-record', component: () => import('@/pages/jobManage/record'), name: '作业票', menuShow: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据库',
        menuShow: true,
        leaf: true,
        children: [
			{ path: '/data-base-train', component: () => import('@/pages/trainingLibrary/index'), name: '培训库', menuShow: true },
            { path: '/data-base-risk', component: () => import('@/pages/dataBase/risk'), name: '风险库', menuShow: true },
            { path: '/data-base-courseware', component: () => import('@/pages/dataBase/courseware'), name: '课件库', menuShow: true },
            { path: '/data-base-course', component: () => import('@/pages/dataBase/course'), name: '课程库', menuShow: true },
            { path: '/data-base-questions', component: () => import('@/pages/dataBase/questions'), name: '试题库', menuShow: true },
            { path: '/data-base-paper', component: () => import('@/pages/dataBase/paper'), name: '试卷库', menuShow: true },
            { path: '/data-base-learn', component: () => import('@/pages/dataBase/learnMeans'), name: '学习资料', menuShow: true },
            { path: '/data-special-construction', component: () => import('@/pages/dataBase/specialConstruction'), name: '专项施工方案库', menuShow: true },
            { path: '/data-technical-disclosure', component: () => import('@/pages/dataBase/technicalDisclosure'), name: '技术交底数据库', menuShow: true },
            { path: '/data-competition-questions', component: () => import('@/pages/dataBase/competitionQuestions'), name: '知识竞赛题库', menuShow: true },
            { path: '/data-equipment-facilities', component: () => import('@/pages/dataBase/equipmentFacilities'), name: '设备库', menuShow: true },
            { path: '/data-risk-identification', component: () => import('@/pages/dataBase/riskIdentification'), name: '风险辨识库', menuShow: true },
            { path: '/data-labels', component: () => import('@/pages/dataBase/labels'), name: '标签库', menuShow: true },
            { path: '/data-pitfalls', component: () => import('@/pages/dataBase/pitfalls'), name: '隐患库', menuShow: true },
            { path: '/data-inspections', component: () => import('@/pages/dataBase/inspections'), name: '检查表库', menuShow: true },
            { path: '/technicalDisclosureDatabase', component: () => import('@/pages/technicalDisclosure/database'), name: '数据库技术交底数据库', menuShow: true },
            { path: '/vehicleRoute', component: () => import("@/pages/Vehicle/vehicleRouteManage"), name: '线路库', menuShow: true },
            { path: '/AddDrivingLine', component: () => import("@/pages/Vehicle/DrivingLine/AddDrivingLine"), name: '添加路线', menuShow: true },
            { path: '/slogan', component: () => import("@/pages/slogan"), name: '口号库', menuShow: true },
        ]
    },

    {
        path: '/',
        component: Home,
        name: '设备设施',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/equipment-manage', component: () => import('@/pages/equipmentManage'), name: '设备管理', menuShow: true },
            { path: '/equipment-record', component: () => import('@/pages/equipmentManage/record'), name: '设备记录', menuShow: true },
            { path: '/SpecialEquipment', component: () => import("@/pages/Enterprises/SpecialEquipment"), name: '特种设备', menuShow: true },
        ]
    },
	{
	    path: '/',
	    component: Home,
	    name: '约谈管理',
	    menuShow: true,
	    leaf: true,
	    children: [
	        { path: '/appointmentmanagement', component: () => import('@/pages/appointmentmanagement'), name: '约谈管理路由', menuShow: true },
			{ path: '/job-index', component: () => import('@/pages/job/index'), name: '作业标准', menuShow: true },
			{ path: '/job-labor', component: () => import('@/pages/job/labor'), name: '劳保用品', menuShow: true },
	    ]
	},
	{
	    path: '/',
	    component: Home,
	    name: '日志管理',
	    menuShow: true,
	    leaf: true,
	    children: [
	        { path: '/login/log', component: () => import('@/pages/log/loginLog'), name: '登录日志', menuShow: true },
			{ path: '/delete/log', component: () => import('@/pages/log/deleteLog'), name: '删除日志', menuShow: true },
			{ path: '/task/log', component: () => import('@/pages/log/taskLog'), name: '任务日志', menuShow: true },
	    ]
	},
    {
        path: '/',
        component: Home,
        name: '基础参数设置',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/standar-param/carlog', component: () => import('@/pages/standardParameterSettings/carlog/index'), name: '行车日志基础参数设置', menuShow: true },
            { path: '/standar-param/car-patrol', component: () => import('@/pages/standardParameterSettings/car-patrol'), name: '车辆巡查基础参数设置', menuShow: true },
            { path: '/standar-param/document', component: () => import('@/pages/standardParameterSettings/document'), name: '体系文件模板基础参数设置', menuShow: true },
            { path: '/standar-param/integral', component: () => import('@/pages/standardParameterSettings/integral'), name: '积分规则设置', menuShow: true },
            // { path: '/standar-param/cert', component: () => import('@/pages/standardParameterSettings/cert'), name: '证件基础参数设置', menuShow: true },
            { path: '/standar-param/info-template', component: () => import('@/pages/standardParameterSettings/infoTemplateSetting'), name: '信息模板设置', menuShow: true },
            { path: '/Sms', component: () => import("@/pages/Sms/sms"), name: '推送消息设置', menuShow: true },
			{ path: '/weekdaysettings', component: () => import("@/pages/weekdaysettings/index"), name: '工作日设置', menuShow: true },
			{ path: '/weekdaysettings/user/settings', component: () => import("@/pages/weekdaysettings/UserSettings"), name: '用户分组设置', menuShow: true },
			{ path: '/weekdaysettings/user/warehouse', component: () => import("@/pages/weekdaysettings/warehouse"), name: '仓库设置', menuShow: true },
			{ path: '/trainingSettings', component: () => import("@/pages/trainingSettings/index"), name: '培训设置', menuShow: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '证件管理',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/cert/enterprise', component: () => import('@/pages/certManage/enterprise'), name: '企业证件', menuShow: true },
            { path: '/cert/personnel', component: () => import('@/pages/certManage/personnel'), name: '人员证件', menuShow: true },
            { path: '/cert/vehicle', component: () => import('@/pages/certManage/vehicle'), name: '车辆证件', menuShow: true },
            { path: '/cert/equipment', component: () => import('@/pages/certManage/equipment'), name: '设备证件', menuShow: true },
            { path: '/cert/expiration-reminder', component: () => import('@/pages/certManage/expiration-reminder'), name: '证件到期提醒', menuShow: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '其他模块',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/Assess', component: () => import("@/pages/Assess/list"), name: '心理评测', menuShow: true },
            { path: '/FileSign', component: () => import("@/pages/FileSign/list"), name: '文件签字管理', menuShow: true },
            { path: '/Document', component: () => import("@/pages/Documents/Document"), name: '体系文件', menuShow: true },
            { path: '/healthRecords', component: () => import('@/pages/healthRecords'), name: '健康档案', menuShow: true },
            { path: '/occupationalDiseaseHazards', component: () => import('@/pages/occupationalDiseaseHazards'), name: '职业病危害', menuShow: true },
            // { path: '/protectiveEquipment', component: () => import('@/pages/protectiveEquipment'), name: '防护用品发放记录', menuShow: true },//原来的
			{ path: '/protectiveEquipment', component: () => import('@/pages/protectiveEquipment'), name: '防护用品', menuShow: true },
            { path: '/protectiveEquipmentInventory', component: () => import('@/pages/protectiveEquipmentInventory'), name: '防护用品库存', menuShow: true },
            { path: '/workInjuryInsurance', component: () => import('@/pages/workInjuryInsurance'), name: '工伤保险参保台账', menuShow: true },
            { path: '/productionAccident', component: () => import('@/pages/productionAccident'), name: '生产事件', menuShow: true },
            { path: '/underDevelopment-page', component: () => import('@/pages/underDevelopment'), name: '页面开发中', menuShow: true },
            { path: '/designDraft-page', component: () => import('@/pages/designDraft'), name: '设计稿', menuShow: true },
			{ path: '/notify', component: () => import('@/pages/notifyMsg/index'), name: '消息通知', menuShow: true }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '报表',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/reports/personal', component: () => import('@/pages/reports/personal'), name: '人员统计', menuShow: true },
            { path: '/reports/sub-personal', component: () => import('@/pages/reports/sub-personal'), name: '查看子级人员报表', menuShow: true },
            { path: '/reports/vehicle', component: () => import('@/pages/reports/vehicle'), name: '车辆统计', menuShow: true },
            { path: '/reports/sub-vehicle', component: () => import('@/pages/reports/sub-vehicle'), name: '查看子级车辆报表', menuShow: true },
            { path: '/reports/meeting', component: () => import('@/pages/reports/meeting'), name: '例会报表', menuShow: true },
            { path: '/reports/sub-meeting', component: () => import('@/pages/reports/sub-meeting'), name: '查看子级例会报表', menuShow: true },
            { path: '/reports/risk', component: () => import('@/pages/reports/risk'), name: '风险报表', menuShow: true },
            { path: '/reports/sub-risk', component: () => import('@/pages/reports/sub-risk'), name: '查看子级风险报表', menuShow: true },
            { path: '/reports/pitfall', component: () => import('@/pages/reports/pitfall'), name: '隐患报表', menuShow: true },
            { path: '/reports/sub-pitfall', component: () => import('@/pages/reports/sub-pitfall'), name: '查看子级隐患报表', menuShow: true },
            { path: '/reports/train', component: () => import('@/pages/reports/train'), name: '培训统计', menuShow: true },
            { path: '/reports/sub-train', component: () => import('@/pages/reports/sub-train'), name: '查看子级培训报表', menuShow: true },
            { path: '/reports/information', component: () => import('@/pages/reports/information'), name: '信息报表', menuShow: true },
            { path: '/reports/sub-information', component: () => import('@/pages/reports/sub-information'), name: '查看子级信息报表', menuShow: true },
            { path: '/reports/message', component: () => import('@/pages/reports/message'), name: '证件信息报表', menuShow: true },
            { path: '/reports/sub-message', component: () => import('@/pages/reports/sub-message'), name: '查看子级路桥信息报表', menuShow: true },
            { path: '/reports/equipment', component: () => import('@/pages/reports/equipment'), name: '设备设施报表', menuShow: true },
            { path: '/reports/sub-equipment', component: () => import('@/pages/reports/sub-equipment'), name: '查看子级设备报表', menuShow: true },
            { path: '/reports/investment', component: () => import('@/pages/reports/investment'), name: '安全投入报表', menuShow: true },
            { path: '/reports/sub-investment', component: () => import('@/pages/reports/sub-investment'), name: '查看子级安全投入报表', menuShow: true },
            { path: '/reports/job', component: () => import('@/pages/reports/job'), name: '作业报表', menuShow: true },
            { path: '/reports/sub-job', component: () => import('@/pages/reports/sub-job'), name: '查看子级作业报表', menuShow: true },
            { path: '/reports/event', component: () => import('@/pages/reports/event'), name: '事件统计', menuShow: true },
            { path: '/reports/sub-event', component: () => import('@/pages/reports/sub-event'), name: '查看子级事件报表', menuShow: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '检查计划',
        menuShow: true,
        leaf: true,
        children: [
            { path: '/inspection-plans', component: () => import('@/pages/inspectionPlans'), name: '检查计划）', menuShow: true },
            { path: '/sub-inspection-plans', component: () => import('@/pages/inspectionPlans/sub-index'), name: '检查计划（集团）', menuShow: true },
            { path: '/inspection-records', component: () => import('@/pages/inspectionRecords'), name: '检查记录', menuShow: true },
            { path: '/sub-inspection-records', component: () => import('@/pages/inspectionRecords/sub-index'), name: '检查记录（集团）', menuShow: true },
            { path: '/data-inspections-private', component: () => import('@/pages/inspectionPlans/data-base'), name: '检查表库（私库）', menuShow: true },
        ]
    },
]
export default routes;
