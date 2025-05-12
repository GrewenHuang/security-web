<template>
    <el-dialog v-dialog-drag 
        class="occupational-hazards-desclaration-add"
        :title="title"
        :visible.sync="isShow"
        @close="close"
        width="210mm"
        top="50px"
        :append-to-body="true"
    >
        <el-scrollbar class='scrollbar'>
            <el-form
                :rules="rules"
                class="container"
                ref="form"
                :model="info"
            >
                <el-form-item label="职业病危害因素名称" prop="OccupationalHazardName">
                    <el-input v-model.trim="info.OccupationalHazardName" placeholder="请输入" :disabled="isPreview"></el-input>
                </el-form-item>
                <el-form-item label="检测结果及危害程度" prop="TestResultHazardDegree">
                    <el-input v-model.trim="info.TestResultHazardDegree" placeholder="请输入" :disabled="isPreview"></el-input>
                </el-form-item>
                <div class="form-col">
                    <el-form-item label="检测时间" prop="TestedDate">
                        <div class="el-input">
                            <el-date-picker v-model="info.TestedDate"
                                style="width: 100%;"
                                type="date"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd"
                                :disabled="isPreview"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="被检测岗位" prop="TestedPost">
                        <el-input  v-model.trim="info.TestedPost" placeholder="请输入" :disabled="isPreview"></el-input>
                    </el-form-item>
                </div>
                <div class="form-col">
                    <el-form-item label="申报系统名称" prop="DeclarationFilingName">
                        <el-input v-model.trim="info.DeclarationFilingName" placeholder="请输入" :disabled="isPreview"></el-input>
                    </el-form-item>
                    <el-form-item label="申报时间" prop="DeclarationFilingDate">
                        <div class="el-input">
                            <el-date-picker v-model="info.DeclarationFilingDate"
                                style="width: 100%;"
                                type="date"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd"
                                :disabled="isPreview"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item label="通过情况" prop="IsPass">
                    <div class="el-input">
                        <el-radio-group v-model="info.IsPass" :disabled="isPreview">
                            <el-radio-button  label="1" name="isPass">通过</el-radio-button>
                            <el-radio-button  label="0" name="isPass">未通过</el-radio-button>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="备注" prop="Remark">
                    <el-input type="textarea" resize="none" :disabled="isPreview" v-model.trim="info.Remark" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button
                type="primary"
                @click="submit()"
                :loading="isSaveLoading"
            >保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import formatter_mixin from "@/mixins/formatter-mixin.js";
let dateTimeFormate = formatter_mixin.methods.dateTimeFormate;
const defaultInfo = {
    OccupationalHazardName: '', // 职业病危害因素名称
    TestResultHazardDegree: '', // 检查结果及危害程度
    TestedDate: '', // 检测时间
    TestedPost: '', // 被检测岗位
    DeclarationFilingName: '', // 申报系统名称、备案部门 
    DeclarationFilingDate: '', // 申报时间、备案上报时间
    IsPass: '', // 是否通过
    Remark: '', // 备注
}

export default {
    mixins: [request_mixin, formatter_mixin],
    components: {
    },
    data() {
        return {
            isShow: false,
            info: Object.assign({}, defaultInfo),
            isSaveLoading: false,
            id: '',
            rules: {
                
            },
            isPreview: false, // 是否为查看
        };
    },
    filters: {
        dateTimeFormate
    },
    created() {
    },
    computed: {
        title() {
            return this.isPreview ? '查看' : this.id ? '编辑' : '新增'
        }
    },
    methods: {
        async show(item, isPreview) {
            const loading = this.$loading({
                lock: true,
                text: '数据加载中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'transparent'
            });
            this.isPreview = !!isPreview;
            if (item) {
                this.id = item.OccupationalHazardRecordId;
                let res = await this.Get("/GetOccupationalHazardRecord", { occupationalHazardRecordId : item.OccupationalHazardRecordId  });
                res.data.IsPass = res.data.IsPass + '';
                this.info = res.data;
            }
            this.isShow = true;
            loading.close();
        },
        close() {
            this.isShow = false;
            this.$nextTick(() => {
                this.reset();
            })
        },
        reset() {
            this.isSaveLoading = false;
            this.id = '';
            this.info = Object.assign({}, defaultInfo);
        },
        getParams() {
            let params = Object.assign({
                OccupationalHazardRecordType: 1
            }, this.info);
            return params;
        },
        async submit() {
            this.$refs.form.validate(async valid => {
                if (!valid) return;
                const loading = this.$loading({
                    lock: true,
                    text: '保存中,请稍等...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let res = await this.Post('/SaveOccupationalHazardRecord', this.getParams());
                if (res.status === 2000) {
                    this.close();
                    this.$emit('success');
                    this.$message.success('保存成功');
                } else {
                    this.$message.error(res.message);
                }
                loading.close();
            })
        },
    },
};
</script>

<style lang="scss" scoped>
.occupational-hazards-desclaration-add {
    color: #000;
    .container {
        padding: 29px 40px 38px 9px;
    }
    /deep/ textarea{
        height: 130px;
    }
}
</style>
