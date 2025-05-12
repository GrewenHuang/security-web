<template>
	<el-dialog v-dialog-drag class="production-accident-add" :title="title" :visible.sync="isShow" @close="close"
		:width="widthStyle" top="50px" :append-to-body="true">
		<el-scrollbar class='scrollbar' ref="scrollbar">
			<div id="job-pdf">
				<el-form :rules="rules" class="container" ref="form" :model="info" :disabled="isPreview">
					<div class="form-3-col">
						<el-form-item label="企业/部门" prop="DepartmentId">
							<!-- <el-input v-model.trim="info.DepartmentName" placeholder="请输入部门名称" maxlength="40"
								show-word-limit></el-input> -->
							<!-- <el-select placeholder="部门" clearable v-model="info.DepartmentName" style="width: 100%"
								v-if="!isPreview">
								<el-option label="华恒" value="华恒"></el-option>
							</el-select>
							<div class="look-box" v-else>
								<span>
									{{info.DepartmentName}}
								</span>
							</div> -->
							<div class="e-d-box">
								<div style="width: 49%">
									<select-enterpirse clearable placeholder="企业" collapseTags
										v-model="info.EnterpriseId" v-if="!isPreview"></select-enterpirse>
									<div class="look-box" v-else>
										<span>
											{{info.EnterpriseName}}
										</span>
									</div>
								</div>
								<div style="width: 49%">
									<cascader-department v-if="!isPreview" placeholder="部门" clearable
										v-model="info.DepartmentId" :enterpriseId="info.EnterpriseId"
										:disabled="!info.EnterpriseId ? true : false"></cascader-department>
									<div class="look-box" v-else>
										<span>
											{{info.DepartmentName}}
										</span>
									</div>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="工序No" prop="ProductionProcessesNo">
							<div class="el-input" v-if="!isPreview">
								<el-input v-model.trim="info.ProductionProcessesNo" placeholder="请输入工序No" maxlength="40"
									show-word-limit></el-input>
							</div>
							<div class="look-box" v-else>
								<span>
									{{info.ProductionProcessesNo}}
								</span>
							</div>
						</el-form-item>
						<el-form-item label="工序名" prop="ProductionProcessesName">
							<div class="el-input" v-if="!isPreview">
								<el-input v-model.trim="info.ProductionProcessesName" placeholder="请输入工序名"
									maxlength="40" show-word-limit></el-input>
							</div>
							<div class="look-box" v-else>
								<span>{{info.ProductionProcessesName}}</span>
							</div>
						</el-form-item>
					</div>
					<div class="form-3-col">
						<el-form-item label="业务名称" prop="BusinessName">
							<el-input v-model.trim="info.BusinessName" placeholder="请输入业务名称" maxlength="100"
								show-word-limit v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.BusinessName}}</span>
							</div>
						</el-form-item>
						<el-form-item label="作业No" prop="OperationNo">
							<el-input v-model.trim="info.OperationNo" placeholder="请输入作业No" maxlength="100"
								show-word-limit v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.OperationNo}}</span>
							</div>
						</el-form-item>
						<el-form-item label="作业名" prop="OperationName">
							<el-input v-model.trim="info.OperationName" placeholder="请输入作业名" maxlength="100"
								show-word-limit v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.OperationName}}</span>
							</div>
						</el-form-item>
					</div>
					<div class="form-3-col">
						<el-form-item label="版本号" prop="Verson">
							<el-input v-model.trim="info.Verson" placeholder="请输入版本号" maxlength="100" show-word-limit
								v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.Verson}}</span>
							</div>
						</el-form-item>
						<el-form-item label="管理No" prop="ManageNo">
							<el-input v-model.trim="info.ManageNo" placeholder="请输入管理No" maxlength="100" show-word-limit
								v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.ManageNo}}</span>
							</div>
						</el-form-item>
						<el-form-item label="安全等级" prop="SecurityLevel">
							<select-level v-model="info.SecurityLevel" :multiple="false" :value="info.SecurityLevel"
								v-if="!isPreview"></select-level>
							<div class="look-box" v-else>
								<span>{{info.SecurityLevel? info.SecurityLevel + '级' : ''}}</span>
							</div>
						</el-form-item>
					</div>
					<div class="f-b-c">
						<div class="title">作业步骤</div>
						<div style="display: flex;justify-content: flex-end;">
							<div>
								<el-button type="primary" @click="addJob()" v-if="!isPreview">新增</el-button>
							</div>
						</div>
					</div>
					<el-table border :data="info.OperationStepList" :header-cell-style="$tableStyle"
						style="margin-top: 10px">
						<el-table-column label="序号" type="index" align="center" header-align="center" width="50">
						</el-table-column>
						<el-table-column label="作业顺序" align="center" width="200" v-if="!isPreview">
							<template slot-scope="{ row , $index}">
								<!-- <el-input v-model="row.OperationStepName"></el-input> -->
								<customEditor class="el-input" placeholder="请输入" v-model="row.OperationStepName"
									:isTitle="false" />
							</template>
						</el-table-column>
						<el-table-column label="作业顺序" align="center" v-else width="200">
							<template slot-scope="{ row , $index}">
								<div class="look-box" v-html="row.OperationStepName"></div>
							</template>
						</el-table-column>
						<el-table-column label="安全+品质要点" align="center" v-if="!isPreview">
							<template slot-scope="{ row , $index}">
								<!-- <el-input type="textarea" v-model="row.PointDesc"
									:autosize="{ minRows: 2, maxRows: 6}"></el-input> -->
								<customEditor class="el-input" placeholder="请输入" v-model="row.PointDesc"
									:isTitle="false" />
							</template>
						</el-table-column>
						<el-table-column label="安全+品质要点" align="center" v-else>
							<template slot-scope="{ row , $index}">
								<div class="look-box" v-html="row.PointDesc"></div>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="150" align="center" v-if="!isPreview">
							<template slot-scope="{ row , $index}">
								<el-button type="text" @click="moveUp(row, $index, 1)" v-if="$index != 0">上移</el-button>
								<el-button type="text" @click="Down(row, $index, 1)"
									v-if="$index != info.OperationStepList.length - 1">下移</el-button>
								<el-button type="text" @click="removeJob(row, $index, 1)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-form-item>
						<div class="title" style="margin: 15px 0">
							图解
						</div>
						<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
							:fileList.sync="info.IllustrationList" list-type="picture-card" v-if="!isPreview">
							<i class="el-icon-plus"></i>
						</custom-upload>
						<div v-else>
							<div v-for="(item,index) in info.IllustrationList" style="display: inline;">
								<el-image style="width:148px;height:148px;border-radius: 6px;margin-right: 8px"
									:preview-src-list="imageList" :z-index='9999' :src="item.url" :key="index">
								</el-image>
							</div>
						</div>
					</el-form-item>
					<div>
						<el-form-item prop="zp" v-if="info.Ticket">
							<div class="title" style="margin: 15px 0">
								使用账票
							</div>
							<div class="setting-item1">
								<!-- 	<div class="custom-input" v-for="(cItem, cIndex) in (info.zp || [])" :key="cIndex">
									<el-input type="text" placeholder="请输入" v-model="cItem.ItemName"></el-input>
									<i class="remove el-icon-delete-solid" @click="info.zp.splice(cIndex, 1)"></i>
								</div>
								<div class="add-btn" @click="add()">+ 添加输入项</div> -->
								<el-input type="text" placeholder="请输入使用账票" v-model="info.Ticket"
									v-if="!isPreview"></el-input>
								<div class="look-box" v-else>
									<span>{{info.Ticket}}</span>
								</div>
							</div>
							<customUploadDrag @onUpload="TicketListChnage" style="margin-top: 15px;width: 50%"
								:Data.sync="info.TicketList" :showFileList="false" v-if="!isPreview"
								:acceptList="['png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'pdf']">
								<div class="f-c-c">
									<i class="el-icon-upload"
										style="margin-right: 5px !important;color:#959595 !important;"></i>
									<div class="el-upload__text">
										将文件拖到此处或<em>点击上传</em>
									</div>
								</div>
							</customUploadDrag>
							<div class="file-list" v-for="(item, index) in info.TicketList" :key="index">
								<div class="file-item">
									<div class="file f-b-c">
										<div class="f">
											<img style="width:30px;height:30px;margin-right: 13px;"
												:src="$fileIcons[item.name.substring(item.name.lastIndexOf('.') + 1)]" />
											<div class="text">
												<div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.name}}
												</div>
												<div
													style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">
													{{ item.size | formatSize}}
												</div>
											</div>
										</div>
										<div v-if="!isPreview">
											<i class="el-icon-error cursor-p"
												@click="info.TicketList.splice(index, 1)"></i>
										</div>
									</div>
									<div></div>
								</div>
							</div>
						</el-form-item>
					</div>
					<div>
						<el-form-item v-if="info.Device">
							<div class="title" style="margin: 15px 0">
								设备/夹具/测量用具
							</div>
							<div class="setting-item1">
								<!-- <div class="custom-input" v-for="(cItem, cIndex) in (info.gj || [])" :key="cIndex">
									<el-input type="text" placeholder="请输入" v-model="cItem.ItemName"></el-input>
									<i class="remove el-icon-delete-solid" @click="info.gj.splice(cIndex, 1)"></i>
								</div>
								<div class="add-btn" @click="addGj()">+ 添加输入项</div> -->
								<el-input type="text" placeholder="请输入设备/夹具/测量用具" v-model="info.Device"
									v-if="!isPreview"></el-input>
								<div class="look-box" v-else>
									<span>{{info.Device}}</span>
								</div>
							</div>
							<customUploadDrag @onUpload="pdfUploadChnage" style="margin-top: 15px;width: 50%"
								:Data.sync="info.DeviceList" :showFileList="false" v-if="!isPreview"
								:acceptList="['png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'pdf']">
								<div class="f-c-c">
									<i class="el-icon-upload"
										style="margin-right: 5px !important;color:#959595 !important;"></i>
									<div class="el-upload__text">
										将文件拖到此处或<em>点击上传</em>
									</div>
								</div>
							</customUploadDrag>
							<div class="file-list" v-for="(item, index) in info.DeviceList" :key="index">
								<div class="file-item">
									<div class="file f-b-c">
										<div class="f">
											<img style="width:30px;height:30px;margin-right: 13px;"
												:src="$fileIcons[item.name.substring(item.name.lastIndexOf('.') + 1)]" />
											<div class="text">
												<div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.name}}
												</div>
												<div
													style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">
													{{ item.size | formatSize}}
												</div>
											</div>
										</div>
										<div v-if="!isPreview">
											<i class="el-icon-error cursor-p"
												@click="info.DeviceList.splice(index, 1)"></i>
										</div>
									</div>
									<div></div>
								</div>
							</div>
						</el-form-item>
						<div v-if="info.LabourIds && info.LabourIds.length > 0">
							<div class="title" style="margin: 15px 0">
								劳保用品
							</div>
							<el-form-item prop="LabourIds">
								<el-checkbox-group v-model="info.LabourIds">
									<el-checkbox-button v-for="(item,index) in laborList" :label="item.LabourId"
										:key="index">
										<img :src="item.Icon" alt="" style="width: 25px;height: 25px">
										<p>{{item.LabourName}}</p>
									</el-checkbox-button>
								</el-checkbox-group>
							</el-form-item>
						</div>
					</div>
					<!-- <el-form-item>
						<div class="title" style="margin: 15px 0">
							选择通知人员
						</div>
						<div class="setting-item1" v-if="!isPreview">
							<el-input placeholder="请选择" readonly v-model="EventReportNameS" class="input-with-select">
								<template v-if="!!EventReportNameS">
									<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
										slot="suffix" @click="removeItem()"></i>
								</template>
								<el-button slot="append" @click="chooseUser()">选择人员</el-button>
							</el-input>
						</div>
						<div class="look-box" v-else>
							<span>{{info.EventReportNameS}}</span>
						</div>
					</el-form-item> -->
					<div class="setting-item">
						<el-form-item label="批准人" prop="Approver">
							<el-input v-if="!isPreview" placeholder="请选择" readonly v-model="info.ApproverName"
								class="input-with-select">
								<template v-if="!!info.ApproverName">
									<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
										slot="suffix" @click="removeItem(1)"></i>
								</template>
								<el-button slot="append" @click="chooseModerator(1)">选择人员</el-button>
							</el-input>
							<div class="look-box" v-else>
								<span>{{info.ApproverName}}</span>
							</div>
							<!-- <el-input type="text" placeholder="请输入批准人" v-model="info.Approver"
								v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.Approver}}</span>
							</div> -->
						</el-form-item>
						<el-form-item label="批准时间">
							<el-date-picker v-model="info.ApproveTime" style="width: 100%;" type="datetime"
								placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss" v-if="!isPreview">
							</el-date-picker>
							<div class="look-box" v-else>
								<span>{{info.ApproveTime | format('yyyy-MM-dd HH:mm:ss')}}</span>
							</div>
						</el-form-item>
						<el-form-item label="确认人" prop="ConfirmedBy">
							<el-input v-if="!isPreview" placeholder="请选择" readonly v-model="info.ConfirmedByName"
								class="input-with-select">
								<template v-if="!!info.ConfirmedByName">
									<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
										slot="suffix" @click="removeItem(2)"></i>
								</template>
								<el-button slot="append" @click="chooseModerator(2)">选择人员</el-button>
							</el-input>
							<div class="look-box" v-else>
								<span>{{info.ConfirmedByName}}</span>
							</div>
							<!-- 	<el-input type="text" placeholder="请输入确认人" v-model="info.ConfirmedBy"
								v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.ConfirmedBy}}</span>
							</div> -->
						</el-form-item>
						<el-form-item label="确认时间">
							<el-date-picker v-model="info.ConfirmedTime" style="width: 100%;" type="datetime"
								placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss" v-if="!isPreview">
							</el-date-picker>
							<div class="look-box" v-else>
								<span>{{info.ConfirmedTime | format('yyyy-MM-dd HH:mm:ss')}}</span>
							</div>
						</el-form-item>
					</div>
					<div class="setting-item">
						<el-form-item label="审核人" prop="ReviewedBy">
							<el-input v-if="!isPreview" placeholder="请选择" readonly v-model="info.ReviewedByName"
								class="input-with-select">
								<template v-if="!!info.ReviewedByName">
									<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
										slot="suffix" @click="removeItem(3)"></i>
								</template>
								<el-button slot="append" @click="chooseModerator(3)">选择人员</el-button>
							</el-input>
							<div class="look-box" v-else>
								<span>{{info.ReviewedByName}}</span>
							</div>
							<!-- <el-input type="text" placeholder="请输入审核人" v-model="info.ReviewedBy"
								v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.ReviewedBy}}</span>
							</div> -->
						</el-form-item>
						<el-form-item label="审核时间">
							<el-date-picker v-model="info.ReviewedTime" style="width: 100%;" type="datetime"
								placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss" v-if="!isPreview">
							</el-date-picker>
							<div class="look-box" v-else>
								<span>{{info.ReviewedTime | format('yyyy-MM-dd HH:mm:ss')}}</span>
							</div>
						</el-form-item>
						<el-form-item label="作成人" prop="BedoneBy">
							<el-input v-if="!isPreview" placeholder="请选择" readonly v-model="info.BedoneByName"
								class="input-with-select">
								<template v-if="!!info.BedoneByName">
									<i class="el-icon-error cursor-p f--c" style="height: 100%;line-height: 40px;"
										slot="suffix" @click="removeItem(4)"></i>
								</template>
								<el-button slot="append" @click="chooseModerator(4)">选择人员</el-button>
							</el-input>
							<div class="look-box" v-else>
								<span>{{info.BedoneByName}}</span>
							</div>
							<!-- <el-input type="text" placeholder="请输入作成人" v-model="info.BedoneBy"
								v-if="!isPreview"></el-input>
							<div class="look-box" v-else>
								<span>{{info.BedoneBy}}</span>
							</div> -->
						</el-form-item>
						<el-form-item label="作成时间" prop="BedoneTime">
							<el-date-picker v-model="info.BedoneTime" style="width: 100%;" type="datetime"
								placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss" v-if="!isPreview">
							</el-date-picker>
							<div class="look-box" v-else>
								<span>{{info.BedoneTime | format('yyyy-MM-dd HH:mm:ss')}}</span>
							</div>
						</el-form-item>
					</div>
					<el-divider></el-divider>
				</el-form>
			</div>
		</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button type="warning" :loading="exportLoading" @click="exportData()"
				v-if="isPreview && $_has('EXPORTPDF')">导出PDF</el-button>
			<template v-if="isType == 'edit'">
				<el-button @click.native="close()">{{isPreview? '关闭' : '取消'}}</el-button>
				<el-button type="primary" @click="submit()" :loading="isSaveLoading" v-if="!isPreview">保存</el-button>
			</template>
			<template v-if="isType == 'emx'">
				<!-- <el-button @click.native="examine(-1)">驳回</el-button> -->
				<el-button @click.native="close()">{{isPreview? '关闭' : '取消'}}</el-button>
				<el-button type="primary" @click="examine(0)" :loading="isSaveLoading">提交</el-button>
			</template>
		</div>
	</el-dialog>
