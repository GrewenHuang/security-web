<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <!-- <div slot="header" class="header f-c">
            <div class="header-tab f-c-c">
                <div class="item" :class="{active: QueryScope == 1}" @click="changeStore(1)">公库</div>
                <div class="item" :class="{active: QueryScope == 0}" @click="changeStore(0)">私库</div>
            </div>
        </div> -->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    placeholder="试题编号"
                    clearable
                    v-model="filters.SerialNumber"
                ></el-input>
                <el-select
                    placeholder="题型"
                    clearable
                    v-model="filters.TypeCode"
                >
                    <el-option v-for="(item, index) in TypeCom" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-input
                    placeholder="题干"
                    clearable
                    v-model="filters.Content"
                ></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button-group style="margin-right: 10px;">
					<el-button type="primary" @click="onQuestionType" v-if="$_has('ZSJSKBtnSTLX')">试题类型</el-button>
                    <el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=9')" v-if="$_has('ZSJSKBtnDown')">导入模板下载</el-button>
                    <el-button v-if="$_has('ZSJSKBtnImport')">
                        <el-upload
                            action="#"
                            :show-file-list="false"
                            :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportContestQuestion', {IsPrivate: 0});
                                }
                            "
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                            >导入
                        </el-upload>
                    </el-button>
                    <el-button @click="downloadmbs(80, 801, {...filters, IsPrivate})" v-if="$_has('ZSJSKBtnExport')">导出</el-button>
                </el-button-group>
                <el-button type="primary" @click="add()" v-if="$_has('ZSJSKBtnAdd')">新增</el-button>
            </div>
        </div>
        <el-table
            :data="list"
            highlight-current-row
            :header-cell-style="$tableStyle"
            style="width: 100%"
        >
            <el-table-column
                label="序号"
                type="index"
                align="center"
                width="50"
            >
            </el-table-column>
            <el-table-column
                label="试题编号"
                align="center"
                width="140"
                prop="SerialNumber"
            >
            </el-table-column>
            <el-table-column
                label="题型"
                align="center"
                width="120"
                prop="TypeName"
            >
            </el-table-column>
            <el-table-column
                label="题干"
                align="center"
                prop="Content"
            >
            </el-table-column>
			<el-table-column label="试题类型" align="center" prop="ExamQuestionTypeName"  width="100"></el-table-column>
            <el-table-column
                label="创建人"
                align="center"
                width="150"
                prop="CreateByName"
            >
            </el-table-column>
			
            <el-table-column
                label="创建日期"
                align="center"
                width="150"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <template>
							<el-button type="text" @click="add(row,1)" v-if="$_has('ZSJSKBtnLook')">查看</el-button>
                            <el-button type="text" @click="add(row,2)" v-if="$_has('ZSJSKBtnEdit')">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)" v-if="$_has('ZSJSKBtnDelete')">删除</el-button>
                        </template>
                        
                    </div>
                </template>
            </el-table-column>
        </el-table>
		<el-dialog v-dialog-drag title="试题类型" :visible.sync="questionShow" :close-on-click-modal="false"
			@close="questionClear" top="8vh" width="50%">
			<el-scrollbar class="scrollbar">
				<div class="f-e-c" style="margin-bottom: 15px;">
					<el-button type="primary" icon="el-icon-plus" @click="onQuestAdd()">新增</el-button>
				</div>
				<el-table :data="questionTypeList" highlight-current-row :header-cell-style="$tableStyle">
					<el-table-column label="试题类型" align="center" header-align="center" prop="Name">
					</el-table-column>
					<el-table-column label="操作" align="center" header-align="center" width="200">
						<template slot-scope="scope">
							<div class="table-operation">
								<el-button type="text" @click="onQuestAdd(scope.row)">编辑</el-button>
								<el-button type="text" @click="onQuestDelete(scope.row)">删除</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</el-scrollbar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="questionClear()">关闭</el-button>
			</span>
		</el-dialog>
		<el-dialog v-dialog-drag title="提示" :visible.sync="typeShow" :close-on-click-modal="false" @close="typeClear"
			top="30vh" width="300px">
			<el-form :model="info" :rules="rules" ref="infoForm">
				<el-form-item label="试题类型" prop="Name">
					<el-input v-model="info.Name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="typeClear">取消</el-button>
				<el-button @click="submitQuestion('infoForm')" type="primary" :loading="questLoading">确定</el-button>
			</span>
		</el-dialog>
        <info ref="info" :IsPrivate="IsPrivate" :isPreview="isPreview" :questionTypeList="questionTypeList" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";
