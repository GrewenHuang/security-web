<template>
    <el-dialog v-dialog-drag 
        title="试题类型"
        :visible.sync="dialogFlag"
        :close-on-click-modal="false"
        @close="close"
        top="8vh"
        width="50%"
    >
        <el-scrollbar class="scrollbar" v-loading="loading">
            <el-table
                :data="list"
                :header-cell-style="{ textAlign: 'center' }"
                style="width: 100%"
            >
                <el-table-column label="试题类型" prop="Name" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button
                            type="success"
                            size="mini"
                            plain
                            @click="edit(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            size="mini"
                            plain
                            @click="del(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: center;margin-top: 10px;">
                <el-button
                    type="primary"
                    size="mini"
                    @click="add"
                >新增</el-button>
            </div>
        </el-scrollbar>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFlag = false">关闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
export default {
    data() {
        return {
            list: [],
            dialogFlag: false,
            loading: false,
            callbackFunc: null
        }
    },
    mixins: [request_mixin],
    created() {
        this.getList();
    },
    methods: {
        async show(func) {
            this.dialogFlag = true;
            this.loading = true;
            await this.getList();
            this.loading = false;
            this.callbackFunc = func;
        },
        getList() {
            return new Promise((resolve, reject) => {
                this.Post('/GetExamQuestionTypeList').then(res => {
                    this.list = res.data;
                    resolve(this.list);
                }).finally(() => {
                    resolve(false);
                });
            })
        },
        detail(item) {
            let initName = item ? item.Name : '';
            this.$prompt('请输入试题类型', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                inputErrorMessage: '试题类型不能为空',
                inputValue:  initName,
                lockScroll: true,
                closeOnClickModal: false,
            }).then(({ value }) => {
                let params = {
                    Name: value
                };
                if (item) {
                    params.examQuestionTypeId = item.ExamQuestionTypeId;
                }
                this.Post('/SaveExamQuestionType', params).then(res => {
                    if (res.status === 2000) {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: item ? '编辑成功' : '新增成功'
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
                
            }).catch(() => {
            });
        },
        close() {
            if (typeof this.callbackFunc === 'function') {
                this.callbackFunc(this.list);
            }
            this.callbackFunc = null;
        },
        edit(item) {
            this.detail(item);
        },
        add() {
            this.detail();
        },
        del(item) {
            this.$confirm('此操作将永久删除该试题类型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(res => {
                this.Get('/DeleteExamQuestionType?examQuestionTypeId=' + item.ExamQuestionTypeId).then(res => {
                    if (res.status === 2000) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.getList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            });
                        }
                });
            })
            
        }
    },
}
</script>

<style>
</style>