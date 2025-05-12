<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
			<div class="input-content">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<select-enterpirse clearable placeholder="企业" collapseTags v-model="filters.EnterpriseId"
							@clear="filters.DepartmentId = ''"></select-enterpirse>
					</el-form-item>
					<el-form-item>
						<cascader-department placeholder="部门" clearable v-model="filters.DepartmentId"
							:enterpriseId="filters.EnterpriseId"
							:disabled="!filters.EnterpriseId ? true : false"></cascader-department>
					</el-form-item>
					<el-form-item>
						<select-position v-model="filters.PositionId" :multiple="false" clearable
							placeholder="岗位"></select-position>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="学习人" clearable v-model="filters.UserName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-select placeholder="学习类型" clearable v-model="filters.LearningType">
						    <el-option v-for="(item, index) in typeList" :key="index" :label="item" :value="index+1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handlePageChange(1)">查询</el-button>
						<el-popover width="300" trigger="click">
							<div>
								<el-form-item>
									 <el-input placeholder="学习标题" clearable v-model="filters.Title"></el-input>
								</el-form-item>
								<el-form-item>
									<el-select placeholder="完成情况" clearable v-model="filters.Status" style="width: 100%">
										<el-option label="已完成" :value="1"></el-option>
										<el-option label="未完成" :value="0"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<el-button slot="reference" type="text">更多筛选</el-button>
						</el-popover>
					</el-form-item>
				</el-form>
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
			<el-table-column label="企业/部门" align="center" show-overflow-tooltip width="280">
				<template slot-scope="scope">
					<span v-if="scope.row.DepartmentListJustShow && scope.row.DepartmentListJustShow.length > 0">
						{{ scope.row.DepartmentListJustShow.map(item => item.EnterpriseName + '-' + item.DepartmentName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="岗位" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.PositionList && scope.row.PositionList.length > 0">
						{{ scope.row.PositionList.map(item => item.PositionName).join('、') }}
					</span>
				</template>
			</el-table-column>
			<el-table-column
			    label="学习人"
			    align="center"
			    width="120"
			    prop="UserName"
			>
			</el-table-column>
           <el-table-column
               label="学习类型"
               align="center"
               width="200"
           >
               <template slot-scope="{ row }">
                   {{ row.LearningType | LearningTypeName }}
               </template>
           </el-table-column>
            <el-table-column
                label="学习标题"
                align="center"
				prop="Title"
            ></el-table-column>
            <el-table-column
                label="学习日期"
                align="center"
                width="150"
                prop="LearningTimeDesc"
            >
            </el-table-column>
           <el-table-column label="状态" align="center"  width="110" show-overflow-tooltip>
           	<template slot-scope="scope">
           	    <whether :yes="scope.row.Status == 1" :text="scope.row.Status ? '已完成' : '未完成'"/>
           	</template>
           </el-table-column>
           <!-- <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="{ row }">
                    <div class="table-operation">
                        <el-button type="text" @click="add(row)" v-if="$_has('MRYXBtnLook')">查看</el-button>
                    </div>
                </template>
            </el-table-column> -->
        </el-table>
        <info ref="info" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from '@/pages/learn-day/info';
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
                let res = await this.Post('/GetLearningUsers', params);
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
<style scoped lang="less">
	/deep/ .input-content .el-form-item {
		margin-bottom: 0 !important;
	}
</style>