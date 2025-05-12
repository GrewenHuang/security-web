<template>
    <el-dialog v-dialog-drag 
        class="health-records-add"
        :title="title"
        :visible.sync="isShow"
        @close="close"
        width="80%"
        top="50px"
        :append-to-body="true"
    >
        <el-scrollbar class="scrollbar">
            <div class="scrollbar-content">
                <el-form
                    class="container"
                    :rules="rules"
                    ref="form"
                    :model="info"
                >
                    <div class="form-col">
                        <el-form-item label="姓名" prop="UserId">
                            <el-input placeholder="请选择" v-model="info.UserName" readonly>
                                <el-button slot="append" @click="choosePersonel">请选择</el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="ShipId">
                            <el-input placeholder="选择人员自动带入" v-model="info.GenderDesc" readonly></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="出生日期" prop="ShipId">
                            <el-input placeholder="选择人员自动带入" v-model="info.BirthdayDesc" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="工作单位" prop="Company">
                            <el-input v-model="info.Company" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                    <div class="form-col">
                        <el-form-item label="建档日期" prop="CreatedDate">
                            <div class="el-input">
                                <el-date-picker
                                    style="width: 100%;"
                                    v-model="info.CreatedDate"
                                    type="date"
                                    placeholder="请选择"
                                    value-format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="编号" prop="Number">
                            <el-input v-model="info.Number" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <el-form
                    :rules="rules1"
                    ref="form1"
                    :model="info1"
                >
                    <div class="card">
                        <div class="card-header">
                            职业史、既往史和职业病危害接触史
                        </div>
                        <div class="card-body">
                            <el-form-item label="既往病史" prop="PastMedicalHistory">
                                <el-input v-model="info.PastMedicalHistory" placeholder="请输入"></el-input>
                            </el-form-item>
                            <div class="form-col">
                                <el-form-item label="病名" prop="DiseaseName">
                                    <el-input v-model="info.DiseaseName" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="诊断日期" prop="DiagnosisDate">
                                    <div class="el-input">
                                        <el-date-picker
                                            v-model="info.DiagnosisDate"
                                            style="width: 100%;"
                                            type="date"
                                            placeholder="请选择"
                                            value-format="yyyy-MM-dd"
                                        >
                                        </el-date-picker>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="form-col">
                                <el-form-item label="诊断单位" prop="DiagnosisCompany">
                                    <el-input v-model="info.DiagnosisCompany" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="是否治愈" prop="IsCured">
                                    <el-select class="el-input" v-model="info.IsCured">
                                        <el-option
                                            v-for="(item, index) in whetherList"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="title">职业史和职业病危害因素接触史</div>
                            <table class="table-content"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                            >
                                <colgroup>
                                    <col width="183" />
                                    <col width="183" />
                                    <col width="183" />
                                    <col width="183" />
                                    <col width="183" />
                                    <col width="50" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>起止时间</th>
                                        <th>工作单位</th>
                                        <th>工种</th>
                                        <th>有害因素</th>
                                        <th>防护措施</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(item, index) in factorList">
                                        <tr :key="index">
                                            <td>
                                                <el-date-picker v-model="item.startingAndEndTime"
                                                    type="daterange"
                                                    start-placeholder="开始时间"
                                                    end-placeholder="结束时间"
                                                    value-format="yyyy-MM-dd"
                                                >
                                                </el-date-picker>
                                            </td>
                                            <td>
                                                <el-input v-model="item.company" placeholder="请输入"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="item.typeOfWork" placeholder="请输入"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="item.harmfulFactor" placeholder="请输入"></el-input>
                                            </td>
                                            <td>
                                                <el-input v-model="item.protectiveMeasures" placeholder="请输入"></el-input>
                                            </td>
                                            <td>
                                                <el-button @click="removeFactor(index)"
                                                    icon="el-icon-close"
                                                    circle
                                                    type="danger"
                                                    title="删除"
                                                ></el-button>
                                            </td>
                                        </tr>
                                    </template>
                                    <tr>
                                        <td colspan="6">
                                            <el-button
                                                type="primary"
                                                icon="el-icon-plus"
                                                style="width: 100%;"
                                                @click="addFactor"
                                            >新增</el-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            职业史、既往史和职业病危害接触史
                        </div>
                        <div class="card-body">
                            <table class="table-content"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                            >
                                <colgroup>
                                    <col width="180" />
                                    <col width="250" />
                                    <col width="250" />
                                    <col width="250" />
                                    <col width="50" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>检查时间</th>
                                        <th>检查结果</th>
                                        <th>处理结果</th>
                                        <th>备注</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(item, index) in resultList">
                                        <tr :key="index">
                                            <td>
                                                <el-date-picker v-model="item.inspectionTime"
                                                    type="date"
                                                    placeholder="请选择"
                                                    value-format="yyyy-MM-dd"
                                                >
                                                </el-date-picker>
                                            </td>
                                            <td>
                                                <el-input placeholder="请输入" v-model="item.inspectionResult"></el-input>
                                            </td>
                                            <td>
                                                <el-input placeholder="请输入" v-model="item.processingResult"></el-input>
                                            </td>
                                            <td>
                                                <el-input placeholder="请输入" v-model="item.remark"></el-input>
                                            </td>
                                            <td>
                                                <el-button @click="removeResult(index)"
                                                    icon="el-icon-close"
                                                    circle
                                                    type="danger"
                                                    title="删除"
                                                ></el-button>
                                            </td>
                                        </tr>
                                    </template>
                                    <tr>
                                        <td colspan="5">
                                            <el-button
                                                type="primary"
                                                icon="el-icon-plus"
                                                style="width: 100%;"
                                                @click="addResult"
                                            >新增</el-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">职业病诊疗等相关资料</div>
                        <div class="card-body">
                            <el-upload :action="url()"
                                        :accept="upload.image_suffix"
                                        list-type="picture-card"
                                        class='el_upload'
                                        :before-upload="before"
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
                                        :on-preview="preview">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                    </div>
                </el-form>
            </div>
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
import upload_mixin from "@/mixins/upload-mixin.js";
const defaultInfo = {
    UserId: '', // 用户id
    UserName: '', // 用户名
    GenderDesc: '', // 性别
    BirthdayDesc: '', // 出生日期 
    Company: '', // 工作单位 
    CreatedDate: '', // 建档日期 
    Number: '', // 编号
    PastMedicalHistory: '', // 既往病史
    DiseaseName: '', // 病名
    DiagnosisDate: '', // 诊断日期 
    DiagnosisCompany: '', // 诊断单位
    IsCured: '', // 是否治愈
    OccupationalHealthHistoryJson: '', // 职业史和职业病危害因素接触史
    OccupationalHealthResultJson: '', // 职业健康检查结果及处理情况 
    OccupationalFiles: [], // 职业病诊疗附件
}
const factorObj = {
    startingAndEndTime: '', // 起止时间
    company: '', // 工作单位
    typeOfWork: '', // 工种
    harmfulFactor: '', // 有害因素
    protectiveMeasures: '', // 防护措施
}
const resultObj = {
    inspectionTime: '', // 检查时间
    inspectionResult: '', // 检查结果
    processingResult: '', // 处理结果
    remark: '', // 备注
}
export default {
    mixins: [request_mixin, formatter_mixin, upload_mixin],
    components: {
    },
    data() {
        return {
            isShow: false,
            info: Object.assign({}, defaultInfo),
            info1: {},
            isSaveLoading: false,
            id: '',
            rules: {
                UserId: RULECONFIG.Select('姓名')
            },
            rules1: {

            },
            whetherList: [], // 是否数据
            factorList: [], // 危害因素接触史
            resultList: [], // 结果集
        };
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
            await this.getWhether();
            if (item) {
                this.id = item.HealthRecordId;
                let res = await this.Get("/GetHealthRecord", { healthRecordId : item.HealthRecordId  });
                this.info = res.data;
                this.factorList = JSON.parse(this.info.OccupationalHealthHistoryJson);
                this.resultList = JSON.parse(this.info.OccupationalHealthResultJson);
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
            this.upload.arrFiles = [[],[],[],[]];
            this.factorList = [];
            this.resultList = [];
        },
        getParams() {
            this.setFeils(true);
            this.info.OccupationalHealthHistoryJson = JSON.stringify(this.factorList);
            this.info.OccupationalHealthResultJson = JSON.stringify(this.resultList);
            let params = Object.assign({}, this.info);
            return params;
        },
        async submit() {
            this.$refs.form.validate(async valid => {
                this.$refs.form1.validate(async valid1 => {
                    if (!valid || !valid1) return;
                    const loading = this.$loading({
                        lock: true,
                        text: '保存中,请稍等...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let res = await this.Post('/SaveHealthRecord', this.getParams());
                    if (res.status === 2000) {
                        this.close();
                        this.$emit('success');
                        this.$message.success('保存成功');
                    } else {
                        this.$message.error(res.message);
                    }
                    loading.close();
                })
            })
        },
        setFeils(isSend) {
            let list1 = [
                'OccupationalFiles',
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
        },
        choosePersonel() {
            this.$chooseUser({
                single: false,
            }).then(personnel => {
                this.info.UserId = personnel.UserId;
                this.info.UserName = personnel.UserName;
                this.info.BirthdayDesc = personnel.BirthdayDesc;
                this.info.GenderDesc = personnel.GenderDesc;
            })
        },
        async getWhether() {
            let res = await this.Get('/GetWhether');
            this.whetherList = res.data;
            return Promise.resolve(true);
        },
        addFactor() {
            this.factorList.push(Object.assign({}, factorObj));
        },
        removeFactor(index) {
            this.factorList.splice(index, 1);
        },
        addResult() {
            this.resultList.push(Object.assign({}, resultObj));
        },
        removeResult(index) {
            this.resultList.splice(index, 1);
        }
    },
};
</script>

<style lang="scss" scoped>
.health-records-add {
    color: #000;
    .scrollbar /deep/ .el-scrollbar__wrap{
        margin-bottom: 0 !important;
        padding-bottom: 33px;
    }
    /deep/ .el-dialog__body{
        padding: 0 24px !important;
    }
    .container {
        padding: 29px 24px 0 0;
    }
    /deep/ textarea{
        height: 130px;
    }
    /deep/ .el-form-item__label{
        color: #302E37;
    }
    .card{
        border-radius: 6px;
        border: 1px solid #DCDFE6;
        color: #302E37;
        &:not(:first-child) {
            margin-top: 15px;
        }
        .card-header{
            padding: 12px 18px 13px;
            font-size: 18px;
            font-weight: 600;
        }
        .card-body{
            border-top: 1px solid #DCDFE6;
            padding: 20px 18px;
            .title{
                margin-bottom: 15px;
                font-size: 16px;
                font-weight: 600;
            }
        }
        .table-content{
            width: 100%;
            th,td{
                text-align: left;
                padding: 10px;
            }
            th{
                padding: 8px 10px 7px;
            }
            tbody{
                tr:first-child td{
                    border-top: 1px solid #DCDFE6;
                }
                td{
                    background: #F9F9F9;
                }
            }
        }
    }
    /deep/ .el-upload-list__item{
        text-align: left;
    }
    .scrollbar-content{
        padding-right: 10px;
    }
}
</style>
