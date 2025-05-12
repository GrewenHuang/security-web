<template>
    <el-dialog v-dialog-drag  
        class="related-party-accidents-add"
        :title="title"
        :visible.sync="isShow"
        @close="close"
        width="1100px"
        top="50px"
        :append-to-body="true"
    >
        <el-scrollbar class="scrollbar">
            <div class="container">
                <el-form
                    :rules="rules"
                    ref="form"
                    :model="info"
                >
                    <div class="form-col">
                        <el-form-item label="档案编号" prop="FileNo">
                            <el-input v-model.trim="info.FileNo" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                        <el-form-item label="事件日期" prop="AccidentDate">
                            <div class="el-input">
                                <el-date-picker v-model="info.AccidentDate" :disabled="isPreview"
                                    type="date"
                                    placeholder="请选择"
                                    value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="事件当事人" prop="AccidentParty">
                            <el-input v-model.trim="info.AccidentParty" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                        <el-form-item label="其他工作人员" prop="OtherStaff">
                            <el-input v-model.trim="info.OtherStaff" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="事件地点" prop="AccidentLocation">
                            <el-input v-model.trim="info.AccidentLocation" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                        <el-form-item label="事件性质" prop="AccidentNature">
                            <el-input v-model.trim="info.AccidentNature" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="事件责任" prop="AccidentLiability">
                            <el-input v-model.trim="info.AccidentLiability" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                        <el-form-item label="事件类别" prop="AccidentCategory">
                            <el-input v-model.trim="info.AccidentCategory" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <el-divider></el-divider>
                    <div class="form-col">
                        <el-form-item label="接报时间" prop="ReceivingDate">
                            <div class="el-input">
                                <el-date-picker v-model="info.ReceivingDate" :disabled="isPreview"
                                    type="date"
                                    placeholder="请选择"
                                    value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="接报人" prop="ReceivingBy">
                            <el-input v-model.trim="info.ReceivingBy" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="报告人" prop="ReporterBy">
                            <el-input v-model.trim="info.ReporterBy" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                        <el-form-item label="相关方名称" prop="RelatedPartyName">
                            <el-input v-model.trim="info.RelatedPartyName" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col"> 
                        <el-form-item label="损伤货物(设备)" prop="DamageGoods">
                            <el-input v-model.trim="info.DamageGoods" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                        <el-form-item label="事件发生地点" prop="AccidentLocations">
                            <el-input v-model.trim="info.AccidentLocations" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="受伤人数" prop="InjuredNumber">
                            <el-input v-model.trim="info.InjuredNumber" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                        <el-form-item label="死亡人数" prop="DeathNumber">
                            <el-input v-model.trim="info.DeathNumber" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="结案日期" prop="CloseDate">
                           <div class="el-input">
                                <el-date-picker v-model="info.CloseDate" :disabled="isPreview"
                                    type="date"
                                    placeholder="请选择"
                                    value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                           </div>
                        </el-form-item>
                        <el-form-item label="责任认定" prop="AccidentResponsibility">
                            <el-input v-model.trim="info.AccidentResponsibility" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="经济损失总额" prop="EconomicLossTotal">
                            <el-input v-model.trim="info.EconomicLossTotal" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                        <el-form-item label="企业承担(元)" prop="EnterpriseUndertaken">
                            <el-input v-model.trim="info.EnterpriseUndertaken" placeholder="请输入" :disabled="isPreview"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="事件原因及基本情况" prop="Remark">
                        <el-input type="textarea" resize="none" v-model.trim="info.Remark" placeholder="请输入" :disabled="isPreview"></el-input>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <el-form>
                    <div class="form-col">
                        <el-form-item label="事件接案记录" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 0);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 0);
                                        }
                                    "
                                    :file-list="arrFilesFun(0)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="责任认定书" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 1);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 1);
                                        }
                                    "
                                    :file-list="arrFilesFun(1)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="事件现场处置过程材料" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :disabled="isPreview"
                                    :before-upload="before"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 2);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 2);
                                        }
                                    "
                                    :file-list="arrFilesFun(2)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="第三者证明材料" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 3);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 3);
                                        }
                                    "
                                    :file-list="arrFilesFun(3)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="公司事件调查报告" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 4);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 4);
                                        }
                                    "
                                    :file-list="arrFilesFun(4)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="公司事件分析处理处罚通报" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 5);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 5);
                                        }
                                    "
                                    :file-list="arrFilesFun(5)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="事件罚款收据" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 6);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 6);
                                        }
                                    "
                                    :file-list="arrFilesFun(6)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="保险公司理赔单" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 7);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 7);
                                        }
                                    "
                                    :file-list="arrFilesFun(7)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="责任人事件认定材料" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 8);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 8);
                                        }
                                    "
                                    :file-list="arrFilesFun(8)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="事件收支报告" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 9);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 9);
                                        }
                                    "
                                    :file-list="arrFilesFun(9)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="事件防范措施" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 10);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 10);
                                        }
                                    "
                                    :file-list="arrFilesFun(10)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="事件调查组成员" prop="Result" :disabled="isPreview">
                            <div class="el-input">
                                <el-upload :action="url()"
                                    class='el-upload'
                                    list-type="picture-card"
                                    :accept="upload.image_suffix"
                                    :before-upload="before"
                                    :disabled="isPreview"
                                    :on-change="
                                        (file, fileList) => {
                                        change(file, 11);
                                        }
                                    "
                                    :before-remove="
                                        (file, fileList) => {
                                        return before_remove(file, 11);
                                        }
                                    "
                                    :file-list="arrFilesFun(11)"
                                    :on-preview="preview"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                    <el-form-item label="其他材料" prop="Result" :disabled="isPreview">
                        <div class="el-input">
                            <el-upload :action="url()"
                                class='el-upload'
                                list-type="picture-card"
                                :accept="upload.image_suffix"
                                :before-upload="before"
                                :disabled="isPreview"
                                :on-change="
                                    (file, fileList) => {
                                    change(file, 12);
                                    }
                                "
                                :before-remove="
                                    (file, fileList) => {
                                    return before_remove(file, 12);
                                    }
                                "
                                :file-list="arrFilesFun(12)"
                                :on-preview="preview"
                            >
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button
                type="primary"
                @click="submit()"
                :loading="isSaveLoading"
                v-if="!isPreview"
            >保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import formatter_mixin from "@/mixins/formatter-mixin.js";
