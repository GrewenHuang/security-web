<template>
    <page-layout class="funding-plan" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
            <!-- 条件栏 开始 -->
            <div slot="operation" class="f-b-c">
                    <div class="input-content">
                        <el-date-picker v-model="filters.Year"
                            type="year"
                            value-format="yyyy"
                            placeholder="年度">
                        </el-date-picker>
                        <el-button
                            type="primary"
                            @click="getFirstPage()"
                            >查询</el-button
                        >

                    </div>
                    <div class="f--c">
                        <el-button type="primary"
                                icon="el-icon-plus"
                                @click="viewInfo()">新增</el-button>
                    </div>
            </div>
            <!-- 条件栏 结束 -->

            <!--列表 开始-->
            <el-table
                :data="list"
                highlight-current-row
                :header-cell-style="$tableStyle"
                style="width: 100%"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    header-align="center"
                    width="50"
                >
                </el-table-column>
                <el-table-column
                    label="年度"
                    align="center"
                    header-align="center"
                    prop="Year"
                >
                </el-table-column>
                <el-table-column
                    label="上年度营业收入"
                    align="center"
                    header-align="center"
                    prop="PreviousYearIncome"
                    width="140"
                >
                </el-table-column>
                <el-table-column
                    label="提取标准（%）"
                    align="center"
                    header-align="center"
                    prop="ExtractionStandard"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    label="本年度提取金额"
                    align="center"
                    header-align="center"
                    prop="CurrentYearExtraction"
                    width="140"
                ></el-table-column>
                <el-table-column
                    label="上年度结余金额"
                    align="center"
                    header-align="center"
                    prop="PreviousYearBalance"
                    width="140"
                >
                </el-table-column>
                <el-table-column
                    label="本年度实际可使用金额"
                    align="center"
                    header-align="center"
                    prop="CurrentYearActual"
                    width="170"
                >
                </el-table-column>
                <el-table-column
                    label="制表人"
                    align="center"
                    header-align="center"
                    prop="PreparedByName"
                    width="120"
                ></el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    header-align="center"
                    width="120"
                >
                    <template slot-scope="{ row }">
                        <whether :yes="true" :text="statusObjs[row.Status] || '未发布'"/>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="240"
                >
                    <template slot-scope="scope">
                        <div class="table-operation">
                          <el-popconfirm
                                    title="确认撤销吗？"
                                    @confirm="revocation(scope.row)"
                                    v-if="scope.row.Status == 1"
                                >

                                <el-button type="text"  slot="reference" >撤销</el-button>
                              </el-popconfirm>

                            <el-button
                                type="text"
                                @click="viewInfo(scope.row, {preview: true})"
                                v-if="scope.row.Status > 0"
                                >查看</el-button
                            >
                            <template v-if="scope.row.Status == 0">

                                <el-button
                                    type="text"
                                    @click="viewInfo(scope.row)"
                                    >编辑</el-button
                                >
                                <el-popconfirm
                                    title="确认发布吗？"
                                    @confirm="release(scope.row)"
                                >
                                    <el-button slot="reference" type="text">发布</el-button>
                                </el-popconfirm>
                                <el-popconfirm
                                    title="确认删除吗？"
                                    @confirm="removeData(scope.row)"
                                >
                                    <el-button
                                        slot="reference"
                                        type="text"
                                        text-plain
                                        >删除</el-button
                                    >
                                </el-popconfirm>
                            </template>
                            <template v-else-if="scope.row.Status == 1">

                                <el-button
                                    type="text"
                                    @click="viewInfo(scope.row, {filing: true})"
                                    >归档</el-button
                                >

                            </template>
                            <el-button
                                type="text"
                                @click="viewInfo(scope.row, {copy: true})"
                                v-if="scope.row.Status > 0"
                                >复制</el-button
                            >
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 列表 结束 -->
        <detail ref="voyageLogDetail" @success="addSuccess"/>
    </page-layout>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import detail from './detail';
export default {
    name: "funding-plan",
    components: {
        detail
    },
	props: {
		EnterpriseId: {
			type: Number,
			default: ''
		}
	},
    mixins: [request_mixin, upload_mixin, Download, Import_export],
    data() {
        return {
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            filters: {
                Year: ''
            } ,// 查询条件
            loading: false,
            list: [],
            statusObjs: ['未发布', '已发布', '已归档'],
        };
    },
	watch: {
		'EnterpriseId': {
			deep: true,
			handler() {
				this.getFirstPage();
			}
		}
	},
	created() {
		this.getFirstPage();
	},
    methods: {
        viewInfo(info, params = {}) {
            this.$refs.voyageLogDetail.show(info, params,this.EnterpriseId);
        },
        //分页事件
        handleCurrentChange (val) {
            this.pages.page = val;
            this.getList();
        },
        getParams() {
            let params = {
                ...this.pages,
                ...this.filters,
				EnterpriseId: this.EnterpriseId
            };
            return params;
        },
        async getList() {
            let params = this.getParams();
            let res = await this.Post('/GetFundingPlans', params);
            if (res.status === 2000) {
                let {list, count: total, page, rows} = res.data;
                this.list = list;
                this.pages.total = total;
                this.pages.page = page;
                this.pages.rows = rows;
            }
        },
        getFirstPage() {
            this.pages.page = 1;
            this.getList();
        },
        async removeData(item) {
            let res = await this.Get('/DeleteFundingPlan', {fundingPlanId: item.FundingPlanId});
            if (res.status === 2000) {
                this.$message.success('删除成功');
                this.getList();
            } else {
                this.$message.error(res.message);
            }
        },
        async revocation(item){
          let res = await this.Get('/CancelFundingPlan', {fundingPlanId: item.FundingPlanId});
            if (res.status === 2000) {
                this.$message.success('撤销成功');
                this.getList();
            } else {
                this.$message.error(res.message);
            }
        },
        addSuccess() {
            this.getFirstPage();
        },
        async release(item) {
            let res = await this.Get('/ReleaseFundingPlan', {fundingPlanId: item.FundingPlanId});
            if (res.status === 2000) {
                this.$message.success('发布成功');
                this.getList();
            } else {
                this.$message.error(res.message);
            }
        }
    },
};
</script>
<style lang="scss" scoped>
</style>

