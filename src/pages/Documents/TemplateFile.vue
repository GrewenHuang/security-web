<!--
 * @Description:
 * @Date: 2020-11-28 11:02:29
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-18 17:29:26
 * @FilePath: \zt-traffic-enterprise-view\src\pages\Documents\TemplateFile.vue
-->
<template>
  <el-scrollbar class="scrollbar" v-loading="loading" element-loading-text="拼命加载中">
    <div>
        <!-- 条件栏 开始 -->
        <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
          <el-form :inline="true" v-model="filters">
            <el-form-item>
              <el-input v-model="filters.Name" placeholder="名称" style="min-width: 200px;width: 300px"></el-input>
              <el-button type="primary" plain icon="el-icon-search" @click="handleSearch()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col> -->
        <!-- 条件栏 结束 -->

        <!--列表 开始-->
        <el-table :data="list"
                :header-cell-style="$tableStyle"
                v-loading="loading"
                style="width: 100%;"
            >
          <el-table-column label="序号"
                           type="index"
                           align="center"
                           header-align="center"
                           width="60">
          </el-table-column>
          <el-table-column label="名称"
                           prop="FileName">
          </el-table-column>
          <el-table-column width="100"
                           align="center"
                           header-align="center"
                           label="类型"
                           prop="Classify">
          </el-table-column>
          <el-table-column width="100"
                           align="center"
                           header-align="center"
                           label="大小">
            <template slot-scope="scope">
              {{ scope.row.FileSize | formatSize }}
            </template>
          </el-table-column>
          <el-table-column width="100"
                           align="center"
                           header-align="center"
                           label="后缀"
                           prop="Ext">
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           header-align="center"
                           width="200">
            <template slot-scope="scope">
              <a class="target"
                 :href="ViewUrl(scope.row.FileUrl,scope.row.Classify)"
                 target="_blank">
                <el-button type='text'>查看</el-button>
              </a>
              <a class="target" :href="scope.row.FileUrl" target="_blank"><el-button type="text">下载</el-button></a>
            </template>
          </el-table-column>
        </el-table>
        <!-- 列表 结束 -->
    </div>

  </el-scrollbar>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";

export default {
  name: "TemplateFile",
  components: {},
  mixins: [request_mixin],
  data () {
    return {
      loading: false, //页面加载遮罩层显示状态
      //查询条件
      filters: {
        FileName: "",

        FolderId: 0,
      },
      list: [],
    };
  },
  //自定义方法
  methods: {
    //接收参数
    ReceiveParameter (FolderId, FileName) {
      let that = this;
      that.filters.FolderId = FolderId;
      that.filters.FileName = FileName;
      this.GetList();
    },
    clearValue () {
      let that = this;
      that.list = [];
    },
    ViewSize (limit) {
      var size = "";
      if (limit < 0.1 * 1024) {
        //小于0.1KB，则转化成B
        size = limit.toFixed(2) + " B";
      } else if (limit < 0.1 * 1024 * 1024) {
        //小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + " KB";
      } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        //小于0.1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + " MB";
      } else {
        //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + " GB";
      }

      var sizeStr = size + ""; //转成字符串
      var index = sizeStr.indexOf("."); //获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
      if (dou == "00") {
        //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
      }
      return size;
    },
    ViewUrl (url, classify) {

      if (classify.toUpperCase() == "image".toUpperCase()) {
        //图片
        return url;
      } else if (classify.toUpperCase() == "file".toUpperCase()) {
        //文档
        url = escape(url);
        return "https://view.officeapps.live.com/op/view.aspx?src=" + url;
      }
    },
    //加载列表数据
    GetList () {
      let that = this;
      that.loading = true;
      that.Get("/GetTemplateFiles", that.filters).then(
        function (result) {
          that.loading = false;
          if (result && result.status == 2000) {
            that.list = result.data;
          }
        },
        function (err) {
          that.loading = false;
          that.$message.error({
            showClose: true,
            message: err.toString(),
            duration: 2000,
          });
        }
      );
    },
  },
  //页面初始化加载事件
  mounted () {
    let that = this;
  },
};
</script>
<style scoped>
</style>
