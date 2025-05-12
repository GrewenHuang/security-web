<template>
	<el-dialog v-dialog-drag title="查看" :visible.sync="addShow" :close-on-click-modal="false" @close="dialogClear"
		width="60%" top="8vh" :append-to-body="true">
		<el-scrollbar class="scrollbar" ref="scrollbar">
			<div class="detail-box">
				<div class="num-box">
					<span>编号:</span>
					<span>{{info.FileNo}}</span>
				</div>
				<table>
					<tr>
						<td><span>企业名称</span></td>
						<td><span>{{info.EnterpriseName}}</span></td>
						<td><span>责任部门</span></td>
						<td><span>{{info.DepartmentName}}</span></td>
					</tr>
					<tr>
						<td><span>隐患级别</span></td>
						<td><span>{{info.PotentialLevelName}}</span></td>
						<td><span>隐患来源</span></td>
						<td><span>{{info.PotentialSourceDesc}}</span></td>
					</tr>
					<tr>
						<td><span>隐患名称</span></td>
						<td><span>{{info.Project}}</span></td>
						<td><span>安全等级</span></td>
						<td><span>{{info.SecurityLevelDesc}}</span></td>
					</tr>
					<tr>
						<td><span>隐患内容</span></td>
						<td colspan="3" style="line-height: 25px;"><span v-html="info.Content"></span></td>
					</tr>
					<tr>
						<td><span>上报人</span></td>
						<td><span>{{info.SubmitUserName}}</span></td>
						<td><span>上报时间</span></td>
						<td><span>{{info.SubmitDateDesc}}</span></td>
					</tr>
					<tr>
						<td><span>排查照片</span></td>
						<td colspan="3" class="td-right">
							<div>
								<mediaList :list="info.RecordSubmit.AttachmentFiles" v-if="info.RecordSubmit" />
							</div>
						</td>
					</tr>
					<tr>
						<td><span>排查备注</span></td>
						<td colspan="3"><span>{{info.RecordSubmit.Remark}}</span></td>
					</tr>
					<template v-if="info.RecordRectification">
						<div class="div-group" v-for="(item, index) in info.RecordRectification" :key="index">
							<tr>
								<td><span>整改照片</span></td>
								<td colspan="3"  class="td-right">
									<mediaList :list="item.AttachmentFiles" v-if="item.AttachmentFiles" />
								</td>
							</tr>
							<tr>
								<td><span>整改备注</span></td>
								<td colspan="3"><span>{{item.Remark}}</span></td>
							</tr>
						</div>
					</template>
					<template v-if="info.RecordReexamine">
						<div class="div-group" v-for="(data, ids) in info.RecordReexamine" :key="ids+ 'a'">
							<tr>
								<td><span>复查人</span></td>
								<td><span>{{ data.OperationUserName }}</span></td>
								<td><span>复查时间</span></td>
								<td><span>{{ data.OperationDateDesc }}</span></td>
							</tr>
							<tr>
								<td><span>复查照片</span></td>
								<td colspan="3" class="td-right">
									<mediaList :list="data.AttachmentFiles" v-if="data.AttachmentFiles" />
								</td>
							<tr>
								<td><span>{{data.IsPass? '复查备注：' : '不通过原因'}}</span></td>
								<td colspan="3"><span>{{data.Remark}}</span></td>
							</tr>
							</tr>
						</div>
					</template>
					<tr v-if="info.RecordSubmit.SignInUrl">
						<td><span>上报人签字</span></td>
						<td colspan="3">
							<div class="f" >
								<el-image :src="info.RecordSubmit.SignInUrl" style="width: 50px; height: 50px;">
								</el-image>
							</div>
						</td>
					</tr>
					<tr  v-if="info.RecordRectification && info.RecordRectification.length > 0">
						<td><span>整改人签字</span></td>
						<td colspan="3">
							<template>
								<div class="f-b-c div-group" >
									<el-image  v-for="(item, index) in info.RecordRectification" :key="index" :src="item.SignInUrl" style="width: 50px; height: 50px;">
										:preview-src-list="[item.SignInUrl]"
									</el-image>
								</div>
							</template>
						</td>
					</tr>
					<tr  v-if="info.RecordReexamine && info.RecordReexamine.length > 0">
						<td><span>复查人签字</span></td>
						<td colspan="3">
							<template>
								<div class="f-b-c div-group" >
									<el-image  v-for="(item, index) in info.RecordReexamine" :key="index" :src="item.SignInUrl" style="width: 50px; height: 50px;">
									 :preview-src-list="[item.SignInUrl]"
									</el-image>
								</div>
							</template>
						</td>
					</tr>
				</table>
			</div>
		</el-scrollbar>
	</el-dialog>
</template>

<script>
	import mediaList from '@/components/common/media-list'
	export default {
		components: {
			mediaList
		},
		data() {
			return {
				addShow: false,
				info: {
					RecordSubmit: {
						SignInUrl: '',
					},
					RecordSubmit: {
						AttachmentFiles: []
					}
				}
			}
		},
		methods: {
			dialogClear() {
				this.addShow = false
			},
			show(item) {
				this.addShow = true
				this.info = item
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0
				});
			}
		}
	}
</script>

<style scoped lang="less">
	/deep/.el-image {
		vertical-align: middle;
	}
	.detail-box {
		width: 100%;
		padding-bottom: 20px;
		.num-box {
			width: 100%;
			text-align: right;
			font-size: 16px;
			color: #000;
			font-weight: bold;
			margin-bottom: 10px;

			span:nth-child(2) {
				color: #FF4040;
			}
		}

		table {
			border-collapse: collapse;
			width: 100%;
			border: 1px solid #333;
			border-right: none;

			.div-group {
				display: table-row-group;
			}

			.none {
				border-right: 1px solid #333;
			}

			.td-right {
				// height: 50px !important;
				border-right: 1px solid #333;
				padding: 0 5px;
			}

			tr {
				td {
					text-align: center;
					height: 50px;
					line-height: 50px;
					border-right: 1px solid #333;
					border-bottom: 1px solid #333;

					.span_top {
						// border-top: 1px solid #333;
					}

					span {
						display: inline-block;
						width: 100%;
						min-width: 100px;
						font-size: 16px;
					}
				}
			}
		}
	}
</style>