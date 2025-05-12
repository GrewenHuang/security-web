<template>
    <el-dialog
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1100px"
        top="8vh"
    >
        <el-scrollbar ref="scrollbar" class="scrollbar">
            <el-table
                :data="list"
                :header-cell-style="$tableStyle"
            >
                <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
                <el-table-column header-align="left" label="体系文件标题">
                    <template slot-scope="{ row, $index }">
                        <el-input 
                            placeholder="请输入名称"
                            :ref="'input' + $index"
                            v-model="row.DirectoryName"
                            @change="changeDirectoryName(row)"
                            @focus="inputFocus('input' + $index)"
                            @blur="inputBlur(row)"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="排序"
                    align="center"
                    width="264"
                >
                    <template slot-scope="{ row, $index }">
                        <div class="sort-operation f-c-c">
                            <div @click="move(row, -1, $index)" v-if="$index > 0">
                                <i class="el-icon-top"></i>上移
                            </div>
                            <div @click="move(row, 1, $index)" v-if="$index < list.length - 1">
                                <i class="el-icon-bottom"></i>下移
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="120"
                    header-align="center"
                    align="center"
                >
                    <template slot-scope="{ $index }">
                        <div class="table-operation">
                            <el-button
                                type="text"
                                @click="list.splice($index, 1)"
                            >删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" plain @click="add">添加</el-button>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                @click="save()"
                slot="reference"
                :loading="submitLoading"
                >提交</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
const defaultDirectoryName = '体系文件标题';
const defaultItem = {
    ParentId: 0,
    DirectoryName: defaultDirectoryName,
    Name: '',
    Sort: 1,
    Childrens: [],
}
export default {
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            dislogShow: false,
            submitLoading: false,
            list: [],
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return '体系文件标题设置'
        }
    },
    methods: {
        async show(list) {
            this.dislogShow = true;
            this.list = _extends(list.map(item => {
                let obj = {...item, DirectoryName: item.Name};
                return obj;
            }));
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.id = '';
        },
        async save() {
            if (!this.list.length) {
                this.$message.warning('请添加体系文件标题');
                return;
            }
            this.submitLoading = true;
            let params = _extends(this.list)
            try {
                let res = await this.Post('/BatchSaveDirectory', { List: params });
                if (res.status == 2000) {
                    this.$message.success('已设置');
                    this.close();
                    this.$emit('load', res.data.List.map(item => {
                        return {
                            ...item,
                            Name: item.DirectoryName,
                            Id: item.DirectoryId + '',
                            Childrens: [],
                        }
                    }));
                } else {
                    this.$message.error(res.message);
                }
            } catch (error) {
                console.error(error);
            }
            this.submitLoading = false;
            
        },
        changeDirectoryName(row) {
            row.Name = row.DirectoryName;
        },
        move(item, num, index) {
            let siblingItem = this.list[index + num];
            item.Sort += num;
            siblingItem.Sort -=num;
            this.list = this.list.sort((a,b) => a.Sort - b.Sort);
        },
        add() {
            let obj = _extends(defaultItem);
            if (this.list[this.list.length - 1]) {
                obj.Sort = this.list[this.list.length - 1].Sort + 1;
            }
            this.list.push(obj);
        },
        inputFocus(refKey) {
            this.$refs[refKey].select();
        },
        inputBlur(item) {
            if (!item.DirectoryName) {
                item.DirectoryName = defaultDirectoryName;
                item.Name = defaultDirectoryName;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 30px !important;
        }
        /deep/ .el-dialog{
            min-width: 1100px;
        }
        .el-button.is-plain{
            margin-top: 14px;
            border-style: dashed;
            width: 100%;
        }
        .sort-operation{
            >div {
                cursor: pointer;
                &:first-child{
                    margin-right: 8px;
                }
            }
        }
        /deep/ .el-scrollbar__wrap{
            margin-bottom: 0 !important;
        }
    }
</style>
