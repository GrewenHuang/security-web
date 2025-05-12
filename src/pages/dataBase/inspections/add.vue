<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="800px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
        append-to-body
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <el-form-item label="隐患级别" prop="PotentialLevelCode">
                    <el-radio-group v-model="info.PotentialLevelCode" @change="changePitfallLevel">
                        <el-radio-button v-for="(item, index) in pitfallLevel" :key="index" :label="item.id">{{ item.text }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="检查项名称" prop="ItemName">
                    <el-input placeholder="请输入" v-model="info.ItemName" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="检查内容" prop="Describe">
                    <el-input type="textarea" placeholder="请输入" v-model="info.Describe"></el-input>
                </el-form-item>
                <el-form-item label="检查依据" prop="Basis">
                    <el-input type="textarea" placeholder="请输入" v-model="info.Basis"></el-input>
                </el-form-item>
                <el-form-item label="整改建议" prop="Suggestion">
                    <el-input type="textarea" placeholder="请输入" v-model="info.Suggestion"></el-input>
                </el-form-item>
                <el-form-item label="重大隐患判断标准" prop="JudgmentCriteria" v-if="info.PotentialLevelCode == '058001'">
                    <el-input type="textarea" placeholder="请输入" v-model="info.JudgmentCriteria"></el-input>
                </el-form-item>
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
                >确定</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
    ItemName: '', // 检查项名称
    PotentialLevelCode: '', // 隐患级别 id
    PotentialLevelName: '', // 隐患级别 name
    Describe: '', // 检查内容
    Basis: '', // 检查依据
    Suggestion: '', // 整改建议
    JudgmentCriteria: '', // 重大隐患判断标准
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            pitfallLevel: [],
            rules: {
                ItemName: [{required: true, message: '请输入检查项名称', trigger: ['change', 'blur']}],
                PotentialLevelCode: [{required: true, message: '请选择隐患级别', trigger: ['change', 'blur']}],
                Describe: [{required: true, message: '请输入检查内容', trigger: ['change', 'blur']}],
                Suggestion: [{required: true, message: '请输入整改建议', trigger: ['change', 'blur']}],
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '添加检查内容' : '自建检查表'
        }
    },
    methods: {
        async show(itemName) {
            await this.getPitfallLevel();
            this.dislogShow = true;
            if (itemName) {
                this.id = itemName;
                this.loading = true;
                this.info.ItemName = itemName;
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
                   this.$emit('submit', _extends(this.info));
                   this.submitLoading = false;
                   this.close();
                }
            })
        },
        async getPitfallLevel() {
            let res = await this.Get('/GetPotentialLevelCom');
            if (res.status == 2000) {
                this.pitfallLevel = res.data;
            }
            return Promise.resolve();
        },
        changePitfallLevel() {
            let item = this.pitfallLevel.find(item => this.info.PotentialLevelCode == item.id);
            if (item) {
                this.info.PotentialLevelName = item.text;
            }
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
            min-width: 800px;
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
    }
</style>