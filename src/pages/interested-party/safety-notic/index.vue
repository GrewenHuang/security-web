<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="相关方名称" clearable v-model="filters.Name"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" @click="add()">新增</el-button>
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
                label="相关方名称"
                align="center"
                prop="RelatedPartyName"
            >
            </el-table-column>
            <el-table-column
                label="技术交底文件"
                align="center"
                width="180"
            >
                <template slot-scope="{ row }">
                    <el-button @click="$openFile(row.RelatedPartyInformFiles1[0].url)" v-if="!!row.RelatedPartyInformFiles1.length">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="安全协议"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <el-button @click="$openFile(row.RelatedPartyInformFiles2[0].url)" v-if="!!row.RelatedPartyInformFiles2.length">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="安全告知书"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <el-button @click="$openFile(row.RelatedPartyInformFiles3[0].url)" v-if="!!row.RelatedPartyInformFiles3.length">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row)">编辑</el-button>
                        <el-button type="text" text-plain @click="remove(row)">删除</el-button>
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
                let res = await this.Post('/GetRelatedPartyInforms', params);
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
                this.Post('/DeleteRelatedPartyInform', {
                    ids: [row.RelatedPartyInformId],
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
