<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="execute-task"
        width="1000px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar class="scrollbar">
            <template v-if="!!info">
                <component 
                    :is="components[info.TaskType]"
                    ref="form" 
                    :item="info"
                    :loading.sync="loading"
                    :submitLoading.sync="submitLoading"
                    :executeType="executeType"
                    @load="load"
                    @close="close"
                    @remark="remarkData"
                >
                    <template v-if="remarkObjects.length || executeType == 2">
                        <div class="task-remark">
                            <template v-for="(item, index) in remarkObjects">
                                <div :key="index" style="margin-bottom: 20px;">
                                    <div class="label">意见<span class="tip">（{{item.EnterpriseName}}）</span></div>
                                    <el-input type="textarea" placeholder="请输入" disabled :rows="6" autosize v-model="item.RelayRemark"></el-input>
                                </div>
                            </template>
                            <template v-if="executeType == 2">
                                <div class="label">意见<span class="tip">（{{ enterpriseInfo.EnterpriseName }}）</span></div>
                                <el-input type="textarea" placeholder="请输入" :rows="6" autosize v-model="Remark"></el-input>
                            </template>
                        </div>
                    </template>
                </component>
            </template>
            <!-- 执行对象 -->
            <template v-if="executeType == 2">
                <div class="global-divider"></div>
                <div class="table-content" ref="enterprise">
                    <div class="title-content f-b-c">
                        <div class="label">下发下级公司</div>
                        <div class="f--c" v-if="!isView">
                            <el-button type="primary" @click="chooseEnterprise">选择下级公司</el-button>
                        </div>
                    </div>
                    <el-table
                        :data="enterpriseList"
                        highlight-current-row
                        :header-cell-style="$tableStyle"
                        style="width: 100%"
                    >
                        <el-table-column
                            label="序号"
                            type="index"
                            align="center"
                            width="50"
                        ></el-table-column>
                        <!-- <el-table-column
                            label="所属行业"
                            align="center"
                            width="230"
                            prop="IndustryName"
                        ></el-table-column> -->
                        <el-table-column
                            label="公司名称"
                            align="center"
                            prop="EnterpriseName"
                        ></el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="80"
                            v-if="!isView"
                        >
                            <template slot-scope="{ row, index }">
                                <el-button type="text" @click="removeDistributionObject(index, row)">删除</el-button>
                            </template>                
                        </el-table-column>
                    </el-table>
                </div>
            </template>
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
import {
    executeDailyTasks,
    executePitfall,
    executeSafeMeeting,
    executeTrain
} from './execute/index'
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'execute-task',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: null,
            executeType: 1, // 1 执行 2 转发
            rules: {
            },
            enterpriseList: [],
            isView: false,
            EnterpriseIds: [],
            Users: [],
            Remark: '',
            remarkObjects: [],
            enterpriseInfo: JSON.parse(localStorage.getItem('enterpriseInfo')),
            components: {
                1: executeTrain,
                2: executeSafeMeeting,
                3: executePitfall,
                4: executeDailyTasks,
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.executeType == 1 ? '执行' : '转发'
        }
    },
    methods: {
        async show(item, executeType) {
            this.dislogShow = true;
            this.executeType = executeType || 1;
            if (item) {
                this.loading = true;
                this.id = item.id;
                this.info = _extends(item);
                this.loading = false;
            }
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.loading = false;
            this.id = '';
            this.info = null;
        },
        load() {
            this.$emit('load');
        },
        save() {
            this.$refs.form.save(() => {
                if (!this.EnterpriseIds.length) {
                    this.$refs.enterprise.scrollIntoView({behavior: 'smooth'});
                    this.$message.error('请选择下级公司');
                    return false;
                }
                return {
                    EnterpriseIds: this.EnterpriseIds,
                    Users: this.Users,
                    Remark: this.Remark
                }
            });
        },
        chooseEnterprise() {
            this.$chooseEnterprise({
                choosed: this.enterpriseList
            }).then(data => {
                this.enterpriseList = data;
                this.EnterpriseIds = data.map(item => item.EnterpriseId);
            })
        },
        remarkData(data) {
            this.remarkObjects = data;
        }
    }
}
</script>

<style lang="scss" scoped>
    .execute-task{
        .task-remark{
            .label{
                margin-bottom: 10px;
                font-size: 16px;
                font-weight: 600;
                .tip{
                    font-weight: 400;
                }
            }
        }
        /deep/ .el-scrollbar__wrap{
            margin-bottom: 0 !important;
        }
        /deep/ .gutter{
            margin-right: 20px;
        }
        /deep/ .el-dialog__body{
            padding: 0 !important;
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        /deep/ .el-form{
            padding: 25px 29px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 34px;;
            &:first-child{
                margin-right: 20px;
            }
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
            .el-select{
                width: 100%;
            }
        }
        .w50{
            width: 50%;
        }
        .mr20{
            margin-right: 20px;
        }
        /deep/ .global-divider{
            margin: 36px 0;
            height: 10px;
            background: #F2F2F2;
        }
        /deep/ .table-content{
            padding: 0 29px 41px;
            .title-content{
                margin-bottom: 20px;
                .label{
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 18px;
                    &::before{
                        content: '';
                        margin-right: 7px;
                        width: 5px;
                        height: 18px;
                        background: #1A43A9;
                    }
                }
            }
        }
    }
</style>