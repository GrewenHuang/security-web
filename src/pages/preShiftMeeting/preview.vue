<template>
	<div>
		<el-dialog v-if="issubsidiary" v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info"
			width="1000px" top="8vh" v-loading="loading" element-loading-text="数据加载中" :append-to-body="true">
			<el-scrollbar ref="scrollbar" class="scrollbar">
				<div class="content" v-if="!!info">
					<div class="title f-b-c">
						<span>班前会内容</span>
					</div>
					<div class="info-item f--c">
						<div class="label">任务名称：</div>
						<div>{{ info.PlanName }}</div>
					</div>
					<div class="info-item f--c">
						<div class="label">召开时间：</div>
						<div>{{ info.MeetingDateDesc }}</div>
					</div>
					<!-- <div class="info-item f--c">
						<div class="label">结束时间：</div>
						<div>{{ info.MeetingEndDateDesc }}</div>
					</div> -->
					<div class="info-item f--c">
						<div class="label">召开人：</div>
						<div>
							{{ info.LeaderName }}
						</div>
						<template v-if="info.SignInUrl">
							<el-image class="sign" alt="sign" :src="info.SignInUrl"
								:preview-src-list="[info.SignInUrl]"></el-image>
						</template>
					</div>
					<div  class="info-item f--c">
						<div class="label">参与人：</div>
						<div v-if="userList && userList.length > 0">
							 <span>{{userList.map(item => item.UserName).join(',')}}</span>
						</div>
					</div>
					<div class="info-item">
						<div class="label">会议内容：</div>
						<div>
							<audio controls style="width: 35%;">
								<source :src="info.ContentWavUrl" />
							</audio>
							<div class="meeting-content">
								<vue-ellipsis-text :line="3" :hasMore="true" :revealWidth="80" revealText="查看更多"
									foldText="收起">{{ info.Content }}</vue-ellipsis-text>
							</div>
							<!-- <div class="files">
		                        <div class="file-item f" v-for="(item, index) in info.PreMeetingSignFiles" :key="index" @click="$openFile(item.Url)">
		                            <img style="width:30px;height:30px;margin-right: 13px;"
		                                :src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
		                            <div class="text">
		                                <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.Name}}</div>
		                                <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.Size | formatSize}}</div>
		                            </div>
		                        </div>
		                    </div> -->
						</div>
					</div>
					<div class="info-item" v-if="info.PreMeetingSignFiles && info.PreMeetingSignFiles.length > 0">
						<div class="label">会议照片/视频</div>
							<div class="file-item f" style="margin-top: 10px" v-for="(item, index) in info.PreMeetingSignFiles" :key="index">
								<el-image style="width: 75px; height: 75px;border-radius: 4px;margin: 0 5px 5px 0;" fit="fit"
									:src="item.Url" :preview-src-list="[item.Url]" v-if="item.Classify == 'Image'"></el-image>
								<el-image style="width: 75px; height: 75px;border-radius: 4px;margin: 0 5px 5px 0;"
									:src="item.CoverUrl" @click="playVideo(item)" v-else></el-image>
							</div>
					</div>
					<!-- <div class="title f-b-c" style="margin-top: 27px;"> -->
						<!-- <span>签名详情（{{ info.SignedNum }} / {{ info.TotalNum }}）</span> -->
						<!-- <span>参与人</span> -->
						<!-- <el-button
		                    type="primary"
		                    v-if="info.Status == 0"
		                    @click="chooseUser"
		                >添加人员</el-button> -->
					<!-- </div> -->
					<!-- <el-table style="margin-top: 20px;" :data="userList" :header-cell-style="$tableStyle">
						<el-table-column type="index" label="序号" width="80"></el-table-column>
						<el-table-column label="姓名" prop="UserName"></el-table-column>
						<el-table-column label="状态" width="160" align="center">
							<template slot-scope="{ row }">
								<whether :yes="row.Status == 1" :text="row.StatusDesc" />
							</template>
						</el-table-column>
						<el-table-column label="签名" width="130" align="center">
							<template slot-scope="{ row }">
								<el-image style="width:45px;height:45px;" :src="row.SignInUrl"
									:preview-src-list="[row.SignInUrl]" v-if="row.SignInUrl"></el-image>
								<span v-else>/</span>
							</template>
						</el-table-column>
						<el-table-column label="签名时间" width="180" align="center">
							<template slot-scope="{ row }">
								<div v-if="row.SignTime">
									{{ row.SignTimeDesc }}
								</div>
								<span v-else>/</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="80" align="center" v-if="info.Status == 0">
							<template slot-scope="{ row, $index }">
								<el-button type="text" v-bind="{'text-plain': !!row.SignInUrl}"
									@click="removeUser(row, $index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table> -->
					<template v-if="(info||{}).Status == 2">
						<div class="info-item">
							<div class="label" style="margin-bottom: 15px;">安全等级</div>
							<select-level v-model="info.SecurityLevel" :multiple="false"
								:value="info.SecurityLevel" :disabled="isDis"></select-level>
						</div>
						<div class="info-item">
							<div class="label" style="margin-bottom: 15px;">评分</div>
							<el-input-number :min="0" v-model="info.Score" :max="100" :disabled="isDis" style="width: 100%"></el-input-number>
						</div>
						<div class="info-item">
							<div class="label" style="margin-bottom: 15px;">评分说明</div>
							<el-input type="textarea" resize="none" v-model.trim="info.ScoreRemark" placeholder="评分说明"
								maxlength="100" show-word-limit :disabled="isDis"></el-input>
						</div>
					</template>
				</div>
			</el-scrollbar>
		
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close()">{{(info||{}).Status == 2 ? '取消' : '关闭'}}</el-button>
				<el-button type="primary" @click="submit" v-if="(info||{}).Status == 2 && $_has('BQHRWBtnScore')">确认</el-button>
			</div>
		</el-dialog>
		<el-drawer v-else :title="title" :visible.sync="dislogShow" @close="close()" class="info" :size="1000"
			direction="ltr" v-loading="loading" element-loading-text="数据加载中">
			<div style="height:100%;width:100%;display:flex;flex-direction:column;justify-content:space-between">
		
				<el-scrollbar ref="scrollbar" class="scrollbar">
					<div class="content" v-if="!!info">
						<div class="title f-b-c">
							<span>班前会内容</span>
						</div>
						<div class="info-item f--c">
							<div class="label">召开日期：</div>
							<div>{{ info.MeetingDateDesc }}</div>
						</div>
						<div class="info-item f--c">
							<div class="label">召开人：</div>
							<div>
								{{ info.LeaderName }}
							</div>
							<el-image class="sign" alt="sign" :src="info.SignInUrl"
								:preview-src-list="[info.SignInUrl]"></el-image>
						</div>
						<div  class="info-item f--c">
							<div class="label">参与人：</div>
							<div v-if="userList && userList.length > 0">
								 <span>{{userList.map(item => item.UserName).join(',')}}</span>
							</div>
						</div>
						<div class="info-item">
							<div class="label">会议内容：</div>
							<div>
								<audio controls style="width: 35%;">
									<source :src="info.ContentWavUrl" />
								</audio>
								<div class="meeting-content">
									<vue-ellipsis-text :line="3" :hasMore="true" :revealWidth="80" revealText="查看更多"
										foldText="收起">{{ info.Content }}</vue-ellipsis-text>
								</div>
								<div class="files">
									<div class="file-item f" v-for="(item, index) in info.PreMeetingSignFiles" :key="index"
										@click="$openFile(item.Url)">
										<img style="width:30px;height:30px;margin-right: 13px;"
											:src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
										<div class="text">
											<div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.Name}}</div>
											<div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">
												{{ item.Size | formatSize}}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<tempalte  v-if="(info||{}).Status == 2">
							<div class="info-item">
								<div class="label" style="margin-bottom: 15px;">安全等级</div>
								<select-level v-model="info.SecurityLevel" :multiple="false"
									:value="info.SecurityLevel" :disabled="isDis"></select-level>
							</div>
							<div class="info-item">
								<div class="label" style="margin-bottom: 15px;">评分</div>
								<el-input-number :min="0" v-model="info.Score" :max="100" style="width: 100%" :disabled="isDis"></el-input-number>
							</div>
							<div class="info-item">
								<div class="label" style="margin-bottom: 15px;">评分说明</div>
								<el-input type="textarea" resize="none" v-model.trim="info.ScoreRemark" placeholder="评分说明"
									maxlength="100" show-word-limit :disabled="isDis"></el-input>
							</div>
						</tempalte>
						<!-- <div class="title f-b-c" style="margin-top: 27px;"> -->
							<!-- <span>签名详情（{{ info.SignedNum }} / {{ info.TotalNum }}）</span> -->
							<!-- <span>参与人</span> -->
		
						<!-- </div> -->
					<!-- 	<el-table style="margin-top: 20px;" :data="userList" :header-cell-style="$tableStyle">
							<el-table-column type="index" label="序号" width="80"></el-table-column>
							<el-table-column label="姓名" prop="UserName"></el-table-column>
							<el-table-column label="状态" width="160" align="center">
								<template slot-scope="{ row }">
									<whether :yes="row.Status == 1" :text="row.StatusDesc" />
								</template>
							</el-table-column>
							<el-table-column label="签名" width="130" align="center">
								<template slot-scope="{ row }">
									<el-image style="width:45px;height:45px;" :src="row.SignInUrl"
										:preview-src-list="[row.SignInUrl]" v-if="row.SignInUrl"></el-image>
									<span v-else>/</span>
								</template>
							</el-table-column>
							<el-table-column label="签名时间" width="180" align="center">
								<template slot-scope="{ row }">
									<div v-if="row.SignTime">
										{{ row.SignTimeDesc }}
									</div>
									<span v-else>/</span>
								</template>
							</el-table-column>
		
						</el-table> -->
					</div>
				</el-scrollbar>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="close()">{{(info||{}).Status == 2 ? '取消' : '关闭'}}</el-button>
					<el-button type="primary" @click="submit" v-if="(info||{}).Status == 2 && $_has('BQHRWBtnScore')">确认</el-button>
				</div>
			</div>
		</el-drawer>
		<el-dialog title="检查视频" :visible="isShow" width="600px" @close="closeDialog" append-to-body>
			<video :src="videoUrl" controls autoplay class="video" style="width: 500px;height: 500px"></video>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	import util from '@/common/util'
	import VueEllipsisText from 'vue-ellipsis-text'
	const defaultInfo = {
		PreMeetingSignLeaderId: '',
		SecurityLevel: '',
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		name: 'page-info',
		mixins: [request_mixin],
		components: {
			VueEllipsisText
		},
		props: {
			look: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				id: '',
				loading: false,
				dislogShow: false,
				userList: [],
				addUserList: [],
				removeUserList: [],
				info: null,
				issubsidiary: true,
				videoUrl: '',
				isShow: false,
				isDis: false
			}
		},
		computed: {
			title() {
				return '查看'
			}
		},
		filters: {
			formatSize: util.change_size
		},
		methods: {
			// 视频播放
			playVideo(row) {
				this.isShow = true
				// 将接受的值赋值给src
				this.videoUrl = row.Url
			},
			closeDialog() {
				// 关闭弹框
				this.isShow = false
				this.videoUrl = '' // 清空数据 关闭视频播放
			},
			async show(item) {
				this.dislogShow = true;
				if (item) {
					this.loading = true;
					this.id = item.PreMeetingSignId;
					await this.getInfo();
					this.loading = false;
				}
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})

			},
			async getInfo() {
				try {
					let res = await this.Get(`/GetPreMeetingSign?preMeetingSignId=${this.id}`)
					if (res.status == 2000) {
						res.data.SecurityLevel = res.data.SecurityLevel.toString()
						this.info = Object.assign(_extends(defaultInfo), res.data);
						if(this.info.Status !=2){
							this.isDis = true
						}else {
							this.isDis = false
						}
						this.userList = res.data.Users.map(item => {
							return {
								...item,
								label: item.UserName,
								value: item.UserId
							}
						})
					} else {
						this.$message.error('获取数据失败');
						this.close();
					}
				} catch (error) {
					console.error(error);
				}
				return Promise.resolve(true);
			},
			close() {
				this.dislogShow = false;
				this.submitLoading = false;
				this.id = '';
				this.info = null;
				this.addUserList = [];
				this.removeUserList = [];
			},
			chooseUser() {
				this.$chooseUser({
					choosed: this.userList
				}).then(res => {
					this.userList = res.map(item => {
						if (item.SignInUrl === undefined) {
							item.StatusDesc = '未签名';
							item.Status = 0;
							if (this.info.Users.map(item => item.UserId).indexOf(item.UserId) == -1) {
								this.addUserList.push(item.UserId);
							}
							let index = this.removeUserList.indexOf(item.UserId);
							this.removeUserList.splice(index, 1);
						}
						return item;
					});
					this.info.Users.forEach(item => {
						let userIds = this.userList.map(user => user.UserId);
						if (userIds.indexOf(item.UserId) == -1) {
							this.removeUser(item);
						}
					})
				})
			},
			removeUser(item, index) {
				if (index !== undefined) {
					this.userList.splice(index, 1);
				}
				let i = this.addUserList.indexOf(item.UserId);
				this.addUserList.splice(i, 1);
				this.removeUserList.push(item.UserId);
			},
			async submit() {
				let res = await this.Post('/SavePreMeetingSignScore', {
					PreMeetingSignId: this.info.PreMeetingSignId,
					Score: this.info.Score,
					ScoreRemark: this.info.ScoreRemark,
					SecurityLevel: parseInt(this.info.SecurityLevel)
				});
				if (res.status == 2000) {
					this.$emit('load');
					this.$message.success('操作成功');
					this.close();
				}
			},
			updataissubsidiary() {
				this.issubsidiary = false
			}
		},
	}
