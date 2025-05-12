<template>
	<div id="app">
		<keep-alive>
			<router-view :key="key"></router-view>
		</keep-alive>
	</div>
</template>

<script>
	import themeMixin from './mixins/theme-mixin';
	export default {
		name: "app",
		mixins: [themeMixin],
		computed: {
			key() {
				let list = ['车辆统计','人员统计','培训统计','证件信息报表','设备设施报表','风险报表','隐患报表','事件统计']
				if (list.includes(this.$route.name)) {
					return this.$route.name + Math.random()
				} else {
					return this.$route.name
				}
			}
		}
	};
</script>

<style>
	html,
	body {
		height: 100%;
	}

	body {
		padding: 0;
		margin: 0 auto;
	}

	a {
		text-decoration: none;
	}

	.scrollbar .el-scrollbar__wrap {
		overflow-x: hidden;
		height: 70vh;
	}

	.el-dialog__body .scrollbar .el-scrollbar__wrap {
		height: 60vh;
	}

	.el-collapse-item__content {
		padding-bottom: 0 !important;
	}

	.el-collapse-item__wrap {
		border-bottom: none !important;
	}

	#app {
		height: 100%;
		overflow: hidden;
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: left;
		color: #181B3B;
	}

	.body {
		height: 100%;
		background: #f5f5f5;
		padding: 30px;
		border-radius: 8px;
		overflow-y: auto;
	}

	.body-title {
		line-height: 50px;
		margin-bottom: 30px;
		position: relative;
	}

	.body-title::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		background: #99999920;
		height: 2px;
		width: 100%;
	}

	.bg-color {
		background: #f5f5f5;
	}

	.bg-white {
		background: white;
	}

	.color-blue {
		color: #409eff;
	}

	.color-red {
		color: red;
	}

	/* flex布局 */
	.f {
		display: flex;
	}

	.f1 {
		flex: 1;
	}

	.f-c {
		display: flex;
		justify-content: center;
	}

	.f-b {
		display: flex;
		justify-content: space-between;
	}

	.f-b-c {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.f-a {
		display: flex;
		justify-content: space-around;
	}

	.f-a-c {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.f-e {
		display: flex;
		justify-content: flex-end;
	}

	.f-e-c {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.f--c {
		display: flex;
		align-items: center;
	}

	.f-c-c {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.f-c-b {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.f--e {
		display: flex;
		align-items: flex-start;
	}

	.f--b {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.fw-n {
		flex-wrap: nowrap;
	}

	.fw-w {
		flex-wrap: wrap;
	}

	.fd-c {
		flex-direction: column;
	}

	/* 单行文本超出省略号 */
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* 多行文本超出省略号 */
	.ellipsis2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.mb10 {
		margin-bottom: 10px;
	}

	.mb20 {
		margin-bottom: 20px;
	}

	.mb30 {
		margin-bottom: 30px;
	}

	.mr10 {
		margin-right: 10px;
	}

	.mr20 {
		margin-right: 20px;
	}

	.mr30 {
		margin-right: 30px;
	}

	.pr10 {
		padding-right: 10px;
	}

	.pr20 {
		padding-right: 20px;
	}

	.pr30 {
		padding-right: 30px;
	}

	.p10 {
		padding: 10px;
	}

	.p20 {
		padding: 20px;
	}

	.p30 {
		padding: 30px;
	}

	.pb50 {
		padding-bottom: 50px;
	}

	.cursor-p {
		cursor: pointer;
	}

	/*解决 element ui drawer组件不显示下拉条bug*/
	.el-drawer__body {
		overflow: auto;
		/* overflow-x: auto; */
	}

	.el-cascader-panel .el-radio {
		z-index: 10;
		width: 99%;
		height: 99%;
		position: absolute;
		top: 10px;
		right: -12px;
	}

	.el-cascader-panel .el-radio__input {
		visibility: hidden;
	}

	.el-cascader-panel .el-cascader-node__postfix {
		top: 10px;
	}

	/* .el-input-group__prepend {
  width: 130px !important;
} */
	.quill-editor {
		line-height: initial !important;
	}

	.el-message {
		max-height: 100%;
	}

	.no-data-large {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.no-data-large img {
		margin-top: 50%;
	}

	.no-data-large div {
		margin-top: 5px;
		color: #fff;
		font-size: 28px
	}
</style>