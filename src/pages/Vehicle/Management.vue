<template>
	<div>
		<tabs-page-layout :tabs="tabs" overflowInitial v-if="tabs && tabs.length > 0"></tabs-page-layout>
		<div v-else class="no-data-box">
			<no-data text="您的账号没有权限,请联系管理员添加."></no-data>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {

			};
		},
		computed: {
			tabs() {
				let list = [{
						title: "车辆列表",
						type: 'CARLISTTab',
						url: () => import("@/pages/Vehicle/Vehicle"),
					},
					{
						title: "车辆违章记录",
						type: 'CARRecordTab',
						url: () => import("@/pages/Violations/violationList"),
					},
					// {
					// 	title: "每日行车日志",
					// 	type: 'CARLogDayTab',
					// 	url: () => import("@/pages/Logbook/logbook"),
					// },
					{
						title: "行车日志记录",
						type: 'CARLogDayRecordTab',
						url: () => import("@/pages/Logbook/record"),
					},
						{
						title: "行车日志报表",
						type: 'CARLogDayRecordTab',
						url: () => import("@/pages/Logbook/recordMeassage"),
					},
					{
						title: "车辆定位",
						type: 'CARPositionTab',
						url: () => import("@/pages/VehicleLocation/VehicleLocation"),
					},
					{
						title: "车辆报警",
						type: 'CARWarnTab',
						url: () => import("@/pages/VehicleWarn/index"),
					},
					{
						title: "车辆视频",
						type: 'CARVideoTab',
						url: () => import("@/pages/Vehicle/VehicleVideo"),
					},
				];
				return list.filter(item => this.$_has(item.type)) || []
			}
		}
	};
</script>
<style scoped>
	.no-data-box {
		box-sizing: border-box;
		padding-top: 200px;
	}
</style>