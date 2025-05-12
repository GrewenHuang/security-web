<template>
    <el-dialog v-dialog-drag  
        :title="modelTitle"
        :visible.sync="dialogFlag"
        width="800px"
        top="8vh"
        class="qrcode"
        @close="close"
    >
        <div class="content">
            <!-- <div class="f" style="margin-bottom: 20px;">
                <select-department placeholder="选择部门" clearable style="margin-right: 20px;"></select-department>
                <select-position placeholder="选择岗位" clearable></select-position>
            </div> -->
            <div id="qrcode-print">
                <div class="qrcode-content">
                    <div class="header">
                        <div class="title">{{ title ? title : desc}}</div>
                        <div class="desc" v-if="title">{{ desc }}</div>
                    </div>
                    <img class="image" :src="url">
                    <div class="tips">{{ tips }}</div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <el-button v-print="'#qrcode-print'" type="primary" style="display: block;margin: 0 auto;">打印二维码</el-button>
        </div>
    </el-dialog>
</template>
<script>
import Qs from "qs";
export default {
    data() {
        let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
        return {
            dialogFlag: false,
            loading: false,
            title: '',
            desc: userInfo.Enterprise.EnterpriseName,
            tips: '',
            url: '',
        };
    },
    watch: {
        
    },
    computed: {
        modelTitle() {
            return this.title || '二维码';
        }
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
    },
    mounted() {
        
    },
};
</script>
<style lang="scss" scoped>

.qrcode{
    /deep/ .el-dialog{
        margin-bottom: 0;
    }
    /deep/ .el-table__body {
        padding: 30px 25px;
        tr.current-row > td.el-table__cell{
            background: $primary-color;
            color: #fff;
        }
    }
    .qrcode-content{
        border: 3px solid $--color-primary;
        margin: 0 auto;
        padding-bottom: 30px;
        width: 320px;
        text-align: center;
        border-radius: 8px;
        .header{
            padding: 15px;
            color: #fff;
            box-shadow: 0 0 100px 70px inset $--color-primary;
            .title{
                font-size: 34px;
                font-weight: 600;
            }
            .desc{
                margin-top: 5px;
            }
        }
        .image{
            margin-top: 15px;
            width: 260px;
            height: 260px;
        }
    }
}
</style>
<style lang="scss" media="print">
body {
    -webkit-print-color-adjust: exact;/**不加这个，无法显示白色字体*/
}
.qrcode-content{
    border: 3px solid $--color-primary;
    margin: 0 auto;
    padding-bottom: 30px;
    width: 320px;
    text-align: center;
    border-radius: 8px;
    .header{
        padding: 15px;
        color: #fff;
        box-shadow: 0 0 100px 70px inset $--color-primary;
        .title{
            font-size: 34px;
            font-weight: 600;
        }
        .desc{
            margin-top: 5px;
        }
    }
    .image{
        margin-top: 15px;
        width: 260px;
        height: 260px;
    }
}
</style>
  
