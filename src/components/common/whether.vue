<template>
    <div class="whether" :class="{yes: yes, after: afterSign, before: !afterSign, warning: warning, gray: gray}">
        {{ text || whetherText }} 
    </div>
</template>

<script>
export default {
    props: {
        yes: {
            type: Boolean,
            default: false
        },
        afterSign: {
            type: Boolean,
            default: false
        },
        yesText: {
            type: String,
            default: '是'
        },
        noText: {
            type: String,
            default: '否'
        },
        text: {
            type: String,
            default: ''
        },
        warning: {
            type: Boolean,
            default: false
        },
        gray: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        whetherText() {
            
            return this.yes ? this.yesText : this.noText;
        }
    }
}
</script>

<style lang="scss" scoped>
    $-danger-color: #FE3F51;
    $-success-color: #13CE66;
    $-warning-color: #FE912E;
    $-gray-color: #959595;
    .whether{
        display: flex;
        align-items: center;
        justify-content: center;
        &::before,
        &::after{
            content: '';
            display: none;
            border-radius: 8px;
            width: 8px;
            height: 8px;
            background: $-danger-color;
        }
        &.yes{
            &::before,
            &::after{
                background: $-success-color;
            }
        }
        &.warning{
            &::before,
            &::after{
                background-color: $-warning-color;
            }
        }
        &.gray{
            &::before,
            &::after{
                background-color: $-gray-color;
            }
        }
        &.before{
            &::before{
                display: block;
                margin-right: 7px;
            }
        }
        &.after{
            &::after{
                display: block;
                margin-left: 7px;
            }
        }
    }
</style>