<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="隐患类型" clearable v-model="filters.ClassificationName"></el-input>
                <el-select placeholder="隐患级别" clearable v-model="filters.PotentialLevelCode">
                    <el-option v-for="(item, index) in pitfallLevel" :key="index" :value="item.id" :label="item.text"></el-option>
                </el-select>
                <el-input placeholder="描述/依据/建议" clearable v-model="filters.Query"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button-group style="margin-right: 20px;">
                    <el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=10')" v-if="$_has('YHKBtnDown')">下载导入模板</el-button>
                    <el-button  v-if="$_has('YHKBtnImport')">
                        <el-upload
                            action="#"
                            :show-file-list="false"
                            :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportPotentialLibrary');
                                }
                            "
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                            >导入
                        </el-upload>
                    </el-button>
                    <el-button @click="downloadmbs(1510, 15106, filters)"  v-if="$_has('YHKBtnExport')">导出</el-button>
                </el-button-group>
                <el-button type="primary" @click="add()" v-if="$_has('YHKBtnAdd')">新增</el-button>
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
                label="隐患类型"
                align="center"
                width="200"
                prop="ClassificationName"
            >
            </el-table-column>
            <el-table-column
                label="隐患级别"
                align="center"
                prop="PotentialLevelName"
                width="120"
            >
            </el-table-column>
            <el-table-column
                label="隐患描述"
                align="center"
                prop="Describe"
                min-width="240"
            >
            </el-table-column>
            <el-table-column
                label="检查依据"
                align="center"
                prop="Basis"
                min-width="240"
            >
            </el-table-column>
            <el-table-column
                label="整改建议"
                align="center"
                prop="Suggestion"
                min-width="240"
            >
            </el-table-column>
            <el-table-column
                label="创建人"
                align="center"
                width="150"
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
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row)"  v-if="$_has('YHKBtnEdit')">编辑</el-button>
                        <el-button type="text" text-plain @click="remove(row)"  v-if="$_has('YHKBtnDelete')">删除</el-button>
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
import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";
export default {
    name: 'task-distribution',
    components: {
        info
    },
    mixins: [request_mixins, Download, Import_export],
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
            pitfallLevel: [],
        }
    },
    created() {
        this.getPitfallLevel();
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
                let res = await this.Post('/GetPotentialLibrarys', params);
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
                this.Get('/DeletePotentialLibrary', {
                    potentialLibraryId: row.PotentialLibraryId,
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
        async getPitfallLevel() {
            let res = await this.Get('/GetPotentialLevelCom');
            if (res.status == 2000) {
                this.pitfallLevel = res.data;
            }
        }
    }
}
</script>

<style>

</style>