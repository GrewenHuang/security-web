<template>
	<tabs-page-layout-card :tabs="tabs" :active="active"></tabs-page-layout-card>
</template>
<script>
	import tabsPageLayoutCard from '@/components/tabs-page-layout-card'
	export default {
		components: {
			tabsPageLayoutCard
		},
		props: {
			isActive: {
				type: Number,
				default: ""
			}
		},
		data() {
			return {
				tabs: [{
						title: "证件",
						url: () => import("@/pages/certManage/vehicle/cert"),
					},
					{
						title: "保险",
						url: () => import("@/pages/certManage/vehicle/insure"),
					},
					{
						title: "其它",
						url: () => import("@/pages/certManage/vehicle/other"),
					},
				],
			};
		},
		computed: {
			active() {
				return this.tabs[this.isActive || 0].title;
			}
		},
	};
</script>
<style scoped>
</style>