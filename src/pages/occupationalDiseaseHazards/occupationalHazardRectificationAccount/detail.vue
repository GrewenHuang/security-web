<template>
    <el-dialog v-dialog-drag 
        class="occupational-hazard-rectification-account-add"
        title="查看"
        :visible.sync="isShow"
        @close="close"
        width="210mm"
        top="50px"
        :append-to-body="true"
    >
        <div>
            <div class="f fb">
                <div class="f">
                    <div class="label">职业病危害因素名称</div>
                    <div>{{info.OccupationalHazardName}}</div>
                </div>
                <div class="f" style="margin-right: 66px;">
                    <div class="label">危害程度</div>
                    <div>{{info.HazardLevelDesc}}</div>
                </div>
            </div>
            <el-divider></el-divider>
            <div class="f vfs">
                <div class="label">整改时间</div>
                <div>{{info.RectifyDateDesc}}</div>
            </div>
            <el-divider></el-divider>
            <div class="f vfs">
                <div class="label">整改措施</div>
                <div>{{info.RectifyMeasure}}</div>
            </div>
            <el-divider></el-divider>
            <div class="f vfs">
                <div class="label">整改效果</div>
                <div>{{info.RectifyResult}}</div>
            </div>
            <el-divider></el-divider>
            <div class="f vfs">
                <div class="label">备注</div>
                <div>{{info.Remark}}</div>
            </div>
            <el-divider></el-divider>
            <div class="f">
                <div class="label">整改责任人确认签字</div>
                <div>
                    <img :src="info.SignInUrl" alt="签名" style="width: auto;height: 45;">
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";

export default {
    mixins: [request_mixin],
    data() {
        return {
            isShow: false,
            info: {},
            id: '',
        };
    },
    methods: {
        async show(item) {
            const loading = this.$loading({
                lock: true,
                text: '数据加载中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'transparent'
            });
            if (item) {
                this.id = item.OccupationalHazardAccountId;
                let res = await this.Get("/GetOccupationalHazardAccount", { occupationalHazardAccountId: item.OccupationalHazardAccountId });
                this.info = res.data;
            }
            this.isShow = true;
            loading.close();
        },
        close() {
            this.isShow = false;
            this.$nextTick(() => {
                this.reset();
            })
        },
        reset() {
            this.id = '';
            this.info = {};
        },
    },
};
</script>

<style lang="scss" scoped>
.occupational-hazard-rectification-account-add {
    
    /deep/ .el-dialog__body{
        color: #302E37;
        padding: 39px 23px 33px !important;
    }
    .label{
        margin-right: 20px;
        width: 133px;
        text-align: right;
        font-weight: 600;
    }
    /deep/ .el-divider--horizontal{
        margin: 15px 0 14px;
    }
}
</style>
