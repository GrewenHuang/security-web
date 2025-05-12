<!--
 * @Description:
 * @Date: 2020-11-28 11:02:29
 * @LastEditors: Bing
 * @LastEditTime: 2021-01-12 18:28:11
 * @FilePath: \zt-traffic-enterprise-view\src\pages\Documents\FileManage.vue
-->
<template>
    <el-scrollbar class="scrollbar">
        <div>
            <div class='title f-b-c'>
                <div>
                    <el-button type="text" icon="el-icon-time" text-plain @click='showFileRecordDialog()'>操作记录</el-button>
                </div>
                <div class="f">
                    <p class="tips">注:单个文件大小不能超过20M</p>
                    <div style='display:flex'>
                        <custom-upload
                            :accept="'.txt,.doc,.xls,.ppt,.pdf,.jpg,.png,.gif,.bmp,.docx,.xlsx,.pptx,.mp4,.avi,.mov'"
                            :fileList.sync="uploadFiles"
                            :list-type="'text'"
                            :show-file-list="false"
                            :single="true"
                            @change="changeFile"
                        >
                            <el-button type="warning">上传体系文件</el-button>
                        </custom-upload>
                    </div>
                </div>
            </div>
            <!-- 条件栏 结束 -->

            <!--列表 开始-->
            <el-table 
                class="table"
                :data="pages.list"
                v-loading="loading"
                :header-cell-style="$tableStyle"
                style="width:100%"
            >
                <el-table-column label="序号"
                                type="index"
                                width="60">
                </el-table-column>
                <el-table-column label="文件名称"
                                show-overflow-tooltip>
                    <template slot-scope="scope">
                    <span v-if='scope.row.AttachmentFiles && scope.row.AttachmentFiles.length>0'>{{scope.row.AttachmentFiles[0].name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文件大小"
                                width="100"
                                align="center">
                    <template slot-scope="scope">
                    <span v-if='scope.row.AttachmentFiles && scope.row.AttachmentFiles.length>0'>{{scope.row.AttachmentFiles[0].size | formatSize}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="上传时间"
                                align="center"
                                prop="OperationDateDesc"
                                width="150"></el-table-column>
                <el-table-column label="上传人"
                                align="center"
                                width="100"
                                prop="CreateByName"></el-table-column>
                <el-table-column label='操作'
                                align="center"
                                width="200">
                    <template slot-scope="scope">
                    <a class="target" :href="ViewUrl(scope.row.AttachmentFiles[0].viewurl,scope.row.AttachmentFiles[0].classify)" target="_blank">      
                        <el-button type='text'>查看</el-button>
                    </a>
                    <el-button v-if='scope.row.AttachmentFiles[0].ext == "doc" || scope.row.AttachmentFiles[0].ext == "docx"'
                                type="text"
                                @click='edit(scope.row.AttachmentFiles[0].id)'>编辑</el-button>
                    <el-button type="text"
                                @click="downFile(scope.row.AttachmentFiles[0].id, scope.row.AttachmentFiles[0].url, scope.row.AttachmentFiles[0].name, scope.row.AttachmentFiles[0].ext)">下载</el-button>
                    <!-- <el-button type="warning"
                                plain
                                size="mini"
                                icon="el-icon-document-copy">复制</el-button> -->
                                
                    <el-button type="text"
                                text-plain
                                @click='DeleteData(scope.row.FileRecordId)'>删除</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <!-- 列表 结束 -->

            <!--分页 开始-->

            <el-pagination layout="total, prev, pager, next"
                        background
                        @current-change="handleCurrentChange"
                        :page-size="pages.rows"
                        :total="pages.total"
                        class="customPagination">
            </el-pagination>

            <!-- 分页 结束 -->
            <el-dialog v-dialog-drag  :title="dialogFileRecordTitle"
                :visible.sync="dialogFileRecordShow"
                :append-to-body="true"
                top="8vh"
                width="1200px"
                :close-on-press-escape="false"
                @close="closeFileRecordDialog"
            >
                <FileRecord ref="dialogFileRecord"></FileRecord>
            </el-dialog>
        </div>
    </el-scrollbar>
</template>
<script>
import FileRecord from '@/pages/Documents/FileRecord';
import request_mixin from '@/mixins/request-mixin.js';
import axios from 'axios';

export default {
    name: 'FileManage',
    components: {
        FileRecord,
    },
    mixins: [request_mixin],
    data() {
        return {
            WebofficeUrl: process.env.API_WEBOFFICE_URL,
            dialogFileRecordShow: false, //文件操作记录弹窗显示状态
            dialogFileRecordTitle: '', //文件操作记录弹窗标题
            loading: false, //页面加载遮罩层显示状态
            //分页
            pages: { list: [], total: 0, page: 1, rows: 10 },
            //查询条件
            filters: {
                FolderId: 0,
                IsDelete: 0,
            },
            uploadFiles: [],
        };
    },
    //自定义方法
    methods: {
        //接收参数
        ReceiveParameter(FolderId) {
            this.filters.FolderId = FolderId;
            this.GetList();
        },
        edit (fileid) {
            window.open(`WebOffice://|Officectrl|` + this.WebofficeUrl + `edit.html?FilesId=${fileid}&ttoken=` + window.localStorage.getItem('ttoken'))
        },
        closeFileRecordDialog() {
            let that = this;
            that.$refs.dialogFileRecord.clearValue();
        },
        showFileRecordDialog() {
            let that = this;
            that.dialogFileRecordShow = true;
            that.dialogFileRecordTitle = '操作记录';
            setTimeout(() => {
                that.$refs.dialogFileRecord.ReceiveParameter(this.filters.FolderId);
            }, 10);
        },
        changeFile() {
            this.Post('/SaveFileRecord', {
                FolderId: this.filters.FolderId,
                AttachmentFiles: this.uploadFiles,
            }).then((res) => {
                if (res.status == 2000) {
                    this.fileList = [];
                    this.GetList();
                }
            });
        },
        downFile(id, url, name, ext) {
            axios({
                method: 'get',
                url:
                    process.env.API_ROOT + '/downattachment?AttachmentId=' + id,
                responseType: 'blob',
                headers: {
                    ttoken: window.localStorage.ttoken,
                },
                timeout: 60000,
            })
                .then((res) => {
                    const link = document.createElement('a');
                    const blob = new Blob([res.data]);
                    link.style.display = 'none';
                    link.href = URL.createObjectURL(blob);
                    link.setAttribute('download', name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((error) => {
                    this.$alert('下载失败,请稍后重试', '提示');
                });
        },
        handleCurrentChange(val) {
            this.pages.page = val;
            this.GetList();
        },
        clearValue() {
            this.list = [];
        },
        ViewUrl(url, classify) {
            if (classify.toUpperCase() == 'image'.toUpperCase()) {
                //图片
                return url;
            } else if (classify.toUpperCase() == 'file'.toUpperCase()) {
                //文档
                url = escape(url);
                return (
                    'https://view.officeapps.live.com/op/view.aspx?src=' + url
                );
            }
        },
        //删除列表数据
        DeleteData(Id) {
            this.loading = true;

            this.Get('/DeleteFileRecord', { Id: Id }).then((result) => {
                if (result.status != 2000) {
                    this.$message({
                        message: result.message,
                        type: 'error',
                    });
                } else {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                    });
                    this.GetList();
                }
            });
        },
        //加载列表数据
        GetList() {
            let that = this;
            let params = Object.assign(
                {
                    page: that.pages.page,
                    rows: that.pages.rows,
                },
                that.filters
            );

            that.loading = true;
            that.Post('/GetFileRecords', params).then(
                function (result) {
                    that.loading = false;
                    if (result && result.status == 2000) {
                        that.pages.list = result.data.list;
                        that.pages.total = result.data.count;
                    }
                },
                function (err) {
                    that.loading = false;
                    that.$message.error({
                        showClose: true,
                        message: err.toString(),
                        duration: 2000,
                    });
                }
            );
        },
    },
};
</script>
<style scoped>
.title {
    display: flex;
    width: 100%;
    justify-content: space-between;
}
.title .tips {
    margin-right: 20px;
    color: #959595;
}
.table{
    margin-top: 20px;
}
.customPagination{
    margin-top: 20px;
    justify-content: flex-end;
}
</style>
