<template>
    <page-layout
        :loading="loading"
        element-loading-text="拼命加载中"
        :pages="pages"
        @current-change="handleCurrentChange"
    >
        <!-- 条件栏 开始 -->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    v-model="filters.Name"
                    placeholder="设备名称"
                ></el-input>
                <el-button
                    type="primary"
                    @click="handleSearch()"
                    >查询</el-button
                >
            </div>
            <div>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="dialogEditOpen(-1)"
                    >新增</el-button
                >
            </div>
        </div>
        <!-- 条件栏 结束 -->

        <!--列表 开始-->
        <el-table
            :data="pages.list"
            highlight-current-row
            :header-cell-style="$tableStyle"
            v-loading="loading"
            style="width: 100%"
        >
            <el-table-column
                label="序号"
                align="center"
                header-align="center"
                type="index"
                width="50"
            >
            </el-table-column>
            <el-table-column label="特种设备目录">
                <template slot-scope="scope">
                    <unfold :data="scope.row.CatalogueNames" :maxLen="10" />
                </template>
            </el-table-column>

            <el-table-column
                label="厂牌型号"
                align="center"
                width="150"
                header-align="center"
                prop="Eqtype"
            >
            </el-table-column>
            <el-table-column
                label="出厂编号"
                align="center"
                width="150"
                header-align="center"
                prop="DeliveryNo"
            >
            </el-table-column>
            <el-table-column
                label="主要参数"
                align="center"
                width="200"
                header-align="center"
                prop="Parameter"
            >
            </el-table-column>
            <el-table-column
                label="放置地点"
                align="center"
                header-align="center"
            >
                <template slot-scope="scope">
                    <unfold :data="scope.row.Location" :maxLen="10" />
                </template>
            </el-table-column>

            <el-table-column
                label="设备负责人/联系方式"
                align="center"
                header-align="center"
                width="160"
            >
                <template slot-scope="scope">
                    <div>
                        {{ scope.row.DirectorName }} / {{ scope.row.Tel }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="Location"
                align="center"
                header-align="center"
                label="购置日期"
                width="100"
            >
                <template slot-scope="scope">
                    {{ FormatterDate(scope.row.PurchaseDate) }}
                </template>
            </el-table-column>
            <el-table-column
                width="110"
                align="center"
                header-align="center"
                label="下次检验日期"
            >
                <template slot-scope="scope">
                    {{ FormatterDate(scope.row.NextCheckDate) }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="160"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            @click="dialogEditOpen(scope.$index, scope.row)"
                            >编辑</el-button
                        >
                        <el-popconfirm
                            title="是否删除该数据？"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="DeleteData(scope.row.SpecialEquipmentId)"
                        >
                            <el-button
                                type="text"
                                text-plain
                                slot="reference"
                                @confirm="
                                    DeleteData(scope.row.SpecialEquipmentId)
                                "
                                >删除</el-button
                            >
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表 结束 -->

        <!--编辑弹层 开始-->
        <el-dialog v-dialog-drag 
            :title="edits.dialogEditTitle"
            :visible.sync="edits.dialogEditShow"
            :close-on-click-modal="false"
            @close="dialogEditClose()"
            width="50%"
            top="8vh"
        >
            <template>
                <el-scrollbar class="default-scrollbar__wrap">
                    <el-form
                        :rules="edits.rules"
                        ref="editsform"
                        :model="edits.Data"
                    >
                        <div class="form-2-col">
                            <el-form-item
                                label="特种设备目录"
                                prop="Catalogue"
                            >
                                <el-cascader
                                    v-model="edits.Data.Catalogue"
                                    ref="elcascader"
                                    :options="edits.options"
                                    :show-all-levels="false"
                                    :props="{
                                        expandTrigger: 'hover',
                                        checkStrictly: true,
                                    }"
                                    @change="regionHandleChange"
                                    @visible-change="elCascaderOnlick"
                                    @expand-change="elCascaderOnlick"
                                ></el-cascader>
                            </el-form-item>
                            <el-form-item label="厂牌型号" prop="Eqtype">
                                <el-input
                                    v-model="edits.Data.Eqtype"
                                    maxlength="100"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-2-col">
                            <el-form-item
                                label="出厂编号"
                                prop="DeliveryNo"
                            >
                                <el-input
                                    v-model="edits.Data.DeliveryNo"
                                    maxlength="100"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="主要参数" prop="Parameter">
                                <el-input
                                    v-model="edits.Data.Parameter"
                                    maxlength="100"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-2-col">
                            <el-form-item
                                label="购置日期"
                                prop="PurchaseDate"
                            >
                                <el-date-picker
                                    class="el-input"
                                    v-model="edits.Data.PurchaseDate"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="选择日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item
                                label="下次检验日期"
                                prop="NextCheckDate"
                            >
                                <el-date-picker
                                    class="el-input"
                                    v-model="edits.Data.NextCheckDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="form-2-col">
                            <el-form-item label="放置地点">
                                <el-input
                                    v-model="edits.Data.Location"
                                    maxlength="100"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="设备负责人">
                                <choose-user
                                    v-model="edits.Data"
                                    idKey="DirectorId"
                                    nameKey="DirectorName"
                                ></choose-user> 
                            </el-form-item>
                        </div>
                        <div class="form-2-col">
                            <div>
                                <el-form-item label="出厂资料">
                                    <el-upload
                                        class="el-input"
                                        :action="url()"
                                        :accept="upload.all_suffix"
                                        list-type="picture-card"
                                        :before-upload="before"
                                        :on-change="
                                            (file, fileList) => {
                                                change(file, 1);
                                            }
                                        "
                                        :before-remove="
                                            (file, fileList) => {
                                                return before_remove(file, 1);
                                            }
                                        "
                                        :file-list="arrFilesFun(1)"
                                        :on-preview="preview"
                                    >
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                </el-form-item>
                                <el-dialog v-dialog-drag 
                                    :visible.sync="upload.preview_visible"
                                    :modal="false"
                                    :close-on-click-modal="true"
                                >
                                    <img
                                        width="100%"
                                        :src="upload.preview_url"
                                        alt=""
                                    />
                                </el-dialog>
                            </div>
                            <div>
                                <el-form-item label="使用登记证">
                                    <el-upload
                                        class="el-input"
                                        :action="url()"
                                        :accept="upload.all_suffix"
                                        list-type="picture-card"
                                        :before-upload="before"
                                        :on-change="
                                            (file, fileList) => {
                                                change(file, 2);
                                            }
                                        "
                                        :before-remove="
                                            (file, fileList) => {
                                                return before_remove(file, 2);
                                            }
                                        "
                                        :file-list="arrFilesFun(2)"
                                        :on-preview="preview"
                                    >
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                </el-form-item>

                                <el-dialog v-dialog-drag 
                                    :visible.sync="upload.preview_visible"
                                    :modal="false"
                                    :close-on-click-modal="true"
                                >
                                    <img
                                        width="100%"
                                        :src="upload.preview_url"
                                        alt=""
                                    />
                                </el-dialog>
                            </div>
                        </div>

                        <div class="form-2-col">
                            <div>
                                <el-form-item label="检查检验报告">
                                    <el-upload
                                        class="el-input"
                                        :action="url()"
                                        :accept="upload.all_suffix"
                                        list-type="picture-card"
                                        :before-upload="before"
                                        :on-change="
                                            (file, fileList) => {
                                                change(file, 3);
                                            }
                                        "
                                        :before-remove="
                                            (file, fileList) => {
                                                return before_remove(file, 3);
                                            }
                                        "
                                        :file-list="arrFilesFun(3)"
                                        :on-preview="preview"
                                    >
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                </el-form-item>

                                <el-dialog v-dialog-drag 
                                    :visible.sync="upload.preview_visible"
                                    :modal="false"
                                    :close-on-click-modal="true"
                                >
                                    <img
                                        width="100%"
                                        :src="upload.preview_url"
                                        alt=""
                                    />
                                </el-dialog>
                            </div>
                        </div>
                    </el-form>
                </el-scrollbar>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="dialogEditClose()"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        @click="dialogEditSave()"
                        :loading="edits.dialogSaveLoading"
                        slot="reference"
                        >提交</el-button
                    >
                </div>
            </template>
        </el-dialog>
        <!-- 编辑弹层 结束 -->
    </page-layout>
</template>
<script>
import API_BASIC from "@/api/api_basic";
import API_ENTERPRISE from "@/api/api_enterprise";
import RULECONFIG from "@/common/ruleConfig";

import request_mixin from "@/mixins/request-mixin.js";

import upload_mixin from "@/mixins/upload-mixin.js";
import Unfold from "../../components/common/unfold.vue";

export default {
    name: "SpecialEquipment",
    components: { Unfold },
    mixins: [request_mixin, upload_mixin], //page_mixin
    data() {
        return {
            loading: false, //页面加载遮罩层显示状态
            StatusList: [], //状态列表
            Whether: [
                //下拉框是否选择列表
                { Code: "1", Text: "是" },
                { Code: "0", Text: "否" },
            ],
            // IsDangerous:true, v-if="IsDangerous">
            //查询条件
            filters: {
                Name: "",
                Status: "",
            },
            //分页
            pages: { list: [], total: 0, page: 1, rows: 20 },
            //编辑
            edits: {
                options: [],
                dialogEditShow: false, //弹窗显示状态
                dialogSaveLoading: false, //保存提交状态
                dialogEditTitle: "", //弹窗标题
                dialogFormLabelWidth: "120px", //弹窗表单label宽度
                //编辑数据
                Data: {},
                //表单验证规则
                rules: {
                    DeliveryNo: RULECONFIG.Text("出厂编号"),
                    NextCheckDate: RULECONFIG.Date("下次检验日期"),
                    Catalogue: RULECONFIG.Select("特种设备目录"),
                    PurchaseDate: RULECONFIG.Date("购置日期"),
                    Parameter: RULECONFIG.Date("主要参数"),
                    Eqtype: RULECONFIG.Date("厂牌型号"),
                },
            },
        };
    },
    created() {
        var that = this;
        that.upload.arrFiles = [[], [], [], [], [], [], [], []];
    },
    //自定义方法
    methods: {
        regionHandleChange(v) {
            this.edits.Data.Catalogue = v[v.length - 1];
        },
        elCascaderOnlick() {
            let that = this;
            // .el-cascader-node__label 和 .el-cascader-panel .el-radio 这是Element级联选择器的类，可以参考下方截图
            setTimeout(function () {
                document
                    .querySelectorAll(".el-cascader-node__label")
                    .forEach((el) => {
                        el.onclick = function () {
                            this.previousElementSibling.click();
                            // 选中span标签后，关闭下拉框
                            that.$refs.elcascader.dropDownVisible = false;
                        };
                    });
                document
                    .querySelectorAll(".el-cascader-panel .el-radio")
                    .forEach((el) => {
                        el.onclick = function () {
                            // 选中radio后，关闭下拉框
                            that.$refs.elcascader.dropDownVisible = false;
                        };
                    });
            }, 100);
        },

        filterarr(arr) {
            arr.forEach((k) => {
                if (k.children) {
                    k.value = k.id;
                    k.label = k.text;
                    this.filterarr(k.children);
                } else {
                    delete k.children;
                    return false;
                }
            });
            return arr;
        },
        //打开弹窗
        dialogEditOpen(index, row) {
            var that = this;
            that.upload.arrFiles = [[], [], [], [], [], [], [], []];
            API_ENTERPRISE.GetCatalogueTreeNodes().then((res) => {
                this.edits.options = this.filterarr(res.data);
            });
            if (index == -1) {
                //新增
                that.edits.dialogEditTitle = "新增";
                that.dialogEditInit();
            } else {
                //编辑
                that.edits.Data.SpecialEquipmentId = row.SpecialEquipmentId;
                that.upload.arrFiles[1] = row.DeliveryDatas;
                that.upload.arrFiles[2] = row.RegistrationCertificates;
                that.upload.arrFiles[3] = row.InspectionReports;
                that.edits.dialogEditTitle = "编辑";
                that.edits.Data = JSON.parse(JSON.stringify(row));
            }

            that.edits.dialogEditShow = true;
        },
        //初始化弹窗数据
        dialogEditInit() {
            var that = this;
            that.edits.Data = {
                //初始化编辑数据
                SpecialEquipmentId: "0", //Id
                DirectorId: "", //设备负责人
                DeliveryNo: "", //出厂编号
                Parameter: "", //主要性能参数
                Location: "", //放置地点
                NextCheckDate: "", //下次检验日期
                PurchaseDate: "", //购置日期
                Catalogue: "", //特种设备目录
                Status: "1", //状态
                Eqtype: "", //厂牌型号
                VehicleNumber: "", //车辆号牌
                DeliveryDatas: "", //array 出厂资料 选填
                RegistrationCertificates: "", // array 使用登记证 选填
                InspectionReports: "", // array 检测检验报告 选填
            };
        },
        //关闭弹窗
        dialogEditClose() {
            var that = this;
            this.$refs.editsform.resetFields();
            that.upload.arrFiles = [[], [], [], [], [], [], [], []];
            that.edits.dialogEditShow = false;
            that.edits.dialogSaveLoading = false;
        },
        //保存弹窗数据
        dialogEditSave() {
            var that = this;
            that.edits.Data.DeliveryDatas = that.upload.arrFiles[1];
            that.edits.Data.RegistrationCertificates = that.upload.arrFiles[2];
            that.edits.Data.InspectionReports = that.upload.arrFiles[2];
            that.$refs.editsform.validate((valid) => {
                if (valid) {
                    that.edits.dialogSaveLoading = true;

                    API_ENTERPRISE.SaveSpecialEquipment(that.edits.Data).then(
                        (result) => {
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

                                that.dialogEditInit();
                                that.edits.dialogEditShow = false;
                                that.GetList();
                            }

                            that.edits.dialogSaveLoading = false;
                        }
                    );
                }
            });
        },
        //是否签字格式化
        FormatterSign(whether) {
            if (whether) return "已签";
            return "未签";
        },
        //日期格式化 年-月-日
        FormatterDate(data) {
            let dt = new Date(data);
            return (
                dt.getFullYear() +
                "-" +
                (dt.getMonth() + 1) +
                "-" +
                dt.getDate()
            );
        },
        //时间格式化 年-月-日 时:分:秒
        FormatterDateTime(data) {
            let dt = new Date(data);
            return (
                dt.getFullYear() +
                "-" +
                (dt.getMonth() + 1) +
                "-" +
                dt.getDate() +
                " " +
                dt.getHours() +
                ":" +
                dt.getMinutes() +
                ":" +
                dt.getSeconds()
            );
        },
        //金额格式化
        FormatterAmountOfMoney(num) {
            num = num * 1;
            return num.toFixed(2);
        },
        //状态格式化
        FormatterStatus(Status) {
            if (Status) return "启用";
            return "禁用";
        },
        //是否格式化
        FormatterWhether(whether) {
            if (whether) return "是";
            return "否";
        },
        Textemplate: function (row, column) {
            return "Formatter:" + row.Text + "";
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

            let params = Object.assign(
                {
                    page: that.pages.page,
                    rows: that.pages.rows,
                },
                that.filters
            );
            that.loading = true;

            API_ENTERPRISE.GetSpecialEquipments(params)
                .then(
                    function (result) {
                        that.loading = false;
                        if (result.status == 2000) {
                            that.pages.list = result.data.list;
                            that.pages.total = result.data.count;
                        }
                    },
                    function (err) {
                        that.loading = false;
                        that.message.error({
                            showClose: true,
                            message: err.toString(),
                            duration: 2000,
                        });
                    }
                )
                .catch(function (error) {
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
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                API_ENTERPRISE.DeleteSpecialEquipment({
                    Id: Id,
                })
                    .then(
                        function (result) {
                            that.loading = false;
                            if (result && result.status == 2000) {
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
                        function (err) {
                            that.loading = false;
                            that.$message.error({
                                showClose: true,
                                message: err.toString(),
                                duration: 2000,
                            });
                        }
                    )
                    .catch(function (error) {
                        that.loading = false;
                        that.$message.error({
                            showClose: true,
                            message: "请求出现异常",
                            duration: 2000,
                        });
                    });
            });
        },
    },
    //页面初始化加载事件
    mounted() {
        API_BASIC.GetStatusCom().then((result) => {
            if (
                result.status != 2000 ||
                !result.data ||
                result.data.length < 1
            ) {
                return;
            }
            this.StatusList = result.data;
        });
        this.GetList();
    },
};
</script>
<style lang="scss" scoped>
/deep/ .el-upload {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    line-height: 60px;
    vertical-align: top;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    margin: 0 8px 8px 0;
    display: inline-block;
}
/deep/ .el-cascader {
    width: 100%;
}
.el-date-editor,
.el-select{
    width: 100% !important;
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
</style>
