<template>
    <el-dialog
        class="violation-record-add"
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
                label-width="120px"
                ref="form"
                :model="info"
            >
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="船名" prop="ShipId">
                            <el-select v-model="info.ShipId" placeholder="请选择">
                                <el-option
                                    v-for="(item, index) in shipList"
                                    :key="index"
                                    :label="item.ShipName"
                                    :value="item.ShipId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="违法违章情况" prop="Content">
                            <el-input type="textarea" resize="none" v-model.trim="info.Content" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="处理结果" prop="Result">
                            <el-input type="textarea" resize="none" v-model.trim="info.Result" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
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
import RULECONFIG from "@/common/ruleConfig";
let dateTimeFormate = formatter_mixin.methods.dateTimeFormate;
const defaultInfo = {
    ShipId: '', // 船名
    Content: '', // 违法违章内容 
    Result: '', // 处理结果 ,
}

export default {
    name: "violation-record-add",
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
                ShipId: RULECONFIG.Select('船名')
            },
            personnelShow: false,
            shipList: [], // 船舶数据
        };
    },
    filters: {
        dateTimeFormate
    },
    created() {
    },
    computed: {
        title() {
            return this.id ? '编辑' : '新增'
        }
    },
    methods: {
        async show(item) {
            const loading = this.$loading({
                lock: true,
                text: '数据加载中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'transparent'
            });
            await this.getShip();
            if (item) {
                this.id = item.ViolationRecordId;
                let res = await this.Get("/GetViolationRecord", { violationRecordId : item.ViolationRecordId  });
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
            let params = Object.assign({}, this.info);
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
                let res = await this.Post('/SaveViolationRecord', this.getParams());
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
        async getShip() {
            let res = await this.Post('/GetShips', {rows: 99999});
            this.shipList = res.data.list;
            return Promise.resolve(true);
        }
    },
};
</script>

<style lang="scss" scoped>
.violation-record-add {
    color: #000;
    .container {
        padding: 29px 35px 38px 0;
    }
    /deep/ textarea{
        height: 130px;
    }
}
</style>