import RULECONFIG from "@/common/ruleConfig";
import upload_mixin from "@/mixins/upload-mixin.js";
const defaultInfo = {
    FileNo: '', // 档案编号 
    AccidentDate: '', // 事件日期  
    AccidentParty: '', // 事件当事人 
    OtherStaff: '', // 其他工作人员 
    AccidentLocation: '', // 事件地点  
    AccidentNature: '', // 事件性质  
    AccidentLiability: '', // 事件责任 
    AccidentCategory: '', // 事件类别 
    ReceivingDate: '', // 接报时间  
    ReceivingBy: '', // 接报人 
    ReporterBy: '', // 报告人  
    RelatedPartyName: '', // 相关方名称  
    DamageGoods: '', // 损伤货物 
    AccidentLocations: '', // 事件发生地点 
    InjuredNumber: '', // 受伤人数  
    DeathNumber: '', // 死亡人数  
    CloseDate: '', // 结案日期 
    AccidentResponsibility: '', // 责任认定  
    EconomicLossTotal: '', // 经济损失总额  
    EnterpriseUndertaken: '', // 企业承担 
    Remark: '', // 事件原因及基本情况 
    RelatedPartyAccidentFiles1: [], // 事件接案记录 
    RelatedPartyAccidentFiles2: [], // 责任认定书
    RelatedPartyAccidentFiles3: [], // 事件现场处置过程材料 
    RelatedPartyAccidentFiles4: [], // 第三者证明材料
    RelatedPartyAccidentFiles5: [], // 公司事件调查报告
    RelatedPartyAccidentFiles6: [], // 公司事件分析处理处罚通报 
    RelatedPartyAccidentFiles7: [], // 事件罚款收据
    RelatedPartyAccidentFiles8: [], // 保险公司理赔单
    RelatedPartyAccidentFiles9: [], // 责任人事件认定材料
    RelatedPartyAccidentFiles10: [], // 事件收支报告 
    RelatedPartyAccidentFiles11: [], // 事件防范措施 
    RelatedPartyAccidentFiles12: [], // 事件调查组成员 
    RelatedPartyAccidentFiles13: [], // 其他资料
}

