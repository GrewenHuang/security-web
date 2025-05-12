<template>
	<div class="tab-container">
		<div class="tab-header-wrapper">
			<div class="tab-scroll-buttons left-button" @click="scrollTabs('left')">
				<span>
					<i class="el-icon-arrow-left"></i>
				</span>
			</div>
			<div class="tab-header" ref="tabHeader">
				<div class="tab-items" :style="{ transform: `translateX(-${scrollOffset}px)` }">
					<!-- 渲染选项卡头部 -->
					<div slot="header" class="header f-b-c">
						<div class="f-s-w f-b-c">
							<div class="f-h-b" v-for="(tab, index) in PlanCounts" :key="index"
								@click="changeTab(tab.Type,index)" ref="tabItems" :class="{active1: isSelect == tab.Type}">
								<span>{{tab.count}}</span>
								<p :class="{active2:tab.count > 0}">{{tab.TypeDesc}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-scroll-buttons right-button" @click="scrollTabs('right')">
				<span>
					<i class="el-icon-arrow-right"></i>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			PlanCounts: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				activeTab: '', // 当前选中的选项卡ID
				tabs: [], // 选项卡列表
				scrollOffset: 0, // 滚动偏移量
				containerWidth: 500, // 父元素宽度
				isSelect: 0,
				ceshi: []
			};
		},

		computed: {
			shouldShowLeftButton() {
				return true;
			},
			shouldShowRightButton() {
				const tabHeader = this.$refs.tabHeader;
				if (tabHeader) {
					const tabsWidth = tabHeader.scrollWidth;
					const containerWidth = this.containerWidth;
					return tabsWidth > containerWidth && this.scrollOffset < tabsWidth - containerWidth;
				}
				return true;
			},
		},
		methods: {
			changeTab(tabId, index) {
				this.activeTab = tabId;
				if (this.isSelect == tabId) {
					this.isSelect = -100
					this.activeTab = 0
				} else {
					this.isSelect = tabId;
				}
				this.$emit("change", this.activeTab);

				this.$nextTick(() => {
					const tabItems = this.$refs.tabItems;
					const activeTabElement = tabItems[index];
					if (activeTabElement) {
						const tabHeader = this.$refs.tabHeader;
						const containerWidth = this.containerWidth;
						const activeTabOffsetLeft = activeTabElement.offsetLeft;
						const activeTabOffsetRight = activeTabOffsetLeft + activeTabElement.offsetWidth;

						if (activeTabOffsetLeft < this.scrollOffset) {
							this.scrollOffset = activeTabOffsetLeft;
						} else if (activeTabOffsetRight > this.scrollOffset + containerWidth) {
							this.scrollOffset = activeTabOffsetRight - containerWidth;
						} else if (activeTabOffsetRight > this.scrollOffset + containerWidth - activeTabElement
							.offsetWidth) {
							this.scrollOffset = activeTabOffsetRight - (containerWidth - activeTabElement
								.offsetWidth);
						}
					}
				});
			},


			scrollTabs(direction) {
				const tabHeader = this.$refs.tabHeader;
				if (tabHeader) {
					const tabsWidth = tabHeader.scrollWidth;
					const containerWidth = this.containerWidth;
					// const maxOffset = tabsWidth - containerWidth;
					 const maxOffset = 300;
					if (direction === 'left') {
						this.scrollOffset = Math.max(this.scrollOffset - containerWidth, 0);
					} else if (direction === 'right') {
						if (this.scrollOffset < maxOffset) {
							const remainingWidth = tabsWidth - (this.scrollOffset + containerWidth) + 100;
							this.scrollOffset = Math.min(this.scrollOffset + containerWidth, maxOffset + remainingWidth);
						} else {
							// this.scrollOffset = Math.min(this.scrollOffset + containerWidth, tabsWidth - containerWidth);
							this.scrollOffset = Math.min(this.scrollOffset + containerWidth, 300)
						}
					}
				}
			},

		},
		mounted() {
			// 初始化选项卡
			// this.tabs = [{
			// 		id: 1,
			// 		num: 1,
			// 		name: '教育培训',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 2,
			// 		num: 2,
			// 		name: '安全例会',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 3,
			// 		num: 3,
			// 		name: '隐患排查',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 4,
			// 		num: 4,
			// 		name: '教育培训',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 5,
			// 		num: 5,
			// 		name: '文件签字',
			// 		isDb: true
			// 	},
			// 	{
			// 		id: 6,
			// 		num: 6,
			// 		name: '每日一学',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 7,
			// 		num: 7,
			// 		name: '班前会',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 8,
			// 		num: 8,
			// 		name: '隐患整改',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 9,
			// 		num: 9,
			// 		name: '风险巡查',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 10,
			// 		num: 10,
			// 		name: '设备点检',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 11,
			// 		num: 10,
			// 		name: '1设备点检1',
			// 		isDb: false
			// 	},
			// 	{
			// 		id: 12,
			// 		num: 10,
			// 		name: '2设备点检2',
			// 		isDb: false
			// 	},
			// ];
			// // 默认选中第一个选项卡
			// this.activeTab = this.tabs[0].id;
			// 获取父元素宽度
			const container = document.querySelector('.tab-container');
			if (container) {
				this.containerWidth = container.offsetWidth;
			}
		},
	};
