<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handleCurrentChange">
        <!--工具条开始-->
        <div slot="operation" class="f-b-c">
                <div class="input-content">
                    <select-department
                        placeholder="所属部门"
                        v-model="filters.DepartmentId"
                    ></select-department>
                    <el-input
                        v-model="filters.VehicleNo"
                        placeholder="巡检车辆"
                        clearable
                        @keyup.enter.native="handleSearch"
                    ></el-input>
                   <!-- <el-input
                        v-model="filters.DriverName"
                        placeholder="巡检人"
                        clearable
                        @keyup.enter.native="handleSearch"
                    ></el-input> -->
                    <el-input
                        v-model="filters.CheckUserName"
                        placeholder="巡检人"
                        clearable
                        @keyup.enter.native="handleSearch"
                    ></el-input>
					<el-input
					    v-model="filters.CheckUserName"
					    placeholder="巡检状态"
					    clearable
					    @keyup.enter.native="handleSearch"
					></el-input>
                    <el-date-picker
                        v-model="filters.StartDate"
                        type="date"
                        placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        clearable
                        @keyup.enter.native="handleSearch"
                    >
                    </el-date-picker>
                    <el-date-picker
                        v-model="filters.EndDate"
                        type="date"
                        clearable
                        placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                    <el-button
                        type="primary"
                        @click="handleSearch"
                        >查询</el-button
                    >
                </div>
                <div class="f--c" v-if="$_has('CLXCBtnRecord')">
                    <el-button
                        @click="downloadmbs(140, 1401, filters)"
                        >导出</el-button
                    >
                </div>
        </div>
        <!--工具条结束-->
        <!--列表开始-->
        <el-table
            :data="list"
            highlight-current-row
            :header-cell-style="$tableStyle"
			@selection-change="handleSelectionChange"
        >
			<el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column
                label="序号"
                align="center"
                type="index"
                width="60"
            >
            </el-table-column>
            <el-table-column
                prop="DepartmentName"
                width="200"
                align="center"
                label="所属部门"
            >
            </el-table-column>
            <el-table-column
                label="巡检车辆"
                align="center"
                prop="VehicleNo"
            >
            </el-table-column>
            <el-table-column
                label="车辆负责人"
                align="center"
                prop="DriverName"
            >
            </el-table-column>
           <!-- <el-table-column align="center" label="异常项目">
                <template slot-scope="scope">
                    <div class="grid-content">
                        <template v-if="scope.row.CheckItems.length">
                            <custom-tag type="warning" v-for="(items, i) in scope.row.CheckItems" :key="i" :text="items.ItemName"/>
                        </template>
                        <span v-else>无</span>
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column
                label="巡检人"
                align="center"
                prop="CheckUserName"
            >
            </el-table-column>
            <el-table-column
                label="巡检时间"
                width="160"
                align="center"
                prop="CheckLongTimeDesc"
            >
            </el-table-column>
			<el-table-column
			    label="巡检周期"
			    align="center"
			    prop="zq"
			>
			</el-table-column>
			<el-table-column
			    label="巡检状态"
			    align="center"
			    prop="zt"
			>
			</el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
							v-if="$_has('CLXCBtnRecord')"
                            type="text"
                            @click="showViewDialog(scope.$index, scope.row)"
                            >查看</el-button
                        >
                        <!-- 需要前端实现一车一档PDF下载 -->
                        <el-button
							v-if="$_has('CLXCBtnRecord')"
                            type="text"
                            @click="
                                downloadmbs(140, 1402, scope.row.VehicleSafelyCheckId)
                            "
                            >下载</el-button
                        >
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
    name: "safe-check-record",
    mixins: [request_mixin, Import_export],
    components: {
        checkInfo,
    },
    data() {
        return {
            loading: false,
            addShow: false,
            list: [],
            pages: {
                total: 0,
                page: 1,
                rows: 10,
            },
            filters: {},
			multipleSelection:[]
        };
    },
    methods: {
		handleSelectionChange(val) {
			// 选择列表
			this.multipleSelection = val;
		},
        //获取列表数据
        GetList() {
            let that = this;
            let params = Object.assign(
                {
                    page: that.pages.page,
                    rows: that.pages.rows,
                },
                that.filters
            );

            this.Post("/GetVehicleSafelyChecks", params).then((res) => {
                if (res.status == 2000) {
                    this.list = res.data.list.map(item => {
                        item.CheckItems = item.CheckItems.filter(obj => {
                            return obj.IsNormal != 1
                        })
                        return item;
                    });
                    this.pages.total = res.data.count;
                }
            });
        },
        //分页事件
        handleCurrentChange(val) {
            this.pages.page = val;
            this.GetList();
        },
        //搜索事件
        handleSearch() {
            this.pages.page = 1;
            this.GetList();
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
    mounted() {
        this.handleSearch();
    },
};
</script>

<style lang="scss" scope>
.grid-content{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    >div{
        margin-bottom: 5px;
        &:not(:first-child){
            margin-left: 5px;
        }
    }
}
.scrollbar{
    /deep/ .el-scrollbar__wrap {
        margin-bottom: 0 !important;
    }
}
</style>
