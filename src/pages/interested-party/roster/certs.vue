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
        element-loading-text="数据加载中"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <div class="input-content">
                <el-input placeholder="证书名称" clearable v-model="filters.Name"></el-input>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
                <el-button type="primary" @click="add()">新增</el-button>
            </div>
            <el-table
                :data="list"
                :header-cell-style="$tableStyle"
                style="width: 100%"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    width="80"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="证书名称"
                    width="150"
                    align="center"
                    prop="Name"
                ></el-table-column>
                <el-table-column
                    label="证书编号"
                    width="120"
                    align="center"
                    prop="Number"
                ></el-table-column>
                <el-table-column
                    label="是否有效期"
                    width="100"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{  row.IsValid == 1 ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="开始时间"
                    width="120"
                    align="center"
                    prop="StartDateDesc"
                ></el-table-column>
                <el-table-column
                    label="结束时间"
                    width="120"
                    align="center"
                    prop="EndDateDesc"
                ></el-table-column>
                <el-table-column
                    label="附件"
                    align="center"
                    show-overflow-tooltip
                >
                    <template slot-scope="{ row }">
                        <div v-for="(item, index) in row.RelatedPartyCertificateFiles" :key="index">
                            <el-button type="text" @click="$openFile(item.url)">{{ item.name }}</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="120"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        <div class="table-operation">
                            <el-button type="text" @click="add(row)">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="f-b-c">
                <div></div>
                <el-pagination layout="total, prev, pager, next"
                    background
                    @current-change="handlePageChange"
                    :page-size="pages.rows"
                    :total="pages.total"
                    :current-page="pages.page"
                    class="customPagination">
                </el-pagination>
            </div>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button
            >
        </div>
        <addCert ref="addCerts" @load="handlePageChange(1)"/>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import addCert from './addCert.vue';
const defaultInfo = {
    ExpertName: '',
    ExpertTel: '',
    Specialty: '',
    Education: '',
    Major: '',
    Remark: '',
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    components: {
        addCert
    },
    mixins: [request_mixin],
    props: {
        editTitle: ''
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            filters: {},
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            list: [],
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.editTitle ? this.editTitle : this.isEdit ? '编辑' : '新增'
        }
    },
    methods: {
        async show(id) {
            this.dislogShow = true;
            if (id) {
                this.id = id;
                this.handlePageChange(1);
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
            this.$emit('load');
        },
        handlePageChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters,
                RelatedPartyId: this.id
            }
            this.loading = true;
            try {
                let res = await this.Post('/GetRelatedPartyCertificates', params);
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
            this.$refs.addCerts.show(item, this.id);
        },
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post('/DeleteRelatedPartyCertificate', {
                    ids: [row.RelatedPartyCertificateId],
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
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        /deep/ .el-form-item{
            margin-bottom: 25px;
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
        }
        .input-content{
            padding: 10px 16px;
        }
        .el-input,
        .el-date-editor,
        .el-select{
            width: 180px;
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
                margin: 0 -25px 25px;
                height: 10px;
                background: #f2f2f2;
            }
        }
    }
</style>
