<template>
    <el-dialog
        v-if="issubsidiary"
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
        <div class="operation">
            <el-select
                v-model="filters.NameCode"
                clearable
                placeholder="积分获取来源"
            >
                <el-option
                    v-for="item in NameEnumCom"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id"
                >
                </el-option>
            </el-select>
            <el-input
                placeholder="部门人员"
                clearable
                v-model="filters.UserName"
                style="width: 200px;"
                v-if="type == 1"
            ></el-input>
            <el-button type="primary" @click="handlePageChange()">查询</el-button>
        </div>
        <div class="f-b-c desc" v-if="info">
            <div class="f">
                <div v-if="type == 0">姓名：{{ info.UserName }}</div>
                <div v-if="type == 1">部门：{{ info.DepartmentName }}</div>
                <div style="margin-left: 10px;" v-if="!!filters.StartTime || !!filters.EndTime">
                    时间段：{{ isLimit(filters.StartTime) }} 至 {{ isLimit(filters.EndTime) }}
                </div>
            </div>
            <div>
                <span>总积分：<span class="num">{{ info.TotalScore.toLocaleString('en-US') }}</span></span>
                <span style="margin-left: 20px"
                    >目前排名：<span class="num">{{ info.Rank }}</span></span
                >
            </div>
        </div>
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="content">
                <el-table
                    :data="list"
                    highlight-current-row
                    :header-cell-style="$tableStyle"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="80"
                    ></el-table-column>
                    <el-table-column
                        label="部门人员"
                        align="center"
                        prop="UserName"
                        v-if="type == 1"
                    ></el-table-column>
                    <el-table-column
                        label="积分获取来源"
                        align="center"
                        prop="Name"
                    ></el-table-column>
                    <el-table-column
                        label="积分"
                        align="center"
                        width="140"
                        prop="Score"
                    ></el-table-column>
                    <el-table-column
                        label="获取时间"
                        align="center"
                        width="180"
                        prop="CreateTimeDesc"
                    ></el-table-column>
                </el-table>
            </div>
        </el-scrollbar>

        
        <div slot="footer" class="dialog-footer">
            <div class="f-b-c" style="flex: 1;">
                <el-pagination
                    layout="total, prev, pager, next"
                    background
                    @current-change="handlePageChange"
                    :page-size="pages.rows"
                    :total="pages.total"
                    class="customPagination"
                >
                </el-pagination>
                <el-button @click.native="close()">关闭</el-button>
            </div>
        </div>
    </el-dialog>
    <el-drawer
        v-else
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        :size="1000"
        direction="ltr"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
         <div style="height:100%;width:100%;display:flex;flex-direction:column;justify-content:space-between">
            <div>
                <div class="operation">
                    <el-select
                        v-model="filters.NameCode"
                        clearable
                        placeholder="积分获取来源"
                    >
                        <el-option
                            v-for="item in NameEnumCom"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                    <el-input
                        placeholder="部门人员"
                        clearable
                        v-model="filters.UserName"
                        style="width: 200px;"
                        v-if="type == 1"
                    ></el-input>
                    <el-button type="primary" @click="handlePageChange()">查询</el-button>
                </div>
                <div class="f-b-c desc" v-if="info">
                    <div class="f">
                        <div v-if="type == 0">姓名：{{ info.UserName }}</div>
                        <div v-if="type == 1">部门：{{ info.DepartmentName }}</div>
                        <div style="margin-left: 10px;" v-if="!!filters.StartTime || !!filters.EndTime">
                            时间段：{{ isLimit(filters.StartTime) }} 至 {{ isLimit(filters.EndTime) }}
                        </div>
                    </div>
                    <div>
                        <span>总积分：<span class="num">{{ info.TotalScore.toLocaleString('en-US') }}</span></span>
                        <span style="margin-left: 20px"
                            >目前排名：<span class="num">{{ info.Rank }}</span></span
                        >
                    </div>
                </div>
                <el-scrollbar ref="scrollbar" class="scrollbar">
                    <div class="content">
                        <el-table
                            :data="list"
                            highlight-current-row
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                type="index"
                                label="序号"
                                align="center"
                                width="80"
                            ></el-table-column>
                            <el-table-column
                                label="部门人员"
                                align="center"
                                prop="UserName"
                                v-if="type == 1"
                            ></el-table-column>
                            <el-table-column
                                label="积分获取来源"
                                align="center"
                                prop="Name"
                            ></el-table-column>
                            <el-table-column
                                label="积分"
                                align="center"
                                width="140"
                                prop="Score"
                            ></el-table-column>
                            <el-table-column
                                label="获取时间"
                                align="center"
                                width="180"
                                prop="CreateTimeDesc"
                            ></el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
                <div class="f-b-c" style="text-align:center;display:block">
                    <el-pagination
                        layout="total, prev, pager, next"
                        background
                        @current-change="handlePageChange"
                        :page-size="pages.rows"
                        :total="pages.total"
                        class="customPagination"
                    >
                    </el-pagination>
                
                </div>
            </div>
            <div slot="footer" class="el-drawer__footer">
                <el-button type="primary" @click.native="close()">关闭</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const idKey =['UserId', 'DepartmentId'];
export default {
    name: 'page-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            type: 0, // 0、人员，1、部门
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: null,
            NameEnumCom: [],
            filters: {
                NameCode: '',
                StartTime: '',
                EndTime: '',
            },
            list: [],
            pages: {
                page: 0,
                rows: 10,
                total: 0,
            },
            issubsidiary:true
        };
    },
    computed: {
        title() {
            return '查看';
        },
    },
    methods: {
        async show(item, type, filters) {
            this.dislogShow = true;
            await this.Get('/GetIntegralNameEnumCom').then((res) => {
                if (res.status == 2000) {
                    this.NameEnumCom = res.data;
                }
            });
            this.type = type;
            this.id = item[idKey[this.type]];
            this.info = item;
            Object.assign(this.filters, filters);
            this.handlePageChange(1);
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = null;
            this.type = 0;
            this.filters.StartTime = '';
            this.filters.EndTime = '';
        },
        async getList() {
            this.loading = true;
            let params = {
                ...this.pages,
                ...this.filters,
            };
            params[idKey[this.type]] = this.id;
            let urls = ['/GetIntegralDetailsByUser', '/GetIntegralDetailsByDepartment'];
            try {
                let res = await this.Post(urls[this.type], params);
                if (res.status == 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                
            }
            this.loading = false;
        },
        handlePageChange(val) {
            this.pages.page = val;
            this.getList();
        },
        isLimit(str) {
            return str ? str : '不限';
        },
        updataissubsidiary(flag){
            this.issubsidiary=flag
        }
    },
};
</script>

<style lang="scss" scoped>
.info {
    /deep/ .el-dialog__body {
        padding: 0 !important;
    }
    /deep/ .el-dialog {
        min-width: 1000px;
    }
    /deep/ .el-form {
        padding: 25px 25px 20px;
        .el-select {
            width: 100%;
        }
    }
    /deep/ .el-form-item {
        margin-bottom: 34px;
        &:first-child {
            margin-right: 20px;
        }
        .el-form-item__label {
            padding-bottom: 9px;
            line-height: 20px;
        }
        .el-select {
            width: 100%;
        }
    }
    .w50 {
        width: 50%;
    }
    .mr20 {
        margin-right: 20px;
    }
    .operation {
        border-bottom: 1px solid #f2f2f2;
        padding: 15px 25px;
    }
    .desc {
        padding: 15px 20px;
        .num {
            color: #FE912E;
        }
    }
    .content {
        padding: 0 20px;
    }
}
</style>