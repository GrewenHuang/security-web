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
				this.active = this.tabs[this.$route.params.active || 0].title
			}
		},
		computed: {
			tabs() {
				let list = [{
						title: "风险管理",
						type: 'FXXCFXGLTab',
						url: () => import("@/pages/RiskManagement/RiskControl"),
					},
					{
						title: "巡查记录",
						type: 'FXXCXCJLTab',
						url: () => import("@/pages/RiskManagement/Inspection"),
					}
				]
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