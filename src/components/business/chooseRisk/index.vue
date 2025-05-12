<template>
    <el-dialog v-dialog-drag  
        :title="title"
        :visible.sync="dialogFlag"
        width="1100px"
        top="6vh"
        class="choose-user"
        @close="close"
    >
        <!-- 条件栏 结束 -->
        <div class="dialog-operation">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-select
                        v-model="filters.RiskTypeCode"
                        placeholder="风险类型"
                        clearable
                    >
                        <el-option
                            v-for="item in TypeCom"
                            :key="item.id"
                            :value="item.id"
                            :label="item.text"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="filters.RiskLevelCode"
                        placeholder="风险等级"
                        clearable
                    >
                        <el-option
                            v-for="item in RiskLevelList"
                            :key="item.id"
                            :value="item.id"
                            :label="item.text"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="filters.RiskUnitName"
                        placeholder="风险单元"
                        clearable
                        style="min-width: 200px"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="filters.RiskPointName"
                        placeholder="风险点"
                        clearable
                        style="min-width: 200px"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        @click="handleCurrentChange(1)"
                        >查询</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="f-b">
            <!--列表 开始-->
            <div :style="{width: `calc(${single ? '100%' : '100% - 300px'})`}">
                <el-scrollbar class="scrollbar">
                    <el-table
                        ref="chooseUser"
                        v-if="single"
                        :data="list"
                        highlight-current-row
                        v-loading="loading"
                        style="width: 100%"
                        :cell-style="{ textAlign: 'center' }"
                        :header-cell-style="{...$tableStyle,  textAlign: 'center' }"
                        @current-change="handleChooseChange"
                    >
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <el-table-column
                            label="所属公司"
                            align="center"
                            width="150"
                            prop="EnterpriseName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="风险类型"
                            align="center"
                            width="100"
                            prop="RiskTypeName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="风险单元"
                            align="center"
                            width="150"
                            prop="RiskUnitName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="风险点"
                            align="center"
                            width="200"
                            prop="RiskPointName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="风险因素"
                            align="center"
                            prop="RiskFactors"
                        >
                        </el-table-column>
                        <el-table-column label="事故类型" align="center" width="120">
                            <template slot-scope="scope">
                                <div
                                    v-for="(item, i) in scope.row.RiskAccidentTypeList"
                                    :key="i"
                                >
                                    {{ item }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="风险级别" align="center" width="100">
                            <template slot-scope="scope">
                                <el-tag
                                    :color="scope.row.RiskLevelBgColor"
                                    size="small"
                                    style="color: #fff;border-color:transparent;"
                                    :hit="false"
                                >
                                    {{ scope.row.RiskLevelName }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-else
                        ref="chooseUser"
                        :data="list"
                        v-loading="loading"
                        style="width: 100%"
                        :cell-style="{ textAlign: 'center' }"
                        :header-cell-style="{...$tableStyle,  textAlign: 'center' }"
                    >
                        <el-table-column
                            width="55"
                        >
                            <div slot="header">
                                <el-checkbox size="mini" v-model="checkAll" :indeterminate="indeterminate" @change="chooseAll"></el-checkbox>
                            </div>
                            <template slot-scope="{ row }">
                                <el-checkbox size="mini" :value="tableCheckboxChecked(row)" @change="checkedItem(row, $event)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <el-table-column
                            label="所属公司"
                            align="center"
                            width="150"
                            prop="EnterpriseName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="风险类型"
                            align="center"
                            width="100"
                            prop="RiskTypeName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="风险单元"
                            align="center"
                            width="150"
                            prop="RiskUnitName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="风险点"
                            align="center"
                            width="200"
                            prop="RiskPointName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="风险因素"
                            align="center"
                            prop="RiskFactors"
                        >
                        </el-table-column>
                        <el-table-column label="事故类型" align="center" width="120">
                            <template slot-scope="scope">
                                <div
                                    v-for="(item, i) in scope.row.RiskAccidentTypeList"
                                    :key="i"
                                >
                                    {{ item }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="风险级别" align="center" width="100">
                            <template slot-scope="scope">
                                <el-tag
                                    :color="scope.row.RiskLevelBgColor"
                                    size="small"
                                    style="color: #fff;border-color:transparent;"
                                    :hit="false"
                                >
                                    {{ scope.row.RiskLevelName }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </div>
            <!-- 列表 结束 -->
            <div class="choosed-list" v-if="!single">
                <el-scrollbar class="scrollbar" ref="scrollbar">
                    <div class="content">
                        <el-table
                            :data="choosed"
                            empty-text="未选择"
                            :cell-style="{ textAlign: 'center' }"
                            :header-cell-style="{...$tableStyle,  textAlign: 'center' }"
                            @selection-change="handleRightSelectionChange"
                        >
                            <el-table-column
                                type="selection"
                                width="45"
                            >
                            </el-table-column>
                            <el-table-column label="风险类型" prop="RiskTypeName" width="100">
                            </el-table-column>
                            <el-table-column label="风险单元" prop="RiskUnitName">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
                <div class="f-b-c operation">
                    <div style="font-size: 12px; color: #666;">已选 {{ choosed.length }} 条</div>
                    <el-button type="text" style="padding: 0;" @click="removeChoose(rightChooseList)" :disabled="!rightChooseList.length">删除</el-button>
                </div>
            </div>
        </div>
        <div class="f-b-c">
            <div v-if="single">
                已选：{{ choosed[0] ? choosed[0].RiskUnitName : '未选择' }}
            </div>
            <!--分页 开始-->
            <el-pagination
                class="dialog-pagination"
                layout="sizes, total, prev, pager, next"
                background
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-size="pages.rows"
                :total="pages.total"
                :page-sizes="[10, 100, 1000, 2000, 3000]"
            >
            </el-pagination>
            <!-- 分页 结束 -->
        </div>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-tooltip :disabled="!!choosed.length" placement="top" content="请选择">
                <el-button type="primary" @click="choose" :disabled="!choosed.length">
                    确认
                </el-button>
            </el-tooltip>
        </div>
    </el-dialog>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
export default {
    mixins: [request_mixin],
    data() {
        return {
            list: [],
            TypeCom: [],
            RiskLevelList: [],
            loading: false,
            //查询条件
            filters: {
                QueryScope: 2,
            },
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            title: "选择",
            dialogFlag: false,
            callback: null,
            choosed: [],
            rightChooseList: [],
            single: true,
            checkAll: false,
            indeterminate: false, // 全选按钮是否显示半选样式
        };
    },
    watch: {
        choosed: {
            deep: true,
            handler() {
                this.updateCheckAll();
            }
        },
    },
    methods: {
        show(callback) {
            this.dialogFlag = true;
            this.callback = callback;
        },
        close() {
            this.dialogFlag = false;
            this.callback(false);
        },
        choose() {
            if (!this.choosed.length) {
                return this.$message.error('请选择');
            }
            if (typeof this.callback === 'function') {
                let list = JSON.parse(JSON.stringify(this.choosed));
                this.callback(true, !this.single ? list : list[0]);
                this.dialogFlag = false;
            }
        },
        choosedScrollbarToBttom() {
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = this.$refs.scrollbar.wrap.scrollHeight;
            });
        },
        chooseAll() {
            this.removeChoose(this.list);
            if (this.checkAll){
                this.choosed.push(...this.list);
                this.choosedScrollbarToBttom();
            }
        },
        updateCheckAll() {
            let pageIds = this.list.map(item => item.RiskControlId);
            let currentPageChoosedTotal = this.choosed.filter(item => pageIds.includes(item.RiskControlId)).length;
            this.checkAll = currentPageChoosedTotal === this.list.length;
            this.indeterminate = currentPageChoosedTotal > 0 && !this.checkAll;
        },
        tableCheckboxChecked(row) {
            return this.choosed.some(item => item.RiskControlId == row.RiskControlId);
        },
        checkedItem(item, event ) {
            let index = this.choosed.map(item => item.RiskControlId).indexOf(item.RiskControlId);
            if (index == -1) {
                this.choosed.push(item);
            } else {
                this.choosed.splice(index, 1);
            }
        },
        handleChooseChange(val) {
            if (val) {
                this.choosed = [val];
            }
        },
        handleRightSelectionChange(val) {
            this.rightChooseList = val;
        },
        removeChoose(list) {
            if (list.length) {
                let removeIds = list.map(item => item.RiskControlId);
                this.choosed = this.choosed.filter(u => !removeIds.includes(u.RiskControlId));
            }
        },
        handleCurrentChange(val) {
            this.pages.page = val;
            this.getList();
        },
        handleSizeChange(val) {
            this.pages.rows = val;
            this.handleCurrentChange(1);
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters
            };
            this.loading = true;
            try {
                let res = await this.Post("/GetRiskControlBaseList", params);
                if (res.status == 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                    this.updateCheckAll();
                } else {
                    this.$message.error({
                        showClose: true,
                        message: res.message,
                        duration: 2000,
                    });
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
    },
    mounted() {
        this.Get("/GetRiskTypeCom", {}).then((result) => {
            //风险类型
            if (result.status == 2000) {
                this.TypeCom = result.data;
            }
        });
        this.Get("/GetRiskLevelCom", {}).then((result) => {
            //风险分级
            if (result.status == 2000) {
                this.RiskLevelList = result.data;
            }
        });
        this.handleCurrentChange(1);
    },
};
</script>
<style lang="scss" scoped>
.dialog-pagination{
    margin-top: 20px;
    text-align: center;
}
.choose-user{
    /deep/ .el-dialog{
        margin-bottom: 0;
    }
    .choosed-list{
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-left: 8px;
        width: 300px;
        .content{
            padding: 0 8px;
        }
        .el-scrollbar{
            height: calc(100% - 37px);
        }
        /deep/ .scrollbar .el-scrollbar__wrap{
            height: 55vh;
        }
        .operation{
            border-top: 1px solid #ccc;
            padding: 10px 16px;
        }
    }
    /deep/ .el-table__body {
        tr.current-row > td.el-table__cell{
            background: $primary-color;
            color: #fff;
        }
    }
}
</style>
  