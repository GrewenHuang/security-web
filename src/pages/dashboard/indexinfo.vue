<template>
	<!-- <page-layout ref="pageLayout" :loading="loading"  @current-change="handlePageChange"
		:updateWindow="filterTabChangeFlag"> -->
	<div class="box" v-loading="loading">
		<!-- <div slot="header"> -->
		<screen-title :PlanCounts="PlanCounts" @change="change"></screen-title>
		<!-- </div> -->
		<!-- <div class="custom-operation" slot="muiltOperation">
			<template>
				
			</template>
		</div> -->
		<div class="filter f f--s">
			<div class="label">筛选：</div>
			<div style="flex: 1;">
				<el-radio-group v-model="filters.Status" @input="handleCheckedChange">
					<el-radio-button v-for="(checkbox, i) in filterTabs" :key="i"
						:label="checkbox.id">{{checkbox.text}}</el-radio-button>
				</el-radio-group>
			</div>
		</div>
		<!--列表 开始-->
		<!-- <el-scrollbar class="scrollbar"> -->
		<div class="box-scroll">
			<el-table :data="list" :header-cell-style="$tableStyle" style="width: 100%">
				<el-table-column label="序号" type="index" align="center" width="50">
				</el-table-column>
				<el-table-column label="企业" align="center" prop="EnterpriseName" width="200">
				</el-table-column>
				<el-table-column label="类型" align="center" prop="TypeDesc" width="150">
				</el-table-column>
				<el-table-column label="内容" align="center" prop="Content" width="600" show-overflow-tooltip>
					<template slot-scope="{ row }">
						<span v-html="row.Content" v-if="row.Content"></span>
					</template>
				</el-table-column>
				<el-table-column label="推送时间" align="center" prop="PlanTime" width="150">
				</el-table-column>
				<el-table-column label="状态" align="center" width="150">
					<template slot-scope="scope">
						<whether :yes="scope.row.Status == 1" :text="scope.row.StatusDesc" />
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center"  width="200" fixed="right">
					<template slot-scope="scope">
						<div class="table-operation">
							<el-button type="text" @click="look(scope.row.Type, scope.row)">查看</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- </el-scrollbar> -->
		<!-- 列表 结束 -->
		<!-- </page-layout> -->
	</div>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import screenTitle from './components/screen'
	export default {
		mixins: [request_mixins],
		components: {
			screenTitle,
		},
		data() {
			return {
				isShow: false,
				loading: false,
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				IsPrivate: 0,
				filters: {
					SearchType: 0,
					Status: 0
				},
				filterTabChangeFlag: false,
				filterTabIndex: 0,
				PlanCounts: [],
				menus: [],
				url: [],
				filterTabs: [{
						id: -100,
						text: '全部'
					},
					{
						id: 0,
						text: '未完成'
					},
					// {
					// 	id: 2,
					// 	text: '已逾期'
					// },
					{
						id: 1,
						text: '已完成'
					},
				],
			}
		},
		computed: {},
		created() {
			this.menus = JSON.parse(window.localStorage.getItem("menus"))
			this.GetRouterPor(this.menus)
			this.handlePageChange(1)
		},
		methods: {
			GetRouterPor(data){
				if(data && data.length > 0){
					data.forEach(item=>{
						if(item.path == '/TaskDetails/index' || item.path == '/cert/expiration-reminder'){
							this.url.push(item.path)
						}
						if(item.children && item.children.length > 0){
							this.GetRouterPor(item.children )
						}
					})
				}
			},
			change(val) {
				this.filters.SearchType = val
				this.handlePageChange(1)
			},
			handlePageChange(val) {
				this.pages.page = val;
				this.getList();
			},
			handleCheckedChange(item) {
				this.filters.Status = item
				this.handlePageChange(1)
			},
			async getMini() {
				let params = {
					SearchType: 0,
					Status: 0,
					page: 1,
					rows: 10
				}
				this.loading = true;
				try {
					let res = await this.Post('/GetHHEnterpriseHomeMini', params);
					if (res.status == 2000) {
						this.PlanCounts = res.data.PlanCounts
						// this.filters.SearchType = res.data.PlanCounts[0].Type
						this.getList()
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
			GetRouterUrl(data){
				if(!this.url.includes('/TaskDetails/index')){
					this.$message.error('当前账号没有任务详情页面权限,请联系管理员添加')
					return
				}
				this.$router.push({
					name: '任务详情',
					params: {
						active: data
					}
				});
				this.$parent.selectmenu('/TaskDetails/index');
			},
			look(type, item) {
				let obj = {
					1: () => {
						// 班前会
						this.GetRouterUrl('班前会')
						return
					},
					2: () => {
						// 安全检查
						this.GetRouterUrl('安全检查')
						return
					},
					3: () => {
						// 车辆巡检
						this.GetRouterUrl('车辆巡检')
						return
					},
					4: () => {
						// 教育培训
						this.GetRouterUrl('教育培训')
						return
					},
					5: () => {
						// 风险巡查
						this.GetRouterUrl('风险巡查')
						return
					},
					6: () => {
						// 设备保养
						this.GetRouterUrl('设备保养')
						return
					},
					7: () => {
						// 设备点检
						this.GetRouterUrl('设备点检')
						return
					},
					8: () => {
						// 每日一学
						this.GetRouterUrl('设备点检')
						return
					},
					9: () => {
						// 证件到期提醒
						if(!this.url.includes('/cert/expiration-reminder')){
							this.$message.error('当前账号没有任务详情页面权限,请联系管理员添加')
							return
						}else {
							this.$router.push('/cert/expiration-reminder')
							this.$parent.selectmenu('/cert/expiration-reminder');
							return
						}
					},
					10: () => {
						// 隐患整改
						this.GetRouterUrl('隐患整改')
						return
					},
					11: () => {
						// 知识竞赛
						this.$alert('请进入小程序参与知识竞赛', '提示');
						return
					},
					12: () => {
						// 防护用品领取
						this.$alert('请进入小程序领取防护用品', '提示');
						return
					},
					13: () => {
						this.$alert('请进入小程序查看事件快报', '提示');
						return
					},
					14: () => {
						this.$alert('请进入小程序查看作业标准书', '提示');
						return
					},
				}
				let fn = obj[type];
				if (fn) {
					fn();
				}
			},
			async getList() {
				let params = {
					...this.filters,
					// ...this.pages
				}
				this.loading = true;
				try {
					let res = await this.Post('/GetHHEnterpriseHome', params);
					if (res.status == 2000) {
						this.list = res.data.Plans
						this.PlanCounts = res.data.PlanCounts.filter(item => item.Type <= 12)
						this.pages.total = res.data.count;
					}
				} catch (error) {
					console.error(error)
				}
				this.loading = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		background: #fff;
	}

	/deep/.scrollbar .el-scrollbar__wrap {
		height: 60vh !important;
	}

	.box-scroll {
		height: 60vh !important;
		overflow: hidden;
		overflow-y: auto;

	}

	.box-scroll::-webkit-scrollbar {
		width: 5px;
		height: 5px;
		background-color: #F5F5F5;
	}

	.box-scroll::-webkit-scrollbar-track {
		// -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		// border-radius: 10px;
		// background-color: #F5F5F5;
	}

	.box-scroll::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
		background-color: #F5F5F5;
	}

	.custom-operation {
		border-radius: 10px;
		background: #fff;
	}

	.filter {
		border-bottom: 1px solid #F4F5F7;
		padding: 15px 34px 14px;

		&.f--s {
			align-items: start;
		}

		.label {
			margin-right: 16px;
			white-space: nowrap;
			line-height: 40px;
		}
	}
</style>