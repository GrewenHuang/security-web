// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from "element-ui";
// import 'element-ui/lib/theme-chalk/index.css'
import "@/assets/styles/element-variables.module.scss";
// ElementUI.Dialog.props.lockScroll.default = false;
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./vuex/store.js";
import util from "./common/util";
import "animate.css";
// import x2js from 'x2js'
import "@/assets/styles/main.scss";
import "@/assets/styles/base.scss";
import "@/assets/styles/myTransition.scss";
import "@/assets/css/org-tree.less";
import "@/assets/css/z-table-css.css";
import Unfold from "@/components/common/unfold"; //文字长短省略
Vue.component("Unfold", Unfold);
import Vue2OrgTree from "vue2-org-tree";
Vue.use(Vue2OrgTree);
import GeminScrollbar from "vue-gemini-scrollbar";
Vue.use(GeminScrollbar);
import Print from "vue-print-nb"; //打印
Vue.use(Print);
import GaodeMap from "vue-amap"; //高德地图
Vue.use(GaodeMap);
import scroll from "vue-seamless-scroll"; //跑马灯
Vue.use(scroll);
import customUpload from "@/components/common/custom-upload";
Vue.component("custom-upload", customUpload);
import previewMedia from "@/components/common/previewMedia";
Vue.component("preview-media", previewMedia);
import pageLayout from "@/components/page-layout";
Vue.component("page-layout", pageLayout);
import tabsPageLayout from "@/components/tabs-page-layout";
Vue.component("tabs-page-layout", tabsPageLayout);
import whether from "@/components/common/whether";
Vue.component("whether", whether);
import customTag from "@/components/common/custom-tag";
Vue.component("custom-tag", customTag);
import customTags from "@/components/common/custom-tags";
Vue.component("custom-tags", customTags);
import customTree from "@/components/common/custom-tree";
Vue.component("custom-tree", customTree);
import selectPosition from "@/components/common/select-position.vue";
Vue.component("select-position", selectPosition);
import selectLevel from "@/components/common/select-level.vue";
Vue.component("select-level", selectLevel);
import cascaderDepartment from "@/components/common/cascader-department.vue";
Vue.component("cascader-department", cascaderDepartment);
import cascaderFleet from "@/components/common/cascader-fleet.vue";
Vue.component("cascader-fleet", cascaderFleet);
import selectDepartment from "@/components/common/select-department.vue";
Vue.component("select-department", selectDepartment);
import selectEnterprise from "@/components/common/select-enterpirse.vue";
Vue.component("select-enterpirse", selectEnterprise);
import customCard from "@/components/common/custom-card.vue";
Vue.component("custom-card", customCard);
import componentChooseUser from "@/components/common/choose-user.vue";
Vue.component("choose-user", componentChooseUser);
import customUploadDrag from "@/components/common/custom-upload-drag.vue";
Vue.component("customUploadDrag", customUploadDrag);
import noData from "@/components/common/no-data";
Vue.component("no-data", noData);
import customDateRange from "@/components/common/custom-date-range";
Vue.component("custom-date-range", customDateRange);
GaodeMap.initAMapApiLoader({
  // key: 'f6aa4822ef075db57eaaffb737a91e64',
  key: "683fc770e0019486830fb98795f9a576",
  plugin: [
    "AMap.Polyline",
    "AMap.ControlBar",
    "AMap.Autocomplete", //输入提示插件
    "AMap.PlaceSearch", //POI搜索插件
    "AMap.Scale", //右下角缩略图插件 比例尺
    "AMap.OverView", //地图鹰眼插件
    "AMap.ToolBar", //地图工具条
    "AMap.MapType", //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    "AMap.Geolocation", //定位控件，用来获取和展示用户主机所在的经纬度位置
    "AMap.Geocoder",
    "AMap.AMapManager",
    "AMap.Driving",
    "AMap.DragRoute",
    "AMap.Marker",
    "AMap.TileLayer.RoadNet"
  ],
  v: "1.4.4", //AMapManager
  uiVersion: "1.0", //ui版本
  Loca: {
    version: "2.0.0"
  } // 如果需要使用loca组件库，需要加载Loca
});
// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// 导入富文本编辑器样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import dataV from "@jiaminghi/data-view";
Vue.use(dataV);

