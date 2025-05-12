<template>
    <div class="layout">
        <div class="ad">
            <div class="ad-content">
                <h2 class="title">安全生产伴你行</h2>
                <div class="desc">消除隐患，预防事故</div>
                <ul class="tip-list">
                    <li>配置智能化</li>
                    <li>流程便捷化</li>
                    <li>操作便捷化</li>
                    <li>统计多样化</li>
                </ul>
            </div>
            <div class='footer'>
                <p class="copyright">备案号:<a href="https://beian.miit.gov.cn" target="_blank">{{copyright}}</a> 最佳显示分辨率：1920*1080</p>
            </div>
        </div>
        <div class="main">
            <el-form ref="AccountFrom" :rules="rules" :model="account" class="form">
                <div class="form-title">您好，欢迎登录管理平台</div>
                <el-form-item class="form-item" prop="username">
                    <el-input name="text"
                        class="_text"
                        v-model="account.username"
                        autocomplete="off"
                        type="text"
                        placeholder="用户名/手机号"
                    />
                </el-form-item>
                <el-form-item class="form-item" prop="pwd">
                    <el-input name="text"
                        class="_text"
                        v-model="account.pwd"
                        autocomplete="off"
                        type="password"
                        placeholder="密码"
                    />
                </el-form-item>
                <drag-verify ref="Verify"
                    :width="width"
                    :height="height"
                    :text="text"
                    :success-text="successText"
                    :background="background"
                    :progress-bar-bg="progressBarBg"
                    :completed-bg="completedBg"
                    :handler-bg="handlerBg"
                    :circle="getShape"
                ></drag-verify>
                <div class="remember-password">
                    <el-checkbox v-model="rememberPassword" :true-label="1" :false-label="0">记住密码</el-checkbox>
                </div>
                <el-button class="btn-send" type="primary"
                    @click.native.prevent="handleLogin"
                    :loading="loading"
                >登录</el-button>
                <div class="wechat-mini">
                    小程序端
                    <div class="wechat-mini-image">
                        <img :src="QRCode" alt="qrcode">
                        <div>微信扫一扫</div>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import util from "@/common/util.js";
import RULECONFIG from "@/common/ruleConfig";
import API from '@/api/api_user';
import dragVerify from '@/components/common/custom-drag-verify';
import Qs from 'qs';
import { theme3 } from '@/assets/styles/theme.scss';
/**
 * 菜单过滤
 */
