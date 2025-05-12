<template>
	<el-dialog v-dialog-drag class="production-accident-add" title="事件调查" :visible.sync="isShow" @close="close"
		width="60%" top="50px" :append-to-body="true">
		<el-scrollbar class='scrollbar' ref="scrollbar">
			<el-form :rules="rules" class="container" ref="form" :model="info">
				<el-form-item label="事故简述" prop="AccidentDescription">
					<el-input type="textarea" resize="none" v-model.trim="info.AccidentDescription"
						placeholder="当事人状态是否正常，行为是否正常，事故产生的经过描述，事故造成的损失有哪些" maxlength="500" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="事故处置情况" prop="AccidentHandlingSituation">
					<el-input type="textarea" resize="none" v-model.trim="info.AccidentHandlingSituation"
						placeholder="事故处置经过（例：谁处理、是否有保险、损失金额多少，对驾驶员的处理等）" maxlength="500" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="事故调查" prop="AccidentInvestigation">
					<el-input type="textarea" resize="none" :autosize="{ minRows: 8, maxRows: 8}"
						v-model.trim="info.AccidentInvestigation" placeholder="（一）基本情况：
当事驾驶员：XXX，身份证号：XXXXXXX，准驾车型：XX，从业资格证号：XXXX，初次领证日期：XXXX
当事车辆：XXXX ，车辆年审有效期：XXXX，车辆准牵引总质量：34570kg，道路运输证：XXXXX
（二）现场情况：
①驾驶员精神面貌（是否有疲劳驾驶）；
②现场路面状况；
③车辆状况；" maxlength="500" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="事故原因分析" prop="AccidentCauseAnalysis">
					<el-input type="textarea" resize="none" v-model.trim="info.AccidentCauseAnalysis" placeholder="【人机物法环】根据五原则报告填写
1.直接原因：
①人的不安全行为：根据gb5442-86a7规定。
②机械、物质或环境的不安全状态：根据gb5441-86a6规定。
2.间接原因：
①技术和设计上的缺陷。
②教育培训不够，缺乏安全技术知识。
③劳动组织不合理。
④对现场工作缺乏检查指导。
⑤没有安全操作规程或不健全。
⑥对事故隐患整改不力，没有落实事故防X措施等。" maxlength="500" show-word-limit :autosize="{ minRows: 12, maxRows: 12}"></el-input>
				</el-form-item>
				<el-form-item label="对事故的责任认定及事故责任人的处理建议" prop="Recommendation">
					<el-input type="textarea" resize="none" v-model.trim="info.Recommendation" placeholder="经XX车队研究决定，为了警醒全体驾驶员，从中吸取教训，并且在以后的工作中用心对待安全问题；做出以下处罚：
驾驶员XXX，在XXX事故中，负XXX（全责/主责/次责）责任，违反XXXXX，做XXXXX处理，并承担/扣罚XXXX元。" maxlength="200" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="今后的防范和整改措施建议" prop="RectificationSuggestions">
					<el-input type="textarea" resize="none" v-model.trim="info.RectificationSuggestions"
						placeholder="根据事故原因制定车队整改措施并落实。" maxlength="200" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="经办人" prop="HandledBy">
					<el-input placeholder="请选择" readonly v-model="HandledUserName" class="input-with-select">
						<template v-if="!!HandledUserName">
							<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;" slot="suffix"
								@click="removeItem()"></i>
						</template>
						<el-button slot="append" @click="chooseModerator()">选择人员</el-button>
					</el-input>
				</el-form-item>

				<el-divider></el-divider>
			</el-form>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" @click="submit()" :loading="isSaveLoading">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import formatter_mixin from "@/mixins/formatter-mixin.js";
	import RULECONFIG from "@/common/ruleConfig";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import Qs from 'qs'
	const defaultInfo = {
		EventReportInvestigateId: 0,
		EventReportId: 0,
		AccidentDescription: '',
		AccidentHandlingSituation: '',
		AccidentInvestigation: '',
		AccidentCauseAnalysis: '',
		Recommendation: '',
		RectificationSuggestions: '',
		HandledBy: []
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		name: "production-accident-add",
		mixins: [request_mixin, formatter_mixin, upload_mixin],
		components: {},
		data() {
			return {
				isShow: false,
				info: _extends(defaultInfo),
				isSaveLoading: false,
				id: '',
				isAdd: false,
				rules: {},
				LearningFiles: [],
				isPreview: false,
				HandledUserName: ''
			};
		},
		methods: {
			chooseModerator() {
				// 选择人员
				this.$chooseUser({
					single: true,
					choosed: this.info.HandledBy
				}).then(data => {
					this.HandledUserName = data.map(item => item.UserName)
					data.map(item =>{
						let obj = {
							UserId: item.UserId
						}
						this.info.HandledBy.push(obj)
					})
				});
			},
			removeItem() {
				// 删除所选人
				this.info.HandledBy = []
				this.HandledUserName = ""
			},
			async show(item) {
				this.isShow = true;
				this.HandledUserName = ""
				let res = await this.Get('/GetEventReportInvestigate?EventReportInvestigateId=' + item.EventReportInvestigateId)
				if(res.status == 2000){
					if(res.data){
						this.info = res.data
						this.info.EventReportId = item.EventReportId
						this.info.EventReportInvestigateId = item.EventReportInvestigateId
						if(res.data.HandledBy && res.data.HandledBy.length > 0){
							this.HandledUserName = res.data.HandledBy.map(item => item.UserName).join(',')
						}else {
							let User = Qs.parse(window.localStorage.getItem("userinfo"))
							this.HandledUserName = User.UserName
							this.info.HandledBy = [{
								UserId: User.UserId
							}]
						}
					}else {
						this.info = _extends(defaultInfo)
						this.info.EventReportId = item.EventReportId
						this.info.EventReportInvestigateId = item.EventReportInvestigateId
						let User = Qs.parse(window.localStorage.getItem("userinfo"))
						this.HandledUserName = User.UserName
						this.info.HandledBy = [{
							UserId: User.UserId
						}]
					}
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
				this.info = Object.assign({}, defaultInfo);
			},
			getParams() {
				let params = Object.assign({}, this.info);
				return params;
			},
			async submit() {
				this.$refs.form.validate(async valid => {
					if (!valid) return;
					this.isSaveLoading = true;
					let res = await this.Post('/SaveEventReportInvestigate', this.getParams());
					if (res.status === 2000) {
						this.close();
						this.$emit('success');
						this.$message.success('保存成功');
					} else {
						this.$message.error(res.message);
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
	.production-accident-add {
		color: #000;

		.container {
			padding: 29px 35px 38px 0;
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
</style>