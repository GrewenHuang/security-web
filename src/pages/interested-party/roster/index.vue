<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <select-department clearable placeholder="管控责任部门" v-model="filters.DepartmentId"></select-department>
                <el-select clearable placeholder="相关方类型" v-model="filters.RelatedPartyTypeId">
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item.Name" :value="item.RelatedPartyTypeId"></el-option>
                </el-select>
                <el-input placeholder="相关方名称/信用代码/联系人/联系电话" clearable v-model="filters.Query"></el-input>
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
                label="管控责任部门"
                align="center"
                width="200"
                prop="DepartmentName"
            >
            </el-table-column>
            <el-table-column
                label="相关方名称"
                align="center"
                prop="Name"
            >
            </el-table-column>
            <el-table-column
                label="相关方类型"
                align="center"
                prop="RelatedPartyTypeName"
                width="140"
            >
            </el-table-column>
            <el-table-column
                label="统一社会信用代码"
                align="center"
                prop="SocialCreditCode"
                width="160"
            >
            </el-table-column>
            <el-table-column
                label="联系人"
                align="center"
                prop="UserName"
                width="120"
            >
            </el-table-column>
            <el-table-column
                label="联系电话"
                align="center"
                prop="Tel"
                width="120"
            >
            </el-table-column>
            <el-table-column
                label="证书"
                align="center"
                width="80"
            >
                <template slot-scope="{ row }">
                    <el-button type="text" @click="preview('cert', row.RelatedPartyId)">查看</el-button>    
                </template>
            </el-table-column>
            <el-table-column
                label="人员"
                align="center"
                width="80"
            >
                
                <template slot-scope="{ row }">
                    <el-button type="text" @click="preview('personnel', row.RelatedPartyId)">查看</el-button>
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
        <certs ref="cert" />
        <personnels ref="personnel" />
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
import personnels from './personnels.vue';
import certs from './certs.vue';
export default {
    components: {
        info,
        personnels,
        certs
        
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

            },
            typeList: []
        }
    },
    created() {
        this.getTypeList();
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
                let res = await this.Post('/GetRelatedPartys', params);
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
                this.Post('/DeleteRelatedParty', {
                    ids: [row.RelatedPartyId],
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
        preview(refName, id) {
            this.$refs[refName].show(id);
        },
        async getTypeList() {
            let res = await this.Post('GetRelatedPartyTypeList', {Name: ''});
            if (res.status == 2000) {
                this.typeList = res.data;
            }
        }
    }
}
</script>

<style>

</style>
