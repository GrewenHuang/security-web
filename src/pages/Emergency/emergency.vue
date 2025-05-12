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
						title: "应急预案",
						type: 'YJYATab',
						url: () => import("@/pages/Emergency/reservePlan"),
					},
					{
						title: "应急物资",
						type: 'YJWZTab',
						url: () => import("@/pages/Emergency/material"),
					},
					{
						title: "应急队伍",
						type: 'YJDWTab',
						url: () => import("@/pages/Emergency/troops"),
					},
					{
						title: "应急专家",
						type: 'YJZJTab',
						url: () => import("@/pages/Emergency/specialist"),
					},
					{
						title: "应急演练",
						type: 'YJYLTab',
						url: () => import("@/pages/Emergency/drill"),
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