<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select placeholder="学习类型" clearable v-model="filters.LearningType">
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item" :value="index+1"></el-option>
                </el-select>
                <el-input placeholder="学习标题" clearable v-model="filters.Name"></el-input>
                <el-date-picker type="date" placeholder="学习日期" clearable v-model="filters.CreateTime"></el-date-picker>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <!-- <div class="f--c">
                <el-button-group>
                    <el-button>导出</el-button>
                </el-button-group>
            </div> -->
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
                label="学习类型"
                align="center"
                width="200"
            >
                <template slot-scope="{ row }">
                    {{ row.LearningInfo.LearningType | LearningTypeName }}
                </template>
            </el-table-column>
            <el-table-column
                label="学习标题"
                align="center"
            >
                <template slot-scope="{ row }">
                    {{ row.LearningInfo.Name }}
                </template>
            </el-table-column>
            <el-table-column
                label="学习日期"
                align="center"
                width="120"
                prop="CreateTimeDesc"
            >
            </el-table-column>
            <el-table-column
                label="完成率"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    {{ row.CompleteRate }}%
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row)" v-if="$_has('MRYXBtnLook')">查看</el-button>
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
const typeList = ['法律法规','技术规范','事故案例','培训课件','安全专题','教育培训视频'];
export default {
    name: 'task-distribution',
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
            typeList: typeList,
            filters: {
                LearningType: '',
                Name: '',
                CreateTime: ''
            }
        }
    },
    filters: {
        LearningTypeName: (num) => {
            let list = [''];
            list.push(...typeList)
            return list[num]
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
                let res = await this.Post('/GetLearningRecords', params);
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
        }
    }
}
</script>

<style>

</style>