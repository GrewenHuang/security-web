<template>
    <page-layout class="page" :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input
                    placeholder="竞赛标题"
                    clearable
                    v-model="filters.Title"
                ></el-input>
                <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="竞赛答案日期"
                    clearable
                    v-model="filters.ContestDate"
                ></el-date-picker>
                <el-input
                    placeholder="发布人"
                    clearable
                    v-model="filters.ReleaseUserName"
                ></el-input>
                <custom-date-range
                    startDatePlaceholder="发布开始日期"
                    endDatePlaceholder="发布结束日期"
                    :hasIsLong="false"
                    v-model="filters.date"
                ></custom-date-range>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" @click="add()" v-if="$_has('ZSJSBtnAdd')">新增</el-button>
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
                label="竞赛标题"
                align="center"
                prop="Title"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="竞赛答题日期"
                align="center"
                width="120"
                prop="ContestDateDesc"
            >
            </el-table-column>
            <el-table-column
                label="参与人数"
                align="center"
                width="180"
                prop="JoinCount"
            >
            </el-table-column>
            <el-table-column
                label="发布人"
                align="center"
                width="150"
                prop="ReleaseUserName"
            >
                <template slot-scope="{ row }">
                    {{ row.ReleaseUserName || '/' }}
                </template>
            </el-table-column>
            <el-table-column
                label="发布日期"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    {{ row.ReleaseDateDesc || '/' }}
                </template>
            </el-table-column>
			<el-table-column
			    label="安全等级"
			    align="center"
			    width="100"
			    prop="SecurityLevelDesc"
			>
			</el-table-column>
			
            <el-table-column
                label="状态"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.Status == 2" :warning="row.Status == 0" :gray="row.Status == 3" :text="statusObj[row.Status]"/>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="180"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="preview(row)" v-if="row.Status > 0 && $_has('ZSJSBtnLook')">查看</el-button>
                        <el-button type="text" style="color: #FE912E;" @click="release(row)" v-if="row.Status == 0 &&  $_has('ZSJSBtnFB')">发布</el-button>
                        <el-button type="text" @click="add(row)" v-if="row.Status == 0 && $_has('ZSJSBtnEdit')">编辑</el-button>
                        <el-button type="text" text-plain v-if="row.Status == 0 && $_has('ZSJSBtnDelete')">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
        <previewcompetition ref="previewcompetition"></previewcompetition>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
import previewcompetition from './previewcompetition.vue';
export default {
    name: 'task-distribution',
    components: {
        info,
        previewcompetition
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
                date: ''
            },
            statusObj: {
                0: '未发布',
                1: '未开始',
                2: '进行中',
                3: '已结束',
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
            let date = this.filters.date.split(',');
            params.ReleaseStartDate = date[0] || '';
            params.ReleaseEndDate = date[1] || '';
            this.loading = true;
            try {
                let res = await this.Post('/GetKnowledgeContests', params);
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
                this.Post('/DeleteKnowledgeContest', {
                    Ids: [row.KnowledgeContestId],
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
            this.$refs.previewcompetition.show(row);
        },
        release(row) {
            this.$confirm(`确认发布《${row.Title}》知识竞赛吗？`).then((_) => {
                this.Post(`/ReleaseKnowledgeContest?knowledgeContestId=${row.KnowledgeContestId}`, {
                    knowledgeContestId: row.KnowledgeContestId,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.getList();
                        this.$message({
                            message: '已发布',
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

<style lang="scss" scoped>
.page{
    /deep/ .date-range{
        width: 380px;
    }
}
</style>