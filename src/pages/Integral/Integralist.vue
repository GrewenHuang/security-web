<template>
	<tabs-page-layout :tabs="tabs" overflowInitial v-if="tabs && tabs.length > 0"></tabs-page-layout>
	<div v-else class="no-data-box">
		<no-data text="您的账号没有权限,请联系管理员添加."></no-data>
	</div>
</template>
<script>
	export default {
		data() {
			return {}
		},
		computed: {
			tabs() {
				let list = [{
						title: "内部考核",
						type: 'KHGLNB',
						url: () => import("@/pages/Integral/table_1"),
					},
					{
						title: "客户考核",
						type: 'KHGLKH',
						url: () => import("@/pages/Integral/examine"),
					},
          {
						title: "承运商商考核",
						type: 'KHGLKH',
						url: () => import("@/pages/Integral/carrier"),
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
