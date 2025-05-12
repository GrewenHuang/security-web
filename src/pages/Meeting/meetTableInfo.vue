<template>
	<div class="meet-type-info">
		<el-dialog v-dialog-drag :title="edits.dialogEditTitle" :visible.sync="edits.dialogEditShow"
			:close-on-click-modal="false" @close="dialogEditClose()" top="8vh" width="50%">
			<el-scrollbar class="scrollbar" ref="scrollbar">
				<el-form class="form-content" :rules="edits.rules" ref="editsform" :model="edits.Data"
					label-position="top">
					<div class="f">
						<el-form-item label="企业" prop="EnterpriseId" class="f1">
							<select-enterpirse clearable placeholder="企业" v-model="edits.Data.EnterpriseId"
								@clear="edits.Data.DepartmentId = ''"
								v-if="isEdits == 1 || isEdits == 3"></select-enterpirse>
							<el-input v-model="edits.Data.EnterpriseName" disabled v-else></el-input>
						</el-form-item>
						<el-form-item label="部门" prop="DepartmentId" class="f1 w50 ml20">
							<cascader-department v-if="isEdits == 1 || isEdits == 3" placeholder="部门" clearable
								v-model="edits.Data.DepartmentId" :enterpriseId="edits.Data.EnterpriseId"
								:disabled="!edits.Data.EnterpriseId ? true : false"></cascader-department>
							<el-input v-model="edits.Data.DepartmentName" disabled v-else></el-input>
						</el-form-item>
					</div>
					<div class="f">
						<el-form-item class="f1" label="会议方式" prop="SafetyMeetingType">
							<ZYselect url="GetMeetingTypeCom" placeholder="请选择" propid="id" propname="text"
								v-model="edits.Data.SafetyMeetingType" :disabled="isEdits == 1 || isEdits == 3? false : true"/>
						</el-form-item>
						<el-form-item class="f1 w50 ml20" label="会议类型" prop="MeetingTypeCode">
							<el-select v-model="edits.Data.MeetingTypeCode" placeholder="请选择">
								<el-option v-for="(item, i) in MeetingType" :key="i" :label="item.text"
									:value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="f">
						<el-form-item label="会议议题" prop="Topics" class="f1">
							<el-input v-model="edits.Data.Topics" maxlength="100" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="安全等级" prop="SecurityLevel" class="f1 w50 ml20">
							<select-level v-model="edits.Data.SecurityLevel" :multiple="false"
								:value="edits.Data.SecurityLevel"></select-level>
						</el-form-item>
					</div>
					<el-form-item label="会议内容"  v-if="edits.Data.SafetyMeetingType != '3'">
						<el-input type="textarea" v-model="edits.Data.Content" maxlength="1000" rows="8"
							show-word-limit></el-input>
					</el-form-item>

					<!-- 线下会议 -->
					<!-- <template v-if="edits.Data.SafetyMeetingType == '2' && 0">
							<el-collapse v-model="collapseActive">
								<el-collapse-item v-for="(item, i) in edits.Data.SafetyMeetingSessions" :key="i"
									:name="i">
									<div slot="title" class="f-b-c f1">
										<span>场次{{ i + 1 }}</span>
										<div class="f--c operation">
											<div class="switch" :class="{open: collapseActive.includes(i)}">
												{{ collapseActive.includes(i) ? '收起' : '展开' }}
											</div>
											<div @click="del(i)" v-if="i > 0">删除</div>
										</div>
									</div>
									<div class="text item">
										{{item.SessionTime}}
										<el-form-item label="会议时间" :rules="
                                                edits.rules.SessionTime
                                            " :prop="
                                                'SafetyMeetingSessions.' +
                                                i +
                                                '.SessionTime'
                                            ">
											<el-date-picker type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
												v-model="
                                                    item.SessionTime
                                                " range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
											</el-date-picker>
										</el-form-item>
										<div class="f-b-c">
											<el-form-item class="f1 w50" label="会议主持人" :rules="
                                                    edits.rules
                                                        .ModeratorUserId
                                                " :prop="
                                                    'SafetyMeetingSessions.' +
                                                    i +
                                                    '.ModeratorUserId'
                                                ">
												<el-input placeholder="请选择" readonly v-model="item.ModeratorUserName"
													class="input-with-select">
													<template v-if="!!item.ModeratorUserName">
														<i class="el-icon-error cursor-p f--c"
															style="height: 100%;line-height: 40px;" slot="suffix"
															@click="removeItem(item, 'ModeratorUserId', 'ModeratorUserName')"></i>
													</template>
													<el-button slot="append"
														@click="chooseModerator(item)">选择</el-button>
												</el-input>
											</el-form-item>
											<el-form-item class="f1 w59 ml20" label="会议记录人" :rules="
                                                    edits.rules
                                                        .RecorderUserId
                                                " :prop="
                                                    'SafetyMeetingSessions.' +
                                                    i +
                                                    '.RecorderUserId'
                                                ">
												<el-input placeholder="请选择" readonly v-model="item.RecorderUserName"
													class="input-with-select">
													<template v-if="!!item.RecorderUserName">
														<i class="el-icon-error cursor-p f--c"
															style="height: 100%;line-height: 40px;" slot="suffix"
															@click="removeItem(item, 'RecorderUserId', 'RecorderUserName')"></i>
													</template>
													<el-button slot="append"
														@click="chooseRecorder(item)">选择</el-button>
												</el-input>
											</el-form-item>
										</div>
										<el-form-item :rules="
                                                edits.rules
                                                    .SafetyMeetingPersonnelNew
                                            " :prop="
                                                'SafetyMeetingSessions.' +
                                                i +
                                                '.SafetyMeetingPersonnelNew'
                                            ">
											<div class="f-b-c" style="margin-bottom: 10px;">
												<div class="required">参会人员</div>
												<el-button type="primary"
													@click="chooseUser(item.SafetyMeetingPersonnelNew, item.SafetyMeetingPersonnels)">选择参与人员</el-button>
											</div>
											<el-table :data="item.SafetyMeetingPersonnelNew" highlight-current-row
												:header-cell-style="$tableStyle" style="width: 100%">
												<el-table-column type="index" label="序号" align="center" width="60">
												</el-table-column>
												<el-table-column label="姓名" align="center" prop="UserName">
												</el-table-column>
												<el-table-column label="手机号" align="center" prop="Tel">
												</el-table-column>
												<el-table-column label="操作" align="center" width="100">
													<template slot-scope="scope">
														<el-button type="text" text-plain @click="
                                                                delPersonnel(
                                                                    scope.$index,
                                                                    item.SafetyMeetingPersonnelNew,
                                                                    item.SafetyMeetingPersonnels
                                                                )
                                                            ">删除</el-button>
													</template>
												</el-table-column>
											</el-table>
										</el-form-item>
										<el-form-item label="会议地址" :rules="
                                                edits.rules
                                                    .SessionPlace
                                            " :prop="
                                                'SafetyMeetingSessions.' +
                                                i +
                                                '.SessionPlace'
                                            ">
											<el-input maxlength="100" show-word-limit placeholder="请输入" v-model="
                                                    item.SessionPlace
                                                "></el-input>
										</el-form-item>
									</div>
								</el-collapse-item>
							</el-collapse>
							<el-button type="success" style="margin-left: 1%;margin-bottom: 20px;"
								@click="add()">添加场次</el-button>
						</template> -->
					<!-- 线上会议 -->
					<template>
						<div v-for="(item, i) in edits.Data.SafetyMeetingSessions" :key="i">
							<div class="f">
								<el-form-item class="f1 w50" v-for="(item, i) in edits.Data.SafetyMeetingSessions"
									:key="i" label="会议时间" :rules="edits.rules.SessionTime" :prop="
                                            'SafetyMeetingSessions.' +
                                            i +
                                            '.SessionTime'
                                        ">
									<el-date-picker type="daterange" value-format="yyyy-MM-dd"
										v-if="edits.Data.SafetyMeetingType == '1'" v-model="item.SessionTime"
										range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
										style="width: 100%;">
									</el-date-picker>
									<el-date-picker type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" v-else
										v-model="item.SessionTime" range-separator="至" start-placeholder="开始日期"
										end-placeholder="结束日期" style="width: 100%;">
									</el-date-picker>
								</el-form-item>
								<el-form-item v-if="edits.Data.SafetyMeetingType == '1'" class="f1 w50 ml20"
									label="会议时长" prop="MaxTime">
									<!-- <el-time-picker
                                            v-model="edits.Data.MaxTime"
                                            :picker-options="{
                                                selectableRange: '00:00:01 - 23:59:59'
                                            }"
                                            placeholder="请选择">
                                        </el-time-picker> -->
									<div class="second-content f--c">
										<div>
											<el-dropdown trigger="click" @command="changeSeconds($event, 'h')"
												placement="bottom-start">
												<div class="second-item">
													<span>
														<span>{{ hms.h }}</span>
													</span>
													<span>小时</span>
												</div>
												<el-dropdown-menu slot="dropdown" style="height: 50vh;">
													<el-scrollbar style="height: 100%;">
														<el-dropdown-item v-for="(item, index) in 25" :key="index"
															:command="index">{{ index < 10 ? '0' +index  : index }}</el-dropdown-item>
													</el-scrollbar>
												</el-dropdown-menu>
											</el-dropdown>
										</div>
										<div>
											<el-dropdown trigger="click" @command="changeSeconds($event, 'm')"
												placement="bottom-start">
												<div class="second-item">
													<span>
														<span>{{ hms.m }}</span>
													</span>
													<span>分钟</span>
												</div>
												<el-dropdown-menu slot="dropdown" style="height: 50vh;">
													<el-scrollbar style="height: 100%;">
														<el-dropdown-item v-for="(item, index) in 60" :key="index"
															:command="index">{{ index < 10 ? '0' +index : index }}</el-dropdown-item>
													</el-scrollbar>
												</el-dropdown-menu>
											</el-dropdown>
										</div>
										<div>
											<el-dropdown trigger="click" @command="changeSeconds($event, 's')"
												placement="bottom-start">
												<div class="second-item">
													<span>
														<span>{{ hms.s }}</span>
													</span>
													<span>秒</span>
												</div>
												<el-dropdown-menu slot="dropdown" style="height: 50vh;">
													<el-scrollbar style="height: 100%;">
														<el-dropdown-item v-for="(item, index) in 60" :key="index"
															:command="index">{{ index < 10 ? '0' +index : index }}</el-dropdown-item>
													</el-scrollbar>
												</el-dropdown-menu>
											</el-dropdown>
										</div>
										<el-input v-model="edits.Data.MaxTime"
											style="width:0;height:0;opacity:0;overflow:hidden;"></el-input>
									</div>
								</el-form-item>
							</div>
							<div class="f" v-if="edits.Data.SafetyMeetingType == '2'">
								<div class="f1 w50">
									<el-form-item label="会议主持人" :rules="edits.rules.ModeratorUserId" :prop="
                                                'SafetyMeetingSessions.' +
                                                i +
                                                '.ModeratorUserId'
                                            ">
										<!-- v-model="item.ModeratorUserId" -->

										<el-input placeholder="请选择" readonly v-model="item.ModeratorUserName"
											class="input-with-select">
											<template v-if="!!item.ModeratorUserName">
												<i class="el-icon-error cursor-p f--c"
													style="height: 100%;line-height: 40px;" slot="suffix"
													@click="removeItem(item, 'ModeratorUserId', 'ModeratorUserName')"></i>
											</template>
											<el-button slot="append" @click="chooseModerator(item)">选择</el-button>
										</el-input>
									</el-form-item>
								</div>
								<div class="f1 w50 ml20">
									<el-form-item label="会议记录人" :rules="edits.rules.RecorderUserId" :prop="
                                                'SafetyMeetingSessions.' +
                                                i +
                                                '.RecorderUserId'
                                            ">
										<!-- v-model="item.RecorderUserId" -->
										<el-input placeholder="请选择" readonly v-model="item.RecorderUserName"
											class="input-with-select">
											<template v-if="!!item.RecorderUserName">
												<i class="el-icon-error cursor-p f--c"
													style="height: 100%;line-height: 40px;" slot="suffix"
													@click="removeItem(item, 'RecorderUserId', 'RecorderUserName')"></i>
											</template>
											<el-button slot="append" @click="chooseRecorder(item)">选择</el-button>
										</el-input>
									</el-form-item>
								</div>
							</div>
							<el-form-item label="会议地点" prop="MeetingAddress" v-if="edits.Data.SafetyMeetingType == '2'">
								<el-input v-model="item.MeetingAddress" show-word-limit></el-input>
							</el-form-item>
							<el-form-item :rules="
                                        edits.rules
                                            .SafetyMeetingPersonnelNew
                                    " :prop="
                                        'SafetyMeetingSessions.' +
                                        i +
                                        '.SafetyMeetingPersonnelNew'">
								<!-- v-model="item.initResourceId" -->

								<div class="f-b-c" style="margin-bottom: 10px;">
									<div class="required">参会人员</div>
									<el-button type="primary"
										@click="chooseUserName(item.SafetyMeetingPersonnelNew, item.SafetyMeetingPersonnels)">选择参与人员</el-button>
								</div>
								<el-table :data="item.SafetyMeetingPersonnelNew" highlight-current-row
									:header-cell-style="$tableStyle" style="width: 100%">
									<el-table-column type="index" label="序号" align="center"
										width="60"></el-table-column>
									<el-table-column label="姓名" prop="UserName" align="center"></el-table-column>
									<template v-if="edits.Data.SafetyMeetingType != '3'">
										<!-- <el-table-column label="状态" align="center">
											<template slot-scope="{ row }">
												<whether :yes="item.Status == 1 || item.Status == 2"
													:text="statusObj[item.Status]" />
											</template>
										</el-table-column> -->
										<el-table-column label="照片" align="center">
											<template slot-scope="{ row }">
												<el-image style="width:80px;height:80px;" :src="row.UploadPhotos[0].Url"
													:preview-src-list="row.UploadPhotos.map(u=>u.Url)"
													v-if="row.UploadPhotos && row.UploadPhotos.length > 0"></el-image>
												<span v-else>/</span>
											</template>
										</el-table-column>
										<el-table-column label="签名" align="center">
											<template slot-scope="{ row }">
												<el-image style="width:auto;height:45px;" :src="row.SignInUrl"
													:preview-src-list="[row.SignInUrl]" v-if="row.SignInUrl"></el-image>
												<span v-else>/</span>
											</template>
										</el-table-column>
										<el-table-column label="签名时间" align="center">
											<template slot-scope="{ row }">
												<div v-if="row.SignInDate">
													{{ row.SignInDate | format('yyyy-MM-dd') }}
												</div>
												<span v-else>/</span>
											</template>
										</el-table-column>
									</template>
									<!-- <el-table-column
                                        label="部门"
                                        align="center"
                                        show-overflow-tooltip
                                    >
                                        <template slot-scope="scope">
                                            {{ scope.row.DepartmentList.map(item => item.DepartmentName).join('、') }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="岗位"
                                        align="center"
                                        show-overflow-tooltip
                                    >
                                        <template slot-scope="scope">
                                            {{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
                                        </template>
                                    </el-table-column> -->
									<!-- <el-table-column label="姓名" align="center" prop="UserName">
									</el-table-column> -->
									<!-- <el-table-column label="手机号" align="center" prop="Tel">
										</el-table-column> -->
									<el-table-column label="操作" align="center" width="100">
										<template slot-scope="scope">
											<el-button type="text" text-plain @click="
                                                    delPersonnel(
                                                        scope.$index,
                                                        item.SafetyMeetingPersonnelNew,
                                                        item.SafetyMeetingPersonnels
                                                    )
                                                ">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
						</div>
					</template>
					<template v-if="edits.Data.SafetyMeetingType == '1' || edits.Data.SafetyMeetingType == '3'">
						<el-form-item label="附件" :prop="'SafetyMeetingSessions.0.AttachmentVideos'">
							<div class="f-b-c">
								<customUploadDrag class="w50" @onUpload="handleUpload" :Data="fileList"
									:showFileList="false"
									:acceptList="edits.Data.SafetyMeetingType == '3' ? ['doc' ,'docx'] : ['mp4', 'mp3', 'png' ,'jpg' ,'jpeg' ,'doc' ,'docx', 'xls', 'xlsx', 'pdf']">
									<div class="f-c-c">
										<i class="el-icon-upload"></i>
										<div class="el-upload__text">
											将文件拖到此处或<em>点击上传</em>
										</div>
									</div>
								</customUploadDrag>
								<div class="f--c w50" style="color: #959595;margin-left: 15px;">
									<span v-if="edits.Data.SafetyMeetingType == '3'">
										支持WORD文件
									</span>
									<span v-else>支持mp4、pdf、doc、jpeg、jpg、png文件</span>
								</div>
							</div>
							<div class="file-list" v-for="(item, index) in fileList" :key="index">
								<div class="file-item" @click="$openFile(item.url)">
									<div class="file f-b-c">
										<div class="f">
											<img style="width:30px;height:30px;margin-right: 13px;"
												:src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
											<div class="text">
												<div style="color:#44566C;font-size:12px;line-height: 1;;">
													{{item.Name}}
												</div>
												<div
													style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">
													{{ item.Size | formatSize}}
												</div>
											</div>
										</div>
										<div>
											<i class="el-icon-error cursor-p" @click="removeFile(index)"></i>
										</div>
									</div>
									<div></div>
								</div>
							</div>
						</el-form-item>
					</template>
				</el-form>
			</el-scrollbar>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogEditClose()">取消</el-button>
				<el-button type="primary" @click="dialogEditSave('editsform')"
					:loading="edits.dialogSaveLoading">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import util from "@/common/util.js";
	import ZYselect from "@/components/common/zy_select";
	import RULECONFIG from "@/common/ruleConfig";
	import request_mixin from "@/mixins/request-mixin.js";
	import customUploadDrag from "@/components/common/custom-upload-drag.vue";
	const defaultInfo = {
		SafetyMeetingId: 0, //long 主键Id 必填
		SafetyMeetingType: "1", //会议方式
		MeetingTypeCode: "", //string 会议类型 必填
		IsRelease: 0, // int 是否发布 必填(1,0)
		Topics: "", // string 主要议题 必填
		Content: "", // string 会议内容 必填
		SecurityLevel: "1",
		EnterpriseId: undefined,
		DepartmentId: "",
    TrainFiles:[],//上传附件
		SafetyMeetingSessions: [{
			SessionId: 0, // long 主键Id 必填
			SessionPlace: "", // string 会议地点
			SessionTime: [], // 会议时间
			MeetingAddress: "",
			RecorderUserId: "", // long 会议记录人Id 必填
			ModeratorUserId: "", // long 会议主持人Id 必填
			VenuePics: "", // array 会议附件 选填
			SafetyMeetingPersonnels: [], // array 参会人员 必填
			SafetyMeetingPersonnelNew: [],
			AttachmentVideos: [],
		}, ], // array 会议场次 必填
		MaxTime: 0, // 会议时长
	}

	function hmsToSeconds(hms) {
		let h = hms.h;
		let m = hms.m;
		let s = hms.s;
		return (h * 60 * 60) + (m * 60) + s;
	}

	function secondsToHms(s) {
		return {
			h: parseInt(s / 60 / 60 % 24),
			m: parseInt(s / 60 % 60),
			s: parseInt(s % 60),
		}
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		name: 'meet-type-info',
		mixins: [request_mixin],
		components: {
			ZYselect,
			customUploadDrag
		},
		filters: {
			formatSize: util.change_size
		},
		props: {
			addTitle: {
				type: String,
				default: '新增'
			}
		},
		data() {
			return {
				statusObj: {
				    0: '未开始',
				    1: '进行中',
				    2: '已签名',
				    3: '已补签',
				    4: '已结束',
				},
				MeetingType: [], //会议类型下拉列表
				hms: {
					h: 0,
					m: 0,
					s: 0
				},
				//编辑
				edits: {
					dialogEditShow: false, //弹窗显示状态
					dialogSaveLoading: false, //保存提交状态
					dialogEditTitle: "", //弹窗标题
					dialogFormLabelWidth: "100px", //弹窗表单label宽度
					//编辑数据
					Data: _extends(defaultInfo),
					//表单验证规则
					rules: {
						MeetingTypeCode: RULECONFIG.Select("会议类型"),
						Topics: RULECONFIG.Text("会议议题"),
						Content: RULECONFIG.Text("会议内容"),
						SessionPlace: RULECONFIG.Text("会议地点"),
						SessionTime: RULECONFIG.Select("会议时间"),
						SafetyMeetingType: RULECONFIG.Select("会议方式"),
						SafetyMeetingPersonnelNew: RULECONFIG.Select("参会人员"),
						AttachmentVideos: RULECONFIG.Select("会议视频"),
						SecurityLevel: RULECONFIG.Select("安全等级"),
						EnterpriseId: RULECONFIG.Select("企业"),
						DepartmentId: RULECONFIG.Select("部门"),
						MaxTime: [{
							required: true,
							validator(rule, value, callback) {
								if (value <= 0) {
									callback(new Error('请选择会议时长'));
								} else {
									callback();
								}
							},
							trigger: ['change', 'blur']
						}],
					},
				},
				collapseActive: [],
				fileList: [],
				isEdits: 1,
			}
		},
		watch: {
			'edits.Data.SafetyMeetingType'(nval, oval) {
				if (nval == 2) {
					this.collapseActive.push(this.edits.Data.SafetyMeetingSessions.length - 1);
					this.edits.Data.MaxTime = 0;
					this.hms = secondsToHms(0);
				} else {
					this.edits.Data.SafetyMeetingSessions.splice(1, this.edits.Data.SafetyMeetingSessions.length);
				}
			}
		},
		methods: {
			dialogEditInit() {
				this.edits.Data = _extends(defaultInfo)
			},
			async show(row, index) {
				this.edits.dialogEditShow = true;
				this.isEdits = index
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
				if (row) {
					this.edits.dialogEditTitle = "编辑";
					await row.SafetyMeetingSessions.forEach((res) => {
						res.SessionTime = [
							res.SessionStartTimeDesc,
							res.SessionEndTimeDesc,
						];
						res.SafetyMeetingPersonnelNew = res.SafetyMeetingPersonnels;
						if (!this.fileList.length) {
							this.fileList = JSON.parse(JSON.stringify(
								res.AttachmentVideos.map(item => {
									item.Url = item.VideoUrl;
									this.$set(item, 'name', item.Name);
									this.$set(item, 'url', item.VideoUrl);
									this.$set(item, 'size', item.Size);
									this.$set(item, 'ext', item.Ext);
									this.$set(item, 'coverUrl', item.CoverUrl);
									this.$set(item, 'lengths', item.Lengths);
									return item;
								})
							))
						}
					});
					row.SafetyMeetingType = row.SafetyMeetingType.toString();
					row.SecurityLevel = row.SecurityLevel.toString();
					this.edits.Data = JSON.parse(JSON.stringify(row));
					this.hms = secondsToHms(+parseInt(this.edits.Data.MaxTime));
				} else {
					this.edits.dialogEditTitle = this.addTitle;
					this.dialogEditInit()
				}
			},
			handleUpload() {
				this.fileList.forEach(item => {
					this.$set(item, 'Name', item.name);
					this.$set(item, 'VideoUrl', item.url);
					this.$set(item, 'Size', item.size);
					this.$set(item, 'Ext', item.ext);
					this.$set(item, 'CoverUrl', item.coverUrl);
					this.$set(item, 'Lengths', item.lengths);
					this.$set(item, 'TotalSeconds', item.lengths);
					let hms = secondsToHms(parseInt(item.Lengths || 0))
					this.$set(item, 'hms', hms);
				});
			},
			removeFile(index) {
				this.fileList.splice(index, 1);
			},
			changeSeconds(val, key) {
				this.hms[key] = val;
				this.edits.Data.MaxTime = hmsToSeconds(this.hms);
			},
			format(percentage) {
				return `${percentage}%`;
			},
			add() {
				//新增场次
				this.edits.Data.SafetyMeetingSessions.push({
					SessionId: 0, // long 主键Id 必填
					SessionPlace: "", // string 会议地点
					MeetingAddress: "",
					SessionTime: [], // 会议时间
					RecorderUserId: "", // long 会议记录人Id 必填
					ModeratorUserId: "", // long 会议主持人Id 必填
					VenuePics: "", // array 会议附件 选填
					SafetyMeetingPersonnels: [], // array 参会人员 必填
					SafetyMeetingPersonnelNew: [],
				});
				this.collapseActive.push(this.edits.Data.SafetyMeetingSessions.length - 1);
			},
			del(index) {
				//删除场次
				this.edits.Data.SafetyMeetingSessions.splice(index, 1);
			},
			//关闭弹窗
			dialogEditClose() {
				this.dialogEditInit()
				this.edits.dialogEditShow = false;
				this.edits.dialogSaveLoading = false;
				this.fileList = [];
				this.hms = secondsToHms(0);
			},

			//保存弹窗数据
			dialogEditSave(editsform) {
				this.edits.Data.SafetyMeetingSessions.forEach(item => {
					item.AttachmentVideos = JSON.parse(JSON.stringify(this.fileList));
				});
				this.$refs.editsform.validate((valid, ...arg) => {
					if (valid) {
						for (
							let i = 0; i < this.edits.Data.SafetyMeetingSessions.length; i++
						) {
							this.edits.Data.SafetyMeetingSessions[i].RecorderUserId =
								typeof this.edits.Data.SafetyMeetingSessions[i]
								.RecorderUserId == "object" ?
								this.edits.Data.SafetyMeetingSessions[i]
								.RecorderUserId[
									this.edits.Data.SafetyMeetingSessions[i]
									.RecorderUserId.length - 1
								] :
								this.edits.Data.SafetyMeetingSessions[i]
								.RecorderUserId;
							this.edits.Data.SafetyMeetingSessions[i].ModeratorUserId =
								typeof this.edits.Data.SafetyMeetingSessions[i]
								.ModeratorUserId == "object" ?
								this.edits.Data.SafetyMeetingSessions[i]
								.ModeratorUserId[
									this.edits.Data.SafetyMeetingSessions[i]
									.ModeratorUserId.length - 1
								] :
								this.edits.Data.SafetyMeetingSessions[i]
								.ModeratorUserId;
						}
						this.edits.dialogSaveLoading = true;
						this.edits.Data.SafetyMeetingSessions.map(item =>{
							item.SafetyMeetingPersonnels = item.SafetyMeetingPersonnelNew
						})
						// 线下例会不需要参与人员
						// if (this.edits.Data.SafetyMeetingType == 2) {
						// 	this.edits.Data.SafetyMeetingSessions.forEach(item => {
						// 		item.SafetyMeetingPersonnelNew = [];
						// 		item.SafetyMeetingPersonnels = [];
						// 	})
						// }
						this.edits.Data.SecurityLevel = parseInt(this.edits.Data.SecurityLevel)
						this.Post("/SaveSafetyMeeting", this.edits.Data).then(
							(res) => {
								if (res.status == 2000) {
									this.$message({
										message: "保存成功",
										type: "success",
									});
									this.dialogEditClose();
									this.edits.dialogSaveLoading = false;
									this.$emit('success');
								} else {
									this.$message.error(res.message);
									this.edits.dialogSaveLoading = false;
								}
							}
						);
					}
				});
			},
			delPersonnel(index, item, item1) {
				item.splice(index, 1);
				item1.splice(index, 1);
			},
			chooseUserName(item, item1) {
				this.$chooseUser({
					choosed: item1
				}).then(data => {
					if(item && item.lenth > 0){
						let SessionId = item.find(item5 =>item5.SessionId).SessionId
						if(SessionId){
							item.splice(0, item.length);
							item1.splice(0, item.length);
							item.push(...data);
							item1.push(...data);
							data.map(isItem =>{
								isItem.SessionId = SessionId
							})
							item = data
							item1 = data
						}else {
							item.splice(0, item.length);
							item1.splice(0, item.length);
							item.push(...data);
							item1.push(...data)
						}
					}else {
						item.splice(0, item.length);
						item1.splice(0, item.length);
						item.push(...data);
						item1.push(...data)
					}
				})
			},
			chooseModerator(item) {
				this.$chooseUser({
					single: false,
				}).then(data => {
					item.ModeratorUserId = data.UserId;
					this.$set(item, 'ModeratorUserName', data.UserName);
				});
			},
			chooseRecorder(item) {
				this.$chooseUser({
					single: false
				}).then(data => {
					item.RecorderUserId = data.UserId;
					this.$set(item, 'RecorderUserName', data.UserName);
				})
			},
			removeItem(item, nameKey, idKey) {
				item[nameKey] = '';
				item[idKey] = '';
			},
		},
		mounted() {

			this.Get("/GetSafeMeetingTypeCom").then((res) => {
				if (res.status == 2000) {
					this.MeetingType = res.data;
				}
			});
		}
	}
</script>
<style lang="scss" scoped>
	.meet-type-info {
		.cursor-p {
			cursor: pointer;
		}

		/deep/ .el-dialog {
			min-width: 1100px;
		}

		/deep/ .el-form-item__label {
			line-height: 30px;
			padding: 0;
		}

		.form-content {
			padding: 15px 20px;
		}

		.ml20 {
			margin-left: 20px;
		}

		.w50 {
			width: 50%;
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

		/deep/ .el-form-item__content {
			.el-select {
				width: 100%;
			}
		}

		/deep/ .el-scrollbar__wrap {
			margin-bottom: 0 !important;
		}

		/deep/ .el-scrollbar__bar.is-horizontal {
			display: none;
		}

		.video_avatar {
			width: 100%;
			height: 400px;
		}

		/deep/ .el-cascader {
			width: 100%;
		}

		/deep/ .el-collapse {
			margin-top: 28px;
			border: 0;

			.el-collapse-item {
				border: 1px solid #DCDFE6;
				border-radius: 6px;
				margin-bottom: 20px;
				overflow: hidden;

				&.is-active {
					.el-collapse-item__header {
						border-bottom: 1px solid #DCDFE6;
					}
				}

				.el-input.is-disabled .el-input__inner,
				.el-textarea.is-disabled .el-textarea__inner {
					color: #84888f;
					background: #f7f8f9;
				}

				.el-collapse-item__header {
					border: 1px solid transparent;
					padding: 14px 20px;
					background: #F5F6FA;
					line-height: inherit;

					.title {
						display: flex;
						align-items: center;
						font-size: 16px;
						line-height: 22px;
						color: #302E37;
						font-weight: 600;
					}

					.operation {
						color: $primary-color;

						.switch {
							display: flex;
							align-items: center;

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

						>div:last-child {
							margin-left: 22px;
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
					padding: 20px;
				}
			}
		}

		.el-form-item.is-error .second-content {
			border-color: #F56C6C;
		}

		.second-content {
			border-radius: 4px;
			border: 1px solid #DDDDDD;
			width: 100%;
			height: 40px;

			>div {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 33.33%;
				height: 100%;

				/deep/ .el-dropdown {
					width: 100%;

					.second-item {
						display: flex;

						>span {
							width: 50%;
							cursor: pointer;
							color: #181B3B;

							&:first-child {
								padding-right: 8px;
								text-align: right;
								color: $primary-color;
							}
						}
					}
				}
			}
		}

		.required {
			&::before {
				content: '*';
				margin-right: 4px;
				color: #FE3F51;
			}
		}
	}

	/deep/ .el-scrollbar__wrap {
		overflow-x: hidden;
	}
</style>
