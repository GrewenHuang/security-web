<template>
    <page-layout :loading="loading">
		<div slot="operation" class="f-e-c">
		    <div class="input-content">
		       <div class="f--c">
		           <el-button type="primary" @click="add()"  v-if="$_has('BQKBtnAdd')">新增</el-button>
		       </div>
		    </div>
		</div>
        <el-table
            :data="list"
            highlight-current-row
            :header-cell-style="$tableStyle"
            row-key="ClassificationLibraryId"
            :tree-props="{children: 'Childs', hasChildren: 'hasChildren'}"
            style="width: 100%"
        >
            <el-table-column
                label="名称"
                prop="ClassificationName"
            >
            </el-table-column>
            <el-table-column
                label="创建人"
                align="center"
                width="180"
                prop="CreateByName"
            >
            </el-table-column>
            <el-table-column
                label="创建时间"
                align="center"
                width="150"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150">
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row)" v-if="$_has('BQKBtnEdit')">编辑</el-button>
                        <el-button type="text" text-plain @click="remove(row)" v-if="$_has('BQKBtnDelete')">删除</el-button>
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
    components: {
        info
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            list: [],
            
            filters: {

            }
        }
    },
    created() {
        this.handlePageChange(1);
    },
    methods: {
        handlePageChange(val) {
            this.getList();
        },
        async getList() {
            let params = {
                ...this.filters,
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetClassificationLibraryList', params);
                if (res.status === 2000) {
                    this.list = res.data;
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
                this.Get('/DeleteClassificationLibrary', {
                    classificationLibraryId: row.ClassificationLibraryId,
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