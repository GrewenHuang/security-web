<template>
    <div class="box-border-2" :class="{active: active}" @click="$emit('click', $event)">
        <div class="border" :style="{backgroundImage: `url(${icon})`}">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
                width="62" height="62"
            >
                <linearGradient id="circle1" x1="0" x2="0" y1="0" y2="1" spreadMethod="reflect">
                    <stop  offset="22%" style="stop-color:#FFED1B"/>
                    <stop  offset="50%" style="stop-color: transparent"/>
                    <stop  offset="88%" style="stop-color:#FFED1B"/>
                </linearGradient>
                <linearGradient id="circle2" x1="0" x2="0" y1="0" y2="1" spreadMethod="reflect">
                    <stop  offset="22%" style="stop-color:#62DFFE"/>
                    <stop  offset="50%" style="stop-color: transparent"/>
                    <stop  offset="88%" style="stop-color:#62DFFE"/>
                </linearGradient>
                <circle cx="50%" cy="50%" r="30" width="100%" height="100%" stroke-width="1" :stroke="`url(#circle${active ? '1' : '2'})`" fill="transparent"/>
            </svg>
        </div>
        <div class="box-content">
            <div class="name">{{ name }}</div>
            <div class="number-content"> 
                <animated-number class="number" :value="value" :formatValue="formatValue"></animated-number><span>个</span>
            </div>
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
        name: {
            type: String,
            default: '',
        },
        value: {
            type: [String, Number],
            default: ''
        },
        active: {
            type: Boolean,
            default: false
        },
        icon: String,
        iconActive: String,
    },
    methods: {
        formatValue(number) {
            return parseInt(number);
        }
    }
}
</script>

<style lang="scss" scoped>
    .box-border-2{
        $base-color: #60E4FF;
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        &.active{
            .border{
                box-shadow: 0 0 2px 7px rgba(242, 225, 33, .1) inset;
            }
            .box-content{
                .name{
                    border: none;
                    padding-left: 11px;
                    position: relative;
                    background: linear-gradient(90deg, rgba(255, 237, 27, .6) 0%, transparent 100%);
                    &::before{
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 3px;
                        height: 100%;
                        background: linear-gradient(180deg, #fff 20%, #FFED1B 60%);
                    }
                }
                .number-content{
                    color: #FFED1B;
                }
            }
        }
        .border{
            border-radius: 62px;
            margin-right: 18px;
            box-shadow: 0 0 2px 7px rgba(98, 223, 254, 0.1) inset;
            background: url(../imges/icon-project-1.png) no-repeat center center;
        }
        .box-content{
            display: flex;
            flex-direction: column;
            .name{
                border-left: 3px solid $base-color;
                margin-bottom: 6px;
                padding: 8px 40px 6px 8px;
                font-size: 16px;
                line-height: 1;
                background: linear-gradient(90deg, #286EAB 0%, transparent 100%);
            }
            .number-content{
                font-size: 13px;
                color: $base-color;
                line-height: 1;
                .number{
                    font-size: 29px;
                }
            }
        }
    }
</style>