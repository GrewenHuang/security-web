<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="600px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <div class="el-form">
            <div class="form-item f">
                <div class="label">检查计划名称：</div>
                <div>{{ info.InspectionPlanName }}</div>
            </div>
            <div class="form-item f">
                <div class="label">检查表：</div>
                <div>{{ info.InspectionName }}</div>
            </div>
            <div class="form-item f">
                <div class="label">检查类型：</div>
                <div>{{ info.InspectionNatureName }}</div>
            </div>
            <div class="form-item f" v-if="info.InspectionNatureCode == '0030401'">
                <div class="label">检查日期：</div>
                <div>{{ info.InspectionPlanDate | format('yyyy-MM-dd') }}</div>
            </div>
            <div class="form-item f">
                <div class="label">检查人：</div>
                <div>{{ userNames }}</div>
            </div>
        </div>
        <chooseInspections ref="chooseTable" :single="true"/>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import chooseInspections from '@/pages/dataBase/inspections/choose-inspections';
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
            info: {},
            userNames: '',
        }
    },
    computed: {
        title() {
            return '查看'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.InspectionPlanId;
                try {
                   let res = await this.Get(`/GetInspectionPlan?inspectionPlanId=${this.id}`)
                   if (res.status == 2000) {
                       // this.info = res.data;
					   this.info = Object.assign(_extends(defaultInfo), item)
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
        },
        close() {
            this.dislogShow = false;
            this.id = '';
            this.userNames = '';
            this.info = {};
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
            min-width: 600px;
        }
        /deep/ .el-form{
            padding: 5px 25px 20px;
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
    }
</style>