<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="dialog-content" v-if="info">
                <div class="title">目标内容</div>
                <div class="content">
                    <div class="item f-s">
                        <div class="f1 f-s">
                            <div class="label">目标名称：</div>
                            <div>{{ info.SafetyGoalName }}</div>
                        </div>
                        <div class="f1 f--c">
                            <div class="label">目标年份：</div>
                            <div>{{ info.SafetyGoalYear }}</div>
                        </div>
                    </div>
                    <div class="item f-s">
                        <div class="f1 f-s">
                            <div class="label">目标说明：</div>
                            <div>{{ info.SafetyGoalRemark }}</div>
                        </div>
                    </div>
                    <div class="item f-s">
                        <div class="f1 f-s">
                            <div class="label">目标内容：</div>
                            <div>{{ info.ItemContent }}</div>
                        </div>
                    </div>
                    <div class="item f-s">
                        <div class="f1 f-s">
                            <div class="label">责任部门：</div>
                            <div>{{ info.DepartmentName }}</div>
                        </div>
                        <div class="f1 f-s">
                            <div class="label">责任人：</div>
                            <div>{{ info.UserName }}</div>
                        </div>
                    </div>
                    <div class="item f-s">
                        <div class="f1 f-s">
                            <div class="label">开始日期：</div>
                            <div>{{ info.StartDateDesc }}</div>
                        </div>
                        <div class="f1 f-s">
                            <div class="label">结束日期：</div>
                            <div>{{ info.EndDateDesc }}</div>
                        </div>
                    </div>
                </div>
                <template v-if="info.Status == 1">
                    <div class="title">完成情况</div>
                    <div class="content">
                        <div class="item f-s">
                            <div class="f1 f-s">
                                <div class="label">完成时间：</div>
                                <div>{{ info.CreateTimeDesc }}</div>
                            </div>
                        </div>
                        <div class="item f-s">
                            <div class="f1 f-s">
                                <div class="label">完成备注：</div>
                                <div>
                                    {{ info.CompletionRemark }}
                                    <div v-for="(item, index) in info.CompletionPhotos" :key="index" style="margin-top: 15px;">
                                        <el-image
                                            :src="item.url"
                                            :preview-src-list="info.CompletionPhotos.map(item=>item.url)"
                                            style="border-radius: 4px;width: 90px;height:90px;"
                                        ></el-image>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item f-s">
                            <div class="f1 f--c">
                                <div class="label">签名：</div>
                                <div style="margin-left: 26px;">
                                    <el-image
                                        :src="info.SignInUrl"
                                        :preview-src-list="[info.SignInUrl]"
                                        style="border:1px solid #ddd;border-radius:4px;width: auto;height:45px;"
                                    ></el-image>    
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
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
    name: 'page-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: null
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
                this.id = item.SafetyGoalItemId;
                try {
                   let res = await this.Get(`/GetSafetyGoalItem?safetyGoalItemId=${item.SafetyGoalItemId}`)
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
            this.submitLoading = false;
            this.id = '';
            Object.assign(this.info, _extends(defaultInfo))
        },
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        .f-s{
            display: flex;
            align-items: flex-start;
        }
        .dialog-content{
            padding: 21px 25px;
            .title{
                display: flex;
                align-items: center;
                border-radius: 4px;
                padding: 14px 16px 13px;
                background: #F5F6FA;
                font-size: 16px;
                font-weight: 600;
                &::before{
                    content: '';
                    margin-right: 8px;
                    width: 5px;
                    height: 16px;
                    background: $--color-primary;
                }
                &:not(:first-child){
                    margin-top: 25px;
                }
            }
            .item{
                border-bottom: 1px solid #EFEFEF;
                padding: 20px 15px;
                line-height: 1.23666;
                .label{
                    font-weight: 600;
                    white-space: nowrap;
                }
            }
        }

    }
</style>