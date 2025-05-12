<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <!-- <el-input placeholder="检查表类型" clearable v-model="filters.ClassificationName"></el-input> -->
                <el-input placeholder="检查表名称" clearable v-model="filters.InspectionName"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" @click="add()" v-if="$_has('JCBKBtnAdd')">新增</el-button>
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
          <!--  <el-table-column
                label="检查表类型"
                align="center"
                width="200"
                prop="ClassificationName"
            >
            </el-table-column> -->
            <el-table-column
                label="检查表名称"
                align="center"
                prop="InspectionName"
            >
            </el-table-column>
            <el-table-column
                label="检查内容（项）"
                align="center"
                prop="ItemContentCount"
            >
            </el-table-column>
            <el-table-column
                label="创建人"
                align="center"
                prop="CreateByName"
            >
            </el-table-column>
            <el-table-column
                label="创建日期"
                align="center"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="160"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        
                        <template>
							<el-button type="text" @click="preview(row)" v-if="$_has('JCBKBtnLook')">查看</el-button>
                            <el-button type="text" @click="add(row)" v-if="$_has('JCBKBtnEdit')">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)" v-if="$_has('JCBKBtnDelete')">删除</el-button>
                        </template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
        <preview ref="preview"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
import preview from './preview';
export default {
    components: {
        info,
        preview
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
                QueryScope: 2
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
                let res = await this.Post('/GetInspections', params);
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
                this.Get('/DeleteInspection', {
                    inspectionId: row.InspectionId,
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
        },
        preview(row) {
            this.$refs.preview.show(row);
        }
    }
}
</script>

<style>

</style>