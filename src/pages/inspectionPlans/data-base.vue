<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        
        <div slot="header" class="header f-c" v-if="userInfo.Enterprise.IsSingleEnterprise != 1">
            <div class="header-tab f-c-c">
                <div class="item" :class="{active: IsPrivate == 0}" @click="changeStore(0)">公库</div>
                <div class="item" :class="{active: IsPrivate == 1}" @click="changeStore(1)">私库</div>
            </div>
        </div>
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="检查表类型" clearable v-model="filters.ClassificationName"></el-input>
                <el-input placeholder="检查表名称" clearable v-model="filters.InspectionName"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" @click="add()" v-if="IsPrivate == 1">新增</el-button>
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
                label="检查表类型"
                align="center"
                width="200"
                prop="GroupPath"
            >
            </el-table-column>
            <el-table-column
                label="检查表名称"
                align="center"
                prop="InspectionName"
            >
            </el-table-column>
            <el-table-column
                label="检查内容（项）"
                align="center"
                width="180"
                prop="ItemContentCount"
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
                width="160"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="preview(row)">查看</el-button>
                        <el-button type="text" @click="add(row)" v-if="row.IsOp">编辑</el-button>
                        <el-button type="text" text-plain @click="remove(row)" v-if="row.IsOp">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" :IsPrivate="IsPrivate" @load="handlePageChange(1)"/>
        <preview ref="preview"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from '@/pages/dataBase/inspections/info';
import preview from '@/pages/dataBase/inspections/preview';
import Qs from 'qs';
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
            },
            IsPrivate: 0,
            userInfo: Qs.parse(localStorage.getItem('userinfo'))
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
                IsPrivate: this.IsPrivate,
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
        },
        changeStore(val) {
            if (this.IsPrivate == val) return;
            this.IsPrivate = val;
            this.handlePageChange(1);
        }
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
            background: #63B0FF url(../../assets/images/data-base/learn.png) no-repeat center center;
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