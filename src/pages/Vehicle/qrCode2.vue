<template>
 <div>
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
        
        <div id="printView" >
           <div v-for="item in info" :key="item" class="pageBlack" >
             <div class="title">华恒车辆标识牌</div>
            <div
                class="table-content"
            >
                <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                >
                    <colgroup>
                        <col width="50px" align="center"/>
                        <col width="120px" />
                        <col width="180px" />
                    </colgroup>
                    <tr>
                        <td>车牌</td>
                        <td >{{ item.LicensePlateNumber}}</td>
                         <td rowspan="4">
                            <img :src="item.QRCodes" style="width: 100%; height: 100%;">
                        </td>
                    </tr>
                   
                    <tr>
                        <td>车队</td>
                        <td>{{ item.VehicleGroupSetName }}</td>
                    </tr>
                </table>
            </div>
           </div>
        </div>
    </div>

        <div slot="footer" class="dialog-footer">
            <div class="f-b-c">
                <el-button type="text" v-print="printViewInfo">下载标识牌</el-button>
                <!-- <el-button type="text" @click="dialogVisible = true">打印设置</el-button> -->
                <el-button @click.native="close()">关闭</el-button>
            </div>
        </div>
    
    </el-dialog>
        <!-- 打印设置 -->
        <!-- <el-dialog
                title="打印设置"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
              <div>
                    <div>打印纸宽度<el-input v-model="printWidth" placeholder="请输入内容"></el-input></div>
                    <div>打印纸高度<el-input v-model="printHeight" placeholder="请输入内容"></el-input></div>
              </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="isPrintWH">确 定</el-button>
                </span>
                </el-dialog> -->
 </div>
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
            printWidth:"",
            printHeight:"",
            id: '',
            loading: false,
            dialogVisible:false,
            dislogShow2: false,
            info: _extends(defaultInfo),
                  printViewInfo: {
                    id: "printView", //打印区域的唯一的id属性
                    popTitle: "配置页眉标题", // 页眉文字 （不设置时显示undifined）（页眉页脚可以在打印页面的更多设置的选项中取消勾选）
                    extraHead: "维修保养清单",
                    preview: false, // 是否启动预览模式，默认是false （开启预览模式ture会占满整个屏幕，不建议开启，除非业务需要）

                    previewTitle: "预览的标题", // 打印预览的标题(预览模式preview为true时才显示)
                    extraCss:
                    "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
                    extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',

                    previewPrintBtnLabel: "预览结束，开始打印",
                    style: `@page {
                        size: auto;
                       
                    }
                    @media print {
                        body > * {
                        page-break-after: always;
                        }

                    }`,
      },
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '二维码'
        },
        styleWidthH(){
            let styleCss = localStorage.getItem('printm');
            if(styleCss){
                
            }
        }
    },
    methods: {
        // isPrintWH(){
        //     let width = this.printWidth;
        //     let height = this.printHeight;
        //     let printm={
        //         width,
        //         height
        //     }
            
        //     localStorage.setItem('printm',JSON.stringify(printm))
        //     this.dialogVisible = false
        // },
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
    #printView{
        //    padding: 3px !important;
            width: 60mm;
      //      height: 40mm;
            overflow: hidden;
            box-sizing: border-box;
             
          
        
            // border: 1px solid red;
   
        .title{
            border: 1px solid #000;
            border-bottom: 0;
            font-size: 18px;
            text-align: center;
            font-weight: 500;
        }
        .table-content{
            border: 1px solid #000;
   
            table{
                border-spacing: 0;
                border-collapse: collapse;
                width: 100%;
                tr{
                    td:first-child{
                        text-align: left;
                    }
                }
                td{
                    border: 0.5px solid #000;
                    font-size: 10px;
        
                    image{
                        // max-width: 100%;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }

 @media print {
            /* 设置 body 为 flex 布局 */
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
            }
              #printView {
                text-align: center;
            }
 }

</style>
