<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        
       <!-- <div slot="header" class="custom-operation">
            <el-button type="primary" @click="downloadmbs(1610, 16108, filters)" v-if="$_has('XCBBBtnExport')">导出</el-button>
        </div> -->
        <div class="f-b-c operation">
            <div class="input-content f--c">
                <el-input placeholder="姓名" clearable v-model="filters.UserName"></el-input>
                <select-department clearable placeholder="部门" multiple v-model="filters.DepartmentIds"></select-department>
                <select-position clearable placeholder="岗位" multiple v-model="filters.PositionIds"></select-position>
                <custom-date-range style="width:360px;margin-right: 5px;" :hasIsLong="false" v-model="filters.date"/>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
			 <el-button type="primary" @click="downloadmbs(1610, 16108, filters)" v-if="$_has('XCBBBtnExport')">导出</el-button>
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
                prop="UserName"
            >
            </el-table-column>
            <el-table-column label="部门" align="center" show-overflow-tooltip>
                <template slot-scope="{ row }">
                    {{ row.DepartmentList.map(item => item.DepartmentName).join('、') }}
                </template>
            </el-table-column>
            <el-table-column label="岗位" align="center" show-overflow-tooltip>
                <template slot-scope="{ row }">
                    {{ row.PositionList.map(item => item.PositionName).join('、') }}
                </template>
            </el-table-column>
            <el-table-column
                label="应巡查"
                align="center"
                width="150"
                prop="InspectionCount"
            >
            </el-table-column>
            <el-table-column
                label="已巡查"
                align="center"
                width="150"
                prop="InspectedCount"
            >
            </el-table-column>
            <el-table-column
                label="未巡查"
                align="center"
                width="140"
                prop="NoInspectionCount"
            >
            </el-table-column>
            <el-table-column
                label="异常数"
                align="center"
                width="140"
                prop="AbnormalCount"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="140"
            >
                <template slot-scope="{ row }">
                    <el-button type="text" @click="preview(row)" v-if="$_has('XCBBBtnLook')">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
		<el-dialog v-dialog-drag title="巡查记录" :visible.sync="isShow"
			:close-on-click-modal="false" @close="isShow = false" top="8vh" width="80%">
				<info ref="infoList"></info>
		</el-dialog>
    </page-layout>
	
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import Import_export from "@/mixins/Import_export.js";
import info from './info'
function getDefaultStartAndEndTime(startTime, endTime) {
    let year = new Date(startTime||endTime).getFullYear();
    if (!!year) {
        return {
            StartTime: startTime || (year + '-01-01'),
            EndTime: endTime || (year + '-12-31'),    
        }
    }
    return {
        StartTime: '',
        EndTime: '',
    }
}
export default {
    components: {
		info
    },
    mixins: [request_mixins, Import_export],
    data() {
        let currentYear = new Date().getFullYear() + '-01-01';
        return {
			isShow: false,
            loading: false,
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                date: currentYear + ',,',
            }
        }
    },
    watch: {
        'filters.date': {
            immediate: true,
            handler() {
                let params = this.filters;
                let date = params.date.split(',');
                params.StartTime = date[0];
                params.EndTime = date[1];
            }
        },
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
            let date = params.date.split(',');
            params.StartTime = date[0];
            params.EndTime = date[1];
            this.loading = true;
            try {
                let res = await this.Post('/GetRiskReportListUser', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        preview(item) {
            let date = this.filters.date.split(',');
            let params = {
                InspectorName: item.UserName,
                ...getDefaultStartAndEndTime(date[0], date[1])
            };
			this.isShow = true
			this.$nextTick(()=>{
				this.$refs.infoList.show(params)
			})
			
			
            // this.$router.push({
            //     name: '风险单元巡查',
            //     params: params
            // });
            // this.$parent.$parent.$parent.$parent.$parent.selectmenu('/Inspection');
        }
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
        margin-right: 5px;
    }
}
</style>