import RULECONFIG from "@/common/ruleConfig";
import info from './info';
const IsPrivate = 0;
export default {
    components: {
        info
    },
    mixins: [request_mixins, Download, Import_export],
    data() {
        return {
            loading: false,
			isPreview: false,
            list: [],
            TypeCom: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {

            },
            QueryScope: 2,
            IsPrivate: IsPrivate,
			rules: {
				Name: RULECONFIG.Text("试题类型")
			},
			QueryScope: 0,
			questionShow: false,
			questionTypeList: [],
			typeShow: false,
			info: {
				Name: ''
			},
			questLoading: false
        }
    },
    created() {
        
        this.Get("/GetQuestionTypeCom").then((res) => {
            if (res.status == 2000) {
                this.TypeCom = res.data;
            }
        });
		this.getQuestList()
        this.handlePageChange(1);
    },
    methods: {
		onQuestionType() {
			this.questionShow = true
			this.getQuestList()
		},
		getQuestList() {
			this.Get("/GetExamQuestionTypeList?type=1").then(res => {
				if (res.status == 2000) {
					this.questionTypeList = res.data
				}
			})
		},
		onQuestAdd(row) {
			this.typeShow = true
			if (row) {
				this.info = row
			} else {
				this.info = {
					Name: ""
				}
			}
		},
		questionClear() {
			this.questionShow = false
		},
		typeClear() {
			this.typeShow = false
			this.questLoading = false
		},
		onQuestDelete(row) {
			this.$confirm("此操作将永久删除该试题类型, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
				.then(() => {
					this.Get(`/DeleteExamQuestionType?ExamQuestionTypeId=${row.ExamQuestionTypeId}`).then(
						(res) => {
							if (res.status == 2000) {
								this.$message({
									type: "success",
									message: "删除成功!",
								});
								this.getQuestList();
							} else {
								this.$message.error(res.message);
							}
						}
					);
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除",
					});
				});
		},
		submitQuestion(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.questLoading = true;
					this.Post("/SaveContestQuestionType", {
						...this.info,
					}).then((res) => {
						if (res.status == 2000) {
							this.$message({
								message: "保存成功",
								type: "success",
							});
							this.typeClear()
							this.getQuestList();
						} else {
							this.$message.error(res.message);
						}
						this.questLoading = false;
					});
				}
			});
		},
        handlePageChange(val) {
            this.pages.page = val;
            this.GetList();
        },
        async GetList() {
            let params = {
                QueryScope: this.QueryScope,
                IsPrivate: this.IsPrivate,
                ...this.pages,
                ...this.filters,
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetContestQuestions', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item,index) {
			if(item){
				if(index == 1){
					this.isPreview = true
				}else {
					this.isPreview = false
				}
			}else {
				this.isPreview = false
			}
			
            this.$refs.info.show(item)
        },
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post(`/DeleteContestQuestion?contestQuestionId=${row.ContestQuestionId}`, {
                    contestQuestionId: row.ContestQuestionId,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.GetList();
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                        });
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        changeStore(num) {
            if (this.QueryScope == num) return;
            this.QueryScope = num;
            this.handleSearch(1);
        },
        
    }
}
</script>

<style lang="scss" scoped>

.header{
    position: relative;
    padding-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
    .header-tab{
        margin: 0 auto;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            border-radius: 74px;
            border: 1px solid #fff;
            width: 74px;
            height: 74px;
            background: #63B0FF url(../../../assets/images/data-base/learn.png) no-repeat center center;
            background-size: cover;
        }
    }
    .item{
        border-radius: 6px;
        padding: 15px 72px;
        background: #fff;
        color: $--color-primary;
        cursor: pointer;
        &.active{
            background: $--color-primary;
            color: #fff;
        }
    }
    .operation{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }
}
</style>
