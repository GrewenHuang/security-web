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
						title: "证件",
						type: 'ZZMBSZZJTab',
						url: () => import("@/pages/standardParameterSettings/cert/index"),
					},
					{
						title: "保险",
						type: 'ZZMBSZBXTab',
						url: () => import("@/pages/standardParameterSettings/infoTemplateSetting/insure"),
					},
					{
						title: "其它",
						type: 'ZZMBSZQTTab',
						url: () => import("@/pages/standardParameterSettings/infoTemplateSetting/other"),
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