<template>
	<el-select class="select-position" v-model="selected" :placeholder="placeholder" :clearable="clearable"
		:multiple="multiple" :collapse-tags="collapseTags" :filterable="multiple || filterable"
		:multiple-limit="multipleLimit" v-bind="$attrs" @change="handleChange" @clear="onClear">
		<el-option v-for="(item, index) in list" :key="index" :label="item.EnterpriseName" :value="item.EnterpriseId">
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
				default () {
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
			value: {
				immediate: true,
				handler(val) {
					this.selected = val;
				},
			},
		},
		data() {
			return {
				list: [],
				selected: ''
			}
		},
		methods: {
			onClear() {
				this.$emit('clear');
			},
			handleChange() {
				this.$emit('change', _extends(this.selected));
				let enterprises = this.list.find(item => item.EnterpriseId == this.selected);
				this.$emit('selected', _extends(this.selected), enterprises);
			},
			// async getList() {
			//     try {
			//         let res = await this.Post('/GetSubEnterprisePageList', {page: 1, rows: 9999, IsAll: 1});
			//         if (res.status == 2000) {
			//             this.list = res.data.list;
			//         } else {
			//             new Error('获取岗位信息失败')
			//         }
			//     } catch (error) {
			//         console.error(error);
			//     }
			// }
			async getList() {
				try {
					// GetSubEnterpriseListByAuthority  GetSubEnterpriseList // 人员管理企业
					let res = await this.Get('/GetSubEnterpriseListByAuthority');
					if (res.status == 2000) {
						this.list = res.data
					} else {
						new Error('获取企业信息失败')
					}
				} catch (error) {
					console.error(error);
				}
			}
		},
		mounted() {
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.select-position {
		width: 100%;
	}
</style>