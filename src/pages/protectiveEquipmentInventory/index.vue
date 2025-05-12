<!-- 防护用品库存 -->
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
                    v-model="filters.Query"
                        placeholder="品名/型号"
                        clearable
                    ></el-input>
                    <el-button
                        type="primary"
                        @click="getFirstPage()"
                        >查询</el-button
                    >
                </div>
                <div>
                    <el-button-group>
                        <el-button type="primary"
                            @click="add()">新增</el-button>
                    </el-button-group>
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
                    label="品名"
                    align="center"
                    header-align="center"
                    prop="Name"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    label="规格型号"
                    align="center"
                    header-align="center"
                    prop="Spec"
                    width="150"
                >
                </el-table-column>
                <el-table-column
                    label="单位"
                    align="center"
                    header-align="center"
                    prop="Unit"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    label="库存数量"
                    align="center"
                    header-align="center"
                    prop="Quantity"
                    width="120"
                >
                </el-table-column>
                <!-- <el-table-column
                    label="最近入库数量"
                    align="center"
                    header-align="center"
                    prop="NewQuantity"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    label="最近入库人"
                    align="center"
                    header-align="center"
                    prop="NewOpUserName"
                    width="160"
                >
                </el-table-column> -->
                <el-table-column
                    label="备注"
                    align="center"
                    header-align="center"
                    prop="Remark"
                    width="300"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                    width="160"
                >
                    <template slot-scope="{ row }">
                        <el-button type="text" @click="inStorage(row)">入库</el-button>
                        <el-button
                            type="text"
                            @click="view(row)"
                            >查看</el-button
                        >
                        <el-popconfirm
                            style="margin-left: 10px;"
                            title="确认删除吗？"
                            @confirm="remove(row)"
                            v-if="row"
                        >
                            <el-button
                                slot="reference"
                                type="text"
                                text-plain
                                >删除</el-button
                            >
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 列表 结束 -->
        <detail ref="detail"/>
        <add ref="add" @load="handleCurrentChange(1)"/>
        <warehousing ref="warehousing" @load="getList()"/>
    </page-layout>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import detail from './detail';
import add from './add';
import warehousing from './warehousing';
export default {
    components: {
        detail,
        add,
        warehousing
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
            this.$refs.detail.show(item);
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
            let res = await this.Post('/GetProtectiveAppliancess', params);
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
        async remove(item) {
            let res = await this.Get('/DeleteProtectiveAppliances', {ProtectiveAppliancesId: item.ProtectiveAppliancesId});
            if (res.status === 2000) {
                this.$message.success('删除成功');
                this.getList();
            }
        },
        add() {
            this.$refs.add.show();
        },
        inStorage(item) {
            this.$refs.warehousing.show(item);
        }
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
  