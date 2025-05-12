<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="vehicleRouteInfo"
		width="1090px" top="8vh" v-loading="loading">
		<div class="tips">设置 “{{ positionName }}” 岗位可操作的菜单权限</div>
		<div class="f-b-c">
			<div class="card w50 gutter">
				<div class="card-title">web端功能</div>
				<el-scrollbar class="scrollbar" ref="scrollbar">
					<div class="menus-list">
						<el-tree :check-strictly="checkStrictly" ref="menuTree" default-expand-all show-checkbox
							node-key="MenuId" :default-checked-keys="currentSelected" :data="menus" :props="{
                                label: 'MenuName',
                                children: 'SubMenus',
                            }" @check="checkChange">
						</el-tree>
					</div>
				</el-scrollbar>
			</div>
			<div class="card w50">
				<div class="card-title">小程序端功能</div>
				<el-scrollbar class="scrollbar">
					<div class="menus-list">
						<el-tree :check-strictly="checkStrictly" ref="appMenuTree" default-expand-all show-checkbox
							node-key="MenuId" :default-checked-keys="appCurrentSelected" :data="appMenus" :props="{
                                label: 'MenuName',
                                children: 'SubMenus',
                            }" @check="checkAppChange">
						</el-tree>
					</div>
				</el-scrollbar>
			</div>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" :loading="submitLoading" @click="save()" slot="reference">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin'

	function getIds(arr) {
		let list = [];
		arr.forEach(item => {
			if (item.IsSelect == 1) {
				list.push(item.MenuId);
			}
			if (item.SubMenus && !!item.SubMenus.length) {
				list.push(...getIds(item.SubMenus));
			}
		})
		return list;
	}
	export default {
		name: 'position-auth',
		mixins: [request_mixin],
		data() {
			return {
				checkStrictly: false,
				id: '',
				positionName: '',
				dislogShow: false,
				submitLoading: false,
				rules: {},
				menus: [],
				currentSelected: [],
				appMenus: [],
				appCurrentSelected: [],
				loading: false,
			}
		},
		computed: {
			isEdit() {
				return !!this.id
			},
			title() {
				return '菜单权限分配'
			}
		},
		methods: {
			async show(item) {
				this.dislogShow = true;
				if (item) {
					this.id = item.PositionId;
					this.positionName = item.Name;
					await this.getMenus();
				} else {
					this.$message.error('未获取到岗位信息');
					this.close();
				}
			},
			close() {
				this.dislogShow = false;
				this.submitLoading = false;
				this.id = '';
			},
			checkChange(nodes, nodeKeys) {
				this.currentSelected = getIds(nodeKeys.checkedKeys)
			},
			checkAppChange(nodes, nodeKeys) {
				this.appCurrentSelected = getIds(nodeKeys.checkedKeys)
			},
			async save() {
				let menusParentArr = this.$refs.menuTree.getHalfCheckedKeys();
				let menusChildArr = this.$refs.menuTree.getCheckedKeys();
				
				let menus = [...(menusChildArr || []), ...(menusParentArr || [])]
				let appParentArr = this.$refs.appMenuTree.getHalfCheckedKeys();
				let appChildArr = this.$refs.appMenuTree.getCheckedNodes();
				let appMenus = [...(appParentArr || []), ...(appChildArr || [])]
				// let menus = this.$refs.menuTree.getCheckedNodes();
				// let appMenus = this.$refs.appMenuTree.getCheckedNodes();
				// if (!menus.length) {
				//     this.$message.error(`请选择“ ${this.positionName} ”岗位的可操作菜单权限`);
				//     return
				// }
				let params = {
					PositionId: this.id,
					// MenuIds: menus.map(item => item.MenuId),
					// AppMenuIds: appMenus.map(item => item.MenuId)
					MenuIds: menus,
					AppMenuIds: appMenus.map(item => item.MenuId)
				}
				this.submitLoading = true;
				try {
					let res = await this.Post('/SavePositionMenu', params);
					if (res.status == 2000) {
						this.$emit('success');
						this.$message.success('授权成功')
						this.close();
					} else {
						this.$message.error(res.message);
					}
				} catch (error) {

				}
				this.submitLoading = false;
			},
			isAllSelect(isSelect, list) {
				for (let i = 0; i < list.length; i++) {
					let item = list[i];
					if (item.SubMenus) {
						item.IsSelect = this.isAllSelect(item.IsSelect, item.SubMenus);
					}
					if (item.IsSelect === 0) {
						isSelect = 0;
						break;
					}
				}
				return isSelect;
			},
			structureMenu(list) {
				list.forEach(item => {
					if (item.SubMenus) {
						item.IsSelect = this.isAllSelect(item.IsSelect, item.SubMenus);
					}
				})
				return list;
			},
			async getMenus() {
				this.loading = true
				this.checkStrictly = true
				try {
					let res = await this.Get(`/GetPositionMenus?positionId=${this.id}`);
					if (res.status == 2000) {
						this.menus = res.data.MenuList
						// [
						//                    {
						//                        MenuId: -1,
						//                        MenuName: '全部',
						//                        SubMenus: this.structureMenu(res.data.MenuList)
						//                    }
						//                ];
						this.appMenus = res.data.AppMenuList
						// [
						//                    {
						//                        MenuId: -1,
						//                        MenuName: '全部',
						//                        SubMenus: this.structureMenu(res.data.AppMenuList)
						//                    }
						//                ];
						this.currentSelected = getIds(res.data.MenuList);
						this.appCurrentSelected = getIds(res.data.AppMenuList);
						this.checkStrictly = false
						this.$nextTick(() => {
							this.$refs.scrollbar.wrap.scrollTop = 0
						});
					} else {
						this.$message.error('未获取到菜单，请稍后重试')
						this.close();
					}
					this.loading = false
				} catch (error) {
					console.error(error);
				}
				return Promise.resolve(true)
			}
		},
		created() {}
	}
</script>

<style lang="scss" scoped>
	.vehicleRouteInfo {
		color: #181B3B;

		/deep/ .el-dialog__body {
			padding: 18px 30px 26px !important;
		}

		/deep/ .el-dialog {
			min-width: 1090px;
		}

		.tips {
			margin-bottom: 18px;
		}

		.w50 {
			width: 50%;
		}

		.gutter {
			margin-right: 20px;
		}

		.card {
			border: 1px solid #D5D5D5;
			border-radius: 4px;

			.card-title {
				padding: 11px 17px;
				border-bottom: 1px solid #D5D5D5;
			}

			.menus-list {
				padding: 26px 15px 0;
			}

			/deep/ .el-scrollbar__wrap {
				margin-bottom: 0 !important;
				height: 60vh;
			}

			/deep/ .el-tree-node__expand-icon {
				font-size: 16px;

				&:not(.is-leaf) {
					color: #181B3B;
				}
			}

			/deep/ .el-tree {
				.el-tree-node {
					position: relative;

					&::before {
						content: attr(style);
						position: absolute;
						top: 30px;
						left: 14px;
						bottom: 8px;
						border-left: 1px dashed #D5D5D5;
					}

					>.el-tree-node__children>.el-tree-node {
						&::before {
							left: 32px;
						}
					}
				}


			}
		}
	}
</style>