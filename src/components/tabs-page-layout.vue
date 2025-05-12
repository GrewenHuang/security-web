<template>
    <div class="tabs-page-layout" :class="{'overflow-initial': overflowInitial}">
        <el-tabs type="border-card" v-model="currentTab">
            <el-tab-pane v-for="(item, index) in tabs" :key="index" :lazy="true" :label="item.title" :name="item.title">
                <component :is="item.url" v-if="item.title == currentTab"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    props: {
        tabs: {
            default() {
                return []
                /* 
                // exam🌰: 
                tabs: [
                    {
                        title: '船舶证书',
                        url: () => import("@/pages/certManage/ship")
                    },
                ] */
            },
            type: Array
        },
        active: String,
        overflowInitial: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentTab: this.active || this.tabs[0].title,
        }
    },
}
</script>

<style lang="scss">
.tabs-page-layout {
    height: 100%;
    min-height: 700px;
    > .el-tabs{
        height: 100%;
        background: transparent;
        border: 0;
        box-shadow: none;
        .el-tabs__content{
            padding: 0;
            height: calc(100% - 50px);
            .el-tab-pane{
                height: 100%;
            }
            .page-layout .main{
                border-top-left-radius: 0;
            }
        }
        .operation-content{
            border-top-left-radius: 0 !important;
        }
        .el-tabs__header{
            background: transparent;
            border: 0;
            .el-tabs__item{
                border: 0;
                border-radius: 10px 10px 0 0;
                margin-right: 5px;
                padding: 0 38px !important;
                height: 50px;
                line-height: 50px;
                background: #ebedf3;
                &.is-active,
                &:hover{
                    border: 0;
                    background: #fff;
                }
                &.is-active{
                    position: relative;
                    &::after{
                        content: '';
                        position: absolute;
                        bottom: 6px;
                        left: 50%;
                        transform: translateX(-50%);
                        border: 4px solid transparent;
                        border-bottom: 0;
                        border-left-width: 5.5px;
                        border-right-width: 5.5px;
                        border-top-color: $primary-color;
                        width: 0;
                        height: 0;
                    }
                }
            }
        }
        
    }
    &.overflow-initial{
        .el-tabs__content{
            overflow: initial;
        }
    }
}
</style>