<!-- 车辆巡检 -->
<template>
    <page-layout @scroll-height="getScrollHeight">
        <div class="document">
            <div class="item" :style="{height: minHeight + 'px'}">
                <div class="title f-b-c">
                    <div>上级标准</div>
                    <div v-if="superData && !!superData.directoryList.length && !enterpriseData">
                        <span class="other-opertion color-primary" @click="copy"><i class="el-icon-document-copy"></i>复制到企业</span>
                    </div>
                </div>
                <div class="content">
                    <template v-if="superData">
                        <el-tabs type="card" @tab-click="loadChDirectory(superData, 'super')" v-model="superData.modulename">
                            <el-tab-pane
                                v-for="item in superData.directoryList"
                                :key="item.Id"
                                :name="item.Id+''"
                                :label="item.Sort + '、' + item.Name"
                                :data="item.Childrens"
                            ></el-tab-pane>
                        </el-tabs>
                        <el-scrollbar ref="superScrollbar">
                            <el-table
                                :data="superData.tableList"
                                row-key="Id"
                                :default-expand-all="true"
                                :tree-props="{ children: 'Childrens' }"
                                :header-cell-style="$tableStyle"
                            >
                                <el-table-column header-align="left" label="体系文件" prop="Name"
                                    show-overflow-tooltip
                                ></el-table-column>
                                <el-table-column
                                    label="操作"
                                    width="160"
                                    header-align="center"
                                    align="center"
                                >
                                    <template slot-scope="{ row }">
                                        <div class="table-operation" v-if="row.NodeType == 2">
                                            <el-button
                                                type="text"
                                                @click="showFileInfo(row, null, true)"
                                                >查看</el-button
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-scrollbar>
                    </template>
                    <template v-else>
                        <no-data top="107" bottom="10"/>
                        <div class="f-c-c" style="color: #959595;">上级公司未设置标准</div>
                    </template>
                </div>
            </div>
            <div class="item" :style="{height: minHeight + 'px'}">
                <div class="title f-b-c">
                    <div>企业标准</div>
                    <div class="f-c-c" v-if="enterpriseData">
                        <span class="other-opertion" @click="remove" v-if="enterpriseData"><i class="el-icon-delete-solid"></i>删除标准</span>
                        <el-switch
                            v-model="enterpriseData.Status"
                            :active-value="1"
                            :inactive-value="0"
                            active-text="启用"
                            inactive-text="停用"
                            @change="handleSwitch"
                        ></el-switch>
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            style="margin-left: 20px;"
                        >
                            <i class="el-icon-warning" slot="reference" style="color:#959595;"></i>
                            <div style="font-size: 12px;">
                                <div style="color: #FE912E;margin-bottom: 5px;">
                                    <i class="el-icon-warning" style="font-size:14px;margin-right: 8px;"></i>温馨提示：
                                </div>
                                <div>启用企业标准时自动停用上级标准；</div>
                                <div>停用企业标准时自动启用上级标准。</div>
                            </div>
                        </el-popover>
                    </div>
                </div>
                <div class="content">
                    <template v-if="enterpriseData">
                        <div class="header-operation f-b-c">
                            <el-tabs type="card" @tab-click="loadChDirectory(enterpriseData, 'enterprise')" v-model="enterpriseData.modulename">
                                <el-tab-pane
                                v-for="item in enterpriseData.directoryList"
                                :key="item.Id"
                                :name="item.Id+''"
                                :label="item.Sort + '、' + item.Name"
                                :data="item.Childrens"
                            ></el-tab-pane>
                            </el-tabs>
                            <div class="add-directory" @click="addRirectory">
                                <i class="el-icon-edit"></i>
                            </div>
                        </div>
                        <el-scrollbar ref="enterpriseScrollbar">
                            <el-table
                                :data="enterpriseData.tableList"
                                row-key="Id"
                                :default-expand-all="true"
                                :tree-props="{ children: 'Childrens' }"
                                :header-cell-style="$tableStyle"
                            >
                                <el-table-column header-align="left" label="体系文件"
                                    show-overflow-tooltip
                                >
                                    <template slot-scope="{ row, $index }">
                                        <el-input 
                                            placeholder="请输入名称"
                                            maxlength="50"
                                            :ref="'Folder' + row.Id"
                                            v-model="row.Name"
                                            @change="changeFolderName(row)"
                                            @focus="inputFocus('Folder' + row.Id)"
                                            @blur="inputBlur(row)"
                                            :data-index="$index"
                                            v-if="row.NodeType == 1 && /add|edit/.test(row.Id)"
                                        ></el-input>
                                        <template v-else>
                                            <div>{{ row.Name }}</div>
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    width="160"
                                    header-align="center"
                                    align="center"
                                >
                                    <template slot-scope="{ row }">
                                        <div class="table-operation" v-if="row.NodeType == 1 && !/add|edit/.test(row.Id)">
                                            <el-dropdown @command="handleCommand($event, row)">
                                                <el-button type="text">新增</el-button>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item command="file">子文件</el-dropdown-item>
                                                    <el-dropdown-item command="folder">子文件夹</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                            <el-button type="text" @click="editFolder(row)">编辑</el-button>
                                            <el-button type="text" @click="removeFolder(row)">删除</el-button>
                                        </div>
                                        <div class="table-operation" v-if="row.NodeType == 2">
                                            <el-button type="text" icon="el-icon-edit" @click="showFileInfo(row)"></el-button>
                                            <el-button type="text" icon="el-icon-delete" @click="removeFileInfo(row)"></el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button type="primary" plain @click="addFolder(enterpriseData.tableList)">添加</el-button>
                        </el-scrollbar>
                    </template>
                    <template v-else>
                        <no-data top="107" bottom="23"/>
                        <div class="f-c-c">
                            <el-button type="primary" round @click="addRirectory">立即添加标准</el-button>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <add-directory ref="addDirectory" @load="directorySuccess"></add-directory>
        <add-file ref="addFile" @load="fileSuccess"></add-file>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import AddDirectory from './add-directory.vue';