//import Quill from 'quill'
// 将富文本编辑器，注册为全局可用组件
Vue.use(VueQuillEditor);

Vue.prototype.$bus = new Vue();
Vue.prototype.$tableStyle = {
  background: "#F8F8F8",
  color: "#181B3B"
};
Vue.config.productionTip = false;
Vue.prototype.$checkPhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
Vue.prototype.$checkPhoneNew = /(1[0-9]{10})|([0-9]{3,4})?[0-9]{7,8}/g;
ElementUI.Dialog.props.closeOnClickModal.default = false; // 修改 el-dialog 默认点击遮照为不关闭

Vue.prototype.$openFile = util.openFile;
Vue.prototype.$fileIcons = {
  pdf: require("@/assets/work/pdf.png"),
  png: require("@/assets/work/png.png"),
  jpg: require("@/assets/work/png.png"),
  jpeg: require("@/assets/work/png.png"),
  gif: require("@/assets/work/png.png"),
  mp4: require("@/assets/work/mp4.png"),
  mp3: require("@/assets/work/mp4.png"),
  txt: require("@/assets/work/txt.png"),
  ppt: require("@/assets/work/ppt.png"),
  doc: require("@/assets/work/doc.png"),
  docx: require("@/assets/work/doc.png"),
  xls: require("@/assets/work/xlsx.png"),
  xlsx: require("@/assets/work/xlsx.png"),
  pptx: require("@/assets/work/ppt.png"),
  ppt: require("@/assets/work/ppt.png")
};
import request_mixin from "@/mixins/request-mixin";
Vue.prototype.$Q = {
  get: request_mixin.methods.Get,
  post: request_mixin.methods.Post
};
Vue.use(ElementUI);

/**
 * 挂在 api式 组件
 */
import "@/components/business";

/**
 * 全局共享字段
 */
Vue.prototype.$project_type = util.getSubUrl();

Vue.filter("filterscolor", function(value) {
  let str = "";
  switch (value.Status) {
    case 10:
      str = "";
      break;
    case 20:
      str = "success";
      break;
    case 21:
      str = "danger";
      break;
    case 30:
      str = "warning";
      break;
    case 40:
      str = "success";
      break;
    case 50:
      break;
    case 61:
      break;
    case 62:
      break;
    case 60:
      break;
    case 70:
      break;
  }
  return str;
});
Vue.filter("formatSize", util.change_size);
//xml 2 js object
//创建x2js对象，挂到vue原型上
// Vue.prototype.$x2js = new x2js();
Vue.directive("dialogDrag", {
  componentUpdated(el, binding) {
    if (!binding.value) {
      //监听关闭后重置位置
      setTimeout(() => {
        const dragDom = el.querySelector(".el-dialog");
        dragDom.style.cssText += `;left:${0}px;top:${0}px;`;
      }, 200);
    }
  },
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector(".el-dialog__header");
    const dragDom = el.querySelector(".el-dialog");
    //dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.style.cssText += ";cursor:move;";
    dragDom.style.cssText += ";top:0px;";

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })();

    dialogHeaderEl.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      const screenWidth = document.body.clientWidth; // body当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, "left");
      let styT = sty(dragDom, "top");

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes("%")) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, "") / 100);
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, "") / 100);
      } else {
        styL = +styL.replace(/\px/g, "");
        styT = +styT.replace(/\px/g, "");
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});

/**权限指令**/
Vue.directive("has", {
  inserted: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});

