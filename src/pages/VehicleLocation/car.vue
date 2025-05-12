<template>
	<el-amap class="amap-box" :vid="'amap-vue'" :center="center" :zoom="zoom" :events="events" pitch-enable="false"
		:amap-manager="amapManager" ref="elAmap">
		<el-amap-marker v-for="(marker, index) in markers" :position="marker.lnglat" :events="marker.events"
			:content="marker.markerImg" :vid="marker" :key="index" :label="marker.label"></el-amap-marker>
		<el-amap-info-window v-if="currentWindow.visible" :position="currentWindow.position"
			:visible="currentWindow.visible" :content="currentWindow.content" :offset="currentWindow.offset"
			:close-when-click-map="true" :is-custom="true">
			<div style="z-map-box">
				<div class="box-window amap-info-content">
					<!-- <div>{{currentWindow.pnm}}{{currentWindow.ol == 1? "(在线)" : "(离线)"}}</div> -->
					<div>{{currentWindow.pnm}}</div>
					<div>{{currentWindow.pos}}</div>
				</div>
				<div class="amap-info-sharp">

				</div>
			</div>
		</el-amap-info-window>
	</el-amap>
</template>
<script>
	import {
		AMapManager
	} from "vue-amap";
	import Vue from "vue";
	let amapManager = new AMapManager();
	export default {
		props: {
			data: {
				type: Array
			}
		},
		watch: {
			data(v) {
				this.currentWindow.visible = false
				const markers = []
				const windows = []
				const label = []
				let markerImg = "";
				const that = this
				this.carInfo = v.map((item, index) => {
					if (item.ol == 1) {
						markerImg =
							`<img style='width:50px;height:50px' src="${require("@/assets/images/adas/car.png")}" ></img>`;
					} else {
						markerImg =
							`<img style='width:50px;height:50px' src="${require("@/assets/images/adas/car.png")}" ></img>`;
					}
					markers.push({
						lnglat: [parseFloat(item.longitude), parseFloat(item.latitude)],
						LicensePlateNumber: item.truckId,
						markerImg,
						pnm: item.truckId,
						pos: item.address,
						// ol: item.ol,
						label: {
							content: item.truckId,
							offset: [-5, 40]
						},
						events: {
							click: e => {
								that.windows.forEach(data => {
									data.visible = false
								})
								that.currentWindow = that.windows[index]
								that.center = that.windows[index].position
								that.$nextTick(() => {
									that.currentWindow.visible = true
									that.showEnterpriseInfo(e.target.w.position)
								})
							}
						}
					})
					windows.push({
						position: [parseFloat(item.longitude), parseFloat(item.latitude)],
						isCustom: true,
						offset: [15, -25],
						pnm: item.truckId,
						pos: item.address,
						// ol: item.ol,
						showShadow: false,
						visible: false, // 初始是否显示
						Location: item.address,
					})
				});
				this.markers = markers
				this.windows = windows
			}
		},
		data() {
			return {
				markers: [],
				label: [],
				amapManager,
				center: [113.457985, 23.018409],
				zoom: 12,
				//弹窗信息
				currentWindow: {
					position: [0, 0],
					content: "",
					visible: false
				},
				windows: [],
				events: {
					click: (e) => {
						const {
							lng,
							lat
						} = e.lnglat
						this.lng = lng
						this.lat = lat
					},
					zoomchange: (e, i) => {
						this.zoom = this.$refs.elAmap.$$getInstance().getZoom()
					}
				},
				markerImg: `<img src="${require("@/assets/images/adas/icon_1.png")}" ></img>`,
				carInfo: [] //地图图标
			};
		},
		mounted() {},
		methods: {
			showEnterpriseInfo(enterprise) {
				this.currentWindow.visible = true
			}
		}
	};
</script>
<style scoped>
	.box {
		width: 100%;
		height: 100%;
	}

	.amap-box {
		width: 100%;
		height: 100%;
	}

	/deep/ .amap-info-content {
		height: auto;
		/* width: 193px; */
		border-radius: 40px;
		background: #3385ff;
		color: #fff;
		font-size: 12px;
		padding: 9px 22px !important;
		overflow: hidden !important;
	}

	/deep/ .bottom-center .amap-info-sharp {
		bottom: 0;
		left: 50%;
		margin-left: -8px;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid #3385ff;
	}

	/deep/ .amap-info-close {
		display: none;
	}

	
</style>
<style>
	.amap-marker-label {
		border: none !important;
		border-radius: 2px;
	}
</style>