</script>

<style lang="scss" scoped>
	.info {
		color: #181B3B;

		/deep/ .el-dialog__body {
			padding: 0 !important;
		}

		/deep/ .el-dialog {
			min-width: 1000px;
		}

		.content {
			padding: 20px 25px;

			.title {
				padding: 0 15px;
				height: 50px;
				background: #F5F6FA;

				>span {
					display: flex;
					align-items: center;
					font-size: 16px;
					font-weight: bold;

					&::before {
						content: '';
						display: inline-block;
						margin-right: 8px;
						width: 5px;
						height: 16px;
						background: $--color-primary;
					}
				}

				.el-button {
					padding: 5px 10px;
					height: 30px;
				}
			}

			.info-item {
				border-bottom: 1px solid #efefef;
				padding: 20px 15px;

				.label {
					font-weight: bold;
				}

				.sign {
					margin: -12px 0 -13px 26px;
					width: auto;
					height: 45px;
				}
			}

			/deep/ .ellipsis-more {
				color: $--color-primary;
				background: linear-gradient(90deg, transparent 0%, #fff 30%);
			}

			/deep/ .ellipsis-fold-text {
				text-align: center;
				color: $--color-primary;
			}

			audio {
				margin-top: 20px;
			}

			.meeting-content {
				margin-top: 20px;
			}

			.files {
				margin-top: 20px;

				.file-item {
					border: 1px dashed #ccc;
					border-radius: 4px;
					padding: 11px 10px;
					cursor: pointer;

					&:not(:first-child) {
						margin-top: 10px;
					}
				}
			}
		}
	}

	/deep/ .vx-ellipsis-text .ellipsis-content {
		div {
			white-space: pre-wrap;
			word-break: break-all;
			word-wrap: break-word;
		}
	}
</style>