<template>
	<el-dialog v-dialog-drag title="模板设置" :visible.sync="dislogShow" @close="close()" class="info"
		width="1000px" top="8vh" v-loading="loading" element-loading-text="数据加载中">
		<el-scrollbar ref="scrollbar" class="scrollbar">
    <el-form ref="formRef" class="form-data" :model="data" :rules="rules"  :disabled="data.Status != 1">
		<el-form-item label="车辆巡检模板名称" prop="VehicleSafelyCheckConfigName" class="card">
			<el-input v-model="data.VehicleSafelyCheckConfigName"></el-input>
		</el-form-item>
		<div class="card">
			<div class="title">
				<div class="f-b-c f1">
					<span>检查设置</span>
				</div>
			</div>
			<div class="z-table-box">
				<table>
					<thead>
						<tr>
							<th style="width: 60px" class=""><span>序号</span></th>
							<th style="width: 70%;"><span>名称</span></th>
							<th style="200px"><span>操作</span></th>
						</tr>
					</thead>
					<tbody>
						<tr class="tr-border">
							<td colspan="3" class="set-box">
								整车检查配置<span>(温馨提示：只有开启整车检查照片/视频强制上传后,才能选择是否强制上传)</span>
							</td>
						</tr>
						<tr class="tr-border">
							<td>1</td>
							<td>整车检查照片强制上传</td>
							<td>
								<el-form-item>
									<el-switch v-model="data.SetUploadFileModel.IsPicUpload" active-text="开启" inactive-text="关闭"
										:active-value="1" :inactive-value="0">
									</el-switch>
								</el-form-item>
							</td>
						</tr>
						<tr class="tr-border">
							<td>2</td>
							<td>整车检查照片强制现场上传</td>
							<td>
								<el-form-item>
									<el-switch v-model="data.SetUploadFileModel.IsPicMustUpload" active-text="开启" inactive-text="关闭"
										:active-value="1" :inactive-value="0" @change="onChange('image')">
									</el-switch>
								</el-form-item>
							</td>
						</tr>
						<tr class="tr-border">
							<td>3</td>
							<td>整车检查视频强制上传</td>
							<td>
								<el-form-item>
									<el-switch v-model="data.SetUploadFileModel.IsVideoUpload" active-text="开启" inactive-text="关闭"
										:active-value="1" :inactive-value="0">
									</el-switch>
								</el-form-item>
							</td>
						</tr>
						<tr class="tr-border">
							<td>4</td>
							<td>整车检查视频强制现场上传</td>
							<td>
								<el-form-item>
									<el-switch v-model="data.SetUploadFileModel.IsVideoMustUpload" active-text="开启" inactive-text="关闭"
										:active-value="1" :inactive-value="0" @change="onChange('video')">
									</el-switch>
								</el-form-item>
							</td>
						</tr>
						<tr class="tr-border">
							<td colspan="3" class="set-box">
								<span style="color: #000;margin-left: 0;">签字配置</span>
							</td>
						</tr>
						<tr class="tr-border">
							<td>5</td>
							<td>检查人签字</td>
							<td>
								<el-form-item>
									<el-switch v-model="data.SetSignModel.IsCheckerSign" active-text="开启" inactive-text="关闭" :active-value="1"
										:inactive-value="0">
									</el-switch>
								</el-form-item>
							</td>
						</tr>
						<tr class="tr-border">
							<td>6</td>
							<td>被检查负责人签字</td>
							<td>
								<el-form-item>
									<el-switch v-model="data.SetSignModel.IsBeCheckerSign" active-text="开启" inactive-text="关闭"
										:active-value="1" :inactive-value="0">
									</el-switch>
								</el-form-item>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
        <div v-for="(item, index) in list" :key="index">
            <div class="gutter"></div>
            <el-form-item  class="card" :prop="item.key">
                <div class="title">
                    <div class="f-b-c f1">
                        <span>{{ item.title }}</span>
                        <div class="clear" @click="data[item.key] = [];" v-if="edit && data[item.key] && !!data[item.key].length && data.Status == 1"><i class="el-icon-brush"></i>清空</div>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="custom-input" v-for="(cItem, cIndex) in (data[item.key] || [])" :key="cIndex">
                        <el-input type="text" placeholder="请输入" v-model="cItem.ItemName" :readonly="data.Status == 2"></el-input>
                        <i class="remove el-icon-delete-solid" @click="data[item.key].splice(cIndex, 1)" v-if="data.Status == 1"></i>
                    </div>
                    <div class="add-btn" @click="add(item.key)" v-if="edit && data.Status == 1">+ 添加检查项</div>
                </div>
            </el-form-item>
        </div>
    </el-form>
	</el-scrollbar>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="close()">取消</el-button>
			<el-button type="primary" @click="save()" :loading="submitLoading">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request_mixins from '@/mixins/request-mixin';
	let josnFields = ['InspectionItemList','SetSignModel','SetUploadFileModel'];