function filterMenus(menus = [], isFilter, filterArr = []) {
    if (isFilter) {
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            let url = menu.url || '';
            if (filterArr.includes(url.replace('/', ''))) {
                menus.splice(i, 1);
            } else if (menu.children && !!menu.children.length) {
                filterMenus(menu.children, isFilter, filterArr);
            }
        }
    }
}
function str2Unicode(str) {
    let len = str.length;
    let codes = [];
    for (let i = 0; i < len; i++) {
        codes.push(str.charCodeAt(i));
    }
    console.log(codes.join(encodeURIComponent('&')),'99999999')
    return codes.join(encodeURIComponent('&'))
}
function unicode2Str(str){
    if (!str) return '';
    let codes = str.split(encodeURIComponent('&'));
    let len =codes.length;
    let strs = '';
    for (let i = 0; i < len; i++) {
        strs += String.fromCharCode(codes[i])
    }
    return strs;
}
export default {
  data () {
    return {
      QRCode: process.env.MINI_QRCODE,
      width: 400,
      height: 50,
      text: "向右拖动",
      successText: "验证成功",
      background: "#fff",
      progressBarBg: "#bad0fc",
      completedBg: "#3B75FF",
      handlerBg: theme3,
      getShape: false,
      subUrl:'',
      copyright:process.env.COPY_RIGHT,   //备案号
      TITLE:process.env.TITLE,   //标题
      TITLE_ENGLISH:process.env.TITLE_ENGLISH,   //标题英文
      loading: false,
      account: {
        username: '',
        pwd: ''
      },
      rules: {
        username: RULECONFIG.Text("用户名/手机号"),
        pwd: RULECONFIG.Text("密码"),
      },
      checked: true,
      version: '',
      rememberPassword: 0,
    };
  },
  components: { dragVerify },
  beforeCreate() {
    window.localStorage.setItem('defaultTheme', 3);
  },
  created() {
    let loginUrl = util.getLoginUrl();
    if (loginUrl != this.$route.path) {
        this.$router.replace(loginUrl);
    }
    // 清空历史浏览 tab，用户不退出，就一直保存用户已打开的页面 tab，退出后清空已打开的 tab，避免用户登录其他账号出现没有权限的情况
    localStorage.removeItem('tabnavBox');
    this.$store.commit('clearTab');
    this.rememberPassword = localStorage.getItem(str2Unicode('rememberPasswrod')) == 1;
    if (this.rememberPassword == 1) {
        this.account.username = unicode2Str(localStorage.getItem(str2Unicode('username')) || '');
        this.account.pwd = unicode2Str(localStorage.getItem(str2Unicode('password')) || '');
    }
  },
  mounted () {
    var than = this;
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      if (key == 13) {
        than.handleLogin();
      }
    };
    this.subUrl = util.getSubUrl();
  },
  methods: {
    handleLogin () {
      let that = this;

      if (this.$refs.Verify.isPassing == false) {
        that.$message.error({
          showClose: true,
          message: '请拖动滑块来验证',
          duration: 2000
        });
        return false;
      }

      this.$refs.AccountFrom.validate(valid => {
        if (valid && !this.loading) {
          this.loading = true;
          let loginParams = new Object();
          loginParams.LoginName = this.account.username;
          loginParams.Password = this.account.pwd;
          loginParams.EnterpriseCode = 500541001;
          API.login(loginParams).then(
            (result) => {
              if (result && result.status == 2000) {
                var userInfo = result.data;
                let menus = userInfo.Menus;
                // filterMenus(menus, userInfo.Enterprise.Enterpriselevel == 3, ['taskDistribution', 'constituentCompany']);
                let authList = [];
                let positionCompanyAuth = {
                    title: '岗位分公司相关权限',
                    authority: []
                }
                if (userInfo.Enterprise.Enterpriselevel != 0) {
                    // 一级公司不能新增子公司
                    positionCompanyAuth.authority.push('company-add')
                }
                if (userInfo.Enterprise.Enterpriselevel < 3) {
                    // 四级公司以下不能转发任务
                    positionCompanyAuth.authority.push('task-forward')
                    // 四级公司以下不能转发任务
                    positionCompanyAuth.authority.push('task-issued')
                }
                authList.push(positionCompanyAuth);
                localStorage.setItem('perms', JSON.stringify(authList));
                localStorage.setItem('ttoken', userInfo.ttoken);
                localStorage.setItem('enterpriseId', userInfo.EnterpriseId);
                localStorage.setItem('menus', JSON.stringify(menus));
                localStorage.setItem('userinfo', Qs.stringify(userInfo));
                localStorage.setItem('enterpriseInfo', JSON.stringify(userInfo.Enterprise));
                if (this.rememberPassword == 1) {
                    localStorage.setItem(str2Unicode('username'), str2Unicode(this.account.username));
                    localStorage.setItem(str2Unicode('password'), str2Unicode(this.account.pwd));
                    localStorage.setItem(str2Unicode('rememberPasswrod'), +this.rememberPassword);
                } else {
                    localStorage.removeItem(str2Unicode('username'));
                    localStorage.removeItem(str2Unicode('password'));
                    localStorage.removeItem(str2Unicode('rememberPasswrod'));
                }
                if (that.$router.query != undefined && that.$router.query.redirect) {
                  that.$router.push(that.$router.query.redirect);
                } else {
                  that.$router.push({ path: '/' });
                }
              } else {
                that.$message.error({
                  showClose: true,
                  message: result.message || '登录失败',
                  duration: 2000
                });
              }
              that.$nextTick(() => {
                that.loading = false;
              })
            },
            function (err) {
              that.loading = false;
              that.$message.error({
                showClose: true,
                message: (err && err.message) || '登录失败',
                duration: 2000
              });
            }
          ).finally(() => {
            that.loading = false;
          });;
        }
      });
    },
  }
};
</script>
<style>
#app{
    overflow-x: auto;
}
</style>
<style lang="scss" scoped>

