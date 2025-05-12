<!--
 * @Description:
 * @Date: 2020-11-28 11:02:29
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-27 16:38:09
 * @FilePath: \zt-traffic-enterprise-view\src\pages\Documents\FileRecord.vue
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
            <el-table :data="pages.list"
                    :header-cell-style="$tableStyle"
                    v-loading="loading"
                    style="width: 100%"
                >
                <el-table-column label="序号"
                    type="index"
                    align="center"
                    width="60"
                >
                </el-table-column>
                <el-table-column
                    label="日期"
                    show-overflow-tooltip
                    width="180"
                    align="center"
                    prop="OperationDateDesc"
                ></el-table-column>
                <el-table-column
                    label="操作内容"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.ModifyDelete == 1">
                            修改前:
                            <div v-for="item in scope.row.PreAttachmentFiles" :key="item.id">
                                {{ item.name }}
                                <el-button type="text" @click="viewFile(item.url)">查看</el-button>
                                <el-button type="text" @click="downFile(item.id, item.url, item.name, item.ext)">下载</el-button>
                            </div>
                            修改后:
                        </div>
                        <div v-for="item in scope.row.AttachmentFiles" :key="item.id">
                            {{ item.name }}
                            <el-button type="text" @click="viewFile(item.viewurl)">查看</el-button>
                            <el-button type="text" @click="downFile(item.id, item.url, item.name, item.ext)">下载</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作类型"
                    width="100"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{ updateTypeObj[row.ModifyDelete] }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作人"
                    prop="UpdateByName"
                    width="120"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="操作时间"
                    prop="UpdateTime"
                    width="180"
                    align="center"
                ></el-table-column>
            </el-table>
            <!-- 列表 结束 -->

            <!--分页 开始-->
            <div class="f-e-c" style="margin-top: 20px;">
                <el-pagination layout="total, prev, pager, next"
                    background
                    @current-change="handleCurrentChange"
                    :page-size="pages.rows"
                    :total="pages.total"
                    class="customPagination"
                >
                </el-pagination>
            </div>
        <!-- 分页 结束 -->
        </div>
    </el-scrollbar>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import formatter_mixin from "@/mixins/formatter-mixin.js";
import page_mixin from "@/mixins/page-minxin.js";
import axios from "axios";

export default {
  name: "FileRecord",
  components: {},
  mixins: [request_mixin, formatter_mixin, page_mixin],
  data () {
    return {
      loading: false, //页面加载遮罩层显示状态
      //分页
      pages: { list: [], total: 0, page: 1, rows: 10 },
      //查询条件
      filters: {
        FolderId: 0,
      },
      updateTypeObj: {
        0: '新增',
        1: '修改',
        2: '删除'
      }
    };
  },
  //自定义方法
  methods: {
    viewFile (url) {

      window.open(url);
    },
    downFile (id, url, name, ext) {
      axios({
        method: "get",
        url: process.env.API_ROOT + "/downattachment?AttachmentId=" + id,
        responseType: "blob",
        headers: {
          ttoken: window.localStorage.ttoken,
        },
        timeout: 60000,
      })
        .then((res) => {
          const link = document.createElement("a");
          const blob = new Blob([res.data]);
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          this.$alert("下载失败,请稍后重试", "提示");
        });
    },
    //接收参数
    ReceiveParameter (FolderId) {
      let that = this;
      that.filters.FolderId = FolderId;
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

    ShowDesc (ModifyDelete) {

      if (ModifyDelete == 0) {
        return "新增";
      } else if (ModifyDelete == 1) {
        return "修改";
      }
      else if (ModifyDelete == 2) {
        return "删除";
      }
      return "";
    },
    //加载列表数据
    GetList () {
      let that = this;
      let params = Object.assign(
        {
          page: that.pages.page,
          rows: that.pages.rows,
        },
        that.filters
      );

      that.loading = true;
      that.Post("/GetFileRecords", params).then(
        function (result) {
          that.loading = false;
          if (result && result.status == 2000) {
            that.pages.list = result.data.list;
            that.pages.total = result.data.count;
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
};
</script>
<style scoped>
.title {
  color: slategrey;
  font-style: oblique;
}
</style>
