<template>
    <div class="custom-tags" ref="customTags">
        <custom-tag
            icon=""
            v-for="(item, index) in list1.slice(0, 3)"
            :key="index"
            :text="item"
        ></custom-tag>
        <custom-tag
            icon=""
            type="warning"
            v-for="(item, index) in list2.slice(0, 3)"
            :key="'r' + index"
            :text="item"
        ></custom-tag>
        <!-- <custom-tag icon="" text="…"></custom-tag> -->
    </div>
</template>

<script>
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj))
}
export default {
    props: {
        successList: {
            type: Array,
            default() {
                return []
            }
        },
        warningList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            list1: [],
            list2: []
        }
    },
    methods: {
        calcWidth() {
            let el = this.$refs.customTags;
            let list = this.$refs.customTags.querySelectorAll('.custom-tag');
            let maxWidth = el.offsetWidth;
            let allWidth = 0;
            list.forEach((item, index) => {
                let marginRight = parseInt(getComputedStyle(item)['margin-right'])
                let width = item.offsetWidth + marginRight;
                if (allwidth < maxWidth) {
                    allWidth += width;
                }
            })
        }   
    },
    mounted() {
        this.list1 = _extends(this.successList);
        this.list2 = _extends(this.warningList);
        this.calcWidth();
    }
}
</script>

<style lang="scss" scoped>
.custom-tags{
    /deep/ .custom-tag{
        margin-right: 10px;
    }
}
</style>