export default {
	mixins: [request_mixins],
    props: {
        edit: {
            type: Boolean,
            default: true
        },
        status: {
            type: [Number, String],
            default: 1
        }
    },
    data() {
        const validator = (rule, value, callback) => {
            if (this.status == 1 && !value.length) {
                let message = rule.message1;
                setTimeout(() => {
                    this.$message.warning(message)
                }, 100 * rule.index);
                callback(new Error(message))
            } else if (!!value.length) {
                for (let i = 0; i < value.length; i++) {
                    let item = value[i];
                    if (!item.ItemName) {
                        let message1 = '还有检查项未输入内容';
                        setTimeout(() => {
                            this.$message.warning(message1)
                        }, 100 * rule.index);
                        callback(new Error(message1))
                        break;
                    }
                }
                callback();
            } else {
                callback();
            }
        }
        return {
			isEdit: false,
			loading: false,
			dislogShow: false,
			submitLoading: false,
			data: {
				VehicleSafelyCheckConfigName: "",
				InspectionItemList: [],
				SetSignModel: {
					IsCheckerSign: 0,
					IsBeCheckerSign: 0,
				},
				SetUploadFileModel: {
					IsVideoUpload: 0,
					IsPicUpload: 0,
					IsVideoMustUpload: 0,
					IsPicMustUpload: 0
				}
			},
            list: [
                {
                    title: '检查项',
                    key: 'InspectionItemList',
                },
            ],
            rules: {
				VehicleSafelyCheckConfigName: [{
					required: true,
					message: "请输入行车日志模板名称",
					trigger: "blur",
				}, ],
                InspectionItemList: [{
                    type: 'array',
                    message: '请添加检查项',
                    message1: '请添加检查项',
                    validator,
                    index: 0,
                    trigger: ['change', 'blur']
                }],
            }
        }
    },
    methods: {
		onChange(type){
			if(type == 'image'){
				if(this.data.SetUploadFileModel.IsPicUpload == 0){
					this.$message.error('请先开启整车检查照片强制上传配置')
					this.data.SetUploadFileModel.IsPicMustUpload = 0
				}
			}else {
				if(this.data.SetUploadFileModel.IsVideoUpload == 0){
					this.$message.error('请先开启整车检查视频强制上传配置')
					this.data.SetUploadFileModel.IsVideoMustUpload = 0
				}
			}
		},
        add(key) {
            this.data[key].push({ItemName: ''});
        },
		close(){
			this.dislogShow = false
		},
		async show(item) {
			this.dislogShow = true;
			if (item) {
				this.data = JSON.parse(JSON.stringify(item))
			}
			this.$nextTick(() => {
				this.$refs.scrollbar.wrap.scrollTop = 0;
			})
		},
		save() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					this.submitLoading = true;
					let params = {
						...this.data,
					}
					// josnFields.forEach(key => {
					// 	params[key] = JSON.stringify(params[key]);
					// });
					this.Post('/SaveVehicleSafelyCheckConfig', params).then(res=>{
						if (res.status == 2000) {
							this.$message.success('保存成功');
							this.close()
							this.$emit('success')
						}
						this.submitLoading = false;
					})
				}
			})
		}
    }
}
</script>

<style lang="scss" scoped>
.gutter{
    width: 100%;
    height: 10px;
    background: #F2F2F2;
}
.form-data{
    .el-form-item{
        margin-bottom: 0;
    }
    .card,.card1{
        padding:18px 25px;
        .title{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 600;
            line-height: 1;
            &::before{
                content: '';
                margin-right: 10px;
                width: 5px;
                height: 18px;
                background: $--color-primary;
            }
        }
        /deep/ textarea{
            border-radius: 4px;
            padding: 14px 15px;
            width: 100%;
            height: 130px;
            resize: none;
            font-size: 14px;
            &:focus-visible{
                outline: none;
            }
        }
        /deep/ input{
            border-radius: 4px;
            padding: 0 16px;
            width: 100%;
            height: 45px;
            &:focus-visible{
                outline: none;
            }
        }
        .custom-input{
            position: relative;
            &:hover{
                .remove{
                    display: block;
                }
            }
            .remove{
                position: absolute;
                top: 50%;
                right: 13px;
                transform: translateY(-50%);
                font-size: 16px;
                color: #FE3F51;
                cursor: pointer;
                display: none;
            }
        }
        .setting-item{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 20px;
            width: 100%;
        }
        .add-btn{
            border-radius: 4px;
            border: 1px dashed #E7E8F2;
            height: 45px;
            background: #FBFDFF;
            line-height: 45px;
            text-align: center;
            cursor: pointer;
        }
        .clear{
            font-size: 14px;
            color: #959595;
            cursor: pointer;
            i{
                margin-right: 8px;
            }
        }
    }
	.card1 {
		padding: 0px 25px !important;
	}
}
</style>