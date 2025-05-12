<template>
    <div>
        <el-scrollbar class="tabnavBox" ref="scrollbar">
            <transition-group name="list" tag="ul">
                <li
                    v-for="(item, index) in $store.state.tabnavBox"
                    @contextmenu.prevent="openMenu(item, $event, index)"
                    :key="item.path"
                    class="tabnav"
                    :class="{
                        active: getNoParamsPath($route.fullPath) == getNoParamsPath(item.path),
                        fixed: index === 0,
                    }"
                >
                    <router-link :to="item.path">{{ item.title }}</router-link>
                    <i
                        @click="removeTab(item)"
                        class="el-icon-circle-close"
                        v-if="index !== 0"
                    ></i>
                </li>
            </transition-group>
        </el-scrollbar>
        <ul
            v-show="this.rightMenuShow"
            :style="{ left: this.left + 'px', top: this.top + 'px' }"
            class="menuBox"
        >
            <li @click="removeTab($store.state.rightNav)">关闭当前页面</li>
            <li @click="removeOtherTab($store.state.rightNav)">关闭其他页面</li>
            <li @click="removeAllTab">关闭全部页面</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "tabNav",
    data() {
        return {
            rightMenuShow: false,
            left: 0,
            top: 0,
        };
    },
    methods: {
        openMenu(item, e, index) {
            if (index === 0) {
                return false;
            }
            let maxLeft = window.innerWidth - 106;
            this.rightMenuShow = true;
            this.left = e.clientX > maxLeft ? maxLeft : e.clientX;
            this.top = 110;
            this.$store.dispatch("openMenu", item);
        },
        removeTab(tabItem) {
            this.$store.dispatch("removeTab", {
                tabItem,
                fullPath: this.$route.fullPath,
                router: this.$router,
            });
        },
        removeOtherTab(tabItem) {
            this.$store.dispatch("removeOtherTab", {
                tabItem,
                router: this.$router,
            });
        },
        removeAllTab() {
            this.$store.dispatch("removeOtherTab", {
                all: true,
                router: this.$router,
            });
        },
        // 获取没有参数的 path
        getNoParamsPath(path) {
            return path.replace(/\=.+&{0,}/ , '');
        }
    },
    watch: {
        rightMenuShow(value) {
            if (value) {
                document.body.addEventListener("click", () => {
                    this.rightMenuShow = false;
                });
            } else {
                document.body.removeEventListener("click", () => {
                    this.rightMenuShow = false;
                });
            }
        },
        '$route.fullPath'() {
            this.$nextTick(() => {
                if (document.querySelectorAll('.tabnav.active')[0]) {
                    document.querySelectorAll('.tabnav.active')[0].scrollIntoView({
                        block: 'end',
                        behavior: 'smooth',
                    });
                }
            })
        }
    },
    mounted() {
    },
};
</script>

<style lang="scss" scoped>
$top: top;
$bottom: bottom;
$left: left;
$right: right;
$leftright: ($left, $right);

%w100 {
    width: 100%;
}

%h100 {
    height: 100%;
}

%cursor {
    cursor: pointer;
}

@mixin set-value($side, $value) {
    @each $prop in $leftright {
        #{$side}-#{$prop}: $value;
    }
}

.tabnavBox {
    @extend %w100;
    padding: 0 8px;
    height: 50px;
    min-height: 50px;
    background: #fff;
    /deep/ .el-scrollbar__wrap{
        overflow-x: auto;
        overflow-y: hidden;
        width: 100%;
        height: calc(50px + 20px);
        margin-bottom: 0 !important;
        .el-scrollbar__view{
            white-space: nowrap;
            display: inline-block;
        }
    }
    ul {
        display: flex;
        padding: 5px 10px;
        height: 50px;
        flex-wrap: nowrap;
        li {
            position: relative;
            flex-shrink: 0;
            height: 40px;
            line-height: 40px;
            @extend %cursor;
            margin-right: 13px;
            overflow: hidden;
            color: #b3b5b8;
            &:first-child a {
                flex: 0 0 auto;
                width: 60px;
                padding: 0;
                text-align: center;
                white-space: normal;
                width: auto;
                &::before {
                    content: "";
                    background: url(../../assets/images/main/iconhome.png)
                        no-repeat center center;
                    background-size: 100%;
                    width: 14px;
                    height: 14px;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 7px;
                    margin-top: -2px;
                }
            }
            &:last-child {
                margin-#{$right}: 0;
            }
            &.active,
            &.fixed {
                color: #181b3b;
            }
            a {
                // @include set-value(padding, 13px);
                display: block;
                padding: 0 38px 0 16px;
                @extend %h100;
                font-size: 12px;
                color: inherit;
            }

            i {
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                color: #b3b5b8;
                @extend %cursor;
            }
        }
    }
}

.menuBox {
    margin: 0;
    background: #fff;
    z-index: 999;
    position: absolute;
    padding: 5px 0;
    border: 1px solid #cccccc;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 1px 6px 0 rgba(0, 0, 0, 0.3);
    li {
        margin: 0;
        padding: 7px 16px;
        @extend %cursor;
        &:hover {
            background: #e1e6ea;
        }
    }
}
</style>

