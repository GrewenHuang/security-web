<!--
 * @Description:
 * @Date: 2020-12-08 14:56:10
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-08 16:30:44
 * @FilePath: \zt-traffic-enterprise-view\src\pages\System\UserInfo.vue
-->

<template>
    <!-- 表单开始 -->
    <el-form ref="form" :model="form" :rules="rules" v-loading="loading" element-loading-text="拼命加载中">
        <el-form-item label="姓名" prop="UserName">
            <el-input v-model="form.UserName" disabled placeholder="姓名" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="性别">
            <el-radio-group v-model="form.Gender">
                <el-radio :label="item.id + ''" disabled :key="item.id + ''" v-for="(item, index) in GenderList">{{
                    item.text }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" prop="Tel">
            <el-input v-model="form.Tel" disabled placeholder="手机" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="CardNo">
            <el-input v-model="form.CardNo" disabled placeholder="身份证" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email">
            <el-input v-model="form.Email" disabled placeholder="邮箱" maxlength="50"></el-input>
        </el-form-item>
        <div class="f-c-c">
            <el-button @click="dialogEditCloses()">关 闭</el-button>
        </div>
    </el-form>
    <!-- 表单结束 -->
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";

import Qs from "qs";

export default {
    name: "Password",
    components: {},
    mixins: [request_mixin],
    data() {
        var checkIdentitytionId = (rule, value, callback) => {
            if (!value) {
                return callback();
            }
            // if (!value) {
            //   return callback(new Error("身份证号不能为空"));
            // }
            if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
                callback(new Error("你输入的身份证长度或格式错误"));
            }
            //身份证城市
            var aCity = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外",
            };
            if (!aCity[parseInt(value.substr(0, 2))]) {
                callback(new Error("你的身份证地区非法"));
            }
            // 出生日期验证
            var sBirthday = (
                value.substr(6, 4) +
                "-" +
                Number(value.substr(10, 2)) +
                "-" +
                Number(value.substr(12, 2))
            ).replace(/-/g, "/"),
                d = new Date(sBirthday);
            if (
                sBirthday !=
                d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
            ) {
                callback(new Error("身份证上的出生日期非法"));
            }

            // 身份证号码校验
            var sum = 0,
                weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                codes = "10X98765432";
            for (var i = 0; i < value.length - 1; i++) {
                sum += value[i] * weights[i];
            }
            var last = codes[sum % 11]; //计算出来的最后一位身份证号码
            if (value[value.length - 1] != last) {
                callback(new Error("你输入的身份证号非法"));
            }
            callback();
        };
        return {
            loading: false,
            statusList: [],
            ResetVisible: false,
            EnterpriseType: [],
            Transportation: [],
            Whether: [
                { Code: "1", Text: "是" },
                { Code: "0", Text: "否" },
            ],
            GenderList: [
                { id: 1, text: "男" },
                { id: 2, text: "女" },
                { id: 3, text: "其他" },
            ],
            form: {
                UserName: "", //姓名
                Gender: "", //性别
                Tel: "", //手机号码
                CardNo: "", //身份证
                Email: "", //邮箱
            },

            rules: {
                UserName: [
                    { required: true, message: "请输入姓名", trigger: "blur" },
                    {
                        validator: function (rule, value, callback) {
                            if (/^[\u4e00-\u9fa5]{2,10}$/.test(value) == false) {
                                callback(new Error("姓名只能输入2-10个中文"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                Tel: [
                    {
                        validator: function (rule, value, callback) {
                            if (value == "") {
                                callback();
                            } else if (
                                /^((0\d{2,4}-\d{7,8})|(1[3456789]\d{9}))$/.test(value) == false
                            ) {
                                callback(new Error("电话号格式错误"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
                CardNo: [{ validator: checkIdentitytionId, trigger: "blur" }],

                Email: [
                    {
                        validator: function (rule, value, callback) {
                            if (value == "") {
                                callback();
                            } else if (
                                /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(
                                    value
                                ) == false
                            ) {
                                callback(new Error("邮箱格式错误"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    props: {
        fatherMethod: {
            type: Function,
            default: null
        }
    },
    methods: {

        dialogEditCloses() {
            this.fatherMethod();
        },

        SaveUserInfo() {
            var that = this;
            that.$refs.form.validate((valid) => {
                if (valid) {
                    that.loading = true;
                    that.Post("/UpdateUserInfo", that.form).then((result) => {
                        if (result && result.status == 2000) {
                            that.$message({
                                message: "更新成功",
                                type: "success",
                            });
                        } else {
                            that.$message({
                                message: result.message,
                                type: "error",
                            });
                        }
                        that.loading = false;
                    });
                }
            });
        },
    },
    mounted() {
        let that = this;
        let UserInfo = Qs.parse(window.localStorage.getItem("userinfo"));
        that.form.UserName = UserInfo.UserName;
        that.form.Gender = UserInfo.Gender + "";
        that.form.Tel = UserInfo.Tel;
        that.form.CardNo = UserInfo.CardNo;
        that.form.Email = UserInfo.Email;
    },
    created() {
        var that = this;
    },
};
</script>
<style>
/* body .el-scrollbar__wrap {
    overflow: hidden !important;
} */
</style>
