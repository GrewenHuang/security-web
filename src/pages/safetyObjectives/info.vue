<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="vehicleRouteInfo"
        width="1200px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar class="scrollbar" ref="scrollbar">
            <div class="container">
                <custom-card title="目标">
                    <el-form ref="form" label-position="top" :model="info" :rules="rules">
                        <div class="f-b-c">
                            <el-form-item class="w50 mr20" label="目标年份" prop="Year">
                                <el-date-picker type="year" placeholder="请选择" v-model="info.Year" value-format="yyyy"></el-date-picker>
                            </el-form-item>
                            <el-form-item class="w50" label="目标名称" prop="Name">
                                <el-input placeholder="请输入" v-model="info.Name"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label="目标说明" prop="Remark">
                            <el-input type="textarea" rows="5" placeholder="请输入" v-model="info.Remark"></el-input>
                        </el-form-item>
                    </el-form>
                </custom-card>
                <custom-card title="分解目标" style="margin-top: 20px;">
                    <el-table 
                        :data="info.ItemList"
                        style="width: 100%"
                        default-expand-all
                        row-key="ItemId"
                        :tree-props="{children: 'ChildrenItemList', hasChildren: 'hasChildren'}"
                    >
                        <!-- <el-table-column
                            label="序号"
                            type="index"
                            align="center"
                            width="50"
                        ></el-table-column> -->
                        <el-table-column
                            label="目标内容"
                            align="left"
                            prop="ItemContent"
                            show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                            label="责任部门"
                            align="center"
                            width="120"
                            prop="DepartmentName"
                        ></el-table-column>
                        <el-table-column
                            label="责任人"
                            align="center"
                            width="120"
                            prop="UserName"
                        ></el-table-column>
                        <el-table-column
                            label="开始日期"
                            align="center"
                            width="120"
                        >
                            <template slot-scope="{ row }">{{ row.StartDate | format }}</template>
                        </el-table-column>
                        <el-table-column
                            label="结束日期"
                            align="center"
                            width="120"
                        >
                            <template slot-scope="{ row }">{{ row.EndDate | format }}</template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="180"
                        >
                            <template slot-scope="{ row, $index }">
                                <el-button type="text" @click="addChildren(row)">添加子目标</el-button>
                                <el-button type="text" @click="addChildren(row, true)">编辑</el-button>
                                <el-button type="text" text-plain @click="remove(row, $index)">删除</el-button>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                    <el-button type="primary" ref="addBtn" style="margin-top: 20px;width: 100%;" @click="addChildren()">添加分解目标</el-button>
                </custom-card>
            </div>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >取消</el-button
            >
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="save()"
                slot="reference"
                >提交</el-button
            >
        </div>
        <objectivesInfo ref="objectivesInfo" @success="objectivesInfoSuccess" @close="objectivesInfoClose"/>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import objectivesInfo from './objectives-info';
const defaultInfo = {
    Year: '', // 目标年份
    Name: '', // 目标名称
    Remark: '', // 目标说明
    ItemList: []
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
function setItemId(list) {
    list.forEach(item => {
        if (item.ChildrenItemList.length) {
            setItemId(item.ChildrenItemList);
        }
        item.ItemId = item.SafetyGoalItemId;
    })
}
export default {
    name: 'safety-objectives-info',
    mixins: [request_mixin],
    components: {
        objectivesInfo
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
                Year: [{required: true, message: '请选择年份', trigger: ['change', 'blur']}],
                Name: [{required: true, message: '请输入目标名称', trigger: ['change', 'blur']}],
            },
            currentObjectives: null, // 当前编辑的目标
            objectivesEdit: false,
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : '新增'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.SafetyGoalId;
                try {
                    let res = await this.Get(`/GetSafetyGoal?safetyGoalId=${this.id}`)
                    if (res.status == 2000) {
                        setItemId(res.data.ItemList)
                        res.data.Year = res.data.Year + '';
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                        
                    } else {
                        this.$message.error('获取数据失败');
                        this.close();
                    }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        save() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    if (!this.info.ItemList.length) {
                        this.$message.warning('请添加分解目标');
                        this.$refs.scrollbar.wrap.scrollTop  = this.$refs.addBtn.$el.offsetTop;
                        return;
                    }
                   this.submitLoading = true;
                   try {
                      let params = {
                          ...this.info
                      }
                      let res = await this.Post('/SaveSafetyGoal', params)
                      if (res.status == 2000) {
                          this.$message.success('保存成功')
                          this.$emit('load');
                          this.close();
                      } else {
                          this.$message.error(res.message);
                      }
                   } catch (error) {
                      console.error(error);
                   }
                   this.submitLoading = false;
                }
            })
        },
        addChildren(item, isEdit) {
            this.objectivesEdit = !!isEdit;
            if (item) {
                this.currentObjectives = item;
                this.$refs.objectivesInfo.show(isEdit ? item : null);
            } else {
                this.$refs.objectivesInfo.show();
            }
        },
        remove(item, index) {
            function deleteItem (list, $index) {
                return new Promise(async (resolve, reject) => {
                    let len = list.length;
                    for (let i = 0; i < len; i++) {
                        let cItem = list[i];
                        if (item.ItemId === cItem.ItemId) {
                            list.splice(i, 1);
                            break;
                        } else if (!!cItem.ChildrenItemList.length) {
                            await deleteItem(cItem.ChildrenItemList, i);
                        }
                    }
                    resolve(true);
                });
            }
            this.$confirm('如果存在子级目标将会一同删除，是否确认删除？', '提示',{
                type: 'warning'
            }).then(() => {
                deleteItem(this.info.ItemList);
            })
        },
        objectivesInfoSuccess(data) {
            if (this.currentObjectives) {
                if (this.objectivesEdit) {
                    Object.assign(this.currentObjectives, data)
                } else {
                    this.currentObjectives.ChildrenItemList.push(data);
                }
            } else {
                this.info.ItemList.push(data);
            }
        },
        objectivesInfoClose() {
            this.currentObjectives = null;
        }
    }
}
</script>

<style lang="scss" scoped>
    .vehicleRouteInfo{
        /deep/ .el-dialog__body{
            padding: 0 !important;
            .scrollbar .el-scrollbar__wrap{
                height: 70vh;
            }
        }
        /deep/ .el-dialog{
            min-width: 1200px;
        }
        /deep/ .el-form{
            padding: 25px 25px 20px;
            .el-select{
                width: 100%;
            }
        }
        .container{
            padding: 26px 20px;
        }
        /deep/ .el-form-item{
            margin-bottom: 34px;;
            &:first-child{
                margin-right: 20px;
            }
            .el-form-item__label{
                padding-bottom: 9px;
                line-height: 20px;
            }
            .el-select{
                width: 100%;
            }
        }
        .w50{
            width: 50%;
        }
        .mr20{
            margin-right: 20px;
        }
        .el-date-editor{
            width: 100%;
        }
    }
</style>
