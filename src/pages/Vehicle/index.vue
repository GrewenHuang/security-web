<template>
    <tabs-page-layout :tabs="tabs"></tabs-page-layout>
  </template>
  <script>
  export default {
    name: "vehicle-info",
    data () {
      return {
        tabs: [
          {
              title: '车辆档案',
              url: () => import("@/pages/Vehicle/Vehicle")
          },
          {
              title: '路线管理',
              url: () => import("@/pages/Vehicle/vehicleRouteManage")
          }
        ]
      };
    },
  }
  </script>
  
  <style scoped>
  </style>
  