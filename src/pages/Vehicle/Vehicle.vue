<template>
	<page-layout :loading="loading" element-loading-text="拼命加载中" :pages="pages" @current-change="handleCurrentChange">
		<!-- 条件栏 开始 -->

		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags v-model="filters.EnterpriseId"
							@clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="车牌号" clearable v-model="filters.LicensePlateNumber"></el-input>
					</el-form-item>
          <!-- <el-form-item>
						<el-input placeholder="车辆品牌" clearable v-model="filters.LicensePlateNumber.Brand"></el-input>
					</el-form-item> -->
					<el-form-item>
						<el-button type="primary" @click="handleSearch()">查询</el-button>
						<el-popover width="400" trigger="click">
							<div>
								<el-form-item>
									<el-select placeholder="车辆类型" clearable v-model="filters.VehicleTypeId">
										<el-option v-for="(item, index) in VehicleTypeList" :key="index"
											:value="item.VehicleTypeId" :label="item.VehicleTypeName"
											:dataItem="item"></el-option>
										<!-- <el-option v-for="(item, index) in VehicleTypeList" :key="index" :label="item.text"
												:value="item.id"></el-option> -->
									</el-select>
								</el-form-item>
								<!-- <el-form-item>
										<el-input placeholder="车辆负责人" clearable v-model="filters.UserName"></el-input>
									</el-form-item> -->
								<el-form-item>
									<cascader-fleet placeholder="所属车队" clearable
										v-model="filters.VehicleGroupSetId"></cascader-fleet>
								</el-form-item>
								<el-form-item>
									<el-select placeholder="车型简称" clearable v-model="filters.ArchivesNo">
										<el-option v-for="(item, index) in cardListForm" :key="index" :label="item"
											:value="item"></el-option>
									</el-select>
								</el-form-item>
								<el-select placeholder="状态" clearable v-model="filters.CarStatus">
									<el-option v-for="(item, index) in CarStatusList" :key="index" :label="item.text"
										:value="item.id"></el-option>
								</el-select>
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
			</div>
			<div class="f-c-c">
				<el-button-group style="margin-right: 20px">
					<el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=2')"
						v-if="$_has('CARLISTBtnDown')">下载导入模板</el-button>
					<el-button v-if="$_has('CARLISTBtnImport')">
						<el-upload action="#" :show-file-list="false" :on-change="
	                               (file) => {
	                                   handleExcel(
	                                       file,
	                                       'ImportVehicle'
	                                   );
	                               }
	                           " accept=".xls,.xlsx" :auto-upload="false">导入车辆
						</el-upload>
					</el-button>
					<el-button @click="downloadFile(502)" v-if="$_has('CARLISTBtnExport')">导出车辆台账</el-button>
					<el-button @click="downloadFile(504)" v-if="$_has('CARLISTBtnExport')">导出车辆档案</el-button>
					<el-button @click="DownCache()" v-if="$_has('CARLISTBtnExport')">档案缓存下载</el-button>
				</el-button-group>
				<el-button type="primary" icon="el-icon-plus" @click="showQrCode2()"
				>打印</el-button>
				<!-- <el-button type="primary" icon="el-icon-plus" @click="showQrCode2()"
				>打印设置</el-button> -->
				<el-button type="primary" icon="el-icon-plus" @click="dialogEditOpen(-1)"
					v-if="$_has('CARLISTBtnAdd')">新增</el-button>
			</div>
		</div>

		<!-- 条件栏 结束 -->
		<!--列表 开始-->
		<el-table :data="pages.list" highlight-current-row :header-cell-style="$tableStyle"
			@selection-change="handleSelectionChange" ref="listTable">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="序号" type="index" align="center" header-align="center" width="50">
			</el-table-column>
			<el-table-column label="企业" align="center" width="150" prop="EnterpriseName">
			</el-table-column>
			<el-table-column label="车队" align="center" prop="VehicleGroupSetName">
			</el-table-column>
			<el-table-column label="车牌号" align="center" prop="LicensePlateNumber">
			</el-table-column>
			<el-table-column label="车型简称" align="center" prop="ArchivesNo">
			</el-table-column>
			<!-- <el-table-column label="车辆类型" align="center" prop="VehicleTypeName">
	 		</el-table-column> -->
          <el-table-column label="车辆品牌" align="center" prop="Brand">
			</el-table-column>
			<!-- <el-table-column label="负责人" align="center" prop="UserName">
			</el-table-column> -->
			<!-- <el-table-column label="安全级别" align="center" prop="SecurityLevelDesc">
			</el-table-column> -->
			<el-table-column label="状态" align="center" header-align="center">
				<template slot-scope="scope">
					<whether :yes="scope.row.CarStatus == 1" :text="scope.row.CarStatusDesc" />
				</template>
			</el-table-column>
			<el-table-column label="更新人" align="center" prop="CreateByName">
			</el-table-column>
			<el-table-column label="更新时间" align="center" prop="UpdateTimeDesc" sortable>
			</el-table-column>
			<el-table-column label="操作" align="center" header-align="center" fixed="right" width="320">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="dialogEditOpen(scope.$index, scope.row)"
							v-if="$_has('CARLISTBtnGLDA')">管理档案</el-button>
						<el-popover placement="bottom" width="154" trigger="click">
							<el-button type="primary" size="mini" plain
								@click="dialogfilesOpen(scope.$index, scope.row)"
								v-if="$_has('CARLISTBtnEdit')">编辑</el-button>
							<el-button type="warning" size="mini" plain
								@click="downloadmbs(50, 501, scope.row.VehicleId)"
								v-if="$_has('CARLISTBtnDown2')">下载</el-button>
							<el-button slot="reference" type="text" v-if="$_has('CARLISTBtnJSDA')">技术档案</el-button>
						</el-popover>
						<el-button type="text" v-if="$_has('CARLISTBtnLine')" @click="
	                               dialogEditDriverLineOpen(scope.$index, scope.row)
	                           ">线路</el-button>
						<el-popconfirm title="是否删除该数据？" icon="el-icon-info" icon-color="red"
							@confirm="DeleteData(scope.row.VehicleId)">
							<el-button type="text" text-plain slot="reference"
								v-if="$_has('CARLISTBtnDelete')">删除</el-button>
						</el-popconfirm>
            <el-button type="text" @click="showQrCode(scope.row)"  v-if="$_has('SBSSBtnSM')">二维码</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<!-- 列表 结束 -->
		<!--编辑弹层 开始-->
		<el-dialog :title="edits.dialogEditTitle" :visible.sync="edits.dialogEditShow" @close="dialogEditClose()"
			class='abow_dialog' width="60%" top='8vh'>
			<template>
				<el-scrollbar class="scrollbar" ref="scrollbar">
					<el-form :rules="edits.rules" ref="editsform" :model="edits.Data" class="form">
						<el-card class="box-card" shadow="never">
							<div slot="header" class="clearfix">
								<span style='font-weight:700'>
									车辆基本信息
								</span>
							</div>
							<div class="form-2-col">
								<el-form-item label="车牌号" prop="LicensePlateNumber">
									<el-input v-model="edits.Data.LicensePlateNumber" maxlength="20"
										show-word-limit></el-input>
								</el-form-item>
								<el-form-item label="车型简称">
									<el-select placeholder="请选择" clearable v-model="edits.Data.ArchivesNo" filterable
										allow-create default-first-option>
										<el-option v-for="(item, index) in cardListForm" :key="index" :label="item"
											:value="item"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="车辆类型" prop="VehicleTypeId">
									<el-tooltip class="item" effect="dark" placement="top-start">
										<div slot="content">
											<span
												style="color: #fff;font-size: 14px">重选车辆类型后,证照数据将被关联重置,请确认更改后再选择。</span>
										</div>
										<span><i class="el-icon-question"></i></span>
									</el-tooltip>
									<el-select v-model="edits.Data.VehicleTypeId" clearable @change="changeType">
										<!-- <el-option v-for="item in VehicleTypeList" :key="item.id" :label="item.text"
												:value="item.id">
											</el-option> -->
										<el-option v-for="(item, index) in VehicleTypeList" :key="index"
											:value="item.VehicleTypeId" :label="item.VehicleTypeName"
											:dataItem="item"></el-option>
									</el-select>

								</el-form-item>

							</div>
							<div class="form-2-col">
								<el-form-item label="所属企业" prop="EnterpriseId">
									<select-enterpirse clearable placeholder="所属企业" collapseTags
										v-model="edits.Data.EnterpriseId"
										@clear="edits.Data.DepartmentId = ''"></select-enterpirse>
								</el-form-item>
								<el-form-item label="所属部门" prop="DepartmentId">
									<cascader-department placeholder="所属部门" clearable v-model="edits.Data.DepartmentId"
										:enterpriseId="edits.Data.EnterpriseId"
										:disabled="!edits.Data.EnterpriseId ? true : false"></cascader-department>
									<!-- <select-department placeholder="所属部门" clearable clearable v-model="edits.Data.DepartmentList" :enterpriseId="edits.Data.EnterpriseIds" :disabled="!edits.Data.EnterpriseIds ? true : false"></select-department> -->
								</el-form-item>

							</div>

							<!-- <div class="portrait">
									<el-upload :action="url()" :accept="upload.image_suffix" :show-file-list="false"
										:on-success="uploadPortrait">
										<img v-if="edits.Data.Photo" :src="edits.Data.Photo"
											style="width: 100%; height: 100%" />
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
								</div> -->
							<div class="form-2-col">
								<el-form-item class="gutter" label="所属车队" prop="VehicleGroupSetId">
									<cascader-fleet placeholder="所属车队" clearable
										v-model="edits.Data.VehicleGroupSetId"></cascader-fleet>
								</el-form-item>
								<!-- <el-form-item label="负责人" prop="UserName">
									<el-input placeholder="请选择" v-model="edits.Data.UserName" readonly>
										<el-button slot="append" @click="chooseUser">选择人员</el-button>
									</el-input>
								</el-form-item> -->
                <el-form-item label="车辆服务商">
									<el-select v-model="edits.Data.ServiceProviderType" placeholder="请选择">
										<el-option label="无" value=""></el-option>
										<el-option label="G7易流" :value="1"></el-option>
										<el-option label="日立" :value="2"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="状态" prop="CarStatus">
									<ZYselect url="GetCarStatus" placeholder="请选择" propid="id" propname="text"
										:val="edits.Data.CarStatus" v-model="edits.Data.CarStatus"
										@returnData="getFormValue($event)" />
								</el-form-item>
							</div>
              <div class="form02-col">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="车辆品牌" prop="Brand">
									<el-input v-model="edits.Data.Brand" maxlength="20"
										show-word-limit></el-input>
								</el-form-item>
                  </el-col>
                </el-row>
              </div>

							<el-form-item label="备注">
								<el-input type="textarea" placeholder="请输入" v-model="edits.Data.Remark"></el-input>
							</el-form-item>
							<el-form-item label="车辆照片">
								<custom-upload class="el-input" :accept="'.jpeg,.png,.jpg,.gif'"
									:fileList.sync="edits.Data.OtherFiles" list-type="picture-card">
									<i class="el-icon-plus"></i>
								</custom-upload>
							</el-form-item>
						</el-card>
						<!-- v-if="edits.Data.Certificates && edits.Data.Certificates.length" -->
						<el-card class="box-card" shadow="never"
							>
							<div slot="header" class="clearfix">
								<span style='font-weight:700;margin-bottom:20px'>
									证件信息
								</span>
							</div>
							<div
								v-if="edits.Data.Certificates && edits.Data.Certificates.length || edits.Data.Insures && edits.Data.Insures.length || edits.Data.Others && edits.Data.Others.length">
								<el-collapse v-model="certCollapseActive">
									<el-collapse-item v-for="(item, i) in edits.Data.Certificates" :key="i"
										:name="item.CertificateId">
										<div slot="title" class="f-b-c f1">
											<span>{{ item.CertificateName }}</span>
											<div class="f--c operation">
												<div class="switch"
													:class="{open: certCollapseActive.includes(item.CertificateId)}">
													{{ certCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
												</div>
												<!-- <div @click.stop="info.Certificates.splice(i, 1)">删除</div> -->
											</div>
										</div>
										<template v-for="(filed, index) in item.CertificateFileds">
											<div class="form-6-col" :key="index" v-if="index % 2 == 0">
												<el-form-item :label="filed.FiledName">
													<el-input placeholder="请输入" v-model="filed.FiledValue"
														v-if="filed.TextType == 2"></el-input>
													<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
														v-model="filed.FiledValue"
														v-if="filed.TextType == 3"></el-date-picker>
													<custom-date-range v-model="filed.FiledValue"
														v-if="filed.TextType == 4" />
												</el-form-item>
												<el-form-item
													:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
													v-if="item.CertificateFileds[index + 1]">
													<el-input placeholder="请输入"
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
													<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
													<custom-date-range
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 4" />
												</el-form-item>
												<div v-else></div>
											</div>
										</template>
										<el-form-item label="照片" v-if="item.CertificateName == '行驶证'">
											<custom-upload :accept="'.jpeg,.png,.jpg,.gif'"
												:fileList.sync="item.CertificateManagePhotos" list-type="picture-card"
												@OcrChange="onChangeFile(item,i)">
												<i class="el-icon-plus"></i>
											</custom-upload>
										</el-form-item>
										<el-form-item label="照片" v-else>
											<custom-upload :accept="'.jpeg,.png,.jpg,.gif'"
												:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
												<i class="el-icon-plus"></i>
											</custom-upload>
										</el-form-item>
									</el-collapse-item>
								</el-collapse>
							</div>
							<div v-if="edits.Data.Insures && edits.Data.Insures.length">
								<div class="split-line"></div>
								<div class="f-b-c">
									<div class="title">车辆保险信息</div>
									<!-- <el-button type="primary" @click="chooseCert(insureCollapseActive, info.Insures, 2)">添加保险</el-button> -->
								</div>
								<el-collapse v-model="insureCollapseActive">
									<el-collapse-item v-for="(item, i) in edits.Data.Insures" :key="i"
										:name="item.CertificateId">
										<div slot="title" class="f-b-c f1">
											<span>{{ item.CertificateName }}</span>
											<div class="f--c operation">
												<div class="switch"
													:class="{open: insureCollapseActive.includes(item.CertificateId)}">
													{{ insureCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
												</div>
												<!-- <div @click.stop="info.Insures.splice(i, 1)">删除</div> -->
											</div>
										</div>
										<template v-for="(filed, index) in item.CertificateFileds">
											<div class="form-6-col" :key="index" v-if="index % 2 == 0">
												<el-form-item :label="filed.FiledName">
													<el-input placeholder="请输入" v-model="filed.FiledValue"
														v-if="filed.TextType == 2"></el-input>
													<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
														v-model="filed.FiledValue"
														v-if="filed.TextType == 3"></el-date-picker>
													<custom-date-range v-model="filed.FiledValue"
														v-if="filed.TextType == 4" />
												</el-form-item>
												<el-form-item
													:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
													v-if="item.CertificateFileds[index + 1]">
													<el-input placeholder="请输入"
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
													<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
													<custom-date-range
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 4" />
												</el-form-item>
												<div v-else></div>
											</div>
										</template>
										<el-form-item label="照片">
											<custom-upload :accept="'.jpeg,.png,.jpg,.gif'"
												:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
												<i class="el-icon-plus"></i>
											</custom-upload>
										</el-form-item>
									</el-collapse-item>
								</el-collapse>
							</div>
							<div v-if="edits.Data.Others && edits.Data.Others.length">
								<div class="split-line"></div>
								<div class="f-b-c">
									<div class="title">其他信息</div>
									<!-- <el-button type="primary" @click="chooseCert(ontherCollapseActive, info.Others, 3)">添加</el-button> -->
								</div>
								<el-collapse v-model="ontherCollapseActive">
									<el-collapse-item v-for="(item, i) in edits.Data.Others" :key="i"
										:name="item.CertificateId">
										<div slot="title" class="f-b-c f1">
											<span>{{ item.CertificateName }}</span>
											<div class="f--c operation">
												<div class="switch"
													:class="{open: ontherCollapseActive.includes(item.CertificateId)}">
													{{ ontherCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
												</div>
												<!-- <div @click.stop="info.Others.splice(i, 1)">删除</div> -->
											</div>
										</div>
										<template v-for="(filed, index) in item.CertificateFileds">
											<div class="form-6-col" :key="index" v-if="index % 2 == 0">
												<el-form-item :label="filed.FiledName">
													<el-input placeholder="请输入" v-model="filed.FiledValue"
														v-if="filed.TextType == 2"></el-input>
													<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
														v-model="filed.FiledValue"
														v-if="filed.TextType == 3"></el-date-picker>
													<custom-date-range v-model="filed.FiledValue"
														v-if="filed.TextType == 4" />
												</el-form-item>
												<el-form-item
													:label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
													v-if="item.CertificateFileds[index + 1]">
													<el-input placeholder="请输入"
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
													<el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd"
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
													<custom-date-range
														v-model="item.CertificateFileds[index + 1].FiledValue"
														v-if="item.CertificateFileds[index + 1].TextType == 4" />
												</el-form-item>
												<div v-else></div>
											</div>
										</template>
										<el-form-item label="照片">
											<custom-upload :accept="'.jpeg,.png,.jpg,.gif'"
												:fileList.sync="item.CertificateManagePhotos" list-type="picture-card">
												<i class="el-icon-plus"></i>
											</custom-upload>
										</el-form-item>
									</el-collapse-item>
								</el-collapse>
							</div>
						</el-card>
					</el-form>
				</el-scrollbar>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="dialogEditClose()">取消</el-button>
					<el-button type="primary" :loading="edits.dialogSaveLoading" @click='dialogEditSave()'
						slot="reference">提交</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 编辑弹层 结束 -->

		<!--编辑弹层 开始-->
		<el-dialog title="技术档案" :visible.sync="filesSshows" :close-on-click-modal="false" @close="dialogfilesClose()"
			width="70%">
			<template>
				<el-scrollbar class='scrollbar'>
					<el-tabs v-model="activeName" type="card">
						<el-tab-pane label="基本信息" name="Table1">
							<Table1 ref='Table1' :id='id' :datas='datas' />
						</el-tab-pane>
						<el-tab-pane label="检查和评定登记表" name="Table2">
							<Table2 ref='Table2' :id='id' :EnterpriseId="datas.EnterpriseId" />
						</el-tab-pane>
						<el-tab-pane label="维护和修理登记表" name="Table3">
							<Table3 ref='Table3' :VehicleNo="VehicleNo" />
						</el-tab-pane>
						<el-tab-pane label="主要部件更换登记表" name="Table4">
							<Table4 ref='Table4' :id='id' :EnterpriseId="datas.EnterpriseId" />
						</el-tab-pane>
						<el-tab-pane label="变更登记表" name="Table5">
							<Table5 ref='Table5' :id='id' :EnterpriseId="datas.EnterpriseId" />
						</el-tab-pane>
						<el-tab-pane label="行驶里程登记表" name="Table6">
							<Table6 ref='Table6' :id='id' :EnterpriseId="datas.EnterpriseId" />
						</el-tab-pane>
						<el-tab-pane label="机损事故登记表" name="Table7">
							<Table7 ref='Table7' :id='id' :EnterpriseId="datas.EnterpriseId" />
						</el-tab-pane>
					</el-tabs>
				</el-scrollbar>
				<div slot="footer" class="dialog-footer">

					<el-button type="primary" :loading="edits.dialogSaveLoading" @click='dialogfilesSave()'
						slot="reference">保存</el-button>
					<el-button @click.native="dialogfilesClose()">取消</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 编辑弹层 结束 -->

		<!--编辑弹层 开始-->
		<el-dialog :title="editDriverLine.dialogEditDriverLineTitle" :visible.sync="editDriverLine.dialogDriverLineShow"
			@close="dialogEditDriverLineClose()" class='abow_dialog' width="60%" top='8vh'>
			<template>
				<el-scrollbar class="scrollbar">
					<el-form ref="editsform" :rules="editDriverLine.rules" :model="editDriverLine.Data"
						label-width="60px">
						<!-- <el-form-item label="线路"> -->

						<!-- <el-select placeholder="线路" @change='getDrivingLineValue()'
									v-model="editDriverLine.Data.DrivingLineId" clearable>
									<el-option v-for='(item,i) in lineSelectList' :key='i' :label="item.name"
										:value='item.id'></el-option>
								</el-select> -->
						<!-- <ZYselect url='GetVehicleDrivingLineByVehicleId' placeholder='线路' propid='id'
									propname='text' :val='editDriverLine.Data.DrivingLineId'
									v-model="editDriverLine.Data.DrivingLineId"
									@returnData='getDrivingLineValue($event)' /> -->
						<!-- </el-form-item> -->
						<div class="line-box f-b-c">
							<span>当前线路：{{lineName}}</span>
							<el-button type="primary" @click="onLineAdd()">重新选择</el-button>
						</div>
					</el-form>
					<div id="container"></div>
					<div style="margin-bottom:25px;">
						<el-row>
							<el-col :span='12' style="padding-left:5px;margin-top:10px">
								<el-input :value='editDriverLine.Data.SimpleStartAddress' disabled>
									<template slot="prepend">起运地</template>
								</el-input>
							</el-col>
							<el-col :span='12' style="padding-left:5px;margin-top:10px">
								<el-input :value='editDriverLine.Data.SimpleEndAddress' disabled>
									<template slot="prepend">目的地</template>
								</el-input>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='8' style="padding-left:5px;margin-top:10px">
								<el-input :value='(editDriverLine.Data.Distance/1000).toFixed(2)' disabled>
									<template slot="prepend">驾车距离</template>
									<template slot="append">公里</template>
								</el-input>
							</el-col>
							<el-col :span='8' style="padding-left:5px;margin-top:10px">
								<el-input :value='(editDriverLine.Data.Tolls_distance/1000).toFixed(2)' disabled>
									<template slot="prepend">收费路段</template>
									<template slot="append">公里</template>
								</el-input>
							</el-col>
							<el-col :span='8' style="padding-left:5px;margin-top:10px">
								<el-input :value='editDriverLine.Data.Tolls' disabled>
									<template slot="prepend">收费金额</template>
									<template slot="append">元</template>
								</el-input>
							</el-col>
						</el-row>
					</div>
				</el-scrollbar>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="dialogEditDriverLineClose()">取消</el-button>
					<el-button type="primary" :loading="editDriverLine.dialogSaveDriverLineLoading"
						@click='dialogEditDriverLineSave()' slot="reference">提交</el-button>
				</div>
			</template>
		</el-dialog>
		<el-dialog v-dialog-drag title="选择线路" :visible.sync="lineShow" :close-on-click-modal="false"
			:append-to-body="true" width="70%" top="5vh">
			<!-- <Course @getValue="getValueCourse($event)" /> -->
			<LineLibrary @onSelectLine="onSelectLine" />
		</el-dialog>
		<!-- 编辑弹层 结束 -->
		<setVehicleRoute ref="setVehicleRoute" @success="handleSearch" />
		<info ref="info" @success="handleSearch" />
    <qr-code ref="qrCode"></qr-code>
    <qr-code-2 ref="qrCode2"></qr-code-2>
	</page-layout>
	<!-- <DrivingLine ref='line' v-show="!dislogShow"></DrivingLine> -->
</template>
<script>
	import API_BASIC from "@/api/api_basic";
	import API_ENTERPRISE from "@/api/api_enterprise";
	import RULECONFIG from "@/common/ruleConfig";
	import upload_mixin from "@/mixins/upload-mixin.js";
	import request_mixin from "@/mixins/request-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import Download from "@/mixins/Download.js";
	import ZYselect from '@/components/common/zy_select'
	import Qs from "qs";
	import Table1 from "./Vechicles/table_1.vue"
	import Table2 from "./Vechicles/table_2.vue"
	import Table3 from "./Vechicles/table_3.vue"
	import Table4 from "./Vechicles/table_4.vue"
	import Table5 from "./Vechicles/table_5.vue"
	import Table6 from "./Vechicles/table_6.vue"
	import Table7 from "./Vechicles/table_7.vue"
import QrCode from "./qrCode.vue";


	import {
		lazyAMapApiLoaderInstance
	} from 'vue-amap'

	import setVehicleRoute from './setVehicleRoute'
	import DrivingLine from './DrivingLine/DrivingLineCom.vue'
	import LineLibrary from './DrivingLine/LineLibrary.vue'
	import info from './vehicleInfo';
import QrCode2 from './qrCode2.vue';
	const defaultInfo = {
		LicensePlateNumber: '',
		ArchivesNo: '',
		VehicleTypeId: '',
		DepartmentId: '',
		DriverName: '',
		DriverId: '',
		EnterpriseId: '',
		CarStatus: '',
		Remark: '',
		Certificates: [],
		Insures: [],
		Others: [],
		OtherFiles: [],
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	const certKeysName = {
		Certificates: '证件',
		Insures: '保险',
		Others: '其他'
	};
	const collapses = [
		'certCollapseActive',
		'insureCollapseActive',
		'ontherCollapseActive',
	]
	export default {
		components: {
			ZYselect,
			Table1,
			Table2,
			Table3,
			Table4,
			Table5,
			Table6,
			Table7,
			setVehicleRoute,
			info,
			DrivingLine,
			LineLibrary,
      QrCode,
	QrCode2
		},
		mixins: [request_mixin, Download, upload_mixin, Import_export],

		data() {
			return {
				VehicleId: "",
				VehicleNo: "",
				lineName: '',
				lineShow: false,
				lineSelectList: [],
				LicensePlateNumber: '',
				datas: {},
				id: 0,
				activeName: 'Table1',
				filesSshows: false, //技术档案弹框
				loading: false, //页面加载遮罩层显示状态
				VehicleTypeList: [], //车辆类型下拉
				StatusList: [], //状态列表
				VehicleTechnologyLevelList: [], //车辆技术等级列表
				DepartmentCom: [],
				certCollapseActive: [],
				insureCollapseActive: [],
				ontherCollapseActive: [],
				Whether: [
					//下拉框是否选择列表
					{
						Code: "1",
						Text: "是"
					},
					{
						Code: "0",
						Text: "否"
					},
				],
				// IsDangerous:true, v-if="IsDangerous">
				//查询条件
				filters: {
					// EnterpriseId: "",
					// ArchivesNo: "",
					// DepartmentId: "",
					// LicensePlateNumber: "",
					// VehicleTypeId: "",
					// UserName: "",
					// CarStatus: ""
				},
				//分页
				pages: {
					list: [],
					total: 0,
					page: 1,
					rows: 10
				},
				CarStatusList: [],
				cardListForm: [],
				//编辑
				edits: {
					dialogEditShow: false, //弹窗显示状态
					dialogSaveLoading: false, //保存提交状态
					dialogEditTitle: "", //弹窗标题
					dialogFormLabelWidth: "200px", //弹窗表单label宽度
					//编辑数据
					Data: _extends(defaultInfo),
					//表单验证规则
					rules: {
						SecurityLevel: RULECONFIG.Select("安全等级"),
						VehicleTypeId: RULECONFIG.Text("车辆类型"),
						LicensePlateNumber: RULECONFIG.Text("车牌号"),
						EnterpriseId: RULECONFIG.Select("所属企业"),
						DepartmentId: RULECONFIG.Select("所属部门"),
						// UserName: RULECONFIG.Text("负责人"),
						CarStatus: RULECONFIG.Select("状态"),
						// VehicleGroupSetId: RULECONFIG.Select("所属车队")
					},
				},
				editDriverLine: {
					dialogDriverLineShow: false, //弹窗显示状态
					dialogSaveDriverLineLoading: false, //保存提交状态
					dialogEditDriverLineTitle: "", //弹窗标题
					Data: {
						type: 1,
						VehicleId: 0,
						DrivingLineId: 0,
						DepartmentId: '',
						StartAddressPois: {
							Address: "",
							Latitude: 0,
							Longitude: 0,
						},
						EndAddressPois: {
							Address: "",
							Latitude: 0,
							Longitude: 0,
						},
						WayAddressPois: [],
						SimpleStartAddress: '',
						SimpleEndAddress: '',
						DrivingPolicy: '',
						Tolls: 0,
						Tolls_distance: 0,
						Distance: 0,
						VehicleGroupSetId: ""
					},
					rules: {},
					multipleSelection: []
				},
			}
		},
		//自定义方法
		methods: {
				showQrCode(row) {
					console.log(row,'9999999999')
				this.$refs.qrCode.show(row);
				},
			showQrCode2(){

				this.$refs.qrCode2.show(this.multipleSelection);
			},
			getDownCache(data) {
				if (data) {
					const loading = this.$loading({
						lock: true,
						text: '数据加载中，请稍等...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, .5)'
					});
					this.Post('/DownVehicleFiles', data, 'blob').then(res => {
						var blob = new Blob([res], {
							type: "application/vnd.ms-excel;charset=utf-8",
						});
						const URL = window.URL || window.webkitURL;
						const downloadElement = document.createElement("a");
						const href = URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '车辆档案.zip'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						URL.revokeObjectURL(href); // 释放掉blob对
						loading.close()
					}).catch(err => {
						loading.close()
					})

				}
			},
			DownCache() {
				if (this.multipleSelection && this.multipleSelection.length > 0) {
					let VehicleIds = this.multipleSelection.map(item => item.VehicleId)
					this.getDownCache(VehicleIds)
					this.$refs.listTable.clearSelection();
				} else {
					this.$message.error('请先选择需要下载的车辆')
					return
					// this.$confirm(`确定导出${this.pages.total}条数据吗?`, '提示', {
					// 	confirmButtonText: '确定',
					// 	cancelButtonText: '取消',
					// 	type: 'warning'
					// }).then((res) => {
					// 	if (res) {
					// 		this.downloadmbs(10, data, this.filters)
					// 	}
					// })
				}
			},
			isValidDateFormat(dateStr) {
				dateStr = dateStr.replace(/[.]/g, '-')
				var regEx = /^\d{4}-\d{1,2}-\d{1,2}$/;
				if (!dateStr.match(regEx)) return false; //格式不正确
				var d = new Date(dateStr);
				if (Number.isNaN(d.getTime())) return false; //无效日期
				return d.toISOString().slice(0, 10) === dateStr;
			},
			onChangeFile(item, i) {
				let arr = ""
				if (item.CertificateManagePhotos && item.CertificateManagePhotos.length > 0) {
					arr = item.CertificateManagePhotos[item.CertificateManagePhotos.length - 1].viewurl.toString()
				} else {
					return
				}
				this.$nextTick(() => {
					let that = this;
					this.Get('/AliOCR?url=' + arr + '&type=3').then(res => {
						if (res.Code == 200) {
							let DataObj = JSON.parse(res.obj.Body.Data)
							// let Data = DataObj.data.face ? DataObj.data.face.data : DataObj.data.back.data
							let Data = {}
							if (DataObj.data.face && DataObj.data.back) {
								Data = {
									...DataObj.data.face.data,
									...DataObj.data.back.data
								}
							} else {
								if (DataObj.data.face) {
									Data = DataObj.data.face.data
								} else {
									Data = DataObj.data.back.data
								}
							}
							item.CertificateFileds.map((item) => {
								if (item.FiledName.includes("证件编号") && item.TextType == 2 && Data
									.recordNumber) {
									item.FiledValue = Data.recordNumber
								}
								if (item.FiledName.includes("有效期") && item.TextType == 4 && Data
									.registrationDate && Data.remarks) {
									if (this.isValidDateFormat(Data.registrationDate) && this
										.isValidDateFormat(Data.remarks.slice(7))) {
										item.FiledValue = Data.registrationDate + ',' + Data
											.remarks.slice(7) + ',0'
									} else {
										item.FiledValue = ''
										this.$message.error('证件有效期模糊,无法识别,请确认照片字迹清晰后上传')
									}
								}
								if (item.FiledName.includes("车牌号码") && item.TextType == 2 && Data
									.licensePlateNumber) {
									item.FiledValue = Data.licensePlateNumber
								}
								if (item.FiledName.includes("车辆类型") && item.TextType == 2 && Data
									.vehicleType) {
									item.FiledValue = Data.vehicleType
								}
								if (item.FiledName.includes("所有人") && item.TextType == 2 && Data
									.owner) {
									item.FiledValue = Data.owner
								}
								if (item.FiledName.includes("住址") && item.TextType == 2 && Data
									.address) {
									item.FiledValue = Data.address
								}
								if (item.FiledName.includes("使用性质") && item.TextType == 2 && Data
									.useNature) {
									item.FiledValue = Data.useNature
								}
								if (item.FiledName.includes("品牌型号") && item.TextType == 2 && Data
									.model) {
									item.FiledValue = Data.model
									that.edits.Data.Brand = Data.model
								}
								if (item.FiledName.includes("车辆识别代号") && item.TextType == 2 && Data
									.vinCode) {
									item.FiledValue = Data.vinCode
								}
								if (item.FiledName.includes("发动机号码") && item.TextType == 2 && Data
									.engineNumber) {
									item.FiledValue = Data.engineNumber
								}
								if (item.FiledName.includes("总质量") && item.TextType == 2 && Data
									.totalWeight) {
									item.FiledValue = Data.totalWeight
								}
								if (item.FiledName.includes("外廊尺寸") && item.TextType == 2 && Data
									.overallDimension) {
									item.FiledValue = Data.overallDimension
								}
								if (item.FiledName.includes("整备质量") && item.TextType == 2 && Data
									.curbWeight) {
									item.FiledValue = Data.curbWeight
								}
								if (item.FiledName.includes("注册日期") && item.TextType == 3 && Data
									.registrationDate) {
									if (this.isValidDateFormat(Data.registrationDate)) {
										item.FiledValue = Data.registrationDate
									} else {
										item.FiledValue = ''
										this.$message.error('证件注册日期模糊,无法识别,请确认照片字迹清晰后上传')
									}
								}
								if (item.FiledName.includes("发证日期") && item.TextType == 3 && Data
									.issueDate) {
									if (this.isValidDateFormat(Data.issueDate)) {
										item.FiledValue = Data.issueDate
									} else {
										item.FiledValue = ''
										this.$message.error('证件发证日期模糊,无法识别,请确认照片字迹清晰后上传')
									}

								}
							})
							this.$forceUpdate()
						}
					})
				})
			},
			uploadPortrait(res, file) {
				this.$set(this.edits.Data, 'Photo', res.files[0].url);
			},
			handleSelectionChange(val) {
				this.multipleSelection = val
			},
			downloadFile(data) {
				if (this.multipleSelection && this.multipleSelection.length > 0) {
					let params = {
						...this.filters,
						VehicleIds: this.multipleSelection.map(item => item.VehicleId)
					}

					this.downloadmbs(50, data, params)
					this.$refs.listTable.clearSelection();
				} else {
					this.$confirm(`确定导出${this.pages.total}条数据吗?`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then((res) => {
						if (res) {
							this.downloadmbs(50, data, this.filters)
						}
					})
				}
			},
			onLineAdd() {
				this.lineShow = true
			},
			chooseUser() {
				this.$chooseUser({
					single: false,
				}).then(res => {
					this.edits.Data.UserName = res.UserName;
					this.edits.Data.UserId = res.UserId;

				})
			},
			getFormValue(e) {
				this.edits.Data.CarStatus = e
			},
			dialogfilesSave() {
				this.$refs[this.activeName].submits();
			},
			dialogfilesClose() {
				this.filesSshows = false;
				if (this.$refs[this.activeName].reset) {
					this.$refs[this.activeName].reset();
				}
			},

			download(url, filename) {
				const loading = this.$loading({
					lock: true,
					text: '下载中,请稍等...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});

				this.Post('/' + url, {}, 'blob').then(res => {
					loading.close();
					this.readFileDownload(res, filename)
				})
			},

			dialogfilesOpen(index, row) {
				this.VehicleNo = row.LicensePlateNumber
				this.Get('/GetTechnicalArchives', {
					VehicleId: row.VehicleId
				}).then(res => {
					if (res.status == 2000) {
						this.datas = res.data
					} else {
						this.datas = {}
					}
					this.datas.EnterpriseId = row.EnterpriseId
					this.LicensePlateNumber = row.LicensePlateNumber
					this.id = row.VehicleId
					this.filesSshows = true;
					this.$nextTick(() => {
						if (this.$refs[this.activeName].show) {
							this.$refs[this.activeName].show();
						}
					})
				})
			},
			setCertsA(list, info) {
				list.forEach(item => {
					Object.keys(certKeysName).forEach((key, index) => {
						if (!info[key]) {
							this.$set(info, key, []);
						}
						// 已存在的不用重复添加
						if (item.CertificateClassification == (index + 1) && info[key].every(cItem => cItem
								.CertificateId != item.CertificateId)) {
							info[key].push(item);
							this[collapses[index]].push(item.CertificateId);
						}
					});
				});
			},
			setCerts(list, info) {
				if (list && list.length > 0) {
					list.forEach(item => {
						Object.keys(certKeysName).forEach((key, index) => {
							if (!info[key]) {
								this.$set(info, key, []);
							}
							// 已存在的不用重复添加
							if (item.CertificateClassification == (index + 1) && info[key].every(cItem =>
									cItem
									.CertificateId != item.CertificateId)) {
								info[key].push(item);
								this[collapses[index]].push(item.CertificateId);
							}
						});
					});
				} else {
					this.edits.Data.Certificates = []
					this.edits.Data.CertificateList = []
					this.edits.Data.Insures = []
					this.edits.Data.OtherFiles = []
					this.edits.Data.Others = []
					this.edits.Data.certCollapseActive = []
					this.edits.Data.insureCollapseActive = []
					this.edits.Data.ontherCollapseActive = []
				}

			},
			async changeType(val) {
				let item = this.VehicleTypeList.find(item => item.VehicleTypeId == val);
				// 剔除没有保存到数据库的数据
				Object.keys(certKeysName).forEach((key, index) => {
					this.edits.Data[key] = this.edits.Data[key].filter(item => !!item.CertificateManageId);
					this[collapses[index]] = this.edits.Data[key].map(item => item.CertificateId);
				});
				if (item) {
					// CertificateClassification: 1证书 2保险 3其他
					let certRes = await this.Get(`/GetVehicleTypeCertificates?vehicleTypeId=${item.VehicleTypeId}`);
					if (certRes.status == 2000) {
						this.setCerts(certRes.data || [], this.edits.Data);
					}
				}
			},
			//打开弹窗
			async dialogEditOpen(index, row) {
				if (row) {
					this.$nextTick(() => {
						setTimeout(() => {
							this.edits.Data = JSON.parse(JSON.stringify(row));
							this.edits.Data.SecurityLevel = this.edits.Data.SecurityLevel.toString()
							this.edits.Data.CarStatus = this.edits.Data.CarStatus.toString();
							this.edits.dialogEditTitle = "编辑";
							if (this.edits.Data.Certificates && this.edits.Data.Certificates.length >
								0) {
								this.certCollapseActive = this.edits.Data.Certificates.map(item => item
									.CertificateId);
							}
							if (this.edits.Data.Insures && this.edits.Data.Insures.length > 0) {
								this.insureCollapseActive = this.edits.Data.Insures.map(item => item
									.CertificateId);
							}
							if (this.edits.Data.Other && this.edits.Data.Other.length > 0) {
								this.ontherCollapseActive = this.edits.Data.Others.map(item => item
									.CertificateId);
							}
							this.setCertsA(this.edits.Data.CertificateList || [], this.edits.Data);
						}, 500)
					})

				} else {
					this.edits.dialogEditTitle = "新增";
					// let res = await this.Get(`/GetCertificateList?certificateClassification=${1}&certificateType=${3}`);
					this.edits.Data = {
						type: 1,
						LicensePlateNumber: '',
						ArchivesNo: '',
						VehicleTypeId: '',
						VehicleTypeCode: '',
						SecurityLevel: '1',
						EnterpriseId: '',
						DepartmentId: '',
						UserName: '',
						UserId: '',
						CarStatus: '1',
						Remark: '',
						Certificates: [],
						Insures: [],
						Others: [],
						OtherFiles: [],
            Brand:""
					}
					// if (res.status == 2000) {
					// 	if (res.data && res.data.length > 0) {
					// 		res.data.forEach(item => {
					// 			if (item.CertificateClassification == 1) {
					// 				this.edits.Data.Certificates.push(item)
					// 			} else if (item.CertificateClassification == 2) {
					// 				this.edits.Data.Insures.push(item)
					// 			} else if (item.CertificateClassification == 3) {
					// 				this.edits.Data.Insures.push(item)
					// 			}
					// 		})
					// 	}
					// }
					// this.setCerts(res.data.CertificateList || [], this.edits.Data);
					// this.certCollapseActive = this.edits.Data.Certificates.map(item => item.CertificateId);
					// this.insureCollapseActive = this.edits.Data.Insures.map(item => item.CertificateId);
					// this.ontherCollapseActive = this.edits.Data.Others.map(item => item.CertificateId);
				}
				this.edits.dialogEditShow = true;
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0
				});
			},
			//初始化弹窗数据
			dialogEditInit() {
				var that = this;
				that.edits.Data = {
					LicensePlateNumber: '',
					ArchivesNo: '',
					VehicleTypeCode: '',
					SecurityLevel: '1',
					EnterpriseId: '',
					DepartmentId: '',
					UserName: '',
					UserId: '',
					CarStatus: '1',
					Remark: '',
					Certificates: [],
					Insures: [],
					Others: [],
					OtherFiles: [],
				};
			},
			//关闭弹窗
			dialogEditClose() {
				var that = this;
				this.$refs.editsform.resetFields();
				that.upload.arrFiles = [
					[],
					[],
					[],
					[],
					[],
					[],
					[]
				];
				that.edits.dialogEditShow = false;
			},
			getEditDriverLine() {
				this.VehicleId = ""
				this.editDriverLine = {
					dialogDriverLineShow: false, //弹窗显示状态
					dialogSaveDriverLineLoading: false, //保存提交状态
					dialogEditDriverLineTitle: "", //弹窗标题
					Data: {
						VehicleId: 0,
						DrivingLineId: 0,
						DepartmentId: '',
						StartAddressPois: {
							Address: "",
							Latitude: 0,
							Longitude: 0,
						},
						EndAddressPois: {
							Address: "",
							Latitude: 0,
							Longitude: 0,
						},
						WayAddressPois: [],
						SimpleStartAddress: '',
						SimpleEndAddress: '',
						DrivingPolicy: '',
						Tolls: 0,
						Tolls_distance: 0,
						Distance: 0,
					},
					rules: {},
				}
			},
			//打开弹窗
			dialogEditDriverLineOpen(index, row) {
				this.editDriverLine.dialogDriverLineShow = true;
				this.editDriverLine.dialogEditDriverLineTitle = "线路";
				this.editDriverLine.Data.VehicleId = row.VehicleId;
				this.VehicleId = row.VehicleId;
				// this.editDriverLine.Data.DrivingLineId = row.DrivingLineId == null || row.DrivingLineId == 0 ? "" : row
				// 	.DrivingLineId.toString();

				this.$nextTick(() => {
					this.getVehicleIdList(row.VehicleId)

				})
			},
			getVehicleIdList(Id) {
				this.Get('/GetVehicleDrivingLineByVehicleId?vehicleId=' + Id).then((res) => {
					if (res.status == 2000) {
						if (res.data) {
							this.editDriverLine.Data = res.data
							this.lineName = res.data.DrivingLineName
							this.getDrivingLine();
						} else {
							this.lineName = '暂无数据'
						}
					}
				})
			},
			dialogEditDriverLineClose() {
				this.editDriverLine.dialogDriverLineShow = false;
				this.getEditDriverLine()
			},
			dialogEditDriverLineSave() {
				var that = this;
				let params = {
					VehicleDrivingLineId: that.editDriverLine.Data.VehicleDrivingLineId,
					VehicleId: that.VehicleId,
					DrivingLineId: that.editDriverLine.Data.DrivingLineId
				};
				that.editDriverLine.Data.dialogSaveDriverLineLoading = true;
				API_ENTERPRISE.SaveVehicleDrivingLine(params).then((result) => {
					if (result.status != 2000) {
						this.$message({
							message: result.message,
							type: "error",
						});
					} else {
						this.$message({
							message: "保存成功",
							type: "success",
						});
						that.GetList();
					}
					that.editDriverLine.Data.dialogSaveDriverLineLoading = true;
					this.editDriverLine.dialogDriverLineShow = false;
				});
			},
			getDrivingLineValue(e) {
				this.editDriverLine.Data.DrivingLineId = e;
				this.getDrivingLine();
			},
			onSelectLine(row) {
				this.lineShow = false
				let res = JSON.parse(JSON.stringify(row))
				this.lineName = row.DrivingLineName
				this.editDriverLine.Data.DrivingPolicy = res.DrivingPolicy;
				this.editDriverLine.Data.StartAddressPois = res.StartAddressPois;
				this.editDriverLine.Data.SimpleStartAddress = res.SimpleStartAddress;
				this.editDriverLine.Data.SimpleEndAddress = res.SimpleEndAddress;
				this.editDriverLine.Data.EndAddressPois = res.EndAddressPois;
				this.editDriverLine.Data.WayAddressPois = res.WayAddressPois;
				this.editDriverLine.Data.Distance = res.Distance;
				this.editDriverLine.Data.Tolls_distance = res.Tolls_distance;
				this.editDriverLine.Data.Tolls = res.Tolls;
				this.editDriverLine.Data.DrivingLineId = res.DrivingLineId
				this.editDriverLine.Data.VehicleDrivingLineId = res.VehicleDrivingLineId
				this.CanvasDrivingLine();
			},
			getDrivingLine() {
				let that = this;
				let id = this.editDriverLine.Data.DrivingLineId;
				//
				if (id != 0) {
					// this.Get('/GetDrivingLine', {
					// 	id
					// }).then(res => {
					this.Get('/GetVehicleDrivingLineByVehicleId?vehicleId=' + this.VehicleId).then(res => {
						if (res.status == 2000) {
							that.editDriverLine.Data.DrivingPolicy = res.data.DrivingPolicy;
							that.editDriverLine.Data.StartAddressPois = res.data.StartAddressPois;
							that.editDriverLine.Data.SimpleStartAddress = res.data.SimpleStartAddress;
							that.editDriverLine.Data.SimpleEndAddress = res.data.SimpleEndAddress;
							that.editDriverLine.Data.EndAddressPois = res.data.EndAddressPois;
							that.editDriverLine.Data.WayAddressPois = res.data.WayAddressPois;
							that.editDriverLine.Data.Distance = res.data.Distance;
							that.editDriverLine.Data.Tolls_distance = res.data.Tolls_distance;
							that.editDriverLine.Data.Tolls = res.data.Tolls;
							that.$nextTick(() => {
								that.CanvasDrivingLine()
							})
						}
					})
				} else {
					that.editDriverLine.Data.DrivingPolicy = "";
					that.editDriverLine.Data.SimpleStartAddress = "";
					that.editDriverLine.Data.SimpleEndAddress = "";
					that.editDriverLine.Data.StartAddressPois = {
						Address: ''
					};
					that.editDriverLine.Data.EndAddressPois = {
						Address: ''
					};
					that.editDriverLine.Data.WayAddressPois = [];
					that.editDriverLine.Data.Distance = 0;
					that.editDriverLine.Data.Tolls_distance = 0;
					that.editDriverLine.Data.Tolls = 0;
					that.$nextTick(() => {
						that.CanvasDrivingLine()
					})
				}
			},
			CanvasDrivingLine() {
				let that = this;
				lazyAMapApiLoaderInstance.load().then(() => {
					//基本地图加载
					var map = new AMap.Map("container", {
						resizeEnable: true,
					});
					let DrivingPolicy;
					if (that.editDriverLine.Data.DrivingPolicy == "AMap.DrivingPolicy.LEAST_TIME") {
						DrivingPolicy = AMap.DrivingPolicy.LEAST_TIME
					} else if (that.editDriverLine.Data.DrivingPolicy == "AMap.DrivingPolicy.LEAST_FEE") {
						DrivingPolicy = AMap.DrivingPolicy.LEAST_FEE
					} else if (that.editDriverLine.Data.DrivingPolicy == "AMap.DrivingPolicy.LEAST_DISTANCE") {
						DrivingPolicy = AMap.DrivingPolicy.LEAST_DISTANCE
					} else {
						DrivingPolicy = AMap.DrivingPolicy.REAL_TRAFFIC
					}
					//构造路线导航类
					var driving = new AMap.Driving({
						policy: DrivingPolicy,
						map: map,
					});
					var points = [];
					//if(this.editDriverLine.Data.StartAddressPois.Address!=""&&this.editDriverLine.Data.EndAddressPois.Address!=""){
					points.push({
						keyword: this.editDriverLine.Data.StartAddressPois.Address
					});
					this.editDriverLine.Data.WayAddressPois.forEach(element => {
						points.push({
							keyword: element.Address
						});
					});
					points.push({
						keyword: this.editDriverLine.Data.EndAddressPois.Address
					});
					// 根据起终点经纬度规划驾车导航路线
					driving.search(points, function(status, result) {
						// result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
						if (status === 'complete') {
							console.log('绘制驾车路线完成')
						} else {
							console.log('获取驾车数据失败：' + result)
						}
					});
					//}
				});
			},
			//保存弹窗数据
			dialogEditSave() {
				var that = this;
				that.edits.dialogSaveLoading = false
				that.edits.Data.RegistrationCertificateFiles = that.upload.arrFiles[1];
				that.edits.Data.DrivingPermitFiles = that.upload.arrFiles[2]
				that.edits.Data.TransportCertificateFiles = that.upload.arrFiles[3]
				that.edits.Data.AnnualReviewFiles = that.upload.arrFiles[4]
				// that.edits.Data.OtherFiles = that.upload.arrFiles[5]
				that.edits.Data.SafetyInsuranceFiles = that.upload.arrFiles[6]
				that.edits.Data.SecurityLevel = parseInt(that.edits.Data.SecurityLevel)
				// if(that.edits.Data.Certificates && that.edits.Data.Certificates.length > 0){
				// 	for(let k=0;k<that.edits.Data.Certificates.length; k++){
				// 		let kfc = that.edits.Data.Certificates[k]
				// 		if(kfc.CertificateName == '行驶证'){
				// 			if(kfc.CertificateManagePhotos && kfc.CertificateManagePhotos.length < 2){
				// 				this.$message.error(`${kfc.CertificateName}的照片不能少于2张`);
				// 				return false;
				// 			}
				// 		}
				// 	}
				// }
				that.$refs.editsform.validate((valid) => {
					if (valid) {
						that.edits.dialogSaveLoading = true;
						API_ENTERPRISE.SaveVehicle(that.edits.Data).then((result) => {
							if (result.status != 2000) {
								this.$message({
									message: result.message,
									type: "error",
								});
							} else {
								this.$message({
									message: "保存成功",
									type: "success",
								});

								// that.dialogEditInit();
								that.edits.dialogEditShow = false;
								that.GetList();
							}
							that.edits.dialogSaveLoading = false;
						});
					}
				});
			},

			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.GetList();
			},
			//搜索事件
			handleSearch() {
				this.pages.page = 1;
				this.GetList();
			},

			//加载列表数据
			GetList() {
				let that = this;
				let params = Object.assign({
						page: that.pages.page,
						rows: that.pages.rows,
					},
					that.filters
				);
				that.loading = true;
				API_ENTERPRISE.GetVehicles(params)
					.then(
						function(result) {
							that.loading = false;
							if (result.status == 2000) {
								that.pages.list = result.data.list;
								that.pages.total = result.data.count;
							}
						},
						function(err) {
							that.loading = false;
							that.message.error({
								showClose: true,
								message: err.toString(),
								duration: 2000,
							});
						}
					)
					.catch(function(error) {
						that.loading = false;
						that.message.error({
							showClose: true,
							message: "请求出现异常",
							duration: 2000,
						});
					});

			},
			//删除列表数据
			DeleteData(Id) {
				let that = this;
				that.loading = true;
				API_ENTERPRISE.DeleteVehicle({
						Id: Id,
					})
					.then(
						function(result) {
							that.loading = false;
							if (result.status == 2000) {
								that.$message.success({
									showClose: true,
									message: "删除成功",
									duration: 1500,
								});
								that.GetList();
							} else {
								that.$message.error({
									showClose: true,
									message: result.message,
									duration: 2000,
								});
							}
						},
						function(err) {
							that.loading = false;
							that.$message.error({
								showClose: true,
								message: err.toString(),
								duration: 2000,
							});
						}
					)
			},
			GetDepartments() {
				this.Get('/GetEnterpriseDepartments').then(res => {
					if (res.status == 2000) {
						this.DepartmentCom = res.data
					}
				})
			},
		},
		//页面初始化加载事件
		mounted() {
			this.Post('/GetVehicleTypes', {
				page: 1,
				rows: 999
			}).then(res => {
				if (res.status == 2000) {
					this.VehicleTypeList = res.data.list;
				}
			})
			this.Get('/GetVehicleGroupByArchivesNo').then(res => {
				if (res.status == 2000) {
					this.cardListForm = res.data;
				}
			})
			API_BASIC.GetVehicleTechnologyLevel().then((result) => {
				if (result.status != 2000 || !result.data || result.data.length < 1) {
					return;
				}
				this.VehicleTechnologyLevelList = result.data;
			});
			// API_BASIC.GetVehicleTypeCom().then(result => {
			// 	this.VehicleTypeList = result.data
			// })
			API_BASIC.GetCarStatus().then(result => {
				this.CarStatusList = result.data
			})

			API_BASIC.GetStatusCom().then((result) => {
				if (result.status != 2000 || !result.data || result.data.length < 1) {
					return;
				}
				this.StatusList = result.data;
			});
			this.GetList()
			this.GetDepartments();
		},
		created() {
			var that = this;
			that.upload.arrFiles = [
				[],
				[],
				[],
				[],
				[]
			];
		},

	};
</script>
<style lang="scss" scoped>
	.el-select,
	.el-date-editor {
		width: 100%;
	}

	/deep/ .el-input-number {
		position: relative;
		display: inline-block;
		width: 100% !important;
		line-height: 38px;
	}

	#container {
		width: 100%;
		height: 350px;
	}

	.card_title {
		font-size: 15px;
		font-weight: 700;
	}

	.table {
		width: 100%;
		height: auto;
		text-align: center;
		border-top: 1px #999 solid;
		border-left: 1px #999 solid;
		margin-bottom: 10px;
	}

	.table td {
		border-bottom: 1px #999 solid;
		border-right: 1px #999 solid;
		height: 40px;
	}

	/deep/ .table td .el-input__inner {
		border-radius: 0px;
	}

	/deep/ .el-input__inner {
		// line-height: 40px;
		// height: 40px;
		// vertical-align: middle;
	}

	.abow_dialog {

		/deep/ .el-collapse {
			margin-bottom: 28px;
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

		.form-80-col {
			width: 75%;
		}

		.form-2-col {
			display: flex;

			>div {
				width: 33%;

				&:nth-child(2) {
					margin: 0 20px;
				}
			}
		}

		.form-6-col {
			display: flex;

			>div {
				width: 50%;

				&:nth-child(2) {
					margin: 0 20px;
				}
			}
		}

		/deep/ .el-button--primary.is-plain {
			border-style: dashed;
		}

		.split-line {
			margin: 30px -35px 30px -30px;
			height: 10px;
			background: #F2F2F2;
		}

		/deep/ .el-dialog__body {
			padding: 0 !important;
		}

		/deep/ .el-scrollbar__wrap {
			margin-bottom: 0 !important;
		}

		.form {
			padding: 5px 25px 15px 30px;
			position: relative;

			.portrait {
				position: absolute;
				right: 40px;
				top: 90px;
				width: 200px;
				flex: 1;
				height: 200px;
			}

			.portrait>div {
				height: 100%;
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
		}
	}

	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}

	.line-box {
		padding: 0 30px;
		height: 60px;
		line-height: 60px;
		font-size: 16px;
		font-weight: bold;
	}
</style>
