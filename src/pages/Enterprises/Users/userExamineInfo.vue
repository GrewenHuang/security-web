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
            <userInfo 
                ref="BaseDTO"
                :data="info"
				:isType="isType"
            />
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >{{ info.ApproveStatus == 1 ? '关闭' : '取消'}}</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"        
                v-if="info.ApproveStatus == 0"
                >审核通过</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import userInfo from './userAdd.vue';
const defaultInfo = {
    ExpertName: '',
    ExpertTel: '',
    Specialty: '',
    Education: '',
    Major: '',
    Remark: '',
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    components: {
        userInfo
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
			isType: false,
            info: _extends(defaultInfo),
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '注册用户信息'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.UserId;
                try {
                    let res = await this.Get("/GetEnterpriseUserV3", { UserId: this.id })
                    if (res.status == 2000) {
                        this.info = _extends(res.data.BaseDTO);
                    } else {
                        this.$message('无法获取用户信息，请确认是否存在该用户信息！');
                        this.close();
                    }
                } catch (error) {
                    console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        async save() {
            let params = {};
            let arr = [
                "BaseDTO",
            ];

            arr.forEach((res) => {
                if (params[res]) {
                    delete params[res];
                }
                if (this.$refs[res] != undefined) {
                    this.$refs[res].getData((e) => {
                        params[res] = e;
                    });
                }
            });
            if (JSON.stringify(params.BaseDTO) == "{}") {
                return;
            }
            this.submitLoading = true;
            params.BaseDTO.ApproveStatus = 1;
			params.BaseDTO.SecurityLevel = parseInt(params.BaseDTO.SecurityLevel)
			let arrRow = [{PositionId: params.BaseDTO.PositionList}]
			params.BaseDTO.PositionList = arrRow
            try {
                let res = await this.Post('/SaveEnterpriseUserV3', params)
                if (res.status == 2000) {
                    this.$message.success('审批成功')
                    this.$emit('load');
                    this.close();
                } else {
                    this.$message.error(res.message);
                }
            } catch (error) {
                
            }
            this.submitLoading = false;
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
    }
</style>