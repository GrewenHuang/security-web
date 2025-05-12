<template>
	<tabs-page-layout :tabs="tabs" overflowInitial v-if="tabs && tabs.length > 0"></tabs-page-layout>
	<div v-else class="no-data-box">
		<no-data text="您的账号没有权限,请联系管理员添加."></no-data>
	</div>

</template>
<script>
	export default {
		data() {
			return {};
		},
		computed: {
			tabs() {
				let list = [
					{
					    title: "隐患统计",
						type: 'YHTJTab',
					    url: () => import("./chart"),
					},
					{
					    title: "隐患报表",
						type: 'YHBBTab',
					    url: () => import("./list"),
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