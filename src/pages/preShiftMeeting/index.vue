<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-date-picker
                    type="date"
                    placeholder="召开日期"
                    clearable
                    v-model="filters.MeetingDate"
                ></el-date-picker>
                <el-input
                    placeholder="主讲人"
                    v-model="filters.SpeakerName"
                ></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
           <!-- <div class="f--c" v-if="issubsidiary">
                <el-button type="primary" @click="add()">新增</el-button>
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
			    label="部门"
			    align="center"
			    width="120"
			    prop="DepartmentName"
			>
			</el-table-column>
			<el-table-column
			    label="岗位"
			    align="center"
			    width="120"
			    prop="PositionName"
			>
			</el-table-column>
			<el-table-column
			    label="班组长"
			    align="center"
			    width="120"
			    prop="LeaderName"
			>
			</el-table-column>
			<!-- TeamLeaderName -->
            <el-table-column
                label="参与人"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="{ row }">
                    {{ row.Users.map(item => item.UserName).join('、') }}
                </template>
            </el-table-column>
            <el-table-column
                label="完成情况"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    {{ meetingStatus[row.Status] }}
                </template>
            </el-table-column>
			<el-table-column
			    label="召开日期"
			    align="center"
			    width="120"
			    prop="MeetingDateDesc"
			>
			</el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="show(row, true)" v-if="$_has('RWXQBQHBtnLook')">查看</el-button>
                        <!-- <el-button type="text" text-plain @click="remove(row)" v-if="row.Status == 0&&issubsidiary">删除</el-button> -->
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
        <preview ref="preview" @load="handlePageChange(1)" />
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
import preview from './preview';
export default {
    name: 'task-distribution',
    components: {
        info,
        preview
    },
    props:{
        issubsidiary:{
            type:Boolean,
            default:true
        }
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            meetingStatus: {
                0: '未开始',
                1: '进行中',
                2: '已结束',
            },
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {
                MeetingDate: '',
                SpeakerName: ''   
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
                let res = await this.Post('/GetPreMeetingSigns', params);
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
                this.Post('/DeletePreMeetingSign', {
                    Ids: [row.PreMeetingSignId],
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
        show(row) {
            this.$refs.preview.show(row);
            if(!this.issubsidiary){this.$refs.preview.updataissubsidiary(row)}
        },
    }
}
</script>

<style>

</style>