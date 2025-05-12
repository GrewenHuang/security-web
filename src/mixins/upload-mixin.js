/*
 * @Description:
 * @Date: 2020-11-30 17:24:05
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-01 16:04:31
 * @FilePath: \zt-traffic-enterprise-view\src\mixins\upload-mixin.js
 */

import axios from 'axios'
import API_BASIC from "@/api/api_basic";
import mammoth from 'mammoth'
export default {
  data () {
    return {
      upload: {
        preview_url: "",
        fileShow: false,
        preview_visible: false,
        document_suffix: ".txt,.doc,.docx,.xls,.xlsx,.pdf",
        image_suffix: ".jpg,.png,.gif,.bmp",
        all_suffix: ".txt,.doc,.xls,.ppt,.pdf,.jpg,.png,.gif,.bmp,.docx,.xlsx,.pptx,.mp4,.avi,.mov",
        arrFiles: [
          [], [], []
        ]
        ,
      },
    }
  },
  methods: {
    url: function () {
      var that = this;
      var API_UPLOAD_URL = process.env.API_UPLOAD_URL;
      return API_UPLOAD_URL;
    },

    arrFilesFun: function (index) {
      var that = this;

      if (!that.upload.arrFiles) { return []; }
      if (!that.upload.arrFiles[index]) { return []; };
      return that.upload.arrFiles[index]
    },
    before () {
      return false;
    },
    before_remove (file, index) {
      var that = this;
      if (file && file.status === "success") {
        return this.$confirm(`确定移除 ${file.name}？`, '提示', {}).then(() => {
          that.remove(file, index);

          return reject(false);
        }
          , () => { reject(false); }  //取消 时的处理
        );
      };


    },
    remove (file, index) {
      var that = this;

      if (file && file.status === "success") {

        if (!that.upload.arrFiles) { that.upload.arrFiles = []; return; }
        if (!that.upload.arrFiles[index]) { that.upload.arrFiles[index] = []; return; };

        //let del = -1;
        for (let i = 0; i < that.upload.arrFiles[index].length; i++) {
          if (that.upload.arrFiles[index][i].url == file.url) {
            //del = i;
            that.upload.arrFiles[index].splice(i, 1);
            break;
          }
        }

      }

      return false;
    },

    async change (file, index) {
      var that = this;
      const loading = this.$loading({
        lock: true,
        text: '上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      if (file && file.status === "ready") {
        index = index + "";
        let formData = new FormData();
        formData.set("file", file.raw);
        try {
          const res = await axios.post(that.url(), formData, {
            headers: {
              "Content-type": "multipart/form-data"
            }
          });
          if (res.status == 200 && res.data.status == 2000) {
            loading.close();
            if (res.data.errors.length) {
              this.$message.error('上传失败,' + res.data.errors[0].error);
            } else {
              that.imageUrl = res.data.files[0].url
              if (!that.upload.arrFiles) that.upload.arrFiles = [];
              if (!that.upload.arrFiles[index]) {
                this.$set(that.upload.arrFiles, index, []);
              }

              res.data.files.forEach(element => {
                that.upload.arrFiles[index].push(element);
              });
              this.$forceUpdate()
            }
          }
        } catch (ex) {
          console.log(ex);
        };
      }
      return false;
    },
    preview (file) {
      var that = this;
      window.open(file.viewurl)
      that.upload.fileShow = true
      that.upload.preview_url = file.url;
      that.upload.preview_visible = true;
    },
  },
  created: function () {
    var that = this;

  },
  mounted () {
    var that = this;

  },
}
