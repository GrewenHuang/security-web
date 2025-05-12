<template>
  <tabs-page-layout :tabs="tabs"></tabs-page-layout>
</template>
<script>
export default {
  name: "logbook-info",
  data () {
    return {
      tabs: [
        {
            title: '每日行车日志',
            url: () => import("@/pages/Logbook/logbook")
        },
        {
            title: '行车日志记录',
            url: () => import("@/pages/Logbook/record")
        }
      ]
    };
  },
}
</script>

<style scoped>
</style>
