<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
       
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select placeholder="设备类型" clearable v-model="filters.EquipmentTypeName">
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item" :value="item"></el-option>
                </el-select>
                <el-input placeholder="设备名称" clearable v-model="filters.EquipmentName"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button-group style="margin-right: 10px;">
                    <el-button 
						v-if="$_has('SBSSKBtnBYMB')"
						@click="downloadmb('GetTemplateFile?templateFileEnumNum=4')"
                        >下载导入保养项模板</el-button
                    >
                    <el-button  v-if="$_has('SBSSKBtnBYImport')">
                        <el-upload
                            action="#"
                            :show-file-list="false"
                            :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportMaintainItem', {IsPrivate: 0});
                                }
                            "
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                            >导入保养项
                        </el-upload>
                    </el-button>
                    <el-button 
						 v-if="$_has('SBSSKBtnDJMB')"
						@click="downloadmb('GetTemplateFile?templateFileEnumNum=5')"
                        >下载导入点检项模板</el-button
                    >
                    <el-button  v-if="$_has('SBSSKBtnDJImport')">
                        <el-upload
                            action="#"
                            :show-file-list="false"
                            :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportSpotCheckItem', {IsPrivate: 0});
                                }
                            "
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                            >导入点检项
                        </el-upload>
                    </el-button>
                </el-button-group>
                <el-button type="primary" @click="add()"  v-if="$_has('SBSSKBtnAdd')">新增</el-button>
            </div>
        </div>
        <el-table
            :data="list"
            highlight-current-row
            :header-cell-style="$tableStyle"
            style="width: 100%"
            @sort-change="sortChange"
        >
            <el-table-column
                label="序号"
                type="index"
                align="center"
                width="50"
            >
            </el-table-column>
            <el-table-column
                label="设备类型"
                align="center"
                width="180"
                sortable="custom"
                prop="EquipmentTypeName"
            >
            </el-table-column>
            <el-table-column
                label="设备名称"
                align="center"
                sortable="custom"
                prop="EquipmentName"
            >
            </el-table-column>
            <el-table-column
                label="设备数"
                align="center"
                width="180"
                sortable="custom"
                prop="EquipmentCount"
            >
            </el-table-column>
            <el-table-column
                label="保养项目（项）"
                align="center"
                width="150"
                sortable="custom"
                prop="MaintainItemCount"
            >
            </el-table-column>
            <el-table-column
                label="点检项（项）"
                align="center"
                width="150"
                sortable="custom"
                prop="SpotCheckItemCount"
            >
            </el-table-column>
            <el-table-column
                label="创建人"
                align="center"
                width="120"
                sortable="custom"
                prop="UserName"
            >
            </el-table-column>
            <el-table-column
                label="创建日期"
                align="center"
                width="120"
                sortable="custom"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <template>
							<el-button type="text" @click="look(row)" v-if="$_has('SBSSKBtnLook')">查看</el-button>
                            <el-button type="text" @click="add(row)" v-if="$_has('SBSSKBtnEdit')">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)" v-if="$_has('SBSSKBtnDelete')">删除</el-button>
                        </template>
                        
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info slot="full" ref="info" :isPreview="isPreview" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";
import upload_mixin from "@/mixins/upload-mixin.js";

export default {
    components: {
        info
    },
    mixins: [request_mixins, Download, Import_export, upload_mixin],
    data() {
        return {
            loading: false,
            list: [],
			isPreview: false,
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                sort: '',
            },
            typeList: []
        }
    },
    created() {
        this.getEquipmentTypeList();
        this.handlePageChange(1);
    },
    methods: {
        handlePageChange(val) {
            this.pages.page = val;
            this.GetList();
        },
        async GetList() {
            let params = {
                ...this.pages,
                ...this.filters,
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetEquipmentList', params);
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
			this.isPreview = false
            this.$refs.info.show(item)
        },
		look(item){
			this.isPreview = true
			this.$refs.info.show(item)
		},
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post('/DeleteEquipment', {
                    Ids: [row.EquipmentId],
                }).then((res) => {
                    if (res.status == 2000) {
                        this.GetList();
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
        sortChange(a) {
            const orderObj = {
                descending: 'desc',
                ascending: 'aesc'
            }
            if (a.order) {
                if (a.prop == 'CreateTimeDesc') {
                    this.filters.sort = 'a.CreateTime';
                } else {
                    this.filters.sort = a.prop;
                }
                this.filters.order = orderObj[a.order] || '';
            } else {
                this.filters.sort = '';
                this.filters.order = '';
            }
            this.handlePageChange(1);
        },
        async getEquipmentTypeList() {
            let res = await this.Get('/GetEquipmentTypeList?equipmentTypeName=');
            if (res.status) {
                this.typeList = res.data;
            }
        }
    }
}
</script>

<style>

</style>
