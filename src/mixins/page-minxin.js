/*
 * @Description:
 * @Date: 2020-12-03 15:28:37
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-03 15:37:39
 * @FilePath: \zt-traffic-enterprise-view\src\mixins\page-minxin.js
 */


export default {
  data() {
    return {
      pages: { list: [], total: 0, page: 1, rows: 20 },
    }
  },
  methods: {
    //分页事件
    handleCurrentChange(val) {
      let that = this;
      that.pages.page = val;
      that.GetList();
    },
    //搜索事件
    handleSearch() {
      let that = this;
      that.pages.page = 1;
      that.GetList();
    },
  },
  created: function () {
    var that = this;
  },
  mounted() {
    var that = this;


  },
}
