<template>
	<page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!--工具条开始-->
		<div slot="operation"   class="f-b-c">
			<div class="input-content">
				<el-form :model="filters" :inline="true">
					<!-- <el-form-item>
						<el-select v-model="filters.PotentialSource" placeholder="请选择隐患来源" clearable style="min-width: 180px">
							<el-option v-for="item in SourceCom" :key="item.id" :label="item.text" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item>
						<el-input v-model="filters.TextCondition" clearable placeholder="隐患项目/隐患内容/上报人"></el-input>
					</el-form-item>
					<el-form-item>
							<el-input v-model="filters.RectificationUserName" clearable placeholder="整改人"></el-input>
					</el-form-item>
					<!-- <el-form-item>
						<el-input v-model="filters.ReexamineUserName" clearable placeholder="复查人"></el-input>
					</el-form-item> -->
					<el-form-item>
						<el-select placeholder="状态" clearable v-model="filters.SearchStatus" style="min-width: 180px">
							<el-option v-for="(item,index) in statusList" :key="index" :label="item.text"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="f-c-c">
				<el-button-group>
					<el-button @click="downloadmbs(1510, 15102, filters)" v-if="$_has('YHZLBtnPCTZ') || $_has('RWXQYHBTNPCTZ')">隐患排查台账</el-button>
					<el-button @click="downloadmbs(1510, 15103, filters)" v-if="$_has('YHZLBtnZLTZ') || $_has('RWXQYHBTNZLTZ')">隐患治理台账</el-button>
				</el-button-group>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="隐患来源" align="center" header-align="center" width="100" prop="PotentialSourceDesc">
			</el-table-column>
			<el-table-column label="隐患项目" prop="Project" width="100" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column label="隐患内容" prop="Content" width="150" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.Content">
						{{ToText(scope.row.Content)}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="排查备注" width="150" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.RecordSubmit.Remark">{{scope.row.RecordSubmit.Remark}}</span>
				</template>
			</el-table-column>
			<el-table-column label="隐患级别" align="center" header-align="center" prop="PotentialLevelName" width="100">
				<template slot-scope="scope">
					<el-tag size="small" effect="dark" :type="
                            scope.row.PotentialLevelCode == '058002'
                                ? ''
                                : 'danger'
                        ">
						{{ scope.row.PotentialLevelName }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="责任部门" prop="DepartmentName" align="center"> </el-table-column>
			<el-table-column label="上报人" prop="SubmitUserName" align="center" width="100" show-overflow-tooltip> </el-table-column>
			<el-table-column label="整改人" prop="ResponsibleName" align="center" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.RecordRectification && scope.row.RecordRectification.length > 0">{{ scope.row.RecordRectification.map(item => item.OperationUserName).join('、') }}</span>
					<span v-else>{{scope.row.ResponsibleName}}</span>
				</template>
			</el-table-column>
			<el-table-column label="复查人" align="center" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.RecordReexamine && scope.row.RecordReexamine.length > 0">{{ scope.row.RecordReexamine.map(item => item.OperationUserName).join('、') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center" header-align="center" width="80">
				<template slot-scope="scope">
					<el-tag :type="scope.row | filterscolor" effect="dark" size="small">
						{{ scope.row.StatusDesc }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" header-align="center" width="300">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-popover placement="bottom" width="250" trigger="click">
							<el-button  v-if="$_has('YHZLBtnPCBG')" type="danger" icon="el-icon-s-order" size="mini" plain @click="
                                    downloadmbs(
                                        1510,15104,
                                        {
                                            PotentialId: scope.row.PotentialId,
                                            PotentialOperations: [40, 41, 50],
                                            DownloadType: 1,
                                        },
                                        scope.row.EnterpriseId
                                    )
                                ">排查报告</el-button>
							<el-button  type="success" icon="el-icon-s-order" size="mini" plain v-if="
                                    scope.row.Status >= 50 &&
                                    scope.row.Status <= 70 && $_has('YHZLBtnFCBG')
                                " @click="
                                    downloadmbs(
                                        1510,15105,
                                        {
                                            PotentialId: scope.row.PotentialId,
                                            PotentialOperations: [40, 41, 50],
                                            DownloadType: 1,
                                        },
                                        scope.row.EnterpriseId
                                    )
                                ">复查报告</el-button>
							<el-button slot="reference" type="text"  v-if="$_has('YHZLBtnDown') || $_has('RWXQYHBTNDOWN')">下载</el-button>
						</el-popover>
						<el-button type="text" @click="showViewDialog(scope.row.PotentialId, scope.row)"  v-if="$_has('YHZLBtnLook') || $_has('RWXQYHBTNLOOK')">查看</el-button>
						<!-- <el-button type="text" @click="seeView(scope.row.PotentialId)">操作记录</el-button> -->
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" width="60%" top="8vh">
			<el-scrollbar class="scrollbar" ref="scrollbar">
				<div class="detail-box">
					<div class="num-box">
						<span>编号:</span>
						<span>{{row.FileNo}}</span>
					</div>
				</div>
				<el-card class="box-card">

					<!-- <div slot="header" class="clearfix">
						<span style="font-weight: 600; font-size: 15px">检查项目：{{ row.Project }}</span>
						<el-button style="float: right; padding: 3px 0"
							type="text">{{ row.PotentialLevelName }}</el-button>
					</div> -->
					<div>
						<el-form ref="form">
							<!-- <el-form-item label="检查内容：">
								<el-input type="textarea" :value="row.Content" disabled readonly></el-input>
							</el-form-item> -->
							<div class="form-col">
								<div>企业名称：{{ row.EnterpriseName }}</div>
								<div>责任部门：{{ row.DepartmentName }}</div>
							</div>
							<div class="form-col">
								<div>隐患级别：{{ row.PotentialLevelName }}</div>
								<div>安全等级：{{ row.SecurityLevelDesc? row.SecurityLevelDesc : '0'}}</div>
							</div>
							<div class="form-col">
								<div>隐患来源：{{ row.PotentialSourceDesc }}</div>
								<div>隐患名称：{{ row.Project }}</div>
							</div>
							<el-form-item label="隐患内容：">
								<el-input type="text" disabled :value="row.Content" readonly></el-input>
							</el-form-item>
							<div class="form-col">
								<div>上报人：{{ row.SubmitUserName }}</div>
								<div>上报时间：{{ row.SubmitDateDesc }}</div>
							</div>
							<el-card class="box-card">
								<el-form-item label="排查照片：">
									<div>
										<mediaList :list="row.RecordSubmit.AttachmentFiles" v-if="row.RecordSubmit" />
									</div>
								</el-form-item>
								<el-form-item label="排查备注：">
									<el-input type="textarea" disabled v-if="row.RecordSubmit"
										:value="row.RecordSubmit.Remark" readonly></el-input>
								</el-form-item>
							</el-card>

							<template v-if="row.RecordRectification">
								<div v-for="(item, index) in row.RecordRectification" :key="index">
									<el-row>
										<el-card class="box-card">
											<el-col :span="24">
												<el-form-item label="整改照片：">
													<mediaList :list="item.AttachmentFiles"
														v-if="item.AttachmentFiles" />
												</el-form-item>
											</el-col>
											<el-col :span="24">
												<el-form-item label="整改备注：">
													<el-input type="textarea" disabled :value="item.Remark"
														readonly></el-input>
												</el-form-item>
											</el-col>
										</el-card>
									</el-row>
								</div>
							</template>
							<template v-if="row.RecordReexamine">
								<div v-for="(data, ids) in row.RecordReexamine" :key="ids+ 'a'">
									<el-row>
										<el-card class="box-card">
											<el-col :span="12">
												<el-form-item label="复查人：">
													<div>
														{{ data.OperationUserName }}
													</div>
												</el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="复查时间：">
													<div>
														{{ data.OperationDateDesc }}
													</div>
												</el-form-item>
											</el-col>
											<el-row v-if="data.IsPass">
												<el-col :span="24">
													<el-form-item label="复查照片：">
														<mediaList :list="data.AttachmentFiles"
															v-if="data.AttachmentFiles" />
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="24">
													<el-form-item :label="
									                        data.IsPass
									                            ? '复查备注：'
									                            : '不通过原因'
									                    ">
														<el-input type="textarea" disabled :value="data.Remark"
															readonly></el-input>
													</el-form-item>
												</el-col>
											</el-row>
										</el-card>
									</el-row>
								</div>
							</template>
						</el-form>
					</div>
				</el-card>
			</el-scrollbar>
		</el-dialog>
		<!--弹层结束-->
		<!--弹层开始-->
		<el-dialog v-dialog-drag title="操作记录" :visible.sync="viewShow" :close-on-click-modal="false" width="40%">
			<potentialView ref="child" />
			<span slot="footer" class="dialog-footer">
				<el-button @click="viewShow = false">取 消</el-button>
			</span>
		</el-dialog>
		<viewInfo ref="info"></viewInfo>
		<!--弹层结束-->
	</page-layout>
</template>

<script>
	import API_POTENTIAL from '@/api/api_potential'
	import viewInfo from "../Potential/info";
	import request_mixin from "@/mixins/request-mixin.js";
	import Import_export from "@/mixins/Import_export.js";
	import potentialView from "@/components/common/potential-view";
	import mediaList from '@/components/common/media-list'
	import util from '@/common/util';
	export default {
		name: "list",
		components: {
			viewInfo,
			potentialView,
			mediaList
		},

		mixins: [request_mixin, Import_export],
		data() {
			return {
				id: "",
				viewShow: false,
				OperationRecords: [],
				row: [],
				SourceCom: [],
				DateTime: [],
				NatureList: [],
				//列表行的ID，编辑和删除时需要使用
				id: '',
				userId: '',
				//状态选项
				checkTypeList: [],
				//搜索时的过滤条件
				filters: {
				},
				//数据列表
				list: [],
				//分页相关数据
				pages: {
					total: 0,
					page: 1,
					rows: 10,
				},
				//弹层数据
				addShow: false,
				dialogTitle: '',
				//列表页面是否加载变量
				loading: false,
				//表单页面是否加载变量
				formLoading: false,
				//新增/编辑页面弹窗隐藏显示控制变量
				formVisible: false,
				statusList: [],
				info: {}
			};
		},
		methods: {
			ToText(A) {
				var input = A;
				return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '')
					.replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ');
			},
			seeView(PotentialId) {
				this.viewShow = true
				this.$nextTick(() => {
					this.$refs.child.getData(PotentialId)
				})
			},
			//分页事件
			handleCurrentChange(val) {
				this.pages.page = val;
				this.getList();
			},
			//搜索事件
			handleSearch() {
				this.pages.page = 1;
				this.getList();
			},
			show(id){
				this.id = id
				this.handleSearch()
			},
			//获取列表数据
			getList: function() {
				let that = this;
				let params = Object.assign({
					page: that.pages.page,
					rows: that.pages.rows,
					RelationId: this.id,
				}, that.filters);

				that.loading = true;
				this.Post('/GetEnterprisePotentialRecords', params).then(res => {
					if (res.status == 2000) {
						that.list = res.data.list;
						that.pages.total = res.data.count;
					} else {
						that.$message.error(res.massage);
					}
					that.loading = false;
				}).finally(() => {
					this.loading = false;
				})

			},
			//弹层的取消
			dialogClear() {
				let than = this
				than.addShow = false
			},
			//检查执行
			showViewDialog(PotentialId, row) {
				this.row = []
				// this.dialogTitle = '查看记录'
				// this.addShow = true
				this.row = row
				this.$refs.info.show(row)
				// this.$nextTick(() => {
				// 	this.$refs.scrollbar.wrap.scrollTop = 0
				// });

				return
				let than = this
				than.dialogTitle = '查看记录'
				than.addShow = true
				than.row = row
				this.Post('/GetPotentialOperationRecords', {
					PotentialId: row.PotentialId,
					PotentialOperations: [40, 41, 50],
					Order: 1
				}).then(res => {
					if (res.status == 2000) {
						res.data.forEach(k => {
							if (k.AttachmentFiles) {
								k.Dimglist = k.AttachmentFiles.map(res => {
									return res.Url
								})
							}
						})

						this.OperationRecords = res.data
					}
				})

			},
			timeFormat(date) {
				try {
					let y = date.getFullYear();
					let m = date.getMonth() + 1;
					let d = date.getDate();
					m = m < 10 ? "0" + m : m;
					d = d < 10 ? "0" + d : d;
					return y + "-" + m + "-" + d;
				} catch (e) {
					return
				}

			},
			getCurrentDate() {
				var date = new Date();
				return this.timeFormat(date)
			},
			getCurrentMonthFirstDay() {
				var date = new Date();
				date.setDate(1);
				return this.timeFormat(date)
			},

		},
		mounted() {
			let url = util.getLoginUrl() == '/rb-login' ? 'GetRoadPotentialSourceCom' : 'GetPotentialSourceCom'
			//获取隐患排查性质
			this.Get(url).then((res) => {
				if (res.status === 2000) {
					this.SourceCom = res.data
				}
			})
			this.Get('/GetPotentialStatusCom').then((res) => {
				if (res.status === 2000) {
					this.statusList = res.data
				}
			})
			// this.filters.StartSubmitDate = this.getCurrentMonthFirstDay()
			// this.filters.EndSubmitDate = this.getCurrentDate()
			this.DateTime = [this.getCurrentMonthFirstDay(), this.getCurrentDate()]
			// this.handleSearch();
		}

	}
</script>

<style scoped lang="less">
	/deep/ .el-scrollbar__wrap {
		overflow-x: hidden;
	}

	.box-card {
		margin-top: 20px;
	}

	/deep/ .el-button+.el-button {
		margin-left: 0px;
	}
	.form-col div {
		margin-bottom: 15px !important;
	}
	/deep/.input-content .el-form-item {
		margin-bottom: 0 !important;
	}
	.detail-box {
		width: 100%;
		padding-bottom: 20px;
		.num-box {
			width: 100%;
			text-align: right;
			font-size: 16px;
			color: #000;
			font-weight: bold;
			margin-bottom: 10px;

			span:nth-child(2) {
				color: #FF4040;
			}
		}
	}
</style>