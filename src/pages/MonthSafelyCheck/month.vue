<template>
    <page-layout ref="pageLayout" @scroll-height="getScrollHeight">
        <!--工具条开始-->
        <div slot="operation" class="f-b-c">
                    <div class="input-content">
                        <el-date-picker
                            v-model="filtersMonth.SearchMonth"
                            type="month"
                            placeholder="查询月份"
                            format="yyyy-MM"
                            value-format="yyyy-MM"
                            :clearable="false"
                        >
                        </el-date-picker>
                        <select-department
                            placeholder="所属部门"
                            v-model="filtersMonth.DepartmentId"
                        ></select-department>
                        <el-input
                            v-model="filtersMonth.VehicleNo"
                            placeholder="车牌号"
                            clearable
                        ></el-input>
                        <el-input
                            v-model="filtersMonth.CheckUserName"
                            placeholder="检查人"
                            clearable
                        ></el-input>
                        <el-select
                            v-model="filtersMonth.Status"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="已检查" value="2"></el-option>
                            <el-option label="未检查" value="1"></el-option>
                        </el-select>
                        <el-button
                            type="primary"
                            @click="handleSearchMonth"
                            >查询</el-button
                        >
                    </div>
                    <div class="f--c">
                        <el-button
                            @click="downloadmbs(140, 1403, filtersMonth)"
                            >导出</el-button>
                    </div>
        </div>
        <!--工具条结束-->

        <!--列表开始-->
        <el-table
            :data="listMonth"
            :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{ ...$tableStyle, textAlign: 'center' }"
            :height="scrollHeight"
        >
            <el-table-column label="序号" type="index" width="80">
            </el-table-column>
            <el-table-column
                prop="DepartmentName"
                align="center"
                label="所属部门"
            >
            </el-table-column>
            <el-table-column prop="VehicleNo" align="center" label="车牌号">
            </el-table-column>
            <el-table-column
                label="驾驶员"
                width="120"
                align="center"
                prop="DriverName"
            >
            </el-table-column>
            <el-table-column prop="CheckUserName" align="center" label="检查人">
            </el-table-column>
            <el-table-column
                prop="CheckTimeDesc"
                align="center"
                label="检查时间"
            >
            </el-table-column>
            <el-table-column label="状态" align="center" header-align="center">
                <template slot-scope="scope">
                    <whether :yes="scope.row.Status == 2" :text="scope.row.Status == 2 ? '已检查' : '未检查'"/>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            @click="showViewDialog(scope.$index, scope.row)"
                            v-if="scope.row.VehicleSafelyCheckId != 0"
                            >查看</el-button
                        >
                        <!-- 需要前端实现一车一档PDF下载 -->
                        <!-- <el-button
                            type="text"
                            @click="
                                downloadmbs(140, 1402, scope.row.VehicleSafelyCheckId)
                            "
                            v-if="scope.row.VehicleSafelyCheckId != 0"
                            >下载</el-button
                        > -->
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--列表结束-->
        <!--弹层开始-->
        <el-dialog v-dialog-drag 
            title="查看详情"
            :visible.sync="addShow"
            :close-on-click-modal="false"
            @close="dialogClear"
            width="50%"
        >
            <el-scrollbar class="scrollbar">
                <checkInfo ref="dialogView"></checkInfo>
            </el-scrollbar>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addShow = false">关闭</el-button>
            </span>
        </el-dialog>
        <!--弹层结束-->
    </page-layout>
</template>

<script>
import checkInfo from "./checkInfo";
import request_mixin from "@/mixins/request-mixin.js";
import Import_export from "@/mixins/Import_export.js";
export default {
    name: "MonthSafelyCheckPage",
    mixins: [request_mixin, Import_export],
    components: {
        checkInfo,
    },
    data() {
        return {
            loading: false,
            addShow: false,
            scrollHeight: 200,
            list: [],
            filtersMonth: {
                Status: "",
                SearchMonth: "",
                VehicleNo: "",
                CheckUserName: "",
                DepartmentId: "",
            },
            listMonth: [],
        };
    },
    mounted() {
    },
    methods: {
        getScrollHeight(height) {
            this.scrollHeight = height;
        },
        handleSearchMonth() {
            this.Post("/GetVehicleSafelyCheckMonth", this.filtersMonth).then(
                (result) => {
                    if (result.status == 2000 && result.data) {
                        this.listMonth = result.data;
                    }
                }
            );
        },
        //弹层的取消
        dialogClear() {
            let than = this;
            than.addShow = false;
        },
        showViewDialog(index, row) {
            let than = this;
            than.addShow = true;
            than.id = row.VehicleSafelyCheckId;
            setTimeout(() => {
                than.$refs.dialogView.getMonthSafelyCheck(than.id);
            }, 500);
        },
    },
  mounted () {
    var dt = new Date()
    var m=(dt.getMonth()+1)
    this.filtersMonth.SearchMonth = dt.getFullYear() + "-" + m;
    this.handleSearchMonth();
  },
};
</script>

<style lang="scss" scoped>
.scrollbar{
    /deep/ .el-scrollbar__wrap {
        margin-bottom: 0 !important;
    }
}
</style>
