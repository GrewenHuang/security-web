<template>
    <tabs-page-layout :tabs="tabs" overflowInitial></tabs-page-layout>
</template>
<script>
export default {
    data() {
        return {
            tabs: [
                {
                    title: "车辆统计",
                    url: () => import("./chart"),
                },
                {
                    title: "车辆报表",
                    url: () => import("./list"),
                },
            ],
        };
    },
};
</script>
<style scoped>
</style>