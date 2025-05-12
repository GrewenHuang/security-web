<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16101, filters)">导出</el-button>
        </div>
        <div class="f-b-c operation">
            <div class="input-content">
                <el-input placeholder="姓名" clearable v-model="filters.UserName"></el-input>
                <select-department clearable placeholder="部门" multiple v-model="filters.DepartmentIds"></select-department>
                <select-position clearable placeholder="岗位" multiple v-model="filters.PositionIds"></select-position>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
        </div>
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
                width="50"
            >
            </el-table-column>
            <el-table-column
                label="姓名"
                align="center"
                width="180"
                prop="UserName"
            >
            </el-table-column>
            
            <el-table-column label="部门" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.DepartmentList.map(item => item.DepartmentName).join('、') }}
                </template>
            </el-table-column>
            <el-table-column label="岗位" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
                </template>
            </el-table-column>
            <el-table-column
                label="是否签订劳动合同"
                align="center"
                width="140"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.IsLaborContract == 1" />
                </template>
            </el-table-column>
            <el-table-column
                label="是否签订承诺书"
                align="center"
                width="140"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.IsSafetyCommitment == 1" />
                </template>
            </el-table-column>
            <el-table-column
                label="是否签订责任书"
                align="center"
                width="140"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.IsLetter == 1" />
                </template>
            </el-table-column>
            <el-table-column
                label="是否上传体检证明"
                align="center"
                width="140"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.IsMedicalCertificate == 1" />
                </template>
            </el-table-column>
            <el-table-column
                label="是否完成岗前培训"
                align="center"
                width="140"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.IsPreTrain == 1" />
                </template>
            </el-table-column>
            <el-table-column
                label="获得积分"
                align="center"
                width="120"
                prop="Integral"
            ></el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="showUserInfo(row.UserId)">查看</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        
        <!--编辑弹层 开始-->
        <el-dialog v-dialog-drag 
            title="档案信息"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            @close="closeUserInfo()"
            class="dialog basic-info-dialog"
            width="900px"
            top="5vh"
        >
            <el-scrollbar class="scrollbar" ref="userInfoScrollbar">
                <userAdd
                    style="margin-top: 10px;"
                    ref="BaseDTO"
                    :data="BaseInfo"
                />
            </el-scrollbar>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="closeUserInfo()">关闭</el-button>
            </div>
        </el-dialog>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import userAdd from "@/pages/Enterprises/Users/userAdd.vue";
import Import_export from "@/mixins/Import_export.js";
export default {
    components: {
        userAdd
    },
    mixins: [request_mixins, Import_export],
    data() {
        return {
            loading: false,
            dialogShow: false,
            BaseInfo: {},
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {

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
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetUserReportList', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        showUserInfo(id) {
            this.dialogShow = true;
            this.Get("/GetEnterpriseUserV3", { UserId: id }).then((res) => {
                if (res.status == 2000) {
                    this.BaseInfo = res.data.BaseDTO;
                }
            });
        },
        closeUserInfo() {
            this.dialogShow = false;
        },
        
    }
}
</script>

<style lang="scss" scoped>

.custom-operation{
    position: absolute;
    top: -6.25%;
    right: 0;
}
.operation{
    padding: 0 0 20px;;
}
.input-content{
    [class^=el]:not(.el-button){
        width: 180px;
    }
}
</style>
