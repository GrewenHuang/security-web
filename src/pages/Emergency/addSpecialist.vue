<!-- 应急专家详情 -->
<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="specialist"
        width="700px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar class="scrollbar" ref="scrollbar">
            <el-form ref="form" label-position="top" :model="info" :rules="rules">
				<div class="form-2-col">
					<el-form-item label="专家姓名" prop="ExpertName">
					    <el-input placeholder="请输入" v-model="info.ExpertName"></el-input>
					</el-form-item>
					<el-form-item label="专家电话" prop="ExpertTel">
					    <el-input class="mr20" placeholder="请输入" v-model="info.ExpertTel"></el-input>
					</el-form-item>
				</div>
				<div class="form-2-col">
					<el-form-item label="专家领域" prop="Specialty">
					    <el-input class="mr20" placeholder="请输入" v-model="info.Specialty"></el-input>
					</el-form-item>
					<el-form-item label="学历" prop="Education">
					    <el-input class="mr20" placeholder="请输入" v-model="info.Education"></el-input>
					</el-form-item>
				</div>
               <div class="form-2-col">
				   <el-form-item label="专业" prop="Major">
				       <el-input class="mr20" placeholder="请输入" v-model="info.Major"></el-input>
				   </el-form-item>
				   <el-form-item label="安全等级" prop="SecurityLevel">
				   	<select-level v-model="info.SecurityLevel" :multiple="false"
				   		:value="info.SecurityLevel"></select-level>
				   </el-form-item>
			   </div>
               
                <el-form-item label="备注" prop="Remark">
                    <el-input class="mr20" placeholder="请输入" type="textarea" :rows="4" v-model="info.Remark"></el-input>
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
    ExpertName: '',
    ExpertTel: '',
    Specialty: '',
    Education: '',
    Major: '',
    Remark: '',
	SecurityLevel: "1"
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    name: 'specialist-info',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            rules: {
				ExpertName: [{required: true, message: '请选择安全等级', trigger: ['change', 'blur']}],
                ExpertName: [{required: true, message: '请输入专家姓名', trigger: ['change', 'blur']}],
                ExpertTel: [{required: true, message: '请输入专家电话', trigger: ['change', 'blur']}],
                Specialty: [{required: true, message: '请输入专家领域', trigger: ['change', 'blur']}],
                Education: [{required: true, message: '请输入学历', trigger: ['change', 'blur']}],
                Major: [{required: true, message: '请输入专业', trigger: ['change', 'blur']}],
            }
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
                this.id = item.id;
                try {
                   let res = await this.Get(`/GetEmergencyExpert?emergencyExpertId=${item.ExpertId}`)
                   if (res.status == 2000) {
                       this.info = Object.assign(_extends(defaultInfo), res.data);
					   this.info.SecurityLevel = this.info.SecurityLevel? this.info.SecurityLevel.toString() : "1"
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
            Object.assign(this.info, _extends(defaultInfo))
        },
        save() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                   this.submitLoading = true;
                   try {
                      let params = {
                        ...this.info
                      }
					  params.SecurityLevel = parseInt(params.SecurityLevel)
                      let res = await this.Post('/SaveEmergencyExpert', params)
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
        }
    }
}
</script>

<style lang="scss" scoped>
    .specialist{
        /deep/ .el-dialog__body{
            padding: 0 !important;
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