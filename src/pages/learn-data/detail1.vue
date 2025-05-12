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
            <div class="card f--c">
                <div class="label">发文机关：</div>
                <div>{{ info.ReleaseAuthority }}</div>
            </div>
            <div class="card f--c">
                <div class="label">分类：</div>
                <div>{{ info.CategoryName }}</div>
            </div>
            <div class="card f--c">
                <div class="label">实施日期：</div>
                <div>{{ info.ImplementTimeDesc }}</div>
            </div>
            <div class="card">
                <div class="label">内容：</div>
                <div>
                    <audio :src="info.ContentWavUrl" controls style="width: 343px;height: 65px;"></audio>
                    <div>{{ info.Content }}</div>
                </div>
            </div>
            <div class="card">
                <div class="label">附件</div>
                <div class="file-list"
                    v-for="(item, index) in info.LearningFiles"
                    :key="index"
                >
                    <div class="file-item" @click="$openFile(item.url)">
                        <div class="file f-b-c">
                            <div class="f">
                                <img style="width:30px;height:30px;margin-right: 13px;"
                                    :src="$fileIcons[item.name.substring(item.name.lastIndexOf('.') + 1)]" />
                                <div class="text">
                                    <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.name}}</div>
                                    <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.size | formatSize}}</div>
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
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
        .file-list{
            margin-top: 20px;
            .file-item{
                display: flex;
                &:not(:first-child){
                    margin-bottom: 15px;
                }
                >div{
                    width: 50%;
                }
                .file{
                    border-radius: 4px;
                    margin-right: 15px;
                    padding: 11px 15px 11px 10px;
                    background: #F8FAFB;
                }
                cursor: pointer;
            }
        }
    }
</style>
