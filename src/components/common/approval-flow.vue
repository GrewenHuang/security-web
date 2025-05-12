<template>
    <div class="approval-flow">
        <div class="item"
            v-for="(item, index) in list"
            :key="index"
        >
            <div class="avatar">
                {{ item.UserName.substr(0, 1) }}
                <div class="status" :class="{done: !!item.SignInUrl}"><i></i></div>
            </div>
            <div class="username">
                {{ item.UserName }}
                <span class="date" v-if="item.SignInDate">{{ item.SignInDate | format('yyyy-MM-dd HH:mm')}}</span>
            </div>
            <div class="sign-status" :class="{done: !!item.SignInUrl}">
                {{ item.SignInUrl ? '已签' : '待签' }} ({{ item.flowName }})
            </div>
            <div v-if="item.SignInUrl">
                <el-image class="sign-image" :src="item.SignInUrl" style="width: auto; height: 70px;">
                    <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                    </div>
                </el-image>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        }
    },

}
</script>

<style lang="scss" scoped>
.item{
    position: relative;
    padding: 0 0 45px 50px;
    line-height: 20px;
    &:not(:last-child)::before{
        content: '';
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 20px;
        border-left: 1px solid #E1E1E1;
    }
    .avatar{
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 40px;
        width: 40px;
        height: 40px;
        background: $--color-primary;
        font-size: 22px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        .status{
            position: absolute;
            right: -5px;
            bottom: -5px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid #fff;
            border-radius: 100%;
            width: 20px;
            height: 20px;
            background: $--color-primary;
            i,
            &::before,
            &::after{
                content: '';
                margin-right: 1px;
                width: 2px;
                height: 2px;
                background: #fff;
            }
            &::after{
                margin-right: 0;
            }
            &.done{
                background: #09B66D;
                i,
                &::after{
                    display: none;
                }
                &::before{
                    content: '';
                    border-left: 1px solid #fff;
                    border-bottom: 1px solid #fff;
                    transform: rotate(-45deg);
                    width: 7px;
                    height: 3px;
                    background: transparent;
                }
            }
        }
    }
    .username{
        .date{
            margin-left: 45px;
            color: #959595;
        }
    }
    .sign-status{
        color: #959595;
        &.done{
            color: #09B66D;
        }
    }
    .sign-image{
        border-radius: 4px;
        border: 1px solid #ddd;
        margin-top: 14px;
    }
}
</style>