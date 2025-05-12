<template>
	<page-layout class="warp" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
		<!-- <div slot="header" class="header f-c">
            <div class="header-tab f-c-c">
                <div class="item" :class="{active: QueryScope == 1}" @click="changeStore(1)">公库</div>
                <div class="item" :class="{active: QueryScope == 0}" @click="changeStore(0)">私库</div>
            </div>
        </div> -->
		<!--工具条开始-->
		<div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-input v-model="filters.ExaminationPaperNumber" placeholder="试卷编号"
					@keyup.enter.native="handleSearch"></el-input>
				<el-input v-model="filters.ExaminationPaperName" placeholder="试卷名称"
					@keyup.enter.native="handleSearch"></el-input>
				<el-button type="primary" @click="handleSearch">查询</el-button>
			</div>
			<div>
				<el-button type="primary" icon="el-icon-plus" @click="addshow()" v-if="$_has('PXKSJBtnAdd')">新增</el-button>
			</div>
		</div>
		<!--工具条结束-->

		<!--列表开始-->
		<el-table :data="list" highlight-current-row :header-cell-style="$tableStyle">
			<el-table-column label="序号" align="center" header-align="center" type="index" width="60">
			</el-table-column>
			<el-table-column label="所属公司" align="center" header-align="center" prop="EnterpriseName" width="200">
			</el-table-column>
			<el-table-column label="试卷编号" prop="ExaminationPaperNumber" align="center" header-align="center"
				width="145">
			</el-table-column>
			<el-table-column label="试卷名称" prop="ExaminationPaperName">
			</el-table-column>
			<el-table-column label="考试时长(分)" align="center" header-align="center" width="110">
				<template slot-scope="scope">
					<div>{{ scope.row.TestTime || "不限" }}</div>
				</template>
			</el-table-column>
			<el-table-column label="试题数" align="center" header-align="center" prop="QuestionNumber" width="65">
			</el-table-column>
			<el-table-column label="试卷总分" align="center" header-align="center" prop="TotalScore" width="80">
			</el-table-column>
			<el-table-column label="合格分数" align="center" header-align="center" prop="PassScore" width="80">
			</el-table-column>
			<el-table-column label="创建日期" align="center" header-align="center" prop="CreateTimeDesc" width="175">
			</el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="300">
				<template slot-scope="scope">
					<div class="table-operation">
						<el-button type="text" @click="see(scope.row.ExaminationPaperId)" v-if="$_has('PXKSJBtnLook')">查看</el-button>
						<el-button type="text" @click="addshow(scope.row)" v-if="$_has('PXKSJBtnEdit')">编辑</el-button>
						<el-button type="text" text-plain @click="delP(scope.row.ExaminationPaperId)" v-if="$_has('PXKSJBtnDelete')">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--列表结束-->

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="dialogTitle" :visible.sync="addShow" :close-on-click-modal="false"
			@close="dialogClear" width="50%">
			<el-scrollbar class="scrollbar">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="font-size: 15px; font-weight: 700">基本信息</span>
					</div>
					<div>
						<el-form :model="parms" :rules="rules" ref="ruleForm">
							<div class="form-col">
								<el-form-item label="试卷编号" prop="ExaminationPaperNumber">
									<el-input v-model="
                                                parms.ExaminationPaperNumber
                                            " placeholder="请输入试卷编号" maxlength="20" show-word-limit></el-input>
								</el-form-item>
								<el-form-item label="试卷名称" prop="ExaminationPaperName">
									<el-input v-model="parms.ExaminationPaperName" placeholder="请输入试卷名称" maxlength="50"
										show-word-limit></el-input>
								</el-form-item>
							</div>
							<el-form-item label="考试时长（分）" prop="TestTime">
								<div class="el-input">
									<el-switch style="margin-left: 20px" active-text="开启" inactive-text="关闭"
										v-model="IsTime" @change="seletSetTestTime($event)">
									</el-switch>
									<el-input-number :min="0" :max="1000" v-model="parms.TestTime"
										:disabled="!IsTime"></el-input-number>
								</div>
							</el-form-item>
							<div class="form-col">
								<el-form-item label="总分">
									<el-input disabled v-model="parms.TotalScore"></el-input>
								</el-form-item>
								<el-form-item label="合格分数" prop="PassScore">
									<el-input-number :min="1" :max="1000" style="width: 100%"
										v-model="parms.PassScore"></el-input-number>
								</el-form-item>
							</div>
						</el-form>
					</div>
				</el-card>

				<el-card style='margin-top:10px;' v-for='(item,index) in parms.ExaminationPaperRules' :key='index'
					class="collapse-box">
					<el-collapse v-model="activeNames">
						<el-collapse-item :name="index" :disabled="item.Status == 0">
							<template slot="title">
								<span style='font-size:15px;font-weight:700;'>{{item.TypeName}}</span>
								<!-- 空壳阻止点击事件冒泡 -->
								<div @click.stop="">
									<el-switch style="float: right; padding: 3px 0" v-model='item.Status'
										@change="IsStatus($event,index,item)" :active-value="1" :inactive-value="0"
										active-text="开启" inactive-text="关闭">
									</el-switch>
								</div>
							</template>
							<div v-show='item.Status'>
								<div>
									<el-form :inline="true">
										<el-form-item label='试题数'>
											<el-input-number :min="0" :max="1000" @change="changeVal(index,item)"
												v-model="item.ItemNumber"></el-input-number>
										</el-form-item>
										<el-form-item label='每题分数'>
											<el-input-number :min="1" @change="changeVal(index,item)" :max="1000"
												v-model="item.Score"></el-input-number>
										</el-form-item>
										<el-form-item :label="item.TypeName+'总分'">
											<el-input v-model='item.TotalScore' disabled></el-input>
										</el-form-item>
									</el-form>
								</div>
								<div style='color:red;height:50px;'>备：添加试题数多于设置的试题数时，会随机在添加的试题中抽取相应设置的试题数</div>
								<el-table :data="item.list" border style="width: 100%">
									<el-table-column type='index' label="序号" width="50">
									</el-table-column>
									<el-table-column prop="SerialNumber" label="编号" width="200">
									</el-table-column>
									<el-table-column label="试题内容">
										<template slot-scope="scope">
											<div v-html='scope.row.Content'></div>
										</template>
									</el-table-column>
									<el-table-column prop="address" label="操作" width="100" header-align="center"
										align="center">
										<template slot-scope="scope">
											<el-button type='text' text-plain
												@click='delQuestions(scope.row)'>删除</el-button>
										</template>
									</el-table-column>
								</el-table>
								<el-button icon='el-icon-plus' style='width:100%' type='primary'
									@click="showQuestions(item.TypeCode,item.list)">
									新增试题
								</el-button>
							</div>
						</el-collapse-item>
					</el-collapse>
				</el-card>
			</el-scrollbar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addShow = false">关闭</el-button>
				<el-button @click="submit('ruleForm')" type="primary">确定</el-button>
			</span>
		</el-dialog>
		<!--弹层结束-->
		<!--弹层开始-->
		<el-dialog v-dialog-drag title="添加试题" :visible.sync="addShow1" :close-on-click-modal="false"
			is-loading="isLoading1" top="8vh" width="900px">
			<el-scrollbar class="scrollbar">
				<el-form :inline="true">
					<el-form-item>
						<!-- <el-select
                            v-model="filters1.ExamQuestionTypeId"
                            clearable
                            placeholder="请选择试题类型"
                            size="small"
                        >
                            <el-option
                                v-for="(item, index) in questionsTypeList"
                                :key="index"
                                :label="item.Name"
                                :value="item.ExamQuestionTypeId"
                            ></el-option>
                        </el-select> -->
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters1.SerialNumber" size="small" placeholder="试题编号"
							style="min-width: 200px"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="filters1.Content" size="small" placeholder="试题内容"
							style="min-width: 200px"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" plain icon="el-icon-search"
							@click="handleSearch1">查询</el-button>
					</el-form-item>
				</el-form>
				<el-table :data="Qlist" border style="width: 100%" @selection-change="chooseQuestions">
					<el-table-column type="selection" width="55" align="center">
					</el-table-column>
					<el-table-column prop="EnterpriseName" label="所属公司" width="200">
					</el-table-column>
					<el-table-column prop="SerialNumber" label="编号" width="180">
					</el-table-column>
					<el-table-column prop="ExamQuestionTypeName" label="试题类型" width="180">
					</el-table-column>
					<el-table-column label="试题内容">
						<template slot-scope="scope">
							<div v-html="scope.row.Content"></div>
						</template>
					</el-table-column>
					<!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         type='primary'
                         @click="SelectionChange(scope.row)">选择</el-button>
            </template>
          </el-table-column> -->
				</el-table>
			</el-scrollbar>

			<div slot="footer" class="dialog-footer">
				<el-button @click="submitSelectQuestions" type="primary">确定</el-button>
			</div>
		</el-dialog>

		<!--弹层开始-->
		<el-dialog v-dialog-drag :title="paperTilte" :visible.sync="addShow2" :close-on-click-modal="false" center
			class="paperTilte" width="70%">
			<el-scrollbar class="scrollbar">
				<div class="paperBox" v-for="(item, index) in paperList" :key="index">
					<div v-if="item.ExaminationPaperQuestions.length">
						<div>
							{{ item.TypeName }}(共{{
                                item.ExaminationPaperQuestions.length
                            }}题，总共{{ item.TotalScore }}分)
						</div>
						<div style="color: #000; padding-left: 20px"
							v-for="(items, i) in item.ExaminationPaperQuestions" :key="i">
							<div style="
                                    font-size: 15px;
                                    font-weight: 600;
                                    height: auto;
                                    display: flex;
                                    margin: 20px 0 5px 0;
                                    align-items: center;
                                ">
								<span style="width: 30px">{{ i + 1 }}.</span>
								<p v-html="items.Content" style="width: 97%"></p>
							</div>
							<div style="
                                    height: 30px;
                                    line-height: 30px;
                                    display: flex;
                                " v-for="(itemss, j) in items.ExaminationPaperAnswers" :key="j"
								:style="{color: itemss.IsCorrect == 1 ?  '#00C290' : ''}">
								{{
                                    String.fromCharCode("A".charCodeAt(0) + j)
                                }}.
								<p v-html="itemss.Answer"></p>
							</div>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</el-dialog>
	</page-layout>
