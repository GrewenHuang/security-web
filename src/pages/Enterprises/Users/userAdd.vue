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
    <el-form
      class="form"
      :rules="rules"
      ref="editsform"
      :model="userInfo"
      :disabled="isType"
    >
      <div style="width: 70%">
        <div class="title">基本信息</div>
        <div class="f-b-c" style="align-items: flex-start">
          <div style="width: 80%;">
            <div class="flex-box">
              <div class="no-spacing">
                <el-form-item
                  class="gutter"
                  label="手机号/登录号"
                  prop="LoginName"
                  ref="LoginName"
                >
                  <el-input
                    placeholder="手机号/登录号"
                    v-model.trim="userInfo.LoginName"
                    maxlength="11"
                    :readonly="
                      userInfo.UserId == 0 || userInfo.UserId == undefined
                        ? false
                        : 'readonly'
                    "
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </div>
              <div class="no-spacing">
                <el-form-item
                  class="gutter"
                  label="姓名"
                  prop="UserName"
                  ref="UserName"
                >
                  <el-input
                    placeholder="姓名"
                    v-model="userInfo.UserName"
                    maxlength="10"
                    show-word-limit
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="flex-box">
              <div class="no-spacing">
                <el-form-item
                  class="gutter"
                  label="岗位"
                  prop="PositionList"
                  ref="PositionList"
                >
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                      <span style="color: #fff;font-size: 14px"
                        >重选岗位后,证照数据将被关联重置,请确认更改后再选择。</span
                      >
                    </div>
                    <span><i class="el-icon-question"></i></span>
                  </el-tooltip>
                  <select-position
                    v-model="userInfo.PositionList"
                    :multiple="false"
                  ></select-position>
                </el-form-item>
                <!-- <el-form-item label="性别" prop="Gender">
									<div class="el-input">
										<el-radio-group size="mini" v-model="userInfo.Gender">
											<el-radio-button :label="item.id" v-for='(item,i) in GenderList'
												:key='i'>{{item.text}}</el-radio-button>
										</el-radio-group>
									</div>
								</el-form-item> -->
              </div>
              <div class="no-spacing">
                <el-form-item
                  class="gutter"
                  label="所属车队"
                  prop="VehicleGroupSetId"
                >
                  <cascader-fleet
                    placeholder="所属车队"
                    clearable
                    v-model="userInfo.VehicleGroupSetId"
                  ></cascader-fleet>
                </el-form-item>
                <!-- <el-form-item class="gutter" label="数据权限" prop="DepartmentList">
										<div class="el-input">
											<custom-tree v-model="userInfo.DepartmentList" :data="DepartmentPositionUser"
												:expand-all="true" :check-strictly="true" :parentJoinChild="true" immediately
												node-key="value" selectedId="DepartmentId"></custom-tree>
										</div>
									</el-form-item> -->
                <!-- 	<el-form-item label="出生日期" class="gutter">
									<el-date-picker v-model="userInfo.Birthday" type="date" clearable
										value-format="yyyy-MM-dd" placeholder="选择日期">
									</el-date-picker>
								</el-form-item> -->
              </div>
            </div>
          </div>
          <div class="portrait">
            <el-upload
              :action="url()"
              :accept="upload.image_suffix"
              :show-file-list="false"
              :on-success="uploadPortrait"
            >
              <img
                v-if="userInfo.Photo"
                :src="userInfo.Photo"
                style="width: 100%; height: 100%"
              />
              <div
                style="
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                "
                v-else
              >
                <div>
                  <i
                    class="
                                            el-icon-plus
                                            avatar-uploader-icon
                                        "
                    style="font-size: 40px"
                  ></i>
                  <div>上传照片</div>
                </div>
              </div>
            </el-upload>
          </div>
        </div>
        <div style="width: 100%">
          <div class="flex-box">
            <div class="no-spacing">
              <el-form-item
                class="gutter"
                label="安全等级"
                prop="SecurityLevel"
                ref="SecurityLevel"
              >
                <select-level
                  v-model="userInfo.SecurityLevel"
                  :multiple="false"
                  :value="userInfo.SecurityLevel"
                ></select-level>
              </el-form-item>
            </div>
            <div class="no-spacing">
              <el-form-item label="备注">
                <el-input
                  maxlength="200"
                  show-word-limit
                  v-model="userInfo.Remark"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="flex-box">
            <div class="no-spacing">
              <el-form-item class="gutter" label="是否在职" prop="OnTheJob">
                <div class="el-input">
                  <el-radio-group size="mini" v-model="userInfo.OnTheJob">
                    <el-radio-button
                      :label="item.id"
                      v-for="(item, i) in WhetherCom"
                      :key="i"
                      >{{ item.text }}</el-radio-button
                    >
                  </el-radio-group>
                </div>
              </el-form-item>
            </div>
            <div class="no-spacing">
              <el-form-item label="入职日期" class="gutter" prop="EntryDate">
                <el-date-picker
                  v-model="userInfo.EntryDate"
                  type="date"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="no-spacing">
              <el-form-item
                class="gutter"
                label="离职日期"
                v-if="userInfo.OnTheJob == 0"
                prop="DepartureDate"
              >
                <el-date-picker
                  v-model="userInfo.DepartureDate"
                  type="date"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  @change="onChageOut"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>

        <div style="margin-top: 10px">
          <div class="f-b-c">
            <div class="title">附件</div>
          </div>
          <div style="margin-top: 10px">
            <el-form-item>
              <div class="f-b-c">
                <customUploadDrag
                  class="w50"
                  @onUpload="handleUpload"
                  :Data="userInfo.OtherFiles"
                  :showFileList="false"
                  :acceptList="[
                    'png',
                    'jpg',
                    'jpeg',
                    'doc',
                    'docx',
                    'xls',
                    'xlsx',
                    'pdf'
                  ]"
                >
                  <div class="f-c-c">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处或<em>点击上传</em>
                    </div>
                  </div>
                </customUploadDrag>
                <div class="f--c w50" style="color: #959595;margin-left: 15px;">
                  <span>支持pdf、doc、jpeg、jpg、png文件</span>
                </div>
              </div>
              <div
                class="file-list"
                v-for="(item, index) in userInfo.OtherFiles"
                :key="index"
              >
                <div class="file-item" @click="$openFile(item.url)">
                  <div class="file f-b-c">
                    <div class="f">
                      <img
                        style="width:30px;height:30px;margin-right: 13px;"
                        :src="
                          $fileIcons[
                            item.name.substring(item.name.lastIndexOf('.') + 1)
                          ]
                        "
                      />
                      <div class="text">
                        <div
                          style="color:#44566C;font-size:12px;line-height: 1;;"
                        >
                          {{ item.name }}
                        </div>
                        <div
                          style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;"
                        >
                          {{ item.size | formatSize }}
                        </div>
                      </div>
                    </div>
                    <div v-if="!isType">
                      <i
                        class="el-icon-error cursor-p"
                        @click="removeFile(index)"
                      ></i>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="split-line"></div>
      <div class="power-box">
        <div class="title">数据权限</div>
        <el-form-item class="gutter" prop="DepartmentList">
          <div class="el-input">
            <custom-tree
              v-model="userInfo.DepartmentList"
              :data="DepartmentPositionUser"
              :expand-all="true"
              :check-strictly="true"
              :parentJoinChild="true"
              immediately
              node-key="value"
              selectedId="DepartmentId"
              :isSelect="true"
              ref="custom"
            ></custom-tree>
          </div>
        </el-form-item>
      </div>
      <div style="width: 70%;">
        <div class="title">企业信息</div>
        <div class="card">
          <div style="display: flex;justify-content: flex-end;margin: 10px 0;">
            <div>
              <el-button
                type="primary"
                @click="addInspectionItem({ levelIndex: 1 })"
                >新增</el-button
              >
            </div>
          </div>
          <div class="card-body">
            <el-table
              border
              :data="userInfo.DepartmentListJustShow"
              :header-cell-style="$tableStyle"
            >
              <el-table-column
                label="序号"
                type="index"
                align="center"
                header-align="center"
                width="50"
              >
              </el-table-column>
              <el-table-column label="企业" align="center">
                <template slot-scope="{ row, $index }">
                  <span v-if="row.isShow && row.EnterpriseId != null">{{
                    row.EnterpriseName
                  }}</span>
                  <!-- <select-enterpirse clearable placeholder="企业" collapseTags
										v-model="row.EnterpriseId" v-else></select-enterpirse> -->
                  <el-select
                    v-else
                    v-model="row.EnterpriseId"
                    placeholder="企业"
                    clearable
                    collapseTags
                    @change="handleChangeSelect(row.EnterpriseId, $index)"
                    @clear="filters.DepartmentId = ''"
                  >
                    <el-option
                      v-for="(item, index) in EnterpriseList"
                      :key="index"
                      :label="item.EnterpriseName"
                      :value="item.EnterpriseId"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="部门" align="center">
                <template slot-scope="{ row, $index }">
                  <div class="el-input">
                    <span v-if="row.isShow && row.DepartmentId != null">{{
                      row.DepartmentName
                    }}</span>
                    <!-- <cascader-department placeholder="部门" clearable v-model="row.DepartmentId"
											:enterpriseId="row.EnterpriseId"
											:disabled="!row.EnterpriseId ? true : false" v-else></cascader-department> -->
                    <el-cascader
                      v-else
                      v-model="row.DepartmentId"
                      clearable
                      @change="handleCascaderChange($event, $index)"
                      :options="row.DepartmentCom"
                      placeholder="部门"
                      :show-all-levels="false"
                      :disabled="
                        !row.EnterpriseId || row.EntryDate ? true : false
                      "
                      :props="{
                        value: 'DepartmentId',
                        label: 'Name',
                        children: 'children',
                        checkStrictly: true
                      }"
                    >
                    </el-cascader>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="入职日期" align="center">
                <template slot-scope="{ row, $index }">
                  <span v-if="row.isShow && row.EntryDateDesc != null">{{
                    row.EntryDateDesc
                  }}</span>
                  <el-date-picker
                    v-model="row.EntryDate"
                    type="date"
                    clearable
                    @change="handleChangeStartData($event, $index)"
                    value-format="yyyy-MM-dd"
                    placeholder="入职日期"
                    v-else
                  >
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="离岗日期" align="center">
                <template slot-scope="{ row, $index }">
                  <span v-if="row.isShow && row.DepartureDateDesc != null">{{
                    row.DepartureDateDesc
                  }}</span>
                  <el-date-picker
                    v-model="row.DepartureDate"
                    type="date"
                    clearable
                    v-else
                    @change="handleChangeEndData($event, $index)"
                    value-format="yyyy-MM-dd"
                    placeholder="离岗日期"
                  >
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="80" align="center">
                <template
                  slot-scope="{ row, $index }"
                  v-if="!row.CanDeleteDepartment"
                >
                  <el-button
                    type="text"
                    text-plain
                    @click="removeInspectionItem(row, $index, 1)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div
        v-if="userInfo.Certificates && userInfo.Certificates.length > 0"
        style="width: 70%"
      >
        <div>
          <div class="f-b-c">
            <div class="title">证件信息</div>
            <!-- <el-button type="primary" @click="chooseCert(collapseActive, userInfo.Certificates, 1)">添加证件</el-button> -->
          </div>
          <el-collapse v-model="collapseActive">
            <el-collapse-item
              v-for="(item, i) in userInfo.Certificates"
              :key="item.CertificateId"
              :name="item.CertificateId"
            >
              <div slot="title" class="f-b-c f1">
                <span>{{ item.CertificateName }}</span>
                <div class="f--c operation">
                  <div
                    class="switch"
                    :class="{
                      open: collapseActive.includes(item.CertificateId)
                    }"
                  >
                    {{
                      collapseActive.includes(item.CertificateId)
                        ? "收起"
                        : "展开"
                    }}
                  </div>
                  <!-- <div @click.stop="userInfo.Certificates.splice(i, 1)" v-if="item.CertificateCategory != 1">删除</div>  -->
                </div>
              </div>
              <template v-for="(filed, index) in item.CertificateFileds">
                <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                  <el-form-item :label="filed.FiledName">
                    <el-input
                      placeholder="请输入"
                      v-model="filed.FiledValue"
                      v-if="filed.TextType == 2"
                      @blur="getCardNo(filed, item)"
                    ></el-input>
                    <el-date-picker
                      placeholder="请选择日期"
                      value-format="yyyy-MM-dd"
                      v-model="filed.FiledValue"
                      v-if="filed.TextType == 3"
                    ></el-date-picker>
                    <custom-date-range
                      v-model="filed.FiledValue"
                      v-if="filed.TextType == 4"
                    />
                  </el-form-item>
                  <el-form-item
                    :label="
                      item.CertificateFileds[index + 1]
                        ? item.CertificateFileds[index + 1].FiledName
                        : ''
                    "
                    v-if="item.CertificateFileds[index + 1]"
                  >
                    <el-input
                      placeholder="请输入"
                      v-model="item.CertificateFileds[index + 1].FiledValue"
                      v-if="item.CertificateFileds[index + 1].TextType == 2"
                      @blur="getCardNo(filed, item)"
                    ></el-input>
                    <el-date-picker
                      placeholder="请选择日期"
                      value-format="yyyy-MM-dd"
                      v-model="item.CertificateFileds[index + 1].FiledValue"
                      v-if="item.CertificateFileds[index + 1].TextType == 3"
                    ></el-date-picker>
                    <custom-date-range
                      v-model="item.CertificateFileds[index + 1].FiledValue"
                      v-if="item.CertificateFileds[index + 1].TextType == 4"
                    />
                  </el-form-item>
                  <div v-else></div>
                </div>
              </template>
              <el-form-item
                label="照片"
                v-if="item.CertificateName == '身份证'"
              >
                <custom-upload
                  class="el-input"
                  :accept="'.jpeg,.png,.jpg,.gif'"
                  :fileList.sync="item.CertificateManagePhotos"
                  list-type="picture-card"
                  @OcrChange="onChangeFile(item, i, 'card')"
                >
                  <i class="el-icon-plus"></i>
                </custom-upload>
              </el-form-item>
              <el-form-item
                label="照片"
                v-else-if="item.CertificateName == '驾驶证'"
              >
                <custom-upload
                  class="el-input"
                  :accept="'.jpeg,.png,.jpg,.gif'"
                  :fileList.sync="item.CertificateManagePhotos"
                  list-type="picture-card"
                  @OcrChange="onChangeFile(item, i, 'car')"
                >
                  <i class="el-icon-plus"></i>
                </custom-upload>
              </el-form-item>
              <el-form-item label="照片" v-else>
                <custom-upload
                  class="el-input"
                  :accept="'.jpeg,.png,.jpg,.gif'"
                  :fileList.sync="item.CertificateManagePhotos"
                  list-type="picture-card"
                >
                  <i class="el-icon-plus"></i>
                </custom-upload>
              </el-form-item>

              <el-form-item
                v-if="
                  item.FileSignDetailPhotos &&
                    item.FileSignDetailPhotos.length > 0
                "
              >
                <div>其他</div>
                <div style="width: 100%">
                  <template v-for="(item, index) in item.FileSignDetailPhotos">
                    <el-image
                      :preview-src-list="[item.FileSignDetailUrl]"
                      :key="index"
                      style="width: 100px; height: 100px;margin-right: 5px"
                      :src="item.FileSignDetailUrl"
                    ></el-image>
                  </template>
                </div>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="split-line"></div>
      <div
        v-if="userInfo.Insures && userInfo.Insures.length > 0"
        style="width: 70%"
      >
        <div>
          <div class="f-b-c">
            <div class="title">保险信息</div>
            <!-- <el-button type="primary" @click="chooseCert(insureCollapseActive, userInfo.Insures, 2)">添加保险</el-button> -->
          </div>
          <el-collapse v-model="insureCollapseActive">
            <el-collapse-item
              v-for="(item, i) in userInfo.Insures"
              :key="item.CertificateId"
              :name="item.CertificateId"
            >
              <div slot="title" class="f-b-c f1">
                <span>{{ item.CertificateName }}</span>
                <div class="f--c operation">
                  <div
                    class="switch"
                    :class="{
                      open: insureCollapseActive.includes(item.CertificateId)
                    }"
                  >
                    {{
                      insureCollapseActive.includes(item.CertificateId)
                        ? "收起"
                        : "展开"
                    }}
                  </div>
                  <!-- <div @click.stop="userInfo.Insures.splice(i, 1)">删除</div>  -->
                </div>
              </div>
              <template v-for="(filed, index) in item.CertificateFileds">
                <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                  <el-form-item :label="filed.FiledName">
                    <el-input
                      placeholder="请输入"
                      v-model="filed.FiledValue"
                      v-if="filed.TextType == 2"
                      @blur="getCardNo(filed, item)"
                    ></el-input>
                    <el-date-picker
                      placeholder="请选择日期"
                      value-format="yyyy-MM-dd"
                      v-model="filed.FiledValue"
                      v-if="filed.TextType == 3"
                    ></el-date-picker>
                    <custom-date-range
                      v-model="filed.FiledValue"
                      v-if="filed.TextType == 4"
                    />
                  </el-form-item>
                  <el-form-item
                    :label="
                      item.CertificateFileds[index + 1]
                        ? item.CertificateFileds[index + 1].FiledName
                        : ''
                    "
                    v-if="item.CertificateFileds[index + 1]"
                  >
                    <el-input
                      placeholder="请输入"
                      v-model="item.CertificateFileds[index + 1].FiledValue"
                      v-if="item.CertificateFileds[index + 1].TextType == 2"
                      @blur="getCardNo(filed, item)"
                    ></el-input>
                    <el-date-picker
                      placeholder="请选择日期"
                      value-format="yyyy-MM-dd"
                      v-model="item.CertificateFileds[index + 1].FiledValue"
                      v-if="item.CertificateFileds[index + 1].TextType == 3"
                    ></el-date-picker>
                    <custom-date-range
                      v-model="item.CertificateFileds[index + 1].FiledValue"
                      v-if="item.CertificateFileds[index + 1].TextType == 4"
                    />
                  </el-form-item>
                  <div v-else></div>
                </div>
              </template>
              <el-form-item label="照片">
                <custom-upload
                  class="el-input"
                  :accept="'.jpeg,.png,.jpg,.gif'"
                  :fileList.sync="item.CertificateManagePhotos"
                  list-type="picture-card"
                >
                  <i class="el-icon-plus"></i>
                </custom-upload>
              </el-form-item>
              <el-form-item
                v-if="
                  item.FileSignDetailPhotos &&
                    item.FileSignDetailPhotos.length > 0
                "
              >
                <div>其他</div>
                <div style="width: 100%">
                  <template v-for="(item, index) in item.FileSignDetailPhotos">
                    <el-image
                      :preview-src-list="[item.FileSignDetailUrl]"
                      :key="index"
                      style="width: 100px; height: 100px;margin-right: 5px"
                      :src="item.FileSignDetailUrl"
                    ></el-image>
                  </template>
                </div>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div
        class="split-line"
        v-if="userInfo.Others && userInfo.Others.length > 0"
      ></div>
      <div
        v-if="userInfo.Others && userInfo.Others.length > 0"
        style="width: 70%"
      >
        <div class="f-b-c">
          <div class="title">其他信息</div>
          <!-- <el-button type="primary" @click="chooseCert(fileSignsCollapseActive, userInfo.Others, 3)">添加</el-button> -->
        </div>
        <el-collapse v-model="fileSignsCollapseActive">
          <el-collapse-item
            v-for="(item, i) in userInfo.Others"
            :key="item.CertificateId"
            :name="item.CertificateId"
          >
            <div slot="title" class="f-b-c f1">
              <span>{{ item.CertificateName }}</span>
              <div class="f--c operation">
                <div
                  class="switch"
                  :class="{
                    open: fileSignsCollapseActive.includes(item.CertificateId)
                  }"
                >
                  {{
                    fileSignsCollapseActive.includes(item.CertificateId)
                      ? "收起"
                      : "展开"
                  }}
                </div>
                <!-- <div @click.stop="userInfo.Others.splice(i, 1)">删除</div>  -->
              </div>
            </div>
            <template v-for="(filed, index) in item.CertificateFileds">
              <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                <el-form-item :label="filed.FiledName">
                  <el-input
                    placeholder="请输入"
                    v-model="filed.FiledValue"
                    v-if="filed.TextType == 2"
                    @blur="getCardNo(filed, item)"
                  ></el-input>
                  <el-date-picker
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd"
                    v-model="filed.FiledValue"
                    v-if="filed.TextType == 3"
                  ></el-date-picker>
                  <custom-date-range
                    v-model="filed.FiledValue"
                    v-if="filed.TextType == 4"
                  />
                </el-form-item>
                <el-form-item
                  :label="
                    item.CertificateFileds[index + 1]
                      ? item.CertificateFileds[index + 1].FiledName
                      : ''
                  "
                  v-if="item.CertificateFileds[index + 1]"
                >
                  <el-input
                    placeholder="请输入"
                    v-model="item.CertificateFileds[index + 1].FiledValue"
                    v-if="item.CertificateFileds[index + 1].TextType == 2"
                    @blur="getCardNo(filed, item)"
                  ></el-input>
                  <el-date-picker
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd"
                    v-model="item.CertificateFileds[index + 1].FiledValue"
                    v-if="item.CertificateFileds[index + 1].TextType == 3"
                  ></el-date-picker>
                  <custom-date-range
                    v-model="item.CertificateFileds[index + 1].FiledValue"
                    v-if="item.CertificateFileds[index + 1].TextType == 4"
                  />
                </el-form-item>
                <div v-else></div>
              </div>
            </template>
            <el-form-item label="照片">
              <custom-upload
                class="el-input"
                :accept="'.jpeg,.png,.jpg,.gif'"
                :fileList.sync="item.CertificateManagePhotos"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
              </custom-upload>
            </el-form-item>
            <el-form-item
              v-if="
                item.FileSignDetailPhotos &&
                  item.FileSignDetailPhotos.length > 0
              "
            >
              <div>其他</div>
              <div style="width: 100%">
                <template v-for="(item, index) in item.FileSignDetailPhotos">
                  <el-image
                    :preview-src-list="[item.FileSignDetailUrl]"
                    :key="index"
                    style="width: 100px; height: 100px;margin-right: 5px"
                    :src="item.FileSignDetailUrl"
                  ></el-image>
                </template>
              </div>
            </el-form-item>
          </el-collapse-item>
          <!-- <el-collapse-item v-for="item in userInfo.FileSignList" :key="item.FileSignDetailId"
						:name="item.FileSignDetailId">
						<div slot="title" class="f-b-c f1">
							<span>{{ item.FileName }}</span>
							<div class="f--c operation">
								<div class="switch"
									:class="{open: fileSignsCollapseActive.includes(item.FileSignDetailId)}">
									{{ fileSignsCollapseActive.includes(item.FileSignDetailId) ? '收起' : '展开' }}
								</div>
							</div>
						</div>
						<template v-for="(url, index) in item.FileSignTempUrl.split(',')">
							<el-image :key="index" :src="url"
								:preview-src-list="item.FileSignTempUrl.split(',')"></el-image>
						</template>
					</el-collapse-item> -->
          <!-- 	<el-collapse-item name="contract">
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
						</el-collapse-item> -->
          <!-- <el-collapse-item name="edu">
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
						</el-collapse-item> -->
        </el-collapse>
      </div>
    </el-form>
  </div>
