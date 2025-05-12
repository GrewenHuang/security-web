<template>
	<div class="page-layout">
		<div class="header" ref="header" v-if="$slots.header">
			<slot name="header" />
		</div>
		<div class="muilt-oeration" ref="muiltOperation" v-if="$slots.muiltOperation">
			<slot name="muiltOperation" />
		</div>
		<div class="export-operation" ref="export" v-if="$slots.export">
			<div class="export-operation-content">
				<slot name="export" />
			</div>
		</div>
		<div class="operation" ref="operation" v-if="$slots.operation">
			<div class="operation-content">
				<slot name="operation" />
			</div>
		</div>
		<div class="main" :style="{height: mainHeight, ...styleObj}" v-loading="loading"
			:element-loading-text="elementLoadingText">
			<el-scrollbar ref="mainScrollbar" class="main-scrollbar" :style="{height: scrollHeight}">
				<div style="padding-right: 10px;">
					<!-- padding-right: 10px; 为了不让 el-scrollbar 占了位置 -->
					<slot>

					</slot>
				</div>
			</el-scrollbar>
			<div class="pagation" ref="pagation" v-if="numShow">
				<div>
					<slot name="NumSelection"></slot>
				</div>
			</div>
			<div class="pagation f-b-c" ref="pagation" v-if="pages">
				<div>
					<slot name="selection"></slot>
				</div>
				<slot name="pagation">
					<el-pagination layout="sizes, total, prev, pager, next" background @current-change="handleCurrentChange"
						:page-size="pages.rows" :total="pages.total" :current-page="pages.page"
						@size-change="handleSizeChange" :page-sizes="[10, 50, 100, 1000]"
						class="customPagination">
					</el-pagination>
				</slot>
			</div>
			<div class="main-footer" ref="mainFooter" v-if="$slots.footer">
				<slot name="footer"></slot>
			</div>
		</div>
		<div class="independent-layer" v-if="$slots.independentLayer">
			<slot name="independentLayer" />
		</div>
		<slot name="full"></slot>
	</div>
</template>

<script>
	export default {
		props: {
			pages: null,
			styleObj: {
				default () {
					return {
						padding: '15px 5px 15px 15px'
					}
				},
				type: Object
			},
			numShow: Boolean,
			loading: false,
			elementLoadingText: {
				default: '拼命加载中',
				type: String
			},
			updateWindow: Boolean
		},
		data() {
			return {
				flag: false
			}
		},
		mounted() {
			this.emitScrollHeight();
			this.flag = true;
			window.addEventListener('resize', () => {
				this.emitScrollHeight();
			})
		},
		computed: {
			mainHeight() {
				if (this.updateWindow) {
					console.log('update window size');
				}
				let operationHeight = 0;
				let height = '100%';
				if (this.flag) {
					let operation = this.$refs.operation;
					if (operation) {
						operationHeight = operation.offsetHeight;
					}
					let exportOperation = this.$refs.export;
					if (exportOperation) {
						operationHeight += exportOperation.offsetHeight;
					}
					let header = this.$refs.header;
					if (header) {
						operationHeight += header.offsetHeight;
					}
					let muiltOperation = this.$refs.muiltOperation;
					if (muiltOperation) {
						operationHeight += muiltOperation.offsetHeight;
					}
				}
				return `calc(${height} - ${operationHeight}px)`;
			},
			scrollHeight() {
				if (this.updateWindow) {
					console.log('update window size');
				}
				let height = 0;
				if (this.flag) {
					let pagation = this.$refs.pagation;
					if (pagation) {
						height += pagation.offsetHeight;
					}
					let footer = this.$refs.mainFooter;
					if (footer) {
						height += footer.offsetHeight;
					}
				}
				return `calc(100% - ${height}px)`
			},
		},
		methods: {
			handleSizeChange(val) {
				this.pages.rows = val;
				this.handleCurrentChange(1);
			},
			handleCurrentChange(val) {
				this.scrollToTop();
				this.$emit('current-change', val)
			},
			scrollToTop() {
				this.$nextTick(() => {
					this.$refs.mainScrollbar.wrap.scrollTop = 0;
				});
			},
			emitScrollHeight() {
				this.$nextTick(() => {
					if (this.$refs.mainScrollbar) {
						this.$emit('scroll-height', this.$refs.mainScrollbar.$el.offsetHeight || 200);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-layout {
		position: relative;
		height: 100%;

		.export-operation {
			position: relative;
			padding-top: 45px;

			.export-operation-content {
				position: absolute;
				top: -6px;
				right: 0;
				bottom: 0;
				left: 0;
			}
		}

		.muilt-oeration {
			padding-bottom: 15px;
		}

		.operation {
			padding-bottom: 20px;

			.operation-content {
				padding: 15px;
				border-radius: 10px;
				height: 70px;
				background: #fff;

				>* {
					height: 100%;
				}
			}

			/deep/ .el-input,
			/deep/ .el-select {
				width: 180px;
			}

			.input-content {
				display: flex;

				>*:not(:first-child) {
					margin-left: 10px;
				}
			}
		}

		.main {
			border-radius: 10px;
			background: #fff;

			.main-scrollbar {
				/deep/ .el-scrollbar__wrap {
					overflow-x: hidden;
				}
			}

			/deep/ .table-operation {
				>*:not(:first-child) {
					margin-left: 20px;
				}
			}
		}

		.independent-layer {
			position: absolute;
			border-radius: 10px;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 99;
			background: #fff;
			box-sizing: border-box;
		}
	}

	/deep/ [text-plain] {
		color: #959595;
	}

	/deep/ .el-button:not(.el-button--text) {
		padding: 12px 17px;
	}

	/deep/ .pagation {
		padding: 23px 40px 8px;

		.customPagination {
			justify-content: flex-end;
			padding: 0;
		}

		.btn-prev,
		.btn-next {
			border-radius: 4px;
			margin: 0;
			width: 30px;
			height: 30px;
			background: #f6f6f6;
			line-height: 30px;
		}

		.btn-prev {
			margin-right: 6px;
		}

		.btn-next {
			margin-left: 6px;
		}

		.el-pager {
			.number {
				margin: 0 6px;
				border-radius: 4px;
				width: 30px;
				height: 30px;
				background: #f6f6f6;
				line-height: 30px;
			}
		}

		.el-pagination__total {
			margin-right: 39px;
			color: #81899e;
		}
	}

	/deep/ .el-table__header-wrapper {
		border-radius: 10px;
		overflow: hidden;

		.el-table__cell {
			border-bottom: 0 !important;
		}
	}

	/deep/ .el-table__fixed-header-wrapper {
		border-radius: 10px;
		overflow: hidden;
	}
</style>