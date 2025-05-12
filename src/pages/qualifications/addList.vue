<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="form" label-width="120px" >
        <el-form-item label="营业资质名称" >
          <el-input v-model="form.certificateTitle"></el-input>
        </el-form-item>
        <el-form-item :label="`营业资质图片`">
          <custom-upload
            :accept="'.jpeg,.png,.jpg,.gif'"
            :fileList.sync="form.certificatelmage"
            list-type="picture-card"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </custom-upload>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitAdd">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request_mixin from "@/mixins/request-mixin";
export default {
  mixins: [request_mixin],
  data() {
    return {
      dialogVisible: true,
      form: {
        certificateTitle: "",
        certificatelmage: []
      }
    };
  },
  methods: {
    handleClose() {
      this.$emit('closeClick',false)
    },
    submitAdd() {
      let that = this;
      let obj = {
        CertificateTitle: this.form.certificateTitle,
        CertificateImage: ""
      };
      console.log(this.form.certificateTitle, "提交数据");
      if (!this.form.certificateTitle) {
        return this.$message.warning("公司资质名称不能为空");
      }
      console.log(this.form.certificatelmage, "this.form.certificatelmage");
      if (
        !this.form.certificatelmage ||
        this.form.certificatelmage.length < 1
      ) {
        return this.$message.warning("公司资质图片不能为空");
      }
      if (this.form.certificatelmage && this.form.certificatelmage.length > 0) {
        obj.CertificateImage = this.form.certificatelmage[0].viewurl
          ? this.form.certificatelmage[0].viewurl
          : this.form.certificatelmage[0].url
          ? this.form.certificatelmage[0].url
          : "";
      }
      console.log(this.form.certificatelmage, "this.form.certificatelmage");
      this.Post("/SaveCertificates", obj).then(res => {
        if(res.status == 2000){
          that.$message.success('上传成功')
          that.$emit('closeClick',true)
        }

      });
    }
  }
};
</script>

<style></style>
