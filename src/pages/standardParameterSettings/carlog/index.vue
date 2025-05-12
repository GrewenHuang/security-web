<template>
	<page-layout ref="pageLayout" @scroll-height="getScrollHeight" :loading="loading" :pages="pages"
		@current-change="handleCurrentChange">
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input placeholder="模板名称" clearable v-model="filters.LogbookConfigName"></el-input>
				<el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
			</div>
			<div class="f--d">
				<el-button type="primary" @click="add()" v-if="$_has('XCRZMBBtnAdd')">新增</el-button>
			</div>
		</div>
		<el-table :data="list" :header-cell-style="$tableStyle" style="width: 100%">
			<el-table-column label="序号" type="index" align="center" header-align="center" width="50">
			</el-table-column>
			<el-table-column label="行车日志模板名称" align="center" prop="LogbookConfigName" :show-overflow-tooltip="true" width="150">
			</el-table-column>
			<el-table-column label="整车照片设置" align="center" header-align="center" :show-overflow-tooltip="true" width="150">
				<template slot-scope="scope">
					<span>{{`${'强制上传'}${scope.row.SetUploadFileModel.IsPicUpload == 1? '[开启]' : '[关闭]'}`}}</span>
					<span style="display: block;">{{`${'强制现场上传'}${scope.row.SetUploadFileModel.IsPicMustUpload == 1? '[开启]' : '[关闭]'}`}}</span>
				</template>
			</el-table-column>
			<el-table-column label="整车视频设置" align="center" header-align="center" :show-overflow-tooltip="true" width="150">
				<template slot-scope="scope">
					<span>{{`${'强制上传'}${scope.row.SetUploadFileModel.IsVideoUpload == 1? '[开启]' : '[关闭]'}`}}</span>
					<span style="display: block;">{{`${'强制现场上传'}${scope.row.SetUploadFileModel.IsVideoMustUpload == 1? '[开启]' : '[关闭]'}`}}</span>
				</template>
			</el-table-column>
			<el-table-column label="出车前检查项" align="center" header-align="center" prop="PreTripInspectionItemList" :show-overflow-tooltip="true" width="180">
				<template slot-scope="scope" v-if="scope.row.PreTripInspectionItemList && scope.row.PreTripInspectionItemList.length > 0">
					{{ scope.row.PreTripInspectionItemList.map(item => item.ItemName).join(',') }}
				</template>
			</el-table-column>
			<el-table-column label="行车中检查项" align="center" header-align="center" prop="InTrainInspectionItemList" :show-overflow-tooltip="true" width="180">
				<template slot-scope="scope" v-if="scope.row.InTrainInspectionItemList && scope.row.InTrainInspectionItemList.length > 0">
					{{ scope.row.InTrainInspectionItemList.map(item => item.ItemName).join(',') }}
				</template>
			</el-table-column>
			<el-table-column label="收车后检查项" align="center" header-align="center" prop="PostTripInspectionItemList" :show-overflow-tooltip="true" width="180">
				<template slot-scope="scope" v-if="scope.row.PostTripInspectionItemList && scope.row.PostTripInspectionItemList.length > 0">
					{{ scope.row.PostTripInspectionItemList.map(item => item.ItemName).join(',') }}
				</template>
			</el-table-column>
			<el-table-column label="更新人" align="center" header-align="center" prop="UpdateByName">
			</el-table-column>
			<el-table-column label="更新时间" align="center" header-align="center" prop="UpdateTimeDesc" width="120" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="240" fixed="right">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="edit(scope.row,1)" v-if="$_has('XCRZMBBtnEdit')">编辑</el-button>
						<el-button type="text" @click="edit(scope.row,2)" v-if="$_has('XCRZMBBtnLook')">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<form-view  ref="formView" @success="getList" v-if="enterpriseData"/>
	</page-layout>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	import formView from './form';
	const defaultConfig = {
		LogbookConfigName: "",
		PreTripInspectionItemList: [],
		InTrainInspectionItemList: [],
		PostTripInspectionItemList: [],
		SetSignModel: {
			IsDriverSign: 0,
			IsSuperCargoSign: 0
		},
		SetUploadFileModel: {
			IsSuperCargo: 0,
			IsVideoUpload: 0,
			IsPicUpload: 0,
			IsVideoMustUpload: 0,
			IsPicMustUpload: 0
		},
		Status: 1,
	};
	let josnFields = ['PreTripInspectionItems', 'InTrainInspectionItems', 'PostTripInspectionItems'];

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	export default {
		components: {
			formView
		},
		mixins: [request_mixins],
		data() {
			return {
				loading: false,
				submitLoading: false,
				minHeight: 0,
				superData: null,
				enterpriseData: null,
				originEnterpriseData: null,
				list: [],
				pages: {
					rows: 10,
					page: 1,
					total: 0
				},
				filters: {}
			}
		},
		created() {
			// this.getSubLogbookConfig();
			// this.getLogbookConfig();
			this.handleCurrentChange(1)
		},
		methods: {
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			getList() {
				this.loading = true;
				let params = {
					...this.pages,
				}
				this.Post("/GetLogbookConfigList", params)
					.then((res) => {
						if (res.status == 2000) {
							this.list = res.data.list;
							this.pages.total = res.data.count;
							this.getLogbookConfig()
						}
					})
					.finally(() => {
						this.loading = false;
					});
			},
			getScrollHeight(height) {
				this.minHeight = height - 24;
			},
			edit(row,Status){
				let rows =  {
					LogbookConfigId: row.LogbookConfigId,
					LogbookConfigName: row.LogbookConfigName,
					PreTripInspectionItemList: row.PreTripInspectionItemList,
					InTrainInspectionItemList: row.InTrainInspectionItemList,
					PostTripInspectionItemList: row.PostTripInspectionItemList,
					SetSignModel: row.SetSignModel,
					SetUploadFileModel: row.SetUploadFileModel
				}
				row.Status = Status
				this.enterpriseData = rows
				this.$nextTick(() => {
					this.$refs.formView.show(row);
				})
			},
			async handleSwitch(key, $event) {
				if (this[key]) {
					this[key].Status = +!$event;
				}
			},
			async getSubLogbookConfig() {
				let res = await this.Get('/GetSupLogbookConfig');
				if (res.data) {
					josnFields.forEach(key => {
						res.data[key] = JSON.parse(res.data[key]);
					})
				}
				this.superData = res.data;
			},
			async getLogbookConfig() {
				let res = await this.Get('/GetLogbookConfig');
				if (res.data) {
					josnFields.forEach(key => {
						res.data[key] = JSON.parse(res.data[key]);
					})
				}
				this.originEnterpriseData = _extends(res.data);
				this.enterpriseData = res.data;
			},
			add() {
				this.enterpriseData = _extends(defaultConfig)
				this.enterpriseData.Status = 1
				this.$nextTick(() => {
					this.$refs.formView.show(this.enterpriseData);
				})
			},
			async save() {
				if (this.enterpriseData) {
					this.$refs.formView.$refs.formRef.validate(async valid => {
						if (valid) {
							this.submitLoading = true;
							let params = {
								...this.enterpriseData,
							}
							josnFields.forEach(key => {
								params[key] = JSON.stringify(params[key]);
							});
							try {
								let res = await this.Post('/SaveLogbookConfig', params);
								if (res.status == 2000) {
									this.$message.success('保存成功');
									this.enterpriseData.LogbookConfigId = res.data.LogbookConfigId;
									josnFields.forEach(key => {
										res.data[key] = JSON.parse(res.data[key]);
									})
									this.originEnterpriseData = res.data;
								}
							} catch (error) {

							}
							this.submitLoading = false;
						}
					})
				}
			},
			resetData() {
				this.enterpriseData = this.originEnterpriseData ? _extends(this.originEnterpriseData) : null;
			},
			copy() {
				this.enterpriseData = _extends(this.superData);
				delete this.enterpriseData.LogbookConfigId;
				if (this.originEnterpriseData) {
					this.enterpriseData.LogbookConfigId = this.originEnterpriseData.LogbookConfigId;
				}
				this.enterpriseData.Status = 1;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin-top: 8px;
		display: flex;
		height: 100%;
		color: #1C1D2F;
		font-size: 14px;

		.item {
			flex: 1;
			border-radius: 10px;
			border: 1px solid #E1E1E1;
			overflow: hidden;

			&:first-child {
				margin-right: 18px;
			}

			.title {
				padding: 19px 25px;
				background: #F8F8F8;
				font-size: 18px;
				font-weight: 600;

				.el-switch {
					margin-left: 20px;
					font-size: 14px;
				}
			}

			.other-opertion {
				font-size: 14px;
				font-weight: 400;
				cursor: pointer;

				i {
					margin-right: 5px;
				}
			}
		}
	}
</style>