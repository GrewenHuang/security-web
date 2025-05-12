<template>
	<el-scrollbar class="scrollbar" ref="scrollbar">
		<div class="logbook-info" v-loading="loading">
			<el-collapse v-model="collapseActive">
				<el-collapse-item name="baseInfo" disabled>
					<div slot="title" class="f-b-c f1">
						<div class="title">
							<span>基本信息</span>
						</div>
					</div>
					<el-form :inline="true">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="车牌号：" style="width: 100%">
									<div>{{ form.LicensePlateNumber }}</div>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="日期：" style="width: 100%">
									<div>{{ form.LogDateDesc }}</div>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="驾驶员：" style="width: 100%">
									<div>{{ form.DriverName }}</div>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="天气：" style="width: 100%">
									<div>{{ form.Weather }}</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-collapse-item>

				<el-collapse-item name="inquiry" v-if="form.InquiryInfo">
					<div slot="title" class="f-b-c f1">
						<div class="title">
							<span>问询</span>
						</div>
						<div class="operation" :class="{open: collapseActive.includes('inquiry')}">
							{{ collapseActive.includes('inquiry') ? '收起' : '展开' }}
						</div>
					</div>
					<div class="Box">
						<div class="meeting-content">
							<vue-ellipsis-text :content="form.InquiryInfo.Inquiry" :line="3" :hasMore="true"
								:revealWidth="80" revealText="查看更多" foldText="收起" />
						</div>
						<div class="f--c">
							<div class="label">签名：</div>
							<el-image style="width: auto; height: 45px" :preview-src-list="[form.InquiryInfo.SignInUrl]"
								:src="form.InquiryInfo.SignInUrl">
							</el-image>
						</div>
						<div class="f--c">
							<div>签名时间：</div>
							<div>{{ form.InquiryInfo.SignInDateDesc }}</div>
						</div>
					</div>
				</el-collapse-item>
				<el-collapse-item name="before" v-if="form.PreTripInspection">
					<div slot="title" class="f-b-c f1">
						<div class="title">
							<span>出车前检查</span>
						</div>
						<div class="operation" :class="{open: collapseActive.includes('before')}">
							{{ collapseActive.includes('before') ? '收起' : '展开' }}
						</div>
					</div>
					<div class="Box">
						<div class="f--e">
							<div class="label">检查正常：</div>
							<div class="check-pass-list">
								<custom-tag v-for="(item, i) in form.PreTripInspection.InspectionItems"
									:text="item.ItemName" type="success" :key="i">
								</custom-tag>
							</div>
						</div>
						<div class="f--e">
							<div class="label">检查异常：</div>
							<div>
								<div class="abnormal-content" v-if="
                                        form.PreTripInspection.AbnormalList &&
                                        form.PreTripInspection.AbnormalList.length
                                    ">
									<div v-for="(item, i) in form.PreTripInspection.AbnormalList" :key="i">
										<custom-tag style="margin-right: 24px;" :text="item.ItemName"
											type="warning"></custom-tag>
										{{ item.Abnormal }}
									</div>
								</div>
								<div v-else>无</div>
							</div>
						</div>
						<div class="f--c">
							<div class="label">检查照片/视频：</div>
							<div v-if="
                                    form.PreTripInspection.CheckPics &&
                                    form.PreTripInspection.CheckPics.length
                                ">
								<el-image style="width: 75px; height: 75px;border-radius: 4px;margin: 0 5px 5px 0;"
									v-for="(item, i) in form.PreTripInspection
                                        .CheckPics" :key="i" :src="item.url" :preview-src-list="[item.url]"
									fit="fit"></el-image>
							</div>
							<div v-else>无</div>
						</div>
						<!-- <div class="f--c">
							<div class="label">检查视频：</div>
							<div v-if="
						            form.PreTripInspection.CheckVideos &&
						            form.PreTripInspection.CheckVideos.length
						        ">
								<el-image style="width: 75px; height: 75px;border-radius: 4px;margin: 0 5px 5px 0;"
									v-for="(item, i) in form.PreTripInspection
						                .CheckVideos" :key="i" :src="item.coverUrl"
									@click="playVideo(item)"></el-image>
							</div>
							<div v-else>无</div>
						</div> -->
						<div class="f--c" v-if="form.PreTripInspection.SignInUrl">
							<div class="label">检查人签名：</div>
							<el-image style="width: auto; height: 45px"
								:preview-src-list="[form.PreTripInspection.SignInUrl]"
								:src="form.PreTripInspection.SignInUrl">
							</el-image>
						</div>
						<div class="f--c" v-if='form.PreTripInspection.SuperCargoSignInUrl'>
							<div>安全员签名：</div>
							<el-image style="width: auto; height: 45px; margin-right: 10px"
								:preview-src-list="[form.PreTripInspection.SuperCargoSignInUrl]" :src="form.PreTripInspection.SuperCargoSignInUrl">
							</el-image>
						</div>
						<div class="f--c">
							<div>检查时间：</div>
							<div>{{ form.PreTripInspection.InspectionDateDesc }}</div>
						</div>
					</div>
				</el-collapse-item>

				<el-collapse-item name="in" v-if="form.InTrainInspection && form.InTrainInspection.length">
					<div slot="title" class="f-b-c f1">
						<div class="title">
							<span>行车中检查</span>
						</div>
						<div class="operation" :class="{open: collapseActive.includes('in')}">
							{{ collapseActive.includes('in') ? '收起' : '展开' }}
						</div>
					</div>
					<div>
						<div v-if="form.InTrainInspection.length">
							<div class="Box in-train" v-for="(item, index) in form.InTrainInspection" :key="index">
								<div class="f--e">
									<div class="label">检查正常：</div>
									<div class="check-pass-list">
										<custom-tag v-for="(item, i) in item.InspectionItems" :text="item.ItemName"
											type="success" :key="i">
										</custom-tag>
									</div>
								</div>
								<div class="f--e">
									<div class="label">检查异常：</div>
									<div>
										<div class="abnormal-content" v-if="
                                                item.AbnormalList &&
                                                item.AbnormalList.length
                                            ">
											<div v-for="(item, i) in item.AbnormalList" :key="i">
												<custom-tag style="margin-right: 24px;" :text="item.ItemName"
													type="warning"></custom-tag>
												{{ item.Abnormal }}
											</div>
										</div>
										<div v-else>无</div>
									</div>
								</div>
								<div class="f--c">
									<div class="label">检查照片：</div>
									<div v-if="item.CheckPics && item.CheckPics.length">
										<el-image
											style="width: 75px; height: 75px;border-radius: 4px;margin: 0 5px 5px 0;"
											v-for="(itemsPic, j) in item.CheckPics" :key="j" :src="itemsPic.url"
											:preview-src-list="[itemsPic.url]" fit="fit"></el-image>
									</div>
									<div v-else>无</div>
								</div>
								<div class="f--c">
									<div class="label">检查视频：</div>
									<div v-if="
								            item.CheckVideos &&
								            item.CheckVideos.length
								        ">
										<el-image style="width: 75px; height: 75px;border-radius: 4px;margin: 0 5px 5px 0;"
											v-for="(item, i) in item.CheckVideos" :key="i" :src="item.coverUrl"
											@click="playVideo(item)"></el-image>
									</div>
									<div v-else>无</div>
								</div>
								<div class="f--c" v-if="item.SignInUrl">
									<div>驾驶员签名：</div>
									<el-image style="width: auto; height: 45px; margin-right: 10px"
										:preview-src-list="[item.SignInUrl]" :src="item.SignInUrl">
									</el-image>
								</div>
								<div class="f--c" v-if='item.SuperCargoSignInUrl'>
									<div>安全员签名：</div>
									<el-image style="width: auto; height: 45px; margin-right: 10px"
										:preview-src-list="[item.SuperCargoSignInUrl]" :src="item.SuperCargoSignInUrl">
									</el-image>
								</div>
								<div class="f--e">
									<div class="label">检查时间：</div>
									<div>{{ item.InspectionDateDesc }}</div>
								</div>
							</div>
						</div>
					</div>
				</el-collapse-item>

				<el-collapse-item name="after" v-if="form.PostTripInspection != null">
					<div slot="title" class="f-b-c f1">
						<div class="title">
							<span>收车后检查</span>
						</div>
						<div class="operation" :class="{open: collapseActive.includes('after')}">
							{{ collapseActive.includes('after') ? '收起' : '展开' }}
						</div>
					</div>
					<div class="Box">
						<div class="f--e">
							<div class="label">检查正常：</div>
							<div class="check-pass-list">
								<custom-tag v-for="(item, i) in form.PostTripInspection.InspectionItems"
									:text="item.ItemName" type="success" :key="i">
								</custom-tag>
							</div>
						</div>
						<div class="f--e">
							<div class="label">检查异常：</div>
							<div>
								<div class="abnormal-content" v-if="
                                        form.PostTripInspection.AbnormalList &&
                                        form.PostTripInspection.AbnormalList.length
                                    ">
									<div v-for="(item, i) in form.PostTripInspection.AbnormalList" :key="i">
										<custom-tag style="margin-right: 24px;" :text="item.ItemName"
											type="warning"></custom-tag>
										{{ item.Abnormal }}
									</div>
								</div>
								<div v-else>无</div>
							</div>
						</div>
						<div class="f--c">
							<div class="label">检查照片：</div>
							<div v-if="
                                    form.PostTripInspection.CheckPics &&
                                    form.PostTripInspection.CheckPics.length
                                ">
								<el-image style="width: 75px; height: 75px;border-radius: 4px;margin: 0 5px 5px 0;"
									v-for="(item, i) in form.PostTripInspection
                                        .CheckPics" :key="i" :src="item.url" :preview-src-list="[item.url]"
									fit="fit"></el-image>
							</div>
							<div v-else>无</div>
						</div>
						<div class="f--c">
							<div class="label">检查视频：</div>
							<div v-if="
						            form.PostTripInspection.CheckVideos &&
						            form.PostTripInspection.CheckVideos.length
						        ">
								<el-image style="width: 75px; height: 75px;border-radius: 4px;margin: 0 5px 5px 0;"
									v-for="(item, i) in form.PostTripInspection
						                .CheckVideos" :key="i" :src="item.coverUrl"
									@click="playVideo(item)"></el-image>
							</div>
							<div v-else>无</div>
						</div>
						<div class="f--c" v-if="form.PostTripInspection.SignInUrl">
							<div class="label">检查人签名：</div>
							<el-image style="width: auto; height: 45px"
								:preview-src-list="[form.PostTripInspection.SignInUrl]"
								:src="form.PostTripInspection.SignInUrl">
							</el-image>
						</div>
						<div class="f--c" v-if='form.PostTripInspection.SuperCargoSignInUrl'>
							<div>安全员签名：</div>
							<el-image style="width: auto; height: 45px; margin-right: 10px"
								:preview-src-list="[form.PostTripInspection.SuperCargoSignInUrl]" :src="form.PostTripInspection.SuperCargoSignInUrl">
							</el-image>
						</div>
						<div class="f--c">
							<div>检查时间：</div>
							<div>{{ form.PostTripInspection.InspectionDateDesc }}</div>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
		<el-dialog title="检查视频" :visible="isShow" width="1000px" @close="closeDialog" append-to-body>
			<video :src="videoUrl" controls autoplay class="video"></video>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">关闭</el-button>
			</div>
		</el-dialog>
	</el-scrollbar>
