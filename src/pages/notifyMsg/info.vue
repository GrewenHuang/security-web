<template>
	<el-dialog v-dialog-drag class="production-accident-add" :title="title" :visible.sync="isShow" @close="close"
		width="60%" top="50px" :append-to-body="true" v-loading="loading">
		<el-scrollbar class='scrollbar' ref="scrollbar">
			<el-form :rules="rules" class="container" ref="form" :model="info" :disabled="isPreview">
				<el-form-item label="标题" prop="Title">
					<el-input v-model.trim="info.Title" placeholder="请输入" maxlength="100" show-word-limit></el-input>
				</el-form-item>
				<div class="form-2-col">
					<el-form-item label="接收人员" prop="Members">
						<el-input placeholder="请选择" readonly v-model="info.UserName" class="input-with-select">
							<template v-if="!!info.UserName">
								<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
									slot="suffix" @click="removeItem()"></i>
							</template>
							<el-button slot="append" @click="chooseModerator()">选择人员</el-button>
						</el-input>
					</el-form-item>
					<el-form-item label="安全等级" prop="SecurityLevel">
						<select-level v-model="info.SecurityLevel" :multiple="false"
							:value="info.SecurityLevel"></select-level>
					</el-form-item>
				</div>
				<el-form-item label="内容" prop="Context">
					<el-input v-model.trim="info.Context" placeholder="请输入" maxlength="200" show-word-limit
						type="textarea" resize="none"></el-input>
				</el-form-item>
				<el-form-item>
					<div>
						照片
					</div>
					<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'" :fileList.sync="info.Pics"
						list-type="picture-card" v-if="!isPreview">
						<i class="el-icon-plus"></i>
					</custom-upload>
					<div v-if="isPreview && info.Pics && info.Pics.length > 0"  class="file-box f-b-c">
						<el-image v-for="(item,index) in info.Pics" :key="index" style="width:150px;height:150px;border-radius: px;"
							:preview-src-list="[item.url]" :z-index='9999' :src="item.url" fit="fit">
						</el-image>
					</div>
					<div v-if="isPreview && info.Pics && info.Pics.length == 0">无</div>
				</el-form-item>
				<el-form-item>
					<div>
						视频
					</div>
					<custom-upload :accept="'.mp4,.mp3'" @change="mediaUploadChnage" :file-list.sync="info.Videos"
						v-if="!isPreview">
						<el-button type="primary" style="margin-right: 9px;">上传视频</el-button>
					</custom-upload>
					<div v-if="isPreview && info.Videos && info.Videos.length > 0" class="file-box">
						<div v-for="(item,index) in info.Videos" :key="index" @click="preview(item)">
							<span><i class="el-icon-video-camera"></i>{{item.name}}</span>
						</div>
					</div>
					<div v-if="isPreview && info.Videos && info.Videos.length == 0">无</div>
				</el-form-item>
				<el-form-item>
					<div>
						附件(只能上传PDF文件)
					</div>
					<custom-upload @change="pdfUploadChnage" :accept="'.pdf'" :file-list.sync="info.Files"
						v-if="!isPreview">
						<el-button type="primary">上传PDF</el-button>
					</custom-upload>
					<div v-if="isPreview && info.Files && info.Files.length > 0" class="file-box">
						<div v-for="(item,index) in info.Files" :key="index" @click="preview(item)">
							<span><i class="el-icon-document"></i>{{item.name}}</span>
						</div>
					</div>
					<div v-if="isPreview && info.Files && info.Files.length == 0">无</div>
				</el-form-item>
				<el-divider></el-divider>
			</el-form>
			<template v-if="isPreview && !isLook">
				<div class="title-box">
					浏览情况({{info.ReadedCount}}/{{info.TotalCount}})
				</div>
				<el-table :data="info.Members" highlight-current-row :header-cell-style="$tableStyle"
					style="width: 100%" v-if="info.Members && info.Members.length">

					</el-table-column>
					<el-table-column label="序号" type="index" align="center" header-align="center" width="50">
					</el-table-column>
					<el-table-column label="部门" align="center" header-align="center" prop="EventReportName" width="300"
						show-overflow-tooltip>
						<template slot-scope="scope" v-if="scope.row.Departments && scope.row.Departments.length">
							{{ scope.row.Departments.map(item => item.DepartmentName).join('、') }}
						</template>
					</el-table-column>
					<el-table-column label="岗位" align="center" header-align="center" width="200" show-overflow-tooltip>
						<template slot-scope="scope" v-if="scope.row.positions && scope.row.positions.length">
							{{ scope.row.positions.map(item => item.PositionName).join('、') }}
						</template>
					</el-table-column>
					<el-table-column label="人员" align="center" header-align="center" prop="UserName"></el-table-column>
					</el-table-column>
					<el-table-column label="浏览状态" align="center" header-align="center" prop="IsRead">
						<template slot-scope="scope">
							<whether :yes="scope.row.IsRead == 1" :text="scope.row.IsRead == 1? '已浏览' : '未浏览'" />
						</template>
					</el-table-column>
					<el-table-column label="浏览时间" align="center" header-align="center" width="180">
						<template slot-scope="scope">
							<span>{{scope.row.IsRead == 1 ? scope.row.ReadTimeDesc : '-'}}</span>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">关闭</el-button>
			<el-button type="primary" @click="submit()" :loading="isSaveLoading" v-if="!isPreview">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import formatter_mixin from "@/mixins/formatter-mixin.js";
	import RULECONFIG from "@/common/ruleConfig";
	import upload_mixin from "@/mixins/upload-mixin.js";
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
	function _extends(obj) {
	    return JSON.parse(JSON.stringify(obj));
	}
	export default {
		name: "production-accident-add",
		mixins: [request_mixin, formatter_mixin, upload_mixin],
		props: {
			isLook: {
				type: Boolean,
				default: false
			}
		},
		components: {},
		data() {
			return {
				loading: false,
				isShow: false,
				info: {},
				isSaveLoading: false,
				id: '',
				isAdd: false,
				list: [],
				rules: {
					Title: RULECONFIG.Text("标题"),
					SecurityLevel: RULECONFIG.Select("安全等级"),
					Members: [{
						required: true,
						type: 'array',
						message: '请选择人员'
					}]
					// Context: RULECONFIG.Text("内容"),
				},
				LearningFiles: [],
				isPreview: false,
			};
		},
		computed: {
			title() {
				return this.isPreview ? '查看' : this.id ? '事件调查' : '新增'
			}
		},
		methods: {
			preview(file) {
				window.open(file.viewurl);
			},
			mediaUploadChnage(files) {
				let file = files
				file.map((item, index) => {
					item.lengths = Number(item.duration).toFixed(0)
					item.order = index
				})
			},
			pdfUploadChnage(files) {
				let file = files
				file.map((item, index) => {
					item.lengths = 1
					item.order = index
				})
			},
			chooseModerator(e) {
				// 选择人员
				this.$chooseTask({
					single: true,
					choosed: this.info.Members,
				}).then(data => {
					let arr = []
					this.info.Members = data.map(item => {
						arr.push(item.UserName)
						// return {
						// 	UserId: item.UserId
						// }
						return item
					})
					this.info.UserName = arr.join(',')
				});
			},
			removeItem(e) {
				this.info.Members = []
				this.info.UserName = ""
			},
			async show(item, isShow) {
				this.isShow = true;
				if (item) {
					this.loading = true
					this.id = item.NotifyId
					this.isAdd = false
					this.isPreview = isShow
					let params = {
						page: 1,
						rows: 9999,
						NotifyId: item.NotifyId
					}
					let res = await this.Post('/GetNotifyRels', params)
					if (res.status == 2000) {
						item.Members = res.data.list
						let arr = []
						if (res.data.list && res.data.list.length > 0) {
							res.data.list.map((item) => {
								arr.push(item.UserName)
							})
							item.UserName = arr.join(',')
						}

					}
					this.loading = false
					this.info = Object.assign({}, item)
					this.info.SecurityLevel = this.info.SecurityLevel.toString()
				} else {
					this.isAdd = true
					this.isPreview = false
					this.info = _extends(defaultInfo)
				}
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
				this.info = _extends(defaultInfo)
			},
			getParams() {
				let params = Object.assign({}, this.info);
				params.SecurityLevel = parseInt(params.SecurityLevel)
				return params;
			},
			async submit() {
				this.$refs.form.validate(async valid => {
					if (!valid) return;
					this.isSaveLoading = true;
					let res = await this.Post('/SaveNotify', this.getParams());
					if (res.status === 2000) {
						this.close();
						this.$emit('success');
						this.$message.success('保存成功');
					} else {
						this.$message.success(res.message);
					}
					this.isSaveLoading = false;
				})
			},
		},
		async created() {},
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	.title-box {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.production-accident-add {
		color: #000;

		.container {
			padding: 29px 35px 0px 0;
		}

		/deep/ textarea {
			height: 130px;
		}

		[disabled="disabled"] /deep/ .el-upload--text,
		[disabled="disabled"] /deep/ .el-upload-list__item:hover .el-upload-list__item-status-label,
		[disabled="disabled"] /deep/ .el-upload .el-upload--picture-card,
		[disabled="disabled"] /deep/ .el-upload-list__item-status-label {
			display: none;
		}

		/deep/ .el-divider--horizontal {
			margin: 10px 0 20px;
		}

		.el-date-editor {
			width: 100%;
		}

		.form-2-col {
			display: flex;

			>div {
				width: 50%;

				&:first-child {
					margin-right: 40px;
				}
			}
		}
	}

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