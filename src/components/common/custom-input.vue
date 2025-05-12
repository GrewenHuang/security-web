<template>
    <div 
        class="custom-input"
        ref="customInput"
        :contenteditable="!disabled"
        :class="[{placeholder: !hasValue}, modal]"
        :placeholder="placeholder"
        :style="{textAlign: modal == 'horizontal' ? align : ''}"
        @input="input"
        @focus="focus"
        @blur="blur"
        @compositionstart="compositionStart"
        @compositionend="compositionEnd"
    ></div>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        modal: {
            type: String,
            default: 'vertical', // horizontal
        },
        align: {
            type: String,
            default: 'left', // left center right
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                if (!this.isInput) {
                    this.$nextTick(() => {
                        this.$refs.customInput.innerText = val;
                        this.val = val;
                    })
                }
            }
        }
    },
    data() {
        return {
            isLock: false,
            isInput: false,
            val: '',
        }
    },
    computed: {
        hasValue() {
            return !!this.val;
        }
    },
    methods: {
        input() {
            let el = this.$refs.customInput;
            let val = el.innerText;
            this.val = val;
            if (!this.isLock) {
                this.$emit('update:value', val);
                this.$emit('change', val);
            }
        },
        focus() {
            this.$emit('focus', this.value);
            this.isInput = true;
        },
        blur() {
            this.$emit('blur', this.value);
            this.isInput = false;
        },
        compositionStart() {
            this.isLock = true;
        },
        compositionEnd(e) {
            this.isLock = false;
            this.input();
        }
    }
}
</script>

<style lang="scss" scoped>
    .custom-input{
        position: relative;
        margin: 0 auto;
        min-width: 180px;
        height: 35px;
        line-height: 35px;
        text-align: left;
        &.vertical{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6px 0;
            min-width: auto;
            height: auto;
            min-height: 60px;
            line-height: 16px;
            text-align: center;
            &.placeholder::after{
                margin: 0 auto;
                width: 24px;
            }
        }
        &.horizontal{
            min-width: 180px;
            height: 35px;
        }
        &:focus-visible{
            outline: none;
        }
        &.placeholder::after{
            content: attr(placeholder);
            position: absolute;
            right: 0;
            left: 0;
            color: #C0C4CC;
            pointer-events: none;
        }
    }
</style>