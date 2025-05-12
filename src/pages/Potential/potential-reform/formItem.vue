<template>
  <div>
    <el-card class='box'>
      <div slot="header"
           class="clearfix">
        <span>检查项目：{{ form.Project }}</span>
        <el-button style="float: right; padding: 3px 0"
                   type="text">{{form.PotentialLevelName}}</el-button>
      </div>
      <div>
        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 v-loading="loading"
                 element-loading-text="拼命加载中">

          <el-row>
            <el-col :span='24'>
              <el-form-item label="检查内容">
                <el-input type="textarea"
                          v-model="form.Content"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="限期整改日期">
                {{form.ReformDeadlineTimeDesc}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检查照片">
                <el-upload class="hiddenUploadBtn"
                           ref="upload"
                           action
                           :file-list="form.CheckPic"
                           :on-preview="handlePictureCardPreview"
                           list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检查备注">
                <el-input v-model="form.CheckRemark"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.Level==1">
            <el-row>
              <el-col :span="24">
                <el-form-item label="整改方案"
                              prop="FormPlan"
                              :rules="rules.FormPlan">
                  <el-upload ref="upload2"
                             action
                             list-type="text"
                             multiple
                             accept=".doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx,.pdf"
                             :file-list="form.FormPlan"
                             :http-request="uploadPlan"
                             :before-upload="onBeforeUploadPlan"
                             :on-remove="handlePlanRemove">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="整改照片"
                            prop="FormPic"
                            :rules="rules.FormPic">
                <el-upload ref="upload"
                           action
                           list-type="picture-card"
                           multiple
                           accept=".jpeg,.jpg,.gif,.png"
                           :file-list="form.FormPic"
                           :http-request="uploadImg"
                           :on-preview="handlePictureCardPreview"
                           :before-upload="onBeforeUploadImage"
                           :on-remove="handlePicRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24"
                    class="warp-main">
              <el-form-item label="整改备注"
                            prop="FormRemark"
                            :rules="rules.FormRemark">
                <el-input v-model="form.FormRemark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24"
                    class="warp-main"
                    style="text-align: center">
              <el-button type="primary"
                         @click.native="handleSave">提交</el-button>
            </el-col>
          </el-row>

        </el-form>
      </div>
    </el-card>
    <el-dialog v-dialog-drag  :visible.sync="dialogImageVisible"
               append-to-body>
      <img width="100%"
           :src="dialogImageUrl"
           alt="" />
    </el-dialog>
  </div>
</template>

<script>
import API_UPLOAD from "@/api/api_upload";
import API_POTENTIAL from "@/api/api_potential";
import RULECONFIG from "@/common/ruleConfig";
export default {
  name: "formItem",
  data () {
    return {
      loading: false,
      dialogImageUrl: "",
      dialogImageVisible: false,
      form: {},
      rules: {
        FormRemark: RULECONFIG.Text('整改备注'),
        FormPic: RULECONFIG.Select('整改照片'),
        FormPlan: RULECONFIG.Select('整改方案')
      },
    };
  },
  props: {
    data: {
      type: Object,
      require: true,
    },
  },
  mounted () {
    let than = this;
    let { data } = this._props;
    than.form = data;
  },
  methods: {
    handlePicRemove (file, fileList) {
      this.form.FormPic.some((item, i) => {
        if (item.url == file.url) {
          this.form.FormPic.splice(i, 1);
          return true;
        }
      });
    },
    handlePlanRemove (file, fileList) {
      this.form.FormPlan.some((item, i) => {
        if (item.url == file.url) {
          this.form.FormPlan.splice(i, 1);
          return true;
        }
      });
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogImageVisible = true;
    },
    onBeforeUploadImage (file) {
      const isIMAGE =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isIMAGE) {
        this.$message.error("只能上传图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isIMAGE && isLt2M;
    },
    onBeforeUploadPlan (file) {
      const isIMAGE =
        file.type === "text/plain" ||
        file.type === "application/pdf" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-powerpoint" ||
        file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isIMAGE) {
        this.$message.error("只能上传.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx,.pdf格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isIMAGE && isLt2M;
    },
    uploadImg (fileObj) {
      API_UPLOAD.uploadFile(fileObj).then((res) => {
        let than = this;
        than.form.FormPic.push(res.files[0]);
      });
    },
    uploadPlan (fileObj) {
      API_UPLOAD.uploadFile(fileObj).then((res) => {
        let than = this;
        than.form.FormPlan.push(res.files[0]);
      });
    },
    handleSave () {
      let than = this;
      than.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            ItemId: than.form.itemId,
            FormRemark: than.form.FormRemark,
            FormPic: than.form.FormPic,
            FormPlan: than.form.FormPlan,
          };
          than.loading = true;
          API_POTENTIAL.SaveEnterprisePotentialForm(params).then(function (result) {
            than.loading = false
            if (result && result.status == 2000) {
              than.$message.success({ showClose: true, message: '操作成功', duration: 2000 });
              than.$emit("saveSuccess", than.form.itemId);
            } else {
              than.$message.error({ showClose: true, message: result.message, duration: 2000 });
            }
          }, function (err) {
            than.loading = false
            than.$message.error({ showClose: true, message: err.toString(), duration: 2000 });
          }).catch(function (error) {
            than.loading = false
            than.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 });
          })
        }
      });
    },
  },
};
</script>

<style scoped>
/deep/ .hiddenUploadBtn .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
/deep/ .hiddenUploadBtn .el-icon-delete {
  display: none; /* 删除按钮隐藏 */
}
.box {
  margin: 10px 0;
}
/deep/ .el-upload--picture-card {
  width: 60px;
  height: 60px;
  line-height: 60px;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 60px;
  height: 60px;
  line-height: 70px;
}
.clearfix {
  font-size: 16px;
  font-weight: 600;
}
</style>