</template>

<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import VueEllipsisText from 'vue-ellipsis-text'
	export default {
		name: "review",
		components: {
			VueEllipsisText
		},
		mixins: [request_mixin],
		props: {
			hidden: Boolean
		},
		data() {
			return {
				loading: false,
				form: {},
				collapseActive: ['baseInfo', 'inquiry', 'before', 'in', 'after'],
				isShow: false,
				videoUrl: ''
			};
		},
		watch: {
			hidden(val) {
				if (val) {
					this.form = {};
				}
			}
		},
		mounted() {},
		methods: {
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
			getLogbookById(id) {
				let than = this;
				than.loading = true;
				this.$refs.scrollbar.wrap.scrollTop = 0;
				than.Get(`/GetLogbook?id=${id}`)
					.then(
						function(res) {
							if (res.data.PreTripInspection) {
								res.data.PreTripInspection.AbnormalList =
									res.data.PreTripInspection.InspectionItems.filter(
										(k) => {
											if (k.IsNormal == 0) {
												return k;
											}
										}
									);
								res.data.PreTripInspection.InspectionItems = res.data.PreTripInspection.InspectionItems
									.filter(item => {
										return item.IsNormal == 1
									})
							}
							if (res.data.PostTripInspection) {
								res.data.PostTripInspection.AbnormalList =
									res.data.PostTripInspection.InspectionItems.filter(
										(k) => {
											if (k.IsNormal == 0) {
												return k;
											}
										}
									);
								res.data.PostTripInspection.InspectionItems = res.data.PostTripInspection.InspectionItems
									.filter(item => item.IsNormal == 1)
							}
							if (res.data.InTrainInspection) {
								res.data.InTrainInspection.map((k) => {
									k.AbnormalList = k.InspectionItems.filter(
										(ks) => {
											if (ks.IsNormal == 0) {
												return ks;
											}
										}
									);
									k.InspectionItems = k.InspectionItems.filter(item => item.IsNormal == 1);
								});
							}
							than.form = res.data;
							than.loading = false;
						},
						function(err) {
							than.loading = false;
							than.$message.error({
								showClose: true,
								message: err.toString(),
								duration: 2000,
							});
						}
					)
					.catch(function(error) {
						than.loading = false;
						than.$message.error({
							showClose: true,
							message: error,
							duration: 2000,
						});
					});
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

	.Box>div {
		padding: 20px 0;

		&:not(:last-child) {
			position: relative;

			&::after {
				content: '';
				position: absolute;
				right: -15px;
				bottom: 0;
				left: -15px;
				border-bottom: 1px solid #DDDDDD;
			}
		}
	}

	.logbook-info {
		color: $base-color;

		.label {
			margin-right: 14px;
			white-space: nowrap;
		}

		.check-pass-list {
			>* {
				margin-right: 5px;
				margin-bottom: 5px;
			}
		}

		/deep/ .el-form-item {
			margin-bottom: 0;
			height: 35px;
		}

		/deep/ .el-collapse {
			border: none;

			.el-collapse-item {
				&.is-disabled {
					.el-collapse-item__header {
						cursor: inherit;
						color: inherit;
					}
				}

				&:not(:last-child) {
					padding-bottom: 15px;
				}

				.el-collapse-item__header {
					border: none;
					border-radius: 4px;
					padding: 15px;
					background: #F8F8F8;
					line-height: inherit;

					.title {
						display: flex;
						align-items: center;
						font-size: 16px;
						line-height: 22px;
						color: $base-color;

						&::before {
							content: '';
							border-radius: 2px;
							margin-right: 8px;
							width: 5px;
							height: 16px;
							background: $primary-color;
						}
					}

					.operation {
						display: flex;
						align-items: center;
						color: $primary-color;

						&::before {
							content: '';
							border: 8.25px solid $primary-color;
							border-bottom: 0;
							border-right: 6px solid transparent;
							border-left: 6px solid transparent;
							margin-right: 6px;
							width: 0;
							height: 0;
							transform-origin: center;
							transform: rotateX(0);
							transition: all .2s linear;
						}

						&.open {
							&::before {
								transform: rotateX(180deg);
							}
						}
					}
				}

				.el-collapse-item__arrow {
					display: none;
				}

				.el-collapse-item__wrap {
					border: none;
				}

				.el-collapse-item__content {
					padding: 0 15px;

					.abnormal-content {
						>div {
							&:not(:last-child) {
								margin-bottom: 5px;
							}
						}
					}

					.in-train {
						&:not(:last-child) {
							position: relative;

							&::after {
								content: '';
								position: absolute;
								right: -15px;
								bottom: 0;
								left: -15px;
								border-bottom: 1px dashed #ddd;
							}
						}
					}
				}
			}
		}
	}
</style>