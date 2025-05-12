<template>
    <page-layout :loading="loading">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="企业名称" clearable v-model="filters.EnterpriseName"></el-input>
                <el-select v-model="filters.Status" clearable placeholder="状态">
                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-button type="primary" @click="getList">查询</el-button>
            </div>
            <div class="f--c" v-if="$_has('QYLBBtnAdd')">
                <el-button type="primary" icon="el-icon-plus" @click="add()" >新增</el-button>
            </div>
        </div>

        <el-table 
            :data="list"
            highlight-current-row
            :header-cell-style="$tableStyle"
            style="width: 100%"
            default-expand-all
            row-key="EnterpriseId"
            :tree-props="{children: 'SubEnterprises', hasChildren: 'hasChildren'}"
        >
            <el-table-column
                label="序号"
                type="index"
                align="center"
                width="50"
            >
            </el-table-column>
            <el-table-column
                label="企业名称"
                align="center"
            >
                <template slot-scope="{ row }">
                    <!-- <el-link type="primary" :href="`#/subsidiary/enterpriseDataInfo?id=${row.EnterpriseId}&name=${row.EnterpriseName}`" target="_blank">{{ row.EnterpriseName }}</el-link> -->
                    {{ row.EnterpriseName }}
                </template>
            </el-table-column>
			<el-table-column
			    label="企业简称"
			    align="center"
				prop="EnterpriseNameAs"
			>
			</el-table-column>
            <el-table-column
                label="主要负责人姓名"
                align="center"
                prop="LegalPersionName"
            >
            </el-table-column>
            <el-table-column
                label="主要负责人电话"
                align="center"
                prop="LegalPersionTel"
            >
            </el-table-column>
			<el-table-column
			    label="地址"
			    align="center"
			    prop="EnterpriseAddress"
				width="300"
			>
			</el-table-column>
			<el-table-column
			    label="更新人"
			    align="center"
			    prop="UpdateName"
			>
			</el-table-column>
			<el-table-column
			    label="更新时间"
			    align="center"
			    prop="UpdateTimeDesc"
			>
			</el-table-column>
           <!-- <el-table-column
                label="状态"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.Status == 1" :text="row.Status ? '启用' : '停用'"/>
                </template>
            </el-table-column> -->
            <!-- 目前分子公司不能被删除，是否有调整不明 -->
			 <!-- v-if="$_has('company-add')" -->
            <el-table-column
                label="操作"
                align="center"
                width="300"
               
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
						<el-button type="text" @click="look(row)" v-if="$_has('QYLBBtnLook')">查看</el-button>
                        <el-button type="text" @click="edit(row)" v-if="$_has('QYLBBtnEdit')">编辑</el-button>
						<el-button type="text" @click="downloadmbs(1910, 19101, {EnterpriseId: row.EnterpriseId})" v-if="$_has('QYLBBtnDown')">下载</el-button>
						<el-button type="text" @click="organization(row)" v-if="$_has('QYLBBtnZZJG')">组织架构</el-button>
                        <el-button type="text" text-plain @click="remove(row)" v-if="$_has('QYLBBtnDetele')">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @success="getList"/>
		<look ref="look" />
		<organization ref="organization" />
    </page-layout>
</template>

<script>
import info from './info'
import look from './look'
import organization from './organization'
import request_mixin from '@/mixins/request-mixin';
import { mapState } from 'vuex';
import Import_export from "@/mixins/Import_export.js";
export default {
    name: 'constituent-company',
    mixins: [request_mixin,Import_export],
    components: {
        info,
		look,
		organization
    },
    data() {
        return {
			isParent: 'is-parent',
            loading: false,
            filters: {
                EnterpriseName: '', // 公司名称
                Status: '', // 状态
                IndustryCode: '', // 行业
            },
            list: [],
        }
    },
    computed: {
        ...mapState(['industryCode', 'statusList']),
    },
    methods: {
        async getList() {
            let params = {
                ...this.filters
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetSubEnterpriseList', params);
                this.list = res.data;
            } catch (error) {
                
            }
            this.loading = false;
        },
		look(item) {
			this.$refs.look.show(item)
		},
		edit(item){
			this.$refs.info.show(item)
		},
        add() {
            this.$refs.info.show();
        },
		organization(item){
			this.$refs.organization.show(item)
		},
        remove(item) {
            this.$confirm('此操作将永久删除该公司, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {
                try {
                    let res = await this.Post('/DeleteSubEnterprise', {Ids: [item.EnterpriseId]});
                    if (res.status == 2000) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList();
                    } else {
                        this.$message.error(res.message);
                    }
                } catch (error) {
                    
                }
            });
        }
    },
    created() {
        this.getList();
    }
}
</script>

<style>

</style>

