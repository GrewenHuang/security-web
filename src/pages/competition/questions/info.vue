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
            <el-form ref="form" label-position="top" :model="info" :rules="rules" v-if="!isPreview">
                <div class="form-2-col">
                    <el-form-item label="题型" prop="TypeCode" ref="TypeCode">
                        <el-select placeholder="请选择" v-model="info.TypeCode" @change="typeChange">
                            <el-option v-for="(item, index) in TypeCom" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="试题编号" prop="SerialNumber" ref="SerialNumber">
                        <el-input placeholder="请输入" v-model="info.SerialNumber" ></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="题干" prop="Content" ref="Content">
                    <el-input placeholder="请输入" v-model="info.Content"></el-input>
                </el-form-item>
                <div class="split-line"></div>
                <el-form-item prop="ContestAnswers" ref="ContestAnswers">
                    <div>
                        <div class="title">候选项</div>
                    </div>
                    <el-table
                        :data="info.ContestAnswers"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column
                            label="选项"
                            width="80"
                            align="center"
                        >
                            <template slot-scope="{ $index}">
                                {{ $index | formatLetter }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="内容"
                        >
                            <template slot-scope="{ row }">
                                <el-input placeholder="请输入" v-model="row.Answer"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="正确选项"
                            align="center"
                            width="120"
                        >
                            <template slot-scope="{ row }">
                                <el-checkbox :true-label="1" :false-label="0" v-model="row.IsCorrect" @change="answerCorrectChange(row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="90"
                        >
                            <template slot-scope="{ $index }">
                                <el-button type="text" text-plain v-if="$index < 2">删除</el-button>
                                <el-button type="text" @click="info.ContestAnswers.splice($index, 1)" v-else>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button class="answer-btn" type="primary" plain @click="add">添加</el-button>
                </el-form-item>
                <div class="split-line"></div>
                <el-form-item
                    label="答案解析"
                >
                    <el-input type="textarea" placeholder="请输入" v-model="info.Explain"></el-input>
                </el-form-item>
            </el-form>
            
            <el-form v-else>
                <div class="form-col bt">
                    <div>
                        <div class="label">题型</div>
                        <div>{{ info.TypeName }}</div>
                    </div>
                    <div>
                        <div class="label">试题编号</div>
                        <div>{{ info.SerialNumber }}</div>
                    </div>
                </div>
                <div class="form-col bt">
                    <div>
                        <div class="label">题干</div>
                        <div>{{ info.Content }}</div>
                    </div>
                </div>
                <div class="split-line"></div>
                <div>
                    <div class="title">候选项</div>
                </div>
                <el-table
                    :data="info.ContestAnswers"
                    :header-cell-style="$tableStyle"
                >
                    <el-table-column
                        label="选项"
                        width="80"
                        align="center"
                    >
                        <template slot-scope="{ $index}">
                            {{ $index | formatLetter }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="内容"
                        prop="Answer"
                    >
                    </el-table-column>
                    <el-table-column
                        label="正确选项"
                        align="center"
                        width="120"
                    >
                        <template slot-scope="{ row }">
                            <el-checkbox :true-label="1" :false-label="0" v-model="row.IsCorrect" disabled></el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="form-col" style="margin-top: 10px;">
                    <div>
                        <div class="label">答案解析</div>
                        <div>{{ info.Explain }}</div>
                    </div>
                </div>
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
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
const defaultItem = {
    Answer: '',
    IsCorrect: ''
};
const defaultInfo = {
    TypeCode: '',
    TypeName: '',
    SerialNumber: '',
    Content: '',
    Explain: '',
    ContestAnswers: [_extends(defaultItem), _extends(defaultItem), _extends(defaultItem), _extends(defaultItem)],
}
export default {
    mixins: [request_mixin],
    props: {
        isPreview: {
            type: Boolean,
            default: false
        },
        IsPrivate: 0
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            TypeCom: [],
            info: _extends(defaultInfo),
            rules: {
                TypeCode: [{required: true, message: '请选择题型', trigger: ['change', 'blur']}],
                Content: [{required: true, message: '请选择题干', trigger: ['change', 'blur']}],
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isPreview ? '查看' : this.isEdit ? '编辑' : '新增'
        }
    },
    filters: {
        formatLetter(num) {
            let code = 'A'.charCodeAt(0);
            return String.fromCharCode(code + num);
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.ContestQuestionId;
                try {
                   let res = await this.Get(`/GetContestQuestion?ContestQuestionId=${item.ContestQuestionId}`)
                   if (res.status == 2000) {
                       this.info = Object.assign(_extends(defaultInfo), res.data);
                       this.info.TypeCode = this.info.TypeCode + '';
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
                this.$refs.form && this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        async close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
            await this.generateSerialNumber();
            this.setDefaultType();
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
                    if (this.info.ContestAnswers.every(item=>item.IsCorrect==0)){
                        this.$message.warning('请设置正确选项');
                        this.$refs.scrollbar.wrap.scrollTop = this.$refs['ContestAnswers'].$el.offsetTop;
                        return;
                    } else if (this.info.ContestAnswers.some(item => item.Answer == '')) {
                        this.$message.warning('请设置候选项内容');
                        this.$refs.scrollbar.wrap.scrollTop = this.$refs['ContestAnswers'].$el.offsetTop;
                        return;
                    } else if (this.info.TypeName == '多选题' && this.info.ContestAnswers.length <= 2 ) {
                        this.$message.warning('多选题的候选项需大于2');
                        this.$refs.scrollbar.wrap.scrollTop = this.$refs['ContestAnswers'].$el.offsetTop;
                        return;
                    } else if (this.info.TypeName == '多选题' && this.info.ContestAnswers.filter(item=>item.IsCorrect).length < 2 ) {
                        this.$message.warning('多选题的正确项需大于1');
                        this.$refs.scrollbar.wrap.scrollTop = this.$refs['ContestAnswers'].$el.offsetTop;
                        return;
                    }
                    this.submitLoading = true;
                    try {
                        let params = {
                        IsPrivate: this.IsPrivate,
                        ...this.info
                        }
                        let res = await this.Post('/SaveContestQuestion', params)
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
        async generateSerialNumber() {
            let res = await this.Get('/GetContestSerialNumber');
            if (res.status == 2000) {
                this.info.SerialNumber = res.data;
            }
            return Promise.resolve(true);
        },
        setDefaultType() {
            this.TypeCom.forEach(item => {
                if (item.text === '单选题') {
                    this.info.TypeCode = item.id;
                    this.info.TypeName = item.text;
                }
            });
        },
        typeChange() {
            this.TypeCom.forEach(item => {
                if(this.info.TypeCode == item.id) {
                    this.info.TypeName = item.text;
                }
            });
            if(this.info.TypeName == '判断题') {
                this.info.ContestAnswers = [_extends(defaultItem), _extends(defaultItem)];    
            } else {
                this.info.ContestAnswers = [_extends(defaultItem), _extends(defaultItem), _extends(defaultItem), _extends(defaultItem)];
            }
        },
        answerCorrectChange(item) {
            let list = this.info.ContestAnswers;
            switch(this.info.TypeName) {
                case '单选题' : 
                case '判断题' : 
                    list.forEach(cItem => {
                        cItem.IsCorrect = 0;
                    });
                    item.IsCorrect = 1;
                    break;
                case '多选题' : 
                
                
            }
        },
        add() {
            this.info.ContestAnswers.push(_extends(defaultItem));
        }
    },
    mounted() {
        this.Get("/GetQuestionTypeCom").then((res) => {
            if (res.status == 2000) {
                this.TypeCom = res.data;
                this.setDefaultType();
            }
        });
        this.generateSerialNumber();
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
        .answer-btn{
            border-style: dashed;
            margin-top: 10px;
            width: 100%;
        }
        .el-table{
            line-height: 1;
        }
        .title{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 600;
            &::before{
                content: '';
                border-radius: 2px;
                margin-right: 8px;
                width: 5px;
                height: 16px;
                background: $--color-primary;
            }
        }
    }
</style>
