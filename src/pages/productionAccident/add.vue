<template>
	<el-dialog v-dialog-drag class="production-accident-add" :title="title" :visible.sync="isShow" @close="close"
		width="60%" top="50px" :append-to-body="true">
		<el-scrollbar class='scrollbar' ref="scrollbar">
			<el-form :rules="rules" class="container" ref="form" :model="info" :disabled="isPreview">
				<div class="form-2-col">
					<el-form-item label="事件类型" prop="AccidentTypeCode">
						<el-select placeholder="事件类型" clearable v-model="info.AccidentTypeCode" style="width: 100%" :disabled="isAdd">
							<el-option v-for="(item,index) in AccidentTypeList" :key="item.id" :label="item.text"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="事件名称" prop="EventReportName">
						<el-input v-model.trim="info.EventReportName" placeholder="请输入" maxlength="40"
							show-word-limit></el-input>
					</el-form-item>
				</div>


				<div class="form-2-col">
					<el-form-item label="事故时间" prop="EventReportTime">
						<div class="el-input">
							<el-date-picker v-model="info.EventReportTime" type="date" placeholder="请选择"
								value-format="yyyy-MM-dd">
							</el-date-picker>
						</div>
					</el-form-item>
					<el-form-item label="事故地点" prop="Place">
						<el-input v-model.trim="info.Place" placeholder="请输入" maxlength="100"
							show-word-limit></el-input>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<!-- <el-form-item label="事件等级" prop="AccidentlevelCode">
						<el-select placeholder="事件等级" clearable v-model="info.AccidentlevelCode" style="width: 100%">
							<el-option v-for="(item,index) in AccidentLevelList" :key="item.id" :label="item.text"
								:value="item.id"></el-option>
						</el-select>

					</el-form-item> -->
					<el-form-item label="责任划分" prop="AccidentNatureCode">
						<el-select placeholder="责任划分" clearable v-model="info.AccidentNatureCode" style="width: 100%">
							<el-option v-for="(item,index) in AccidentList" :key="item.id" :label="item.text"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div :class="info.AccidentTypeCode == '009421' || info.AccidentTypeCode == ''? '' : 'form-2-col'">
					<el-form-item label="涉事人员" prop="ResponsibleUserId">
						<el-input placeholder="请选择" readonly v-model="info.ResponsibleUserName"
							class="input-with-select">
							<template v-if="!!info.ResponsibleUserName">
								<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
									slot="suffix" @click="removeItem(1)"></i>
							</template>
							<el-button slot="append" @click="chooseModerator()">选择人员</el-button>
						</el-input>
					</el-form-item>
					<el-form-item label="涉事车辆" v-if="info.AccidentTypeCode == '009419'" prop="VehicleId">
						<el-input placeholder="请选择" readonly v-model="info.LicensePlateNumber"
							class="input-with-select">
							<template v-if="!!info.LicensePlateNumber">
								<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
									slot="suffix" @click="removeItemCarNo()"></i>
							</template>
							<el-button slot="append" @click="chooseCar()">选择车牌</el-button>
						</el-input>
					</el-form-item>
					<el-form-item label="涉事仓库"  v-if="info.AccidentTypeCode == '009420'" prop="WarehouseSetId">
						<el-select placeholder="涉事仓库" clearable v-model="info.WarehouseSetId" style="width: 100%">
							<el-option v-for="(item, index) in warehouseList" :key="index" :label="item.WarehouseName"
								:value="item.WarehouseSetId"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<el-form-item label="死亡人数" prop="DeathToll">
						<el-input-number v-model="info.DeathToll" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
					<el-form-item label="受伤人数" prop="GetHurtCount">
						<el-input-number v-model="info.GetHurtCount" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<el-form-item label="直接经济损失(元)" prop="DirectLossAmount">
						<el-input-number v-model="info.DirectLossAmount" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
					<el-form-item label="间接经济损失(元)" prop="IndirectLossAmount">
						<el-input-number v-model="info.IndirectLossAmount" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<el-form-item label="理赔金额(元)" prop="LossAmount">
						<el-input-number v-model="info.LossAmount" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
					<el-form-item label="主观原因分析" prop="SubjectiveReason">
						<el-input v-model.trim="info.SubjectiveReason" placeholder="请输入" maxlength="100"
							show-word-limit></el-input>
					</el-form-item>
				</div>

				<el-form-item label="事故简述" prop="EventProcess">
					<el-input type="textarea" resize="none" v-model.trim="info.EventProcess" placeholder="请输入"
						maxlength="200" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="紧急处理措施" prop="EmergencyHandling" v-if="!id">
					<el-input type="textarea" resize="none" v-model.trim="info.EmergencyHandling" placeholder="请输入"
						maxlength="200" show-word-limit ></el-input>
				</el-form-item>
				<template v-else>
					<div style="margin-bottom: 10px;">紧急处理措施</div>
					<div  class="event-r-box" :style="{'background': info.EventReportEmergencys && info.EventReportEmergencys.length > 0 ? '' : '#F5F7FA'}">
						<template v-if="id && info.EventReportEmergencys && info.EventReportEmergencys.length > 0">
						<div v-for="(item,index) in info.EventReportEmergencys" :key="index">
							<span>{{index + 1 + '.'}}</span>
							<span style="margin-left: 5px">{{item.Content}}</span>
							<div class="name">
								<span>{{item.UserName}}</span>
								<span style="margin-left: 5px">{{item.CreateTimeDesc}}</span>
							</div>
						</div>
						</template>
					</div>
				</template>
				<el-form-item label="后续跟进措施" prop="FollowUp">
					<el-input type="textarea" resize="none" v-model.trim="info.FollowUp" placeholder="请输入"
						maxlength="200" show-word-limit></el-input>
				</el-form-item>
				<el-form-item>
					<div>
						现场照片/视频
					</div>
					<custom-upload :accept="'.mp4,.mp3,.jpeg,.png,.jpg,.gif'" @change="mediaUploadChnage"
						:file-list.sync="Files">
						<el-button type="primary" style="margin-right: 9px;">点击上传</el-button>
					</custom-upload>
				</el-form-item>
				<div class="form-2-col">
					<el-form-item label="安全等级" prop="SecurityLevel">
						<select-level v-model="info.SecurityLevel" :multiple="false"
							:value="info.SecurityLevel"></select-level>
					</el-form-item>
					<el-form-item label="事故通知" v-if="id">
						<el-input placeholder="请选择" readonly v-model="EventReportNameS"
							class="input-with-select">
							<template v-if="!!EventReportNameS">
								<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
									slot="suffix" @click="removeItem(2)"></i>
							</template>
							<el-button slot="append" @click="chooseUser()">选择人员</el-button>
						</el-input>
					</el-form-item>
				</div>
				<el-form-item label="备注" prop="Remark">
					<el-input type="textarea" resize="none" v-model.trim="info.Remark" placeholder="请输入" maxlength="200"
						show-word-limit></el-input>
				</el-form-item>
				<div class="form-2-col" v-if="info.Status == 1">
					<el-form-item label="结案人" >
						<el-input  readonly v-model="info.UpdateByName">
						</el-input>
					</el-form-item>
					<el-form-item label="结案时间">
						<el-input  readonly v-model="info.UpdateTimeDesc">
						</el-input>
					</el-form-item>
				</div>
				<!-- <div v-if="!isAdd">
					<el-form-item>
						<div>
							报告材料(只能上传PDF文件)
						</div>
						<custom-upload  @change="pdfUploadChnage" :accept="'.pdf'" :file-list.sync="info.ReportFiles">
							<el-button  type="primary">上传PDF</el-button>
						</custom-upload>
					</el-form-item>
					<el-form-item label="经办人" prop="HandledBy">
						<el-input placeholder="请选择" readonly v-model="info.HandledUserName" class="input-with-select">
							<template v-if="!!info.HandledUserName">
								<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
									slot="suffix" @click="removeItem(2)"></i>
							</template>
							<el-button slot="append" @click="chooseModerator(2)">选择人员</el-button>
						</el-input>
					</el-form-item>
					<div class="form-2-col">
						<el-form-item label="状态" prop="Status">
							<el-radio-group v-model="info.Status" style="width: 100%">
								<el-radio-button :label="0">未结案</el-radio-button>
								<el-radio-button :label="1">已结案</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</div>
				</div> -->
				<el-divider></el-divider>
			</el-form>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">{{isPreview == 1? '关闭' : '取消'}}</el-button>
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
    fileList:[],
		EnterpriseId: "", // 企业id
		DepartmentId: "", // 部门ID
		EventReportName: '', // 事件名称
		EventReportTime: '', // 发生时间  ,
		Place: '', // 发生地点  ,
		AccidentTypeCode: '', // 事件类型 ,
		AccidentlevelCode: '0001901', // 事件等级  ,
		AccidentNatureCode: '', // 责任归属  ,
		GetHurtCount: '', // 受伤人数 ,
		LossAmount: '', // 财损金额(元)  ,
		SecurityLevel: '1', // 安全等级 ,
		ResponsibleUserId: '', // 责任人 ID,
		ResponsibleUserName: '', //责任人 名字,
		VehicleId: '', // 车辆ID ,
		LicensePlateNumber: '', // 车辆名称 ,
		EventProcess: '', // 事件经过） ,
		EmergencyHandling: '', // 紧急处理措施
		FollowUp: '', // 后续跟进措施
		Remark: '', // 备注
		HandledBy: '', // 经办人
		HandledUserName: "",
		Status: 0, // 状态
		Pics: [], //视频/照片
		Videos: [],
		ReportFiles: [],
		WarehouseSetId: "",
		DeathToll: "",
		DirectLossAmount: "",
		IndirectLossAmount: "",
		LossAmount: "",
		EventReportUsers: [],

	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		name: "production-accident-add",
		mixins: [request_mixin, formatter_mixin, upload_mixin],
		components: {},
		props: ["AccidentLevelList", "AccidentList", "AccidentTypeList","warehouseList"],
		data() {
			return {
				isShow: false,
				info: _extends(defaultInfo),
				isSaveLoading: false,
				id: '',
				isAdd: false,
				rules: {
					EventReportName: RULECONFIG.Text("事件名称"),
					EventReportTime: RULECONFIG.Select("发生时间"),
					Place: RULECONFIG.Text("发生地点"),
					AccidentTypeCode: RULECONFIG.Select("事件类型"),
					// AccidentlevelCode: RULECONFIG.Select("事件等级"),
					// AccidentNatureCode: RULECONFIG.Select("责任归属"),
					SecurityLevel: RULECONFIG.Select("安全等级"),
					ResponsibleUserId: RULECONFIG.Select("责任人"),
					VehicleId: RULECONFIG.Select("车辆"),
					EventProcess: RULECONFIG.Text("事件经过"),
					HandledBy: RULECONFIG.Text("经办人"),
					Status: RULECONFIG.Select("状态"),
					WarehouseSetId: RULECONFIG.Select("仓库"),
				},
				LearningFiles: [],
				isPreview: false,
				EventReportNameS: "",
				Files: []
			};
		},
		computed: {
			title() {
				return this.isPreview ? '查看' : this.id ? '编辑' : '新增'
			}
		},
		methods: {
      handleUpload(e){
        console.log(e,'5555555')
        let list = []
        if(e && e.length>0){
          e.forEach(item=>{
            let obj = {
              Name:item.name,
              VideoUrl:item.url,
              Size:item.size,
              Lengths:item.length,
              TotalSeconds:item.length,

            }
            list.push(obj)
          })
        }
        this.fileList = JSON.parse(JSON.stringify(list))
        console.log(this,'66666666666')
        // this.fileList.forEach(item => {
				// 	this.$set(item, 'Name', item.name);
				// 	this.$set(item, 'VideoUrl', item.url);
				// 	this.$set(item, 'Size', item.size);
				// 	this.$set(item, 'Ext', item.ext);
				// 	this.$set(item, 'CoverUrl', item.coverUrl);
				// 	this.$set(item, 'Lengths', item.lengths);
				// 	this.$set(item, 'TotalSeconds', item.lengths);
				// 	let hms = secondsToHms(parseInt(item.Lengths || 0))
				// 	this.$set(item, 'hms', hms);
				// });
      },
			mediaUploadChnage(files) {
				let file = files
				file.map((item, index) => {
					item.lengths = Number(item.duration).toFixed(0)
					item.order = index
				})
				// this.Files = file
			},
			pdfUploadChnage(files) {
				let file = files
				file.map((item, index) => {
					item.lengths = 1
					item.order = index
				})
			},
			chooseModerator() {
				// 选择人员
				this.$chooseTask({
					single: false,
				}).then(data => {
						this.info.ResponsibleUserName = data.UserName
						this.info.ResponsibleUserId = data.UserId
						this.info.EnterpriseId = data.EnterpriseId
						this.info.DepartmentId = data.DepartmentId
				});
			},
			chooseUser(){
				// 选择人员
				this.$chooseUser({
					single: true,
					choosed: this.info.EventReportUsers
				}).then(data => {
						this.EventReportNameS = data.map(item => item.UserName).join(',')
						let arr = []
						data.map(item =>{
							let obj = {
								UserId: item.UserId
							}
							arr.push(obj)
						})
						this.info.EventReportUsers = arr
				});
			},
			removeItem(e) {
				// 删除所选人员
				if (e == 1) {
					this.info.ResponsibleUserName = '';
					this.info.ResponsibleUserId = '';
					this.info.EnterpriseId = ""
					this.info.DepartmentId = ""
				} else {
					this.info.EventReportUsers = []
					this.EventReportNameS = ""
				}
			},
			chooseCar() {
				this.$chooseCar({
					single: false,
				}).then(data => {
					this.info.VehicleId = data.VehicleId
					this.info.LicensePlateNumber = data.LicensePlateNumber
				});
			},
			removeItemCarNo() {
				// 删除所选车牌
				this.info.Vehicles = []
				this.info.VehiclesName = ""
			},
			show(item, isShow) {
				this.isShow = true;
				if (item) {
					if(item.EventReportUsers && item.EventReportUsers.length > 0){
						this.EventReportNameS = item.EventReportUsers.map(item=> item.UserName).join(',')
					}else {
						this.EventReportNameS = ""
					}
					this.id = item.EventReportId
					this.isAdd = true
					this.info.ReportFiles = []
					this.info = Object.assign({}, item)
					this.Files = [...this.info.Pics,...this.info.Videos]
					if (this.info.Status == 1) {
						this.isPreview = true
					} else {
						this.isPreview = false
					}
					this.info.SecurityLevel = this.info.SecurityLevel.toString()
				} else {
					this.isAdd = false
					this.isPreview = false
					this.info = _extends(defaultInfo)
					const currentDate = new Date();
					const year = currentDate.getFullYear();
					const month = currentDate.getMonth() + 1; // 注意月份是从0开始计数的，需要加1
					const day = currentDate.getDate();
					this.info.EventReportTime = year + '-' + month + '-' + day
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
				this.EventReportNameS = ''
				this.Files = []
				this.info = Object.assign({}, defaultInfo);
			},
			getParams() {
				let params = Object.assign({}, this.info);
				params.SecurityLevel = parseInt(params.SecurityLevel)
				let arr1 = []
				let arr2 = []
				if(this.Files && this.Files.length > 0){
					this.Files.map(item => {
						// .mp4,.mp3,.jpeg,.png,.jpg,.gif
						if(item.ext == 'jpeg' || item.ext == 'png' || item.ext == 'jpg' || item.ext == 'gif'){
							arr1.push(item)
						}else {
							arr2.push(item)
						}
					})
				}
				params.Pics = arr1
				params.Videos = arr2
				return params;
			},
			async ready(){
				this.isSaveLoading = true;
				let res = await this.Post('/SaveEventReport', this.getParams());
				if (res.status === 2000) {
					this.close();
					this.$emit('success');
					this.$message.success('保存成功');
				} else {
					this.$message.error(res.message);
				}
				this.isSaveLoading = false;
			},
			submit() {
				this.$refs.form.validate(async valid => {
					if (!valid) return;
					if(this.info.EventReportUsers && this.info.EventReportUsers.length > 0){
						this.ready()
					}else {
						this.$confirm('是否添加事故通知人员?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							return false
						}).catch(() => {
							this.ready()
						})
					}
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
	.event-r-box {
		padding: 10px;
		border: 1px solid #DCDFE6;
		text-align: justify;
		min-height: 120px;
		border-radius: 3px;
		.name {
			text-align: right;
			margin-bottom: 5px;
		}
	}
</style>