</template>
<script>
import RULECONFIG from "@/common/ruleConfig";
import upload_mixin from "@/mixins/upload-mixin.js";
import request_mixin from "@/mixins/request-mixin.js";
import mergeSpan from "@/mixins/merge-span-mixin";
import { handleId } from "@/common/cascader.js";
import { mapState } from "vuex";

function _extends(obj) {
  return JSON.parse(JSON.stringify(obj));
}
const defaultInfo = {
  UserId: "0", //Id
  UserName: "", //姓名
  LoginName: "", //登录名
  Gender: "", //性别
  CardNo: "", //身份证号
  Email: "", //邮箱
  Remark: "", //备注
  Status: "1", //状态
  DepartmentId: "", //部门
  PositionId: "", //岗位
  Birthday: "", //生日
  OnTheJob: "1", //是否在职 int
  IdentityCardFiles: "", //身份证
  LaborContractFiles: "", //劳动合同
  DepartureDate: "", //离职日期
  EntryDate: "", //入职日期
  Address: "",
  ContinuingEducationFiles: "", //培训教育记录
  OtherFiles: [], //其他附件
  OtherPerson: "", //紧急联系人
  OtherPersonTel: "", //紧急联系人电话
  Political: "", //政治面貌
  IsMarriage: 0, //婚否
  FamilyMembers: "", //家庭成员
  Photo: "", // 用户照片
  PositionList: [], // 岗位 r如果多选的情况下
  // PositionList: "",
  Certificates: [], // 证件
  Insures: [], // 保险
  Others: [], // 其他信息
  FileSigns: [],
  SecurityLevel: "1",
  SpotCheckItemList: [],
  DepartmentListJustShow: [],
  DepartmentList: [],
  VehicleGroupSetId: "",
  fileList: []
};