export default {
    name: "related-party-accidents-add",
    mixins: [request_mixin, formatter_mixin, upload_mixin],
    components: {
    },
    data() {
        return {
            isShow: false,
            info: Object.assign({}, defaultInfo),
            isSaveLoading: false,
            id: '',
            rules: {
                ShipId: RULECONFIG.Select('事件船名'),
                AccidentDate: RULECONFIG.Select('发生日期'),
            },
            personnelShow: false,
            accidentlevelList: [], // 事件级别集合
            whetherList: [],// 是否集合
            isPreview: false,
        };
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
            await this.getAccidentlevelCom();
            await this.getWhether();
            this.isPreview = !!isPreview;
            if (item) {
                this.id = item.RelatedPartyAccidentId;
                let res = await this.Get("/GetRelatedPartyAccident", {relatedPartyAccidentId: item.RelatedPartyAccidentId});
                this.info = res.data;
                this.setFeils();
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
            this.upload.arrFiles = [
                [], [], [], [], [],
                [], [], [], [], [],
                [], [], [], [], [],
            ];
        },
        getParams() {
            this.setFeils(true);
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
                let res = await this.Post('/SaveRelatedPartyAccident', this.getParams());
                if (res.status === 2000) {
                    this.close();
                    this.$emit('success');
                    this.$message.success('保存成功');
                }
                loading.close();
            })
        },
        async getAccidentlevelCom() {
            let res = await this.Get('/GetAccidentlevelCom');
            this.accidentlevelList = res.data;
            return Promise.resolve(true);
        },
        async getWhether() {
            let res = await this.Get('/GetWhether');
            this.whetherList = res.data;
            return Promise.resolve(true);
        },
        setFeils(isSend) {
            let list1 = [
                'RelatedPartyAccidentFiles1',
                'RelatedPartyAccidentFiles2',
                'RelatedPartyAccidentFiles3',
                'RelatedPartyAccidentFiles4',
                'RelatedPartyAccidentFiles5',
                'RelatedPartyAccidentFiles6',
                'RelatedPartyAccidentFiles7',
                'RelatedPartyAccidentFiles8',
                'RelatedPartyAccidentFiles9',
                'RelatedPartyAccidentFiles10',
                'RelatedPartyAccidentFiles11',
                'RelatedPartyAccidentFiles12',
                'RelatedPartyAccidentFiles13',
            ];
            let list2 = this.upload.arrFiles;
            if (isSend) {
                list1.forEach((key, index) => {
                    this.info[key] = list2[index];
                });
            } else {
                list2.forEach((item, index) => {
                    this.upload.arrFiles[index] = this.info[list1[index]];
                })
            }
        }
    },
    async created() {
    },
    mounted() {
        this.upload.arrFiles = [
            [], [], [], [], [],
            [], [], [], [], [],
            [], [], [], [], [],
        ];
    },
};
</script>

<style lang="scss" scoped>
.related-party-accidents-add {
    color: #000;
    .container {
        padding: 29px 35px 38px 0;
    }
    /deep/ textarea{
        height: 130px;
    }
    [disabled="disabled"] /deep/ .el-upload--text,
    [disabled="disabled"] /deep/ .el-upload-list__item:hover .el-upload-list__item-status-label,
    [disabled="disabled"] /deep/ .el-upload .el-upload--picture-card,
    [disabled="disabled"] /deep/ .el-upload-list__item-status-label{
        display: none;
    }
    /deep/ .el-divider--horizontal{
        margin: 10px 0 30px;
    }
    .el-date-editor{
        width: 100%;
    }
}
</style>