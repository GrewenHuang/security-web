<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: zy
 * @Date: 2021-03-23 11:16:55
 * @LastEditors: Aidam_Bo
 * @LastEditTime: 2021-08-19 09:38:04
-->
<template>
	<div class="user-info">
		<el-form class="form" :rules="rules" ref="editsform" :model="userInfo">
			<div>
				<div class="title">基本信息</div>
				<div class="f-b-c spacing-bottom" style="align-items: flex-start">
					<div style="width: 80%;">
						<div class="flex-box">
							<div class="no-spacing">
								<el-form-item class="gutter" label="手机号/登录号" prop="LoginName" ref="LoginName">
									<el-input placeholder="手机号/登录号" v-model.trim="userInfo.LoginName" maxlength="11"
										:readonly="
					                userInfo.UserId == 0 ||
					                userInfo.UserId == undefined
					                    ? false
					                    : 'readonly'
					            " show-word-limit></el-input>
								</el-form-item>
							</div>
							<div class="no-spacing">
								<el-form-item class="gutter" label="姓名" prop="UserName" ref="UserName">
									<el-input placeholder="姓名" v-model="userInfo.UserName" maxlength="10"
										show-word-limit autocomplete="off"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="flex-box">
							<div class="no-spacing">
								<el-form-item label="性别" prop="Gender">
									<div class="el-input">
										<el-radio-group size="mini" v-model="userInfo.Gender">
											<el-radio-button :label="item.id" v-for='(item,i) in GenderList'
												:key='i'>{{item.text}}</el-radio-button>
										</el-radio-group>
									</div>
								</el-form-item>
							</div>
							<div class="no-spacing">
								<el-form-item label="出生日期" class="gutter" prop="Birthday">
									<el-date-picker v-model="userInfo.Birthday" type="date" clearable
										value-format="yyyy-MM-dd" placeholder="选择日期">
									</el-date-picker>
								</el-form-item>
							</div>
						</div>
						<div class="flex-box">
							<div class="no-spacing">
								<el-form-item class="gutter" label="岗位" prop="PositionList" ref="PositionList">
									<select-position v-model="userInfo.PositionList" :multiple="true"></select-position>
								</el-form-item>
							</div>
							<div class="no-spacing">
								<!-- <el-form-item label="数据权限" prop="DepartmentList" class="gutter">
									<custom-tree v-model="userInfo.DepartmentList" :data="DepartmentPositionUser"
										:expand-all="true" :check-strictly="true" immediately node-key="id"
										selectedId="DepartmentId"></custom-tree>
								</el-form-item> -->
								<el-form-item class="gutter" label="数据权限" prop="DepartmentList">
									<div class="el-input">
										<custom-tree v-model="userInfo.DepartmentList" :data="DepartmentPositionUser"
											:expand-all="true" :check-strictly="true" immediately node-key="value"
											selectedId="DepartmentId" ></custom-tree>
									</div>
								</el-form-item>
							</div>
						</div>
						<div class="flex-box">
							<!-- <div class="no-spacing">
								<el-form-item class="gutter" label="安全等级" prop="SecurityLevel" ref="SecurityLevel">
									<select-level v-model="userInfo.SecurityLevel" :multiple="false"
										:value="userInfo.SecurityLevel"></select-level>
								</el-form-item>
							</div> -->
							<div class="no-spacing">
								<el-form-item class="gutter" label="是否在职" prop="OnTheJob">
									<div class="el-input">
										<el-radio-group size="mini" v-model="userInfo.OnTheJob">
											<el-radio-button :label="item.id" v-for='(item,i) in WhetherCom'
												:key='i'>{{item.text}}</el-radio-button>
										</el-radio-group>
									</div>
								</el-form-item>
							</div>
						</div>
						<div class="flex-box">
							<div class="no-spacing">
								<el-form-item label="入职日期" class="gutter" prop="EntryDate">
									<el-date-picker v-model="userInfo.EntryDate" type="date" clearable
										value-format="yyyy-MM-dd" placeholder="选择日期">
									</el-date-picker>
								</el-form-item>
							</div>
							<div class="no-spacing">
								<el-form-item class="gutter" label="离职日期" v-if="userInfo.OnTheJob == 0"
									prop="DepartureDate">
									<el-date-picker v-model="userInfo.DepartureDate" type="date" clearable
										value-format="yyyy-MM-dd" placeholder="选择日期">
									</el-date-picker>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="portrait">
						<el-upload :action="url()" :accept="upload.image_suffix" :show-file-list="false"
							:on-success="uploadPortrait">
							<img v-if="userInfo.Photo" :src="userInfo.Photo" style="width: 100%; height: 100%" />
							<div style="
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                " v-else>
								<div>
									<i class="
                                            el-icon-plus
                                            avatar-uploader-icon
                                        " style="font-size: 40px"></i>
									<div>上传照片</div>
								</div>
							</div>
						</el-upload>
					</div>
				</div>
			</div>
			<el-form-item label="备注">
				<el-input maxlength="200" show-word-limit v-model="userInfo.Remark"></el-input>
			</el-form-item>
			<div class="split-line"></div>
			<div>
				<div class="title">企业信息</div>
				 <el-table
				     class="tableStyle"
				     :data="tableData"
				     style="width: 100%"
				     :header-cell-style="$tableStyle"
				 >
				     <el-table-column
				         label="序号"
				         header-align="center"
				         align="center"
				         type="index"
				         width="60"
				     >
				     </el-table-column>
				     <el-table-column
				         prop="Name"
				         align="center"
				         width="300"
				         label="企业"
				     ></el-table-column>
				     <el-table-column
				         prop="Describe"
				         label="部门"
				     ></el-table-column>
				     <el-table-column
				         prop="CreateByName"
				         width="100"
				         header-align="center"
				         align="center"
				         label="入岗日期"
				     ></el-table-column>
				     <el-table-column
				         prop="CreateTimeDesc"
				         width="160"
				         header-align="center"
				         align="center"
				         label="离岗日期"
				     ></el-table-column>
				 </el-table>
			</div>
			<div v-show="userInfo.Certificates.length">
				<div class="split-line"></div>
				<div>
					<div class="f-b-c">
						<div class="title">证件信息</div>
						<!-- <el-button type="primary" @click="chooseCert(collapseActive, userInfo.Certificates, 1)">添加证件</el-button> -->
					</div>
					<el-collapse v-model="collapseActive">
						<el-collapse-item v-for="(item, i) in userInfo.Certificates" :key="item.CertificateId"
							:name="item.CertificateId">
							<div slot="title" class="f-b-c f1">
								<span>{{ item.CertificateName }}</span>
								<div class="f--c operation">
									<div class="switch" :class="{open: collapseActive.includes(item.CertificateId)}">
										{{ collapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
									</div>
									<!-- <div @click.stop="userInfo.Certificates.splice(i, 1)" v-if="item.CertificateCategory != 1">删除</div>  -->
								</div>
							</div>
							<template v-for="(filed, index) in item.CertificateFileds">
								<div class="form-2-col" :key="index" v-if="index % 2 == 0">
									<el-form-item :label="filed.FiledName">
										<el-input placeholder="请输入" v-model="filed.FiledValue"
											v-if="filed.TextType == 2" @blur="getCardNo(filed, item)"></el-input>
										<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
											v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
										<custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4" />
									</el-form-item>
									<el-form-item
										:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
										v-if="item.CertificateFileds[index + 1]">
										<el-input placeholder="请输入"
											v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 2"
											@blur="getCardNo(filed, item)"></el-input>
										<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
											v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
										<custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 4" />
									</el-form-item>
									<div v-else></div>
								</div>
							</template>
							<el-form-item label="照片">
								<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
									:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
									<i class="el-icon-plus"></i>
								</custom-upload>
							</el-form-item>
						</el-collapse-item>
					</el-collapse>
				</div>
			</div>
			<div v-show="userInfo.Insures.length">
				<div class="split-line"></div>
				<div>
					<div class="f-b-c">
						<div class="title">保险信息</div>
						<!-- <el-button type="primary" @click="chooseCert(insureCollapseActive, userInfo.Insures, 2)">添加保险</el-button> -->
					</div>
					<el-collapse v-model="insureCollapseActive">
						<el-collapse-item v-for="(item, i) in userInfo.Insures" :key="item.CertificateId"
							:name="item.CertificateId">
							<div slot="title" class="f-b-c f1">
								<span>{{ item.CertificateName }}</span>
								<div class="f--c operation">
									<div class="switch"
										:class="{open: insureCollapseActive.includes(item.CertificateId)}">
										{{ insureCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
									</div>
									<!-- <div @click.stop="userInfo.Insures.splice(i, 1)">删除</div>  -->
								</div>
							</div>
							<template v-for="(filed, index) in item.CertificateFileds">
								<div class="form-2-col" :key="index" v-if="index % 2 == 0">
									<el-form-item :label="filed.FiledName">
										<el-input placeholder="请输入" v-model="filed.FiledValue"
											v-if="filed.TextType == 2" @blur="getCardNo(filed, item)"></el-input>
										<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
											v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
										<custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4" />
									</el-form-item>
									<el-form-item
										:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
										v-if="item.CertificateFileds[index + 1]">
										<el-input placeholder="请输入"
											v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 2"
											@blur="getCardNo(filed, item)"></el-input>
										<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
											v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
										<custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue"
											v-if="item.CertificateFileds[index + 1].TextType == 4" />
									</el-form-item>
									<div v-else></div>
								</div>
							</template>
							<el-form-item label="照片">
								<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
									:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
									<i class="el-icon-plus"></i>
								</custom-upload>
							</el-form-item>
						</el-collapse-item>
					</el-collapse>
				</div>
			</div>
			<div class="split-line"></div>
			<div>
				<div class="f-b-c">
					<div class="title">其他信息</div>
					<!-- <el-button type="primary" @click="chooseCert(fileSignsCollapseActive, userInfo.Others, 3)">添加</el-button> -->
				</div>
				<el-collapse v-model="fileSignsCollapseActive">

					<el-collapse-item v-for="(item, i) in userInfo.Others" :key="item.CertificateId"
						:name="item.CertificateId">
						<div slot="title" class="f-b-c f1">
							<span>{{ item.CertificateName }}</span>
							<div class="f--c operation">
								<div class="switch"
									:class="{open: fileSignsCollapseActive.includes(item.CertificateId)}">
									{{ fileSignsCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
								</div>
								<!-- <div @click.stop="userInfo.Others.splice(i, 1)">删除</div>  -->
							</div>
						</div>
						<template v-for="(filed, index) in item.CertificateFileds">
							<div class="form-2-col" :key="index" v-if="index % 2 == 0">
								<el-form-item :label="filed.FiledName">
									<el-input placeholder="请输入" v-model="filed.FiledValue" v-if="filed.TextType == 2"
										@blur="getCardNo(filed, item)"></el-input>
									<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
										v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
									<custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4" />
								</el-form-item>
								<el-form-item
									:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
									v-if="item.CertificateFileds[index + 1]">
									<el-input placeholder="请输入" v-model="item.CertificateFileds[index + 1].FiledValue"
										v-if="item.CertificateFileds[index + 1].TextType == 2"
										@blur="getCardNo(filed, item)"></el-input>
									<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
										v-model="item.CertificateFileds[index + 1].FiledValue"
										v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
									<custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue"
										v-if="item.CertificateFileds[index + 1].TextType == 4" />
								</el-form-item>
								<div v-else></div>
							</div>
						</template>
						<el-form-item label="照片">
							<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
								:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
								<i class="el-icon-plus"></i>
							</custom-upload>
						</el-form-item>
					</el-collapse-item>
					<el-collapse-item v-for="item in userInfo.FileSigns" :key="item.PositionFileSignId"
						:name="item.PositionFileSignId">
						<div slot="title" class="f-b-c f1">
							<span>{{ item.FileName }}</span>
							<div class="f--c operation">
								<div class="switch"
									:class="{open: fileSignsCollapseActive.includes(item.PositionFileSignId)}">
									{{ fileSignsCollapseActive.includes(item.PositionFileSignId) ? '收起' : '展开' }}
								</div>
							</div>
						</div>
						<template v-for="(url, index) in item.FileSignPhotoUrl.split(',')">
							<el-image :key="index" :src="url"
								:preview-src-list="item.FileSignPhotoUrl.split(',')"></el-image>
						</template>
					</el-collapse-item>
					<el-collapse-item name="contract">
						<div slot="title" class="f-b-c f1">
							<span>劳动合同</span>
							<div class="f--c operation">
								<div class="switch" :class="{open: fileSignsCollapseActive.includes('contract')}">
									{{ fileSignsCollapseActive.includes('contract') ? '收起' : '展开' }}
								</div>
							</div>
						</div>
						<el-upload :action="url()" :accept="upload.image_suffix" list-type="picture-card"
							:before-upload="before" :on-change="
                                (file, fileList) => {
                                    change(file, 2);
                                }
                            " :before-remove="
                                (file, fileList) => {
                                    return before_remove(file, 2);
                                }
                            " :file-list="arrFilesFun(2)" :on-preview="preview">
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-collapse-item>
					<el-collapse-item name="physical-examination">
						<div slot="title" class="f-b-c f1">
							<span>体检证明</span>
							<div class="f--c operation">
								<div class="switch"
									:class="{open: fileSignsCollapseActive.includes('physical-examination')}">
									{{ fileSignsCollapseActive.includes('physical-examination') ? '收起' : '展开' }}
								</div>
							</div>
						</div>
						<el-upload :action="url()" :accept="upload.image_suffix" list-type="picture-card"
							class="el_upload" :before-upload="before" :on-change="
                                (file, fileList) => {
                                    change(file, 5);
                                }
                            " :before-remove="
                                (file, fileList) => {
                                    return before_remove(file, 5);
                                }
                            " :file-list="arrFilesFun(5)" :on-preview="preview">
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-collapse-item>
					<el-collapse-item name="edu">
						<div slot="title" class="f-b-c f1">
							<span>其他培训教育记录</span>
							<div class="f--c operation">
								<div class="switch" :class="{open: fileSignsCollapseActive.includes('edu')}">
									{{ fileSignsCollapseActive.includes('edu') ? '收起' : '展开' }}
								</div>
							</div>
						</div>
						<el-upload :action="url()" :accept="upload.image_suffix" list-type="picture-card"
							class="el_upload" :before-upload="before" :on-change="
                                (file, fileList) => {
                                    change(file, 6);
                                }
                            " :before-remove="
                                (file, fileList) => {
                                    return before_remove(file, 6);
                                }
                            " :file-list="arrFilesFun(6)" :on-preview="preview">
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-collapse-item>
				</el-collapse>
			</div>
		</el-form>
	</div>
</template>
<script>
	import RULECONFIG from '@/common/ruleConfig';
	import upload_mixin from '@/mixins/upload-mixin.js';
	import request_mixin from '@/mixins/request-mixin.js';
	import Qs from 'qs'
	import {
		mapState
	} from 'vuex';
	const defaultInfo = {
		UserId: '0', //Id
		UserName: '', //姓名
		LoginName: '', //登录名
		Gender: '', //性别
		CardNo: '', //身份证号
		Email: '', //邮箱
		Remark: '', //备注
		Status: '1', //状态
		DepartmentId: '', //部门
		PositionId: '', //岗位
		Birthday: '', //生日
		OnTheJob: '1', //是否在职 int
		IdentityCardFiles: '', //身份证
		LaborContractFiles: '', //劳动合同
		DepartureDate: '', //离职日期
		EntryDate: '', //入职日期
		Address: '',
		ContinuingEducationFiles: '', //培训教育记录
		OtherFiles: '', //其他附件
		OtherPerson: '', //紧急联系人
		OtherPersonTel: '', //紧急联系人电话
		Political: '', //政治面貌
		IsMarriage: 0, //婚否
		FamilyMembers: '', //家庭成员
		Photo: '', // 用户照片
		PositionList: [], // 岗位
		Certificates: [], // 证件
		DepartmentListJustShow: [],
		Insures: [], // 保险
		Others: [], // 其他信息
		FileSigns: [],
		SecurityLevel: '1',
		repeatPassword: '123456',
		password: '123456',
		EducationCode: '',
		GraduateSchool: '',
		Major: '',
		EnterpriseId: Qs.parse(window.localStorage.getItem("userinfo")).EnterpriseId,
		GroupId: Qs.parse(window.localStorage.getItem("userinfo")).GroupId
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	let timer = -1;
	const certKeysName = {
		Certificates: '证件',
		Insures: '保险',
		Others: '其他'
	};
	export default {
		name: 'driver',
		props: ['data'],
		mixins: [upload_mixin, request_mixin],
		data() {
			return {
				tableData: [],
				GenderList: [], //性别列表
				Departments: [], //部门
				WhetherCom: [], //是否在职
				currentSelected: [],
				//编辑
				userInfo: _extends(defaultInfo),
				DepartmentPositionUser: [],
				rules: {
					LoginName: RULECONFIG.Text('手机号'),
					UserName: RULECONFIG.Text('姓名'),
					Gender: RULECONFIG.Select('性别'),
					Birthday: RULECONFIG.Select('出生日期'),
					OnTheJob: RULECONFIG.Select('是否在职'),
					DepartmentList: RULECONFIG.Select('数据权限'),
					SecurityLevel: RULECONFIG.Select('安全等级'),
					PositionList: [{
						required: true,
						type: 'array',
						message: '请选择岗位'
					}]
				},
				collapseActive: [],
				fileSignsCollapseActive: ['contract', 'physical-examination', 'edu'],
				insureCollapseActive: [],
			};
		},

		computed: {
			...mapState([]),
		},
		watch: {
			data: {
				deep: true,
				handler(val) {
					this.userInfo = _extends(Object.assign(_extends(defaultInfo), val));
					if (this.userInfo.SecurityLevel == 0) {
						this.userInfo.SecurityLevel = '1'
					} else {
						this.userInfo.SecurityLevel = this.userInfo.SecurityLevel.toString()
					}
					this.setFiles();
					this.setCerts(val.CertificateList || [], this.userInfo);
					this.collapseActive = [];
					if (this.userInfo.PositionList) {
						this.userInfo.PositionList = this.userInfo.PositionList.map(
							(item) => {
								return item.PositionId;
							}
						);
					}

					this.collapseActive = (this.userInfo.Certificates || []).map(item => item.CertificateId);
					this.insureCollapseActive = (this.userInfo.Insures || []).map(item => item.CertificateId);
					this.fileSignsCollapseActive = ['contract', 'physical-examination', 'edu'];
					this.fileSignsCollapseActive.push(...(this.userInfo.Others || []).map(item => item.CertificateId));
					this.fileSignsCollapseActive.push(...(this.userInfo.FileSigns || []).map(item => item
						.PositionFileSignId));
				},
			},
			userInfo: {
				deep: true,
				handler() {
					if (!this.userInfo.PositionList) {
						this.$set(this.userInfo, 'PositionList', []);
					}
				},
			},
			'userInfo.PositionList'(val) {
				clearTimeout(timer);
				timer = setTimeout(() => {
					this.$nextTick(async () => {
						this.getPositionJoinInfo(val.join(','));
					});
				}, 600);
			},
			'upload.arrFiles': function(val) {
				let arr = [
					'',
					'IdentityCardFiles',
					'LaborContractFiles',
					'SafetyCommitmentFiles',
					'LetterFiles',
					'MedicalCertificateFiles',
					'OtherFiles',
					'ContinuingEducationFiles',
				];
				arr.forEach((key, index) => {
					if (key && this.upload.arrFiles[index]) {
						this.$set(this.userInfo, key, this.upload.arrFiles[index]);
					}
				});
			},
		},

		methods: {
			checkChange(nodes, nodeKeys) {
				this.currentSelected = nodeKeys.checkedKeys;
			},
			setCerts(list, info) {
				list.forEach(item => {
					Object.keys(certKeysName).forEach((key, index) => {
						if (!info[key]) {
							this.$set(info, key, []);
						}
						if (item.CertificateClassification == (index + 1)) {
							let o = info[key].find(o => o.CertificateId == item.CertificateId);
							if (!o) {
								info[key].push(item);
							}
						}
					});
				});
			},
			async getPositionJoinInfo(positionIds) {
				let list = positionIds.length ? await this.Get(`/GetPositionFileSigns?positionId=${positionIds}`).then(
					res => res.data) : [];
				if (!this.userInfo.FileSigns) {
					this.$set(this.userInfo, 'FileSigns', list);
				} else {
					list.forEach(item => {
						let index = this.userInfo.FileSigns.map(item => item.PositionFileSignId).indexOf(item
							.PositionFileSignId);
						if (index == -1) {
							this.userInfo.FileSigns.push(item);
						}
					});
					for (let i = 0; i < this.userInfo.FileSigns.length; i++) {
						let item = this.userInfo.FileSigns[i];
						if (!!item.UserFileSignId) continue;
						let cItem = list.find(cItem => cItem.PositionFileSignId == item.PositionFileSignId);
						if (!cItem) {
							this.userInfo.FileSigns.splice(i, 1);
							i--;
						}
					};
					if (list.length) {
						this.fileSignsCollapseActive.push(...list.map(item => item.PositionFileSignId));
					}
				}
				let certList = positionIds.length ? await this.Get(
					`/GetPositionCertificates?positionId=${positionIds}`).then(res => res.data) : [];
				[this.userInfo.Certificates, this.userInfo.Insures, this.userInfo.Others].forEach((list, index) => {
					let num = index + 1;
					let arr = certList.filter(item => item.CertificateClassification == num);
					arr.forEach(item => {
						let index = list.map(item => item.CertificateId).indexOf(item.CertificateId);
						if (index == -1) {
							list.push(item);
						}
					});
					for (let i = 0; i < list.length; i++) {
						let item = list[i];
						if (!!item.CertificateManageId) continue;
						let cItem = certList.find(cItem => cItem.CertificateId == item.CertificateId);
						if (!cItem) {
							list.splice(i, 1);
							i--;
						}
					};
					if (index == 0) {
						this.collapseActive.push(...certList.map(item => item.CertificateId));
					} else if (index == 1) {
						this.insureCollapseActive.push(...certList.map(item => item.CertificateId));
					} else if (index == 2) {
						this.fileSignsCollapseActive.push(...certList.map(item => item.CertificateId));
					}
				})
			},
			getData(call) {
				this.$refs.editsform.validate((valid, fields) => {
					if (JSON.stringify(fields) != '{}') {
						for (let key in fields) {
							let ref = this.$refs[key];
							if (ref) {
								ref.$el.scrollIntoView({
									behavior: 'smooth'
								});
								break;
							}
						}
					}
					if (valid) {
						this.userInfo.IdentityCardFiles = this.upload.arrFiles[1];
						this.userInfo.LaborContractFiles = this.upload.arrFiles[2];
						this.userInfo.SafetyCommitmentFiles =
							this.upload.arrFiles[3];
						this.userInfo.LetterFiles = this.upload.arrFiles[4];
						this.userInfo.MedicalCertificateFiles =
							this.upload.arrFiles[5];
						this.userInfo.OtherFiles = this.upload.arrFiles[7];
						this.userInfo.ContinuingEducationFiles =
							this.upload.arrFiles[6];
						let params = JSON.parse(JSON.stringify(this.userInfo));
						params.PositionList = (params.PositionList || []).map(
							(item) => {
								return {
									PositionId: item,
								};
							}
						);
						call(params);
					} else {
						call({});
					}
				});
			},
			setFiles() {
				let val = this.userInfo;
				this.upload.arrFiles[1] = val.IdentityCardFiles;
				this.upload.arrFiles[2] = val.LaborContractFiles;
				this.upload.arrFiles[3] = val.SafetyCommitmentFiles;
				this.upload.arrFiles[4] = val.LetterFiles;
				this.upload.arrFiles[5] = val.MedicalCertificateFiles;
				this.upload.arrFiles[7] = val.OtherFiles;
				this.upload.arrFiles[6] = val.ContinuingEducationFiles;
			},
			uploadPortrait(res, file) {
				this.$set(this.userInfo, 'Photo', res.files[0].url);
			},
			getCardNo(item, cert) {
				// 证件为身份证 且 字段是默认 且 字段类型是文本
				if (cert.CertificateCategory == 1 && item.IsDefault == 1 && item.TextType == 2) {
					this.$set(this.userInfo, 'Gender', '');
					this.$set(this.userInfo, 'Birthday', '');
					this.$set(this.userInfo, 'CardNo', item.FiledValue);
					//获取身份证信息
					if (!!item.FiledValue) {
						this.Get('VerificationCardNo', {
							CardNo: item.FiledValue,
						}).then((res) => {
							if (res.status == 2000) {
								this.userInfo.Gender = res.data.Gender;
								this.userInfo.Birthday = res.data.Birthday;
								this.userInfo.CardNo = item.FiledValue;
							} else {
								this.$message.error(res.message)
							}
						});
					}
				}
			},
			chooseCert(collapse, list, classification) {
				this.$chooseCert({
					type: 2,
					classification,
					choosed: list
				}).then(res => {
					collapse.push(...res.map(item => item.CertificateId));
					let ids = list.map(item => item.CertificateId);
					let resList = _extends(res.map(item => {
						item.CertificateManagePhotos = [];
						return item;
					})).filter(item => ids.indexOf(item.CertificateId) == -1);
					if (resList.length) {
						list.push(...resList);
					}
				})
			}
		},
		created() {
			let list = [
				this.Get('/GetGenderCom', {}).then((result) => {
					if (result.status == 2000) {
						this.GenderList = result.data;
					}
				}),
				// this.Get('/GetArchivesType', {}).then((res) => {
				//     if (res.status == 2000) {
				//         this.activeName = res.data[0].Code;
				//         this.activeNames = res.data[0].Code;
				//     }
				// }),
				this.Get('/GetDepartmentTree').then((res) => {
					//部门
					if (res.status == 2000) {
						this.DepartmentPositionUser = res.data
					}
				}),
				this.Get('GetGenderCom').then((res) => {
					//性别

					if (res.status === 2000) {
						this.GenderList = res.data;
					}
				}),

				this.Get('GetWhether').then((res) => {
					//是否
					if (res.status === 2000) {
						this.WhetherCom = res.data;
					}
				}),
			];
			Promise.all(list).then((res) => {
				this.upload.arrFiles = [
					[],
					[],
					[],
					[],
					[],
					[],
					[]
				];
				if (this.data) {
					this.userInfo = this.data;
					this.setFiles();
				}
			});
		},
	};
</script>
<style lang="scss" scoped>
	.el-select {
		width: 100%;
	}

	.el-date-editor {
		width: 100%;
	}

	/deep/ .el-upload-list__item {
		transition: none !important;
	}

	.card_title {
		font-size: 15px;
		font-weight: 700;
	}

	.box-card {
		margin-top: 10px;
	}

	.portrait {
		flex: 1;
		height: 315px;
	}

	.portrait>div {
		height: 100%;
	}

	.flex-box {
		width: 95%;
		display: flex;
	}

	.portrait /deep/ .el-upload {
		width: 100%;
		height: 100%;
		border: 1px dashed #c0ccda;
		background: #fbfdff;
		border-radius: 4px;
		color: #c0ccda;
		overflow: hidden;
	}

	.w50 {
		width: 50%;
	}

	.gutter {
		margin-right: 20px;
	}

	.no-spacing {
		width: 50%;
	}

	.no-spacing /deep/ .el-form-item {
		margin-bottom: 0;
	}

	.spacing-bottom {
		margin-bottom: 22px;
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

	.user-info {
		.form {
			padding: 5px 25px 15px 30px;
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

		.form-2-col {
			display: flex;

			>div {
				width: 50%;

				&:first-child {
					margin-right: 40px;
				}
			}
		}

		/deep/ .el-button--primary.is-plain {
			border-style: dashed;
		}

		.split-line {
			margin: 30px -35px 20px;
			height: 10px;
			background: #F2F2F2;
		}

		.el-image {
			border-radius: 6px;
			border: 1px solid #c0ccda;
			width: 148px;
			height: 148px;
		}
	}
</style>