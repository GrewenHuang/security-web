<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1000px"
        top="8vh"
        v-loading="loading"
        append-to-body
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="content">
                <div class="f form-item border-bottom-1px">
                    <div class="label">竞赛标题:</div>
                    <div>{{ info.Title }}</div>
                </div>
                <div class="form-2-col border-bottom-1px">
                    <div class="f form-item">
                        <div class="label">竞赛答题日期：</div>
                        <div>{{ info.ContestDateDesc }}</div>
                    </div>
                    <div class="f form-item">
                        <div class="label">答题时限：</div>
                        <div>{{ info.Duration }}分钟</div>
                    </div>
                </div>
                <div class="form-2-col border-bottom-1px">
                    <div class="f form-item">
                        <div class="label">模拟答题日期：</div>
                        <div>{{ info.SimulatedStartDateDesc + ' 至 ' + info.SimulatedEndDateDesc}}</div>
                    </div>
                    <div class="f form-item">
                        <div class="label">发布人：</div>
                        <div>{{ info.ReleaseUserName }}</div>
                    </div>
                </div>
                <div class="form-2-col border-bottom-1px">
                    <div class="f form-item">
                        <div class="label">发布日期：</div>
                        <div>{{ info.ReleaseDateDesc }}</div>
                    </div>
                    <div class="f form-item">
                        <div class="label">状态：</div>
                        <div>{{ statusObj[info.Status] }}</div>
                    </div>
                </div>
                <div class="split-line"></div>
                <div>
                    <div class="title">参与人员（{{ pages.total }}）</div>
                    <div class="f-b-c">
                        <div class="f filter-content">
                            <!-- <select-department clearable placeholder="部门" collapseTags multiple v-model="filters.DepartmentIds"></select-department> -->
                            <select-position clearable placeholder="岗位" collapseTags multiple v-model="filters.PositionIds"></select-position>
                            <el-input clearable placeholder="姓名" v-model="filters.UserName"></el-input>
                            <div class="number-range">
                                <el-input-number clearable :controls="false" placeholder="最低得分" v-model="filters.MinScore"></el-input-number>
                                <span> - </span>
                                <el-input-number clearable :controls="false" placeholder="最高得分" v-model="filters.MaxScore"></el-input-number>
                            </div>
                            <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
                        </div>
                        <div>
                            <el-button @click="downloadmbs(80, 802, {...filters, KnowledgeContestId: info.KnowledgeContestId})">导出</el-button>
                            <!-- <el-dropdown>
                                <el-button>
                                    导出
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>导出列表</el-dropdown-item>
                                    <el-dropdown-item>导出试卷</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown> -->
                        </div>
                    </div>
                    <el-table
                        :data="userList"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column
                            label="排名"
                            width="60"
                            align="center"
                            type="index"
                        >
                        </el-table-column>
                        <el-table-column
                            label="企业/部门"
                            align="center"
                            width="240"
							show-overflow-tooltip
                        >
                            <template slot-scope="{ row }">
                                {{ row.DepartmentList.map(item=>item.EnterpriseName + '-' +item.DepartmentName).join('、') || "" }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="岗位"
                            align="center"
                            width="120"
                        >
                            <template slot-scope="{ row }">
                                {{ row.PositionList.map(item=>item.PositionName).join('、') }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="姓名"
                            align="center"
                            prop="UserName"
                        ></el-table-column>
                        <el-table-column
                            label="得分（分）"
                            align="center"
                            width="120"
                            prop="Score"
                        ></el-table-column>
                        <el-table-column
                            label="答题用时"
                            align="center"
                            width="120"
                            prop="UserName"
                        >
                            <template slot-scope="{ row }">
                                {{ row.UseTime | durationFormat }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="100"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <el-button type="text" @click="previewPaper(row)">查看试卷</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="f-e-c">
                        <el-pagination layout="total, prev, pager, next"
                            background
                            @current-change="handleCurrentChange"
                            :page-size="pages.rows"
                            :total="pages.total"
                            :current-page="pages.page"
                            class="customPagination">
                        </el-pagination>
                    </div>
                </div>
                <div class="split-line"></div>
                <div>
                    <div class="title">竞赛题目（{{ info.QuestionCount }}/{{ info.Questions.length }}）</div>
                    <el-table
                        :data="questions"
                        :header-cell-style="$tableStyle"
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            width="60"
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            label="试题编号"
                            width="150"
                            align="center"
                            prop="SerialNumber"
                        ></el-table-column>
                        <el-table-column
                            label="题型"
                            width="110"
                            align="center"
                            prop="TypeName"
                        ></el-table-column>
                        <el-table-column
                            label="题干"
                            prop="Content"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            label="操作"
                            width="100"
                            align="center"
                        >
                            <template slot-scope="{ row }">
                                <el-button type="text" @click="previewQuestions(row)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="f-e-c">
                        <el-pagination layout="total, prev, pager, next"
                            background
                            @current-change="handleCurrentChange1"
                            :page-size="pages1.rows"
                            :total="pages1.total"
                            :current-page="pages1.page"
                            class="customPagination">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
        </div>
        <previewQuestions ref="previewQuestions"/>
        <paper ref="paper" />
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import previewQuestions from './previewQuestions.vue';
import paper from './paper.vue';
import Import_export from "@/mixins/Import_export.js";
import util from '@/common/util'
const defaultInfo = {
    Questions: []
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
function zero(n) {
    return n > 0 ? n : '0' + n;
}
export default {
    name: 'page-info',
    components: {
        previewQuestions,
        paper
    },
    mixins: [request_mixin, Import_export],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            info: _extends(defaultInfo),
            pages: {
                page: 1,
                rows: 10,
                total: 0
            },
            filters: {},
            pages1: {
                page: 1,
                rows: 10,
                total: 0
            },
            filters1: {},
            userList: [],
            questions: [],
            statusObj: {
                0: '未发布',
                1: '未开始',
                2: '进行中',
                3: '已结束',
            }
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '查看'
        }
    },
    filters: {
        durationFormat(duration) {
            let m = parseInt(duration / 60);
            let s = parseInt(duration % 60);
            let str = `${zero(s)}秒`
            if (m > 0) {
                str = `${zero(m)}分` + str
            }
            return str;
        },
        formatLetter(num) {
            let code = 'A'.charCodeAt(0);
            return String.fromCharCode(code + num);
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.KnowledgeContestId;
                try {
                   let res = await this.Get(`/GetKnowledgeContest?knowledgeContestId=${item.KnowledgeContestId}`)
                   if (res.status == 2000) {
                       this.info = Object.assign(_extends(defaultInfo), res.data);
                       this.handleCurrentChange(1);
                       this.handleCurrentChange1(1);
                   } else {
                       this.$message.error('获取数据失败');
                    //    this.close();
                   }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.id = '';
            this.info = _extends(defaultInfo);
            this.filters = {};
            this.filters1 = {};
        },
        handleCurrentChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters,
                KnowledgeContestId: this.id
            }
            this.listLoading = true;
            try {
                let res = await this.Post('/GetKnowledgeContestPapers', params);
                if (res.status === 2000) {
                    this.userList = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.listLoading = false;
        },
        handleCurrentChange1(val) {
            this.pages1.page = val;
            this.getList1();
        },
        async getList1() {
            let params = {
                ...this.pages1,
                ...this.filters1,
                KnowledgeContestId: this.id
            }
            this.listLoading1 = true;
            try {
                let res = await this.Post('/GetKnowledgeContestQuestions', params);
                if (res.status === 2000) {
                    this.questions = res.data.list;
                    this.pages1.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.listLoading1 = false;
        },
        previewQuestions(row) {
            this.$refs.previewQuestions.show(row);
        },
        previewPaper(row) {
            this.$refs.paper.show({...row, Title: this.info.Title});
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .el-dialog{
            min-width: 1000px;
        }
        .content{
            padding: 13px 25px 20px;
        }
        .form-item{
            padding: 20px 15px;
        }
        .form-2-col{
            display: flex;
            >div{
                width: 50%;
                &:first-child{
                    margin-right: 40px;
                }
            }
        }
        .split-line{
            &::before{
                content: '';
                display: block;
                margin: 25px -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
        .border-bottom-1px{
            border-bottom: 1px solid #EFEFEF;
        }
        .title{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 600;
            &::before{
                content: '';
                border-radius: 2px;
                margin-right: 8px;
                width: 5px;
                height: 16px;
                background: $--color-primary;
            }
        }
        .label{
            margin-right: 10px;
            font-weight: 600;
        }
        .checked{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            width: 28px;
            height: 28px;
            background: #1DBFAC;
            &::before{
                content: '';
                border-left: 2px solid #fff;
                border-bottom: 2px solid #fff;
                transform: rotate(-45deg) translate(-2px, -2px);
                transform-origin: top center;
                width: 13px;
                height: 7px;
            }
        }
        .el-select,
        .el-input{
            width: 160px;
        }
        .number-range{
            .el-input-number{
                width: 100px;
            }
            span{
                white-space: pre-line;
            }
        }

        .filter-content{
            > div{
                margin-right: 8px;
            }
        }
        .f-e-c{
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .el-table{
            margin-top: 20px;
        }
    }
</style>