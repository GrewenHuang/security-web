<template>
    <div>
        <div class="file-list"
        v-for="(item, index) in list"
        :key="index"
    >
        <div class="file-item">
            <div class="file f-b-c cursor-p" @click="$openFile(item.Url)">
                <div class="f">
                    <img style="width:30px;height:30px;margin-right: 13px;"
                        :src="$fileIcons[item.Name.substring(item.Name.lastIndexOf('.') + 1)]" />
                    <div class="text">
                        <div style="color:#44566C;font-size:12px;line-height: 1;;">{{item.Name}}</div>
                        <div style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;">{{ item.Size | formatSize}}</div>
                    </div>
                </div>
                <div>
                    <i class="el-icon-view"></i>
                    <i class="el-icon-error cursor-p" @click.stop="remove(index)" v-if="!disabled"></i>
                </div>
            </div>
            <div></div>
        </div>
    </div>
    </div>
</template>

<script>
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    props: {
        value: {
            type: Array,
            default() {
                return []
            }
        },
        disabled: {
            type: Boolean,
            default: false
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
                if (!this.watchUpdate) {
                    let list = _extends(val);
                    if (list) {
                        let fields = {
                            Name: 'name',
                            Size: 'size',
                            Url: 'url'
                        }
                        list.forEach(item => {
                            for(let key in fields) {
                                if (!item[key]) {
                                    item[key] = item[fields[key]];
                                }
                            }
                        })
                    }
                    this.list = list || [];
                }
            }
        }
    },
    data() {
        return {
            watchUpdate: false,
            list: []
        }
    },
    methods: {
        remove(index) {
            this.watchUpdate = true;
            this.list.splice(index, 1);
            this.$emit('change', _extends(this.list));
            this.$nextTick(() => {
                this.watchUpdate = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.file-list{
    &:not(:last-child){
        margin-bottom: 10px;
    }
    .file-item{
        display: flex;
        >div{
            width: 50%;
        }
        .file{
            border-radius: 4px;
            margin-right: 15px;
            padding: 11px 15px 11px 10px;
            background: #F8FAFB;
        }
    }
}
</style>