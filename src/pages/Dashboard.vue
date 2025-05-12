<template>
    <div>
        <road v-if="isRoad"/>
        <bus v-else/>
    </div>
</template>

<script>
import bus from '@/pages/dashboard/index';
import road from '@/pages/dashboard/index1';
import utils from '@/common/util';
export default {
    components: {
        bus,
        road
    },
    data() {
        return {
            isRoad: utils.getLoginUrl() == '/rb-login'
        }
    },
    mounted() {
        
    }
}
</script>

<style>

</style>
