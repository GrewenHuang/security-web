<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="类型名称" clearable v-model="filters.VehicleTypeName"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" @click="add()" v-if="$_has('CLLXBtnAdd')">新增</el-button>
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
                label="类型名称"
                align="center"
                width="200"
                prop="VehicleTypeName"
            >
            </el-table-column>
			<el-table-column
			    label="行车日志模板"
			    align="center"
			    width="130"
			    prop="LogbookConfigName"
				:show-overflow-tooltip="true"
			>
			</el-table-column>
			<el-table-column
			    label="车辆巡检模板"
			    align="center"
			    width="130"
			    prop="VehicleSafelyCheckConfigName"
				:show-overflow-tooltip="true"
			>
			</el-table-column>
			<el-table-column
			    label="排序"
			    align="center"
			    width="50"
			    prop="Sort"
			>
			</el-table-column>
			<el-table-column
			    label="关联证照"
			    align="center"
			    width="200"
			    prop="CertificateName"
				:show-overflow-tooltip="true"
			>
			</el-table-column>
            <el-table-column
                label="备注"
                align="center"
                prop="Remark"
            >
            </el-table-column>
			<el-table-column
			    label="更新人"
			    align="center"
			    prop="UpdateByName"
			>
			</el-table-column>
			<el-table-column
			    label="更新时间"
			    align="center"
			    prop="UpdateTimeDesc"
				width="200"
			>
			</el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row)" v-if="$_has('CLLXBtnEdit')">编辑</el-button>
                        <el-button type="text" text-plain @click="remove(row)" v-if="$_has('CLLXBtnDelete')">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
export default {
    name: 'task-distribution',
    components: {
        info
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
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
                let res = await this.Post('/GetVehicleTypes', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item) {
            this.$refs.info.show(item)
        },
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post('/DeleteVehicleType', {
                    Ids: [row.VehicleTypeId],
                }).then((res) => {
                    if (res.status == 2000) {
                        this.getList();
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                        });
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        }
    }
}
</script>

<style>

</style>