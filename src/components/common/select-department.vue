<template>
    <el-select class="select-department"
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
            :value="item.DepartmentId"
        >
        </el-option>
    </el-select>
</template>
<script>
import request_mixin from '@/mixins/request-mixin';
export default {
    props: {
        value: {
            type: [String, Number, Array],
            default() {
                return []
            }
        },
		enterpriseId: {
			type: [String, Number],
			default: 0
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
            this.selected = val;
        },
		enterpriseId(val){
			if(val){
				this.enterpriseId = val
				this.getUsers()
			}
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
            this.$emit('change', this.selected)
            let department = this.list.find(item => item.DepartmentId == this.selected);
            this.$emit('selected', this.selected, department);
        },
        async getUsers() {
            try {
				// GetEnterpriseDepartmentsByEnterpriseId // 人员管理 新增部门
                let res = await this.Get('/GetDepartmentListByAuthority?enterpriseId=' + this.enterpriseId);
                if (res.status == 2000) {
                    this.list = res.data;
                } else {
                    new Error('获取部门信息失败')
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        // this.getUsers();
    }
}
</script>

<style lang="scss" scoped>
.select-department{
    width: 100%;
}
</style>