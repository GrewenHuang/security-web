<template>
    <tabs-page-layout :tabs="tabs"></tabs-page-layout>
</template>
  <script>
export default {
    name: "MonthSafelyCheck",
    data() {
        return {
            tabs: [
                {
                    title: "每月检查记录",
                    url: () => import("@/pages/MonthSafelyCheck/month"),
                },
                {
                    title: "安全检查记录",
                    url: () => import("@/pages/MonthSafelyCheck/safeCheck"),
                },
            ],
        };
    },
};
</script>
  
  <style scoped>
</style>
  