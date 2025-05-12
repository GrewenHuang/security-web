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
        append-to-body
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="content">
                <div class="form-2-col border-bottom-1px">
                    <div class="f form-item">
                        <div class="label">题型：</div>
                        <div>{{ info.TypeName }}</div>
                    </div>
                    <div class="f form-item">
                        <div class="label">试题编号：</div>
                        <div>{{ info.SerialNumber }}</div>
                    </div>
                </div>
                <div class="f form-item border-bottom-1px">
                    <div class="label">题干:</div>
                    <div>{{ info.Content }}</div>
                </div>
                <div class="split-line"></div>
                <div>
                    <div class="title">候选项</div>
                    <el-table
                        :data="info.ContestAnswers"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column
                            label="选项"
                            width="60"
                            align="center"
                        >
                            <template slot-scope="{ $index }">
                                {{ $index | formatLetter }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="内容"
                            prop="Answer"
                        ></el-table-column>
                        <el-table-column
                            label="选择选项"
                            width="100"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <div class="checked" v-if="row.IsCorrect == 1"></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="split-line"></div>
                <div>
                    <div class="title">答案题解析</div>
                    <div>{{ info.Explain }}</div>
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
    ContestAnswers: []
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
        formatLetter(num) {
            let code = 'A'.charCodeAt(0);
            return String.fromCharCode(code + num);
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                try {
                    let res = await this.Get(`/GetContestQuestion?ContestQuestionId=${item.ContestQuestionId}`);
                    this.info = res.data;
                } catch (error) {
                    
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
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        .content{
            padding: 13px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        .form-item{
            padding: 20px 15px;
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
                margin: 25px -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        .border-bottom-1px{
            border-bottom: 1px solid #EFEFEF;
        }
        .title{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 600;
            &::before{
                content: '';
                border-radius: 2px;
                margin-right: 8px;
                width: 5px;
                height: 16px;
                background: $--color-primary;
            }
        }
        .label{
            font-weight: 600;
        }
        .checked{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            width: 28px;
            height: 28px;
            background: #1DBFAC;
            &::before{
                content: '';
                border-left: 2px solid #fff;
                border-bottom: 2px solid #fff;
                transform: rotate(-45deg) translate(-2px, -2px);
                transform-origin: top center;
                width: 13px;
                height: 7px;
            }
        }
    }
</style>