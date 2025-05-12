<!-- 防护用品发放记录 -->
<template>
    <page-layout class="protective-equipment warp"
        :loading="loading"
        :pages="pages"
        @current-change="handleCurrentChange"
    >
            <!-- 条件栏 开始 -->
            <div slot="operation" class="f-b-c">
                <div class="input-content">
                    <el-input
                        v-model="filters.Name"
                        placeholder="品名"
                        clearable
                    ></el-input>
                    <el-button
                        type="primary"
                        @click="getFirstPage()"
                        >查询</el-button
                    >
                </div>
                <div>
                    <!-- <el-button-group>
                        <el-button
                            @click="downloadmbs(910,9105,filters)">导出</el-button>
                    </el-button-group> -->
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
                    label="发放人"
                    align="center"
                    header-align="center"
                    prop="GrantName"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    label="发放时间"
                    align="center"
                    header-align="center"
                    prop="GrantDateDesc"
                    width="130"
                >
                </el-table-column>
                <el-table-column
                    label="发放用品"
                    align="center"
                    header-align="center"
                    prop="ProtectiveAppliancesJson"
                    min-width="200"
                >
                  <!--  <template slot-scope="{ row }">
                        {{ row.ProtectiveAppliances.map(item => `${item.Name}×${item.Quantity}`).join('、') }}
                    </template> -->
                </el-table-column>
                <!-- <el-table-column
                    label="领取人员（已领取/总人数）"
                    align="center"
                    header-align="center"
                    width="200"
                >
                    <template slot-scope="{ row }">
                        {{ row.Receivers.filter(item => !!item.ReceiverSignInUrl).length }} / {{ row.Receivers.length }}
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="备注"
                    align="center"
                    header-align="center"
                    prop="Remark"
                    width="260"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="140"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            type="text"
                            @click="view(row)"
							v-if="$_has('FHYPBtnLook')"
                            >查看</el-button
                        >
                        <el-popconfirm
                            title="确认删除吗？"
                            @confirm="removeVoyageLog(row)"
                            v-if="row"
                        >
                            <el-button
                                slot="reference"
								v-if="$_has('FHYPBtnDetele')"
                                type="text"
                                text-plain
                                >删除</el-button
                            >
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 列表 结束 -->
        <detail ref="protectiveEquipmentDetail"/>
    </page-layout>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import detail from './detail';
export default {
    components: {
        detail
    },
    mixins: [request_mixin, upload_mixin, Download, Import_export],
    data() {
        return {
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            filters: {
                Name: '', // 品名
            } ,// 查询条件
            loading: false,
            list: [],
        };
    },

    methods: {
        view(item) {
            this.$refs.protectiveEquipmentDetail.show(item);
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
            };
            return params;
        },
        async getList() {
            let params = this.getParams();
            let res = await this.Post('/GetProtectiveAppliancesRecords', params);
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
        async removeVoyageLog(item) {
            let res = await this.Get('/DeleteProtectiveAppliancesRecord', {protectiveAppliancesRecordId: item.ProtectiveAppliancesRecordId});
            if (res.status === 2000) {
                this.$message.success('删除成功');
                this.getList();
            }
        },
    },
    async mounted() {
        this.getFirstPage();
    },
};
</script>
<style lang="scss" scoped>
    .protective-equipment{
        /deep/ .el-input--small{
            width: 180px;
        }
    }
</style>
  
