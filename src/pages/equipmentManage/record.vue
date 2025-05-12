<template>
    <tabs-page-layout :tabs="tabs"></tabs-page-layout>
</template>
<script>
export default {
    data() {
        return {
            tabs: [
                {
                    title: "保养记录",
                    url: () => import("@/pages/equipmentManage/maintenance-record"),
                },
                {
                    title: "点检记录",
                    url: () => import("@/pages/equipmentManage/spot-check-record"),
                },
                {
                    title: "检验记录",
                    url: () => import("@/pages/equipmentManage/inspection-record"),
                },
                {
                    title: "维修记录",
                    url: () => import("@/pages/equipmentManage/repair-record"),
                },
                {
                    title: "异常处理",
                    url: () => import("@/pages/equipmentManage/exception-handling"),
                },
            ],
        };
    },
};
</script>
<style scoped>
</style>