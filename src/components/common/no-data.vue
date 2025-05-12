<template>
    <div class="no-data" :style="{marginTop: top + 'px', marginBottom: bottom + 'px'}">
        <img src="@/assets/images/no-data/empty.png" :alt="text">
        <div v-if="!$slots.default">{{ text }}</div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        top: [String, Number],
        bottom: [String, Number],
        text: {
            type: String,
            default: '空空如也~'
        }
    }
}
</script>

<style lang="scss" scoped>
.no-data{
    text-align: center;
    img{
        display: block;
        margin: 0 auto 26px;
        width: 209px;
        height: 140px;
        pointer-events: none;
        user-select: none;
    }
}
</style>