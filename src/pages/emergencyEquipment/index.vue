<template>
    <page-layout class="emergency-equipment" :loading="loading" :pages="pages" @current-change="handleCurrentChange">
        <!-- 条件栏 开始 -->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    v-model="filters.Name"
                    placeholder="应急设备"
                    clearable
                ></el-input>
                <el-input
                    v-model="filters.ManagementPersonName"
                    placeholder="负责人"
                    clearable
                ></el-input>
                <el-button
                    type="primary"
                    @click="getFirstPage()"
                    >查询</el-button
                >
            </div>
            <div class="f--c">
                <el-button-group style="margin-right: 20px;">
                    <!-- <el-button
                        @click="downloadmb('GetEmergencyEquipmentTemplateUrl')"
                        >下载导入模板</el-button
                    > -->
                    <el-button
                    >
                        <el-upload
                            action="#"
                            :show-file-list="false"
                            :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportEmergencyEquipment');
                                }
                            "
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                        >
                            导入
                        </el-upload>
                    </el-button>
                    
                <!-- <el-button @click="downloadmbs(1110, 11101,filters)">导出</el-button> -->
                </el-button-group>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addRecord()"
                    >新增</el-button
                >
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
                label="应急设备"
                align="center"
                header-align="center"
                prop="Name"
                width="200"
            >
            </el-table-column>
            <el-table-column
                label="效用试验内容及周期"
                align="center"
                header-align="center"
            >
                <template slot-scope="{row}">
                    <div style="white-space: pre-line;">{{row.Content}}</div>
                </template>
            </el-table-column>
            <el-table-column
                label="负责人"
                align="center"
                header-align="center"
                width="130"
                prop="ManagementPersonName"
            >
            </el-table-column>
            <el-table-column
                label="维护保养标准"
                align="center"
                header-align="center"
                width="340"
            >
                <template slot-scope="{row}">
                    <div style="white-space: pre-line;">{{row.MaintenanceStandard}}</div>
                </template>
            </el-table-column>
            <el-table-column
                label="检测效用"
                align="center"
                header-align="center"
                width="130"
            >
                <template slot-scope="{row}">
                    <!-- <span class="status" :class="{'is-ok': row.CheckResult == 1}">{{row.CheckResult == 1 ? '正常' : '不正常'}}</span> -->
                    <whether :yes="row.CheckResult == 1" :text="row.CheckResult == 1 ? '正常' : '不正常'"/>
                </template>
            </el-table-column>
            <el-table-column
                label="使用"
                align="center"
                header-align="center"
                width="130"
            >
                <template slot-scope="{row}">
                    <!-- <span class="status" :class="{'is-ok': row.UseResult == 1}">{{row.UseResult == 1 ? '正常' : '不正常'}}</span> -->
                    <whether :yes="row.UseResult == 1" :text="row.UseResult == 1 ? '正常' : '不正常'"/>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="220"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            @click="addRecord(scope.row, true)"
                            >查看</el-button
                        >
                        <el-button
                            style="margin: 0 5px;"
                            type="text"
                            @click="addRecord(scope.row)"
                            >编辑</el-button
                        >
                        <el-popconfirm
                            title="确认删除吗？"
                            @confirm="removeVoyageLog(scope.row)"
                        >
                            <el-button
                                slot="reference"
                                type="text"
                                text-plain
                                >删除</el-button
                            >
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表 结束 -->
        <add ref="emergencyEquipmentAdd" @success="getFirstPage"/>
    </page-layout>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import upload_mixin from "@/mixins/upload-mixin.js";
import Import_export from "@/mixins/Import_export.js";
import Download from "@/mixins/Download.js";
import add from './add';
export default {
    name: "emergency-equipment",
    components: {
        add
    },
    mixins: [request_mixin, upload_mixin, Download, Import_export],
    data() {
        return {
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            filters: {
                Name: '', // 设备名称
                ManagementPersonName: '', // 负责人名称
            } ,// 查询条件
            loading: false,
            list: [],
        };
    },
    methods: {
        addRecord(item, isPreview) {
            this.$refs.emergencyEquipmentAdd.show(item, isPreview);
        },
        //分页事件
        handleCurrentChange (val) {
            this.pages.page = val;
            this.GetList();
        },
        getParams() {
            let params = {
                ...this.pages,
                ...this.filters,
            };
            return params;
        },
        async GetList() {
            let params = this.getParams();
            let res = await this.Post('/GetEmergencyEquipmentList', params);
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
            this.GetList();
        },
        GetList() {
            this.getFirstPage();
        },
        async removeVoyageLog(item) {
            let res = await this.Get('/DeleteEmergencyEquipment', {emergencyEquipmentId: item.EmergencyEquipmentId });
            if (res.status === 2000) {
                this.$message.success('删除成功');
                this.GetList();
            }
        }
    },
    async created() {
        this.getFirstPage();
    },
};
</script>
<style lang="scss" scoped>
    .emergency-equipment{
        .status {
            color: #F56C6C;
            &.is-ok{
                color: #67C23A;
            }
        }
    }
</style>
  
