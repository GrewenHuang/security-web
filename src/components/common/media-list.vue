<template>
    <div class="file-content" :class="{f: horizontal}">
        <template v-for="(item, index) in list">
            <div class="video-view"
                :style="{'background-image': `url(${item.CoverUrl})`}"
                :key="index"
                @click="showMedia(item)"
                v-if="item.Ext == 'mp4'"
            ></div>
            <el-image
                :key="index"
                :preview-src-list="imageList"
                :src="item.Url"
                fit="fit"
                v-else
            ></el-image>
        </template>
        <previewMedia ref="previewMedia"/>
    </div>
</template>

<script>
import previewMedia from '@/components/common/previewMedia'
export default {
    components: {
        previewMedia
    },
    props: {
        horizontal: {
            type: Boolean,
            default: true
        },
        list: {
            type: Array,
            default() {
                return []
            }
        }
    },
    computed: {
        imageList() {
            return this.list.filter(item => item.Ext != 'mp4').map(item => item.Url);
        }
    },
    methods: {
        showMedia(item) {
            this.$refs.previewMedia.show(item.Url, 'mp4');
        }
    }
}
</script>

<style lang="scss" scoped>
.file-content{
    .el-image{
        border-radius: 8px;
        margin-right: 5px;
        width: 50px;
        height: 50px;
    }
    .video-view{
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 8px;
        margin-right: 5px;
        width: 50px;
        height: 50px;
        background: rgba(0, 0, 0, .5) no-repeat center center;
        background-size: cover;
        cursor: pointer;
        &::after{
            content: '';
            border-radius: 4px;
            border: 10px solid transparent;
            border-right: 0;
            border-left: 14px solid #fff;
            width: 0;
            height: 0;
        }
    }
}
</style>