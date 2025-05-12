<!-- 职业病危害 -->
<template>
    <tabs-page-layout :tabs="tabs"></tabs-page-layout>
</template>

<script>
export default {
    data() {
        return {
            currentTab: '职业病危害申报记录',
            tabs: [
                {
                    title: '职业病危害申报记录',
                    url: () => import("@/pages/occupationalDiseaseHazards/occupationalHazardsDesclaration")
                },
                {
                    title: '职业危害备案记录',
                    url: () => import("@/pages/occupationalDiseaseHazards/occupationalCriticalIllnessFiling")
                },
                // {
                //     title: '职业危害整改台账',
                //     url: () => import("@/pages/occupationalDiseaseHazards/occupationalHazardRectificationAccount")
                // },
            ]
        }
    },
}
</script>

<style lang="scss" scoped>
</style>