<template>
    <el-dialog v-dialog-drag  
        :title="title"
        :visible.sync="dialogFlag"
        width="1100px"
        top="8vh"
        class="sign"
        @close="close"
    >
        <div class="content">
            <vue-esign
                ref="sign"
                :width="1050"
                :height="500"
            ></vue-esign>
        </div>
        <div slot="footer">
            <el-button @click="reset">重写</el-button>
            <el-tooltip placement="top" content="请签名">
                <el-button type="primary" :loading="loading" @click="handleGenerate">
                    确认
                </el-button>
            </el-tooltip>
        </div>
    </el-dialog>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import vueEsign from 'vue-esign';
import axios from "axios";
function  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), 
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
export default {
    components: {
        vueEsign
    },
    mixins: [request_mixin],
    data() {
        return {
            dialogFlag: false,
            title: '签名',
            loading: false,
        };
    },
    watch: {
        
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
        url: function () {
            var API_UPLOAD_URL = process.env.API_UPLOAD_URL;
            return API_UPLOAD_URL;
        },
        reset() {
            this.$refs.sign.reset();
        },
        handleGenerate () {
            this.loading = true;
            this.$refs.sign.generate().then(async res => {
                this.resultImg = res
                let blob = dataURLtoBlob(res);
                let formData = new FormData();
                formData.append('file', blob, 'sign.png');
                let config = {
                    headers: {
                        "Content-type": "multipart/form-data",
                    },
                };
                try {
                    const result = await axios.post(this.url(), formData, config).then(r => r.data);
                    if (result.status == 2000) {
                        typeof this.callback === 'function' && this.callback(true, result.files[0])
                    }
                } catch (error) {
                    console.error(error)
                    this.$message.error('签名保存失败，请稍后重试');
                }
                this.loading = false;
            }).catch(err => {
                console.log(err) // 画布没有签字时会执行这里 'Not Signned'
                this.loading = false;
            })
        }
    },
    mounted() {
        
    },
};
</script>
<style lang="scss" scoped>

.sign{
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
    .content{
        position: relative;
        border-radius: 8px;;
        border: 1px solid #ddd;
        background: #f8f8f8;
        >*{
            position: relative;
            z-index: 10;
        }
        &::before{
            content: '请签名';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1;
            letter-spacing: 50px;
            font-size: 78px;
            color: #E1E1E1;
            pointer-events: none;
        }
    }
}
</style>
  