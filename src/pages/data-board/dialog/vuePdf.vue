<template>
	<div class="pdf-preview-out" v-loading="boxLoading">
		<!-- 上部 外层容器 用于滚动-->
		<div class="scroll-box">
			<!-- 用于截取调缩放后的空白区域 -->
			<div class="pdf-box">
				<!-- pdf预览区域(会被缩放) -->
				<div :style="getPdfSize()" class="pdf-scale-box">
					<!-- <div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <pdf
              :src="url"
              class="pdf-preview"
              :page="currentPage"
              @num-pages="getTotalPage"
              @page-loaded="pageLoaded"
              @loaded="mountedLoaded"
            >
            </pdf>
          </div>
          <div class="bottom-tools">
            <div class="page">
              <div>共 {{ pageTotal }} 页 当前第 {{ currentPage }} 页</div>
            </div>

            <div class="scale">
              <el-button
                type="primary"
                icon="el-icon-minus"
                :disabled="pageScale - 0.1 < 0.8"
                @click="scalePage"
              >
                缩小
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-plus"	
                :disabled="pageScale + 0.1 > 1"
                @click="scalePage('+')"
              >
                放大</el-button
              >
            </div> -->
				</div>
				<el-carousel :autoplay="isAutoPlay" :interval="8000" type="card" @change="onChange"
					:initialIndex="indexInfo">
					<el-carousel-item v-for="(item, index) in numPages" :key="index" class="pdf-preview">
						<pdf @loaded="mountedLoaded" :key="index + 1" :src="src" :page="index + 1" class="pdf-preview">
						</pdf>
					</el-carousel-item>
				</el-carousel>
			</div>
		</div>
	</div>
	</div>
</template>

<script>
// 插件引入
import pdf from "vue-pdf";

export default {
	components: {
		pdf,
	},
	props: {
		// pdf预览的地址 由父组件中传入 也可在本组件中直接赋值
		url: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			isAutoPlay: true,
			// 总页数
			pageTotal: 0,
			// 当前页
			currentPage: 1,
			// 缩放比例
			pageScale: 0.85,
			// 遮罩
			boxLoading: true,
			pageChangeTimer: null,
			src: "",
			numPages: undefined,
			indexInfo: 0
		};
	},
	watch: {
		url: {
			deep: true, //true为进行深度监听,false为不进行深度监听
			handler(newVal) {
				this.currentPage = 1;
				this.indexInfo = 0
				this.src = ""
				this.src = pdf.createLoadingTask(this.url);
				this.$nextTick(() => {
					this.numPages = 0
					this.src.promise.then((pdf) => {
						this.numPages = pdf.numPages;
					});
				});
			},
		},
	},
	created() { },
	mounted() {
		this.src = pdf.createLoadingTask(this.url);
		this.$nextTick(() => {
			this.src.promise.then((pdf1) => {
				this.numPages = pdf1.numPages;
			});
		});
	},
	methods: {
		handleMouseEnter() {
			this.isAutoPlay = false;
		},
		handleMouseLeave() {
			this.isAutoPlay = true;
		},
		// 获取到pdf总页数时触发 会传入总页数
		getTotalPage(page) {
			this.pageTotal = page;
		},
		// 初始化加载完毕触发
		mountedLoaded() {
			// 去除遮罩
			this.boxLoading = false;
		},
		// 每加载完成一页时触发(初始化/翻页时均会触发)
		pageLoaded() {
			// 重新设置pdf预览区域容器外容器的尺寸
			this.setPdfBoxSize();
		},
		// 设置pdf预览区域容器的缩放尺寸
		getPdfSize() {
			return {
				transform: `scale(${this.pageScale})`,
			};
		},
		// 点击缩放时触发
		scalePage(type) {
			// 改变缩放比例
			let sacle = 0;
			if (type === "+") {
				sacle = this.pageScale + 0.1;
			} else {
				sacle = this.pageScale - 0.1;
			}
			// 可能会涉及js的精度损失 保留一位小数即可
			this.pageScale = Number(sacle.toFixed(1));
			// 缩放后pdf预览区域容器中会有留白 重新设置pdf预览区域容器外容器的尺寸
			this.setPdfBoxSize();
		},
		onChange(index) {
			// this.currentPage = index
			this.chengPage("+", index);
		},
		// 方法 翻页
		chengPage(type, index) {
			// 防抖 0.5秒内不再次触发时执行
			if (this.pageChangeTimer) {
				clearTimeout(this.pageChangeTimer);
			}
			// 执行翻页
			this.pageChangeTimer = setTimeout(() => {
				if (type === "+") {
					this.currentPage = index + 1;
				} else {
					this.currentPage -= 1;
				}
				// 翻页后将滚动条归位到顶部
				this.scrollbarReset();
				this.pageChangeTimer = null;
			}, 500);
		},
		// 方法 滚动条归位到顶部
		scrollbarReset() {
			let boxDom = document.querySelector(".scroll-box");
			boxDom.scrollTop = 0;
		},
		// 方法 设置pdf预览区域容器外容器的尺寸
		setPdfBoxSize() {
			// 缩放后 pdf的显示上会缩小 但元素的实际占地尺寸不会变化(仍是原尺寸) 导致可能会出现部分区域留白 通过改变pdf预览区域容器外容器的尺寸 来将留白区域hidden
			// 获取pdf的原尺寸
			let boxDom = document.querySelector(".pdf-scale-box");
			// 获取要设置尺寸的元素dom
			let setDom = document.querySelector(".pdf-box");
			// 如有缩放 高度根据缩放比例变化(48px是预留的上下外边距)
			if (this.pageScale !== 1 && boxDom && setDom) {
				setDom.style.height = `${boxDom.clientHeight * this.pageScale + 48}px`;
			} else {
				setDom.style.height = "";
			}
		},
	},
};
</script>

