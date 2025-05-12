<template>
    <page-layout class="page" :loading="loading">
        <!--  :pages="pages" @current-change="handlePageChange" -->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
            </div>
            <div class="f--c">
                <el-button type="primary" @click="exportData()">导出PDF</el-button>
            </div>
        </div>
        <div id="annual-expense-ledger" :class="{pagePadding: exportLoading}">
            <div class="title">
                <template v-if="exportLoading">
                    <span class="year">{{ filters.Year }}</span>
                </template>
                <template v-else>
                    <el-date-picker class="filter-date" type="year" value-format="yyyy" :clearable="false" v-model="filters.Year" @change="getList"></el-date-picker>
                </template>
                年度安全费用使用台账
            </div>
            <div class="t-r">单位：万元</div>
            <el-table
                border
                style="width: 100%"
                show-summary
                :data="list"
                :header-cell-style="headerCellStyle"
                :span-method="spanMethod"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="50"
                >
                </el-table-column>
                <el-table-column
                    label="安全投入分类（大类）"
                    align="center"
                    width="60"
                    prop="Title"
                >
                </el-table-column>
                <el-table-column
                    label="安全投入分类"
                    align="center"
                    prop="Classification"
                >
                </el-table-column>
                <el-table-column
                    label="计划投入"
                    align="center"
                    width="100"
                    prop="InvestmentMoney"
                >
                </el-table-column>
                <template v-for="(item, index) in months">
                    <el-table-column
                        :key="index"
                        :label="item.label"
                        :prop="item.key"
                        align="center"
                        width="80"
                    >
                    </el-table-column>
                </template>
                <el-table-column
                    label="合计"
                    align="center"
                    width="120"
                    prop="SumMoney"
					fixed="right"
                >
                </el-table-column>
                <el-table-column
                    label="备注"
                    align="center"
                    width="150"
                    prop="Remark"
                    show-overflow-tooltip
					fixed="right"
                >
                </el-table-column>
            </el-table>
        </div>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import utils from '@/common/util';
import { Pdf } from '@/plugins/htmlToPdf';
export default {
    name: 'task-distribution',
    components: {
    },
	props: {
		EnterpriseId: {
			type: Number,
			default: ''
		}
	},
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                Year: utils.formatDate.format(new Date(), 'yyyy'),
            },
            exportLoading: false,
            months: ['JanuaryMoney', 'FebruaryMoney', 'MarchMoney', 'AprilMoney', 'MayMoney', 'JuneMoney', 'JulyMoney', 'AugustMoney', 'SeptemberMoney', 'OctoberMoney', 'NovemberMoney', 'DecemberMoney'].map((key, index) => {
                return {
                    label: index + 1 + '月',
                    key
                }
            })
        }
    },
	watch: {
		'EnterpriseId': {
			deep: true,
			handler() {
				this.handlePageChange(1);
			}
		}
	},
    created() {
        this.handlePageChange(1);
    },
    methods: {
        handlePageChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters,
				EnterpriseId: this.EnterpriseId
            }
            this.loading = true;
            try {
                let res = await this.Get('/GetFundingPlanReport', params);
                if (res.status === 2000) {
                    let list = [];
                    res.data.forEach((item, index) => {
                        list.push(...item.Classifications.map((obj, i) => {
                            return {
                                Title: item.Title,
                                ...obj,
                                rowspan: i == 0 ? item.Classifications.length : 0
                            }
                        }));
                    });
                    this.list = list;
                    // this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item) {
            this.$refs.info.show(item)
        },
        exportData() {
            let loading = this.$loading({
                lock: true,
                text: '正在导出,请勿关闭当前页面',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.exportLoading = true;
            this.$nextTick(() => {
                Pdf.downPdf('annual-expense-ledger', this.filters.Year + '年度安全费用使用台账').then(res => {
                    this.exportLoading  = false;
                    loading.close();
                })
            })
        },
        headerCellStyle({row, column, rowIndex, columnIndex}) {
            row[1].colSpan = 0;
            row[2].colSpan = 2;
            if (columnIndex == 1) {
                return {display: 'none'}
            }
            return this.$tableStyle;
        },
        spanMethod({row, column, rowIndex, columnIndex}) {
            if (columnIndex == 1) {
                return {
                    rowspan: row.rowspan,
                    colspan: row.rowspan > 0 ? 1 : 0
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.t-r{
    text-align: right;
}
.title{
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    .year{
        padding: 0 8px;
        border-bottom: 1px solid #000;
    }
}
.page{
    /deep/ .el-table__header-wrapper{
        border-radius: 0;
    }
    /deep/ .filter-date{
        &.el-date-editor{
            width: 70px;
            .el-input__prefix{
                display: none;
            }
            input{
                border: 0;
                border-bottom: 1px solid #000;
                border-radius: 0;
                padding: 0 8px;
                font-size: 24px;
                font-weight: 600;
                text-align: center;
                color: #181B3B;
            }
        } 
    }
    /deep/ .el-table__footer-wrapper{
        tr {
            td:nth-child(2) {
                display: none;
            }
        }
    }
}
.pagePadding{
    padding: 12px 16px;
}
</style>