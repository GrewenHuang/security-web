<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1300px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
        append-to-body
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-collapse v-model="activeNames">
                <el-collapse-item :name="1">
                    <div slot="title" class="f-b-c f1">
                        <div class="title">
                            <span>基本信息</span>
                        </div>
                        <div class="operation" :class="{open: activeNames.includes(1)}">
                            {{ activeNames.includes(1) ? '收起' : '展开' }}
                        </div>
                    </div>
                    <basicInfo :info="info"/>
                </el-collapse-item>
                <el-collapse-item :name="2">
                    <div slot="title" class="f-b-c f1">
                        <div class="title">
                            <span>点检信息</span>
                        </div>
                        <div class="operation" :class="{open: activeNames.includes(2)}">
                            {{ activeNames.includes(2) ? '收起' : '展开' }}
                        </div>
                    </div>
                    <div class="form-col form-item">
                        <div class="f--c">
                            <div class="label">点检周期：</div>
                            <div>{{ info.PeriodDesc }}</div>
                        </div>
                        <div class="f--c">
                            <div class="label">点检人：</div>
                            <div>{{ info.UserName }}</div>
                        </div>
                    </div>
                    <div class="form-col form-item">
                        <div class="f--c">
                            <div class="label">点检时间：</div>
                            <div>{{ info.RecordDateDesc }}</div>
                        </div>
                        <div class="f--c">
                            <div class="label">备注：</div>
                            <div>{{ info.Remark }}</div>
                        </div>
                    </div>
                    <el-table
                        :data="info.SpotCheckRecordItems"
                        border
                        :header-cell-style="$tableStyle"
                        :span-method="__handlerMergeSpan"
                    >
                        <el-table-column
                            label="点检部位"
                            width="80"
                            align="center"
                            prop="Position"
                        ></el-table-column>
                        <el-table-column
                            label="点检标准"
                            min-width="200"
                            align="center"
                            prop="Standard"
                        ></el-table-column>
                        <el-table-column
                            label="点检结果"
                            width="120"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                {{ resultObj[row.Result] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="点检情况"
                            width="120"
                            align="center"
                            prop="Remark"
                        ></el-table-column>
                        <el-table-column
                            label="点检照片"
                            width="150"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <div v-if="row.Url.length">
                                    <el-image
                                        style="width: 50px;height: 50px;"
                                        :src="row.Url[0]"
                                        :preview-src-list="row.Url"
                                    ></el-image>
                                    <el-image
                                        class="image-more"
                                        style="width: 50px;height: 50px;"
                                        :src="row.Url[0]"
                                        :preview-src-list="row.Url"
                                        v-if="row.Url.length > 1"
                                    ></el-image>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
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
import basicInfo from '../basic-info.vue';
import mergeSpan from '@/mixins/merge-span-mixin';
const defaultInfo = {
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    components: {
        basicInfo
    },
    mixins: [request_mixin, mergeSpan],
    data() {
        return {
            loading: false,
            dislogShow: false,
            info: _extends(defaultInfo),
            activeNames: [1,2],
            resultObj: {
                0: '未保养',
                1: '正常',
                2: '异常',
                3: '异常当场解决',
            }
        }
    },
    computed: {
        title() {
            return '查看'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                try {
                    let info = Object.assign(_extends(defaultInfo), item);
                    this.__generateSpanData({levelKeys: {1: 'Position'},rowspanByColIndexs: {1: '0'}, levelLength: 2, list: info.SpotCheckRecordItems});
                    this.info = info;
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
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 24px 25px !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        /deep/ .el-collapse{
            border: none;
            .el-collapse-item{
                &.is-disabled{
                    .el-collapse-item__header{
                        cursor: inherit;
                        color: inherit;
                    }
                }
                &:not(:last-child){
                    padding-bottom: 15px;
                }
                .el-collapse-item__header{
                    border: none;
                    border-radius: 4px;
                    padding: 15px;
                    background: #F5F6FA;
                    line-height: inherit;
                    .title{
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        font-weight: 600;
                        line-height: 22px;
                        color: $base-color;
                        &::before{
                            content: '';
                            border-radius: 2px;
                            margin-right: 8px;
                            width: 5px;
                            height: 16px;
                            background: $primary-color;
                        }
                    }
                    .operation{
                        display: flex;
                        align-items: center;
                        color: $primary-color;
                        &::before{
                            content: '';
                            border-radius: 2px 2px 0 0;
                            border: 8.25px solid $primary-color;
                            border-bottom: 0;
                            border-right: 6px solid transparent;
                            border-left: 6px solid transparent;
                            margin-right: 6px;
                            width: 0;
                            height: 0;
                            transform-origin: center;
                            transform: rotateX(0);
                            transition: all .2s linear;
                        }
                        &.open{
                            &::before{
                                transform: rotateX(180deg);
                            }
                        }
                    }
                }
                .el-collapse-item__arrow{
                    display: none;
                }
                .el-collapse-item__wrap{
                    border: none;
                }
                .el-collapse-item__content{
                    .abnormal-content{
                        >div{
                            &:not(:last-child){
                                margin-bottom: 5px;
                            }
                        }
                    }
                    .in-train{
                        &:not(:last-child){
                            position: relative;
                            &::after{
                                content: '';
                                position: absolute;
                                right: -15px;
                                bottom: 0;
                                left: -15px;
                                border-bottom: 1px dashed #ddd;
                            }
                        }
                    }
                }
            }
        }
        /deep/ .el-table__header-wrapper{
            border-radius: 0;
        }
        .el-table{
            margin-top: 10px;
        }
        .form-col{
            display: flex;
            >div{
                flex: 1;
                &:not(:last-child){
                    margin-right: 40px;
                }
            }
        }
        .form-item{
            border-bottom: 1px solid #EFEFEF;
            padding: 20px 15px;
            .label{
                font-weight: 600;
            }
        }
        .image-more{
            position: relative;
            border-radius: 4px;
            margin-left: 7px;
            overflow: hidden;
            &::before{
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: #F8F8F8;
                pointer-events: none;
            }
            &::after{
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-top: 2px dotted #959595;
                width: 10px;
            }
        }
    }
</style>