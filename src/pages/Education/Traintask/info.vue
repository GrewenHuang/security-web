<template>
    <el-dialog v-dialog-drag :title="title" :visible.sync="dislogShow" @close="close()" class="info" width="1200px"
        top="8vh" v-loading="loading" element-loading-text="数据加载中">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="filters.UserName" placeholder="培训对象" style="width: 180px;"
                    @keyup.enter.native="handleSearchDetail"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="filters.TrainTaskStatu" clearable placeholder="学习状态">
                    <el-option label="未学习" :value="0">
                    </el-option>
                    <el-option label="学习中" :value="10">
                    </el-option>
                    <el-option label="已完成" :value="100">
                    </el-option>
                    <el-option label="重新学习" :value="20">
                    </el-option>
                    <el-option label="已超时" :value="-1">
                    </el-option>
                </el-select>
            </el-form-item>
			<!-- 需要加字段 -->
			<el-form-item>
			    <el-select v-model="filters.TrainTaskStatu" clearable placeholder="考试状态">
			        <el-option label="未考试" :value="0">
			        </el-option>
			        <el-option label="已考试" :value="10">
			        </el-option>
			    </el-select>
			</el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="chooseUser()" v-if="!disabled">添加</el-button>
            </el-form-item>
            <el-button class="btn" type="warning" style="float: right; margin-bottom: 10px"
                @click="downloadmbs(60, 604, { TrainTaskId: filters.TrainTaskId });" v-if="!disabled">导出</el-button>
        </el-form>
        <div class="content">
            <el-table :data="list" :cell-style="{ textAlign: 'center' }" :header-cell-style="$tableStyle" style="width: 100%"
                border height="550" class="detailTable">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div style="padding: 10px;">
                            <div v-for="(item, index1) in props.row
                                .TrainCoursewares" :key="index1" style="margin: 20px 0">
                                <div>
                                    <span style="
                                            font-size: 15px;
                                            font-weight: 600;
                                        ">课件名称：</span>{{ item.CoursewareName }}
                                </div>
                                <div v-for="(
                                        items, index2
                                    ) in item.TrainCoursewareAttachments" :key="index2" style="
                                        display: flex;
                                        width: 100%;
                                        height: 30px;
                                        line-height: 30px;
                                    ">
                                    <span style="width: 50%">附件名称：{{
                                        items.AttachmentName
                                    }}</span>
                                    <span style="width: 15%">时长：{{
                                        items.VideoLengths
                                        ? dateFormat(items.VideoLengths)
                                        : "不限"
                                    }}</span>
                                    <span style="width: 15%">已学时长：{{
                                        dateFormat(items.VideoPlayDuration)
                                    }}</span>
                                    <span style="width: 15%">状态：{{
                                        items.IsCompleteDesc || ""
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="培训对象" align="center" prop="UserName">
                </el-table-column>
                <el-table-column label="电话" align="center" prop="Tel">
                </el-table-column>
                <el-table-column label="课程总时长" align="center">
                    <template slot-scope="scope">
                        <div>{{ dateFormat(scope.row.TotalDuration) }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="已学习时长" align="center">
                    <template slot-scope="scope">
                        <div>
                            {{ dateFormat(scope.row.LearnedTotalDuration) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="学习状态" align="center" prop="TrainTaskStatuDesc">
                </el-table-column>
                <el-table-column label="考试状态" align="center" prop="ExamStateDesc">
                </el-table-column>
                <el-table-column label="操作" align="center" width="100" v-if="!disabled">
                    <template slot-scope="scope">
                        <el-button type="text" text-plain @click="
                            DeleteTrainUserRel(scope.row.TrainUserRelId)
                            ">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" style="text-align: center">
                <el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange"
                    :page-size="pages.rows" :current-page="pages.page" :total="pages.total" class="customPagination">
                </el-pagination>
            </el-col>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import Import_export from "@/mixins/Import_export.js";
export default {
    mixins: [request_mixin, Import_export],
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            filters: {
                TrainTaskId: '',
            },
            pages: {
                page: 1,
                rows: 10,
                total: 0
            },
            list: []
        }
    },
    computed: {
        title() {
            return '查看'
        }
    },
    methods: {
        async show(id) {
            this.dislogShow = true;
            this.filters.TrainTaskId = id;
            this.getList();
        },
        close() {
            this.dislogShow = false;
            this.filters.TrainTaskId = '';
        },
        handleCurrentChange(page) {
            this.pages.page = page;
            this.getList();
        },
        async getList() {
            this.loading = true;
            let params = {
                ...this.pages,
                ...this.filters
            };
            let res = await this.Post("/GetTrainCurriculums2", params);
            if (res.status == 2000) {
                this.list = res.data.list;
                this.pages.total = res.data.count;
            } else {
                this.$message(res.message);
            }
            this.loading = false;
        },
        chooseUser() {
            this.$chooseUser({
                single: false
            }).then(data => {
                this.Post("/InsertTrainUserRel", {
                    TrainTaskId: this.filters.TrainTaskId,
                    UserId: data.UserId,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.$message({
                            type: "success",
                            message: "添加成功!",
                        });
                        this.handleCurrentChange(1);
                        this.$emit('load');
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        DeleteTrainUserRel(id) {
            this.$confirm("您确定要删除此人吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.Post("/DeleteTrainUserRel", {
                    Id: id,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.$message({
                            type: "success",
                            message: "操作成功!",
                        });
                        this.handleCurrentChange(1);
                        this.$emit('load');
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        dateFormat(examSecond) {
            let result = parseInt(examSecond);
            let h =
                Math.floor(result / 3600) < 10
                    ? "0" + Math.floor(result / 3600)
                    : Math.floor(result / 3600);
            let m =
                Math.floor((result / 60) % 60) < 10
                    ? "0" + Math.floor((result / 60) % 60)
                    : Math.floor((result / 60) % 60);
            let s =
                Math.floor(result % 60) < 10
                    ? "0" + Math.floor(result % 60)
                    : Math.floor(result % 60);
            let res = "";
            if (h !== "00") res += `${h}时`;
            if (m !== "00") res += `${m}分`;
            res += `${s}秒`;
            return res;
        },
    }
}
</script>

<style lang="scss" scoped>
.info {
    /deep/ .el-dialog__body {
        padding: 0 !important;
    }

    /deep/ .el-dialog {
        min-width: 1200px;
    }
    .el-form{
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
        padding: 8px 15px 0;
    }
    .content{
        padding: 0 15px 20px;
    }
}
</style>