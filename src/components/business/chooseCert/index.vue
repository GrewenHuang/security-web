<template>
    <el-dialog v-dialog-drag  
        :title="title"
        :visible.sync="dialogFlag"
        width="800px"
        top="8vh"
        class="choose-cert"
        @close="close"
    >
        <el-scrollbar class="scrollbar">
            <div class="cert-list">
                <div class="item"
                    v-for="(item, index) in list"
                    :key="index"
                    :class="{checked: choosed.some(cert => cert.CertificateId == item.CertificateId)}"
                    @click="checked(item)"
                >
                    <el-tooltip :content="item.CertificateName">
                        <div>{{ item.CertificateName }}</div>
                    </el-tooltip>
                </div>
            </div>
            <no-data top="80" v-if="!list.length"></no-data>
        </el-scrollbar>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-tooltip :disabled="!!choosed.length" placement="top" content="请选择证书">
                <el-button type="primary" @click="submit" :disabled="!choosed.length">
                    确认
                </el-button>
            </el-tooltip>
        </div>
    </el-dialog>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
export default {
    mixins: [request_mixin],
    data() {
        return {
            list: [],
            loading: false,
            title: "选择",
            dialogFlag: false,
            callback: null,
            choosed: [],
            type: 1,
            classification: 1,
        };
    },
    methods: {
        show(callback) {
            this.dialogFlag = true;
            this.callback = callback;
        },
        close() {
            this.dialogFlag = false;
            this.callback(false);
        },
        async getTemplateCert() {
            this.loading = true;
            let res = await this.Get(`/GetCertificateList?certificateType=${this.type}&certificateClassification=${this.classification}`);
            if (res.status == 2000) {
                this.list = res.data;
            }
            this.loading = false;
            return Promise.resolve();
        },
        checked(item) {
            let index = this.choosed.map(cert => cert.CertificateId).indexOf(item.CertificateId);
            if (index == -1) {
                this.choosed.push(item);
            } else {
                this.choosed.splice(index, 1);
            }
        },
        submit() {
            this.callback(true, this.choosed);
        }
    },
    mounted() {
        this.getTemplateCert();
    },
};
</script>
<style lang="scss" scoped>
.choose-cert{
    /deep/ .el-dialog{
        min-width: 800px;
        margin-bottom: 0;
    }
    .cert-list{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 31px 31px;
        .item{
            border-radius: 45px;
            border: 1px solid #D5D5D5;
            padding: 13px 27px;
            height: 45px;
            text-align: center;
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            &.checked{
                position: relative;
                background: $--color-primary;
                color: #fff;
                &::after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 14px;
                    transform: translateY(-50%);
                    width: 13px;
                    height: 12px;
                    background: url(../../../assets/images/login/drag-success.png) no-repeat center center;
                    background-size: 100%;
                }
            }
        }
    }
}
</style>
  