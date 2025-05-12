<!--
 * @Description:
 * @Date: 2020-11-28 11:02:29
 * @LastEditors: Aidam_Bo
 * @LastEditTime: 2021-08-04 09:13:35
 * @FilePath: \zt-traffic-enterprise-view\src\pages\Documents\Document.vue
-->
<template>
    <page-layout class="page" :loading="loading" ref="pageLayout">
        <!-- 条件栏 开始 -->
        <div slot="header" class="header f-b-c">
            <el-tabs type="card" @tab-click="loadChDirectory" v-model="modulename">
                <el-tab-pane
                    v-for="item in DirectoryList"
                    :key="item.Id"
                    :name="item.Id+''"
                    :label="item.Sort + '、' + item.Name"
                    :data="item.Childrens"
                ></el-tab-pane>
            </el-tabs>
            <el-button type="warning" icon="el-icon-upload2" @click="downloadmbs(110, 1101, {})"
                >导出</el-button
            >
        </div>

        <!--列表 开始-->
        <el-table
            :data="FolderList"
            highlight-current-row
            v-loading="loading"
            row-key="Id"
            :default-expand-all="true"
            :tree-props="{ children: 'Childrens' }"
            :header-cell-style="$tableStyle"
            v-if="DirectoryList.length"
        >
            <el-table-column
                label="序号"
                header-align="center"
                align="center"
                type="index"
                width="100"
            >
            </el-table-column>
            <el-table-column header-align="left" label="体系文件"
                prop="Name"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                width="200"
                label="更新规则"
            >
                <template slot-scope="{ row }">
                    <div v-if="row.NodeType == 2">
                        {{ row.UpdateFrequencyDesc }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="430"
                header-align="center"
                align="center"
            >
                <template slot-scope="scope">
                    <div class="table-operation" v-if="scope.row.NodeType == 2">
                        <el-button
                            type="text"
                            @click="
                                showTemplateFileDialog(
                                    scope.row.Id,
                                    scope.row.Name
                                )
                            "
                            >查看模板</el-button
                        >
                        <el-badge
                            :value="scope.row.NoticNum"
                            :hidden="scope.row.NoticNum > 0 ? false : true"
                        >
                            <el-button
                                type="text"
                                @click="
                                    showFileManageDialog(scope.row.Id, modulename)
                                "
                                >管理文件</el-button
                            >
                        </el-badge>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表 结束 -->
        <no-data
            top="102"
            text="企业未设置体系文件，请联系管理员配置"
            v-else
        ></no-data>

        <el-dialog v-dialog-drag 
            :title="dialogFileManageTitle"
            :visible.sync="dialogFileManageShow"
            :close-on-click-modal="false"
            width="1100px"
            @close="closeFileManageDialog"
        >
            <FileManage ref="dialogFileManage"></FileManage>
        </el-dialog>

        <el-dialog v-dialog-drag 
            :title="dialogTemplateFileTitle"
            :visible.sync="dialogTemplateFileShow"
            :close-on-click-modal="false"
            width="1100px"
            @close="closeTemplateFileDialog"
        >
            <TemplateFile ref="dialogTemplateFile"></TemplateFile>
        </el-dialog>
    </page-layout>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";

import TemplateFile from "@/pages/Documents/TemplateFile";
import Import_export from "@/mixins/Import_export.js";

import FileManage from "@/pages/Documents/FileManage";
import axios from "axios";

export default {
    name: "FileName",
    components: {
        TemplateFile,
        FileManage,
    },

    mixins: [request_mixin, Import_export],
    data() {
        return {
            modulename: null,
            loading: true, //页面加载遮罩层显示状态
            dialogTemplateFileShow: false, //附件弹窗显示状态
            dialogTemplateFileTitle: "", //附件弹窗显示标题
            dialogFileManageShow: false, //文件管理弹窗显示状态
            dialogFileManageTitle: "", //文件管理弹窗标题
            DirectoryList: [], //目录
            ChDirectoryList: [], //子目录
            FolderList: [], //文件夹
            //查询条件
            filters: {
                DirectoryId: 0, //选中主目录
                DirectoryName: "", //选中主目录m名称
                FolderName: "",
                ChDirectoryId: "", //选中子目录
            },
            //列表数据,无分页
            pageData: [],
        };
    },
    //自定义方法
    methods: {
        //加载子目录列表
        loadChDirectory() {
            for (let i = 0; i < this.DirectoryList.length; i++) {
                let item = this.DirectoryList[i];
                if (item.Id == this.modulename) {
                    this.FolderList = item.Childrens;
                    break;
                }
            }
            this.$refs.pageLayout.scrollToTop();
        },
        downfolder(id, name) {
            axios({
                method: "get",
                url: process.env.API_ROOT + "/downfolder?FolderId=" + id,
                responseType: "blob",
                headers: {
                    ttoken: window.localStorage.ttoken,
                },
                timeout: 60000,
            })
                .then((res) => {
                    const link = document.createElement("a");
                    const blob = new Blob([res.data], {
                        type: "application/zip",
                    });
                    link.style.display = "none";
                    link.href = URL.createObjectURL(blob);
                    link.setAttribute("download", name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((error) => {
                    this.$alert("下载失败,请稍后重试", "提示");
                });
        },
        closeFileManageDialog() {
            let that = this;
            this.GetTemplateFileTree();
            that.$refs.dialogFileManage.clearValue();
        },
        showFileManageDialog(FolderId, FolderIds) {
            let that = this;
            that.dialogFileManageShow = true;
            that.dialogFileManageTitle = "管理文件";
            setTimeout(() => {
                that.$refs.dialogFileManage.ReceiveParameter(FolderId, FolderIds);
            }, 10);
        },
        closeTemplateFileDialog() {
            let that = this;
            that.$refs.dialogTemplateFile.clearValue();
        },
        showTemplateFileDialog(FolderId, FolderName) {
            let that = this;
            that.dialogTemplateFileShow = true;
            that.dialogTemplateFileTitle = FolderName;
            setTimeout(() => {
                that.$refs.dialogTemplateFile.ReceiveParameter(FolderId, "");
            }, 10);
        },
        GetTemplateFileTree() {
            this.Get("/GetEnterpriseTemplateFolderTree").then((res) => {
                if (res.status == 2000 && res.data) {
                    this.DirectoryList = res.data;
                    if (res.data && res.data.length > 0) {
                        if (this.modulename > 0) {
                            let item =res.data.find(item => item.Id == this.modulename);
                            this.FolderList = item.Childrens;
                        } else {
                            this.FolderList = res.data[0].Childrens;
                            this.modulename = res.data[0].Id+'';
                        }
                    }
                }
            }).finally(_ => {
                this.loading = false;
            });
        },
    },
    //页面初始化加载事件
    mounted() {
        this.GetTemplateFileTree();
    },
};
</script>
<style lang="scss" scoped>
.page{
    .header{
        width: 100%;
    }
    .el-tabs{
        width: calc(100% - 100px);
    }
    /deep/ .el-tabs__header{
        border-bottom: 0;
        margin-bottom: 0;
        padding: 0 36px;
        .el-tabs__nav-wrap.is-scrollable{
            position: initial;
            padding: 0;
            .el-tabs__nav-prev,
            .el-tabs__nav-next{
                top: 50%;
                transform: translateY(-50%);
                border-radius: 4px;
                border: 1px solid #d5d5d5;
                width: 21px;
                height: 21px;
                    background: #fff;
                line-height: 21px;
                text-align: center;
            }
        }
        .el-tabs__nav{
            border: 0;
            height: 55px;
            .el-tabs__item{
                border-radius: 10px 10px 0 0;
                border: 0;
                height: 50px;
                background: #ECECEC;
                line-height: 50px;
                &:not(:first-child) {
                    margin-left: 5px;
                }
                &.is-active{
                    position: relative;
                    height: 55px;
                    background: #fff;
                    line-height: 55px;
                    vertical-align: bottom;
                    &::after{
                        content: '';
                        position: absolute;
                        bottom: 6px;
                        left: 50%;
                        transform: translateX(-50%);
                        border: 5px solid transparent;
                        border-top: 5px solid $--color-primary;
                        border-bottom: 0;
                    }
                }
            }
        }
    }
    /deep/ .el-tabs--border-card > .el-tabs__content {
        padding: 0;
    }
}
.toolbar {
    margin-top: 20px;
}

/deep/ .el-table .cell {
    overflow: visible !important;
}
/deep/ .el-button {
    margin-left: 0;
}
</style>
