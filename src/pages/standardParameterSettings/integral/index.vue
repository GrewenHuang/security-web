<!-- 车辆巡检 -->
<template>
    <page-layout @scroll-height="getScrollHeight">
        <div class="setting">
          <!--  <div class="item" :style="{minHeight: minHeight + 'px'}">
                <div class="title f-b-c">
                    <div>上级标准</div>
                    <div v-if="superData">
                        <el-tooltip content="复制后需要点击保存企业标准">
                            <span class="other-opertion color-primary" @click="copy"><i class="el-icon-document-copy"></i>复制到企业</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="content">
                    <template v-if="superData">
                        <el-table
                            :data="superData"
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                label="序号"
                                type="index"
                                width="80"
                                align="center"
                            ></el-table-column>
                            <el-table-column
                                label="积分项"
                                show-overflow-tooltip
                                prop="Name"
                            ></el-table-column>
                            <el-table-column
                                label="积分设置"
                                width="140"
                                align="center"
                                prop="Score"
                            ></el-table-column>
                            <el-table-column
                                label="积分规则"
                                width="120"
                                align="center"
                                prop="Rules"
                            ></el-table-column>
                            <el-table-column
                                label="状态"
                                width="150"
                                align="center"
                            >
                                <template slot-scope="{ row }">
                                    <div class="status-content">
                                        <span class="status" :class="{using: row.StatusDesc == '启用'}">{{ row.StatusDesc }}</span>
                                        <el-input-number style="visibility: hidden;" size="mini" v-model="row.Score"></el-input-number>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <template v-else>
                        <no-data top="107" bottom="10"/>
                        <div class="f-c-c" style="color: #959595;">上级公司未设置标准</div>
                    </template>
                </div>
            </div> -->
            <div class="item" :style="{minHeight: minHeight + 'px'}">
                <div class="title f-b-c">
                    <div>企业标准</div>
                  <!--  <div class="f-c-c">
                        <el-switch
                            v-model="enterpriseData.EnterpriseStatus"
                            :active-value="1"
                            :inactive-value="0"
                            active-text="启用"
                            inactive-text="停用"
                        ></el-switch>
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            style="margin-left: 20px;"
                        >
                            <i class="el-icon-warning" slot="reference" style="color:#959595;"></i>
                            <div style="font-size: 12px;">
                                <div style="color: #FE912E;margin-bottom: 5px;">
                                    <i class="el-icon-warning" style="font-size:14px;margin-right: 8px;"></i>温馨提示：
                                </div>
                                <div>启用企业标准时自动停用上级标准；</div>
                                <div>停用企业标准时自动启用上级标准。</div>
                            </div>
                        </el-popover>
                    </div> -->
                </div>
                <div class="content">
                    <template v-if="enterpriseData.List.length">
                        <el-table
                            :data="enterpriseData.List"
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                label="序号"
                                type="index"
                                width="80"
                                align="center"
                            ></el-table-column>
                            <el-table-column
                                label="积分项"
                                show-overflow-tooltip
                                prop="Name"
                            ></el-table-column>
                            <el-table-column
                                label="积分设置"
                                width="140"
                                align="center"
                            >
                                <template slot-scope="{ row }">
                                    <el-input-number size="mini" v-model="row.Score"></el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="积分规则"
                                width="120"
                                align="center"
                            >
                                <template slot-scope="{ row }">
                                    <el-select v-model="row.RulesCode" size="mini">
                                        <el-option v-for="(item, index) in rules" :key="index" :label="item.text" :value="item.id"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="状态"
                                width="150"
                                align="center"
                            >
                                <template slot-scope="{ row }">
                                    <el-switch v-model="row.Status"
                                        :active-value="1"
                                        :inactive-value="0"
                                        active-text="开启"
                                        inactive-text="关闭"
                                    ></el-switch>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <template v-else>
                        <no-data top="107" bottom="23"/>
                        <div class="f-c-c">
                            <el-button type="primary" round @click="add">立即添加标准</el-button>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div slot="footer" class="f-c" style="padding-top: 8px;">
            <el-button @click="resetData">重置</el-button>
            <el-tooltip content="保存企业标准">
                <el-button type="primary" @click="save" :loading="submitLoading">保存</el-button>
            </el-tooltip>
        </div>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    components: {
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            submitLoading: false,
            minHeight: 0,
            rules: [], // 积分规则
            initialRule: '', // 初始的积分规则
            superData: [],
            enterpriseData: {
                List: [],
                EnterpriseStatus: 0
            },
            originEnterpriseData:  {
                List: [],
                EnterpriseStatus: 0
            }
        }
    },
    async created() {
        await this.getRules();
        this.getSubLogbookConfig();
        this.getLogbookConfig();
    },
    methods: {
        getScrollHeight(height) {
            this.minHeight = height - 24;
        },
        async getSubLogbookConfig() {
            let res = await this.Get('/GetSupIntegralConfig');
            this.superData = res.data;
        },
        async getLogbookConfig() {
            let res = await this.Get('/GetIntegralConfig');
            if (res.data.length) {
                this.enterpriseData.List = res.data;
                this.enterpriseData.EnterpriseStatus = res.data[0].EnterpriseStatus;
                this.originEnterpriseData = _extends(this.enterpriseData);
            }
        },
        async save() {
            this.submitLoading = true;
            let params = {
                ...this.enterpriseData,
            }
            try {
                let res = await this.Post('/SaveIntegralConfig', params);
                if (res.status == 2000) {
                    this.$message.success('保存成功');
                    this.originEnterpriseData.List = res.data;
                }
            } catch (error) {
                
            }
            this.submitLoading = false;
        },
        resetData() {
            this.enterpriseData = this.originEnterpriseData ?  _extends(this.originEnterpriseData) : null;
        },
        copy() {
            this.enterpriseData = _extends({List: this.superData, EnterpriseStatus: 1});
        },
        add() {
            // this.copy();
            this.enterpriseData.List.forEach(item => {
                this.$set(item, 'Score', 0);
                this.$set(item, 'Status', 0);
                this.$set(item, 'RulesCode', this.initialRule);
            })
        },
        async getRules() {
            let res = await this.Get('/GetIntegralRulesEnumCom');
            if (res.status == 2000) {
                this.rules = res.data.map(item => {
                    item.id = +item.id;
                    return item;
                });
                this.initialRule = res.data.filter(item=>item.text=='每次').map(item=>item.id)[0];
            } else {
                this.$message.error(res.message);
            }
            return Promise.resolve()
        }
    }
}
</script>

<style lang="scss" scoped>
.setting{
    margin-top: 8px;
    display: flex;
    height: 100%;
    color: #1C1D2F;
    font-size: 14px;
    .content{
        padding: 20px 15px;
    }
    .item{
        flex: 1;
        border-radius: 10px;
        border: 1px solid #E1E1E1;
        overflow: hidden;
        &:first-child{
            margin-right: 18px;
        }
        .title{
            padding: 19px 25px;
            background: #F8F8F8;
            font-size: 18px;
            font-weight: 600;
            .el-switch{
                margin-left: 20px;
                font-size: 14px;
            }
        }
        .other-opertion{
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
            i{
                margin-right: 5px;
            }
        }
    }
    .status-content{
        position: relative;
        .status{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50% , -50%);
            color: #FE3F51;
            &.using{
                color: #13CE66;
            }
        }
    }
}
</style>