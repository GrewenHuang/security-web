<template>
	<el-cascader class="select-department" v-model="selected" :filterable="multiple || filterable"
		:clearable="clearable" :options="list" :multiple="multiple" :placeholder="placeholder" :show-all-levels="false"
		:disabled="disabled" ref='selectDeptRef'
		@change="handleCascaderChange"
		:props="{ value: 'DepartmentId', label: 'Name', children: 'children',emitPath: false,checkStrictly: true  }">
		<template slot-scope="{ node, data }">
			<span >{{ data.Name }}</span>
		</template>
	</el-cascader>
</template>
<script>
	import request_mixin from '@/mixins/request-mixin';
	export default {
		props: {
			value: {
				type: [String, Number, Array],
				// default () {
				// 	return 
				// }
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
			},
			disabled: {
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
			value: {
				immediate: true,
				handler(val) {
					this.selected = val;
				},
			},
			enterpriseId: {
				immediate: true,
				handler(val) {
					if (val) {
						this.enterpriseId = val
						this.getUsers()
					}
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
			handleCascaderChange(value) {
				if (value && value.length > 0) {
					const lastId = value[value.length - 1];
					this.selected = lastId
					// 在这里可以对最后一级的 ID 进行你需要的操作
				}else {
					this.selected = value
				}
				this.$emit('change', this.selected)
				// this.$refs.selectDeptRef.dropDownVisible = false
				// let department = this.list.find(item => item.DepartmentId == this.selected);
				// this.$emit('selected', this.selected, department);
			},
			removeEmptyChildrenDepartment(data) {
				data.forEach(item => {
					if (item.children && item.children.length === 0) {
						delete item.children;
					} else if (item.children && item.children.length > 0) {
						this.removeEmptyChildrenDepartment(item.children);
					}
				});
			},
			async getUsers() {
				try {
					let res = await this.Get('/GetDepartmentListByAuthority?enterpriseId=' + this.enterpriseId);
					if (res.status == 2000) {
						if (res.data) {
							this.list = res.data;
							if (this.list && this.list.length > 0) {
								this.removeEmptyChildrenDepartment(this.list)
							}
						}
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
	.select-department {
		width: 100%;
	}
</style>