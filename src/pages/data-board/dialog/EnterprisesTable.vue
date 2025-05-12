<template>
	<div>
		<el-table :data="list" highlight-current-row  v-loading="loading" :header-cell-style="{ 
									background: 'rgba(13, 64, 105, 0.3)',
									height:'60px',
									color:'#fff',
									borderBottom: '1px solid #0f2a4b',
									}" style="min-height: 400px">
			<el-table-column label="序号" type="index" align="center" width="50">
			</el-table-column>
			<el-table-column label="企业名称" align="center" prop="EnterpriseName">
			</el-table-column>
			<el-table-column label="企业简称" align="center" prop="EnterpriseNameAs">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="{ row }">
					<div class="table-operation">
						<el-button type="primary" size="mini" @click="option(row)">选择</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	export default {
		mixins: [request_mixin],
		data() {
			return {
				list: [],
				loading: false,
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList() {
				let params = {
					page: 1,
					rows: 9999
				}
				this.loading = true
				this.Post('/GetSubEnterpriseList', params).then(res => {
					if (res.status == 2000) {
						res.data.unshift({EnterpriseName: '华恒物流(集团)',EnterpriseId: '',EnterpriseNameAs: '集团'})
						this.list = res.data
					}
				})

				this.loading = false;
			},
			option(row) {
				this.$emit('EnterprisesName', row)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../assets/table.less';
</style>