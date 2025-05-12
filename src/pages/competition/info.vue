<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
               <div class="form-2-col">
				   <el-form-item label="竞赛标题" prop="Title" ref="Title">
				       <el-input
				           placeholder="请输入"
				           v-model="info.Title"
				       ></el-input>
				   </el-form-item>
				   <el-form-item label="安全等级" prop="SecurityLevel" ref="SecurityLevel">
				   	<select-level v-model="info.SecurityLevel" :multiple="false"
				   		:value="info.SecurityLevel"></select-level>
				   </el-form-item>
			   </div>
                <div class="form-2-col">
                    <el-form-item label="竞赛答题日期" prop="ContestDate" ref="ContestDate">
                        <el-date-picker
                            placeholder="请选项"
                            type="date"
                            value-format="yyyy-MM-dd"
                            v-model="info.ContestDate"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="模拟答题日期" prop="date" ref="date">
                        <custom-date-range
                            startDatePlaceholder="开始日期"
                            endDatePlaceholder="结束日期"
                            :hasIsLong="false"
                            v-model="info.date"
                        ></custom-date-range>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="答题时限" prop="Duration" ref="Duration">
                        <el-input
                            v-model="info.Duration"
                            placeholder="请输入"
                        >
                            <span slot="suffix">分钟</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="竞赛题目数" prop="QuestionCount" ref="QuestionCount">
                        <el-input
                            v-model="info.QuestionCount"
                            placeholder="请输入"
                        >
                            <span slot="suffix">题</span>
                        </el-input>
                    </el-form-item>
                </div>
                <div class="split-line"></div>
                <div class="f-b-c">
                    <div class="title">竞赛题目</div>
                    <div>
                        <span>已选题目数：<span style="color:#FE912E;">{{info.Questions.length}}</span>（<span v-for="(item, index) in typeList" :key="index" :style="{'margin-left': index > 0 ? '20px' : ''}">{{item.text}}：{{item.count}}</span>）</span>
                        <el-button type="primary" @click="chooseDatabase">从题库中选择</el-button>
                    </div>
                </div>
                <el-table
                    :data="info.Questions"
                    :header-cell-style="$tableStyle"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="试题编号"
                        width="140"
                        align="center"
                        prop="SerialNumber"
                    ></el-table-column>
                    <el-table-column
                        label="题型"
                        width="110"
                        align="center"
                        prop="TypeName"
                    ></el-table-column>
                    <el-table-column
                        label="题干"
                        prop="Content"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        label="操作"
                        width="110"
                        align="center"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-button type="text" @click="previewQuestions(row)">查看</el-button>
                            <el-button type="text" @click="info.Questions.splice($index, 1)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                >提交</el-button
            >
        </div>
        <previewQuestions ref="previewQuestions"></previewQuestions>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import previewQuestions from './previewQuestions.vue';
