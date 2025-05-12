<template>
	<div class="chart" v-loading="loading">
		<div class="f-e-c" style="padding-right: 15px">
			<el-date-picker type="year" placeholder="选择年" align="center" prefix-icon="" :clearable="false"
				:editable="false" value-format="yyyy" v-model="filters.year" @change="getData" style="width: 120px">
			</el-date-picker>
			<el-button type="primary" @click="exportPDF" v-if="$_has('SJBBBtnExport')" style="margin-left: 10px">导出</el-button>
		</div>
		<div class="grid" ref="chart">
			<div class="card">
				<div class="title">事件等级统计</div>
				<div class="card-content">
					<pie :value="info.LevelProportions" :color="['#5292FF', '#FFC372','#7585E5', '#FE706E']" :loading="loading" />
				</div>
			</div>
			<div class="card">
				<div class="title">事件类型统计</div>
				<div class="card-content">
					<pie :value="info.TypeProportions"
						:color="['#33D0BD', '#5292FF', '#7585E5', '#FFC372','#FE706E']"
						:loading="loading" />
				</div>
			</div>
			<div class="card">
				<div class="title">事件责任统计</div>
				<div class="card-content">
					<pie :value="info.ResponseProportions" :color="['#FE706E', '#5292FF','#7585E5', '#FFC372','#FE706E']" :loading="loading" />
				</div>
			</div>
			<div class="card row-2">
				<div class="title">年度事件统计</div>
				<div class="card-content">
					<bar :value="info.ProductionAccidentYears" :color="['#5292FF', '#FE706E','#33D0BD']"
						:loading="loading" />
				</div>
			</div>
		</div>
		<preview ref="preview" disabled />
	</div>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import bar from '../components/bar';
	import pie from '../components/pie-1';
	import {
		Pdf
	} from '@/plugins/htmlToPdf';
	import preview from '@/pages/Education/trainTaskInfo'
	export default {
		components: {
			bar,
			pie,
			preview
		},
		mixins: [request_mixins],
		data() {
			return {
				loading: false,
				filters: {
					year: new Date().getFullYear() + ''
				},
				info: {
					MeetingYears: [],
					PreMeetingRate: [],
					SafetyMeetingRate: [],
					SafetyMeetingGroupRate: []
				},
			}
		},
		created() {
			this.getData();
		},
		methods: {
			exportPDF() {
				const loading = this.$loading({
					lock: true,
					text: '正在导出中，请稍等...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, .3)'
				});
				this.$nextTick(() => {
					Pdf.downPdf(this.$refs.chart, this.filters.year + '年事件统计').then(res => {
						setTimeout(() => {
							loading.close();
						}, 1000);
					});
				})
			},
			async getData() {
				this.loading = true;
				// let res = await this.Get(`/GetProductionAccidentReport?year=${this.filters.year}`);
				let res = await this.Get(`/GetReportEventReport?year=${this.filters.year}`);
				if (res.status == 2000) {
					res.data.ProductionAccidentYears = res.data.ProductionAccidentYears.map((item, index) => {
						return {
							name: item.Name,
							value: item.Count,
							type: index === 0 ? 'bar' : 'line'
						};
					})
					res.data.LevelProportions = (res.data.LevelProportions || []).map((item, index) => {
						return {
							name: item.Name,
							value: item.Count,
							rate: item.Rate
						};
					})
					res.data.ResponseProportions = (res.data.ResponseProportions || []).map((item, index) => {
						return {
							name: item.Name,
							value: item.Count,
							rate: item.Rate
						};
					})
					res.data.TypeProportions = (res.data.TypeProportions || []).map((item, index) => {
						return {
							name: item.Name,
							value: item.Count,
							rate: item.Rate
						};
					})
					this.info = res.data;
					this.loading = false;
				}
			},
			preview(item) {
				this.$refs.preview.show(item.TrainTaskId);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chart {
		height: 100%;
		background-color: #fff;
		position: relative;
		padding-top: 15px;
	}

	.custom-operation {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 5px;

		/deep/ .el-date-editor {
			margin-right: 5px;
			width: 120px;
		}
	}

	.card {
		border: 1px solid #EEEEEE;
		border-radius: 10px;
		min-height: 100%;

		.title {
			display: flex;
			align-items: center;
			border-bottom: 1px solid #EEEEEE;
			padding: 17px 18px 16px;
			font-size: 16px;
			font-weight: 600;

			&::before {
				content: '';
				margin-right: 9px;
				width: 6px;
				height: 15px;
				background: $__color-primary;
			}
		}

		.card-content {
			height: calc(100% - 55px);
		}
	}

	.grid {
		display: grid;
		grid-gap: 20px;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 300px auto;
		border-radius: 10px;
		padding: 15px;
		background: #fff;
		min-height: calc(100% - 50px);
	}

	.row-2 {
		grid-column-start: 1;
		grid-column-end: 4;
	}

	.no-data {
		padding-top: 50px;
		text-align: center;
		color: #999;
	}

	.content {
		padding: 13px 16px;
		min-height: 200px;

		.custom-table {
			border-top: 1px solid #eee;
			border-left: 1px solid #eee;
			height: 100%;

			.header {
				background: #f8f8f8;
			}

			.item {
				display: grid;
				grid-template-columns: 70px 180px 1fr 130px 130px 130px 110px;
				align-items: center;
				text-align: center;

				>div {
					border-right: 1px solid #eee;
					border-bottom: 1px solid #eee;
					padding: 15px;

					.el-button {
						padding: 0;
					}
				}
			}
		}
	}
</style>