Vue.directive("input-limit", {
  bind(el, binding) {
    var wins_0 = /[^\d]/g; //整数判断
    var wins_1 = /[^\d^\.]/g; //小数判断
    var flag = true;
    var points = 0;
    var lengths = 0;
    var remainder = 0;
    var no_int = 0;
    const target =
      el instanceof HTMLInputElement ? el : el.querySelector("input");
    target.addEventListener("compositionstart", e => {
      flag = false;
    });
    target.addEventListener("compositionend", e => {
      flag = true;
    });
    target.addEventListener("input", e => {
      setTimeout(function() {
        if (flag) {
          if (binding.value == 0) {
            if (wins_0.test(e.target.value)) {
              e.target.value = e.target.value.replace(wins_0, "");
              e.target.dispatchEvent(new Event("input")); //手动更新v-model值
            }
          }
          if (binding.value == 1) {
            if (
              wins_0.test(e.target.value.toString().replace(/\d+\.(\d*)/, "$1"))
            ) {
              remainder = true;
            }
            if (e.target.value.split(".").length - 1 > 1) {
              points = true;
            }
            if (e.target.value.toString().split(".")[1] != undefined) {
              if (e.target.value.toString().split(".")[1].length > 1) {
                lengths = true;
              }
            }
            if (e.target.value.toString().indexOf(".") != -1) {
              no_int = false;
            } else {
              no_int = true;
            }
            if (wins_1.test(e.target.value) || lengths || points || remainder) {
              if (!no_int) {
                e.target.value = e.target.value
                  .replace(wins_1, "")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")
                  .substring(0, e.target.value.indexOf(".") + 2);
              } else {
                e.target.value = e.target.value.replace(wins_0, "");
              }
              e.target.dispatchEvent(new Event("input"));
            }
          }

          if (binding.value == 2) {
            if (
              wins_0.test(e.target.value.toString().replace(/\d+\.(\d*)/, "$1"))
            ) {
              remainder = true;
            }
            if (e.target.value.split(".").length - 1 > 1) {
              points = true;
            }
            if (e.target.value.toString().split(".")[1] != undefined) {
              if (e.target.value.toString().split(".")[1].length > 2) {
                lengths = true;
              }
            }
            if (e.target.value.toString().indexOf(".") != -1) {
              no_int = false;
            } else {
              no_int = true;
            }
            if (wins_1.test(e.target.value) || lengths || points || remainder) {
              if (!no_int) {
                e.target.value = e.target.value
                  .replace(wins_1, "")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")
                  .substring(0, e.target.value.indexOf(".") + 3);
              } else {
                e.target.value = e.target.value.replace(wins_0, "");
              }
              e.target.dispatchEvent(new Event("input"));
            }
          }
        }
      }, 0);
    });
  }
});

//权限检查方法
Vue.prototype.$_has = function(value) {
  let isExist = false;
  let buttonpermsStr = localStorage.getItem("perms");
  if (buttonpermsStr == undefined || buttonpermsStr == null) {
    return false;
  }
  let buttonperms = JSON.parse(buttonpermsStr);
  for (let i = 0; i < buttonperms.length; i++) {
    if (buttonperms[i].authority.indexOf(value) > -1) {
      isExist = true;
      break;
    }
  }
  return isExist;
};

Vue.prototype.isNormalUser = function() {
  let isNormalUser = false;
  let userinfoStr = localStorage.getItem("userinfo");
  let userinfo = JSON.parse(userinfoStr);
  return userinfo.isNormalUser;
};

//日期格式化过滤器
Vue.filter("format", function(val, arg) {
  if (!val) return;
  let pattern = "yyyy-MM-dd";
  if (arg) {
    pattern = arg;
  }
  // let dt = new Date(val)
  // return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' '
  return new Date(val).format(pattern);
});
//给日期对象加个format原型函数,用户处理日期格式化
//用法 var nowStr = new Date().format("yyyy-MM-dd HH:mm:ss");
Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "H+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds() //millisecond
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: {
    App
  }
});
