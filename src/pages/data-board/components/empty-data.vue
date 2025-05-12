<template>
    <div class="empty-data">{{ text }}</div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: '暂无数据'
        }
    }
}
</script>

<style lang="scss" scoped>
    .empty-data{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: #6292C8;
    }
</style>