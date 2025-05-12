<template>
	<el-dialog v-dialog-drag class="production-accident-add" :title="title" :visible.sync="isShow" @close="close"
		width="60%" top="50px" :append-to-body="true" v-loading="loading">
		<el-scrollbar class='scrollbar' ref="scrollbar">
			<el-form class="container" ref="form" :model="info" disabled>
				<el-form-item label="标题">
					<el-input v-model.trim="info.Title" placeholder="请输入" maxlength="100" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<el-input v-model.trim="info.Context" placeholder="请输入" maxlength="200" show-word-limit
						type="textarea" resize="none"></el-input>
				</el-form-item>
				<el-form-item>
					<div>
						照片
					</div>
					<div v-if="info.Pics && info.Pics.length > 0" class="file-box f-b-c">
						<el-image v-for="(item,index) in info.Pics" :key="index"
							style="width:150px;height:150px;border-radius: px;" :preview-src-list="[item.url]"
							:z-index='9999' :src="item.url" fit="fit">
						</el-image>
					</div>
					<div v-else>无</div>
				</el-form-item>
				<el-form-item>
					<div>
						视频
					</div>
					<div v-if="info.Videos && info.Videos.length > 0" class="file-box">
						<div v-for="(item,index) in info.Videos" :key="index" @click="preview(item)">
							<span><i class="el-icon-video-camera"></i>{{item.name}}</span>
						</div>
					</div>
					<div v-else>无</div>
				</el-form-item>
				<el-form-item>
					<div>
						附件
					</div>
					<div v-if="info.Files && info.Files.length > 0" class="file-box">
						<div v-for="(item,index) in info.Files" :key="index" @click="preview(item)">
							<span><i class="el-icon-document"></i>{{item.name}}</span>
						</div>
					</div>
					<div v-else>无</div>
				</el-form-item>
				<el-divider></el-divider>
			</el-form>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">关闭</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from "@/mixins/request-mixin.js";
	const defaultInfo = {
		SaveNotify: "",
		Title: "",
		Context: '',
		SecurityLevel: '1',
		Members: [],
		UserName: '',
		Pics: [],
		Videos: [],
		Files: []
	}

	export default {
		mixins: [request_mixin],
		components: {},
		data() {
			return {
				loading: false,
				isShow: false,
				info: Object.assign({}, defaultInfo),
				isSaveLoading: false,
				id: '',
				isAdd: false,
			};
		},
		computed: {
			title() {
				return  '查看'
			}
		},
		methods: {
			preview(file) {
				window.open(file.viewurl);
			},
			async show(item, isShow) {
				this.isShow = true;
				this.loading = true
				let res = await this.Get('/GetTaskNotify?notifyId=' + item.NotifyId)
				if (res.status == 2000) {
					this.info = res.data
				}
				this.loading = false
				this.info.SecurityLevel = this.info.SecurityLevel.toString()
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0
				});
			},
			close() {
				this.isShow = false;
				this.$nextTick(() => {
					this.reset();
				})
			},
			reset() {
				this.isSaveLoading = false;
				this.id = '';
				this.info = Object.assign({}, defaultInfo);
			},
			getParams() {
				let params = Object.assign({}, this.info);
				params.SecurityLevel = parseInt(params.SecurityLevel)
				return params;
			},
		},
	};
</script>

<style lang="scss" scoped>

	.file-box {
		box-sizing: border-box;
		padding-left: 10px;
		margin-top: 10px;

		div {
			span {
				cursor: pointer;
				color: #333;

				i {
					margin-right: 5px;
				}
			}
		}
	}
</style>