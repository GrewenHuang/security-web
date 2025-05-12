<template>
	<div class="info" v-loading="loading">
		<div class="card">
			<div class="title">
				<span>基本信息</span>
			</div>
			<el-form class="content" :inline="true">
				<div class="f-b-c">
					<el-form-item label="车牌号：" style="width: 100%">
						<div>{{ form.VehicleNo }}</div>
					</el-form-item>
					<el-form-item label="车辆负责人：" style="width: 100%">
						<div>{{ form.VehicleUserName }}</div>
					</el-form-item>
				</div>
				<div class="f-b-c">
					<el-form-item label="检查人：" style="width: 100%">
						<div>{{ form.CheckUserName }}</div>
					</el-form-item>
					<el-form-item label="检查时间：" style="width: 100%">
						<div>{{ form.CheckTimeDesc }}</div>
					</el-form-item>
				</div>
				<el-form-item label="检查地址：" style="width: 100%">
					<div>{{ form.CheckAddress }}</div>
				</el-form-item>
				<el-form-item label="检查照片:" style="width: 100%; height: 100px;">
					<div v-if="form.CheckPics && form.CheckPics.length">
						<el-image style="width: 100px; height: 100px;margin-right: 5px"
							v-for="(item, i) in form.CheckPics" :key="i" :src="item.url" :preview-src-list="[item.url]"
							fit="fit"></el-image>
					</div>
					<div v-else>无</div>
				</el-form-item>
				<el-form-item label="检查视频:" style="width: 100%; height: 100px;">
					<div v-if="form.CheckVideos && form.CheckVideos.length">
						<el-image style="width: 100px; height: 100px;margin-right: 5px"
							v-for="(item, i) in form.CheckVideos" :key="i" :src="item.coverUrl"
							 @click="playVideo(item)"></el-image>
					</div>
					<div v-else>无</div>
				</el-form-item>
				<div class="f--c" v-if="form.CheckSignInUrl">
					<div>检查人签名：</div>
					<el-image style="width: auto; height: 45px; margin-right: 10px"
						:preview-src-list="[form.CheckSignInUrl]" :src="form.CheckSignInUrl">
					</el-image>
				</div>
				<div class="f--c" v-if="form.VehicleSignInUrl">
					<div>车辆负责人签名：</div>
					<el-image style="width: auto; height: 45px; margin-right: 10px"
						:preview-src-list="[form.VehicleSignInUrl]" :src="form.VehicleSignInUrl">
					</el-image>
				</div>
			</el-form>
		</div>
		<div class="card">
			<div class="title">
				<span>检查项目</span>
			</div>
			<div class="content">
				<div class="f--e">
					<div class="label">检查正常：</div>
					<div class="check-pass-list">
						<custom-tag v-for="(item, i) in form.NormalList" :text="item.ItemName" type="success" :key="i">
						</custom-tag>
					</div>
				</div>
				<div class="f--e split">
					<div class="label">检查异常：</div>
					<div>
						<div class="abnormal-content" v-if="form.AbnormalList && form.AbnormalList.length">
							<div v-for="(item, i) in form.AbnormalList" :key="i" style="margin-bottom: 5px">
								<custom-tag style="margin-right: 24px" :text="item.ItemName"
									type="warning"></custom-tag>
								{{ item.Abnormal }}
							</div>
						</div>
						<div v-else>无</div>
					</div>
				</div>
			</div>
		</div>
		<el-dialog title="检查视频" :visible="isShow" width="1000px" @close="closeDialog" append-to-body>
			<video :src="videoUrl" controls autoplay class="video"></video>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin.js';

	export default {
		name: 'review',
		components: {},
		mixins: [request_mixin],
		data() {
			return {
				loading: false,
				form: {},
				isShow: false,
				videoUrl: ''
			};
		},
		mounted() {},
		methods: {
			getMonthSafelyCheck(id) {
				let than = this;
				than.loading = true;
				this.Get('/GetVehicleSafelyCheck', {
					vehicleSafelyCheckId: id,
				}).then((res) => {
					if (res.status == 2000) {
						res.data.NormalList = res.data.CheckItems.filter(
							(item) => item.IsNormal == 1
						);
						res.data.AbnormalList = res.data.CheckItems.filter(
							(item) => item.IsNormal == 0
						);
						than.form = res.data;
					}
					than.loading = false;
				});
			},
			// 视频播放
			playVideo(row) {
				this.isShow = true
				// 将接受的值赋值给src
				this.videoUrl = row.url
			},
			closeDialog() {
				// 关闭弹框
				this.isShow = false
				this.videoUrl = '' // 清空数据 关闭视频播放
			},
			setTime(date) {
				if (date) {
					let arr = date.split('T');
					return arr[0] + ' ' + arr[1];
				} else {
					return '无';
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.video {
			display: block;
			;
			margin: 0 auto;
			max-width: 100%;
			height: 55vh;
		}
	.el-icon-success {
		margin-right: 10px;
		line-height: 40px;
	}

	.el-icon-error {
		margin-right: 10px;
		line-height: 40px;
	}

	.inspection {
		border-top: solid 1px #ccc;
	}

	.info {
		color: $base-color;

		.label {
			margin-right: 14px;
			white-space: nowrap;
		}

		.card {
			.title {
				display: flex;
				align-items: center;
				padding: 15px;
				font-size: 16px;
				line-height: 22px;
				color: #181B3B;
				background: #f8f8f8;

				&::before {
					content: '';
					border-radius: 2px;
					margin-right: 8px;
					width: 5px;
					height: 16px;
					background: #005DFF;
				}
			}

			.content {
				padding: 15px;
			}
		}

		.split {
			border-top: 1px solid #ddd;
			margin-top: 15px;
			padding: 20px 0 0;
		}

		.check-pass-list {
			>* {
				margin-right: 5px;
				margin-bottom: 5px;
			}
		}
	}
</style>