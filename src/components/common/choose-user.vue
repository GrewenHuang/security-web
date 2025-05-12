<template>
    <div class="choose-user el-input">
        <div class="user-list" :class="{disabled: disabled}">
            <template  v-if="!single">
                <template v-if="!collapseTags">
                    <div class="user"
                        v-for="(item, index) in users"
                        :key="index"
                    >
                        {{ item.UserName }} <i class="remove-icon" @click="remove(item, index)" v-if="!disabled"></i>
                    </div>
                </template>
                <template v-else>
                    <div class="user"
                        v-for="(item, index) in users.slice(0, 1)"
                        :key="index"
                    >
                        {{ item.UserName }} <i class="remove-icon" @click="remove(item, index)" v-if="!disabled"></i>
                    </div>
                    <div class="user" v-if="!!users.slice(1, users.length).length">+{{ users.slice(1, users.length).length }}</div>
                </template>
            </template>
            <div class="name" v-else>{{ users.UserName }}</div>
            <div class="placeholder" v-if=" single ? !users.UserId : !users.length">{{ placeholder }}</div>
        </div>
        <div class="choose-btn" @click="chooseUser" v-if="!disabled">{{ chooseBtnText || '请选择' }}</div>
    </div>
</template>

<script>
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    props: {
        value: {
            type: [Object, Array],
            default() {
                return {}
            }
        },
        single: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        chooseBtnText: {
            type: String,
            default: '请选择'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        // 多选 仅展示1个标签其他合并成 +1 数字
        collapseTags: {
            type: Boolean,
            default: false
        },
        // 单选时需要设置 key
        idKey: {
            type: String,
            default: 'UserId'
        },
        nameKey: {
            type: String,
            default: 'UserName'
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    watch: {
        value: {
            deep: true,
            immediate: true,
            handler(val) {
                if (this.single) {
                    let user = val;
                    user.UserId = val[this.idKey];
                    user.UserName = val[this.nameKey];
                    this.users = user;
                } else {
                    this.users = Array.isArray(val) ? val : [];
                }
            }
        }
    },
    data() {
        return {
            users: []
        }
    },
    methods: {
        chooseUser() {
            this.$chooseUser({
                single: !this.single,
                choosed: this.users,
            }).then(res => {
                this.users = res;
                this.updateValue(res);
            });
        },
        remove(item, index) {
            this.users.splice(index, 1);
            this.updateValue(this.users);
        },
        updateValue(res) {
            if (this.single) {
                let user = this.value;
                user[this.idKey] = res.UserId;
                user[this.nameKey] = res.UserName;
                res = user;
            }
            this.$emit('change', res);
        }
    }
}
</script>

<style lang="scss" scoped>
    .choose-user{
        display: flex;
        align-items: flex-start;
        box-sizing: border-box;
        line-height: 1;
        .user-list{
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            border: 1px solid #DCDFE6;
            border-radius: 4px 0 0 4px;
            padding: 4px 15px 0;
            min-height: 40px;
            &.disabled{
                border-radius: 4px;
                background-color: #F5F7FA;
                border-color: #E4E7ED;
                color: #C0C4CC;
                cursor: not-allowed;
            }
            .name{
                line-height: 30px;
            }
            .user{
                display: flex;
                align-items: center;
                border-radius: 4px;
                margin-right: 8px;
                margin-bottom: 4px;
                padding: 0 8px;
                min-height: 30px;
                background: #f0f0f0;
                .remove-icon{
                    position: relative;
                    display: inline-block;
                    border-radius: 16px;
                    margin-left: 6px;
                    width: 16px;
                    height: 16px;
                    background: #c0c4cc;
                    vertical-align: middle;
                    transform: scale(.8);
                    cursor: pointer;
                    &::before{
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(45deg);
                        width: 10px;
                        height: 1px;
                        background: #909399;
                    }
                    &::after{
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        width: 10px;
                        height: 1px;
                        background: #909399;
                    }
                }
            }
        }
        .choose-btn{
            border: 1px solid #DCDFE6;
            border-left: 0;
            border-radius: 0 4px 4px 0;
            padding: 11px 15px;
            height: 40px;
            background: #f8f8f8;
            white-space: nowrap;
            color: #333;
            cursor: pointer;
        }
        .placeholder{
            color: #c0c4cc;
            line-height: 2;
            user-select: none;
            pointer-events: none;
        }
    }
</style>