</template>



<script>
	import request_mixin from "@/mixins/request-mixin.js";
	import Download from "@/mixins/Download.js";
	import Import_export from "@/mixins/Import_export.js";
	import RULECONFIG from "@/common/ruleConfig";
	const IsPrivate = 0;
	export default {
		mixins: [request_mixin, Download, Import_export],
		data() {
			return {
				parms: {
					ExaminationPaperNumber: "", //试卷编号
					ExaminationPaperName: "", //试卷名称
					TestTime: 0, //考试时长
					PassScore: "", //及格分
					TotalScore: 0,
					ExaminationPaperRules: [],
				},
				activeNames: [0, 1, 2], //控制折叠面板
				//搜索时的过滤条件
				IsTime: false,
				filters1: {},
				filters: {},
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
				dialogTitle: "新增",
				//列表页面是否加载变量
				loading: false,
				content: "",
				paperTilte: "",
				Qlist: [],
				addShow1: false,
				isLoading1: false,
				TypeCom: [], //选择题
				addShow2: false,
				rules: {
					ExaminationPaperNumber: RULECONFIG.Text("试卷编号"),
					ExaminationPaperName: RULECONFIG.Text("试卷名称"),
					TestTime: RULECONFIG.Text("时长"),
					PassScore: RULECONFIG.Text("及格分"),
				},
				paperList: [], //试卷列表
				Qid: "",
				Qrows: "",
				selectedQuestionsList: [],
				questionsTypeList: [],
				QueryScope: 0
			};
		},
		methods: {
			delP(id) {
				this.$confirm("此操作将永久删除该试卷, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					this.Post(`DeleteExaminationPaper?ExaminationPaperId=${id}&IsPrivate=${IsPrivate}`).then(
						(res) => {
							if (res.status == 2000) {
								this.$message({
									type: "success",
									message: "删除成功!",
								});
								this.getList();
							} else {
								this.$message.error(res.message);
							}
						}
					);
				});
			},
			handleSearch1() {
				this.showQuestions(this.Qid, this.Qrows);
			},
			seletSetTestTime(e) {
				if (e == false) {
					this.parms.TestTime = 0;
				}
			},
			chooseQuestions(val) {
				this.selectedQuestionsList = val;
			},
			submitSelectQuestions() {
				this.selectedQuestionsList.forEach((item) => {
					this.SelectionChange(item);
				});
				this.addShow1 = false;
			},
			SelectionChange(val) {
				//选择试题
				var isExist = 0;
				this.parms.ExaminationPaperRules.forEach((k, i) => {
					if (val.TypeCode == k.TypeCode) {
						if (k.list && k.list.length) {
							k.list.forEach((key) => {
								if (key.ExamQuestionId == val.ExamQuestionId) {
									isExist = 1;
								}
							});
							if (!isExist) {
								k.list.push(val);
								k.ExaminationPaperQuestions.push({
									ExamQuestionId: val.ExamQuestionId,
								});
							} else {
								this.$message.error("请勿添加重复数据！");
							}
						} else {
							k.list.push(val);
							k.ExaminationPaperQuestions.push({
								ExamQuestionId: val.ExamQuestionId,
							});
						}
					}
					// this.addShow1 = false;
				});
			},
			IsStatus(index, item) {
				this.changeVal(index, item);
			},
			changeVal(index, item) {
				this.$forceUpdate();
				this.parms.TotalScore = 0;
				this.parms.ExaminationPaperRules[index].TotalScore =
					item.ItemNumber * item.Score;
				this.parms.ExaminationPaperRules.forEach((k) => {
					if (k.Status == 1) {
						this.parms.TotalScore += parseInt(k.TotalScore);
					}
				});
			},
			addshow(row) {
				this.addShow = true;

				this.Get("/GetQuestionTypeCom").then((res) => {
					if (res.status == 2000) {
						if (row) {
							this.parms = JSON.parse(JSON.stringify(row));
							this.parms.ExaminationPaperRules.forEach((k) => {
								k.list = JSON.parse(
									JSON.stringify(k.ExaminationPaperQuestions)
								);
							});
						} else {
							this.parms = {
								ExaminationPaperNumber: "",
								ExaminationPaperName: "", //试卷名称
								TestTime: 0, //考试时长
								PassScore: "", //及格分
								TotalScore: 0,
								ExaminationPaperRules: [],
							};
							this.parms.ExaminationPaperNumber =
								this.getCoursewareNo();
							this.parms.ExaminationPaperRules = res.data;
							this.parms.ExaminationPaperRules.forEach((k) => {
								k.ItemNumber = 0;
								k.Score = 0;
								k.TotalScore = 0;
								k.ExaminationPaperQuestions = [];
								k.TypeCode = k.id;
								k.TypeName = k.text;
								k.list = [];
							});
						}
					}
				});
			},
			submit(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.parms.ExaminationPaperRules =
							this.parms.ExaminationPaperRules.filter((key) => {
								if (key.Status == 1) {
									return key;
								}
							});
						this.Post("/SaveExaminationPaper", {
							...this.parms,
							IsPrivate
						}).then(
							(res) => {
								if (res.status == 2000) {
									this.$message({
										message: "保存成功",
										type: "success",
									});
									this.getList();
									this.addShow = false;
								} else {
									this.$message.error(res.message);
								}
							}
						);
					}
				});
			},
			IsStatus($event, index, item) {
				this.changeVal(index, item)
				//试题关闭时同时折叠该卡片
				if ($event === 0) {
					this.activeNames = this.activeNames.filter(item1 => {
						return item1 !== index
					})
				} else {
					this.activeNames.push(index)
				}
			},
			getCoursewareNo() {
				//获取随机编号
				return "KJ" + new Date().getTime();
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
			//获取列表数据
			getList() {
				let that = this;
				let params = Object.assign({
						page: that.pages.page,
						rows: that.pages.rows,
						IsPrivate,
						QueryScope: 2 || this.QueryScope
					},
					that.filters
				);
				this.loading = true;
				this.Post("/GetExaminationPapers", params)
					.then((res) => {
						this.loading = false;
						if (res.status == 2000) {
							this.list = res.data.list;
							this.pages.total = res.data.count;
						}
					})
					.finally(() => {
						this.loading = false;
					});
			},

			//弹层的取消
			dialogClear() {
				let than = this;
				than.addShow = false;
			},

			delQuestions(row) {
				this.parms.ExaminationPaperRules.forEach((k, i) => {
					if (row.TypeCode == k.TypeCode) {
						k.list = k.list.filter((j) => {
							return j.ExamQuestionId != row.ExamQuestionId;
						});
						k.ExaminationPaperQuestions =
							k.ExaminationPaperQuestions.filter((j) => {
								return j.ExamQuestionId != row.ExamQuestionId;
							});
					}
				});
				this.$forceUpdate();
			},

			see(id) {
				//查看
				this.addShow2 = true;

				this.Post(`/GetExaminationPaper?Id=${id}&IsPrivate=${IsPrivate}`).then((res) => {
					if (res.status == 2000) {
						this.paperTilte = res.data.ExaminationPaperName;
						this.paperList = res.data.ExaminationPaperRules;
					}
				});
			},
			showQuestions(id, rows) {
				this.addShow1 = true;
				this.isLoading1 = true;
				this.Qid = id;
				this.Qrows = rows;
				// this.getQuestionsTypes();
				this.Post("/GetExamQuestions", {
					page: 1,
					rows: 10000,
					TypeCode: id,
					QueryScope: 2,
					...this.filters1,
				}).then((res) => {
					if (res.status == 2000) {
						this.Qlist = res.data.list;
					}
					this.isLoading1 = false;
				});
			},
			getQuestionsTypes() {
				this.Post("/GetExamQuestionTypeList").then((res) => {
					this.questionsTypeList = res.data;
				});
			},
			changeStore(num) {
				if (this.QueryScope == num) return;
				this.QueryScope = num;
				this.handleSearch(1);
			},
		},
		mounted() {
			this.handleSearch();
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.el-collapse-item__header {
		display: flex !important;
		justify-content: space-between;
	}

	/deep/ .paperTilte .el-dialog__header {
		background-color: #409eff;
	}

	/deep/ .paperTilte .el-dialog__title {
		color: #ffffff;
	}

	/deep/ .paperTilte .el-dialog__headerbtn .el-dialog__close {
		color: #ffffff;
	}

	.paperBox>div>div:nth-child(1) {
		height: 60px;
		background: #f2f2f2;
		font-size: 18px;
		font-weight: 600;
		line-height: 60px;
		color: #000;
		padding-left: 20px;
		box-sizing: border-box;
	}

	/deep/.el-collapse-item__arrow {
		display: none !important;
	}

	/deep/.el-collapse-item__header {
		display: flex;
		justify-content: space-between;
	}

	/deep/ .el-collapse-item.is-disabled .el-collapse-item__header {
		color: #303133;
	}

	.collapse-box {
		/deep/.el-collapse-item__header {
			height: 58px;
			padding: 20px;
			border-bottom: 1px solid #EBEEF5;
		}

		/deep/.el-card__body {
			padding: 0;
		}

		/deep/.el-collapse-item__content {
			padding: 20px;
			border: none;
		}
	}

	.header {
		position: relative;
		padding-bottom: 24px;
		font-size: 18px;
		font-weight: 600;

		.header-tab {
			margin: 0 auto;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				border-radius: 74px;
				border: 1px solid #fff;
				width: 74px;
				height: 74px;
				background: #63B0FF url(../../assets/images/data-base/learn.png) no-repeat center center;
				background-size: cover;
			}
		}

		.item {
			border-radius: 6px;
			padding: 15px 72px;
			background: #fff;
			color: $--color-primary;
			cursor: pointer;

			&.active {
				background: $--color-primary;
				color: #fff;
			}
		}

		.operation {
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
		}
	}
</style>