<style lang="less" scoped>
/deep/.el-carousel__container {
	// height: 100% !important;
	min-height: calc(100vh - 190px) !important;
}

.pdf-preview-out {
	// 高度为占满父组件中的外层容器(若不需要在父组件中设置高度 也可以在本组件中直接设置为所需值)
	height: 100%;

	// border: 1px solid #909;
	&,
	div {
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}

	// 滚动容器
	.scroll-box {
		// 高度按比例 溢出滚动
		height: calc(100% - 150px);
		overflow: auto;
		// border: 2px solid #c0d8f3;
		border-bottom: none;
		border-radius: 6px;

		// background-color: #eeeeee;
		// 滚动条样式
		&::-webkit-scrollbar {
			width: 10px;
		}

		&::-webkit-scrollbar-thumb {
			background-color: #c0d8f3;
			border-radius: 6px;
		}

		&::-webkit-scrollbar-track {
			background-color: transparent;
			border-radius: 6px;
		}

		// 用于缩放后截取掉不需要的空白的容器
		.pdf-box {
			min-height: calc(100vh - 150px) !important;
			overflow: hidden;
			//   padding: 24px;
			// border: 1px solid rgb(165, 11, 236);
		}

		// pdf预览区容器
		.pdf-scale-box {
			box-shadow: 0px 0px 20px 5px #666565;
			// border: 2px solid #090;
			// 设置缩放的中心点
			transform-origin: center top;
			transition: 0.2s;
		}
	}

	.bottom-tools {
		margin: 10px 0;
		height: 50px;
		line-height: 50px;
		background-color: #c0d8f3;
		border: 1px solid #5caaf8;
		border-radius: 6px;
		display: flex;
		padding: 0px 24px;

		.page {
			color: #636a70;
			flex-grow: 1;

			// border: 1px solid #909;
			span {
				margin-right: 20px;
			}
		}

		.scale {
			// border: 1px solid #909;
			text-align: right;
		}
	}
}

/deep/.pdf-preview {
	height: calc(100vh - 200px) !important;

}

/deep/.pdf-preview canvas {
	//提高指定样式规则的应用优先权（优先级）
	//   width: 500px !important;
	// height: 100% !important;
	margin-top: 5%;
	height: calc(100vh - 200px) !important;
}

/deep/.el-carousel__indicators--outside {
	// display: none;
}

.el-carousel__item {
	border: 1px solid #5caaf8;
	border-radius: 6px;
}

/deep/.el-carousel__indicators--outside button {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #409EFF !important;
}
</style>