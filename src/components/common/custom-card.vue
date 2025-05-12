<template>
    <div class="custom-card">
        <template v-if="$slots.title">
            <slot name="title" :title="title"></slot>
        </template>
        <div class="title" v-else>{{ title }}</div>
        <div class="custom-card-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'custom-card',
    props: {
        title: String,
    },
}
</script>

<style lang="scss" scoped>
.custom-card{
    border: 1px solid #E8E8E8;
    border-radius: 6px;
    .title{
        border-bottom: 1px solid #E8E8E8;
        padding: 12px 23px 11px;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #302E37;
    }
    .custom-card-content{
        padding: 10px 15px;
    }
}
</style>