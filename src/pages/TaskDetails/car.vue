<template>
		<car :isCar="true" :cycleList="cycleList"></car>
</template>

<script>
	import car from '@/pages/VehicleInspection/checkList'
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		components: {
			car
		},
		mixins: [request_mixin],
		data(){
			return {
				cycleList: [],
			}
		},
		methods: {
			
		},
		mounted() {
			this.Get("/GetVehicleChcekCycleCom", {}).then((res) => {
				//检查频次
				if (res.status == 2000) {
					this.cycleList = res.data
				}
			});
		}
	}
</script>

<style>
</style>