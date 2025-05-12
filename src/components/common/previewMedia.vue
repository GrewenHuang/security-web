<template>
    <el-dialog v-dialog-drag  :title="title"
        :visible.sync="visible"
        width="30%"
        :before-close="VideoClose"
        append-to-body
    >
        <div :class="{mp3: mediaType === 'mp3'}">
            <video v-bind:src="src"
                class="video_avatar"
                controls="controls"
                controlslist="nodownload"
                @contextmenu.stop.prevent="function() {return false}"
                ref="playVideo"
            >
                您的浏览器不支持视频播放
            </video>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            mediaType: 'mp4',
            src: '',
            visible: false,
        }
    },
    computed: {
        title() {
            return this.mediaType === 'mp4' ? '视频预览' : '音频预览'
        }
    },
    watch: {
        visible(val) {
            if (!val) {
                this.src = '';
            }
        }
    },
    methods: {
        show(src, type) {
            this.visible = true;
            this.src = src;
            this.mediaType = type ;
            if (!/mp4|mp3/.test(type)) {
                this.mediaType = 'mp4';
            }
            this.$nextTick(() => {
                this.$refs.playVideo.play();
            })
        },
        VideoClose() {
            this.visible = false;
        }
    }
}
</script>

<style scoped>

.video_avatar {
  width: 100%;
  height: 400px;
}
.mp3{
    display: flex;
    align-items: center;
    height: 300px;
}
.mp3 .video_avatar{
    height: 56px;
}
</style>
