<template>
    <el-dialog v-dialog-drag  
        :title="title"
        :visible.sync="dialogFlag"
        width="1100px"
        top="6vh"
        class="choose-user"
        append-to-body
        @close="close"
    >
        <div style="text-align: right;">单位：万元</div>
        <el-table
            border
            highlight-current-row
            style="width: 100%"
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
            <el-table-column
                label="备注"
                align="center"
                width="150"
                prop="Remark"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="100"
            >
                <template slot-scope="{ row }">
                    <el-button type="text" @click="choose(row)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
export default {
    mixins: [request_mixin],
    data() {
        return {
            list: [],
            dialogFlag: false,
            loading: false,
            title: "选择"
        };
    },
	props: {
		EnterpriseId: Number,
		default: ""
	},
    methods: {
        show() {
            this.dialogFlag = true;
        },
        close() {
            this.dialogFlag = false;
        },
        async getList() {
            this.loading = true;
            try {
                let res = await this.Get("/GetFundingPlanInfo?EnterpriseId=" + this.EnterpriseId);
                if (res.status == 2000) {
                    let list = [];
                    if (res.data) {
                        res.data.Items.forEach((item, index) => {
                            list.push(...item.Classifications.map((obj, i) => {
                                return {
                                    Title: item.Title,
                                    ...obj,
                                    rowspan: i == 0 ? item.Classifications.length : 0
                                }
                            }));
                        });
                    }
                    this.list = list;
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
        },
        choose(row) {
            this.$emit('success', row);
            this.close();
        }
    },
    mounted() {
        this.getList(1);
    },
};
</script>
<style lang="scss" scoped>
</style>
  