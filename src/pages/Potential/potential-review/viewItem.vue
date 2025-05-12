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
                 element-loading-text="拼命加载中"
                 >

        <el-form-item label="检查内容">
            <el-input type="textarea"
                v-model="form.Content"
                disabled>
            </el-input>
        </el-form-item>
        <el-form-item label="限期整改日期">
            <div class="el-input">{{form.ReformDeadlineTimeDesc}}</div>
        </el-form-item>
        <el-form-item label="检查照片">
            <div class="el-input">
                <el-upload class="hiddenUploadBtn"
                    ref="upload"
                    action
                    :file-list="form.CheckPic"
                    :on-preview="handlePictureCardPreview"
                    list-type="picture-card">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
        </el-form-item>
            <el-form-item label="检查备注">
            <el-input v-model="form.CheckRemark"
                        disabled></el-input>
            </el-form-item>
          <div v-if="form.Level==1">
            <el-row>
              <el-col :span="3">
                <label class="el-form-item__label"
                       style="float: right">整改方案</label>
              </el-col>
              <el-col :span="21">
                <div v-for="(item,index) in form.FormPlan"
                     :key=index>
                  <el-link :href="item.url"
                           target="_blank">{{item.name}}</el-link>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="整改照片"
                            prop="FormPic"
                            :rules="rules.FormPic">
                <el-upload class="hiddenUploadBtn"
                           ref="upload"
                           action
                           :file-list="form.FormPic"
                           :on-preview="handlePictureCardPreview"
                           list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="整改备注">
                <el-input v-model="form.FormRemark"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="复查照片"
                              prop="ViewPic"
                              :rules="rules.ViewPic">
                  <el-upload ref="upload"
                             action
                             list-type="picture-card"
                             multiple
                             accept=".jpeg,.jpg,.gif,.png"
                             :http-request="uploadImg"
                             :on-preview="handlePictureCardPreview"
                             :before-upload="onBeforeUploadImage"
                             :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-form-item label="复查备注"
                            prop="ViewRemark"
                            :rules="rules.ViewRemark">
                <el-input v-model="form.ViewRemark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24"
                    style="text-align: center">
              <el-button type="primary"
                         @click='handlePass()'>通过</el-button>
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
  name: "viewItem",
  data () {
    return {
      loading: false,
      dialogImageUrl: "",
      dialogImageVisible: false,
      form: {},
      rules: {
        ViewRemark: RULECONFIG.Text('复查内容'),
        ViewPic: RULECONFIG.Select('复查照片'),
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
    handleRemove (file, fileList) {
      this.form.ViewPic.some((item, i) => {
        if (item.url == file.url) {
          this.form.ViewPic.splice(i, 1);
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
    uploadImg (fileObj) {
      API_UPLOAD.uploadFile(fileObj).then((res) => {
        let than = this;
        than.form.ViewPic.push(res.files[0]);
      });
    },
    handleFail () {
      let than = this;
      let params = {
        ItemId: than.form.itemId,
        ViewPic: [],
        ViewResult: false,
      };
      than.loading = true;
      API_POTENTIAL.SaveEnterprisePotentialView(params).then(function (result) {
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
    },
    handlePass () {
      let than = this;
      than.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            ItemId: than.form.itemId,
            ViewRemark: than.form.ViewRemark,
            ViewPic: than.form.ViewPic,
            ViewResult: true,
          };
          than.loading = true;
          API_POTENTIAL.SaveEnterprisePotentialView(params).then(function (result) {
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
.box {
  margin: 10px 0;
}
</style>
