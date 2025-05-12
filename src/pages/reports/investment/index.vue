<template>
    <tabs-page-layout :tabs="tabs" overflowInitial></tabs-page-layout>
</template>
<script>
export default {
    data() {
        return {
            tabs: [
                {
                    title: "安全投入统计",
                    url: () => import("./chart"),
                },
                {
                    title: "安全投入报表",
                    url: () => import("@/pages/safetyProductionCost/annualLedger")
                },
            ],
        };
    },
};
</script>
<style scoped>
</style>