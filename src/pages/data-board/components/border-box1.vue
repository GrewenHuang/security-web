<template>
    <div class="border-box-1">
        <div class="border-box-1-content">
            <animated-number class="number" :value="value" :formatValue="formatValue"></animated-number>
            <span class="text">{{ name }}</span>
        </div>
        <svg class="border" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="100%" height="100%"
        >
            <linearGradient id="test" x1="0" x2="0" y1="0" y2="1" spreadMethod="reflect">
                <stop  offset="0%" style="stop-color: #25bcc9"/>
                <stop  offset="50%" style="stop-color: rgba(37, 188, 201, .1)"/>
                <stop  offset="100%" style="stop-color: #25bcc9"/>
            </linearGradient>
            <rect x="0" y="0" width="100%" height="100%" rx="6" style="stroke-width: 2;" stroke="url(#test)" fill="transparent"/>
        </svg>
        <div class="horn-list">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>
<script>
import AnimatedNumber from 'animated-number-vue';
export default {
    components: {
        AnimatedNumber
    },
    props: {
        name: '',
        value: ''
    },
    computed: {
    },
    methods: {
        formatValue(num) {
            return parseInt(num)
        },
    }
}
</script>
<style lang="scss" scoped>
    .border-box-1{
        position: relative;
        width: 100%;
        height: 100%;
        box-shadow: 0 0 30px rgba(37, 188, 201, .5) inset;
        text-align: center;
        .border{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        }
        .border-box-1-content{
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .number{
                margin-bottom: 6px;
                font-size: 32px;
                font-family: Alibaba PuHuiTi;
                font-weight: bold;
                font-style: italic;
                color: #EEF3FF;
                line-height: 1;
                text-shadow: 0px 3px 7px rgba(0,0,0,0.35);
                background: linear-gradient(180deg, #FFF 60%, #8FB9F7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .text{
                font-size: 16px;
                font-family: Source Han Sans CN;
                font-weight: 500;
                color: #A2F4FE;
            }
        }
        .horn-list{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            $border-color: #62DFFE;
            @keyframes fade-out {
                40%{
                    opacity: .7;
                }
                85%{
                    opacity: 1;
                }
            }
            >div{
                position: absolute;
                width: 0;
                height: 0;
                animation: fade-out linear 1.5s infinite;
            }
            >div:first-child{
                top: 4px;
                right: 5px;
                box-shadow: 0 3px 8px 9px rgba(98, 223, 254, 0.2);
            }
            >div:nth-child(2) {
                bottom: 4px;
                left: 5px;
                box-shadow: 3px 0 8px 9px rgba(98, 223, 254, 0.2);
            }
            >div:nth-child(3) {
                top: 4px;
                left: 5px;
                box-shadow: 0 3px 8px 9px rgba(98, 223, 254, 0.2);
            }
            >div:nth-child(4) {
                bottom: 4px;
                right: 5px;
                box-shadow: -3px 0 8px 9px rgba(98, 223, 254, 0.2);
            }
            >div::before,
            >div::after{
                content: '';
                position: absolute;
                top: 0;
                left: 1px;
                width: 6px;
                height: 0;
                border: 2px solid transparent;
                border-top-color: $border-color;
            }
            >div::after,
            &::after{
                top: 1px;
                left: 0;
                width: 0;
                height: 6px;
                border-top-color: transparent;
                border-left-color: $border-color;
            }
            >div:first-child{
                &::before{
                    left: auto;
                    right: 1px;
                }
                &::after{
                    left: auto;
                    right: 0;
                    border-left-color: transparent;
                    border-right-color: $border-color;
                }
            }
            >div:nth-child(2){
                &::before{
                    top: auto;
                    bottom: 0;
                    border-top-color: transparent;
                    border-bottom-color: $border-color;
                }
                &::after{
                    top: auto;
                    bottom: 1px;
                }
            }
            >div:last-child{
                &::before{
                    top: auto;
                    right: 1px;
                    bottom: 0;
                    left: auto;
                    border-top-color: transparent;
                    border-bottom-color: $border-color;
                }
                &::after{
                    top: auto;
                    right: 0;
                    bottom: 1px;
                    left: auto;
                    border-left-color: transparent;
                    border-right-color: $border-color;
                }
            }
        }
    }
</style>