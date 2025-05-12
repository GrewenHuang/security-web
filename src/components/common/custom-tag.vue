<template>
    <div class="custom-tag" :style="tagStyle">
        <i :class="icon"></i><slot>{{ text }}</slot>
    </div>
</template>

<script>
export default {
    name: 'custom-tag',
    props: {
        icon: {
            type: String,
            default: 'el-icon-warning'
        },
        text: {
            type: String,
            default: ''
        },
        successStyle: {
            type: Object,
            default() {
                return {
                    background: 'rgba(42,169,66,0.0784)',
                    color: '#2AA843'
                }
            },
        },
        warningStyle: {
            type: Object,
            default() {
                return {
                    background: 'rgba(254,145,46,0.0784)',
                    color: '#FE912E'
                }
            },
        },
        infoStyle: {
            type: Object,
            default() {
                return {
                    background: 'rgba(254,145,46,0.0784)',
                    color: '#FE912E'
                }
            },
        },
        primaryStyle: {
            type: Object,
            default() {
                return {
                    background: 'rgba(254,145,46,0.0784)',
                    color: '#FE912E'
                }
            },
        },
        type: {
            type: String,
            default: 'success'
        }
    },
    computed: {
        tagStyle() {
            const obj = {
                success: this.successStyle,
                warning: this.warningStyle,
                info: this.infoStyle,
                primary: this.primaryStyle
            }
            return obj[this.type]
        }
    }
}
</script>

<style lang="scss" scoped>
    .custom-tag{
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 4px 8px;
        text-align: center;
        border-radius: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        font-size: 12px;
        > *:first-child{
            margin-right: 4px;
        }
    }
</style>