.layout {
    display: flex;
    min-width: 1200px;
    min-height: 100vh;
    color: #181B3B;
    background: #F5F5F5;
}
.main{
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
}
.ad{
    display: flex;
    flex-direction: column;
    position: relative;
    width: 36.51041666666667%;
    background: url(../../assets/images/login/bus-login-bg.png) no-repeat center center;
    background-size: cover;
    color: #fff;
    box-sizing: border-box;
    .ad-content{
        margin-top: 19.115549215406563%;
        padding-left: 18.544935805991442%;
    }
    .title{
        font-size: 46px;
        line-height: 63px;
    }
    .desc{
        margin-top: 8px;
        font-size: 18px;
        line-height: 25px;
        color: #ABC4FF;
    }
    .tip-list{
        margin-top: 44px;
        font-size: 18px;
        line-height: 45px;
        li{
            &::before{
                content: '•';
                display: inline-block;
                margin-right: 4px;
                transform: translateY(1px);
                font-size: 24px;
                line-height: 1;
            }
        }
    }
}
.form{
    border-radius: 20px;
    margin-left: 87px;
    padding: 44px 55px;
    font-size: 16px;
    .form-title{
        margin-bottom: 74px;
        font-size: 26px;
        font-weight: 500;
        text-align: center;
    }
    .form-item{
        margin-bottom: 30px;
    }
    .remember-password{
        padding-left: 5px;
        margin: 31px 0 43px;
    }
    .btn-send{
        width: 100%;
        height: 50px;
        box-shadow: 0px 4px 15px 1px rgba(0,75,255,0.3294);
        background: $--color-primary-2;
        font-size: 16px;
    }
    /deep/ .el-input{
        input{
            border: none;
            border-radius: 0;
            height: 50px;
            font-size: 16px;
            &:-webkit-autofill {
                transition: background-color 5000s ease-in-out 0s;
            }
        }
    }
    .remember-password{
        /deep/ .el-checkbox__input{
            transform: scale(1.8571428571428572);
            .el-checkbox__inner{
                border-color: #fff;
            }
        }
        /deep/ .el-checkbox__label{
            padding-left: 20px;
            color: #959595;
        }
    }
    .wechat-mini{
        margin: 60px auto 0;
        position: relative;
        text-align: center;
        cursor: pointer;
        .wechat-mini-image{
            position: absolute;
            top: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%);
            border-radius: 10px;
            width: 130px;
            height: 130px;
            background: #fff;
            font-size: 14px;
            text-align: center;
            visibility: hidden;
            opacity: 0;
            transition: all .3s linear;
            &::before{
                content: '';
                position: absolute;
                top: -6px;
                left: 50%;
                border-radius: 4px;
                transform: translateX(-50%) rotate(45deg);
                width: 12px;
                height: 12px;
                background: #fff;
            }
            img{
                display: block;
                margin: 6px auto;
                width: 90px;
                height: 90px;
            }
        }
        &:hover{
            .wechat-mini-image{
                visibility: visible;
                opacity: 1;
            }
        }
    }
    /deep/ .drag_verify{
        .dv_handler{
            padding: 0 20px;
            color: #fff;
            &.dv_handler_ok_bg{
                i::before{
                    width: 23px;
                    height: 21px;
                    background-image: url(../../assets/images/login/drag-success.png);
                }
            }
            i{
                margin-left: 10px;
                &::before{
                    content: '';
                    display: inline-block;
                    width: 26px;
                    height: 9px;
                    background: url(../../assets/images/login/drag-arrow.png) no-repeat center center;
                    background-size: cover;
                }
            }
        }
    }
}
.footer{
    margin-top: auto;
    margin-bottom: 48px;
    color: #fff;
    text-align: center;
    a{
        color: #fff;
    }
}
</style>
