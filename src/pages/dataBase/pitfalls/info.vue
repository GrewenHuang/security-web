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
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
                <div class="f-b-c form-2-col">
                    <el-form-item label="隐患级别" prop="PotentialLevelCode">
                        <el-select v-model="info.PotentialLevelCode" @change="changePitfallLevel" style="width: 100%">
                            <el-option v-for="(item, index) in pitfallLevel" :key="index" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                    </el-form-item>
                   <el-form-item label="隐患类型" prop="ClassificationLibraryId">
                        <el-cascader
							style="width: 100%"
                            v-model="info.ClassificationLibraryId"
                            filterable
                            clearable
                            :options="labels"
                            :props="{ checkStrictly: true, value: 'ClassificationLibraryId', label: 'ClassificationName', children: 'Childs' }"
                        ></el-cascader>
                    </el-form-item>
                </div>
                <el-form-item label="隐患描述" prop="Describe">
                    <el-input type="textarea" placeholder="请输入" v-model="info.Describe"></el-input>
                </el-form-item>
                <el-form-item label="检查依据" prop="Basis">
                    <el-input type="textarea" placeholder="请输入" v-model="info.Basis"></el-input>
                </el-form-item>
                <el-form-item label="整改建议" prop="Suggestion">
                    <el-input type="textarea" placeholder="请输入" v-model="info.Suggestion"></el-input>
                </el-form-item>
                <el-form-item label="重大隐患判断标准" prop="JudgmentCriteria" v-if="info.PotentialLevelCode == '058001'">
                    <el-input type="textarea" placeholder="请输入" v-model="info.JudgmentCriteria"></el-input>
                </el-form-item>
            </el-form>
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
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
const defaultInfo = {
    ClassificationLibraryId: '',
    PotentialLevelCode: '',
    PotentialLevelName: '',
    Describe: '',
    Basis: '',
    Suggestion: '',
    JudgmentCriteria: '',
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
function getIdsById(list, id) {
    let ids = [id];
    while(true) {
        let parentId = getParentIdById(list, id);
        if (!parentId) break;
        ids.unshift(parentId);
        id = parentId;
    }
    return ids;
}
function getParentIdById(list, id) {
    let parentId = null;
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (id == item.ClassificationLibraryId) {
            parentId = item.ParentId;
            break;
        } else {
            if (item.Childs && !!item.Childs.length) {
                parentId = getParentIdById(item.Childs, id);
                if (parentId) break;
            }
        }
    }
    return parentId;
}
export default {
    name: 'page-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
                PotentialLevelCode: [{required: true, message: '请选择隐患级别', trigger: ['change', 'blur']}],
                ClassificationLibraryId: [{type: 'array', required: true, message: '请选择隐患类型', trigger: ['change', 'blur']}],
                Describe: [{required: true, message: '请输入隐患描述', trigger: ['change', 'blur']}],
                Suggestion: [{required: true, message: '请输入整改意见', trigger: ['change', 'blur']}],
            },
            labels: [],
            pitfallLevel: [],
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
            await this.getPitfallLevel();
            await this.getLabels();
            if (item) {
                this.loading = true;
                this.id = item.PotentialLibraryId;
                try {
                    let res = await this.Get(`/GetPotentialLibrary?potentialLibraryId=${this.id}`)
                    if (res.status == 2000) {
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                        this.info.ClassificationLibraryId = getIdsById(this.labels, this.info.ClassificationLibraryId)
                    } else {
                       this.$message.error('获取数据失败');
                       this.close();
                    }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
        },
        save() {
            this.$refs.form.validate(async (valid, fields) => {
                for (let key in fields) {
                   if (this.$refs[key]) {
                       this.$refs.scrollbar.wrap.scrollTop = this.$refs[key].$el.offsetTop;
                       break;
                   }
                }
                if (valid) {
                   this.submitLoading = true;
                   try {
                      let params = {
                        ...this.info
                      }
                      params.ClassificationLibraryId = params.ClassificationLibraryId[params.ClassificationLibraryId.length - 1] || '';
                      let res = await this.Post('/SavePotentialLibrary', params)
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
        async getPitfallLevel() {
            let res = await this.Get('/GetPotentialLevelCom');
            if (res.status == 2000) {
                this.pitfallLevel = res.data;
            }
            return Promise.resolve();
        },
        async getLabels() {
            let res = await this.Post('/GetClassificationLibraryList');
            
            function setHasChildren(list) {
                list.forEach(item => {
                    item.hasChildren = !!item.Childs.length;
                    setHasChildren(item.Childs);
                    if (!item.hasChildren) {
                        item.Childs = null;
                    }
                });
            }
            if (res.status == 2000) {
                setHasChildren(res.data);
                this.labels = res.data;
            }
            return Promise.resolve();
        },
        changePitfallLevel() {
            let item = this.pitfallLevel.find(item => this.info.PotentialLevelCode == item.id);
            if (item) {
                this.info.PotentialLevelName = item.text;
            }
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
        .el-date-editor,
        .el-select,
        .el-cascader{
            width: 100%;
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
	.form-2-col {
			display: flex;
	
			>div {
				width: 50%;
	
				&:first-child {
					margin-right: 40px;
				}
			}
		}
</style>