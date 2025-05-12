<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div>
                    <div class="title">基本信息</div>
                    <div class="form-2-col" style="margin-top: 20px;">
                        <el-form-item label="车牌号" prop="LicensePlateNumber">
                            <el-input placeholder="请输入"
                                maxlength="20"
                                v-model="info.LicensePlateNumber"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="档案编号" prop="ArchivesNo">
                            <el-input placeholder="请输入"
                                maxlength="20"
                                v-model="info.ArchivesNo"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-2-col">
                        <el-form-item label="车辆类型" prop="VehicleTypeId">
                            <el-select
                                placeholder="请选择"
                                v-model="info.VehicleTypeId"
                                filterable
                                @change="changeType"
                            >
                                <el-option v-for="(item, index) in vehicleTypes" :key="index" :value="item.VehicleTypeId" :label="item.VehicleTypeName" :dataItem="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属部门">
                            <select-department filterable placeholder="请选择" v-model="info.DepartmentId"></select-department>
                        </el-form-item>
                    </div>
                    <div class="form-2-col">
                        <el-form-item label="状态" prop="CarStatus">
                            <ZYselect
                                url="GetCarStatus"
                                placeholder="请选择"
                                propid="id"
                                propname="text"
                                :val="info.CarStatus"
                                v-model="info.CarStatus"
                                @returnData="getFormValue($event)"
                            />
                        </el-form-item>
                        <el-form-item label="驾驶员">
                            <el-input placeholder="请选择" v-model="info.DriverName" readonly>
                                <el-button slot="append" @click="chooseUser">选择人员</el-button>
                            </el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="备注">
                        <el-input type="textarea" placeholder="请输入" v-model="info.Remark"></el-input>
                    </el-form-item>
                    <el-form-item label="附件">
                        <custom-upload :fileList.sync="info.OtherFiles">
                            <el-button type="primary">点击上传</el-button>
                        </custom-upload>
                    </el-form-item>
                </div>
                <div v-if="info.Certificates && info.Certificates.length">
                    <div class="split-line"></div>
                    <div class="f-b-c">
                        <div class="title">证件信息</div>
                        <!-- <el-button type="primary" @click="chooseCert(certCollapseActive, info.Certificates, 1)">添加证件</el-button> -->
                    </div>
                    <el-collapse
                        v-model="certCollapseActive"
                    >
                        <el-collapse-item
                            v-for="(item, i) in info.Certificates"
                            :key="i"
                            :name="item.CertificateId"
                        >
                            <div slot="title" class="f-b-c f1">
                                <span>{{ item.CertificateName }}</span>
                                <div class="f--c operation">
                                    <div class="switch" :class="{open: certCollapseActive.includes(item.CertificateId)}">
                                        {{ certCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
                                    </div>
                                    <!-- <div @click.stop="info.Certificates.splice(i, 1)">删除</div> -->
                                </div>
                            </div>
                            <template v-for="(filed, index) in item.CertificateFileds">
                                <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                                    <el-form-item
                                        :label="filed.FiledName"
                                    >
                                        <el-input placeholder="请输入" v-model="filed.FiledValue" v-if="filed.TextType == 2"
                                        ></el-input>
                                        <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
                                        <custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4"/>
                                    </el-form-item>
                                    <el-form-item
                                        :label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
                                        v-if="item.CertificateFileds[index + 1]"
                                    >
                                        <el-input placeholder="请输入" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 2"
                                        ></el-input>
                                        <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
                                        <custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 4"/>
                                    </el-form-item>
                                    <div v-else></div>
                                </div>
                            </template>
                            <el-form-item
                                label="照片"
                            >
                                <custom-upload 
                                    :accept="'.jpeg,.png,.jpg,.gif'"
                                    :fileList.sync="item.CertificateManagePhotos"
                                    list-type="picture-card"
                                >
                                    <i class="el-icon-plus"></i>
                                </custom-upload>
                            </el-form-item>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div v-if="info.Insures && info.Insures.length">
                    <div class="split-line"></div>
                    <div class="f-b-c">
                        <div class="title">车辆保险信息</div>
                        <!-- <el-button type="primary" @click="chooseCert(insureCollapseActive, info.Insures, 2)">添加保险</el-button> -->
                    </div>
                    <el-collapse
                        v-model="insureCollapseActive"
                    >
                        <el-collapse-item
                            v-for="(item, i) in info.Insures"
                            :key="i"
                            :name="item.CertificateId"
                        >
                            <div slot="title" class="f-b-c f1">
                                <span>{{ item.CertificateName }}</span>
                                <div class="f--c operation">
                                    <div class="switch" :class="{open: insureCollapseActive.includes(item.CertificateId)}">
                                        {{ insureCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
                                    </div>
                                    <!-- <div @click.stop="info.Insures.splice(i, 1)">删除</div> -->
                                </div>
                            </div>
                            <template v-for="(filed, index) in item.CertificateFileds">
                                <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                                    <el-form-item
                                        :label="filed.FiledName"
                                    >
                                        <el-input placeholder="请输入" v-model="filed.FiledValue" v-if="filed.TextType == 2"
                                        ></el-input>
                                        <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
                                        <custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4"/>
                                    </el-form-item>
                                    <el-form-item
                                        :label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
                                        v-if="item.CertificateFileds[index + 1]"
                                    >
                                        <el-input placeholder="请输入" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 2"
                                        ></el-input>
                                        <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
                                        <custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 4"/>
                                    </el-form-item>
                                    <div v-else></div>
                                </div>
                            </template>
                            <el-form-item
                                label="照片"
                            >
                                <custom-upload 
                                    :accept="'.jpeg,.png,.jpg,.gif'"
                                    :fileList.sync="item.CertificateManagePhotos"
                                    list-type="picture-card"
                                >
                                    <i class="el-icon-plus"></i>
                                </custom-upload>
                            </el-form-item>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div v-if="info.Others && info.Others.length">
                    <div class="split-line"></div>
                    <div class="f-b-c">
                        <div class="title">其他信息</div>
                        <!-- <el-button type="primary" @click="chooseCert(ontherCollapseActive, info.Others, 3)">添加</el-button> -->
                    </div>
                    <el-collapse
                        v-model="ontherCollapseActive"
                    >
                        <el-collapse-item
                            v-for="(item, i) in info.Others"
                            :key="i"
                            :name="item.CertificateId"
                        >
                            <div slot="title" class="f-b-c f1">
                                <span>{{ item.CertificateName }}</span>
                                <div class="f--c operation">
                                    <div class="switch" :class="{open: ontherCollapseActive.includes(item.CertificateId)}">
                                        {{ ontherCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
                                    </div>
                                    <!-- <div @click.stop="info.Others.splice(i, 1)">删除</div> -->
                                </div>
                            </div>
                            <template v-for="(filed, index) in item.CertificateFileds">
                                <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                                    <el-form-item
                                        :label="filed.FiledName"
                                    >
                                        <el-input placeholder="请输入" v-model="filed.FiledValue" v-if="filed.TextType == 2"
                                        ></el-input>
                                        <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
                                        <custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4"/>
                                    </el-form-item>
                                    <el-form-item
                                        :label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
                                        v-if="item.CertificateFileds[index + 1]"
                                    >
                                        <el-input placeholder="请输入" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 2"
                                        ></el-input>
                                        <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 3"></el-date-picker>
                                        <custom-date-range v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 4"/>
                                    </el-form-item>
                                    <div v-else></div>
                                </div>
                            </template>
                            <el-form-item
                                label="照片"
                            >
                                <custom-upload 
                                    :accept="'.jpeg,.png,.jpg,.gif'"
                                    :fileList.sync="item.CertificateManagePhotos"
                                    list-type="picture-card"
                                >
                                    <i class="el-icon-plus"></i>
                                </custom-upload>
                            </el-form-item>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                >确定</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import ZYselect from "@/components/common/zy_select";
const defaultInfo = {
    LicensePlateNumber: '',
    ArchivesNo: '',
    VehicleTypeId: '',
    DepartmentId: '',
    DriverName: '',
    DriverId: '',
    CarStatus: '',
    Remark: '',
    Certificates: [],
    Insures: [],
    Others: [],
    OtherFiles: [],
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
const certKeysName = {Certificates: '证件', Insures: '保险', Others: '其他'};
const collapses = [
    'certCollapseActive',
    'insureCollapseActive',
    'ontherCollapseActive',
]
export default {
    name: 'page-info',
    mixins: [request_mixin],
    components: {
        ZYselect
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            vehicleTypes: [],
            info: _extends(defaultInfo),
            rules: {
                LicensePlateNumber: [{required: true, message: '请输入车牌号', trigger: ['change', 'blur']}],
                VehicleTypeId: [{required: true, message: '请选择类型', trigger: ['change', 'blur']}],
                CarStatus: [{required: true, message: '请选择状态', trigger: ['change', 'blur']}],
            },
            certCollapseActive: [],
            insureCollapseActive: [],
            ontherCollapseActive: [],
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : '新增'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            
            const loading = this.$loading({
                lock: true,
                text: '数据加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            await this.getGetVehicleTypes();
            if (item) {
                this.loading = true;
                this.id = item.VehicleId;
                item.CarStatus = item.CarStatus + '';
                item.VehicleTypeId = item.VehicleTypeId === 0 ? '' : item.VehicleTypeId;
                if(item.Certificates && item.Certificates.length > 0){
					this.certCollapseActive = item.Certificates.map(item => item.CertificateId);
				}
				if(item.Insures && item.Insures.length > 0){
					this.insureCollapseActive = item.Insures.map(item => item.CertificateId);
				}
                if(item.Other &&  item.Other.length > 0){
					this.ontherCollapseActive = item.Others.map(item => item.CertificateId);
				}
                this.info = _extends(item);
                this.setCerts(item.CertificateList || [], this.info);
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            });
            loading.close();
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        save() {
            this.$refs.form.validate(async (valid, fields) => {
                for (let key in fields) {
                   if (this.$refs[key]) {
                       this.$refs.scrollbar.wrap.scrollTop = this.$refs[key].$el.offsetTop;
                       break;
                   }
                }
                if (valid) {
                   this.submitLoading = true;
                   try {
                      let params = {
                        ...this.info
                      }
                      let res = await this.Post('/SaveVehicle', params)
                      if (res.status == 2000) {
                          this.$message.success('保存成功')
                          this.$emit('success');
                          this.close();
                      } else {
                          this.$message.error(res.message);
                      }
                   } catch (error) {
                      console.error(error);
                   }
                   this.submitLoading = false;
                }
            })
        },
        getFormValue(e) {
            this.info.CarStatus = e;
        },
        chooseUser() {
            this.$chooseUser({
                single: false,
            }).then(res => {
                this.info.UserName = res.UserName;
                this.info.UserId = res.UserId;
            })
        },
        chooseCert(collapse, list, classification) {
            this.$chooseCert({
                type: 3,
                classification: classification,
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
        },
        async getGetVehicleTypes() {
            try {
                let res = await this.Post('/GetVehicleTypes', {page: 1, rows: 999});
                if (res.status == 2000) {
                    this.vehicleTypes = res.data.list;
                }
            } catch (error) {
                
            }
            return Promise.resolve();
        },
        setCerts(list, info) {
            list.forEach(item => {
                Object.keys(certKeysName).forEach((key, index) => {
                    if (!info[key]) {
                        this.$set(info, key, []);
                    }
                    // 已存在的不用重复添加
                    if (item.CertificateClassification == (index + 1) && info[key].every(cItem => cItem.CertificateId != item.CertificateId)) {
                        info[key].push(item);
                        this[collapses[index]].push(item.CertificateId);
                    }
                });
            });
        },
        async changeType(val) {
            let item = this.vehicleTypes.find(item => item.VehicleTypeId == val);
            // 剔除没有保存到数据库的数据
            Object.keys(certKeysName).forEach((key, index) => {
                this.info[key] = this.info[key].filter(item => !!item.CertificateManageId);
                this[collapses[index]] = this.info[key].map(item => item.CertificateId);
            });
            if (item) {
                // CertificateClassification: 1证书 2保险 3其他
                let certRes = await this.Get(`/GetCertificateListById?certificateIds=${item.CertificateIds}`);
                if (certRes.status == 2000) {
                    this.setCerts(certRes.data || [], this.info);
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
        }
        .el-date-editor,
        .el-select{
            width: 100%;
        }
        .form-2-col{
            display: flex;
            >div{
                width: 50%;
                &:first-child{
                    margin-right: 40px;
                }
            }
        }
        .split-line{
            &::before{
                content: '';
                display: block;
                margin: 25px -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        .title{
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 22px;
            font-weight: 600;
            &::before{
                content: '';
                border-radius: 2px;
                margin-right: 8px;
                width: 5px;
                height: 16px;
                background: $--color-primary;
            }
        }
        /deep/ .el-collapse{
            margin:20px 0 28px;
            border: 0;
            .el-collapse-item{
                border: 1px solid #DCDFE6;
                border-radius: 6px;
                margin-bottom: 20px;
                overflow: hidden;
                &.is-active{
                    .el-collapse-item__header{
                        border-bottom: 1px solid #DCDFE6;
                    }
                }
                .el-input.is-disabled .el-input__inner,
                .el-textarea.is-disabled .el-textarea__inner{
                    color: #84888f;
                    background: #f7f8f9;
                }
                .el-collapse-item__header{
                    border: 1px solid transparent;
                    padding: 14px 20px;
                    background: #F5F6FA;
                    line-height: inherit;
                    .operation{
                        color: $primary-color;
                        .switch{
                            display: flex;
                            align-items: center;
                            &::before{
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
                            &.open{
                                &::before{
                                    transform: rotateX(180deg);
                                }
                            }
                        }
                        >div:last-child{
                            margin-left: 22px;
                        }
                    }
                }
                .el-collapse-item__arrow{
                    display: none;
                }
                .el-collapse-item__wrap{
                    border: none;
                }
                .el-collapse-item__content{
                    padding: 20px;
                }
            }
        }
    }
</style>