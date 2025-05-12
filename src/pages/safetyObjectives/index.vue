<template>
    <page-layout class="safety-objectives" :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="目标名称" clearable
                    v-model="filters.Name"
                ></el-input>
                <el-date-picker type="year" placeholder="选择年份" clearable
                    v-model="filters.Year"
                ></el-date-picker>
                <el-select v-model="filters.Status" clearable>
                    <el-option label="未完成" value="0"></el-option>
                    <el-option label="已完成" value="1"></el-option>
                    <el-option label="待下发" value="2"></el-option>
                </el-select>
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
                type="expand"
                width="40"
            >
                <template slot-scope="{ row }">
                    <div style="padding: 8px;background: #fafafa;">
                        <el-table
                            :data="row.ItemList"
                            style="width: 100%"
                            default-expand-all
                            row-key="SafetyGoalItemId"
                            :tree-props="{children: 'ChildrenItemList', hasChildren: 'hasChildren'}"
                        >
                            <!-- <el-table-column
                                label="序号"
                                type="index"
                                align="center"
                                width="50"
                            ></el-table-column> -->
                            <el-table-column
                                label="目标内容"
                                prop="ItemContent"
                            ></el-table-column>
                            <el-table-column
                                label="责任部门"
                                align="center"
                                width="120"
                                prop="DepartmentName"
                            ></el-table-column>
                            <el-table-column
                                label="责任人"
                                align="center"
                                width="120"
                                prop="UserName"
                            ></el-table-column>
                            <el-table-column
                                label="开始日期"
                                align="center"
                                width="120"
                                prop="StartDateDesc"
                            ></el-table-column>
                            <el-table-column
                                label="结束日期"
                                align="center"
                                width="120"
                                prop="EndDateDesc"
                            ></el-table-column>
                            <el-table-column
                                label="完成状态"
                                align="center"
                                width="120"
                            >
                                <template slot-scope="{ row }">
                                    <whether :yes="row.Status == 1" :text="statusObj[row.Status]"/>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="100"
                            >
                                <template slot-scope="{ row }">
                                    <el-button type="text" @click="preview(row)">查看</el-button>
                                </template>
                            </el-table-column>
                            
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
            ></el-table-column>
            <el-table-column
                label="目标年份"
                align="center"
                width="120"
                prop="Year"
            >
            </el-table-column>
            <el-table-column
                label="目标名称"
                align="left"
                prop="Name"
                width="450"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="目标说明"
                show-overflow-tooltip
                align="center"
                prop="Remark"
            >
            </el-table-column>
            <el-table-column
                label="完成状态"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <whether :yes="row.Status == 1" :text="statusObj[row.Status]"/>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="240"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <template v-if="row.Status == 2">
                            <el-button type="text" @click="issued(row)">下发</el-button>
                            <el-button type="text" @click="add(row)">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)">删除</el-button>
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
    name: 'safety-objectives',
    components: {
        info,
        preview
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            list: [],
            statusObj: {
                0: '未完成',
                1: '已完成',
                2: '待下发'
            },
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                Year: '',
                Name: '',
                Status: '',
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
                let res = await this.Post('/GetSafetyGoals', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item) {
            this.$refs.info.show(item)
        },
        issued(item) {
            this.$confirm('确认下发目标吗？', '提示', {}).then(async _ => {
                let res = await this.Get(`/IssuedSafetyGoal?safetyGoalId=${item.SafetyGoalId}`);
                if (res.status == 2000){
                    this.$message.success('下发成功');
                    this.handlePageChange(1);
                }
            })
        },
        remove(row) {
            this.$confirm('确认删除这条目标？', '提示', {}).then(async _ => {
                let res = await this.Post('/DeleteSafetyGoal', {Ids: [row.SafetyGoalId]});
                if (res.status == 2000) {
                    this.$message.success('已删除');
                    this.handlePageChange(1);
                }
            })
        },
        preview(item) {
            this.$refs.preview.show(item);
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
