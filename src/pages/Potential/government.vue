<template>
    <tabs-page-layout :tabs="tabs" :active="active"></tabs-page-layout>
</template>

<script>
export default {
    name: 'pitfall-government',
    data() {
        const tabs = [
            {
                title: '隐患审核',
                url: () => import("@/pages/Potential/potential-exam/list")
            },
            {
                title: '隐患整改',
                url: () => import("@/pages/Potential/potential-reform/list")
            },
            {
                title: '隐患复查',
                url: () => import("@/pages/potential/potential-review/list")
            },
            // {
            //     title: '隐患归档',
            //     url: () => import("@/pages/Potential/potential-file/list")
            // },
            // {
            //     title: '申请销号',
            //     url: () => import("@/pages/Potential/potential-cancel/list")
            // },
            {
                title: '隐患记录',
                url: () => import("@/pages/Potential/potential-record/list")
            },
        ]
        return {
            tabs: tabs,
            active: tabs[0].title
        }
    },
    created() {
        this.active = this.tabs[this.$route.query.active || 0].title;
    }
}
</script>

<style>

</style>