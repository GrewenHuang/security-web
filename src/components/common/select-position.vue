<template>
    <el-select class="select-position"
        v-model="selected"
        :placeholder="placeholder"
        :clearable="clearable"
        :multiple="multiple"
        :collapse-tags="collapseTags"
        :filterable="multiple || filterable"
        :multiple-limit="multipleLimit"
        v-bind="$attrs"
        @change="handleChange"
    >
        <el-option
            v-for="(item, index) in list"
            :key="index"
            :label="item.Name"
            :value="item.PositionId"
        >
        </el-option>
    </el-select>
</template>
<script>
import request_mixin from '@/mixins/request-mixin';
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    props: {
        value: {
            required: true,
            type: [String, Number, Array],
            default() {
                return []
            }
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        multiple: Boolean,
        collapseTags: Boolean,
        clearable: Boolean,
        filterable: Boolean,
        multipleLimit: Number,
        showTel: {
            type: Boolean,
            default: true,
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    mixins: [request_mixin],
    watch: {
        value(val) {
            this.selected = _extends(val);
        }
    },
    data() {
        return {
            list: [],
            selected: ''
        }
    },
    methods: {
        handleChange() {
            this.$emit('change', _extends(this.selected));
            let position = this.list.find(item => item.PositionId == this.selected);
            this.$emit('selected', _extends(this.selected), position);
        },
        async getUsers() {
            try {
                let res = await this.Get('/GetPositions');
                if (res.status == 2000) {
                    this.list = res.data;
                } else {
                    new Error('获取岗位信息失败')
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        this.getUsers();
    }
}
</script>

<style lang="scss" scoped>
.select-position{
    width: 100%;
}
</style>