import AddFile from './add-file.vue';
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
const defaultDirectoryName = '文件夹';
export default {
    components: {
        AddDirectory,
        AddFile
    },  
    mixins: [request_mixins],
    data() {
        return {
            minHeight: 0,
            superData: null,
            enterpriseData: null,
        }
    },
    created() {
        this.getSubConfig();
        this.getConfig();
    },
    methods: {
        remove() {
            this.$confirm('确认删除企业标准吗？').then((_) => {
                this.Post('/DeleteDirectory').then((res) => {
                    if (res.status == 2000) {
                        this.enterpriseData = null;
                        this.$message.success('删除成功');
                    } else {
                        this.message.error(res.message);
                    }
                });
            });
        },
        getScrollHeight(height) {
            this.minHeight = height - 24;
        },
        async handleSwitch() {
            let res = await this.Get(`/UpdateDirectoryStatus?status=${this.enterpriseData.Status}`);
            if (res.status == 2000) {
                this.$message.success('状态已修改')
            } else {
                this.$message.error(res.message);
            }
        },
        async getSubConfig() {
            let res = await this.Get('/GetSupTemplateFolderTree');
            if (res.status == 2000 && res.data) {
                this.superData = {
                    directoryList: res.data,
                    modulename: res.data[0].Id+'',
                    tableList: res.data[0].Childrens
                };
            }
        },
        async getConfig(modulename) {
            let res = await this.Get('/GetTemplateFolderTree');
            if (res.status == 2000 && res.data) {
                let index = 0;
                if (modulename) {
                    index = res.data.map(item => item.Id).indexOf(+modulename)
                }
                this.enterpriseData = {
                    directoryList: res.data,
                    modulename: res.data[index].Id+'',
                    tableList: res.data[index].Childrens,
                    Status: res.data[index].Status
                }
            }
        },
        async copy() {
            let sourceEnterpriseId = this.superData.directoryList[0].EnterpriseId;
            let loading = this.$loading({
                lock: true,
                text: "复制中...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            try {
                let res = await this.Get('/CopyDirectory', {sourceEnterpriseId})
                if (res.status == 2000){
                    this.$message.success('复制成功');
                    this.getConfig();
                } else {
                    this.$message.error(res.message);
                }
            } catch (error) {
                
            }
            loading.close();
        },
        //加载子目录列表
        loadChDirectory(obj, key) {
            for (let i = 0; i < obj.directoryList.length; i++) {
                let item = obj.directoryList[i];
                if (item.Id == obj.modulename) {
                    obj.tableList = item.Childrens;
                    break;
                }
            }
            this.$refs[key+'Scrollbar'].wrap.scrollTop = 0;
        },
        showTemplateFileDialog(id, name) {

        },
        addRirectory() {
            this.$refs.addDirectory.show((this.enterpriseData || {}).directoryList ? this.enterpriseData.directoryList : []);
        },
        directorySuccess(list) {
            if (this.enterpriseData) {
                this.enterpriseData.directoryList = list;
                this.enterpriseData.tableList = list[0].Childrens;
                this.enterpriseData.modulename = list[0].Id;
            } else {
                this.enterpriseData = {
                    directoryList: list,
                    tableList: list[0].Childrens,
                    modulename: list[0].Id,
                }
            }
        },
        addFolder(list, parentId) {
            let Sort = 0;
            if (!!list.length) {
                Sort = list[list.length - 1].Sort + 1; 
            }
            let item = {
                Id: 'add' + Date.now(),
                Sort,
                DirectoryName: defaultDirectoryName,
                Name: defaultDirectoryName,
                Childrens: [],
                ParentId: +parentId || +this.enterpriseData.modulename,
                NodeType: 1
            };
            list.push(item);
            this.inputSelect(item.Id);
        },
        changeFolderName(row) {
            row.DirectoryName = row.Name;
        },
        inputSelect(id) {
            this.$nextTick(() => {
                let inputEl = this.$refs['Folder' + id];
                inputEl.focus();
            })
        },
        inputFocus(refKey) {
            this.$refs[refKey].select();
        },
        async inputBlur(item) {
            if (!item.DirectoryName) {
                item.DirectoryName = defaultDirectoryName;
                item.Name = defaultDirectoryName;
            }
            let params = _extends(item);
            if (/add/.test(item.Id)) {
                delete params.Id;
            }
            if (/edit/.test(item.Id)) {
                params.Id = params.DirectoryId = +item.Id.replace('edit', '');
            }
            let res = await this.Post('/SaveDirectory', params)
            if (res.status == 2000) {
                item.Id = res.data.DirectoryId;
                item.Status = res.data.Status;
                this.$message.success('新增文件夹成功')
            } else {
                this.$message.error(res.message);
            }
        },
        handleCommand(command, row) {
            if (command == 'file') {
                this.showFileInfo(null, row);
            } else {
                this.addFolder(row.Childrens, row.Id);
            }
        },
        showFileInfo(item, row, isPreview) {
            this.$refs.addFile.show(item, row, isPreview);
        },
        removeFileInfo(row) {
            this.$confirm('确认删除该文件吗？', '提示').then(async () => {
                let res = await this.Get(`/DeleteTemplateFolder?templateFolderId=${row.Id}`);
                if (res.status == 2000) {
                    this.$message.success('已删除');
                    this.getConfig(this.enterpriseData.modulename);
                } else {
                    this.$message.error(res.message);
                }
            })
        },
        editFolder(row) {
            row.Id = 'edit' + row.Id;
            this.inputSelect(row.Id);
        },
        async removeFolder(row) {
            this.$confirm('确认删除该文件夹吗？', '提示').then(async () => {
                let res = await this.Get(`/DeleteDirectory?directoryId=${row.Id}`);
                if (res.status == 2000) {
                    this.$message.success('已删除');
                    this.getConfig(this.enterpriseData.modulename);
                } else {
                    this.$message.error(res.message);
                }
            })
        },
        fileSuccess() {
            this.getConfig(this.enterpriseData.modulename);
        }

    }
}
</script>

<style lang="scss" scoped>
.document{
    margin-top: 8px;
    display: flex;
    height: 100%;
    color: #1C1D2F;
    font-size: 14px;
    .item{
        flex: 1;
        border-radius: 10px;
        border: 1px solid #E1E1E1;
        overflow: hidden;
        &:first-child{
            margin-right: 18px;
        }
        .title{
            padding: 19px 25px;
            background: #F8F8F8;
            font-size: 18px;
            font-weight: 600;
            .el-switch{
                margin-left: 20px;
                font-size: 14px;
            }
        }
        .other-opertion{
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
            color: #959595;
            i{
                margin-right: 5px;
            }
        }
    }
    
    .el-tabs{
        width: 100%;
    }
    /deep/ .el-tabs__header{
        border-bottom: 0;
        margin-bottom: 0;
        .el-tabs__nav-wrap.is-scrollable{
            padding: 0 0 0 25px;
            .el-tabs__nav-prev,
            .el-tabs__nav-next{
                border-radius: 4px;
                border: 1px solid #d5d5d5;
                width: 21px;
                height: 21px;
                background: #fff;
                line-height: 21px;
                text-align: center;
                &.is-disabled{
                    background: #fff;
                }
            }
            .el-tabs__nav-next{
                right: initial;
                top: 24px;
                left: 0;
            }
        }
        .el-tabs__nav{
            border: 0;
            .el-tabs__item{
                border-radius: 4px;
                border: 1px solid #D5D5D5;
                height: 45px;
                line-height: 45px;
                &:not(:first-child) {
                    margin-left: 5px;
                }
                &.is-active{
                    position: relative;
                    border-color: $--color-primary;
                    background: $--color-primary;
                    color: #fff;
                    &::after{
                        content: '';
                        position: absolute;
                        bottom: 6px;
                        left: 50%;
                        transform: translateX(-50%);
                        border: 5px solid transparent;
                        border-bottom: 0;
                        border-top: 5px solid #fff;
                    }
                }
            }
        }
    }
    /deep/ .el-tabs--border-card > .el-tabs__content {
        padding: 0;
    }
    .header-operation{
        .el-tabs{
            width: calc(100% - 55px);
        }
    }
    .add-directory{
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        border: 1px dashed $--color-primary;
        width: 45px;
        height: 45px;
        color: $--color-primary;
        cursor: pointer;
    }
    .el-scrollbar{
        margin-top: 16px;
        height: calc(100% - 60px);
    }
    .content{
        padding: 20px 15px;
        height: calc(100% - 66px);
        .el-button.is-plain{
            margin-top: 14px;
            border-style: dashed;
            width: 100%;
        }
    }
    .el-table{
        /deep/ tr td:first-child .cell{
            display: flex;
            align-items: center;
            >div:not(.el-table__expand-icon){
                flex: 1;
            }
        }
    }
}
</style>