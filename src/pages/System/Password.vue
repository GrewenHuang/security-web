<!--
 * @Description:
 * @Date: 2020-12-08 13:58:36
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-08 15:31:20
 * @FilePath: \zt-traffic-enterprise-view\src\pages\System\Password.vue
-->
<template>
    <!-- 表单开始 -->
    <el-form ref="form" :model="form" :rules="rules" v-loading="loading" element-loading-text="拼命加载中">
        <el-form-item label="旧密码" prop="OldPassword">
            <el-input v-model="form.OldPassword" placeholder="请输入旧密码" maxlength="18"
                :show-password="true"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="NewPassword">
            <el-input v-model="form.NewPassword" placeholder="请输入新密码" maxlength="18"
                :show-password="true"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="ReNewPassword">
            <el-input v-model="form.ReNewPassword" placeholder="请再次输入新密码" maxlength="18"
                :show-password="true"></el-input>
        </el-form-item>
        <div class="f-c-c">
            <el-button type="primary" @click="UpdatePassword()">保存</el-button>
        </div>
    </el-form>
    <!-- 表单结束 -->
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import API from "@/api/api_user";
import util from "@/common/util.js";

let loginUrl = util.getLoginUrl();
export default {
    name: "Password",
    components: {},
    mixins: [request_mixin],
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.form.NewPassword) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        var validatePass1 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else if (value === this.form.OldPassword) {
                callback(new Error("新密码不能与旧密码相同!"));
            } else {
                callback();
            }
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
            form: {
                OldPassword: "", //旧密码
                NewPassword: "", //新密码
                ReNewPassword: "", //重复新密码
            },

            rules: {
                OldPassword: [
                    { required: true, message: "请输入旧密码", trigger: "blur" },
                ],
                NewPassword: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        pattern: /^[\w+]{6,18}$/,
                        message: "密码为数字,英文字母,下划线,长度为6-18位",
                    },
                    { required: true, validator: validatePass1, trigger: "blur" },
                ],
                ReNewPassword: [
                    { required: true, validator: validatePass2, trigger: "blur" },
                ],
            },
        };
    },
    methods: {
        UpdatePassword() {
            var that = this;
            that.$refs.form.validate((valid) => {
                if (valid) {
                    that.loading = true;
                    that.Post("/UpdatePassword", that.form).then((result) => {
                        if (result && result.status == 2000) {
                            that.$message({
                                message: "更新成功",
                                type: "success",
                            });
                            that.form.OldPassword = "";
                            that.form.NewPassword = "";
                            that.form.ReNewPassword = "";
                            API.logout()
                                .then(function (res) {
                                    window.localStorage.removeItem("userinfo");
                                    window.localStorage.removeItem("ttoken");
                                    window.localStorage.removeItem("enterpriseId");
                                    window.localStorage.removeItem("menus");
                                    that.$router.go(loginUrl); //用go刷新
                                })
                                .catch((err) => {
                                    that.$message.error({
                                        showClose: true,
                                        message: err.message,
                                        duration: 2000,
                                    });
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
};
</script>
<style>
/* body .el-scrollbar__wrap {
    overflow: hidden !important;
} */
</style>
