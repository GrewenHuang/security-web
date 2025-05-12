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
        <el-tabs type="card" @tab-click="changeTab" v-model="tabActive">
            <el-tab-pane
                v-for="(item, index) in info.InspectionItems"
                :key="index"
                :name="item.ItemName"
                :label="item.Sort + '、' + item.ItemName"
                :data="item.ItemContentList"
            ></el-tab-pane>
        </el-tabs>
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-table
                :data="list"
                v-loading="loading"
                :header-cell-style="$tableStyle"
                v-if="list.length"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="80"
                ></el-table-column>
                <el-table-column
                    label="检查内容"
                    align="center"
                    prop="Content"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    label="检查依据"
                    align="center"
                    width="450"
                    prop="Basis"
                    show-overflow-tooltip
                ></el-table-column>
            </el-table>
            <no-data
                top="102"
                text="暂未设置其他检查表"
                v-else
            ></no-data>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: {},
            list: [],
            tabActive: ''
        }
    },
    computed: {
        title() {
            return '详情'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.info = item;
                this.setDefaultTab();
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.info = {};
        },
        setDefaultTab() {
            let current = (this.info.InspectionItems[0]||{});
            this.list = current.ItemContentList||[];
            this.tabActive = current.ItemName; 
        },
        changeTab() {
            this.list =( this.info.InspectionItems.find((item) => this.tabActive == item.ItemName) || {}).ItemContentList || [];
        },
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 14px 16px 13px !important;
            .el-scrollbar__wrap{
                margin-bottom: 0 !important;
            }
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        .w50{
            width: 50%;
        }
        .mr20{
            margin-right: 20px;
        }
        .gutter{
            &::before{
                content: '';
                display: block;
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        /deep/ .el-tabs__header{
            border-bottom: 0;
            margin-bottom: 15px;
            padding: 0 36px;
            .el-tabs__nav-wrap.is-scrollable{
                position: initial;
                padding: 0;
                .el-tabs__nav-prev,
                .el-tabs__nav-next{
                    top: 50%;
                    transform: translateY(-50%);
                    border-radius: 4px;
                    border: 1px solid #d5d5d5;
                    width: 21px;
                    height: 21px;
                        background: #fff;
                    line-height: 21px;
                    text-align: center;
                }
            }
            .el-tabs__nav{
                border: 0;
                height: 55px;
                .el-tabs__item{
                    border-radius: 10px 10px 0 0;
                    border: 1px solid #d5d5d5;
                    height: 50px;
                    background: #fff;
                    line-height: 50px;
                    &:not(:first-child) {
                        margin-left: 5px;
                    }
                    &.is-active{
                        position: relative;
                        border-color: $--color-primary;
                        height: 55px;
                        background: $--color-primary;
                        color: #fff;
                        line-height: 55px;
                        vertical-align: bottom;
                        &::after{
                            content: '';
                            position: absolute;
                            bottom: 6px;
                            left: 50%;
                            transform: translateX(-50%);
                            border: 5px solid transparent;
                            border-top: 5px solid #fff;
                            border-bottom: 0;
                        }
                    }
                }
            }
        }
        /deep/ .el-tabs--border-card > .el-tabs__content {
            padding: 0;
        }
    }
</style>