<template>
    <div style="height: 100%;">
        <img :src="imgUrl" alt="" style="width: auto;height: 100%;vertical-align: bottom;">
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
export default {
    name: 'task-distribution',
    components: {
    },
    mixins: [request_mixins],
    data() {
        return {
        }
    },
    created() {
        // https://file.hnztjia.com/20230331/91865a5b455e40dfa46cb6c3ce079698.png
        this.imgUrl = this.$route.query.img
    },
    methods: {
    }
}
</script>

<style>

</style>