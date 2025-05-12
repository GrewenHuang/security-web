<template>
  <div>

    <el-card v-for='(item,i) in form'
             class='box'
             :key='i'>
      <div slot="header"
           class="clearfix">
        <span>检查项目：{{ item.Project }}</span>
        <el-button style="float: right; padding: 3px 0"
                   type="text">{{ item.PotentialLevelName }}</el-button>
      </div>
      <div>
        <el-form ref="form"
                 v-loading="loading"
                 element-loading-text="拼命加载中">
          <el-row>
            <el-col :span='24'>
              <el-form-item label="检查内容">
                <el-input type="textarea"
                          v-model="item.Content"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='12'>
              <el-form-item label="隐患状态">
                {{item.ItemStatusDesc}}
              </el-form-item>
            </el-col>
            <el-col :span='12'
                    v-if='item.ReformDeadlineTimeDesc'>
              <el-form-item label="限期整改日期">
                {{item.ReformDeadlineTimeDesc}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if='item.CheckPic.length'>
            <el-col :span='24'>
              <el-form-item label="检查照片">
                <el-upload class="hiddenUploadBtn"
                           ref="upload"
                           action
                           :file-list="item.CheckPic"
                           :on-preview="handlePictureCardPreview"
                           list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if='item.CheckRemark'>
            <el-col :span='24'>
              <el-form-item label="检查备注">
                <el-input type="textarea"
                          v-model="item.CheckRemark"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if='item.FormPic.length'>
            <el-col :span='24'>
              <el-form-item label="整改照片">
                <el-upload class="hiddenUploadBtn"
                           ref="upload"
                           action
                           :file-list="item.FormPic"
                           :on-preview="handlePictureCardPreview"
                           list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if='item.FormRemark'>
            <el-col :span='24'>
              <el-form-item label="整改备注">
                <el-input type="textarea"
                          v-model="item.FormRemark"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span='12'>
              <div v-if="form.ItemStatus==4 || form.ItemStatus==3">
                <div v-if="form.Level==1">
                  <el-form-item label="整改方案">
                    <div v-for="(item,index) in form.FormPlan"
                         :key=index>
                      <el-link :href="item.url"
                               target="_blank">{{item.name}}</el-link>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row v-if='item.ViewPic.length'>
            <el-col :span='24'>
              <el-form-item label="复查照片">
                <el-upload class="hiddenUploadBtn"
                           ref="upload"
                           action
                           :file-list="item.ViewPic"
                           :on-preview="handlePictureCardPreview"
                           list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if='item.ViewRemark'>
            <el-col :span='24'>
              <el-form-item label="复查备注">
                <el-input type="textarea"
                          v-model="item.ViewRemark"
                          disabled></el-input>
              </el-form-item>
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
export default {
  name: "viewItem",
  data () {
    return {
      loading: false,
      dialogImageUrl: "",
      dialogImageVisible: false,
      form: {},
    };
  },
  props: {
    data: {
      type: Array,
      require: true,
    },
  },
  mounted () {
    let than = this;
    let { data } = this._props;
    than.form = data;
  },
  methods: {
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
.clearfix {
  font-size: 16px;
  font-weight: 600;
}
</style>
