<template>
    <page-layout
        :loading="loading"
        v-bind="$attrs"
    >
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <select-department placeholder="部门" v-model="filters.DepartmentIds" multiple collapseTags></select-department>
                <div style="width: 385px;">
                    <custom-date-range v-model="dateRange" @change="changeDaterange" :has-is-long="false"></custom-date-range>
                </div>
                <el-button type="primary" @click="getList">查询</el-button>
            </div>
            <!-- <div class="f--c">
                <el-button-group>
                    <el-button>导出</el-button>
                </el-button-group>
            </div> -->
        </div>
        <el-table
            :data="list"
            :header-cell-style="$tableStyle"
            style="width: 100%"
        >
            <el-table-column
                label="排名"
                prop="Rank"
                width="60"
                header-align="center"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="部门"
                align="center"
                prop="DepartmentName"
                width="180"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="积分获取来源"
                align="center"
            >
                <template slot-scope="{ row }">
                    <custom-tags :successList="row.AddCodeList" :warningList="row.ReduceCodeList"></custom-tags>
                </template>
            </el-table-column>
            <el-table-column
                label="总积分"
                prop="TotalScore"
                align="center"
                width="140"
            >
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="show(scope.row)"
                        >查看</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" />
    </page-layout>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import info from "./info.vue";
export default {
    mixins: [request_mixin],
    components: {
        info
    },
    props:{
        issubsidiary:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            date: [],
            list: [],
            filters: {
                DepartmentIds: [],
                StartTime: '',
                EndTime: ''
            },
            dateRange: '',
            loading: false,
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;
            let params = {
                ...this.filters
            }
            this.Post("/GetIntegralsByDepartment", params)
                .then((res) => {
                    if (res.status == 2000) {
                        this.list = res.data;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changeDaterange() {
            let list = this.dateRange.split(',');
            this.filters.StartTime = list[0]
            this.filters.EndTime = list[1]
        },
        show(row) {
            this.$refs.info.show(row, 1, {
                StartTime: this.filters.StartTime,
                EndTime: this.filters.EndTime
            })
            this.$refs.info.updataissubsidiary(this.issubsidiary)
        }
    },
};
</script>
<style scoped>
</style>