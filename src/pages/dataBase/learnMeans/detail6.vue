<!-- 安全生产法律法规 -->
<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1100px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar" v-if="info">
            <div class="card f-b-c">
                <div class="f--c">
                    <div class="label">名称：</div>
                    <div>{{ info.Name }}</div>
                </div>
                <div style="font-weight: 600;">浏览：{{ info.BrowseCount }}</div>
            </div>
            <div>
                <video :src="videoUrl" style="width: 100%;height: 460px" controls></video>
            </div>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: _extends(defaultInfo),
            videoUrl: '',
            rules: {},
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '查看'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.LearningId;
                try {
                   let res = await this.Get(`/GetLearning?learningId=${item.LearningId}`)
                   if (res.status == 2000) {
                       this.info = Object.assign(_extends(defaultInfo), res.data);
                       this.videoUrl = await this.getFileUrl(this.info.LearningFiles[0].url);
                   } else {
                       this.$message.error('获取数据失败');
                       this.close();
                   }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.id = '';
            Object.assign(this.info, _extends(defaultInfo))
        },
        getFileUrl(url) {
            return new Promise((resolve, reject) => {
                if(url.indexOf('http')==-1){
                    this.Get("/GetOssUrl", {key:url}).then((result) => {
                        resolve(result.data.url);
                    });
                }else{
                    resolve(url);
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .info{
        color: #181B3B;
        /deep/ .el-dialog__body{
            padding: 10px 25px !important;
        }
        /deep/ .el-dialog{
            min-width: 1100px;
        }
        .card{
            padding: 20px 0;
            &:not(:last-child){
                border-bottom: 1px solid #EFEFEF;
            }
            .label{
                font-weight: 600;
            }
        }
        audio{
            margin: 20px 0;
        }
    }
</style>
