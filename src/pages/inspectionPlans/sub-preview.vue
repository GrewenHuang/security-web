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
                <div class="form-2-col form-item">
                    <div class="f">
                        <div class="label">检查计划名称：</div>
                        <div>{{ info.InspectionPlanName }}</div>
                    </div>
                    <div class="f">
                        <div class="label">检查表：</div>
                        <div>{{ info.InspectionName }}</div>
                    </div>
                </div>
                <div class="form-2-col form-item">
                    <div class="f">
                        <div class="label">检查类型：</div>
                        <div>{{ info.InspectionNatureName }}</div>
                    </div>
                    <div class="f" v-if="info.InspectionNatureCode == '0030401'">
                        <div class="label">检查日期：</div>
                        <div>{{ info.InspectionPlanDate | format('yyyy-MM-dd') }}</div>
                    </div>
                    <div v-else></div>
                </div>
                <div class="split-line"></div>
                <div class="title">被检查企业/检查人</div>
                <el-table
                    :data="info.Enterprises"
                    :header-cell-style="$tableStyle"
                >
                    <el-table-column
                        type="index"
                        align="center"
                        width="80"
                        label="序号"
                    ></el-table-column>
                    <el-table-column
                        label="检查企业"
                        align="center"
                        prop="EnterpriseName"
                    ></el-table-column>
                    <el-table-column
                        label="检查人"
                        align="center"
                        width="400"
                        show-overflow-tooltip
                    >
                        <template slot-scope="{ row }">
                            {{ row.EnterpriseUsers.map(item => item.UserName).join('、') }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </el-scrollbar>
        <chooseInspections ref="chooseTable" :single="true"/>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import chooseInspections from '@/pages/dataBase/inspections/choose-inspections';
import Qs from 'qs';
const defaultInfo = {
    InspectionPlanName: '',
    InspectionId: '',
    InspectionNatureCode: '',
    InspectionNatureName: '',
    InspectionPlanDate: '',
    InspectionName: '',
    InspectionId: '',
    Enterprises: [],
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    components: {
        chooseInspections
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            list: [], // 检查周期
            userNames: '',
            rules: {
                InspectionPlanName: [
                    {required:true, message: '请输入检查计划', trigger: ['change', 'blur']},
                ],
                InspectionId: [
                    {required: true, message: '请选择检查表', trigger: ['change', 'blur']},
                ],
                InspectionNatureCode: [
                    {required: true, message: '请选择检查类型', trigger: ['change', 'blur']},
                ],
                InspectionPlanDate: [
                    {required: true, message: '请选择检查日期', trigger: ['change', 'blur']},
                ],
                Enterprises: [
                    {type: 'array', required: true, message: '请添加被检查企业', trigger: ['change', 'blur']},
                ]
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : '新增'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            await this.getInspectionNatureCom();
            if (item) {
                this.loading = true;
                this.id = item.InspectionPlanId;
                try {
                   let res = await this.Get(`/GetInspectionPlan?inspectionPlanId=${this.id}`)
                   if (res.status == 2000) {
                       this.info = Object.assign(_extends(defaultInfo), res.data);
                       this.userNames = this.info.Enterprises.map(item => item.EnterpriseUsers.map(user => user.UserName).join(',')).join('');
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
            this.userNames = '';
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
                      let res = await this.Post('/SaveInspectionPlan', params)
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
        async getInspectionNatureCom() {
            let res = await this.Get('/GetInspectionNatureCom');
            if (res.status == 2000) {
                this.list = res.data;
            };
            return Promise.resolve();
        },
        natureChange() {
            let item = this.list.find(item => item.id == this.info.InspectionNatureCode);
            this.info.InspectionNatureName = item.text;
        },
        chooseTable() {
            this.$refs.chooseTable.show().then(res => {
                this.info.InspectionName = res.InspectionName;
                this.info.InspectionId = res.InspectionId;
            });
        },
        chooseUser() {
            let userInfo = Qs.parse(localStorage.getItem('userinfo'));
            let enterpriseId = userInfo.EnterpriseID;
            let choosed = (this.info.Enterprises[0] || {}).EnterpriseUsers || [];
            this.$chooseUser({
                choosed: choosed,
            }).then(res => {
                this.userNames = res.map(item => item.UserName).join(',');
                this.info.Enterprises = [{
                    EnterpriseId: enterpriseId,
                    EnterpriseUsers: res,
                }]
            });
        },
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
                margin: 25px -25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        .title{
            display: flex;
            align-items: center;
            margin-bottom: 10px ;
            font-weight: 600;
            font-size: 16px;
            &::before{
                content: '';
                border-radius: 2px;
                margin-right: 8px;
                width: 5px;
                height: 16px;
                background: $__color-primary;
            }
        }
        .form-item{
            border-bottom: 1px solid #EFEFEF;
            padding: 15px 0;
            .label{
                margin-right: 15px;
                width: 100px;
                text-align: right;
                font-weight: 600;
            }
        }
    }
</style>