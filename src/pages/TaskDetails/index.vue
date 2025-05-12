<template>
	<tabs-page-layout-card :tabs="tabs" overflowInitial v-if="tabs && tabs.length > 0"
		:active="active"></tabs-page-layout-card>
	<div v-else class="no-data-box">
		<!-- <no-data text="您的账号没有权限,请联系管理员添加."></no-data> -->
		<no-data text="页面开发中..."></no-data>
	</div>
</template>
<script>
	import tabsPageLayoutCard from '@/components/tabs-page-layout-card'
	export default {
		components: {
			tabsPageLayoutCard
		},
		data() {
			return {
				active: ''
			};
		},
		created() {
			if (this.$route.params.active) {
				this.active = this.$route.params.active
			}
		},
		computed: {
			tabs() {
				let list = [
					// {
					// 	title: "岗前培训",
					// 	type: 'GQPXTab',
					// 	url: () => import("@/pages/TaskDetails/training"),
					// },
					{
						title: "教育培训",
						type: 'ZJYPXTab',
						url: () => import("@/pages/TaskDetails/retrain"),
					},
					{
						title: "班前会",
						type: 'BQHTab',
						url: () => import("@/pages/TaskDetails/meeting"),
					},
					{
						title: "安全例会",
						type: 'AQLHXTab',
						url: () => import("@/pages/TaskDetails/safetyMeeting"),
					},
					{
						title: "安全检查",
						type: 'AQJCTab',
						url: () => import("@/pages/TaskDetails/securityCheck"),
					},
					{
						title: "隐患整改",
						type: 'YHZGTab',
						// url: () => import("@/pages/TaskDetails/danger"),
						url: () => import("@/pages/Potential/index")
					},
					{
						title: "风险巡查",
						type: 'FXXCTab',
						url: () => import("@/pages/TaskDetails/risk"),
					},
					{
						title: "车辆巡查",
						type: 'CLXCTab',
						url: () => import("@/pages/TaskDetails/car"),
					},
					{
						title: "设备保养",
						type: 'SBBYTab',
						url: () => import("@/pages/TaskDetails/equipmentMaintenance"),
					},
					{
						title: "设备点检",
						type: 'SBDJTab',
						url: () => import("@/pages/TaskDetails/equipmentInspection"),
					},
					{
						title: "在线签字",
						type: 'ZXQZTab',
						url: () => import("@/pages/TaskDetails/sign"),
					},
					// {
					// 	title: "每日一学",
					// 	type: 'MRYXTab',
					// 	url: () => import("@/pages/TaskDetails/study"),
					// },
					{
						title: "消息通知",
						type: 'XXTZTab',
						url: () => import("@/pages/TaskDetails/message"),
					},
				]
				return list.filter(item => this.$_has(item.type)) || []
				// return list.filter(item => item.type) || []
			},
		}
	};
</script>
<style scoped>
	.no-data-box {
		box-sizing: border-box;
		padding-top: 200px;
	}
</style>