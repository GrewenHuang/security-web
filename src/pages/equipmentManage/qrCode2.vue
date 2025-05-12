<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow2"
        @close="close()"
        class="info"
       
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <div class="box">
        <div id="equipment-card">
            <div v-for="item in info" :key="item" class="pageBlack" >
                  <div class="title">广州华恒设备标识牌</div>
            <div
                class="table-content"
            >
                <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                >
                    <colgroup>
                        <col width="110px" align="center"/>
                        <col width="140px" />
                        <col width="240px" />
                    </colgroup>
                     <tr>
                        <td>自编号</td>
                        <td>{{ info.OwnCode }}</td>
                         <td rowspan="4">
                            <img :src="item.QRCodes" style="width: 100%; height: 100%;">
                        </td>
                    </tr>
                    <tr>
                        <td>设备名称</td>
                        <td colspan="2">{{ item.EquipmentName}}</td>
                           
                    </tr>
                 
                    <tr>
                        <td>安装地点</td>
                        <td>{{ item.UseLocation }}</td>
                    </tr>
           
                 
                </table>
            </div>
          </div>
        </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <div class="f-b-c">
                <el-button type="text" v-print="'#equipment-card'">下载标识牌</el-button>
                <el-button @click.native="close()">关闭</el-button>
            </div>
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
            dislogShow2: false,
            info: _extends(defaultInfo),
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '二维码'
        }
    },
    mounted(){
        console.log(this.info,'thisinfo')
    },
    methods: {
        async show(item) {
          this.dislogShow2 = true;
            this.loading = true;
            if (item) {
                this.info = item;
            } else {
                this.$message.error('未获取到设备信息');
                this.dislogShow2 = false;
            }
            this.loading = false;
        },
        close() {
            this.dislogShow2 = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        // /deep/ .el-dialog__body{
        //     padding: 37px 35px !important;
        //    .el-scrollbar__wrap{
        //        margin-bottom: 0 !important;
        //    }
        // }
        // /deep/ .el-dialog{
        //     min-width: 640px;
        // }

    }
    *{
    margin: 0;
    padding: 0;
}
    .box{
    width: 60mm;
    height: 500px;
    overflow-y: scroll;

    
}

    .pageBlack{
   width: 60mm;
   height: 38mm;
   break-after: page;

}
    #equipment-card{
        // margin-top: 1px;
        width: 60mm !important;
        // height: 38mm !important;
        // border: 1px solid red;
      
        overflow: hidden;
        .title{
          border: 1px solid #000;
            border-bottom: 0;
            // padding-top: 5px;
            font-size: 18px;
            text-align: center;
            font-weight: 600;
        }
        .table-content{
                font-size: 10px;
                border: 1px solid #000;
                // padding-left: 5px;  
            table{
                border-spacing: 0;
                border-collapse: collapse;
                width: 100%;
              
                tr{
                    td:first-child{
                        text-align: center;
                    }
                }
                td{
                    border: 1px solid #000;
                    text-align: left;
                    font-size: 10px;
                    image{
                        width: 100%;
                        height: 100%;
                        max-width: 100%;
                    }
                }
            }
        }
    }
</style>
