<template>
  <div style="height: 100%" @click="setScreen">
    <link
      rel="stylesheet"
      href="//at.alicdn.com/t/c/font_4237281_a6d2vhk9t8.css"
    />
    <router-view></router-view>
  </div>
</template>

<script>
import { bus } from "@/bus.js";
import util from "@/common/util.js";
let loginUrl = util.getLoginUrl();
function isFullscreen() {
  return !!(
    document.fullScreenElement ||
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}
export default {
  data() {
    return {
      flag1: false
    };
  },
  mounted() {
    bus.$on("goto", url => {
      if (url === loginUrl) {
        localStorage.removeItem("userinfo");
        localStorage.removeItem("ttoken");
        localStorage.removeItem("enterpriseId");
        localStorage.removeItem("menus");
      }
      this.$router.push(url);
    });
    // this.$nextTick(() => {
    //   let flag = isFullscreen();
    //   if (!flag) {
    //     this.$confirm(
    //       `全屏展示效果更佳，手动开启全屏请按『F11』`,
    //       "提示",
    //       {}
    //     ).then(
    //       () => {
    //         // 获取要全屏显示的元素
    //         var el = document.documentElement;
    //         // 进入全屏模式
    //         if (el.requestFullscreen) {
    //           el.requestFullscreen();
    //         } else if (el.mozRequestFullScreen) {
    //           el.mozRequestFullScreen();
    //         } else if (el.webkitRequestFullscreen) {
    //           el.webkitRequestFullscreen();
    //         } else if (el.msRequestFullscreen) {
    //           el.msRequestFullscreen();
    //         }
    //       },
    //       () => {
    //         reject(false);
    //       }
    //     );
    //   }
    // });
  },
  methods: {
    setScreen() {
      this.flag1 = true;
      let flag = isFullscreen();
      if (this.flag1) {
        var el = document.documentElement;
        // 进入全屏模式
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
      }
    }
  }
};
</script>

<style></style>
