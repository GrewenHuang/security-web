<template>
	<page-layout :loading="loading">
		<div slot="operation" class="f-b-c" v-if="$_has('KHGZSZBtnSave')">
			<div class="input-content f--c">
				<el-button type="primary" @click='Submit()'>保存设置</el-button>
				<span slot="label">
					<el-tooltip content="备注: 增加积分规则是指添加积分的频次，每次指每操作一次都增加积分，每天指同一天操作多次也只可加一次积分。">
						<span><i class="el-icon-question"></i></span>
					</el-tooltip>
				</span>
			</div>
		</div>
		<!--列表 开始-->
		<el-table :data="list" :header-cell-style="$tableStyle" v-if="$_has('KHGZSZBtnSave')">

			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>

			<el-table-column label="名称" align="center" prop="text">
			</el-table-column>
			<el-table-column label="积分设置" align="center" width="200" header-align="center">
				<template slot-scope="scope">
					<el-input-number v-model="scope.row.Score" :disabled='!scope.row.Status' size='small'
						:min="-1000" :max="1000"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column label="积分规则" align="center" width="300" header-align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.RulesCode" size='small' :disabled='!scope.row.Status'
						placeholder="请选择">
						<el-option v-for="item in EnumCom" :key="item.id" :label="item.text" :value="item.id">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column label="操作" prop="text" width="300" align="center" header-align="center">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.Status" active-text="开启" inactive-text="关闭" :active-value="1"
						:inactive-value="0">
					</el-switch>
				</template>
			</el-table-column>
		</el-table>
		<div v-else class="no-data-box">
			<no-data text="您的账号没有权限,请联系管理员添加."></no-data>
		</div>
	</page-layout>
</template>
<script>
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		mixins: [request_mixin],
		data() {
			return {
				list: [],
				EnumCom: [],
				loading: false,
			}

		},
		mounted() {
			this.fn()
		},
		methods: {
			async fn() {
				await this.Get('/GetIntegralNameEnumCom').then(res => {
					if (res.status == 2000) {
						res.data.forEach(k => {
							k.Status = null
							k.NameCode = parseInt(k.id)
							k.Score = null
							k.RulesCode = ""
						});
						this.list = res.data
					}
				})

				await this.Get('/GetIntegralRulesEnumCom').then(res => {
					if (res.status == 2000) {
						this.EnumCom = res.data
					}
				})

				await this.Get('/GetIntegralConfig').then(res => {
					if (res.status == 2000) {
						res.data.forEach((k, i) => {
							this.list[i].Status = res.data[i].Status
							this.list[i].NameCode = res.data[i].NameCode
							this.list[i].Score = res.data[i].Score
							this.list[i].RulesCode = res.data[i].RulesCode ? res.data[i].RulesCode
								.toString() : ""
						})
					}
				})
			},

			Submit() {
				let that = this;
				that.loading = true;
				this.Post("/SaveIntegralConfig", this.list).then(res => {
					if (res.status == 2000) {
						this.$message({
							message: '保存成功！',
							type: 'success'
						});
					} else {
						this.$message.error(res.message);
						this.fn()
					}
					that.loading = false;
				})

			},

		},
	}
</script>
<style scoped>
	.no-data-box {
		box-sizing: border-box;
		padding-top: 200px;
	}
</style>