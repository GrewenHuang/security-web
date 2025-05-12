<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
				<el-input
				    placeholder="企业"
				    v-model="filters.SpeakerName"
				></el-input>
				<custom-tree
				    v-model="filters.DepartmentIds"
				    :data="departmentList"
				    :expand-all="true"
				    :check-strictly="true"
				    :collapse-tags="true"
				    node-key="value"
				    :immediately="true"
					selectedId="DepartmentId"
				></custom-tree>
				<el-select
				    v-model="filters.PositionIds"
				    clearable
				    placeholder="岗位"
				    multiple
				    :collapse-tags="true"
				>
				    <el-option
				        v-for="(item, index) in positionList"
				        :key="index"
				        :label="item.Name"
				        :value="item.PositionId"
				    ></el-option>
				</el-select>
				<el-input
				    placeholder="姓名"
				    v-model="filters.SpeakerName"
				></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c" v-if="issubsidiary">
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
                label="企业"
                align="center"
                prop="MeetingDateDesc"
            >
            </el-table-column>
            <el-table-column
                label="部门"
                align="center"
                prop="SpeakerName"
            >
            </el-table-column>
            <el-table-column
                label="岗位"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="姓名"
                align="center"
            >
            </el-table-column>
			<el-table-column
			    label="本月召开情况"
			    align="center"
			>
			</el-table-column>
			<el-table-column
			    label="创建人"
			    align="center"
			>
			</el-table-column>
			<el-table-column
			    label="创建时间"
			    align="center"
			>
			</el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="show(row, true)">召开详情</el-button>
                        <el-button type="text" text-plain @click="remove(row)" v-if="row.Status == 0&&issubsidiary">删除</el-button>
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
			departmentList: [],
			positionList: [],
            filters: {
                MeetingDate: '',
                SpeakerName: '',
				DepartmentId: '',
				PositionIds: []
            }
        }
    },
    created() {
        this.handlePageChange(1);
    },
	mounted() {
		this.Get('/GetDepartmentTree').then((res) => {
		    //部门
		    if (res.status == 2000) {
		        this.departmentList = res.data;
		    }
		}),
		this.Get('/GetPositions').then(res => {
		    if (res.status == 2000) {
		        this.positionList = res.data;
		    }
		})
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
        add() {
			this.$chooseUser()
            // this.$refs.info.show(item)
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