const defaultInfo = {
    Title: '', // 标题
    ContestDate: '', // 竞赛答题日期 
    Duration: '', // 答题时限（分钟） 
    SimulatedStartDate: '', // 模拟答题开始日期 
    SimulatedEndDate: '', // SimulatedEndDate
    QuestionCount: '', // 竞赛题数
    Questions: [], // 竞赛题库集合
	SecurityLevel: '1', // 安全等级
    date: ''
    /**
     * {
     * ContestQuestionId: '', // 竞赛题库ID
     * TypeCode: '', 
     * TypeName: '', // 题型名称
     * SerialNumber: '', // 试题编号 
     * Content: '', // 题干
     * }
     */
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'page-info',
    components: {
        previewQuestions
    },
    mixins: [request_mixin],
    data() {
        const that = this;
        const dateValidator = (rule, val, callback) => {
            if (!this.info.SimulatedStartDate) {
                callback(new Error('请选择模拟答题开始日期'))
            } else if (!this.info.SimulatedEndDate) {
                callback(new Error('请选择模拟答题结束日期'))
            } else {
                callback();
            }
        }
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
				SecurityLevel:  [{required: true, message: '请选择安全等级', trigger: ['change', 'blur']}],
                Title: [{required: true, message: '请输入标题', trigger: ['change', 'blur']}],
                ContestDate: [{required: true, message: '请选择竞赛答题日期', trigger: ['change', 'blur']}],
                Duration: [
                    {required: true, message: '请输入答题时限（分钟）', trigger: ['change', 'blur']},
                    {
                        validator(rule, val, callback) {
                            if (!/^\d+$/.test(val)) {
                                callback(new Error('请输入正确的答题时限（分钟）'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                QuestionCount: [
                    {required: true, message: '竞赛题目数', trigger: ['change', 'blur']},
                    {
                        validator(rule, val, callback) {
                            if (!/^\d+$/.test(val)) {
                                callback(new Error('请输入正确的竞赛题目数'));
                            } else if (val > that.info.Questions.length) {
                                callback(new Error('竞赛题目数不能大于选择的题目数'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                Questions: [{type: 'array', required: true, message: '请选择模拟答题结束日期', trigger: ['change', 'blur']}],
                date: [
                    {
                        required: true,
                        message: '请选择模拟答题日期',
                        validator: dateValidator,
                        trigger: ['change', 'blur']
                    }
                ]
            },
            TypeCom: [],
        }
    },
    watch: {
        'info.date'(val) {
            let date = val.split(',');
            this.info.SimulatedStartDate = date[0] || '';
            this.info.SimulatedEndDate = date[1] || '';
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : '新增'
        },
        typeList() {
            this.TypeCom.forEach(item => {
                item.count = this.info.Questions.filter(question => question.TypeCode == item.id).length;
            });
            return this.TypeCom;
        }
    },
    mounted() {
        this.Get("/GetQuestionTypeCom").then((res) => {
            if (res.status == 2000) {
                this.TypeCom = res.data.map(item => {
                    item.count = 0;
                    return item;
                });
            }
        });
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.KnowledgeContestId;
                try {
                    let res = await this.Get(`/GetKnowledgeContest?KnowledgeContestId=${item.KnowledgeContestId}`)
                    if (res.status == 2000) {
                        res.data.date = [res.data.SimulatedStartDate, res.data.SimulatedEndDate].join(',');
                        this.info = Object.assign(_extends(defaultInfo), res.data);
						this.info.SecurityLevel = this.info.SecurityLevel.toString()
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
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        save() {
            this.$refs.form.validate(async (valid, fields) => {
                for (let key in fields) {
                   if (this.$refs[key]) {
                       this.$refs.scrollbar.wrap.scrollTop = this.$refs[key].$el.offsetTop;
                       break;
                   }
                }
                if (valid) {
                   this.submitLoading = true;
                   try {
                      let params = {
                        ...this.info
                      }
					  params.SecurityLevel = parseInt(params.SecurityLevel)
                      let res = await this.Post('/SaveKnowledgeContest', params)
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
                }
            })
        },
        chooseDatabase() {
            this.$chooseCompetitionQuestions({
                single: false,
                choosed: this.info.Questions,
            }).then(res => {
                this.info.Questions = res;
            })
        },
        previewQuestions(row) {
            this.$refs.previewQuestions.show(row);
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
        }
        .el-date-editor,
        .el-select{
            width: 100%;
        }
        .form-2-col{
            display: flex;
            >div{
                width: 50%;
                &:first-child{
                    margin-right: 40px;
                }
            }
        }
        .split-line{
            &::before{
                content: '';
                display: block;
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        .date-range{
            width: 100%;
        }
        .title{
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 600;
            &::before{
                content: '';
                margin-right: 8px;
                border-radius: 2px;
                width: 5px;
                height: 16px;
                background: $--color-primary;
            }
        }
        .el-table{
            margin-top: 10px;
        }
    }
</style>