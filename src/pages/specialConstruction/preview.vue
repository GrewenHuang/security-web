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
        <el-scrollbar ref="scrollbar" class="scrollbar" v-if="info">
            <el-form ref="form" label-position="top" :model="info">
                <el-form-item label="工程名称" prop="ProjectName">
                    <el-input placeholder="请输入" v-model="info.ProjectName" disabled></el-input>
                </el-form-item>
                <div class="form-2-col">
                    <el-form-item label="编制人">
                        <el-input placeholder="请选择" v-model="info.SpecialItemUserName" readonly disabled></el-input>
                    </el-form-item>
                    <el-form-item label="编制时间">
                        <el-date-picker
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="请选择"
                            clearable
                            v-model="info.SpecialItemDate"
                            disabled
                        ></el-date-picker>
                    </el-form-item>
                </div>
                <div class="form-2-col">
                    <el-form-item label="下发人">
                        <el-input placeholder="请选择" v-model="info.CreateByName" readonly disabled></el-input>
                    </el-form-item>
                    <el-form-item label="下发时间">
                        <el-date-picker
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="请选择"
                            clearable
                            v-model="info.CreateTimeDesc"
                            disabled
                        ></el-date-picker>
                    </el-form-item>
                </div>
                <div class="split-line"></div>
                <div class="title">施工方案</div>
                <el-form-item label="专项施工方案名称" prop="SpecialItemDatabaseName">
                    <el-input
                        placeholder="请输入"
                        v-model="info.SpecialItemDatabaseName"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item prop="SpecialItemDatabaseContent" label="方案内容">
                    <file-list v-model="info.SpecialItemTemplate" disabled></file-list>
                </el-form-item>
                <div class="split-line"></div>
                <div class="title">落实人签字</div>
                <approval-flow :list="userList"></approval-flow>
            </el-form>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import approvalFlow from '@/components/common/approval-flow.vue';
import fileList from '@/components/common/file-list.vue';
const defaultInfo = {
    ProjectName: '',
    SpecialItemUserName: '',
    SpecialItemUserId: '',
    SpecialItemDate: '',
    SpecialItemDatabaseName: '',
    SpecialItemDatabaseContent: '',
    SpecialItemTemplate: [],
    Users: [], // {Name: '', Users: [], Sort: 1}
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin],
    components: {
        approvalFlow,
        fileList
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: _extends(defaultInfo),
            userList: [],
        }
    },
    watch: {
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '查看'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.SpecialItemId;
                try {
                   let res = await this.Get(`/GetSpecialItem?specialItemId=${item.SpecialItemId}`)
                   if (res.status == 2000) {
                        if (!!res.data.SpecialItemTemplate.AttachmentId) {
                            res.data.SpecialItemTemplate = [res.data.SpecialItemTemplate];
                        }
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                        let list = [];
                        let time = Date.now();;
                        this.info.Users.forEach((flow, i) => {
                            flow.Users.forEach((item, index) => {
                                item.flowName = flow.Name;
                                item.sort = parseInt(i + '' + index);
                                list.push(item);
                            });
                        });
                        this.userList = list.sort((a,b) => {
                            let num = a.SignInDate ? new Date(a.SignInDate).getTime() : time + a.sort;
                            let num1 = b.SignInDate ? new Date(b.SignInDate).getTime() : time + b.sort;
                            return num - num1;
                        });
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
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.id = '';
            this.info = _extends(defaultInfo);
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
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        
        .title{
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 600;
            &::before{
                content: '';
                margin-right: 7px;
                width: 5px;
                height: 18px;
                background: $--color-primary;
            }
        }
        .quill-editor{
            margin-top: 10px;
            height: 200px;
        }
        .el-button.is-plain{
            width: 100%;
            border-style: dashed;
        }
        /deep/ label[for="SpecialItemDatabaseContent"]{
            width: 100%;
        }
        .textarea{
            border-radius: 4px;
            border: 1px solid #DDDDDD;
            padding: 13px 15px 12px;
            background: #F8F8F8;
        }
    }
</style>