</template>

<script>
	import Qs from "qs";
	import request_mixin from "@/mixins/request-mixin.js";
	import formatter_mixin from "@/mixins/formatter-mixin.js";
	import RULECONFIG from "@/common/ruleConfig";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import customEditor from '@/components/common/custom-editor.vue';
	import {
		Pdf
	} from '@/plugins/htmlToPdf';
	const defaultInfo = {
		DepartmentId: "",
		DepartmentName: "", //部门名称
		EnterpriseId: "",
		EnterpriseName: "",
		ProductionProcessesNo: "", //工序No
		ProductionProcessesName: "", //工序名
		BusinessName: "", //业务名称
		OperationNo: "", //作业No
		OperationName: "", //作业名
		Verson: "", //版本号
		ManageNo: "", //管理No
		SecurityLevel: '1', //安全等级
		OperationStep: "", //作业步骤Json
		Ticket: "", //使用账票
		Device: "", //设备/夹具/测量用具
		LabourIds: [], //劳保用品Ids,用逗号隔开
		Approver: "", //批准人
		ApproverName: "",
		ApproveTime: null, //批准时间
		ConfirmedBy: "", //确认人
		ConfirmedByName: "",
		ConfirmedTime: null, //确认时间
		ReviewedBy: "", //审核人
		ReviewedByName: "",
		ReviewedTime: null, //审核时间
		BedoneBy: Qs.parse(window.localStorage.getItem("userinfo")).UserId,
		BedoneByName: Qs.parse(window.localStorage.getItem("userinfo")).UserName, //作成人
		BedoneTime: null, //作成时间
		OperationStepList: [],
		IllustrationList: [], //图解listt
		TicketList: [], //账票list
		DeviceList: [], //设备/夹具/测量用具 list
		OperationStandardDesignUsers: []
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		name: "job-index",
		mixins: [request_mixin, formatter_mixin, upload_mixin],
		components: {
			customEditor
		},
		data() {
			const validator = (rule, value, callback) => {
				if (this.status == 1 && !value.length) {
					let message = rule.message1;
					setTimeout(() => {
						this.$message.warning(message)
					}, 100 * rule.index);
					callback(new Error(message))
				} else if (!!value.length) {
					for (let i = 0; i < value.length; i++) {
						let item = value[i];
						if (!item.ItemName) {
							let message1 = '还有添加项未输入内容';
							setTimeout(() => {
								this.$message.warning(message1)
							}, 100 * rule.index);
							callback(new Error(message1))
							break;
						}
					}
					callback();
				} else {
					callback();
				}
			}
			return {
				laborList: [],
				exportLoading: false,
				isShow: false,
				info: _extends(defaultInfo),
				isSaveLoading: false,
				id: '',
				rules: {

				},
				LearningFiles: [],
				isPreview: false,
				EventReportNameS: "",
				isType: "",
				widthStyle: "80%"
			};
		},
		computed: {
			title() {
				return this.isPreview ? '查看' : this.id ? '编辑' : '新增'
			},
			imageList() {
			    return this.info.IllustrationList.map(item => item.url);
			}
		},
		methods: {
			chooseUser() {
				// 选择人员
				this.$chooseUser({
					single: true,
					choosed: this.info.OperationStandardDesignUsers
				}).then(data => {
					this.EventReportNameS = data.map(item => item.UserName).join(',')
					let arr = []
					data.map(item => {
						let obj = {
							UserId: item.UserId
						}
						arr.push(obj)
					})
					this.info.OperationStandardDesignUsers = arr
				});
			},
			// removeItem(e) {
			// 	// 删除所选人员
			// 	this.info.OperationStandardDesignUsers = []
			// 	this.EventReportNameS = ""
			// },
			pdfUploadChnage(files) {
				let file = files
				file.map((item, index) => {
					item.lengths = 1
					item.order = index
				})
			},
			TicketListChnage(files) {
				let file = files
				file.map((item, index) => {
					item.lengths = 1
					item.order = index
				})
			},
			cancelForm() {
				this.$refs.form.clearValidate()
			},
			exportData() {
				this.cancelForm()
				let loading = this.$loading({
					lock: true,
					text: '正在导出,请勿关闭当前页面',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.exportLoading = true;
				this.$nextTick(() => {
					Pdf.downPdf('job-pdf', '作业标准').then(res => {
						this.exportLoading = false;
						loading.close();
					})
				})
			},
			addJob() {
				this.info.OperationStepList.push({
					OperationStepName: "",
					PointDesc: "",
					Sort: 0
				})
			},
			removeJob(item, index) {
				this.info.OperationStepList.splice(index, 1)
			},
			moveUp(item, index) {
				if (index === 0) {
					this.$message.error('已经是第一行')
					return
				}
				this.info.OperationStepList.splice(index - 1, 0, item);
				this.info.OperationStepList.splice(index + 1, 1);
			},
			Down(item, index) {
				if (index === this.info.OperationStepList.length - 1) {
					this.$message.error('已到最后一行')
					return
				}
				this.info.OperationStepList.splice(index + 2, 0, item);
				this.info.OperationStepList.splice(index, 1);
			},
			add() {
				this.info.zp.push({
					ItemName: ''
				})
			},
			addGj() {
				this.info.gj.push({
					ItemName: ''
				})
			},
			chooseModerator(e) {
				// 选择人员
				this.$chooseTask({
					single: false,
				}).then(data => {
					if (e == 1) {
						this.info.ApproverName = data.UserName
						this.info.Approver = data.UserId
						this.info.ApproveTime = ""
						// this.info.EnterpriseId = data.EnterpriseId
						// this.info.DepartmentId = data.DepartmentId
					} else if (e == 2) {
						this.info.ConfirmedByName = data.UserName
						this.info.ConfirmedBy = data.UserId
						this.info.ConfirmedTime = ""
					} else if (e == 3) {
						this.info.ReviewedByName = data.UserName
						this.info.ReviewedBy = data.UserId
						this.info.ReviewedTime = ""
					} else if (e == 4) {
						this.info.BedoneByName = data.UserName
						this.info.BedoneBy = data.UserId
						this.info.BedoneTime = ""

					}
				});
			},
			isRules() {
				this.rules = {
					DepartmentId: RULECONFIG.Text("企业/部门"),
					ProductionProcessesNo: RULECONFIG.Text("工序No"),
					ProductionProcessesName: RULECONFIG.Text("工序名"),
					BusinessName: RULECONFIG.Text("业务名称"),
					OperationNo: RULECONFIG.Text("作业No"),
					OperationName: RULECONFIG.Text("作业名"),
					Verson: RULECONFIG.Text("版本号"),
					ManageNo: RULECONFIG.Text("管理No"),
					BedoneBy: RULECONFIG.Text("作成人"),
					BedoneTime: RULECONFIG.Select("作成时间"),
					Approver: RULECONFIG.Select("批准人"),
					ConfirmedBy: RULECONFIG.Select("确认人"),
					ReviewedBy: RULECONFIG.Select("审核人"),
				}
				this.widthStyle = "80%"
			},
			removeItem(e) {
				// 删除所选人员
				if (e == 1) {
					this.info.ApproverName = ''
					this.info.Approver = ''
					this.info.ApproveTime = ""
					// this.info.EnterpriseId = data.EnterpriseId
					// this.info.DepartmentId = data.DepartmentId
				} else if (e == 2) {
					this.info.ConfirmedByName = ''
					this.info.ConfirmedBy = ''
					this.info.ConfirmedTime = ""
				} else if (e == 3) {
					this.info.ReviewedByName = ''
					this.info.ReviewedBy = ''
					this.info.ReviewedTime = ""
				} else if (e == 4) {
					this.info.BedoneByName = ''
					this.info.BedoneBy = ''
					this.info.BedoneTime = ""
				}
			},
			copy(item, type) {
				this.isShow = true;
				this.isType = type
				this.id = item.OperationStandardId
				this.isRules()
				if (item) {
					if (item.OperationStandardDesignUsers && item.OperationStandardDesignUsers.length > 0) {
						this.EventReportNameS = item.OperationStandardDesignUsers.map(item => item.UserName).join(',')
					} else {
						item.OperationStandardDesignUsers = []
						this.EventReportNameS = ""
					}
					item.BedoneTime = item.BedoneTimeDesc ? item.BedoneTimeDesc : ''
					item.ApproveTime = item.ApproveTimeDesc ? item.ApproveTimeDesc : ''
					item.ConfirmedTime = item.ConfirmedTimeDesc ? item.ConfirmedTimeDesc : ''
					item.ReviewedTime = item.ReviewedTimeDesc ? item.ReviewedTimeDesc : ''
					this.isPreview = false
					this.info.ReportFiles = []
					this.info = Object.assign({}, item)
					this.info.SecurityLevel = this.info.SecurityLevel.toString()
					if (this.info.LabourIds && this.info.LabourIds.length > 0) {
						this.info.LabourIds = this.info.LabourIds.split(',').map(item => parseInt(item))
					} else {
						this.info.LabourIds = []
					}
					this.info.IsRelease = 0
					this.info.Status = 0
					this.info.OperationStandardId = 0
				}
				this.$nextTick(() => {
					this.cancelForm()
					this.$refs.scrollbar.wrap.scrollTop = 0
				});
			},
			show(item, Boolean, type) {
				this.isShow = true;
				this.isType = type
				if (item) {
					this.id = item.OperationStandardId
					this.isPreview = Boolean
					if (item.OperationStandardDesignUsers && item.OperationStandardDesignUsers.length > 0) {
						this.EventReportNameS = item.OperationStandardDesignUsers.map(item => item.UserName).join(',')
					} else {
						item.OperationStandardDesignUsers = []
						this.EventReportNameS = ""
					}
					if (type == 'emx') {
						item.ApproveTime = ''
						item.ConfirmedTime = ''
						item.ReviewedTime = ''
						item.BedoneTime = item.BedoneTimeDesc ? item.BedoneTimeDesc : ''
						this.isRules()
					} else if (type == 'edit') {
						item.BedoneTime = item.BedoneTimeDesc ? item.BedoneTimeDesc : ''
						item.ApproveTime = item.ApproveTimeDesc ? item.ApproveTimeDesc : ''
						item.ConfirmedTime = item.ConfirmedTimeDesc ? item.ConfirmedTimeDesc : ''
						item.ReviewedTime = item.ReviewedTimeDesc ? item.ReviewedTimeDesc : ''
						this.isRules()
					} else {
						this.widthStyle = "900px"
						this.rules = {}
					}
					this.info.ReportFiles = []
					this.info = Object.assign({}, item)
					this.info.SecurityLevel = this.info.SecurityLevel.toString()
					if (this.info.LabourIds && this.info.LabourIds.length > 0) {
						this.info.LabourIds = this.info.LabourIds.split(',').map(item => parseInt(item))
					} else {
						this.info.LabourIds = []
					}
				} else {
					this.isPreview = false
					this.info = _extends(defaultInfo)
					this.isRules()
				}
				this.$nextTick(() => {
					this.cancelForm()
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
				if (this.isType == 'edit') {
					params.ApproveTime = ""
					params.ConfirmedTime = ""
					params.ReviewedTime = ""
				}
				params.OperationStep = JSON.stringify(params.OperationStepList)
				params.SecurityLevel = parseInt(params.SecurityLevel)
				params.LabourIds = params.LabourIds.join(',')
				if (params.Status == -1) {
					params.Status = 0
				}
				return params;
			},
			async examine(type) {
				this.$refs.form.validate(async valid => {
					if (!valid) return;
					this.isSaveLoading = true;
					let params = Object.assign({}, this.info);
					params.OperationStep = JSON.stringify(params.OperationStepList)
					params.SecurityLevel = parseInt(params.SecurityLevel)
					params.LabourIds = params.LabourIds.join(',')
					params.Status = type
					let res = await this.Post('/SaveOperationStandard', params);
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
			async submit() {
				this.$refs.form.validate(async valid => {
					if (!valid) return;
					this.isSaveLoading = true;
					let res = await this.Post('/SaveOperationStandard', this.getParams());
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
		mounted() {
			let params = {
				page: 1,
				rows: 9999
			}
			this.Post("/GetLabours", params)
				.then((res) => {
					if (res.status == 2000) {
						this.laborList = res.data.list;
					}
				})

		},
	};
</script>

<style lang="scss" scoped>
	#job-pdf {
		padding-left: 10px;
	}

	/deep/.el-checkbox-button.is-disabled.is-checked .el-checkbox-button__inner {
		background-color: #4D6CEB;
		color: #fff;
	}

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

		.form-3-col {
			display: flex;

			>div {
				width: 33.33%;

				&:nth-child(2) {
					margin: 0 10px;
				}
			}
		}
	}

	.title {
		display: flex;
		align-items: center;
		font-size: 16px;
		line-height: 22px;
		font-weight: 600;

		&::before {
			content: '';
			border-radius: 2px;
			margin-right: 8px;
			width: 5px;
			height: 16px;
			background: $--color-primary;
		}
	}

	.add-btn {
		border-radius: 4px;
		border: 1px dashed #E7E8F2;
		height: 45px;
		background: #FBFDFF;
		line-height: 45px;
		text-align: center;
		cursor: pointer;
	}

	.custom-input {
		position: relative;

		&:hover {
			.remove {
				display: block;
			}
		}

		.remove {
			position: absolute;
			top: 50%;
			right: 13px;
			transform: translateY(-50%);
			font-size: 16px;
			color: #FE3F51;
			cursor: pointer;
			display: none;
		}
	}

	.setting-item {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 20px;
		width: 100%;
	}

	.setting-item1 {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		// grid-gap: 20px;
		width: 100%;
	}

	.file-list {
		margin-top: 20px;

		.file-item {
			display: flex;

			&:not(:first-child) {
				margin-bottom: 15px;
			}

			>div {
				width: 50%;
			}

			.file {
				border-radius: 4px;
				margin-right: 15px;
				padding: 11px 15px 11px 10px;
				background: #F8FAFB;
			}
		}
	}

	.look-box {
		color: #333;
		cursor: not-allowed;
		text-align: left;

		span {
			display: inline-block;
			border: 1px solid #C0C4CC;
			width: 100%;
			padding: 0 10px;
			border-radius: 3px;
			height: 40px;
			line-height: 40px;
		}
	}

	.e-d-box {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
</style>