import Vue from "vue";
import Router from "vue-router";
import util from "@/common/util.js";
import routes from "./routes";
import "@/plugins/nprogress.css";
import NProgress from "@/plugins/nprogress.js";
import Qs from "qs";
import API from "@/api/api_user";
import { result } from "lodash";
Vue.use(Router);
let router = new Router({
  mode: "hash",
  routes
});

let loginUrl = util.getLoginUrl();
function expandMenusData() {
  let menus = JSON.parse(localStorage.getItem("menus"));
  let list = [
    /** 增加白名单，不受权限控制 */
    {
      url: "/dashboard",
      text: "首页"
    },
    {
      url: "/401",
      text: "无权限"
    },
    {
      url: "/404",
      text: "无页面"
    },
    {
      url: "/Mail",
      text: "待办事项"
    },
    {
      url: "/transit-board",
      text: "看板"
    }
  ];
  function getChildrenList(item) {
    let list = [];
    if (item.children && item.children.length) {
      for (let item of item.children) {
        list.push(...getChildrenList(item));
      }
    } else if (item.url) {
      list.push(item);
    }
    return list;
  }
  for (let key in menus) {
    let item = menus[key];
    list.push(...getChildrenList(item));
  }
  return list.map(item => item.url);
}
// 全屏事件

// function toggleFullScreen() {
//   if (!document.fullscreenElement) {
//     // 进入全屏
//     document.documentElement.requestFullscreen();
//   } else {
//     // 退出全屏
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     }
//   }
// }
// 静默登录逻辑
function loginM(account) {
  let loginParams = new Object();
  loginParams.LoginName = account.username;
  loginParams.Password = account.pwd;
  loginParams.EnterpriseCode = 500543001;
  console.log(loginParams, "loginParamsloginParamsloginParams");
  return new Promise((resolve, reject) => {
    API.login(loginParams).then(result => {
      if (result && result.status == 2000) {
        var userInfo = result.data;
        let menus = userInfo.Menus;
        filterMenus(menus, userInfo.Enterprise.Enterpriselevel == 3, [
          "taskDistribution",
          "constituentCompany"
        ]);
        let authList = [];
        let positionCompanyAuth = {
          title: "岗位分公司相关权限",
          authority: []
        };
        positionCompanyAuth.authority = [
          ...(userInfo.BtnCodes || []),
          ...(userInfo.TabCodes || [])
        ];
        authList.push(positionCompanyAuth);
        localStorage.setItem("perms", JSON.stringify(authList));
        localStorage.setItem("ttoken", userInfo.ttoken);
        localStorage.setItem("enterpriseId", userInfo.EnterpriseId);
        localStorage.setItem("menus", JSON.stringify(menus));
        localStorage.setItem("userinfo", Qs.stringify(userInfo));
        localStorage.setItem(
          "enterpriseInfo",
          JSON.stringify(userInfo.Enterprise)
        );

        localStorage.setItem(
          str2Unicode("username"),
          str2Unicode(account.username)
        );
        localStorage.setItem(str2Unicode("password"), str2Unicode(account.pwd));
        localStorage.setItem(
          str2Unicode("rememberPasswrod"),
          '0'
        );

        // url + code
        // '/equipment-manage101'

        resolve(true);
      }
    });
  });
}
function filterMenus(menus = [], isFilter, filterArr = []) {
  if (isFilter) {
    for (let i = 0; i < menus.length; i++) {
      let menu = menus[i];
      let url = menu.url || "";
      if (filterArr.includes(url.replace("/", ""))) {
        menus.splice(i, 1);
      } else if (menu.children && !!menu.children.length) {
        filterMenus(menu.children, isFilter, filterArr);
      }
    }
  }
}
function str2Unicode(str) {
  console.log(str,'str')
  let len = str.length;
  let codes = [];
  for (let i = 0; i < len; i++) {
    codes.push(str.charCodeAt(i));
  }
  // console.log(codes.join())
  console.log(codes.join(encodeURIComponent("&")),'55555555555555')
  return codes.join(encodeURIComponent("&"));
}
function unicode2Str(str) {
  if (!str) return "";
  let codes = str.split(encodeURIComponent("&"));
  let len = codes.length;
  let strs = "";
  for (let i = 0; i < len; i++) {
    strs += String.fromCharCode(codes[i]);
  }
  return strs;
}
const progress = NProgress || {
  start: () => {},
  done: () => {},
  remove: () => {}
};
router.beforeEach((to, from, next) => {
  console.log("登录操作999999999");
  progress.start();
  let menus = expandMenusData();

  if (to.path.startsWith(loginUrl)) {
    window.localStorage.removeItem("userinfo");
    next();
  }
  //    else if (!menus.includes(to.path)) {
  //     // 无权限
  //     next({path: '/401'});
  //   }
  else if (to.path.startsWith("/404")) {
    next();
  } else if (to.path.includes("http")) {
    window.open(to.fullPath.substr(1));
  } else {
    let user = window.localStorage.getItem("userinfo");
    if (!user) {
      if (to.path != "/rb-login") {
        if (to.query.username) {
          //  静默登录
          loginM(to.query).then(res => {
            next();
            // toggleFullScreen();
          });
        } else {
          next({ path: loginUrl });
        }
      } else {
        next({ path: loginUrl });
      }
    } else {
      next();
    }
  }
});
router.afterEach(() => {
  progress.done();
});
export default router;
