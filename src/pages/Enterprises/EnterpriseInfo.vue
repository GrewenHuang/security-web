
<template>
    <page-layout class="page" :loading="loading" element-loading-text="拼命加载中">
        <!-- 表单开始 -->
        <el-form class="form" ref="form" :model="form" :rules="rules">
            <div class="title spacing-bottom">基本信息</div>
			<div class="form-2-col">
			    <el-form-item
			        label="企业名称"
			        class="form_box"
			    >
			        <el-input
			            v-model="form.EnterpriseName"
			            disabled
			        ></el-input>
			    </el-form-item>
			    <el-form-item
			        label="企业简称"
			        class="form_box"
			        prop="EnterpriseNameAs"
			    >
			        <el-input
			            v-model="form.EnterpriseNameAs"
			            maxlength="20"
			            show-word-limit
			        ></el-input>
			    </el-form-item>
			</div>
            <div class="form-2-col">
                <el-form-item
                    label="主要负责人姓名"
                    class="form_box"
                    prop="LegalPersionName"
                >
                    <el-input
                        v-model="form.LegalPersionName"
                        maxlength="10"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="主要负责人电话"
                    class="form_box"
                    prop="LegalPersionTel"
                >
                    <el-input
                        v-model="form.LegalPersionTel"
                        maxlength="20"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </div>
            <el-form-item
                label="企业地址"
                class="form_box"
                prop="EnterpriseAddress"
            >
                <el-input
                    v-model="form.EnterpriseAddress"
                    maxlength="100"
                    show-word-limit
                >
                    <el-button
                        slot="append"
                        class="map-btn"
                        size="mini"
                        @click="showMap()"
                        type="primary"
                    >地图选点</el-button>
                </el-input>
            </el-form-item>
            <div class="form-2-col">
                <el-form-item
                    label="纬度"
                    class="form_box"
                    prop="Latitude"
                >
                    <el-input
                        type="number"
                        disabled
                        v-model="form.Latitude"
                        :min="0"
                        :max="90"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="经度"
                    class="form_box"
                    prop="Longitude"
                >
                    <el-input
                        type="number"
                        disabled
                        v-model="form.Longitude"
                        :min="0"
                        :max="180"
                    ></el-input>
                </el-form-item>
            </div>
            <el-form-item
                label="公司简介"
                class="form_box"
            >
                <el-input
                    type="textarea"
                    rows="5"
                    v-model="form.EnterpriseProfile"
                    maxlength="1000"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <div v-show="form.Certificates.length">
                <div class="gutter"></div>
                <div class="f-b-c">
                    <div class="title">证件信息</div>
                    <!-- <el-button type="primary" @click="chooseCert(collapseActive, form.Certificates, 1)">选择证件</el-button> -->
                </div>
                <el-collapse
                    v-model="collapseActive"
                >
                    <el-collapse-item
                        v-for="(item, i) in form.Certificates"
                        :key="i"
                        :name="item.CertificateId"
                    >
                        <div slot="title" class="f-b-c f1">
                            <span>{{ item.CertificateName }}</span>
                            <div class="f--c operation">
                                <div class="switch" :class="{open: collapseActive.includes(item.CertificateId)}">
                                    {{ collapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
                                </div>
                                <!-- <div @click.stop="form.Certificates.splice(i, 1)">删除</div>  -->
                            </div>
                        </div>
                        <template v-for="(filed, index) in item.CertificateFileds">
                            <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                                <el-form-item
                                    :label="filed.FiledName"
                                >
                                    <el-input placeholder="请输入" v-model="filed.FiledValue" v-if="filed.TextType == 2"></el-input>
                                    <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
                                    <custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4"/>
                                </el-form-item>
                                <el-form-item
                                    :label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
                                    v-if="item.CertificateFileds[index + 1]"
                                >
                                    <el-input placeholder="请输入" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
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
                                class="el-input"
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
            <div v-show="form.Insures.length">
                <div class="gutter"></div>
                <div class="f-b-c">
                    <div class="title">保险信息</div>
                    <!-- <el-button type="primary" @click="chooseCert(insureCollapseActive, form.Insures, 2)">选择保险</el-button> -->
                </div>
                <el-collapse
                    v-model="insureCollapseActive"
                >
                    <el-collapse-item
                        v-for="(item, i) in form.Insures"
                        :key="i"
                        :name="item.CertificateId"
                    >
                        <div slot="title" class="f-b-c f1">
                            <span>{{ item.CertificateName }}</span>
                            <div class="f--c operation">
                                <div class="switch" :class="{open: insureCollapseActive.includes(item.CertificateId)}">
                                    {{ insureCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
                                </div>
                                <!-- <div @click.stop="form.Insures.splice(i, 1)">删除</div>  -->
                            </div>
                        </div>
                        <template v-for="(filed, index) in item.CertificateFileds">
                            <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                                <el-form-item
                                    :label="filed.FiledName"
                                >
                                    <el-input placeholder="请输入" v-model="filed.FiledValue" v-if="filed.TextType == 2"></el-input>
                                    <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
                                    <custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4"/>
                                </el-form-item>
                                <el-form-item
                                    :label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
                                    v-if="item.CertificateFileds[index + 1]"
                                >
                                    <el-input placeholder="请输入" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
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
                                class="el-input"
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
            <div class="gutter"></div>
            <div class="f-b-c">
                <div class="title">其他信息</div>
                <!-- <el-button type="primary" @click="chooseCert(otherCollapseActive, form.Others, 3)">选择</el-button> -->
            </div>
            <el-collapse
                v-model="otherCollapseActive"
            >
                <el-collapse-item
                    v-for="(item, i) in form.Others"
                    :key="i"
                    :name="item.CertificateId"
                >
                    <div slot="title" class="f-b-c f1">
                        <span>{{ item.CertificateName }}</span>
                        <div class="f--c operation">
                            <div class="switch" :class="{open: otherCollapseActive.includes(item.CertificateId)}">
                                {{ otherCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
                            </div>
                            <!-- <div @click.stop="form.Others.splice(i, 1)">删除</div>  -->
                        </div>
                    </div>
                    <template v-for="(filed, index) in item.CertificateFileds">
                        <div class="form-2-col" :key="index" v-if="index % 2 == 0">
                            <el-form-item
                                :label="filed.FiledName"
                            >
                                <el-input placeholder="请输入" v-model="filed.FiledValue" v-if="filed.TextType == 2"></el-input>
                                <el-date-picker placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="filed.FiledValue" v-if="filed.TextType == 3"></el-date-picker>
                                <custom-date-range v-model="filed.FiledValue" v-if="filed.TextType == 4"/>
                            </el-form-item>
                            <el-form-item
                                :label="item.CertificateFileds[index + 1] ? item.CertificateFileds[index + 1].FiledName : ''"
                                v-if="item.CertificateFileds[index + 1]"
                            >
                                <el-input placeholder="请输入" v-model="item.CertificateFileds[index + 1].FiledValue" v-if="item.CertificateFileds[index + 1].TextType == 2"></el-input>
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
                            class="el-input"
                            :accept="'.jpeg,.png,.jpg,.gif'"
                            :fileList.sync="item.CertificateManagePhotos"
                            list-type="picture-card"
                        >
                            <i class="el-icon-plus"></i>
                        </custom-upload>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <!-- 表单结束 -->

        <div class="f-c" slot="footer">
            <el-button
                type="primary"
                class="save-btn"
                @click="SaveEnterprise()"
                >保存</el-button
            >
            <el-button class="save-btn" @click="showInfo">查看</el-button>
        </div>
        <el-dialog v-dialog-drag  title="地图" :visible.sync="gaodeDialogVisible" width="1100px">
            <div id="container">
                <el-amap-search-box
                    class="search-box"
                    :search-option="searchOption"
                    :on-search-result="onSearchResult"
                ></el-amap-search-box>
                <el-amap
                    class="amap-box"
                    :amap-manager="amapManager"
                    :vid="'amap-vue'"
                    :zoom="zoom"
                    :center="center"
                    :events="events"
                    :plugin="plugins"
                >
                    <el-amap-marker :position="center"> </el-amap-marker>
                </el-amap>
                <el-row style="margin-top: 10px" :gutter="20">
                    <el-col :span="4">
                        <el-input :value="form.Longitude">
                            <template slot="prepend">经度：</template>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input :value="form.Latitude">
                            <template slot="prepend">纬度</template>
                        </el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input :value="form.EnterpriseAddress">
                            <template slot="prepend">地址：</template>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="hide()"
                            >确定</el-button
                        >
                        <el-button type="info" @click="hide()">取消</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
        <info ref="info"/>
    </page-layout>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import { AMapManager } from "vue-amap";
import info from './enterpriseInfo/pdf.vue';
let amapManager = new AMapManager();
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
const certKeysName = {Certificates: '证件', Insures: '保险', Others: '其他'};
export default {
    name: "enterpriseinfo",
    components: { info },
    mixins: [request_mixin],
    data() {
        let self = this;
        return {
            input: "",
            form: {
                EnterpriseName: "", //企业名称
                EnterpriseAddress: "", //企业地址
                LegalPersionName: "", // 主要负责人姓名
                LegalPersionTel: "", // 主要负责人电话
				EnterpriseNameAs: "", //企业简称
                Longitude: 0, // 经度
                Latitude: 0, // 纬度
                Certificates: [], // 证件集
                Insures: [], // 保险
                Others: [], // 其他
            },
            address: null,
            searchKey: "",
            amapManager,
            center: process.env.BASE_CENTER,
            zoom: 15,
            loaded: false,
            searchOption: {
                city: "全国",
                citylimit: true,
            },
            events: {
                click(e) {
                    let { lng, lat } = e.lnglat;
                    self.form.Longitude = lng;
                    self.form.Latitude = lat;
                    self.center = [lng, lat];

                    AMap.service("AMap.Geocoder", function () {
                        //回调函数
                        //实例化Geocoder
                        let geocoder = new AMap.Geocoder({
                            city: "010", //城市，默认：“全国”
                        });
                        //TODO: 使用geocoder 对象完成相关功能
                        geocoder.getAddress(
                            [e.lnglat.lng, e.lnglat.lat],
                            function (status, result) {
                                self.form.EnterpriseAddress =
                                    result.regeocode.formattedAddress;
                                document.querySelector(
                                    ".search-box-wrapper input"
                                ).value = self.input;
                                document.querySelector(
                                    ".search-box-wrapper input"
                                ).value = result.regeocode.formattedAddress;
                                self.$nextTick();
                            }
                        );
                    });
                },
            },
            plugins: [
                {
                    pName: "Geocoder", //使用AMap.Geocoder插件
                    events: {
                        init(o) {
                            o.getAddress(
                                self.center,
                                function (status, result) {
                                    if (
                                        status === "complete" &&
                                        result.info === "OK"
                                    ) {
                                        setTimeout(() => {
                                            self.input =
                                                result.regeocode.formattedAddress;
                                            document.querySelector(
                                                ".search-box-wrapper input"
                                            ).value = self.input;
                                        }, 50);

                                        self.$nextTick();
                                    }
                                }
                            );
                        },
                    },
                },
                {
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 100, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //显示定位按钮，默认：true
                    buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
                    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
                    extensions: "all",
                    //地图定位按钮
                    pName: "Geolocation",
                    init(o) {
                        // o 是高德地图定位插件实例
                        o.getCurrentPosition((status, result) => {
                            if (result && result.position) {
                                self.lng = result.position.lng;
                                self.lat = result.position.lat;
                                self.center = [self.lng, self.lat];
                                self.loaded = true;
                                self.$nextTick();
                            }
                        });
                    },
                },
                {
                    //地图工具条
                    pName: "ToolBar",
                    init(o) {},
                },
                {
                    //左下角缩略图插件 比例尺
                    pName: "Scale",
                    init(o) {},
                },
            ],
            gaodeDialogVisible: false,
            loading: false,

            rules: {
                Longitude: [
                    {
                        required: true,
                        message: "请选择经纬度",
                    },
                ],
                Latitude: [
                    {
                        required: true,
                        message: "请选择经纬度",
                    },
                ],
                EnterpriseAddress: [
                    {
                        required: true,
                        message: "请输入企业地址",
                        trigger: "blur",
                    },
                ],
                LegalPersionName: [
                    {
                        required: true,
                        message: "请输入主要负责人姓名",
                        trigger: "blur",
                    },
                ],
                LegalPersionTel: [
                    {
                        required: true,
                        message: "请输入主要负责人电话",
                        trigger: "blur",
                    },
                    {
                        validator: function (rule, value, callback) {
                            if (
                                /^((0\d{2,4}-\d{7,8})|(1[3456789]\d{9}))$/.test(
                                    value
                                ) == false
                            ) {
                                callback(new Error("电话号格式错误"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
            },
            collapseActive: [], 
            insureCollapseActive: [],
            otherCollapseActive: []
        };
    },
    methods: {
        onSearchResult(pois) {
            this.input = document.querySelector(
                ".search-box-wrapper input"
            ).value;
            this.form.EnterpriseAddress = this.input;
            this.center = [pois[0].lng, pois[0].lat];
            this.form.Longitude = pois[0].lng;
            this.form.Latitude = pois[0].lat;
        },
        showMap() {
            this.gaodeDialogVisible = true;
        },
        hide() {
            this.gaodeDialogVisible = false;
        },
        SaveEnterprise() {
            var that = this;
            that.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    that.Post("/SaveEnterprise", this.form).then((result) => {
                        if (!result || !result.status) {
                            this.$message({
                                message: "请求异常",
                                type: "error",
                            });
                            return;
                        }
                        if (result.status == 2000) {
                            this.$message({
                                message: "保存成功",
                                type: "success",
                            });
                        } else {
                            this.$message({
                                message: result.message,
                                type: "error",
                            });
                        }
                        this.loading = false;
                    });
                }
            });
        },

        GetEnterprise() {
            this.loading = true;
            this.Post("/GetEnterprise", {}).then((result) => {
                if (result.status != 2000 || !result.data) {
                    this.$confirm('获取企业信息失败，点击刷新按钮重新获取', '提示', {
                        confirmButtonText: '刷新',
                    }).then(res => {
                        this.GetEnterprise();
                    })
                    return;
                }
                this.form = result.data;
                this.setCerts(result.data.CertificateList || [], this.form);
                this.collapseActive = this.form.Certificates.map(item => item.CertificateId);
                this.insureCollapseActive = this.form.Insures.map(item => item.CertificateId);
                this.otherCollapseActive = this.form.Others.map(item => item.CertificateId);
                this.loading = false;
            });
        },
        chooseCert(collapse, list, classification) {
            this.$chooseCert({
                type: 1,
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
        },
        showInfo() {
            this.$refs.info.show(this.form);
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
    },
    async created() {
        this.GetEnterprise();
    }
};
</script>
<style lang="scss" scoped>
#container {
    width: 100%;
    height: 650px;
}
.amap-box {
    width: 100%;
    height: 600px;
}
/deep/ .el-form--inline .el-form-item__content {
    width: 70%;
}

/deep/ .el-vue-search-box-container {
    position: absolute;
    right: 25px;
    top: 79px;
}
.save-btn {
    width: 110px;
    height: 45px;
}
.form{
    padding: 20px 30px 0;
    /deep/ .el-form-item__label{
        margin-bottom: 8px;
        line-height: 1;
    }
    /deep/ .el-input-group__append{
        border-color: $--color-primary;
    }
    .map-btn{
        border-radius: 0;
        background: $--color-primary;
        color: #fff;
    }
    /deep/ .el-collapse{
        margin-top: 28px;
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
                .title{
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    line-height: 22px;
                    color: #302E37;
                    font-weight: 600;
                }
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
.gutter{
    margin: 30px -30px;
    height: 10px;
    background: #F2F2F2;
}
.page{
    /deep/ .el-button--primary.is-plain{
        border-style: dashed;
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
.spacing-bottom{
    margin-bottom: 20px;
}
</style>
