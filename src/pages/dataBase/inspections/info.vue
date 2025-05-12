<template>
	<el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info" width="65%"
		top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar ref="scrollbar" class="scrollbar">
			<div class="content">
				<div class="card-header f-b-c">
					<div class="title">检查记录项</div>
					<div>
						<el-button type="primary" plain size="mini" @click="addInspectionFields">新增</el-button>
					</div>
				</div>
				<div class="form-info">
					<!-- <div class="form-item">
                        <div class="label disabled">检查表编号</div>
                        <div class=" disabled"></div>
                        <div class="operation disabled">
                            <span>删除</span>
                        </div>
                    </div> -->
					<div class="form-item">
						<div class="label disabled">检查表名称</div>
						<div class="">
							<el-input placeholder="请输入" v-model="info.InspectionName"></el-input>
						</div>
						<div class="operation disabled">
							<span>删除</span>
						</div>
					</div>
					<!-- <div class="form-item">
                        <div class="label disabled">检查表类型</div>
                        <div class="">
                            <el-cascader
                                v-model="info.ClassificationLibraryId"
                                filterable
                                clearable
                                :options="labels"
                                :props="{ checkStrictly: true, value: 'ClassificationLibraryId', label: 'ClassificationName', children: 'Childs' }"
                            ></el-cascader>
                        </div>
                        <div class="operation disabled">
                            <span>删除</span>
                        </div>
                    </div> -->
					<div class="form-item" v-for="(item, index) in info.InspectionFields" :key="index">
						<div class="">
							<el-input placeholder="请输入自定义记录项名称" v-model="item.FieldName"></el-input>
						</div>
						<div class="">
							<el-radio-group v-model="item.FieldType">
								<el-radio-button label="1">人员</el-radio-button>
								<!-- <el-radio-button label="2" v-if="!isRoad">车辆</el-radio-button> -->
								<el-radio-button label="2">车辆</el-radio-button>
								<el-radio-button label="3">设备设施</el-radio-button>
								<el-radio-button label="4">文本</el-radio-button>
								<el-radio-button label="5">日期</el-radio-button>
								<el-radio-button label="6">仓库</el-radio-button>
								<!-- <el-radio-button label="7">企业</el-radio-button> -->
							</el-radio-group>
						</div>
						<div class="operation">
							<span @click="info.InspectionFields.splice(index, 1)">删除</span>
						</div>
					</div>
					<div class="form-item">
						<div class="label disabled">检查地址</div>
						<div class=" disabled"></div>
						<div class="operation disabled">
							<span>删除</span>
						</div>
					</div>
					<div class="form-item">
						<div class="label disabled">检查时间</div>
						<div class=" disabled"></div>
						<div class="operation disabled">
							<span>删除</span>
						</div>
					</div>
					<div class="form-item">
						<div class="label disabled">检查人</div>
						<div class=" disabled"></div>
						<div class="operation disabled">
							<span>删除</span>
						</div>
					</div>
				</div>
				<div class="split-line"></div>
				<div class="card-header f-b-c">
					<div class="title">检查表</div>
					<div>
						<el-button type="primary" plain size="mini" @click="chooseInspections">从检查表库获取</el-button>
						<el-button type="primary" plain size="mini" @click="choosePitfall">从隐患库获取</el-button>
						<el-button type="primary" plain size="mini" @click="add()">自建检查表</el-button>
					</div>
				</div>
				<div class="table">
					<template v-for="(item, index) in info.InspectionItems">
						<div :key="index">
							<div class="table-header f-b-c">
								<div class="title f--c">{{ index + 1 }}.<el-input placeholder="请输入"
										v-model="item.ItemName"></el-input></div>
								<div>
									<el-button type="primary" size="mini" @click="add(item.ItemName)">添加检查内容</el-button>
									<el-button type="danger" plain size="mini"
										@click="info.InspectionItems.splice(index, 1)">删除</el-button>
								</div>
							</div>
							<div class="table-item table-th">
								<div>序号</div>
								<div>检查内容</div>
								<div>检查依据</div>
								<div>整改建议</div>
								<div>隐患级别</div>
								<div>操作</div>
							</div>
							<div class="table-item" v-for="(o, i) in item.ItemContentList" :key="i">
								<div class="f-c-c">{{ i + 1 }}</div>
								<div class="f-c-c">
									<customEditor class="el-input" placeholder="请在这里输入" v-model="o.Describe"   :isTitle="false" />
									<!-- <el-input placeholder="请输入" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="o.Describe" /> -->
								</div>
								<div class="f-c-c">
									<customEditor class="el-input" placeholder="请输入" v-model="o.Basis"   :isTitle="false" />
									<!-- <el-input placeholder="请输入" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="o.Basis" /> -->
								</div>
								<div class="f-c-c">
									<customEditor class="el-input" placeholder="请输入" v-model="o.Suggestion"   :isTitle="false" />
									<!-- <el-input placeholder="请输入" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="o.Suggestion" /> -->
								</div>
								<div class="f-c-c">
									<el-select v-model="o.PotentialLevelCode">
										<el-option v-for="(item, index) in pitfallLevel" :key="index" :value="item.id"
											:label="item.text"></el-option>
									</el-select>
								</div>
								<div class="f-c-c">
									<el-button type="text" @click="removeChild(item, i, index)">删除</el-button>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</el-scrollbar>
		<choosePitfall ref="choosePitfall" @submit="choosePitfallSubmit" />
		<chooseInspections ref="chooseInspections" @submit="chooseInspectionsSubmit" />
		<add ref="add" @submit="addSubmit" />
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" :loading="submitLoading" @click="save()" slot="reference">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixin from '@/mixins/request-mixin';
	import choosePitfall from './choose-pitfall';
	import chooseInspections from './choose-inspections';
	import customEditor from '@/components/common/custom-editor.vue';
	import add from './add';
	import util from '@/common/util';
	const defaultInfo = {
		InspectionName: '', // 检查表名称
		ClassificationLibraryId: [], // 检查类型 id
		ClassificationName: '', // 检查类型 name
		InspectionItems: [], // 检查项目集合
		/**
		 * InspectionItemId (integer, optional): ID ,
		 * InspectionId (integer, optional): 检查表ID ,
		 * ItemName (string, optional): 检查项目名称 ,
		 * ItemContent (string, optional): 检查项目内容 ,
		 * Sort (integer, optional): 排序 ,
		 * ItemContentList (Array[InspectionItemContent], optional): 检查项目内容集合
		 */
		/**
		 * ItemContentList
		 * PotentialLevelCode (string, optional): 隐患级别 ,
		 * PotentialLevelName (string, optional): 隐患级别名称 ,
		 * Describe (string, optional): 隐患描述（检查内容） ,
		 * Basis (string, optional): 检查依据 ,
		 * Suggestion (string, optional): 整改建议 ,
		 * JudgmentCriteria (string, optional): 重大隐患判断标准
		 */
		InspectionFields: [], // 检查自定义字段
		/**
		 * FieldName (string, optional): 字段名称 ,
		 * FieldType (integer, optional): 字段类型 1人员 2车辆 3设备 4文本 5日期
		 */
	}

	function _extends(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	function getIdsById(list, id) {
		let ids = [id];
		while (true) {
			let parentId = getParentIdById(list, id);
			if (!parentId) break;
			ids.unshift(parentId);
			id = parentId;
		}
		return ids;
	}

	function getParentIdById(list, id) {
		let parentId = null;
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			if (id == item.ClassificationLibraryId) {
				parentId = item.ParentId;
				break;
			} else {
				if (item.Childs && !!item.Childs.length) {
					parentId = getParentIdById(item.Childs, id);
					if (parentId) break;
				}
			}
		}
		return parentId;
	}
	export default {
		props: {
			IsPrivate: {
				type: [Number, String],
				default: 0
			}
		},
		components: {
			choosePitfall,
			chooseInspections,
			add,
			customEditor
		},
		mixins: [request_mixin],
		data() {
			return {
				id: '',
				loading: false,
				dislogShow: false,
				submitLoading: false,
				info: _extends(defaultInfo),
				radio1: '1',
				labels: [],
				pitfallLevel: [],
				isRoad: util.getLoginUrl() == '/rb-login',
			}
		},
		computed: {
			isEdit() {
				return !!this.id
			},
			title() {
				return this.isEdit ? '编辑' : '新增'
			}
		},
		methods: {
			async show(item) {
				this.dislogShow = true;
				await this.getLabels();
				await this.getPitfallLevel();
				if (item) {
					this.loading = true;
					this.id = item.InspectionId;
					try {
						let res = await this.Get(`/GetInspection?inspectionId=${this.id}`)
						if (res.status == 2000) {
							this.info = Object.assign(_extends(defaultInfo), res.data);
							this.info.ClassificationLibraryId = getIdsById(this.labels, this.info
								.ClassificationLibraryId);
						} else {
							this.$message.error('获取数据失败');
							this.close();
						}
					} catch (error) {
						console.error(error);
					}
					this.loading = false;
				}
				this.$nextTick(() => {
					this.$refs.scrollbar.wrap.scrollTop = 0;
				})
			},
			close() {
				this.dislogShow = false;
				this.submitLoading = false;
				this.id = '';
				this.info = _extends(defaultInfo);
			},
			checkField() {
				let fields = {
					'InspectionName': '请输入检查表名称',
					// 'ClassificationLibraryId': '请选择检查表类型',
					'InspectionItems': '请添加检查表'
				};
				for (let key in fields) {
					let item = this.info[key];
					let message = fields[key];
					if (!item || !item.length) {
						this.$message.error(message);
						return false;
					}
				}
				for (let i = 0; i < this.info.InspectionFields.length; i++) {
					let item = this.info.InspectionFields[i];
					if (!item.FieldName) {
						this.$message.error('请输入自定义记录项名称');
						return false;
					}
				}
				for (let i = 0; i < this.info.InspectionItems.length; i++) {
					let item = this.info.InspectionItems[i];
					if (!item.ItemName) {
						this.$message.error(`请输入第${i + 1}的检查项名称`);
						return false;
					}
					for (let j = 0; j < item.ItemContentList.length; j++) {
						let obj = item.ItemContentList[j];
						if (!obj.Describe) {
							this.$message.error(`请输入第${i + 1}.${item.ItemName}检查项的检查内容`);
							return false;
						}
						if (!obj.Suggestion) {
							this.$message.error(`请输入第${i + 1}.${item.ItemName}检查项的整改意见`);
							return false;
						}
					}
				}
				return true;
			},
			async save() {
				if (!this.checkField()) return;
				this.submitLoading = true;
				try {
					let params = {
						QueryScope: 2,
						IsPrivate: this.IsPrivate,
						...this.info
					}
					params.ClassificationLibraryId = params.ClassificationLibraryId[params.ClassificationLibraryId
						.length - 1] || '';
					let res = await this.Post('/SaveInspection', params)
					if (res.status == 2000) {
						this.$message.success('保存成功')
						this.$emit('load');
						this.close();
					} else {
						this.$message.error(res.message);
					}
				} catch (error) {
					console.error(error);
				}
				this.submitLoading = false;
			},
			async getLabels() {
				let res = await this.Post('/GetClassificationLibraryList');

				function setHasChildren(list) {
					list.forEach(item => {
						item.hasChildren = !!item.Childs.length;
						setHasChildren(item.Childs);
						if (!item.hasChildren) {
							item.Childs = null;
						}
					});
				}
				if (res.status == 2000) {
					setHasChildren(res.data);
					this.labels = res.data;
				}
				return Promise.resolve();
			},
			async getPitfallLevel() {
				let res = await this.Get('/GetPotentialLevelCom');
				if (res.status == 2000) {
					this.pitfallLevel = res.data;
				}
				return Promise.resolve();
			},
			addInspectionFields() {
				this.info.InspectionFields.push({
					FieldName: '',
					FieldType: '1'
				})
			},
			choosePitfall() {
				this.$refs.choosePitfall.show();
			},
			choosePitfallSubmit(data) {
				let obj = {
					ItemName: '其他',
					ItemContentList: data
				}
				this.addInspectionItems([obj]);
			},
			addInspectionItems(list = []) {
				list.forEach(item => {
					let obj = this.info.InspectionItems.find(o => o.ItemName == item.ItemName);
					if (obj) {
						// 对比所有项是否相同，不同则添加
						let fields = [
							'PotentialLevelCode',
							'Describe',
							'Basis',
							'Suggestion',
							'JudgmentCriteria',
						];
						item.ItemContentList.forEach(o => {
							let item1 = obj.ItemContentList.find(item1 => {
								let flag = true;
								fields.forEach(key => {
									if (item1[key] != o[key]) {
										flag = false;
									}
								})
								return flag;
							});
							if (!item1) {
								obj.ItemContentList.push(o);
							}
						});

					} else {
						let sort = (this.info.InspectionItems[this.info.InspectionItems.length - 1] || {}).Sort ||
							0;
						item.Sort = ++sort;
						this.info.InspectionItems.push(item);
					}
				});
				// InspectionItems: [], // 检查项目集合
				/**
				 * InspectionItemId (integer, optional): ID ,
				 * InspectionId (integer, optional): 检查表ID ,
				 * ItemName (string, optional): 检查项目名称 ,
				 * ItemContent (string, optional): 检查项目内容 ,
				 * Sort (integer, optional): 排序 ,
				 * ItemContentList (Array[InspectionItemContent], optional): 检查项目内容集合
				 */
				/**
				 * ItemContentList
				 * PotentialLevelCode (string, optional): 隐患级别 ,
				 * PotentialLevelName (string, optional): 隐患级别名称 ,
				 * Describe (string, optional): 隐患描述（检查内容） ,
				 * Basis (string, optional): 检查依据 ,
				 * Suggestion (string, optional): 整改建议 ,
				 * JudgmentCriteria (string, optional): 重大隐患判断标准
				 */
			},
			add(name) {
				this.$refs.add.show(name);
			},
			addSubmit(data) {
				let obj = {
					ItemName: data.ItemName,
					ItemContentList: [data]
				}
				this.addInspectionItems([obj]);
			},
			chooseInspections() {
				this.$refs.chooseInspections.show();
			},
			chooseInspectionsSubmit(data) {
				data.forEach(item => {
					this.addInspectionItems(item.InspectionItems);
				})
			},
			removeChild(item, i, index) {
				item.ItemContentList.splice(i, 1);
				if (!item.ItemContentList.length) {
					this.info.InspectionItems.splice(index, 1);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info {
		/deep/ .el-dialog__body {
			padding: 0 !important;

			.el-scrollbar__wrap {
				margin-bottom: 0 !important;
			}
		}

		/deep/ .el-dialog {
			min-width: 1000px;
		}

		/deep/ .el-form {
			padding: 25px 25px 20px;

			.el-select {
				width: 100%;
			}
		}

		/deep/ .el-form-item {
			margin-bottom: 25px;

			.el-form-item__label {
				padding-bottom: 9px;
				line-height: 20px;
			}
		}

		.el-date-editor,
		.el-select,
		.el-cascader {
			width: 100%;
		}

		.form-2-col {
			display: flex;

			>div {
				width: 50%;

				&:first-child {
					margin-right: 40px;
				}
			}
		}

		.split-line {
			&::before {
				content: '';
				display: block;
				margin: 25px -30px;
				height: 10px;
				background: #f2f2f2;
			}
		}

		.content {
			padding: 30px;
		}

		.card-header {
			height: 50px;

			.title {
				display: flex;
				align-items: center;
				font-size: 16px;
				font-weight: 600;

				&::before {
					content: '';
					border-radius: 2px;
					margin-right: 8px;
					width: 5px;
					height: 16px;
					background: $__color-primary;
				}
			}
		}

		.is-plain {
			background: transparent;

			&:hover,
			&:focus {
				color: $__color-primary;
			}
		}

		.form-info {
			border-bottom: 1px solid #DDDDDD;

			.form-item {
				display: flex;
				border-top: 1px solid #DDDDDD;
				border-left: 1px solid #DDDDDD;

				>div {
					display: flex;
					align-items: center;
					border-right: 1px solid #DDDDDD;
					min-height: 50px;

					&:first-child {
						padding: 0 8px;
						width: 20%;
					}

					&:nth-child(2) {
						padding: 0 8px;
						flex: 1;
					}

					&:last-child {
						width: 10%;
					}

					&.disabled {
						background: #F8F8F8;

						&.operation {
							color: #D5D5D5;

							span {
								cursor: default;
							}
						}
					}

					&.label {
						padding-left: 22px;
					}

					&.operation {
						text-align: center;

						span {
							margin: 0 auto;
							cursor: pointer;
						}
					}
				}
			}
		}

		.table {
			border-top: 1px solid #eee;
			border-left: 1px solid #eee;

			.table-header {
				border-right: 1px solid #eee;
				border-bottom: 1px solid #eee;
				padding: 0 20px;
				height: 50px;
				background: #F8F8F8;
				line-height: 50px;

				.title {
					font-size: 16px;
					font-weight: 600;
				}
			}

			.table-item {
				display: flex;

				&.table-th {
					font-weight: 600;
					text-align: center;
				}

				>div {
					padding: 15px 10px;
					flex: 1;
					border-right: 1px solid #eee;
					border-bottom: 1px solid #eee;

					&:first-child {
						flex: initial;
						width: 60px;
					}

					&:nth-child(5) {
						flex: initial;
						width: 140px;
					}

					&:last-child {
						flex: initial;
						width: 100px;
					}
				}
			}
		}

		.el-button--mini {
			padding: 7px 15px;
			font-size: 12px;
			border-radius: 3px;
		}
	}
</style>