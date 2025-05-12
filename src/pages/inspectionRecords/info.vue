<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
        append-to-body
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="pdf" ref="pdf">
                <div class="h2">{{ info.InspectionName }}</div>
                <div class="f-b-c">
                    <div>企业：{{ info.InspectionEnterpriseName + '/' + info.DepartmentName }}</div>
                    <div>编号：<span style="color: #FE3F51;">{{ info.Number }}</span></div>
                </div>
                <table class="table-content">
                    <colgroup>
                        <col width="230px"/>
                        <col width="74px"/>
                        <col width="305px"/>
                        <col width="119px"/>
                        <col width="305px"/>
                        <col width="220px"/>
                    </colgroup>
                   <!-- <tr>
                        <td>检查表类型</td>
                        <td colspan="5">{{ info.GroupPath }}</td>
                    </tr> -->
                    <template v-for="(item, index) in info.InspectionFields">
                        <tr :key="index">
                            <td>{{ item.FieldName }}</td>
                            <td colspan="5">{{ item.FieldValue | formatFieldValue(item.FieldType) }}</td>
                        </tr>
                    </template>
                    <tr>
                        <td>检查地址</td>
                        <td colspan="5">{{ info.Place }}</td>
                    </tr>
                    <tr>
                        <td>检查时间</td>
                        <td colspan="5">{{ info.PlanInspectionDateDesc }}</td>
                    </tr>
                    <tr>
                        <td>检查人</td>
                        <td colspan="5">{{ info.InspectionRecordUsers.map(item => item.UserName).join('、') }}</td>
                    </tr>
					<tr>
					    <td>安全等级</td>
					    <td colspan="5">{{ info.SecurityLevelDesc }}</td>
					</tr>
                    <template v-for="(item, index) in info.InspectionRecordItems">
                        <tr>
                            <td class="bg" colspan="6">{{ item.ItemName }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="header">检查内容</td>
                            <td class="header">检查依据</td>
                            <td class="header">检查结果</td>
                            <td class="header">合格/不合格说明</td>
                            <td class="header">检查附件</td>
                        </tr>
                        <template v-for="(o, i) in item.ItemContentList">
                            <tr :key="'' + index + i">
                                <td colspan="2" v-html="o.Describe" style="text-align: left;"></td>
                                <td>{{ o.Basis }}</td>
                                <td>{{ o.IsPass == 1 ? '合格' : o.IsPass == 0 ? '不合格' : '' }}</td>
                                <td>{{ o.Remark }}</td>
                                <td>
                                    <div class="file-content" v-for="(file, index) in o.InspectionRecordItemContentPhotos" :key="index">
                                        <div class="video-view"
                                            :style="{'background-image': `url(${file.CoverUrl})`}"
                                            @click="showMedia(file)"
                                            v-if="file.Ext == 'mp4'"
                                        ></div>
                                        <el-image
                                            :src="file.Url"
                                            :preview-src-list="o.InspectionRecordItemContentPhotos.filter(img=>img.Ext!='mp4').map(img=>img.Url)"
                                            v-else
                                        ></el-image>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                    <tr>
                        <td>总评</td>
                        <td colspan="5" style="height: 100px;text-align: left;">{{ info.Comment }}</td>
                    </tr>
                </table>
                <div class="f-b-c" style="margin-top: 8px;">
                    <div>
                        检查人签字：
                        <template v-for="(item, index) in info.InspectionRecordUsers">
                            <img :src="item.SignInUrl" :key="index" style="vertical-align: middle;width: 90px;height: 45px;" v-if="!!item.SignInUrl">
                        </template>
                    </div>
                    <div>
                        被检查人签字：
                        <img :src="info.SignInUrl" style="vertical-align: middle;width: 90px;height: 45px;" v-if="!!info.SignInUrl">
                        <span style="display:inline-block;width: 100px;" v-else></span>
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <previewMedia ref="previewMedia"/>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
            <el-button
                type="primary"
                @click="exportPDF()"
                slot="reference"
                >导出PDF</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import { Pdf } from '@/plugins/htmlToPdf';
import previewMedia from '@/components/common/previewMedia'
const defaultInfo = {
    InspectionName: '', // 检查表名称
    InspectionRecordItems: [], // 检查项目集合
    InspectionFields: [], // 检查自定义字段
    InspectionRecordUsers: [], // 检查人员
    /**
     * FieldName (string, optional): 字段名称 ,
     * FieldType (integer, optional): 字段类型 1人员 2车辆 3设备 4文本 5日期
     */
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    components: {
        previewMedia
    },
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: _extends(defaultInfo),
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
    filters: {
        formatFieldValue(val, type) {
            if (type != 4) {
                return val && typeof val == 'object' ? val.ItemName : val;
            }
            return val;
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.InspectionRecordId;
                try {
                    let res = await this.Get(`/GetInspectionRecord?inspectionRecordId=${this.id}`)
                    if (res.status == 2000) {
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                        this.info.InspectionFields.forEach(item => {
                            item.FieldValue = JSON.parse(item.FieldValue);
                        })
						
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
            this.info = _extends(defaultInfo);
        },
        exportPDF () {
            const loading = this.$loading({
                lock: true,
                text: '正在导出中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, .3)'
            });
            this.$nextTick(() => {
                Pdf.downPdf(this.$refs.pdf, this.info.InspectionName).then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        showMedia(item) {
            this.$refs.previewMedia.show(item.Url, 'mp4');
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
        }
        .el-date-editor,
        .el-select{
            width: 100%;
        }
        .form-2-col{
            display: flex;
            >div{
                width: 50%;
                &:first-child{
                    margin-right: 40px;
                }
            }
        }
        .split-line{
            &::before{
                content: '';
                display: block;
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        .table-content {
            border-top: 1px solid #000;
            border-left: 1px solid #000;
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            td {
                border-right: 1px solid #000;
                border-bottom: 1px solid #000;
                padding: 5px;
                height: 35px;
                background: #fff;
            }
            .bg{
                background: #EEEEEE;
                box-shadow: 0 0 0 100px inset #EEEEEE;
            }
            .header{
                font-weight: 600;
            }
        }
        .pdf{
            padding: 40px 25px;
            .h2{
                padding-bottom: 10px;
                text-align: center;
                font-size: 23px;
                font-weight: 600;
            }
        }
        .file-content{
            .video-view{
                position: relative;
                border-radius: 8px;
                margin: 0 auto 5px;
                width: 100px;
                height: 100px;
                background: rgba(0, 0, 0, .5) no-repeat center center;
                background-size: cover;
                cursor: pointer;
                &::after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    transform: translate(-3px, -50%);
                    border-radius: 4px;
                    border: 10px solid transparent;
                    border-right: 0;
                    border-left: 14px solid #fff;
                    width: 0;
                    height: 0;
                }
            }
            .el-image{
                border-radius: 8px;
                width: auto;
                height: 100px;
            }
        }
    }
</style>