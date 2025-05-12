<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="header" class="header f-c" v-if="false">
            <div class="header-tab f-c-c">
                <div class="item" :class="{active: IsPrivate == 0}" @click="changeStore(0)">公库</div>
                <div class="item" :class="{active: IsPrivate == 1}" @click="changeStore(1)">私库</div>
            </div>
        </div>
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    placeholder="试题编号"
                    clearable
                    v-model="filters.SerialNumber"
                ></el-input>
                <el-select
                    placeholder="题型"
                    clearable
                    v-model="filters.TypeCode"
                >
                    <el-option v-for="(item, index) in TypeCom" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <el-input
                    placeholder="题干"
                    clearable
                    v-model="filters.Content"
                ></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button-group style="margin-right: 10px;">
                    <el-button @click="downloadmb('GetTemplateFile?templateFileEnumNum=9')">导入模板下载</el-button>
                    <el-button>
                        <el-upload
                            action="#"
                            :show-file-list="false"
                            :on-change="
                                (file) => {
                                    handleExcel(file, 'ImportContestQuestion', {IsPrivate: IsPrivate});
                                }
                            "
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                            >导入
                        </el-upload>
                    </el-button>
                    <el-button @click="downloadmbs(80, 801, {...filters, IsPrivate})">导出</el-button>
                </el-button-group>
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
                label="试题编号"
                align="center"
                width="140"
                prop="SerialNumber"
            >
            </el-table-column>
            <el-table-column
                label="题型"
                align="center"
                width="120"
                prop="TypeName"
            >
            </el-table-column>
            <el-table-column
                label="题干"
                align="center"
                prop="Content"
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
                label="创建日期"
                align="center"
                width="150"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="120"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <template>
							 <el-button type="text" @click="look(row)">查看</el-button>
                            <el-button type="text" @click="add(row)">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)">删除</el-button>
                        </template>

                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" :IsPrivate="IsPrivate" :isPreview="isParent" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import Download from "@/mixins/Download.js";
import Import_export from "@/mixins/Import_export.js";
import info from './info';

const IsPrivate = 0;
export default {
    components: {
        info
    },
    mixins: [request_mixins, Download, Import_export],
    data() {
        return {
            isParent: false,
            loading: false,
            list: [],
            TypeCom: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {

            },
            QueryScope: 2,
            IsPrivate: IsPrivate,
        }
    },
    created() {

        this.Get("/GetQuestionTypeCom").then((res) => {
            if (res.status == 2000) {
                this.TypeCom = res.data;
            }
        });
        this.handlePageChange(1);
    },
    methods: {
        handlePageChange(val) {
            this.pages.page = val;
            this.GetList();
        },
        async GetList() {
            let params = {
                QueryScope: this.QueryScope,
                IsPrivate: this.IsPrivate,
                ...this.pages,
                ...this.filters,
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetContestQuestions', params);
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
			this.isParent = false
            this.$refs.info.show(item)
        },
		look(item) {
			this.isParent = true
			this.$refs.info.show(item)
		},
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post(`/DeleteContestQuestion?contestQuestionId=${row.ContestQuestionId}`, {
                    contestQuestionId: row.ContestQuestionId,
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
        changeStore(num) {
            if (this.IsPrivate == num) return;
            this.IsPrivate = num;
            this.handlePageChange(1);
        },

    }
}
</script>

<style lang="scss" scoped>

.header{
    position: relative;
    padding-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
    .header-tab{
        margin: 0 auto;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            border-radius: 74px;
            border: 1px solid #fff;
            width: 74px;
            height: 74px;
            background: #63B0FF url(../../../assets/images/data-base/learn.png) no-repeat center center;
            background-size: cover;
        }
    }
    .item{
        border-radius: 6px;
        padding: 15px 72px;
        background: #fff;
        color: $--color-primary;
        cursor: pointer;
        &.active{
            background: $--color-primary;
            color: #fff;
        }
    }
    .operation{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }
}
</style>