</script>

<style scoped>
	.tab-container {
		position: relative;
		overflow: hidden;
		width: 100%;
		background: #fff;
		box-sizing: border-box;
		border-bottom: 1px solid #F4F5F7;
	}

	.tab-header-wrapper {
		display: flex;
	}

	.tab-scroll-buttons {
		padding: 5px;
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.tab-scroll-buttons button {
		padding: 5px 10px;
	}

	.right-button,
	.left-button {
		width: 180px;
		text-align: center;
		margin: 0;
		box-sizing: border-box;

	}

	.right-button {
		border-left: 1px solid #eee;
	}

	.left-button {
		border-right: 1px solid #eee;
	}

	.left-button>span,
	.right-button>span {
		margin: 0 auto;
		display: inline-block;
		width: 28px;
		height: 28px;
		line-height: 26px;
		border: 1px solid black;
		text-align: center;
		border: 2px solid #DDDDDD;
		border-radius: 50%;
	}

	.tab-header {
		flex-grow: 1;
		overflow: hidden;
	}

	.tab-items {
		display: flex;

		transform: translateX(- {
					{
					scrollOffset
				}
			}

			px);
		transition: transform 0.3s;
	}

	.tab-item {
		padding: 10px 20px;
		cursor: pointer;
		border: 1px solid #ccc;
		background-color: #f5f5f5;
		display: inline-block;
		white-space: nowrap;
	}

	.tab-item.active {
		background-color: #fff;
		border-bottom: 1px solid #fff;
	}

	.tab-content {
		margin-top: 10px;
	}
</style>
<style lang="scss" scoped>
	.header {
		position: relative;
		height: 109px;
		background: #fff;

		.f-s-w {
			width: 100%;
			height: 100%;
			overflow: hidden;
			margin: auto;

			.f-h-b {
				height: 100%;
				width: 160px;
				min-width: 160px;
				padding-top: 20px;
				text-align: center;
				cursor: pointer;
				position: relative;

				.active2 {
					&::before {
						background: #FF0000;
					}
				}

				span {
					display: inline-block;
					width: 42px;
					height: 36px;
					line-height: 36px;
					font-size: 36px;
					font-weight: bold;
					color: #181B3B;
					opacity: 1;
				}

				p {
					// width: 64px;
					opacity: 1;
					font-size: 16px;
					font-weight: 600;
					color: #727381;
					position: relative;
					margin-top: 5px;

					&::before {
						position: absolute;
						left: 50%;
						bottom: -15px;
						content: '';
						width: 15px;
						height: 4px;
						background: #13CE66;
						border-radius: 10px 10px 10px 10px;
						transform: translate(-50%, -50%);
					}
				}
			}

			.active1 {
				background: rgba(241, 243, 247, 0.5);

				span {
					color: #FF0000;

				}

				p {
					color: #FF0000;

					&::before {
						background: none !important;
					}
				}

				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: 160px;
					height: 5px;
					background: #FF0000;
					border-radius: 10px 10px 10px 10px;
				}
			}
		}

	}
</style>