function _extends(obj) {
  return JSON.parse(JSON.stringify(obj));
}
let timer = -1;
const certKeysName = {
  Certificates: "证件",
  Insures: "保险",
  Others: "其他"
};

function secondsToHms(s) {
  return {
    h: parseInt((s / 60 / 60) % 24),
    m: parseInt((s / 60) % 60),
    s: parseInt(s % 60)
  };
}
export default {
  name: "driver",
  // props: ['data', 'EnterpriseList'],
  props: {
    data: {
      type: Object,
      default: {}
    },
    EnterpriseList: {
      type: Array,
      default: []
    },
    isType: {
      type: Boolean,
      default: false
    }
  },
  mixins: [upload_mixin, request_mixin, mergeSpan],
  data() {
    return {
      // DepartmentUserList: [],
      DepartmentCom: [],
      isPreview: false,
      tableData: [],
      GenderList: [], //性别列表
      Departments: "", //部门
      DepartmentList: [],
      WhetherCom: [], //是否在职
      currentSelected: [],
      //编辑
      userInfo: _extends(defaultInfo),
      DepartmentPositionUser: [],
      rules: {
        LoginName: RULECONFIG.Text("手机号"),
        UserName: RULECONFIG.Text("姓名"),
        Gender: RULECONFIG.Select("性别"),
        Birthday: RULECONFIG.Select("出生日期"),
        OnTheJob: RULECONFIG.Select("是否在职"),
        // DepartmentList: RULECONFIG.Select('数据权限'),
        SecurityLevel: RULECONFIG.Select("安全等级"),
        PositionList: RULECONFIG.Select("岗位"),
        DepartureDate: RULECONFIG.Select("离职日期")
        // VehicleGroupSetId: RULECONFIG.Select('所属车队'),
        // PositionList: [{
        // 	required: true,
        // 	type: 'array',
        // 	message: '请选择岗位'
        // }] // 如果多选的情况下
      },
      collapseActive: [],
      fileSignsCollapseActive: [
        "contract",
        "physical-examination",
        "edu",
        "FileSignDetailId"
      ],
      insureCollapseActive: [],
      isDepartment: [],
      deIndex: ""
    };
  },

  computed: {
    ...mapState([])
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs.custom.reset();
        });
        this.userInfo = _extends(Object.assign(_extends(defaultInfo), val));
        if (
          this.userInfo.DepartmentListJustShow &&
          this.userInfo.DepartmentListJustShow.length
        ) {
          this.userInfo.DepartmentListJustShow.map((item, index) => {
            item.isShow = true;
          });
        }
        if (this.userInfo.SecurityLevel == 0) {
          this.userInfo.SecurityLevel = "1";
        } else {
          this.userInfo.SecurityLevel = this.userInfo.SecurityLevel.toString();
        }
        this.setFiles();
        this.setCerts(val.CertificateList || [], this.userInfo);
        this.collapseActive = [];
        if (
          this.userInfo.PositionList &&
          this.userInfo.PositionList.length > 0
        ) {
          // this.userInfo.PositionList = this.userInfo.PositionList.map(
          // 	(item) => {
          // 		return item.PositionId
          // 	}
          // );
          this.userInfo.PositionList = this.userInfo.PositionList[0].PositionId;
        }
        this.collapseActive = (this.userInfo.Certificates || []).map(
          item => item.CertificateId
        );
        this.insureCollapseActive = (this.userInfo.Insures || []).map(
          item => item.CertificateId
        );
        this.fileSignsCollapseActive = [
          "contract",
          "physical-examination",
          "edu",
          "FileSignDetailId"
        ];
        this.fileSignsCollapseActive.push(
          ...(this.userInfo.Others || []).map(item => item.CertificateId)
        );
        this.fileSignsCollapseActive.push(
          ...(this.userInfo.FileSigns || []).map(
            item => item.PositionFileSignId
          )
        );
      }
    },
    userInfo: {
      deep: true,
      handler() {
        if (!this.userInfo.PositionList) {
          this.$set(this.userInfo, "PositionList", []);
        }
      }
    },
    "userInfo.PositionList"(val) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.$nextTick(async () => {
          // this.getPositionJoinInfo(val.join(','));
          this.getPositionJoinInfo(val);
        });
      }, 600);
    },
    "upload.arrFiles": function(val) {
      let arr = [
        "",
        "IdentityCardFiles",
        "LaborContractFiles",
        "SafetyCommitmentFiles",
        "LetterFiles",
        "MedicalCertificateFiles",
        "OtherFiles",
        "ContinuingEducationFiles"
      ];
      arr.forEach((key, index) => {
        if (key && this.upload.arrFiles[index] && key != "OtherFiles") {
          this.$set(this.userInfo, key, this.upload.arrFiles[index]);
        }
      });
    }
  },

  methods: {
    handleUpload() {
      this.userInfo.OtherFiles.forEach(item => {
        this.$set(item, "name", item.name);
        this.$set(item, "videoUrl", item.url);
        this.$set(item, "size", item.size);
        this.$set(item, "ext", item.ext);
        this.$set(item, "coverUrl", item.coverUrl);
        this.$set(item, "lengths", item.lengths);
        this.$set(item, "totalSeconds", item.lengths);
        let hms = secondsToHms(parseInt(item.lengths || 0));
        this.$set(item, "hms", hms);
      });
    },
    removeFile(index) {
      this.userInfo.OtherFiles.splice(index, 1);
    },
    isValidDateFormat(dateStr) {
      dateStr = dateStr.replace(/[.]/g, "-");
      var regEx = /^\d{4}-\d{1,2}-\d{1,2}$/;
      if (!dateStr.match(regEx)) return false; //格式不正确
      var d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return false; //无效日期
      return d.toISOString().slice(0, 10) === dateStr;
    },
    onChangeFile(item, i, type) {
      let arr = "";
      if (
        item.CertificateManagePhotos &&
        item.CertificateManagePhotos.length > 0
      ) {
        arr = item.CertificateManagePhotos[
          item.CertificateManagePhotos.length - 1
        ].viewurl.toString();
      } else {
        return;
      }
      if (type == "card") {
        this.$nextTick(() => {
          this.Get("/AliOCR?url=" + arr + "&type=1").then(res => {
            if (res.Code == 200) {
              let DataObj = JSON.parse(res.obj.Body.Data);
              // let Data = DataObj.data.face ? DataObj.data.face.data : DataObj.data.back.data
              let Data = {};
              if (DataObj.data.face && DataObj.data.back) {
                Data = {
                  ...DataObj.data.face.data,
                  ...DataObj.data.back.data
                };
              } else {
                if (DataObj.data.face) {
                  Data = DataObj.data.face.data;
                } else {
                  Data = DataObj.data.back.data;
                }
              }
              item.CertificateFileds.map(item => {
                if (
                  item.FiledName == "证件编号" &&
                  item.TextType == 2 &&
                  Data.idNumber
                ) {
                  item.FiledValue = Data.idNumber;
                }
                if (
                  item.FiledName == "性别" &&
                  item.TextType == 2 &&
                  Data.sex
                ) {
                  item.FiledValue = Data.sex;
                }
                if (
                  item.FiledName == "地址" &&
                  item.TextType == 2 &&
                  Data.address
                ) {
                  item.FiledValue = Data.address;
                }
                if (
                  item.FiledName == "出生年月" &&
                  item.TextType == 2 &&
                  Data.birthDate
                ) {
                  item.FiledValue = Data.birthDate;
                }
                if (
                  item.FiledName == "民族" &&
                  item.TextType == 2 &&
                  Data.ethnicity
                ) {
                  item.FiledValue = Data.ethnicity;
                }
                if (
                  item.FiledName == "签发机关" &&
                  item.TextType == 2 &&
                  Data.issueAuthority
                ) {
                  item.FiledValue = Data.issueAuthority;
                }
                if (
                  item.FiledName == "有效期" &&
                  item.TextType == 4 &&
                  Data.validPeriod
                ) {
                  if (Data.validPeriod) {
                    if (
                      Data.validPeriod.includes("长期") ||
                      Data.validPeriod.includes("永久")
                    ) {
                      item.FiledValue = ",,1";
                    } else {
                      if (
                        this.isValidDateFormat(
                          Data.validPeriod.split("-")[0]
                        ) &&
                        this.isValidDateFormat(Data.validPeriod.split("-")[1])
                      ) {
                        let start = Data.validPeriod
                          .split("-")[0]
                          .replace(/[.]/g, "-");
                        let end = Data.validPeriod
                          .split("-")[1]
                          .replace(/[.]/g, "-");
                        item.FiledValue = start + "," + end + ",0";
                      } else {
                        item.FiledValue = "";
                        this.$message.error(
                          "证件有效期模糊,无法识别,请确认照片字迹清晰后上传"
                        );
                      }
                    }
                  }
                }
              });
              this.$forceUpdate();
            } else {
              this.$message.error("请上传有效的证件图片");
            }
          });
        });
      } else {
        this.$nextTick(() => {
          this.Get("/AliOCR?url=" + arr + "&type=4").then(res => {
            if (res.Code == 200) {
              let DataObj = JSON.parse(res.obj.Body.Data);
              let Data = {};
              if (DataObj.data.face && DataObj.data.back) {
                Data = {
                  ...DataObj.data.face.data,
                  ...DataObj.data.back.data
                };
              } else {
                if (DataObj.data.face) {
                  Data = DataObj.data.face.data;
                } else {
                  Data = DataObj.data.back.data;
                }
              }
              item.CertificateFileds.map(item => {
                if (
                  item.FiledName == "证件编号" &&
                  item.TextType == 2 &&
                  Data.licenseNumber
                ) {
                  item.FiledValue = Data.licenseNumber;
                }
                if (
                  item.FiledName == "准驾车型" &&
                  item.TextType == 2 &&
                  Data.approvedType
                ) {
                  item.FiledValue = Data.approvedType;
                }
                if (
                  item.FiledName == "初次领证时间" &&
                  item.TextType == 3 &&
                  Data.validFromDate
                ) {
                  if (this.isValidDateFormat(Data.validFromDate)) {
                    item.FiledValue = Data.validFromDate;
                  } else {
                    item.FiledValue = "";
                    this.$message.error(
                      "证件初次领证时间模糊,无法识别,请确认照片字迹清晰后上传"
                    );
                  }
                }

                if (
                  item.FiledName == "性别" &&
                  item.TextType == 2 &&
                  Data.sex
                ) {
                  item.FiledValue = Data.sex;
                }
                if (
                  item.FiledName == "地址" &&
                  item.TextType == 2 &&
                  Data.address
                ) {
                  item.FiledValue = Data.address;
                }
                if (
                  item.FiledName == "档案编号" &&
                  item.TextType == 2 &&
                  Data.recordNumber
                ) {
                  item.FiledValue = Data.recordNumber;
                }
                // if (item.FiledName == '证照类型' && item.TextType == 2 && Data
                // 	.approvedType) {
                // 	item.FiledValue = Data.approvedType
                // }
                if (
                  item.FiledName == "签发机关" &&
                  item.TextType == 2 &&
                  Data.issueAuthority
                ) {
                  item.FiledValue = Data.issueAuthority;
                }
                if (
                  item.FiledName == "有效期" &&
                  item.TextType == 4 &&
                  Data.validPeriod
                ) {
                  // if (Data.validPeriod.includes('长期') || Data.validPeriod
                  // 	.includes('永久')) {
                  // 	item.FiledValue = ',,1'
                  // } else {
                  // 	item.FiledValue = Data.validPeriod.split('至').join(',') + ',0'
                  // }
                  if (Data.validPeriod) {
                    if (
                      Data.validPeriod.includes("长期") ||
                      Data.validPeriod.includes("永久")
                    ) {
                      item.FiledValue = ",,1";
                    } else {
                      if (
                        this.isValidDateFormat(
                          Data.validPeriod.split("至")[0]
                        ) &&
                        this.isValidDateFormat(Data.validPeriod.split("至")[1])
                      ) {
                        item.FiledValue =
                          Data.validPeriod.split("至").join(",") + ",0";
                      } else {
                        item.FiledValue = "";
                        this.$message.error(
                          "证件有效期模糊,无法识别,请确认照片字迹清晰后上传"
                        );
                      }
                    }
                  }
                }
              });
              this.$forceUpdate();
            } else {
              this.$message.error("请上传有效的证件图片");
            }
          });
        });
      }
    },
    onChageOut() {
      if (
        this.userInfo.DepartmentListJustShow &&
        this.userInfo.DepartmentListJustShow.length
      ) {
        // DepartureDate
        this.userInfo.DepartmentListJustShow.map(item => {
          if (!item.DepartureDate) {
            item.DepartureDate = this.userInfo.DepartureDate;
          }
        });
      }
    },
    handleCascaderChange(value, i) {
      if (value.length > 0) {
        const lastId = value[value.length - 1];
        this.userInfo.DepartmentListJustShow[i].DepartmentId = lastId;
        // 在这里可以对最后一级的 ID 进行你需要的操作
      }
    },
    handleChangeEndData(value, i) {
      if (value) {
        if (
          this.userInfo.DepartmentList &&
          this.userInfo.DepartmentList.length > 0
        ) {
          if (
            this.userInfo.DepartmentListJustShow[i].DepartmentId &&
            this.userInfo.DepartmentListJustShow[i].EnterpriseId &&
            this.userInfo.DepartmentListJustShow[i].EntryDate
          ) {
            let arr = this.userInfo.DepartmentList.filter(
              item =>
                item.DepartmentId !=
                this.userInfo.DepartmentListJustShow[i].DepartmentId
            );
            this.userInfo.DepartmentList = arr;
            this.$forceUpdate();
          } else {
            this.userInfo.DepartmentListJustShow[i].DepartureDate = null;
            this.$message.error(
              `请先选择企业信息第${i + 1}行的企业，部门，入职日期`
            );
          }
        } else {
          this.userInfo.DepartmentListJustShow[i].DepartureDate = null;
          this.$message.error(`请先添加数据权限！`);
        }
      } else {
        if (this.userInfo.DepartmentListJustShow[i].DepartmentId) {
          if (
            this.userInfo.DepartmentList &&
            this.userInfo.DepartmentList.length > 0
          ) {
            if (
              !this.userInfo.DepartmentList.some(
                item =>
                  item.DepartmentId ==
                  this.userInfo.DepartmentListJustShow[i].DepartmentId
              )
            ) {
              this.userInfo.DepartmentList.push({
                DepartmentId: this.userInfo.DepartmentListJustShow[i]
                  .DepartmentId,
                EnterpriseId: this.userInfo.DepartmentListJustShow[i]
                  .EnterpriseId
              });
            }
          } else {
            this.userInfo.DepartmentList.push({
              DepartmentId: this.userInfo.DepartmentListJustShow[i]
                .DepartmentId,
              EnterpriseId: this.userInfo.DepartmentListJustShow[i].EnterpriseId
            });
          }
        }
      }
    },
    handleChangeStartData(value, i) {
      if (value) {
        this.userInfo.DepartmentListJustShow[i].DepartureDate = "";
        if (this.userInfo.DepartmentListJustShow[i].DepartmentId) {
          if (
            this.userInfo.DepartmentList &&
            this.userInfo.DepartmentList.length > 0
          ) {
            if (
              !this.userInfo.DepartmentList.some(
                item =>
                  item.DepartmentId ==
                  this.userInfo.DepartmentListJustShow[i].DepartmentId
              )
            ) {
              this.userInfo.DepartmentList.push({
                DepartmentId: this.userInfo.DepartmentListJustShow[i]
                  .DepartmentId,
                EnterpriseId: this.userInfo.DepartmentListJustShow[i]
                  .EnterpriseId
              });
            }
          } else {
            this.userInfo.DepartmentList.push({
              DepartmentId: this.userInfo.DepartmentListJustShow[i]
                .DepartmentId,
              EnterpriseId: this.userInfo.DepartmentListJustShow[i].EnterpriseId
            });
          }
        } else {
          this.userInfo.DepartmentListJustShow[i].EntryDate = null;
          this.$message.error(`请先选择企业信息第${i + 1}的企业和部门`);
        }
      } else {
        let arr = this.userInfo.DepartmentList.filter(
          item =>
            item.DepartmentId !=
            this.userInfo.DepartmentListJustShow[i].DepartmentId
        );
        this.userInfo.DepartmentList = arr;
        this.$forceUpdate();
      }
    },
    handleChangeSelect(value, index) {
      this.deIndex = index;
      this.GetDepartments(value);
    },
    // 选择级联组件
    handleChange(value) {
      this.DepartmentList = handleId(value, 2);
    },
    addInspectionItem() {
      this.userInfo.DepartmentListJustShow.push({
        EnterpriseId: "",
        DepartmentId: "",
        EntryDate: "",
        DepartureDate: "",
        isShow: false,
        DepartmentCom: []
      });
    },
    removeInspectionItem(item, index) {
      if (this.userInfo.DepartmentListJustShow[index].EntryDate) {
        let arr = this.userInfo.DepartmentList.filter(
          item =>
            item.DepartmentId !==
            this.userInfo.DepartmentListJustShow[index].DepartmentId
        );
        this.userInfo.DepartmentList = arr;
        this.$forceUpdate();
        this.userInfo.DepartmentListJustShow.splice(index, 1);
      } else {
        this.userInfo.DepartmentListJustShow.splice(index, 1);
      }
    },
    checkChange(nodes, nodeKeys) {
      this.currentSelected = nodeKeys.checkedKeys;
    },
    setCerts(list, info) {
      list.forEach(item => {
        Object.keys(certKeysName).forEach((key, index) => {
          if (!info[key]) {
            this.$set(info, key, []);
          }
          if (item.CertificateClassification == index + 1) {
            let o = info[key].find(o => o.CertificateId == item.CertificateId);
            if (!o) {
              info[key].push(item);
            }
          }
        });
      });
    },
    getEnterprise(data) {
      this.getUsers(data);
    },
    // removeEmptyChildrenDepartment(data) {
    //   data.forEach(item => {
    //     if (item.children && item.children.length === 0) {
    //       delete item.children;
    //     } else if (item.children && item.children.length > 0) {
    //       this.removeEmptyChildrenDepartment(item.children);
    //     }
    //   });
    // },
    // async getUsers(id) {
    //     try {
    //         let res = await this.Get('/GetDepartmentListByAuthority?enterpriseId=' + id);
    //         if (res.status == 2000) {
    //             this.DepartmentUserList = res.data;
    // 			let result = this.removeEmptyChildrenDepartment(res.data)
    //         } else {
    //             new Error('获取部门信息失败')
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // },
    async getPositionJoinInfo(positionIds) {
      // 如果是单选的情况下，需要赋值Arr,因为组件给过来的是字符串，不是数组。
      let arr = [];
      arr.push(positionIds);
      let list = arr.length
        ? await this.Get(`/GetPositionFileSigns?positionId=${arr}`).then(
            res => res.data
          )
        : [];
      if (!this.userInfo.FileSigns) {
        this.$set(this.userInfo, "FileSigns", list);
      } else {
        list.forEach(item => {
          let index = this.userInfo.FileSigns.map(
            item => item.PositionFileSignId
          ).indexOf(item.PositionFileSignId);
          if (index == -1) {
            this.userInfo.FileSigns.push(item);
          }
        });
        for (let i = 0; i < this.userInfo.FileSigns.length; i++) {
          let item = this.userInfo.FileSigns[i];
          if (!!item.UserFileSignId) continue;
          let cItem = list.find(
            cItem => cItem.PositionFileSignId == item.PositionFileSignId
          );
          if (!cItem) {
            this.userInfo.FileSigns.splice(i, 1);
            i--;
          }
        }
        if (list.length) {
          this.fileSignsCollapseActive.push(
            ...list.map(item => item.PositionFileSignId)
          );
        }
      }
      //数组情况下
      let certList = arr.length
        ? await this.Get(`/GetPositionCertificates?positionId=${arr}`).then(
            res => res.data
          )
        : [];
      // let certList = await this.Get(
      // 	`/GetPositionCertificates?positionId=${positionIds}`).then(res => res.data)
      if (certList && certList.length > 0) {
        [
          this.userInfo.Certificates,
          this.userInfo.Insures,
          this.userInfo.Others
        ].forEach((list, index) => {
          let num = index + 1;
          let arr = certList.filter(
            item => item.CertificateClassification == num
          );
          arr.forEach(item => {
            let index = list
              .map(item => item.CertificateId)
              .indexOf(item.CertificateId);
            if (index == -1) {
              list.push(item);
            }
          });
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (!!item.CertificateManageId) continue;
            let cItem = certList.find(
              cItem => cItem.CertificateId == item.CertificateId
            );
            if (!cItem) {
              list.splice(i, 1);
              i--;
            }
          }
          if (index == 0) {
            this.collapseActive.push(
              ...certList.map(item => item.CertificateId)
            );
          } else if (index == 1) {
            this.insureCollapseActive.push(
              ...certList.map(item => item.CertificateId)
            );
          } else if (index == 2) {
            this.fileSignsCollapseActive.push(
              ...certList.map(item => item.CertificateId)
            );
          }
        });
      } else {
        this.userInfo.Certificates = [];
        this.userInfo.Insures = [];
        this.userInfo.Others = [];
        this.collapseActive = [];
        this.insureCollapseActive = [];
        this.fileSignsCollapseActive = [];
      }
    },
    getData(call) {
      this.$refs.editsform.validate((valid, fields) => {
        if (JSON.stringify(fields) != "{}") {
          for (let key in fields) {
            let ref = this.$refs[key];
            if (ref) {
              ref.$el.scrollIntoView({
                behavior: "smooth"
              });
              break;
            }
          }
        }
        if (valid) {
          this.userInfo.IdentityCardFiles = this.upload.arrFiles[1];
          this.userInfo.LaborContractFiles = this.upload.arrFiles[2];
          this.userInfo.SafetyCommitmentFiles = this.upload.arrFiles[3];
          this.userInfo.LetterFiles = this.upload.arrFiles[4];
          this.userInfo.MedicalCertificateFiles = this.upload.arrFiles[5];
          // this.userInfo.OtherFiles = this.upload.arrFiles[7];
          this.userInfo.ContinuingEducationFiles = this.upload.arrFiles[6];
          let params = JSON.parse(JSON.stringify(this.userInfo));
          // 如果多选的情况下
          // params.PositionList = (params.PositionList || []).map(
          // 	(item) => {
          // 		return {
          // 			PositionId: item,
          // 		};
          // 	}
          // );
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
      // this.upload.arrFiles[7] = val.OtherFiles;
      this.upload.arrFiles[7] = [];
      this.upload.arrFiles[6] = val.ContinuingEducationFiles;
    },
    uploadPortrait(res, file) {
      this.$set(this.userInfo, "Photo", res.files[0].url);
    },
    getCardNo(item, cert) {
      // 证件为身份证 且 字段是默认 且 字段类型是文本
      if (
        cert.CertificateCategory == 1 &&
        item.IsDefault == 1 &&
        item.TextType == 2
      ) {
        this.$set(this.userInfo, "Gender", "");
        this.$set(this.userInfo, "Birthday", "");
        this.$set(this.userInfo, "CardNo", item.FiledValue);
        //获取身份证信息
        if (!!item.FiledValue) {
          this.Get("VerificationCardNo", {
            CardNo: item.FiledValue
          }).then(res => {
            if (res.status == 2000) {
              this.userInfo.Gender = res.data.Gender;
              this.userInfo.Birthday = res.data.Birthday;
              this.userInfo.CardNo = item.FiledValue;
            } else {
              this.$message.error(res.message);
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
        let resList = _extends(
          res.map(item => {
            item.CertificateManagePhotos = [];
            return item;
          })
        ).filter(item => ids.indexOf(item.CertificateId) == -1);
        if (resList.length) {
          list.push(...resList);
        }
      });
    },
    removeEmptyChildrenDepartment(data) {
      data.forEach(item => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        } else if (item.children && item.children.length > 0) {
          this.removeEmptyChildrenDepartment(item.children);
        }
      });
    },
    GetDepartments(id) {
      this.Get("/GetTreeEnterpriseDepartments?enterpriseId=" + id).then(res => {
        if (res.status == 2000) {
          this.userInfo.DepartmentListJustShow[this.deIndex].DepartmentCom =
            res.data;
          // this.DepartmentCom = res.data;
          if (
            this.userInfo.DepartmentListJustShow[this.deIndex].DepartmentCom &&
            this.userInfo.DepartmentListJustShow[this.deIndex].DepartmentCom
              .length > 0
          ) {
            this.removeEmptyChildrenDepartment(
              this.userInfo.DepartmentListJustShow[this.deIndex].DepartmentCom
            );
          }
        }
      });
    },
    removeEmptyChildren(options) {
      return options.map(option => {
        if (
          option.children === null ||
          (Array.isArray(option.children) && option.children.length === 0)
        ) {
          return {
            ...option,
            children: undefined
          };
        } else if (option.children && option.children.length > 0) {
          return {
            ...option,
            children: this.removeEmptyChildren(option.children)
          };
        } else {
          return option;
        }
      });
    }
  },
  async created() {
    let list = [
      // this.Get('/GetGenderCom', {}).then((result) => {
      // 	if (result.status == 2000) {
      // 		this.GenderList = result.data;
      // 	}
      // }),

      // this.Get('/GetArchivesType', {}).then((res) => {
      //     if (res.status == 2000) {
      //         this.activeName = res.data[0].Code;
      //         this.activeNames = res.data[0].Code;
      //     }
      // }),
      await this.Get("/GetDepartmentTree").then(res => {
        //部门
        if (res.status == 2000) {
          this.DepartmentPositionUser = res.data;
          // this.DepartmentPositionUser = this.removeEmptyChildren(res.data);
          this.DepartmentPositionUser.forEach(option => {
            if (!option.children || option.children.length === 0) {
              option.disabled = true; // 禁用第一层级的选项
            }
          });
        }
      }),
      this.Get("GetGenderCom").then(res => {
        //性别

        if (res.status === 2000) {
          if (res.data && res.data.length > 0) {
            this.GenderList = res.data.filter(item => item.id != "3") || [];
          }
        }
      }),

      this.Get("GetWhether").then(res => {
        //是否
        if (res.status === 2000) {
          this.WhetherCom = res.data;
        }
      })
    ];
    Promise.all(list).then(res => {
      this.upload.arrFiles = [[], [], [], [], [], [], []];
      if (this.data) {
        this.userInfo = this.data;
        this.setFiles();
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.power-box {
  width: 30%;
  position: absolute;
  right: 0;
  top: 0;
  // height: calc(100% - 200px);
  border-left: 1px solid #ccc;
  padding: 10px 0 0 10px;
}

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
  height: 160px;
}

.portrait > div {
  height: 100%;
}

.flex-box {
  width: 100%;
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
  margin-bottom: 10px;
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
    content: "";
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
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      margin-bottom: 20px;
      overflow: hidden;

      &.is-active {
        .el-collapse-item__header {
          border-bottom: 1px solid #dcdfe6;
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
        background: #f5f6fa;
        line-height: inherit;

        .operation {
          color: $primary-color;

          .switch {
            display: flex;
            align-items: center;

            &::before {
              content: "";
              border: 8.25px solid $primary-color;
              border-bottom: 0;
              border-right: 6px solid transparent;
              border-left: 6px solid transparent;
              margin-right: 6px;
              width: 0;
              height: 0;
              transform-origin: center;
              transform: rotateX(0);
              transition: all 0.2s linear;
            }

            &.open {
              &::before {
                transform: rotateX(180deg);
              }
            }
          }

          > div:last-child {
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

    > div {
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
    width: 75%;
    margin: 30px -35px 20px;
    height: 10px;
    background: #f2f2f2;
  }

  .el-image {
    border-radius: 6px;
    border: 1px solid #c0ccda;
    width: 148px;
    height: 148px;
  }
}

.file-list {
  margin-top: 20px;

  .file-item {
    display: flex;

    &:not(:first-child) {
      margin-bottom: 15px;
    }

    > div {
      width: 50%;
    }

    .file {
      border-radius: 4px;
      margin-right: 15px;
      padding: 11px 15px 11px 10px;
      background: #f8fafb;
    }
  }
}
</style>
